#!/usr/bin/env node
// Radar de repos: busca en GitHub con consultas estrechas y puntúa con metadatos baratos.
// Uso: npm run radar                      (consultas de datos/radar.json, solo repos nuevos)
//      npm run radar -- "hook lint"       (consulta suelta)
//      npm run radar -- --todo            (incluye repos ya vistos)
// Necesita `gh` autenticado. No clona nada: solo decide qué merece 5 min de lectura.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ruta = path.join(raiz, "datos/radar.json");
const estado = fs.existsSync(ruta)
  ? JSON.parse(fs.readFileSync(ruta, "utf8"))
  : { consultas: [], vistos: {} };

const args = process.argv.slice(2);
const todo = args.includes("--todo");
const sueltas = args.filter((a) => !a.startsWith("--"));
const consultas = sueltas.length ? sueltas : estado.consultas;
if (!consultas.length) {
  console.error("Sin consultas: añade a datos/radar.json o pásalas como argumento.");
  process.exit(1);
}

const LIC_OK = new Set(["mit", "apache-2.0", "bsd-2-clause", "bsd-3-clause", "isc", "unlicense", "cc0-1.0"]);
const LIC_NO = new Set(["agpl-3.0", "gpl-3.0", "gpl-2.0", "lgpl-3.0"]);
const hoy = Date.now();
const dias = (iso) => Math.max(1, Math.round((hoy - Date.parse(iso)) / 864e5));

const filas = new Map();
for (const q of consultas) {
  const r = spawnSync(
    "gh",
    ["search", "repos", q, "--limit", "20", "--sort", "updated",
     "--json", "fullName,description,stargazersCount,forksCount,createdAt,pushedAt,license,isArchived,isFork"],
    { encoding: "utf8" },
  );
  if (r.status !== 0) { console.error(`✗ "${q}": ${r.stderr.trim().split("\n")[0]}`); continue; }
  for (const d of JSON.parse(r.stdout || "[]")) {
    if (d.isArchived || d.isFork || filas.has(d.fullName)) continue;
    const lic = d.license?.key ?? "none";
    const edad = dias(d.createdAt), push = dias(d.pushedAt);
    const s = d.stargazersCount, f = d.forksCount;
    const spd = s / edad, ratio = f / Math.max(s, 1);
    // Nota 0-5: licencia, frescura, uso real (forks/★) sin hype, tamaño plausible de herramienta.
    let n = 0; const av = [];
    if (LIC_OK.has(lic)) n += 2; else if (LIC_NO.has(lic) || lic === "other") av.push("solo ideas");
    else if (lic === "none") av.push("sin licencia");
    if (push <= 30) n += 1; else if (push > 120) av.push("parado");
    if (spd > 150 && edad < 120) av.push("hype");
    else if (s >= 2 && ratio >= 0.2) n += 1;
    if (edad >= 14 && s >= 2) n += 1;
    if (s === 0) { av.push("0★"); n = Math.min(n, 1); }
    if (s < 3 && edad < 14) n = Math.min(n, 2);
    filas.set(d.fullName, { q, n, s, f, ratio, edad, push, spd, lic, av, desc: (d.description ?? "").slice(0, 70) });
  }
}

const nuevos = [...filas].filter(([k]) => todo || !estado.vistos[k]);
nuevos.sort((a, b) => b[1].n - a[1].n || b[1].ratio - a[1].ratio);
console.log(`${nuevos.length} repos${todo ? "" : " nuevos"} de ${filas.size} (consultas: ${consultas.length})\n`);
console.log("nota repo | ★ forks f/★% edad(d) push(d) ★/d | licencia | avisos | qué es");
for (const [k, x] of nuevos.slice(0, 25)) {
  console.log(
    `${x.n}/5 ${k} | ${x.s} ${x.f} ${Math.round(x.ratio * 100)}% ${x.edad} ${x.push} ${x.spd.toFixed(1)} | ${x.lic} | ${x.av.join(",") || "-"} | ${x.desc}`,
  );
}
if (!sueltas.length) {
  for (const [k] of nuevos) estado.vistos[k] = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(ruta, JSON.stringify(estado, null, 2) + "\n");
}
console.log("\nLas estrellas no puntúan. Antes de copiar: árbol de ficheros + un ejemplo de salida real (5 min).");
