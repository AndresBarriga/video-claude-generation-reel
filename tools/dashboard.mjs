// Genera docs/dashboard.html (un solo archivo, interactivo) desde datos/ y docs/.
// Uso: npm run dashboard
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, num } from './csv.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const R = (p) => path.join(process.cwd(), p);
const read = (p) => (fs.existsSync(R(p)) ? fs.readFileSync(R(p), 'utf8') : '');
const NUMK = ['vistas', 'espectadores', 'visto_medio_s', 'duracion_s', 'skip_pct', 'envios', 'guardados', 'likes', 'comentarios', 'reposts', 'visitas_perfil', 'seguidores'];

// Mediciones
const rows = parseCsv(read('datos/publicados.csv')).rows.map((r) => {
  const o = { video: r.video, titulo: r.titulo, formato: r.formato, estilo: r.estilo, subido: r.subido, medido: r.medido, notas: r.notas };
  for (const k of NUMK) o[k] = num(r[k]);
  return o;
});

// Estado de cada vídeo según su ficha
const estados = {};
const dir = R('videos/escalada');
if (fs.existsSync(dir)) for (const id of fs.readdirSync(dir)) {
  const m = read(`videos/escalada/${id}/ficha.md`).match(/\*\*Estado:\*\*\s*(.+)/);
  if (m) estados[id] = m[1].trim();
}

// Hipótesis (docs/aprendizajes.md)
const ids = (s) => [...new Set(s.match(/\bE\d+[A-Z]?(?:-[A-Z])?\b/g) || [])];
const hipotesis = read('docs/aprendizajes.md').split('\n').filter((l) => /^\|\s*H\d+/.test(l)).map((l) => {
  const c = l.split('|').slice(1, -1).map((s) => s.trim());
  return { id: c[0], h: c[1], fav: c[2], con: c[3], ref: c[4], estado: c[5].split('(')[0].trim(), estadoNota: (c[5].match(/\((.+)\)/) || [])[1] || '', favIds: ids(c[2]), conIds: ids(c[3]) };
});

// Cola de producción e ideas (docs/ideas/escalada.md)
const resumen = (read('docs/ideas/escalada.md').match(/## Resumen de estado[^\n]*\n([\s\S]*?)\n## /) || [])[1] || '';
const bloques = [...resumen.matchAll(/\*\*(.+?):\*\*\s*(.+)/g)].map((m) => ({ k: m[1], v: m[2] }));
const cola = (bloques.find((b) => /Cola/i.test(b.k))?.v || '').split(/\s·\s(?=\d\)\s)/).map((s) => s.replace(/^\d\)\s*/, '').trim()).filter(Boolean);

// Archivos de vídeo disponibles (relativos a docs/)
const archivos = {};
const allIds = new Set([...rows.map((r) => r.video), ...Object.keys(estados), ...Object.keys(JSON.parse(read('datos/videos.json') || '{}')), ...(JSON.parse(read('datos/plan.json') || '{"candidatos":[]}').candidatos || []).map((c) => c.id)]);
for (const id of allIds) {
  const L = [];
  if (fs.existsSync(R(`previews/${id}.mp4`))) L.push({ label: 'Vista previa (ligera)', href: `../previews/${id}.mp4`, kind: 'preview' });
  const d = R(`videos/escalada/${id}`);
  if (fs.existsSync(d)) for (const f of fs.readdirSync(d).filter((f) => /^final.*\.mp4$/.test(f))) L.push({ label: f === 'final.mp4' ? 'Final (calidad completa)' : f.replace(/\.mp4$/, ''), href: `../videos/escalada/${id}/${f}`, kind: 'final' });
  if (L.length) archivos[id] = L;
}

const data = {
  generado: new Date().toISOString(),
  rows, estados, hipotesis, cola,
  ideas: bloques.filter((b) => !/Cola/i.test(b.k)),
  pruebas: JSON.parse(read('datos/pruebas.json') || '{}'),
  cuenta: JSON.parse(read('datos/cuenta.json') || '{}'),
  videos: JSON.parse(read('datos/videos.json') || '{}'),
  criterios: JSON.parse(read('datos/criterios.json') || '{}'),
  notas: JSON.parse(read('datos/notas-critico.json') || '{}'),
  plan: JSON.parse(read('datos/plan.json') || '{}'),
  archivos,
};

const css = fs.readFileSync(path.join(here, 'dashboard.css'), 'utf8');
const js = fs.readFileSync(path.join(here, 'dashboard-cliente.js'), 'utf8');
const json = JSON.stringify(data).replace(/</g, '\\u003c');

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>@ultimo.pegue · Dashboard</title><style>${css}</style></head><body>
<header class="top"><div><h1>@ultimo.pegue</h1><div class="sub" id="fresh"></div></div><nav class="nav"><button data-tab="panel" class="on">Panel</button><button data-tab="plan">Plan de publicación</button><button data-tab="crit">Criterios de viralidad</button></nav><div class="kpis" id="kpis"></div></header>
<main>
<div id="pg-panel">
<section><h2>Qué hacer ahora <small>sale de las hipótesis, los vídeos y la cola</small></h2><div id="acciones"></div></section>
<section><h2>Hipótesis <small>lo que estamos validando, por qué importa y con qué calidad podemos validarlo</small></h2>
<div id="hmap"></div><div class="bar2" id="hfiltros"></div><div class="hgrid" id="hip"></div></section>
<section><h2>Vídeos</h2><div class="bar2" id="vfiltros"></div><div class="tw"><table id="vt"></table></div></section>
<section class="two"><div><h2>Añadir o corregir una medición <small>vista previa</small></h2><div id="form"></div></div>
<div><h2>Cambios pendientes de guardar</h2><div id="cambios"></div></div></section>
<section><h2>Audiencia y cuenta</h2><div class="g3" id="aud"></div></section>
<section><h2>Cola e ideas</h2><div id="ideas"></div></section>
</div>
<div id="pg-plan" hidden></div>
<div id="pg-crit" hidden></div>
<footer class="sub">Fuentes: datos/publicados.csv · datos/cuenta.json · datos/pruebas.json · datos/videos.json · datos/criterios.json · datos/notas-critico.json · datos/plan.json · docs/aprendizajes.md · docs/viralidad.md · docs/ideas/escalada.md · fichas · Regenerar: <code>npm run dashboard</code> · Medir: <code>npm run medir -- E15 vistas=… seg=…</code></footer>
</main>
<aside id="drawer" class="drawer" hidden></aside>
<script type="application/json" id="data">${json}</script>
<script>${js}</script></body></html>`;

fs.writeFileSync(R('docs/dashboard.html'), html);
console.log(`docs/dashboard.html ${(html.length / 1024).toFixed(0)} KB · ${new Set(rows.map((r) => r.video)).size} vídeos · ${hipotesis.length} hipótesis · cola ${cola.length}`);
