#!/usr/bin/env node
// Uso: npm run qa -- E1   → comprueba guion y tiempos contra las normas de CLAUDE.md
import fs from "node:fs";
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
  // Tiempo de lectura de rótulos (docs/guia-visual.md: ≥0,3 s por palabra, mínimo 1 s)
  d.escenas.forEach((e, i, arr) => {
    if (!e.titulo) return;
    const dur = (arr[i + 1]?.inicio ?? d.duracion) - e.inicio, min = Math.max(1, 0.3 * e.titulo.trim().split(/\s+/).length);
    if (dur < min) A(`Escena ${i + 1}: el rótulo «${e.titulo}» dura ${dur.toFixed(1)} s y necesita ≥${min.toFixed(1)} s para leerse.`);
  });
} else A("No hay tiempos todavía: ejecuta npm run voz -- " + id);

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

console.log(`QA ${id}: ${nPal} palabras`);
fallos.forEach((m) => console.log("  ✗ FALLO:", m));
avisos.forEach((m) => console.log("  ! aviso:", m));
if (!fallos.length && !avisos.length) console.log("  ✓ Todo correcto");
process.exit(fallos.length ? 1 : 0);
