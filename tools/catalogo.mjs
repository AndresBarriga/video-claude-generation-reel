#!/usr/bin/env node
// Uso: npm run catalogo [página] → out/catalogo.png (todas las páginas del kit en una hoja) o out/catalogo-<n>.png
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const raiz = path.resolve(import.meta.dirname, ".."), N = 8, solo = process.argv[2];
fs.mkdirSync(path.join(raiz, "out"), { recursive: true });
const extra = process.env.BROWSER_EXE ? ["--browser-executable", process.env.BROWSER_EXE] : [];
const pags = solo !== undefined ? [Number(solo)] : Array.from({ length: N }, (_, i) => i);
for (const i of pags) {
  const r = spawnSync("npx", ["remotion", "still", "src/index.ts", "Reel", `out/catalogo-${i}.png`, `--frame=${i * 30 + 5}`, `--props=${JSON.stringify({ id: "_catalogo" })}`, ...extra], { cwd: raiz, stdio: ["ignore", "ignore", "inherit"] });
  if (r.status) process.exit(r.status);
}
if (solo === undefined) {
  spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-start_number", "0", "-i", "out/catalogo-%d.png", "-vf", "scale=540:-1,tile=4x2:padding=8:color=0x0B111A", "-frames:v", "1", "out/catalogo.png"], { cwd: raiz, stdio: "inherit" });
  console.log("out/catalogo.png");
}
