#!/usr/bin/env node
// Uso: npm run hoja -- E15 [prefijo]  → out/<id>/escena-NN.png (un fotograma por escena, a 2/3 de la escena) + out/<id>-hoja.png
// Empaqueta una sola vez y renderiza todos los fotogramas: mucho más rápido que llamar a `fotograma` muchas veces.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const [id, momento = "0.66"] = process.argv.slice(2);
const raiz = path.resolve(import.meta.dirname, "..");
const datos = JSON.parse(fs.readFileSync(path.join(raiz, `public/datos/${id}.json`), "utf8"));
const salida = path.join(raiz, "out", id);
fs.rmSync(salida, { recursive: true, force: true });
fs.mkdirSync(salida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(raiz, "src/index.ts"), publicDir: path.join(raiz, "public") });
const browserExecutable = process.env.BROWSER_EXE || null;
const comp = await selectComposition({ serveUrl, id: "Reel", inputProps: { id }, browserExecutable });
const fps = datos.fps;
const extras = (process.env.MOMENTOS || "").split(",").filter(Boolean).map(Number);
const tiempos = datos.escenas.map((e, i) => {
  const ini = e.inicio ?? 0, fin = i === datos.escenas.length - 1 ? datos.duracion : datos.escenas[i + 1].inicio;
  return ini + (fin - ini) * parseFloat(momento);
});
const lista = [...tiempos, ...extras];
const archivos = [];
for (const [i, t] of lista.entries()) {
  const f = path.join(salida, `escena-${String(i + 1).padStart(2, "0")}.png`);
  await renderStill({ composition: comp, serveUrl, output: f, frame: Math.min(comp.durationInFrames - 1, Math.round(t * fps)), inputProps: { id }, browserExecutable });
  archivos.push(f);
}
// Hoja de contacto: miniaturas 270x480 en filas de 5
const cols = 5;
const inputs = archivos.flatMap((f) => ["-i", f]);
const filtros = archivos.map((_, i) => `[${i}:v]scale=270:480,drawtext=text='${i + 1}':x=10:y=10:fontsize=36:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`).join(";");
const layout = archivos.map((_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * 480}`).join("|");
const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", `${filtros};${archivos.map((_, i) => `[v${i}]`).join("")}xstack=inputs=${archivos.length}:layout=${layout}:fill=black[o]`, "-map", "[o]", path.join(raiz, "out", `${id}-hoja.png`)], { encoding: "utf8" });
if (r.status !== 0) console.error(r.stderr);
console.log(`OK ${archivos.length} fotogramas → out/${id}-hoja.png`);
