#!/usr/bin/env node
// Uso: npm run fotograma -- E15 3.5  → out/E15-3.5.png (imagen fija para storyboard)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const [id, seg = "1"] = process.argv.slice(2);
if (!id) { console.error("Ej: npm run fotograma -- E15 3.5"); process.exit(1); }
const raiz = path.resolve(import.meta.dirname, "..");
// CLI de Remotion con node (no "npx": en Windows spawnSync("npx") falla sin aviso)
const remotionCli = path.join(raiz, "node_modules/@remotion/cli/remotion-cli.js");
fs.mkdirSync(path.join(raiz, "out"), { recursive: true });
const frame = Math.round(parseFloat(seg) * 30);
const extra = process.env.BROWSER_EXE ? ["--browser-executable", process.env.BROWSER_EXE] : [];
const r = spawnSync(process.execPath, [remotionCli, "still", "src/index.ts", "Reel", `out/${id}-${seg}.png`, `--frame=${frame}`, `--props=${JSON.stringify({ id })}`, ...extra], { cwd: raiz, stdio: "inherit" });
process.exit(r.status ?? 1);
