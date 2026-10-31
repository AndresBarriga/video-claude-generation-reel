// Genera docs/dashboard.html (autocontenido) a partir de datos/ y docs/.
// Uso: npm run dashboard  -> abre docs/dashboard.html en el navegador.
import fs from 'node:fs';
import path from 'node:path';

const R = (p) => path.join(process.cwd(), p);
const read = (p) => (fs.existsSync(R(p)) ? fs.readFileSync(R(p), 'utf8') : '');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
const fmt = (n, d = 0) => (n == null || isNaN(n) ? '–' : n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace('.', ',') + 'K' : n.toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d }));

// ---------- CSV ----------
function parseCsv(txt) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [h, ...b] = rows.filter((r) => r.length > 1);
  return b.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}
const num = (v) => (v === '' || v == null ? null : Number(String(v).replace(',', '.')));

// ---------- Vídeos: último dato por campo (relleno hacia delante) ----------
const rows = parseCsv(read('datos/publicados.csv')).sort((a, b) => a.medido.localeCompare(b.medido));
const vids = {};
for (const r of rows) {
  const v = (vids[r.video] ??= { id: r.video, hist: [] });
  v.titulo = r.titulo; v.formato = r.formato; v.estilo = r.estilo; v.subido = r.subido;
  for (const k of ['vistas', 'espectadores', 'skip_pct', 'envios', 'guardados', 'likes', 'comentarios', 'reposts', 'visitas_perfil', 'seguidores', 'duracion_s', 'visto_medio_s']) {
    const x = num(r[k]); if (x != null) v[k] = x;
  }
  v.medido = r.medido; v.horas = num(r.horas);
  v.hist.push({ t: r.medido, vistas: num(r.vistas), seg: num(r.seguidores) });
}
const lista = Object.values(vids).map((v) => ({
  ...v,
  segk: v.vistas && v.seguidores != null ? (v.seguidores / v.vistas) * 1000 : null,
  envk: v.vistas && v.envios != null ? (v.envios / v.vistas) * 1000 : null,
  visto: v.visto_medio_s && v.duracion_s ? (v.visto_medio_s / v.duracion_s) * 100 : null,
})).sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0));

// ---------- Fichas (estado de cada vídeo) ----------
const estados = {};
for (const area of ['escalada']) {
  const dir = R(`videos/${area}`);
  if (!fs.existsSync(dir)) continue;
  for (const id of fs.readdirSync(dir)) {
    const f = read(`videos/${area}/${id}/ficha.md`);
    const m = f.match(/\*\*Estado:\*\*\s*(.+)/);
    const t = f.match(/^#\s*(.+)/m);
    if (m) estados[id] = { estado: m[1].trim(), area, titulo: t?.[1] };
  }
}
const pub = (id) => /^publicado/i.test(estados[id]?.estado ?? '') || vids[id];
const sinPublicar = Object.entries(estados).filter(([id]) => !vids[id]);

// ---------- Hipótesis ----------
const hip = read('docs/aprendizajes.md').split('\n').filter((l) => /^\|\s*H\d+/.test(l)).map((l) => {
  const c = l.split('|').slice(1, -1).map((s) => s.trim());
  return { id: c[0], h: c[1], fav: c[2], con: c[3], ref: c[4], estado: c[5] };
});

// ---------- Resumen de estado de ideas ----------
const ideas = read('docs/ideas/escalada.md');
const resumen = (ideas.match(/## Resumen de estado[^\n]*\n([\s\S]*?)\n## /) || [])[1] || '';
const bloques = [...resumen.matchAll(/\*\*(.+?):\*\*\s*(.+)/g)].map((m) => ({ k: m[1], v: m[2] }));
const cola = (bloques.find((b) => /Cola/i.test(b.k))?.v || '').replace(/^\d\)\s*/, '').split(/\s·\s(?=\d\)\s)/).map((s) => s.replace(/^\d\)\s*/, '').trim()).filter(Boolean);

// ---------- Cuenta ----------
const cuenta = JSON.parse(read('datos/cuenta.json') || '{}');

// ---------- Test por formato ----------
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const porFormato = {};
for (const v of lista) (porFormato[v.formato] ??= []).push(v);

// ---------- Próximas mediciones a 7 días ----------
const hoy = new Date();
const prox = lista.filter((v) => v.subido).map((v) => {
  const d = new Date(v.subido.replace(' ', 'T') + ':00+01:00'); d.setDate(d.getDate() + 7);
  return { id: v.id, titulo: v.titulo, fecha: d, dias: Math.ceil((d - hoy) / 864e5) };
}).sort((a, b) => a.fecha - b.fecha);

