#!/usr/bin/env node
// Uso: npm run qa -- E1   → comprueba guion y tiempos contra las normas de CLAUDE.md
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { carpetaVideo, raiz as _raiz } from "./rutas.mjs";

const id = process.argv[2];
if (!id) { console.error("Falta el id. Ej: npm run qa -- E1"); process.exit(1); }
const raiz = _raiz;
const g = JSON.parse(fs.readFileSync(path.join(carpetaVideo(id), "guion.json"), "utf8"));
const dPath = path.join(raiz, "public/datos", `${id}.json`);
const d = fs.existsSync(dPath) ? JSON.parse(fs.readFileSync(dPath, "utf8")) : null;

const fallos = [], avisos = [];
const F = (m) => fallos.push(m), A = (m) => avisos.push(m);

if (g.escenas[0]?.tipo !== "gancho") F("La primera escena debe ser un gancho.");
if (g.escenas.at(-1)?.tipo !== "cierre") A("La última escena debería ser un cierre (loop/compartir).");
const primera = g.escenas[0]?.texto ?? "";
if (primera.split(/\s+/).length > 14) A("Gancho demasiado largo (>14 palabras): debe entenderse en 3 s.");
if (!/\b(tu|tú|te|tus|tuyo|haces|tienes)\b/i.test(primera)) A("El gancho no menciona a la persona (tú/tu/tus…). Empieza por el espectador.");

const todo = g.escenas.map((e) => e.texto).join(" ");
const nPal = todo.split(/\s+/).length;
if (nPal < 70) A(`Solo ${nPal} palabras: saldrá <30 s. Objetivo 85–120.`);
if (nPal > 130) A(`${nPal} palabras: saldrá >45 s. Recorta.`);

g.escenas.forEach((e, i) => {
  if (e.tipo === "cifra" && !e.fuente) F(`Escena ${i + 1}: cifra sin fuente visible.`);
  if (e.tipo === "cifra" && !e.cifra) F(`Escena ${i + 1}: tipo cifra sin campo "cifra".`);
  if (e.tipo === "lista" && !(e.items?.length >= 2)) F(`Escena ${i + 1}: lista con menos de 2 items.`);
  if (e.tipo === "lista" && e.items?.length > 5) A(`Escena ${i + 1}: lista de más de 5 items.`);
});
if (!g.fuentes?.length) A('Falta "fuentes": lista de URLs de donde sale cada dato (verifica a mano).');
if (!g.verificado) A('"verificado": false → comprueba cada dato en su fuente y pon true.');
if (g.nicho === "mascotas" && /\b(cura|diagnóstico|medicina|dosis|toxicidad)\b/i.test(todo)) A("Contenido de salud animal: añade 'consulta al veterinario' y cita fuente veterinaria.");
if (/\b(garantizado|seguro que|100%|sin riesgo)\b/i.test(todo)) A("Lenguaje absoluto: suaviza o respalda con fuente.");

if (d) {
  if (d.duracion < 25) A(`Duración ${d.duracion}s (<25).`);
  if (d.duracion > 48) A(`Duración ${d.duracion}s (>48).`);
  d.escenas.forEach((e, i, arr) => {
    const dur = (arr[i + 1]?.inicio ?? d.duracion) - e.inicio;
    if (dur > 7 && e.tipo !== "lista") A(`Escena ${i + 1} dura ${dur.toFixed(1)} s: sin cambio visual >7 s. Divídela.`);
  });
  if (!d.voz) A("Sin audio: datos simulados. No publicar.");
  // Rótulos: nada menos de 0,8 s en pantalla (fallo); y ≥0,3 s por palabra para leerse (aviso)
  d.escenas.forEach((e, i, arr) => {
    if (!e.titulo) return;
    const dur = (arr[i + 1]?.inicio ?? d.duracion) - e.inicio, pal = e.titulo.trim().split(/\s+/).length;
    if (dur < 0.8) F(`Escena ${i + 1}: el rótulo «${e.titulo}» está ${dur.toFixed(2)} s en pantalla (mínimo 0,8 s).`);
    else if (dur < 0.3 * pal) A(`Escena ${i + 1}: el rótulo «${e.titulo}» (${pal} palabras) dura ${dur.toFixed(1)} s; para leerse necesita ≥${(0.3 * pal).toFixed(1)} s.`);
  });
} else A("No hay tiempos todavía: ejecuta npm run voz -- " + id);

