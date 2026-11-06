#!/usr/bin/env node
// Uso: npm run qa-final -- E35      → revisa videos/*/E35/final.mp4
//      npm run qa-final -- ruta.mp4 → revisa cualquier mp4
// Comprueba el archivo YA renderizado: formato, duración, volumen real (LUFS / pico), fotogramas negros y audio.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { carpetaVideo } from "./rutas.mjs";

const arg = process.argv[2];
if (!arg) { console.error("Falta el id o la ruta. Ej: npm run qa-final -- E35"); process.exit(1); }
const archivo = arg.endsWith(".mp4") ? path.resolve(arg) : path.join(carpetaVideo(arg), "final.mp4");
if (!fs.existsSync(archivo)) { console.error(`No existe ${archivo}. Renderiza antes: npm run render -- ${arg}`); process.exit(1); }

const run = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const fallos = [], avisos = [];
const F = (m) => fallos.push(m), A = (m) => avisos.push(m);

// 1) Formato y duración
const pr = run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", archivo]);
if (pr.status !== 0) { console.error("ffprobe falló:", pr.stderr); process.exit(1); }
const info = JSON.parse(pr.stdout);
const v = info.streams.find((s) => s.codec_type === "video"), a = info.streams.find((s) => s.codec_type === "audio");
const dur = parseFloat(info.format.duration);
if (!v) F("No hay pista de vídeo.");
else {
  if (v.width !== 1080 || v.height !== 1920) F(`Resolución ${v.width}×${v.height}; debe ser 1080×1920.`);
  const [n, d] = v.r_frame_rate.split("/").map(Number);
  if (Math.abs(n / d - 30) > 0.1) A(`${(n / d).toFixed(2)} fps; el estándar es 30.`);
}
if (!a) F("No hay pista de audio.");
if (dur < 25) A(`Dura ${dur.toFixed(1)} s (<25).`);
if (dur > 55) A(`Dura ${dur.toFixed(1)} s (>55).`);

// 2) Volumen real (mide, no corrige): EBU R128
let lufs = null, pico = null;
if (a) {
  const l = run("ffmpeg", ["-hide_banner", "-nostats", "-i", archivo, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"]);
  const m = l.stderr.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  if (m) {
    const j = JSON.parse(m[0]);
    lufs = parseFloat(j.input_i); pico = parseFloat(j.input_tp);
    if (!Number.isFinite(lufs)) F("Audio sin señal (volumen -inf): el vídeo está mudo.");
    else {
      if (Math.abs(lufs - -14) > 1.5) A(`Volumen ${lufs.toFixed(1)} LUFS; objetivo -14 (±1,5). ¿Se renderizó con npm run render?`);
      if (pico > -1) F(`Pico real ${pico.toFixed(1)} dBTP (>-1): puede distorsionar al subirlo a la red.`);
    }
  } else A("No pude medir el volumen.");
}

// 3) Fotogramas negros (incluye el primero: el gancho no puede abrir en negro)
const b = run("ffmpeg", ["-hide_banner", "-nostats", "-i", archivo, "-vf", "blackdetect=d=0.12:pix_th=0.10", "-an", "-f", "null", "-"]);
const negros = [...b.stderr.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)/g)].map((x) => [parseFloat(x[1]), parseFloat(x[2])]);
for (const [s, e] of negros) {
  if (s < 0.05) F(`Abre en negro hasta ${e.toFixed(2)} s: el primer fotograma debe ser el gancho.`);
  else if (e >= dur - 0.05) A(`Termina en negro desde ${s.toFixed(2)} s (¿el bucle empalma con el primer plano?).`);
  else A(`Negro entre ${s.toFixed(2)} y ${e.toFixed(2)} s (fotograma en blanco en una transición).`);
}

console.log(`QA FINAL ${path.basename(path.dirname(archivo))}/${path.basename(archivo)}: ${dur.toFixed(1)} s${v ? `, ${v.width}×${v.height}` : ""}${lufs !== null && Number.isFinite(lufs) ? `, ${lufs.toFixed(1)} LUFS, pico ${pico.toFixed(1)} dBTP` : ""}`);
fallos.forEach((m) => console.log("  ✗ FALLO:", m));
avisos.forEach((m) => console.log("  ! aviso:", m));
if (!fallos.length && !avisos.length) console.log("  ✓ Todo correcto");
process.exit(fallos.length ? 1 : 0);
