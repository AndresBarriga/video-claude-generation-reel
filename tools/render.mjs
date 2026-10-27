#!/usr/bin/env node
// Uso: npm run render -- E1  → out/E1.mp4 (1080x1920)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { carpetaVideo } from "./rutas.mjs";
const id = process.argv[2];
if (!id) { console.error("Falta el id. Ej: npm run render -- E1"); process.exit(1); }
const raiz = path.resolve(import.meta.dirname, "..");
fs.mkdirSync(path.join(raiz, "out"), { recursive: true });
// Efectos de sonido al día (generados o propios) antes de renderizar
spawnSync("node", [path.join(raiz, "tools/sonido.mjs"), id], { cwd: raiz, stdio: "inherit" });
const extra = process.env.BROWSER_EXE ? ["--browser-executable", process.env.BROWSER_EXE] : [];
const r = spawnSync("npx", ["remotion", "render", "src/index.ts", "Reel", `out/${id}.mp4`, `--props=${JSON.stringify({ id })}`, ...extra], { cwd: raiz, stdio: "inherit" });
if (r.status === 0) {
  // volumen estándar de redes (-14 LUFS); el vídeo se copia sin recodificar
  const n = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", `out/${id}.mp4`, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", path.join(carpetaVideo(id), "final.mp4")], { cwd: raiz, encoding: "utf8" });
  if (n.status !== 0) { console.error("loudnorm falló, copio sin normalizar:", n.stderr); fs.copyFileSync(path.join(raiz, `out/${id}.mp4`), path.join(carpetaVideo(id), "final.mp4")); }
}
process.exit(r.status ?? 1);