// Silencios de la voz: ninguno de más de 0,26 s (ritmo apretado). Se miden en el audio, no en los tiempos estimados.
// Las pausas declaradas con "pausa" en una escena del guion son intencionadas y quedan exentas.
const vozMp3 = path.join(raiz, `public/voz/${id}.mp3`);
if (!g.mudo && fs.existsSync(vozMp3)) {
  const sd = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", vozMp3, "-af", "silencedetect=n=-40dB:d=0.261", "-f", "null", "-"], { encoding: "utf8" });
  const ini = [...sd.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]), fin = [...sd.stderr.matchAll(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
  const total = parseFloat(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vozMp3], { encoding: "utf8" }).stdout);
  const decl = d ? d.escenas.filter((e) => e.pausa).map((e) => [e.fin - 0.4, e.fin + e.pausa + 0.4]) : [];
  ini.forEach((s0, k) => {
    const dur = fin[k]?.[1] ?? total - s0;
    if (s0 < 0.1 || s0 + dur > total - 0.1) return; // principio y final del audio
    if (decl.some(([a, b]) => s0 >= a && s0 <= b)) return;
    const cerca = d?.palabras?.filter((p) => p.end <= s0 + 0.05).slice(-3).map((p) => p.w).join(" ");
    A(`Silencio de ${dur.toFixed(2)} s en la voz a los ${s0.toFixed(1)} s${cerca ? ` (tras «${cerca}»)` : ""}: máximo 0,26 s. Recórtalo o declara «pausa» en esa escena si es intencionado.`);
  });
}

// Sonido (docs/sonido.md): reglas de dirección + anclas que no existen (fallarían en el render)
const sonPath = path.join(carpetaVideo(id), "sonido.json");
if (fs.existsSync(sonPath)) {
  const son = JSON.parse(fs.readFileSync(sonPath, "utf8"));
  const efs = son.efectos ?? [];
  if (!efs.some((x) => x.silencio)) A("sonido.json sin ningún «silencio»: añade uno justo antes o después del momento clave (docs/sonido.md).");
  if (!efs.some((x) => x.nombre && x.bucle)) A("sonido.json sin ambiente (efecto con bucle) que dé continuidad a la voz.");
  const nombres = new Set(); // recetas = claves de tools/sonido.mjs y sonido-cepillado.mjs + sonidos propios del vídeo
  for (const f of ["sonido.mjs", "sonido-cepillado.mjs"]) for (const m of fs.readFileSync(path.join(raiz, "tools", f), "utf8").matchAll(/(?:^|[\s,{])([A-Za-z][A-Za-z0-9_]*)\s*[:(]/gm)) nombres.add(m[1]);
  const propios = path.join(carpetaVideo(id), "sonido");
  if (fs.existsSync(propios)) for (const f of fs.readdirSync(propios)) nombres.add(f.replace(/\.[^.]+$/, ""));
  const norm = (x) => x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();
  const buscar = (ref) => {
    if (typeof ref === "number") return g.escenas[ref];
    const [vis, n = "1"] = String(ref).split("#"); let c = 0;
    return g.escenas.find((e) => e.visual === vis && ++c === Number(n));
  };
  for (const x of efs) {
    if (x.nombre && !nombres.has(x.nombre)) A(`sonido.json: el efecto «${x.nombre}» no es una receta ni hay archivo propio en videos/…/sonido/.`);
    for (const k of ["inicio", "fin"]) {
      const an = x[k]; if (!an || an.escena === undefined) continue;
      const esc = buscar(an.escena);
      if (!esc) { F(`sonido.json: ${k} apunta a la escena ${JSON.stringify(an.escena)}, que no existe.`); continue; }
      if (an.palabra && !norm(esc.texto ?? "").split(" ").includes(norm(an.palabra))) F(`sonido.json: «${an.palabra}» no está en el texto de la escena ${JSON.stringify(an.escena)}.`);
    }
  }
}

// Formato fijo (docs/formato.md): guion con "formato": "fijo" y cada escena con "bloque".
if (g.formato === "fijo") {
  const esc = (d?.escenas ?? g.escenas), bl = (b) => esc.find((e) => e.bloque === b);
  for (const b of ["gancho", "reencuadre", "cifras", "giro", "cta"]) if (!bl(b)) F(`formato fijo: falta el bloque «${b}».`);
  const re = bl("reencuadre"); if (re && re.inicio !== undefined && re.inicio > 6) F(`formato fijo: el reencuadre empieza en ${re.inicio.toFixed(1)} s (debe ser antes de 6 s).`);
  if (!bl("dentro") && !bl("analogia")) A("formato fijo: no hay bloque «dentro» ni «analogia»: ¿se ve el mecanismo?");
  if (esc.filter((e) => e.cifras?.length).reduce((n, e) => n + e.cifras.length, 0) < 2) F("formato fijo: menos de 2 cifras declaradas (campo «cifras» en las escenas).");
  if (!esc.some((e) => e.claves?.length)) A("formato fijo: ninguna palabra clave en recuadro (campo «claves»).");
  const dur = d?.duracion; if (dur && (dur < 45 || dur > 62)) A(`formato fijo: dura ${dur.toFixed(1)} s (objetivo 45–60 s).`);
}

console.log(`QA ${id}: ${nPal} palabras`);
fallos.forEach((m) => console.log("  ✗ FALLO:", m));
avisos.forEach((m) => console.log("  ! aviso:", m));
if (!fallos.length && !avisos.length) console.log("  ✓ Todo correcto");
process.exit(fallos.length ? 1 : 0);
