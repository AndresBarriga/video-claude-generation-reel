#!/usr/bin/env node
// Uso: npm run sonido -- E15
// Prepara los efectos de sonido de un vídeo en public/sonido/<id>/<nombre>.wav:
//   1) Si existe videos/<nicho>/<id>/sonido/<nombre>.(wav|mp3|m4a|ogg) → se usa ese archivo (sustituye al generado).
//   2) Si no, se sintetiza con código (recetas de abajo). Deterministas: mismo resultado cada vez.
// Qué suena y cuándo se decide en videos/<nicho>/<id>/sonido.json (ver docs/sonido.md).
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { carpetaVideo, raiz } from "./rutas.mjs";

const SR = 44100;

/* ---------- utilidades DSP ---------- */
function prng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) / 4294967296) * 2 - 1; }; }
const buf = (seg) => new Float32Array(Math.round(seg * SR));
/** Biquad RBJ. tipo: lp | hp | bp */
function biquad(x, tipo, f0, Q = 0.707) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const coef = (f) => {
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR, a = Math.sin(w) / (2 * Q), c = Math.cos(w);
    let b0, b1, b2; const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    if (tipo === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (tipo === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; }
    return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
  };
  let k = coef(typeof f0 === "function" ? f0(0) : f0);
  for (let i = 0; i < x.length; i++) {
    if (typeof f0 === "function" && i % 64 === 0) k = coef(f0(i / SR));
    const v = k[0] * x[i] + k[1] * x1 + k[2] * x2 - k[3] * y1 - k[4] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
const ruido = (n, seed) => { const r = prng(seed), b = new Float32Array(n); for (let i = 0; i < n; i++) b[i] = r(); return b; };
function ruidoMarron(n, seed) { const r = prng(seed), b = new Float32Array(n); let v = 0; for (let i = 0; i < n; i++) { v = (v + 0.02 * r()) * 0.998; b[i] = v * 8; } return b; }
const mezclar = (dst, src, en = 0, g = 1) => { const o = Math.round(en * SR); for (let i = 0; i < src.length && o + i < dst.length; i++) if (o + i >= 0) dst[o + i] += src[i] * g; return dst; };
const env = (b, f) => { for (let i = 0; i < b.length; i++) b[i] *= f(i / SR); return b; };
function normalizar(b, pico = 0.7) { let m = 0; for (const v of b) m = Math.max(m, Math.abs(v)); if (m > 0) for (let i = 0; i < b.length; i++) b[i] *= pico / m; return b; }
/** Sube el nivel medio (rms) y limita picos con saturación suave. */
function nivelar(b, rms = 0.12, techo = 0.8) { let q = 0; for (const v of b) q += v * v; const k = rms / Math.sqrt(q / b.length || 1); for (let i = 0; i < b.length; i++) b[i] = techo * Math.tanh((b[i] * k) / techo); return b; }
/** Hace un bucle sin salto: funde el último `x` s sobre el principio y recorta. */
function bucle(b, x = 1) {
  const n = Math.round(x * SR), out = b.slice(0, b.length - n);
  for (let i = 0; i < n; i++) { const t = i / n; out[i] = out[i] * t + b[b.length - n + i] * (1 - t); }
  return out;
}
function seno(seg, f, fase = 0) { const b = buf(seg); let ph = fase; for (let i = 0; i < b.length; i++) { const fr = typeof f === "function" ? f(i / SR) : f; ph += (2 * Math.PI * fr) / SR; b[i] = Math.sin(ph); } return b; }

/* ---------- recetas ---------- */
const RECETAS = {
  /** Viento de alta montaña con ráfagas (bucle 12 s). */
  viento() {
    const seg = 13, n = Math.round(seg * SR);
    const base = ruido(n, 11);
    const silbido = biquad(base, "bp", (t) => 500 + 280 * Math.sin(t * 0.7) + 160 * Math.sin(t * 1.9 + 1), 3.5);
    const cuerpo = biquad(biquad(ruidoMarron(n, 12), "lp", 500), "hp", 60);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / SR, rafaga = 0.55 + 0.3 * Math.sin(t * 0.9) + 0.2 * Math.sin(t * 2.3 + 2) + 0.1 * Math.sin(t * 5.1);
      out[i] = (silbido[i] * 0.9 + cuerpo[i] * 0.6) * Math.max(0.15, rafaga);
    }
    return normalizar(bucle(out, 1), 0.6);
  },
  /** Crujido de cuerda en tensión: fricción a golpes (bucle 4 s). */
  crujido() {
    const seg = 5, out = buf(seg), r = prng(21);
    let t = 0;
    while (t < seg) {
      // ráfaga de fricción: tren de pulsos a 40-120 Hz que se acelera y frena
      const dur = 0.25 + Math.abs(r()) * 0.6, f0 = 40 + Math.abs(r()) * 50, amp = 0.4 + Math.abs(r()) * 0.6;
      const tren = buf(dur);
      let ph = 0;
      for (let i = 0; i < tren.length; i++) {
        const u = i / tren.length, f = f0 * (1 + 1.4 * Math.sin(Math.PI * u));
        ph += f / SR;
        if (ph >= 1) { ph -= 1; tren[i] = 1; }
      }
      env(tren, (s) => Math.sin(Math.PI * Math.min(1, s / dur)) ** 0.7 * amp);
      const res = biquad(tren, "bp", 420 + Math.abs(r()) * 300, 9);
      const res2 = biquad(tren, "bp", 1300 + Math.abs(r()) * 500, 12);
      for (let i = 0; i < res.length; i++) res[i] = res[i] + res2[i] * 0.5;
      mezclar(out, res, t);
      t += dur + 0.05 + Math.abs(r()) * 0.4;
    }
    // fibras que saltan
    for (let k = 0; k < 14; k++) { const c = env(biquad(ruido(800, 30 + k), "hp", 2500), (s) => Math.exp(-s * 300)); mezclar(out, c, Math.abs(r()) * (seg - 0.1), 0.25); }
    return nivelar(bucle(out, 0.8), 0.11, 0.7);
  },
  /** Chasquido del corte: latigazo agudo + "twang" de cuerda + golpe sordo. */
  chasquido() {
    const out = buf(1.6);
    mezclar(out, env(biquad(ruido(Math.round(0.05 * SR), 41), "hp", 1800), (s) => Math.exp(-s * 90)), 0, 1.0);
    mezclar(out, env(biquad(ruido(Math.round(0.4 * SR), 42), "bp", 900, 1.2), (s) => Math.exp(-s * 18)), 0.005, 0.5);
    mezclar(out, env(seno(1.2, (t) => 170 * Math.exp(-t * 2) + 90), (s) => Math.exp(-s * 5)), 0.01, 0.45);
    mezclar(out, env(seno(0.5, (t) => 70 * Math.exp(-t * 4) + 40), (s) => Math.exp(-s * 12)), 0, 0.7);
    return normalizar(out, 0.9);
  },
  /** Golpe al caer en la grieta: impacto grave + nieve que se desmorona. */
  golpe() {
    const out = buf(2.2);
    mezclar(out, env(seno(1.2, (t) => 35 + 90 * Math.exp(-t * 9)), (s) => Math.exp(-s * 5)), 0, 1.0);
    mezclar(out, env(biquad(ruido(Math.round(0.12 * SR), 51), "lp", 700), (s) => Math.exp(-s * 40)), 0, 0.8);
    const nieve = biquad(biquad(ruido(Math.round(1.8 * SR), 52), "lp", 2500), "hp", 200);
    const r = prng(53);
    env(nieve, (s) => Math.exp(-s * 2.2) * (0.5 + 0.5 * Math.abs(r())));
    mezclar(out, nieve, 0.06, 0.25);
    return normalizar(out, 0.9);
  },
  /** Latido (bucle de 4 latidos a ~72 ppm). */
  latido() {
    const per = 60 / 72, out = buf(per * 4);
    const golpe = (f, dur, g) => env(seno(dur, (t) => f * (1 + 0.6 * Math.exp(-t * 30))), (s) => Math.sin(Math.PI * Math.min(1, s / dur)) * Math.exp(-s * 18) * g);
    for (let k = 0; k < 4; k++) { mezclar(out, golpe(52, 0.16, 1), k * per); mezclar(out, golpe(62, 0.13, 0.7), k * per + 0.26); }
    return normalizar(biquad(out, "lp", 180), 0.85);
  },
  /** Campamento: viento suave + fuego que crepita (bucle 10 s). */
  campamento() {
    const seg = 11, n = Math.round(seg * SR), out = new Float32Array(n);
    mezclar(out, biquad(biquad(ruidoMarron(n, 61), "lp", 250), "hp", 40), 0, 0.8); // llama
    const vt = biquad(ruido(n, 62), "bp", (t) => 380 + 120 * Math.sin(t * 0.5), 2.5);
    env(vt, (t) => 0.25 + 0.15 * Math.sin(t * 0.8));
    mezclar(out, vt, 0, 0.6);
    const r = prng(63);
    for (let k = 0; k < 110; k++) {
      const largo = 0.004 + Math.abs(r()) * 0.02, g = Math.abs(r()) ** 2;
      const c = env(biquad(ruido(Math.round(largo * SR) + 50, 64 + k), "bp", 1500 + Math.abs(r()) * 3000, 1.5), (s) => Math.exp(-s * (120 + Math.abs(r()) * 200)));
      mezclar(out, c, Math.abs(r()) * (seg - 0.1), 0.5 + g * 1.4);
    }
    return normalizar(bucle(out, 1), 0.6);
  },
  /** Roce de nieve cediendo (para el hoyo). */
  nieve() {
    const seg = 3, out = buf(seg), r = prng(71);
    for (let k = 0; k < 40; k++) {
      const d = 0.03 + Math.abs(r()) * 0.12;
      const c = env(biquad(ruido(Math.round(d * SR), 72 + k), "bp", 900 + Math.abs(r()) * 1800, 0.9), (s) => Math.sin(Math.PI * Math.min(1, s / d)));
      mezclar(out, c, Math.abs(r()) * (seg - d), 0.3 + Math.abs(r()));
    }
    return nivelar(bucle(out, 0.4), 0.1, 0.6);
  },
};

/* ---------- WAV ---------- */
function escribirWav(ruta, b) {
  const n = b.length, data = Buffer.alloc(44 + n * 2);
  data.write("RIFF", 0); data.writeUInt32LE(36 + n * 2, 4); data.write("WAVE", 8);
  data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write("data", 36); data.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) data.writeInt16LE(Math.max(-1, Math.min(1, b[i])) * 32767, 44 + i * 2);
  fs.writeFileSync(ruta, data);
}

