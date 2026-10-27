#!/usr/bin/env node
// Uso: npm run qa -- E1   → comprueba guion y tiempos contra las normas de CLAUDE.md
import fs from "node:fs";
import path from "node:path";
import { carpetaVideo } from "./rutas.mjs";

const id = process.argv[2];
if (!id) { console.error("Falta el id. Ej: npm run qa -- E1"); process.exit(1); }
const raiz = path.resolve(import.meta.dirname, "..");
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
} else A("No hay tiempos todavía: ejecuta npm run voz -- " + id);

console.log(`QA ${id}: ${nPal} palabras`);
fallos.forEach((m) => console.log("  ✗ FALLO:", m));
avisos.forEach((m) => console.log("  ! aviso:", m));
if (!fallos.length && !avisos.length) console.log("  ✓ Todo correcto");
process.exit(fallos.length ? 1 : 0);
