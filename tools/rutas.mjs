import fs from "node:fs";
import path from "node:path";
export const raiz = path.resolve(import.meta.dirname, "..");
/** Busca videos/<nicho>/<id> o videos/<id> */
export function carpetaVideo(id) {
  const base = path.join(raiz, "videos");
  const directa = path.join(base, id);
  if (fs.existsSync(path.join(directa, "guion.json"))) return directa;
  for (const n of fs.readdirSync(base)) {
    const c = path.join(base, n, id);
    if (fs.existsSync(path.join(c, "guion.json"))) return c;
  }
  console.error(`No encuentro videos/*/${id}/guion.json`); process.exit(1);
}