/* ---------- principal ---------- */
const id = process.argv[2];
if (!id) { console.error("Ej: npm run sonido -- E15"); process.exit(1); }
const carpeta = carpetaVideo(id);
const cfgPath = path.join(carpeta, "sonido.json");
if (!fs.existsSync(cfgPath)) { console.log(`Sin sonido.json para ${id}: nada que hacer.`); process.exit(0); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const nombres = [...new Set((cfg.efectos ?? []).filter((e) => e.nombre).map((e) => e.nombre))];
const destino = path.join(raiz, "public/sonido", id);
fs.mkdirSync(destino, { recursive: true });
const propios = path.join(carpeta, "sonido");
for (const nombre of nombres) {
  const out = path.join(destino, `${nombre}.wav`);
  const propio = fs.existsSync(propios) && fs.readdirSync(propios).find((f) => path.parse(f).name === nombre);
  if (propio) {
    const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(propios, propio), "-ar", String(SR), "-ac", "1", out], { encoding: "utf8" });
    if (r.status !== 0) { console.error(`✗ ${nombre}: ffmpeg no pudo leer ${propio}: ${r.stderr}`); process.exit(1); }
    console.log(`  ${nombre}: archivo propio (${propio})`);
  } else if (RECETAS[nombre]) {
    escribirWav(out, RECETAS[nombre]());
    console.log(`  ${nombre}: generado`);
  } else {
    console.error(`✗ ${nombre}: no hay receta ni archivo en ${path.relative(raiz, propios)}/`); process.exit(1);
  }
}
console.log(`OK ${id}: ${nombres.length} efectos en public/sonido/${id}/`);