// ---------- Pintar ----------
const maxV = Math.max(...lista.map((v) => v.vistas ?? 0), 1);
const maxS = Math.max(...lista.map((v) => v.segk ?? 0), 0.1);
const bar = (val, max, cls = '') => `<div class="bar ${cls}"><i style="width:${Math.max(1, (val / max) * 100)}%"></i></div>`;
const tag = (s) => `<span class="tag ${/reforz/i.test(s) ? 'ok' : /descart/i.test(s) ? 'no' : 'open'}">${esc(s.split('(')[0].trim())}</span>`;
const delta = (hist, key) => { const h = hist.filter((x) => x[key] != null); return h.length > 1 ? h[h.length - 1][key] - h[h.length - 2][key] : null; };

const kpi = (t, v, s = '') => `<div class="kpi"><div class="t">${t}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
const aud = (titulo, obj) => `<div class="card"><h3>${titulo}</h3>${Object.entries(obj || {}).map(([k, v]) => `<div class="row"><span>${esc(k)}</span>${bar(v, 100, 'a')}<b>${v}%</b></div>`).join('')}</div>`;

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>@ultimo.pegue · Dashboard</title><style>
:root{--bg:#0f1115;--c:#181b22;--b:#272b35;--t:#e8eaf0;--m:#8b92a3;--ac:#ff8a3d;--ok:#3ecf8e;--no:#ef5350;--bl:#5b9cff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--t);font:14px/1.45 system-ui,sans-serif;padding:20px;max-width:1200px;margin:auto}
h1{font-size:20px;margin:0}h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--m);margin:28px 0 10px}h3{font-size:13px;margin:0 0 8px;color:var(--m)}
.sub{color:var(--m);font-size:12px}.grid{display:grid;gap:10px}.k{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}.g2{grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
.kpi,.card{background:var(--c);border:1px solid var(--b);border-radius:10px;padding:12px 14px}.kpi .t{color:var(--m);font-size:12px}.kpi .v{font-size:26px;font-weight:650}.kpi .s{color:var(--m);font-size:12px}
table{width:100%;border-collapse:collapse;background:var(--c);border:1px solid var(--b);border-radius:10px;overflow:hidden}th,td{padding:7px 10px;text-align:right;border-bottom:1px solid var(--b);white-space:nowrap}th{color:var(--m);font-weight:500;font-size:12px}
th:first-child,td:first-child,td.l,th.l{text-align:left}tr:last-child td{border:0}td small{color:var(--m)}
.bar{background:#222733;border-radius:4px;height:8px;min-width:60px;flex:1}.bar i{display:block;height:100%;border-radius:4px;background:var(--bl)}.bar.s i{background:var(--ac)}.bar.a i{background:var(--bl)}
.row{display:flex;align-items:center;gap:8px;margin:5px 0}.row span{width:110px;color:var(--m);font-size:12px}.row b{width:44px;text-align:right;font-weight:500}
.tag{padding:2px 8px;border-radius:99px;font-size:11px;background:#2a2f3b;color:var(--m)}.tag.ok{background:#12372a;color:var(--ok)}.tag.no{background:#3a1c1c;color:var(--no)}.tag.open{background:#3a2c15;color:var(--ac)}
.good{color:var(--ok)}.bad{color:var(--no)}code{background:#222733;padding:1px 5px;border-radius:4px}ul{margin:6px 0;padding-left:18px}li{margin:3px 0}
.hyp{white-space:normal;text-align:left;min-width:260px}.wrap td{white-space:normal;text-align:left;vertical-align:top}.wrap th{text-align:left}.wrap td:first-child{white-space:nowrap}
.q{counter-reset:q}.q li{list-style:none;counter-increment:q;padding-left:0}.q li:before{content:counter(q);display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;background:var(--ac);color:#000;font-size:11px;margin-right:8px}
</style></head><body>
<h1>@ultimo.pegue · escalada</h1><div class="sub">Generado ${hoy.toLocaleString('es-ES', { timeZone: 'Europe/Berlin' })} · datos hasta ${esc(rows.at(-1)?.medido ?? '–')} · regenerar: <code>npm run dashboard</code></div>

<h2>Cuenta · ${esc(cuenta.fecha ?? '')} ${esc(cuenta.ventana ?? '')}</h2>
<div class="grid k">
${kpi('Seguidores', fmt(cuenta.seguidores), cuenta.seguidores_neto != null ? `+${cuenta.seguidores_neto} netos` : '')}
${kpi('Visualizaciones', fmt(cuenta.visualizaciones), 'ventana 30 d')}
${kpi('Espectadores', fmt(cuenta.espectadores))}
${kpi('Visitas al perfil', fmt(cuenta.visitas_perfil), `${cuenta.toques_enlace ?? 0} toques al enlace`)}
${kpi('De no seguidores', cuenta.no_seguidores_pct != null ? cuenta.no_seguidores_pct + ' %' : '–', 'crecimiento 100 % algoritmo')}
${kpi('Vídeos publicados', lista.length, `${sinPublicar.length} fichas sin publicar`)}
</div>

<h2>Vídeos publicados · última medición</h2>
<table><tr><th class="l">Vídeo</th><th class="l">Formato</th><th>Edad</th><th>Vistas</th><th class="l" style="width:130px"></th><th>Seg.</th><th>Seg./1k</th><th class="l" style="width:90px"></th><th>Envíos/1k</th><th>Skip</th><th>Visto</th><th>Estilo</th></tr>
${lista.map((v) => `<tr><td><b>${esc(v.id)}</b> <small>${esc(v.titulo)}</small></td><td class="l"><small>${esc(v.formato)}</small></td><td>${v.horas ?? '–'} h</td><td>${fmt(v.vistas)}</td><td>${bar(v.vistas ?? 0, maxV)}</td><td>${fmt(v.seguidores)}</td><td class="${v.segk >= 1 ? 'good' : ''}">${fmt(v.segk, 2)}</td><td>${bar(v.segk ?? 0, maxS, 's')}</td><td>${fmt(v.envk, 1)}</td><td class="${v.skip_pct > 25 ? 'bad' : ''}">${v.skip_pct != null ? v.skip_pct + ' %' : '–'}</td><td>${v.visto != null ? Math.round(v.visto) + ' %' : '–'}</td><td><small>${esc(v.estilo)}</small></td></tr>`).join('')}
</table>
<div class="sub" style="margin-top:6px">Skip en rojo &gt; 25 % (gancho flojo). Seg./1k en verde ≥ 1. Cada campo usa su último valor conocido; la edad es la de la última medición.</div>

<h2>Por formato (mediana · n pequeña = pistas)</h2>
<table><tr><th class="l">Formato</th><th>Vídeos</th><th>Mediana vistas</th><th>Mediana seguidores</th><th>Mediana seg./1k</th><th>Mediana skip</th></tr>
${Object.entries(porFormato).map(([f, a]) => `<tr><td>${esc(f)}</td><td>${a.length}</td><td>${fmt(med(a.map((x) => x.vistas)))}</td><td>${fmt(med(a.map((x) => x.seguidores)))}</td><td>${fmt(med(a.map((x) => x.segk)), 2)}</td><td>${med(a.map((x) => x.skip_pct)) != null ? med(a.map((x) => x.skip_pct)) + ' %' : '–'}</td></tr>`).join('')}
</table>

<div class="grid g2">
<div><h2>Cola de producción</h2><div class="card"><ol class="q" style="padding:0;margin:0">${cola.map((c) => `<li>${md(c)}</li>`).join('') || '<li>–</li>'}</ol></div></div>
<div><h2>Próximas mediciones a 7 días</h2><div class="card">${prox.map((p) => `<div class="row"><span style="width:50px"><b>${esc(p.id)}</b></span><span style="width:auto;flex:1">${p.fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span><b class="${p.dias <= 0 ? 'good' : ''}" style="width:90px">${p.dias <= 0 ? 'toca ya' : 'en ' + p.dias + ' d'}</b></div>`).join('')}</div></div>
</div>

<h2>Producidos sin publicar</h2>
<table class="wrap"><tr><th>Id</th><th>Estado (ficha)</th></tr>${sinPublicar.map(([id, e]) => `<tr><td><b>${esc(id)}</b></td><td>${md(e.estado)}</td></tr>`).join('')}</table>

<h2>Hipótesis a comprobar</h2>
<table class="wrap"><tr><th>Id</th><th>Hipótesis</th><th>La refutaría…</th><th>Estado</th></tr>
${hip.map((h) => `<tr><td><b>${esc(h.id)}</b></td><td class="hyp">${md(h.h)}<br><small>A favor: ${md(h.fav)}</small></td><td class="hyp"><small>${md(h.ref)}</small></td><td>${tag(h.estado)}<br><small>${esc((h.estado.match(/\((.+)\)/) || [])[1] ?? '')}</small></td></tr>`).join('')}
</table>

<h2>Audiencia (seguidores)</h2>
<div class="grid g2">${aud('Género', cuenta.genero)}${aud('Edad', cuenta.edad)}${aud('Países', cuenta.paises)}${aud('Ratio de envíos (envíos / visualizaciones, %)', Object.fromEntries(lista.filter((v) => v.envios && v.vistas).map((v) => [v.id, +((v.envios / v.vistas) * 100).toFixed(2)])))}</div>

<h2>Ideas</h2>
<div class="card"><ul>${bloques.filter((b) => !/Cola/i.test(b.k)).map((b) => `<li><b>${esc(b.k)}:</b> ${md(b.v)}</li>`).join('')}</ul></div>
<div class="sub" style="margin-top:20px">Fuentes: datos/publicados.csv · datos/cuenta.json · docs/aprendizajes.md · docs/ideas/escalada.md · videos/*/*/ficha.md</div>
</body></html>`;

fs.writeFileSync(R('docs/dashboard.html'), html);
console.log('docs/dashboard.html', (html.length / 1024).toFixed(0) + ' KB', `· ${lista.length} vídeos, ${hip.length} hipótesis, cola ${cola.length}`);
