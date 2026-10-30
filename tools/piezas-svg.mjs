// Convierte un set de SVG (p. ej. public/piezas/E36/*.svg, hechos en Claude Design) en un módulo TS que usa <PiezaSvg>.
// Uso: node tools/piezas-svg.mjs E36   → src/piezas/svg/E36.ts
// Requisitos de los SVG: grupos con id (muslo_izq, antebrazo_der…), style "transform-origin:…;transform-box:view-box", caras cara_normal/cara_platos/cara_feliz.
import fs from "node:fs";
import path from "node:path";
const set = process.argv[2];
if (!set) { console.error("Falta el set. Ej: node tools/piezas-svg.mjs E36"); process.exit(1); }
const dir = path.join("public/piezas", set), out = path.join("src/piezas/svg", `${set}.ts`);
const piezas = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".svg")).sort()) {
  let s = fs.readFileSync(path.join(dir, f), "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/g, "");
  const vb = (s.match(/viewBox="([^"]+)"/) || [])[1];
  const inner = s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  piezas[f.replace(/\.svg$/, "")] = { viewBox: vb, inner };
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `// Generado por tools/piezas-svg.mjs desde ${dir}. No editar a mano.\nexport const PIEZAS: Record<string, { viewBox: string; inner: string }> = ${JSON.stringify(piezas)};\n`);
console.log(`OK ${set}: ${Object.keys(piezas).length} piezas → ${out}`);
