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
  fs.copyFileSync(path.join(raiz, `out/${id}.mp4`), path.join(carpetaVideo(id), "final.mp4"));
}
process.exit(r.status ?? 1);
