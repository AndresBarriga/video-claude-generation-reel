(() => {
'use strict';
const D = JSON.parse(document.getElementById('data').textContent);
const $ = (s, r = document) => r.querySelector(s);
const T = (s) => Date.parse(String(s).replace(' ', 'T') + ':00+01:00');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
const fmt = (n, d = 0) => (n == null || isNaN(n) ? '–' : Math.abs(n) >= 10000 ? (n / 1000).toFixed(Math.abs(n) >= 100000 ? 0 : 1).replace('.', ',') + 'K' : n.toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d }));
const dia = (ms) => new Date(ms).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
const en = (ms) => { const h = (ms - Date.now()) / 36e5; return h <= 0 ? 'ya' : h < 48 ? `en ${Math.round(h)} h` : `en ${Math.round(h / 24)} d`; };
const short = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const NUMK = ['vistas', 'espectadores', 'visto_medio_s', 'duracion_s', 'skip_pct', 'envios', 'guardados', 'likes', 'comentarios', 'reposts', 'visitas_perfil', 'seguidores'];
const S = { slot: {}, pot: {}, tab: 'panel', win: 'last', fmt: '', sort: { k: 'vistas', d: -1 }, hf: 'todas', hsort: 'prio', extra: [], cambios: {}, pesos: {}, drawer: null, preview: '' };

// ---------- Datos ----------
function build() {
  const rows = D.rows.concat(S.extra).slice().sort((a, b) => T(a.medido) - T(b.medido));
  const V = {};
  for (const r of rows) {
    const v = (V[r.video] ??= { id: r.video, pts: [], last: {} });
    for (const k of ['titulo', 'formato', 'estilo', 'subido']) if (r[k]) v[k] = r[k];
    for (const k of NUMK) if (r[k] != null) v.last[k] = r[k];
    v.medido = r.medido;
    const p = { h: (T(r.medido) - T(v.subido)) / 36e5, t: T(r.medido) };
    for (const k of NUMK) p[k] = r[k];
    v.pts.push(p);
  }
  return V;
}
let V = build();
const lab = (id) => V[id]?.titulo || D.videos[id]?.corto || '';
const desc = (id) => D.videos[id]?.desc || '';
const nm = (id) => `<b>${esc(id)}</b>${lab(id) ? ' «' + esc(lab(id)) + '»' : ''}`;
const nota = (id) => D.notas[id];
const ntBadge = (id) => { const n = nota(id); if (!n) return '<span class="dim" title="Sin nota registrada">—</span>'; const c = n.nota >= 7.5 ? 'hi' : n.nota >= 6 ? 'mid' : 'lo'; return `<span class="nt ${c}" title="${esc(n.fase + ' · ' + n.hist)}">${String(n.nota).replace('.', ',')}</span>${n.orig !== n.nota ? `<small> (${String(n.orig).replace('.', ',')})</small>` : ''}`; };
const vidBlock = (id) => { const f = D.archivos[id] || []; if (!f.length) return `<p class="mut">Sin archivo de vídeo en el repo (el final no se versiona). Para verlo aquí: <code>npm run render -- ${esc(id)}</code> o guarda una vista previa en <code>previews/${esc(id)}.mp4</code> y regenera.</p>`; const first = f.find((x) => x.kind === 'preview') || f[0]; return `<div class="vid"><video controls preload="metadata" src="${esc(first.href)}"></video>${f.map((x) => `<a href="${esc(x.href)}" download>⬇ ${esc(x.label)}</a>`).join('')}${f.length > 1 ? '<small class="mut"> Hay versión ligera y completa.</small>' : ''}</div>`; };
const colaFor = (k) => D.cola.find((c) => c.toLowerCase().includes(String(k).toLowerCase()));

function at(v, keys, win) {
  const p = v.pts.filter((x) => keys.every((k) => x[k] != null));
  if (!p.length) return { s: 'sin' };
  const pick = (x) => ({ vals: Object.fromEntries(keys.map((k) => [k, x[k]])), h: x.h });
  const last = p[p.length - 1];
  if (win === 'last') return { s: 'ok', ...pick(last) };
  if (last.h < win - 1.5) return { s: 'pend', ...pick(last) };
  const ex = p.find((x) => Math.abs(x.h - win) <= 1.5);
  if (ex) return { s: 'ok', ...pick(ex) };
  const after = p.find((x) => x.h >= win), before = [...p].reverse().find((x) => x.h < win);
  if (before && after) { const f = (win - before.h) / (after.h - before.h); return { s: 'aprox', vals: Object.fromEntries(keys.map((k) => [k, before[k] + f * (after[k] - before[k])])), h: win }; }
  return { s: 'aprox', ...pick(after) };
}
function M(v, m, win) {
  if (m === 'skip_pct') return v.last.skip_pct != null ? { s: 'ok', val: v.last.skip_pct } : { s: 'sin' };
  const keys = { vistas: ['vistas'], seg: ['seguidores'], segk: ['seguidores', 'vistas'], envk: ['envios', 'vistas'], env: ['envios'] }[m] || [m];
  const r = at(v, keys, win);
  if (r.s === 'sin') return r;
  const val = m === 'segk' ? (r.vals.seguidores / r.vals.vistas) * 1000 : m === 'envk' ? (r.vals.envios / r.vals.vistas) * 1000 : r.vals[keys[0]];
  return { ...r, val };
}
const fmtM = (m, x) => (m === 'vistas' ? fmt(x) + ' vistas' : m === 'segk' ? fmt(x, 2) + ' seg./1k' : m === 'envk' ? fmt(x, 1) + ' env./1k' : m === 'skip_pct' ? fmt(x, 1) + ' % skip' : fmt(x));
const cmp = (op, a, b) => (op === '<' ? a < b : op === '<=' ? a <= b : op === '>' ? a > b : a >= b);
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); if (!s.length) return null; const i = s.length >> 1; return s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2; };

// ---------- Pesos de hipótesis ----------
const pesoDe = (id) => { const sp = D.pruebas[id] || {}, o = S.pesos[id] || {}; return { impacto: o.impacto ?? sp.impacto, calidad: o.calidad ?? sp.calidad, coste: o.coste ?? sp.coste }; };
const score = (id) => { const w = pesoDe(id); return w.impacto && w.calidad && w.coste ? (w.impacto * w.calidad) / w.coste : 0; };
const rankMap = () => Object.fromEntries(D.hipotesis.map((h) => h.id).sort((a, b) => score(b) - score(a)).map((id, i) => [id, i + 1]));
const dots = (n, max = 5) => { const k = Math.max(0, Math.min(max, Math.round(n || 0))); return '●'.repeat(k) + '○'.repeat(max - k); };

// ---------- Pruebas ----------
function evalVideo(sp, id) {
  const v = V[id];
  if (!v) {
    const est = D.estados[id];
    if (est) return { id, st: 'sinpub', txt: est };
    const c = colaFor(id);
    return { id, st: 'sinprod', txt: c ? c.replace(/\*\*/g, '') : 'sin producir' };
  }
  let pend = false, aprox = false, ref = false;
  const vals = [];
  for (const c of sp.refuta_si) {
    const m = M(v, c.m, sp.ventana);
    if (m.s === 'sin') { pend = true; continue; }
    if (m.s === 'pend') pend = true;
    if (m.s === 'aprox') aprox = true;
    const hit = cmp(c.op, m.val, c.v);
    vals.push({ m: c.m, val: m.val, hit });
    if (hit) ref = true;
  }
  return { id, st: pend ? 'curso' : ref ? 'refuta' : 'sostiene', prov: pend && vals.length ? (ref ? 'refuta' : 'sostiene') : null, vals, aprox, eta: T(v.subido) + sp.ventana * 36e5 };
}
function resumen(h) {
  const sp = D.pruebas[h.id];
  if (!sp) return { k: 'manual', res: [], sp: {}, txt: 'Sin prueba definida en datos/pruebas.json' };
  if (sp.manual) return { k: 'manual', res: [], sp, txt: sp.manual };
  let res, texto = sp.texto;
  if (sp.estilo) {
    const mine = Object.values(V).filter((v) => v.estilo === sp.estilo);
    const base = med(Object.values(V).filter((v) => v.estilo === sp.vs).map((v) => v.last.skip_pct));
    res = mine.length ? mine.map((v) => { const x = v.last.skip_pct; return x == null ? { id: v.id, st: 'curso', vals: [] } : { id: v.id, st: x >= base ? 'refuta' : 'sostiene', vals: [{ m: 'skip_pct', val: x, hit: x >= base }] }; }) : [{ id: 'vídeos ' + sp.estilo, st: 'sinprod', txt: 'ninguno marcado aún' }];
    texto += base != null ? ` (mediana ${sp.vs}: ${fmt(base, 1)} %)` : '';
  } else res = sp.videos.map((id) => evalVideo(sp, id));
  const n = res.length, c = (s) => res.filter((r) => r.st === s).length;
  const nR = c('refuta'), nS = c('sostiene'), nC = c('curso');
  let k;
  if (sp.modo === 'todos') k = nR === n ? 'refutada' : nS > 0 ? 'sostiene' : nC ? 'curso' : 'espera';
  else k = nR > 0 ? 'refutada' : nS === n && n > 0 ? 'sostiene' : nC ? 'curso' : 'espera';
  return { k, res, sp: { ...sp, texto } };
}
const KT = { refutada: ['Refutada (propuesta)', 'no'], sostiene: ['Se sostiene por ahora', 'ok'], curso: ['Midiendo', 'curso'], espera: ['Esperando vídeo', ''], manual: ['Prueba manual', ''] };
const KCOL = { refutada: '#ef5350', sostiene: '#3ecf8e', curso: '#f2b84b', espera: '#5b9cff', manual: '#8b92a3' };

function chip(r, sp) {
  const t = `<span class="t">${esc(short(lab(r.id), 18))}</span>`;
  if (r.st === 'sinpub') return `<span class="chip sin" title="${esc(desc(r.id) + ' — ' + r.txt)}"><b>${esc(r.id)}</b>${t}sin publicar · listo</span>`;
  if (r.st === 'sinprod') return `<span class="chip sin" title="${esc(r.txt)}"><b>${esc(short(r.id, 24))}</b><span class="t">${esc(short(r.txt, 44))}</span>por producir</span>`;
  const cls = r.st === 'sostiene' ? 'ok' : r.st === 'refuta' ? 'no' : 'curso';
  const val = r.vals.length ? r.vals.map((x) => fmtM(x.m, x.val)).join(' · ') : 'sin datos';
  const tag = r.st === 'curso' ? ` · ${r.prov ? (r.prov === 'refuta' ? '✗' : '✓') + ' provisional' : 'midiendo'}, ${sp.ventana} h: ${en(r.eta)}` : r.st === 'sostiene' ? ' ✓' : ' ✗';
  return `<span class="chip ${cls}" data-v="${esc(r.id)}" title="${esc(desc(r.id))}"><b>${esc(r.id)}</b>${t}${val}${r.aprox ? '<i class="ap">≈</i>' : ''}<small>${tag}</small></span>`;
}
const vchip = (id) => (V[id] ? `<span class="chip" data-v="${esc(id)}" title="${esc(desc(id))}"><b>${esc(id)}</b><span class="t">${esc(lab(id))}</span></span>` : `<span class="chip sin"><b>${esc(id)}</b></span>`);

function siguiente(r) {
  if (r.k === 'espera') { const p = r.res.find((x) => x.st === 'sinpub'), q = r.res.find((x) => x.st === 'sinprod'); return p ? `<b>Siguiente:</b> publicar ${nm(p.id)}` : q ? `<b>Siguiente:</b> producir ${esc(q.id)}` : ''; }
  if (r.k === 'curso') { const c = r.res.filter((x) => x.st === 'curso').sort((a, b) => a.eta - b.eta)[0]; return c ? `<b>Siguiente:</b> medir ${nm(c.id)} a ${r.sp.ventana} h → ${dia(c.eta)}` : ''; }
  if (r.k === 'sostiene' || r.k === 'refutada') return '<b>Siguiente:</b> proponer a Andrés el cambio de estado';
  return `<b>Cómo:</b> ${esc(r.txt)}`;
}

// ---------- Render: panel ----------
function renderTop() {
  const last = Math.max(...Object.values(V).map((v) => T(v.medido)));
  const h = (Date.now() - last) / 36e5;
  $('#fresh').innerHTML = `Último dato: ${dia(last)} · <span class="${h < 24 ? 'fresh-ok' : h < 72 ? 'fresh-warn' : 'fresh-bad'}">hace ${h < 48 ? Math.round(h) + ' h' : Math.round(h / 24) + ' d'}</span>${S.extra.length ? ' · <b>vista previa con ' + S.extra.length + ' medición(es) sin guardar</b>' : ''}`;
  const c = D.cuenta, tot = Object.values(V);
  const sd = D.diario?.seguidores || {}, fs = Object.keys(sd).sort(), segHoy = fs.length ? sd[fs[fs.length - 1]] : c.seguidores, al = D.diario?.altas || {}, a7 = Object.keys(al).sort().slice(-7).reduce((a, k) => a + (al[k] || 0), 0);
  const k = [['Seguidores' + (fs.length ? ' · ' + fs[fs.length - 1].slice(5).split('-').reverse().join('/') : ''), fmt(segHoy)], ['Altas últimos 7 días', '+' + fmt(a7)], ['Visualiz. 30 d', fmt(c.visualizaciones)], ['Vídeos', tot.length], ['Vistas (suma)', fmt(tot.reduce((a, v) => a + (v.last.vistas || 0), 0))], ['De no seguidores', c.no_seguidores_pct + ' %'], ['Visitas perfil', fmt(c.visitas_perfil)]];
  $('#kpis').innerHTML = k.map(([a, b]) => `<div class="kp"><b>${b}</b><span>${a}</span></div>`).join('');
}
function renderClaves() {
  const C = D.claves || {};
  if (!C.lineas) { $('#claves').innerHTML = '<p class="mut">Sin datos/claves.json</p>'; return; }
  const med = (a) => { const b = a.filter((x) => x != null).sort((x, y) => x - y); if (!b.length) return null; const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
  // Seguidores: el último dato de captura (real); si solo hay el estimado de la API, se marca con ≈ (reparte las altas del día y exagera en días flojos)
  const segReal = (id) => { const r = D.rows.filter((x) => x.video === id && x.seguidores != null).sort((a, b) => T(a.medido) - T(b.medido)); const c = r.filter((x) => !/estimad/i.test(x.notas || '')); const x = (c.length ? c : r).pop(); return x ? { n: x.seguidores, est: !c.length } : { n: null, est: false }; };
  const L = C.lineas.map((l) => {
    const dv = D.diario?.vistas || {}, dk = Object.keys(dv).sort(), hoy = dk.length ? dv[dk[dk.length - 1]] : {};
    const vs = l.ids.map((id) => V[id]).filter(Boolean).map((v) => ({ ...v, sg: segReal(v.id), last: { ...v.last, vistas: Math.max(v.last.vistas || 0, hoy[v.id] || 0) } }));
    const vis = vs.map((v) => v.last.vistas), seg = vs.map((v) => v.sg.n);
    const sv = vs.reduce((a, v) => a + (v.sg.n != null ? v.last.vistas || 0 : 0), 0), ss = vs.reduce((a, v) => a + (v.sg.n || 0), 0);
    const top = vs.slice().sort((a, b) => (b.sg.n || 0) - (a.sg.n || 0)).slice(0, 3);
    return { ...l, n: vs.length, mv: med(vis), ms: med(seg), mil: sv ? (ss / sv) * 1000 : null, top, malos: vs.filter((v) => (v.last.vistas || 0) < 5000).length };
  }).sort((a, b) => (b.ms ?? -1) - (a.ms ?? -1));
  const maxS = Math.max(...L.map((l) => l.ms || 0), 1), maxV = Math.max(...L.map((l) => l.mv || 0), 1);
  const bar = (v, max, c) => `<span class="cb"><i style="width:${Math.max(2, (100 * (v || 0)) / max)}%;background:${c}"></i></span>`;
  const lin = L.map((l, i) => `<tr${i === 0 ? ' class="win"' : ''}><td class="ln"><span class="dot" style="background:${l.color}"></span><b>${esc(l.nombre)}</b><small> · ${l.n} vídeos${l.malos ? ` · ${l.malos} por debajo de 5K` : ''}</small><div class="chips">${l.top.map((v) => `<span class="chip" data-v="${esc(v.id)}" title="${v.sg.est ? 'seguidores estimados por la API' : 'seguidores de captura'}"><b>${esc(v.id)}</b>${v.sg.est ? '≈' : ''}${fmt(v.sg.n)} seg.</span>`).join('')}</div></td>
    <td><b class="big">${fmt(l.ms)}</b>${bar(l.ms, maxS, l.color)}</td><td><b class="big">${fmt(l.mv)}</b>${bar(l.mv, maxV, l.color)}</td><td><b class="big">${l.mil == null ? '–' : l.mil.toFixed(1).replace('.', ',')}</b></td></tr>`).join('');
  const ap = (C.aprendido || []).map((a, i) => `<li${i < 2 ? ' class="nuevo"' : ''}><span class="fe">${esc(a.fecha.slice(5).split('-').reverse().join('/'))}</span><div>${md(a.t)}${a.ids?.length ? `<div class="chips">${a.ids.map((id) => `<span class="chip" data-v="${esc(id)}"><b>${esc(id)}</b>${V[id] ? fmt(V[id].last.vistas) : ''}</span>`).join('')}</div>` : ''}</div></li>`).join('');
  $('#claves').innerHTML = `<div class="kgrid">
    <div class="card foco"><h3>🎯 Qué toca ahora</h3><ul>${(C.foco || []).map((f) => `<li>${md(f)}</li>`).join('')}</ul><small>Actualizado ${esc(C.actualizado || '')}</small></div>
    <div class="card"><h3>📈 Qué trae seguidores <small>mediana por vídeo · seguidores de captura; ≈ = estimado por la API (poco fiable en vídeos flojos)</small></h3>
      <table class="lt"><thead><tr><th>Línea</th><th>Seguidores</th><th>Vistas</th><th>Seg./1.000</th></tr></thead><tbody>${lin}</tbody></table></div>
  </div>
  <div class="kgrid k2"><div class="card"><h3>💡 Aprendido últimamente <small>lo más reciente arriba</small></h3><ol class="apr">${ap}</ol></div>
    <div class="card reglas"><h3>✅ Reglas al producir</h3><ul>${(C.reglas || []).map((r) => `<li>${md(r)}</li>`).join('')}</ul></div></div>`;
}
function hypsFor(id) {
  return D.hipotesis.filter((h) => { const sp = D.pruebas[h.id]; return h.favIds.includes(id) || h.conIds.includes(id) || (sp && sp.videos && sp.videos.includes(id)); }).map((h) => h.id);
}
function acciones() {
  const A = [], now = Date.now();
  const H = (ids) => ids.map((i) => `<span class="pill">${i}</span>`).join(' ');
  for (const v of Object.values(V)) {
    const age = (now - T(v.subido)) / 36e5;
    for (const [w, lo, hi, l, soon] of [[48, 42, 60, '48 h', 24], [168, 160, 190, '7 d', 48]]) {
      const has = v.pts.some((p) => p.h >= lo && p.h <= hi);
      if (age >= lo && age <= hi && !has) A.push({ t: 'Medir', u: 0, x: `${nm(v.id)} a ${l}: toca ahora (instantánea de Insights)`, hs: hypsFor(v.id) });
      else if (age < lo && w - age <= soon) A.push({ t: 'Medir', u: 1, x: `${nm(v.id)} a ${l}: ${dia(T(v.subido) + w * 36e5)} (${en(T(v.subido) + w * 36e5)})`, hs: hypsFor(v.id) });
    }
    if (v.last.skip_pct > 25) A.push({ t: 'Revisar', u: 3, x: `${nm(v.id)} skip ${fmt(v.last.skip_pct, 1)} %: revisar el gancho antes de repetir el formato`, hs: ['H5'] });
    const est = D.estados[v.id];
    if (est && /pendiente de publicar|programado|sin publicar/i.test(est)) A.push({ t: 'Revisar', u: 3, x: `Ficha de ${nm(v.id)} dice «${esc(est)}» pero ya tiene datos`, hs: [] });
  }
  for (const [id, est] of Object.entries(D.estados)) if (!V[id] && /pendiente de publicar/i.test(est)) A.push({ t: 'Publicar', u: 1, x: `${nm(id)} está listo (${esc(est)})`, hs: hypsFor(id) });
  D.cola.slice(0, 3).forEach((c) => {
    const hs = D.hipotesis.filter((h) => (D.pruebas[h.id]?.videos || []).some((x) => !V[x] && !D.estados[x] && c.toLowerCase().includes(x.toLowerCase()))).map((h) => h.id);
    A.push({ t: 'Producir', u: 2, x: md(c), hs });
  });
  for (const h of D.hipotesis) { const n = D.pruebas[h.id]?.nota; if (n) A.push({ t: 'Decidir', u: 2, x: esc(n), hs: [h.id] }); }
  A.sort((a, b) => a.u - b.u);
  $('#acciones').innerHTML = `<div class="card">${A.map((a) => `<div class="acc"><span class="tg ${a.t}">${a.t}</span><div>${a.x} ${H(a.hs)}</div></div>`).join('') || '<span class="mut">Nada pendiente</span>'}</div>`;
}

function renderMap(items, rk) {
  const Wd = 540, Ht = 300, L = 46, B = 34, X = (c) => L + ((c - 0.5) / 5) * (Wd - L - 10), Y = (i) => Ht - B - ((i - 0.5) / 5) * (Ht - B - 10);
  const groups = {};
  items.forEach(({ h, r }) => { const w = pesoDe(h.id); (groups[w.calidad + '_' + w.impacto] ??= []).push({ h, r, w }); });
  const circles = Object.values(groups).flatMap((g) => g.map((x, i) => `<g class="hc" data-hj="${x.h.id}"><circle cx="${X(x.w.calidad) + (i - (g.length - 1) / 2) * 30}" cy="${Y(x.w.impacto)}" r="14" fill="${KCOL[x.r.k]}" fill-opacity=".85"><title>${x.h.id}: ${esc(x.h.h)}</title></circle><text x="${X(x.w.calidad) + (i - (g.length - 1) / 2) * 30}" y="${Y(x.w.impacto) + 4}" text-anchor="middle" style="fill:#111;font-weight:700;font-size:11px">${x.h.id}</text></g>`)).join('');
  const top = Object.entries(rk).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([id]) => id);
  $('#hmap').innerHTML = `<div class="card"><svg viewBox="0 0 ${Wd} ${Ht}"><rect x="${X(3) - 1}" y="8" width="${Wd - X(3) - 8}" height="${Y(3.5) - 8}" fill="#ff8a3d" fill-opacity=".07"/><line x1="${X(2.5)}" x2="${X(2.5)}" y1="8" y2="${Ht - B}" stroke="#3a3f4c" stroke-dasharray="3 3"/><line x1="${L}" x2="${Wd - 8}" y1="${Y(3.5)}" y2="${Y(3.5)}" stroke="#3a3f4c" stroke-dasharray="3 3"/><line x1="${L}" x2="${Wd - 8}" y1="${Ht - B}" y2="${Ht - B}" stroke="#3a3f4c"/><line x1="${L}" x2="${L}" y1="8" y2="${Ht - B}" stroke="#3a3f4c"/>
<text x="${Wd - 12}" y="22" text-anchor="end">PROBAR PRIMERO</text><text x="${L + 6}" y="22">IMPORTANTE, PRUEBA FLOJA</text><text x="${Wd - 12}" y="${Ht - B - 6}" text-anchor="end">FÁCIL PERO MENOR</text><text x="${L + 6}" y="${Ht - B - 6}">APARCAR</text>
<text x="${(L + Wd) / 2}" y="${Ht - 6}" text-anchor="middle">Calidad de nuestra prueba (1→5)</text><text transform="rotate(-90 12 ${Ht / 2 - 10})" x="12" y="${Ht / 2 - 10}" text-anchor="middle">Impacto en la estrategia (1→5)</text>${circles}</svg>
<div class="hmt"><b>Cómo leerlo.</b> Arriba = si es verdad, cambia mucho lo que hacemos. A la derecha = tenemos una forma buena de comprobarla. <b>Prioridad = impacto × calidad ÷ coste</b>; hoy las tres primeras son ${top.map((id) => `<b>${id}</b>`).join(', ')}. El color es el estado de la prueba (verde se sostiene · ámbar midiendo · azul esperando vídeo · gris manual).<br><small>Los pesos son una estimación mía: edítalos en cada tarjeta (Evidencia y detalle) y se guardan en «Cambios pendientes».</small></div></div>`;
}

function renderHip() {
  const rk = rankMap();
  const items = D.hipotesis.map((h) => ({ h, r: resumen(h) }));
  const urg = (x) => (x.r.k === 'curso' ? [0, Math.min(...x.r.res.filter((r) => r.st === 'curso').map((r) => r.eta))] : x.r.k === 'espera' ? [1, 0] : x.r.k === 'manual' ? [3, 0] : [2, 0]);
  items.sort((a, b) => { if (S.hsort === 'prio') return rk[a.h.id] - rk[b.h.id]; const [x, y] = [urg(a), urg(b)]; return x[0] - y[0] || x[1] - y[1]; });
  renderMap(items, rk);
  const F = [['todas', 'Todas'], ['curso', 'Midiendo'], ['espera', 'Esperando vídeo'], ['sostiene', 'Se sostienen'], ['refutada', 'Refutadas'], ['manual', 'Manuales']];
  $('#hfiltros').innerHTML = `<small>Ordenar:</small> <button data-hs="prio" class="${S.hsort === 'prio' ? 'on' : ''}">Por prioridad</button><button data-hs="urg" class="${S.hsort === 'urg' ? 'on' : ''}">Por lo más urgente de medir</button> <small style="margin-left:10px">Filtrar:</small> ` + F.map(([k, l]) => `<button data-hf="${k}" class="${S.hf === k ? 'on' : ''}">${l} ${k === 'todas' ? items.length : items.filter((i) => i.r.k === k).length}</button>`).join('');
  $('#hip').innerHTML = items.filter((i) => S.hf === 'todas' || i.r.k === S.hf).map(({ h, r }) => {
    const est = S.cambios[h.id] || h.estado, kt = KT[r.k], sp = D.pruebas[h.id] || {}, w = pesoDe(h.id);
    const nF = new Set([...h.favIds, ...r.res.filter((x) => x.st === 'sostiene').map((x) => x.id)]).size;
    const nC = new Set([...h.conIds, ...r.res.filter((x) => x.st === 'refuta').map((x) => x.id)]).size;
    const sel = (k, max) => `<label>${k[0].toUpperCase() + k.slice(1)} <select data-wk="${h.id}|${k}">${Array.from({ length: max }, (_, i) => i + 1).map((o) => `<option ${o === w[k] ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`;
    return `<article class="hy k-${r.k}" id="hy-${h.id}"><header><span class="id">${h.id}</span><span class="pill ${est.split(' ')[0]}">${esc(est)}${S.cambios[h.id] ? ' *' : ''}</span><span class="pill ${kt[1]}">${kt[0]}</span><span class="pr" title="impacto × calidad ÷ coste = ${fmt(score(h.id), 1)}">#${rk[h.id]}</span></header>
<p class="tx">${md(h.h)}</p>
${sp.importa ? `<div class="why"><b>Por qué importa:</b> ${esc(sp.importa)}<small>Decide: ${esc(sp.decide || '')}</small></div>` : ''}
<div class="dots"><span>Impacto <b>${dots(w.impacto)}</b></span><span>Calidad de la prueba <b>${dots(w.calidad)}</b></span><span>Coste <b>${dots(w.coste, 3)}</b></span><span>A favor ${nF}/3 · En contra ${nC}</span></div>
<div class="ref"><small>Se refuta si:</small> ${md(r.sp.texto || h.ref)}${sp.limites ? `<br><small>Límite de la prueba: ${esc(sp.limites)}</small>` : ''}</div>
${r.res.length ? `<div class="chips">${r.res.map((x) => chip(x, r.sp)).join('')}</div>` : ''}
<div class="next">${siguiente(r)}</div>
<details><summary>Evidencia, pesos y estado</summary><p class="mut">A favor: ${h.favIds.length ? '' : md(h.fav)}</p><div class="chips">${h.favIds.map(vchip).join('')}</div><p class="mut">En contra: ${h.conIds.length ? '' : md(h.con)}</p><div class="chips">${h.conIds.map(vchip).join('')}</div>${h.estadoNota ? `<p class="mut">Nota: ${esc(h.estadoNota)}</p>` : ''}${sp.nota ? `<p class="nota">${esc(sp.nota)}</p>` : ''}<div class="wgt">${sel('impacto', 5)}${sel('calidad', 5)}${sel('coste', 3)}</div></details>
<footer><small>Estado:</small><select data-hc="${h.id}">${['abierta', 'reforzada', 'descartada'].map((o) => `<option ${o === est ? 'selected' : ''}>${o}</option>`).join('')}</select></footer></article>`;
  }).join('');
}

function renderVid() {
  const fm = [...new Set(Object.values(V).map((v) => v.formato))];
  $('#vfiltros').innerHTML = `<small>Ventana:</small> ${[['last', 'Última medición'], [48, '48 h'], [168, '7 d']].map(([k, l]) => `<button data-win="${k}" class="${String(S.win) === String(k) ? 'on' : ''}">${l}</button>`).join('')} <small style="margin-left:10px">Formato:</small> <select id="ffmt"><option value="">todos</option>${fm.map((f) => `<option ${S.fmt === f ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select>${S.win !== 'last' ? '<small>≈ = interpolado entre dos mediciones · «–» = aún no llega a esa ventana</small>' : '<small>Cuidado: la «última medición» mezcla edades distintas; compara por ventana.</small>'}`;
  const w = S.win === 'last' ? 'last' : +S.win;
  const cell = (v, m, d) => { const r = M(v, m, w); if (r.s === 'sin') return '–'; if (r.s === 'pend') return `<span class="dim" title="Aún no llega a ${w} h (va por ${Math.round(r.h)} h)">–</span>`; return (r.s === 'aprox' ? '<i class="ap">≈</i>' : '') + fmt(r.val, d); };
  const list = Object.values(V).filter((v) => !S.fmt || v.formato === S.fmt).map((v) => ({ v, x: { vistas: M(v, 'vistas', w).val, seg: M(v, 'seg', w).val, segk: M(v, 'segk', w).val, envk: M(v, 'envk', w).val, skip: v.last.skip_pct, h: v.pts[v.pts.length - 1].h } }));
  list.forEach((l) => { l.x.nota = nota(l.v.id)?.nota; });
  list.sort((a, b) => ((b.x[S.sort.k] ?? -1) - (a.x[S.sort.k] ?? -1)) * -S.sort.d);
  const mx = Math.max(...list.map((l) => l.x.vistas || 0), 1);
  const cols = [['nota', 'Crítico'], ['vistas', 'Vistas'], ['seg', 'Seg.'], ['segk', 'Seg./1k'], ['envk', 'Env./1k'], ['skip', 'Skip'], ['h', 'Edad']];
  $('#vt').innerHTML = `<tr><th class="l">Vídeo</th><th class="l">Formato · estilo</th>${cols.map(([k, l]) => `<th data-s="${k}">${l}${S.sort.k === k ? (S.sort.d < 0 ? ' ↓' : ' ↑') : ''}</th>`).join('')}</tr>` + list.map(({ v, x }) => `<tr class="v" data-v="${v.id}"><td class="vn"><b>${v.id}</b> ${esc(v.titulo)}<div class="desc">${esc(desc(v.id))}${D.archivos[v.id] ? ' ▶' : ''}</div></td><td class="l"><small>${esc(v.formato)}<br>${esc(v.estilo)}</small></td><td>${ntBadge(v.id)}</td><td>${cell(v, 'vistas')}<span class="mini"><i style="width:${((x.vistas || 0) / mx) * 100}%"></i></span></td><td>${cell(v, 'seg')}</td><td class="${x.segk >= 1 ? 'good' : ''}">${cell(v, 'segk', 2)}</td><td>${cell(v, 'envk', 1)}</td><td class="${v.last.skip_pct > 25 ? 'bad' : ''}">${v.last.skip_pct != null ? fmt(v.last.skip_pct, 1) + ' %' : '–'}</td><td>${Math.round(x.h)} h</td></tr>`).join('');
}

function renderForm() {
  const now = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }).format(new Date()).replace(' ', 'T');
  const F = [['vistas', 'Vistas'], ['seguidores', 'Seguidores'], ['envios', 'Envíos'], ['guardados', 'Guardados'], ['skip_pct', 'Skip %'], ['likes', 'Likes'], ['comentarios', 'Comentarios'], ['reposts', 'Reposts'], ['visitas_perfil', 'Visitas perfil'], ['espectadores', 'Espectadores']];
  $('#form').innerHTML = `<div class="card"><div class="fg"><label>Vídeo<select id="fv">${Object.keys(V).map((i) => `<option value="${i}">${i} · ${esc(lab(i))}</option>`).join('')}</select></label><label>Fecha y hora<input id="ff" type="datetime-local" value="${now}"></label>${F.map(([k, l]) => `<label>${l}<input data-f="${k}" type="number" step="any"></label>`).join('')}</div>
<div class="bar2" style="margin-top:10px"><button id="fprev" class="on">Previsualizar</button><button id="fundo">Deshacer</button></div><div id="fout">${S.preview}</div><p class="mut">Es una vista previa: no guarda nada. Para guardarla, ejecuta el comando o pégamelo en el chat y lo registro.</p></div>`;
}
function renderCambios() {
  const L = [];
  for (const [k, v] of Object.entries(S.cambios)) L.push(`docs/aprendizajes.md: ${k} → ${v}`);
  for (const [k, o] of Object.entries(S.pesos)) for (const [a, b] of Object.entries(o)) L.push(`datos/pruebas.json: ${k} ${a} = ${b}`);
  $('#cambios').innerHTML = `<div class="card">${L.length ? `<ul>${L.map((l) => `<li>${esc(l)}</li>`).join('')}</ul><pre id="ctxt">${esc(L.join('\n'))}</pre><button data-copy="ctxt">Copiar</button> <button id="creset">Descartar</button>` : '<span class="mut">Ningún cambio. Cambia el estado o los pesos de una hipótesis en su tarjeta y aparecerá aquí para copiarlo.</span>'}</div>`;
}
function renderAud() {
  const c = D.cuenta, bars = (t, o) => `<div class="card"><small>${t}</small>${Object.entries(o || {}).map(([k, v]) => `<div class="row"><span>${esc(k)}</span><div class="bar"><i style="width:${Math.min(100, v)}%"></i></div><b>${v}%</b></div>`).join('')}</div>`;
  const env = Object.fromEntries(Object.values(V).filter((v) => v.last.envios && v.last.vistas).map((v) => [v.id, +((v.last.envios / v.last.vistas) * 100).toFixed(2)]));
  $('#aud').innerHTML = bars('Género', c.genero) + bars('Edad', c.edad) + bars('Países', c.paises) + bars('Envíos / vistas (%)', env) + (c.notas ? `<div class="card"><small>Nota de datos (${esc(c.fecha)})</small><p class="nota">${esc(c.notas)}</p></div>` : '');
}
function renderIdeas() { $('#ideas').innerHTML = `<div class="card"><ol>${D.cola.map((c) => `<li>${md(c)}</li>`).join('')}</ol><ul>${D.ideas.map((b) => `<li><b>${esc(b.k)}:</b> ${md(b.v)}</li>`).join('')}</ul></div>`; }

// ---------- Render: criterios de viralidad ----------
const rank = (a) => { const o = a.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]); const r = []; o.forEach(([, i], j) => (r[i] = j + 1)); return r; };
const rho = (x, y) => { const n = x.length; if (n < 3) return null; const a = rank(x), b = rank(y), d = a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0); return 1 - (6 * d) / (n * (n * n - 1)); };
function renderCrit() {
  const C = D.criterios, EP = { 'sin datos suficientes': '', 'sin señal': '', 'pista en contra': 'curso', 'pista a favor': 'ok', parcial: 'abierta' };
  const notas = C.notas_critico.map((n) => ({ ...n, v: V[n.video] })).sort((a, b) => b.nota - a.nota);
  const pub = notas.filter((n) => n.v && n.v.last.vistas);
  const r1 = rho(pub.map((n) => n.nota), pub.map((n) => n.v.last.vistas)), r2 = rho(pub.map((n) => n.nota), pub.map((n) => M(n.v, 'segk', 'last').val));
  $('#pg-crit').innerHTML = `<section><h2>Estado del manual <small>docs/viralidad.md</small></h2><div class="card"><p><b>Congelado:</b> ${esc(C.estado.congelado)} · <b>último cambio:</b> ${esc(C.estado.ultima_edicion)}</p><p>${esc(C.estado.texto)}</p></div></section>
<section><h2>Criterios y lo que dicen los datos <small>con 6 vídeos medidos: pistas, no reglas</small></h2><div class="tw"><table><tr><th>#</th><th>Criterio</th><th>Estado</th><th>Lo que dicen los datos</th><th>Qué hacer</th></tr>${C.criterios.map((c) => `<tr><td><b>${c.id}</b></td><td><b>${esc(c.nombre)}</b><div class="desc">${esc(c.regla)}<br><i>Origen: ${esc(c.origen)}</i></div></td><td><span class="pill ${EP[c.estado] ?? ''}">${esc(c.estado)}</span><br><small>n=${c.n ?? '?'}</small>${c.hip ? `<br><span class="pill">${c.hip}</span>` : ''}</td><td>${esc(c.datos)}</td><td>${esc(c.accion)}</td></tr>`).join('')}</table></div></section>
<section><h2>La nota del crítico frente al resultado <small>¿predice?</small></h2><div class="tw"><table><tr><th>Vídeo</th><th>Nota</th><th>Fase</th><th>Vistas</th><th>Seg./1k</th><th>Skip</th><th>Env. %</th></tr>${notas.map((n) => `<tr><td>${nm(n.video)}</td><td><b>${n.nota}</b></td><td>${esc(n.fase)}</td>${n.v && n.v.last.vistas ? `<td>${fmt(n.v.last.vistas)}</td><td>${fmt(M(n.v, 'segk', 'last').val, 2)}</td><td>${n.v.last.skip_pct != null ? fmt(n.v.last.skip_pct, 1) + ' %' : '–'}</td><td>${n.v.last.envios ? fmt((n.v.last.envios / n.v.last.vistas) * 100, 2) : '–'}</td>` : '<td colspan="4" class="dim">sin publicar</td>'}</tr>`).join('')}</table></div>
<div class="card"><b>Lectura (n=${pub.length}):</b> con tan pocos vídeos no se puede concluir nada. Solo orientativo: correlación nota↔vistas ρ=${r1 == null ? '–' : fmt(r1, 2)} y nota↔seg./1k ρ=${r2 == null ? '–' : fmt(r2, 2)}. Se vuelve a mirar con más vídeos (H6: ≥8).</div></section>
<section><h2>Propuesta de reescritura</h2><div class="card"><ol>${C.propuesta.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></div></section>`;
}

// ---------- Render: plan de publicación ----------
function renderPlan() {
  const Pn = D.plan, rk = rankMap();
  Pn.candidatos.forEach((c) => { S.slot[c.id] ??= c.slot; });
  const prior = (f) => { const l = Object.values(V).filter((v) => v.formato === f); return l.length ? l.map((v) => `${v.id}: ${fmt(v.last.vistas)} vistas · ${fmt(M(v, 'segk', 'last').val, 2)} seg./1k`).join('<br>') : '<span class="dim">formato nuevo, sin datos</span>'; };
  const info = (c) => Math.max(0, ...(c.h || []).map((x) => score(x)));
  const rows = Pn.candidatos.map((c) => `<tr><td><b>${esc(c.nombre)}</b><div class="desc">${esc(desc(c.id))}</div>${D.archivos[c.id] ? `<div class="vid">${(D.archivos[c.id] || []).map((x) => `<a href="${esc(x.href)}" target="_blank">▶ ${esc(x.label)}</a><a href="${esc(x.href)}" download>⬇</a>`).join('')}</div>` : ''}</td>
<td>${esc(c.estado)}${(c.bloqueos || []).length ? `<div class="desc">${c.bloqueos.map(esc).join(' · ')}</div>` : ''}</td><td>${ntBadge(c.id)}</td><td><small>${prior(c.formato)}</small></td>
<td><b>${dots(S.pot[c.id] ?? c.potencial)}</b><div class="desc">${esc(c.por_que)}</div><select data-pot="${c.id}">${[1, 2, 3, 4, 5].map((o) => `<option ${o === (S.pot[c.id] ?? c.potencial) ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
<td>${(c.h || []).length ? (c.h || []).map((x) => `<span class="pill" title="${esc(D.hipotesis.find((h) => h.id === x)?.h || '')}">${x} #${rk[x]}</span>`).join(' ') + `<div class="desc">valor informativo ${fmt(info(c), 0)}</div>` : '<span class="dim">no aporta</span>'}</td>
<td><b>${dots(c.riesgo)}</b><div class="desc">${esc(c.riesgo_txt)}</div></td><td>${esc(c.esfuerzo)}</td>
<td><select data-slot="${c.id}">${Pn.slots.map((sl) => `<option value="${sl.id}" ${S.slot[c.id] === sl.id ? 'selected' : ''}>${esc(sl.nombre)}</option>`).join('')}</select></td></tr>`).join('');
  const board = Pn.slots.filter((sl) => !['no'].includes(sl.id)).map((sl) => { const l = Pn.candidatos.filter((c) => S.slot[c.id] === sl.id); return `<div class="card"><b>${esc(sl.nombre)}</b><small>${esc(sl.hora)}</small>${l.map((c) => `<div>· ${esc(c.nombre)}</div>`).join('') || '<span class="dim">—</span>'}</div>`; }).join('');
  const txt = Pn.slots.map((sl) => `${sl.nombre}${sl.hora ? ' (' + sl.hora + ')' : ''}: ` + (Pn.candidatos.filter((c) => S.slot[c.id] === sl.id).map((c) => c.id).join(', ') || '—')).join('\n');
  $('#pg-plan').innerHTML = `<section><h2>Qué subir, cuándo y cómo <small>propuesta mía para discutir: cambia los desplegables</small></h2>
<div class="card"><b>Cómo decidimos.</b> Ya no hay una nota mínima. Cada candidato se mira con cinco señales: <b>potencial</b> (qué esperar según los datos de su formato), <b>qué aprendemos</b> (la prioridad de las hipótesis que prueba), <b>crítico</b> (referencia, no puerta), <b>riesgo</b> y <b>esfuerzo</b>. Antes de publicar, una lista de no-fallos: hechos y tema legal comprobados · el gancho se entiende en 3 s sin audio · sabemos qué frase se mandaría · prueba al menos una hipótesis.</div>
<div class="slots">${board}</div><pre id="ptxt">${esc(txt)}</pre><button data-copy="ptxt">Copiar plan</button></section>
<section><h2>Candidatos</h2><div class="tw"><table><tr><th>Vídeo</th><th>Estado</th><th>Crítico</th><th>Prior del formato (datos reales)</th><th>Potencial</th><th>Qué aprendemos</th><th>Riesgo</th><th>Esfuerzo</th><th>Cuándo</th></tr>${rows}</table></div>
<p class="mut">Potencial y riesgo son estimaciones mías, editables. El «prior del formato» sale de un solo vídeo por formato: es una pista, no una predicción.</p></section>`;
}

// ---------- Cajón de vídeo ----------
function curve(v, k, label) {
  const p = v.pts.filter((x) => x[k] != null);
  if (p.length < 2) return `<p class="mut">${label}: ${p.length ? fmt(p[0][k]) : '–'} (un solo punto)</p>`;
  const Wd = 400, Hh = 110, L = 34, xM = Math.max(...p.map((x) => x.h), 48), yM = Math.max(...p.map((x) => x[k])) || 1;
  const X = (x) => L + (x / xM) * (Wd - L - 8), Y = (y) => Hh - 18 - (y / yM) * (Hh - 28);
  const marks = [48, 168].filter((m) => m <= xM).map((m) => `<line x1="${X(m)}" x2="${X(m)}" y1="6" y2="${Hh - 18}" stroke="#3a3f4c" stroke-dasharray="3 3"/><text x="${X(m)}" y="${Hh - 6}" text-anchor="middle">${m === 48 ? '48 h' : '7 d'}</text>`).join('');
  return `<p class="mut" style="margin:10px 0 2px">${label}</p><svg viewBox="0 0 ${Wd} ${Hh}" width="100%"><line x1="${L}" x2="${Wd - 8}" y1="${Hh - 18}" y2="${Hh - 18}" stroke="#3a3f4c"/><text x="2" y="${Y(yM) + 3}">${fmt(yM)}</text><text x="2" y="${Hh - 15}">0</text>${marks}<polyline fill="none" stroke="#5b9cff" stroke-width="2" points="${p.map((x) => `${X(x.h)},${Y(x[k])}`).join(' ')}"/>${p.map((x) => `<circle cx="${X(x.h)}" cy="${Y(x[k])}" r="3" fill="#ff8a3d"><title>${Math.round(x.h)} h: ${fmt(x[k])}</title></circle>`).join('')}</svg>`;
}
function renderDrawer() {
  const el = $('#drawer'), v = V[S.drawer];
  if (!v) { el.hidden = true; return; }
  el.hidden = false;
  const L = v.last, up = T(v.subido);
  const k = [['Vistas', fmt(L.vistas)], ['Seguidores', fmt(L.seguidores)], ['Seg./1k', fmt(M(v, 'segk', 'last').val, 2)], ['Env./1k', fmt(M(v, 'envk', 'last').val, 1)], ['Skip', L.skip_pct != null ? fmt(L.skip_pct, 1) + ' %' : '–'], ['Guardados', fmt(L.guardados)]];
  const hs = hypsFor(v.id).map((id) => D.hipotesis.find((h) => h.id === id)).filter(Boolean);
  el.innerHTML = `<button class="x" data-close>✕</button><h3>${esc(v.id)} · ${esc(v.titulo)}</h3><p style="margin:4px 0">${esc(desc(v.id))}</p><div class="mut">${esc(v.formato)} · ${esc(v.estilo)} · subido ${dia(up)}</div><div class="mut">${esc(D.estados[v.id] || '')}</div><p style="margin:6px 0">Crítico: ${ntBadge(v.id)} <small class="mut">${esc(nota(v.id) ? nota(v.id).fase + ' · ' + nota(v.id).hist : 'sin nota registrada')}</small></p>${vidBlock(v.id)}
<div class="dk">${k.map(([a, b]) => `<div><b>${b}</b><span>${a}</span></div>`).join('')}</div>${curve(v, 'vistas', 'Vistas según la edad del vídeo (horas)')}${curve(v, 'seguidores', 'Seguidores')}
<p class="mut" style="margin-top:12px">Próximas ventanas: 48 h → ${dia(up + 48 * 36e5)} · 7 d → ${dia(up + 168 * 36e5)}</p>
<p class="mut">Hipótesis donde aparece:</p><ul>${hs.map((h) => `<li><b>${h.id}</b> ${md(h.h)}</li>`).join('') || '<li class="mut">ninguna</li>'}</ul>
<p class="mut">Mediciones (${v.pts.length}):</p><table><tr><th class="l">Edad</th><th>Vistas</th><th>Seg.</th><th>Skip</th></tr>${v.pts.map((p) => `<tr><td class="l">${Math.round(p.h)} h</td><td>${fmt(p.vistas)}</td><td>${fmt(p.seguidores)}</td><td>${p.skip_pct != null ? fmt(p.skip_pct, 1) + ' %' : '–'}</td></tr>`).join('')}</table>`;
}

// ---------- Eventos ----------
function setTab(t) { S.tab = t; $('#pg-panel').hidden = t !== 'panel'; $('#pg-crit').hidden = t !== 'crit'; $('#pg-plan').hidden = t !== 'plan'; document.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === t)); window.scrollTo(0, 0); }
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-tab],[data-hj],[data-hs],[data-v],[data-hf],[data-win],[data-s],[data-close],[data-copy],#fprev,#fundo,#creset');
  if (!t) return;
  if (t.dataset.tab) setTab(t.dataset.tab);
  else if (t.dataset.hj) { if (S.hf !== 'todas') { S.hf = 'todas'; renderHip(); } const el = document.getElementById('hy-' + t.dataset.hj); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); el?.classList.add('flash'); setTimeout(() => el?.classList.remove('flash'), 1600); }
  else if (t.dataset.hs) { S.hsort = t.dataset.hs; renderHip(); }
  else if (t.dataset.v) { S.drawer = t.dataset.v; renderDrawer(); }
  else if (t.dataset.close !== undefined) { S.drawer = null; renderDrawer(); }
  else if (t.dataset.hf) { S.hf = t.dataset.hf; renderHip(); }
  else if (t.dataset.win) { S.win = t.dataset.win; renderVid(); }
  else if (t.dataset.s) { S.sort = { k: t.dataset.s, d: S.sort.k === t.dataset.s ? -S.sort.d : -1 }; renderVid(); }
  else if (t.dataset.copy) { navigator.clipboard?.writeText($('#' + t.dataset.copy).textContent); t.textContent = 'Copiado'; }
  else if (t.id === 'creset') { S.cambios = {}; S.pesos = {}; renderHip(); renderCambios(); }
  else if (t.id === 'fundo') { S.extra = []; S.preview = ''; refresh(); }
  else if (t.id === 'fprev') {
    const id = $('#fv').value, when = $('#ff').value.replace('T', ' ');
    const base = V[id], row = { video: id, titulo: base.titulo, formato: base.formato, estilo: base.estilo, subido: base.subido, medido: when, notas: '' };
    const parts = [];
    for (const k of NUMK) row[k] = null;
    document.querySelectorAll('[data-f]').forEach((i) => { if (i.value !== '') { row[i.dataset.f] = +i.value; parts.push([i.dataset.f, i.value]); } });
    if (!parts.length) { $('#fout').innerHTML = '<p class="nota">Rellena al menos un dato.</p>'; return; }
    const al = { seguidores: 'seg', envios: 'env', guardados: 'guard', skip_pct: 'skip', comentarios: 'com', reposts: 'rep', visitas_perfil: 'visitas', espectadores: 'espect' };
    const cmd = `npm run medir -- ${id} ${parts.map(([k, v]) => `${al[k] || k}=${v}`).join(' ')} fecha="${when}"`;
    S.extra.push(row);
    S.preview = `<p class="mut">Aplicado en la vista previa (cámbiate a ventana 48 h / 7 d para ver el efecto). Para guardarlo:</p><pre id="cmd">${esc(cmd)}</pre><button data-copy="cmd">Copiar comando</button>`;
    refresh();
  }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.slot) { S.slot[t.dataset.slot] = t.value; renderPlan(); }
  if (t.dataset.pot) { S.pot[t.dataset.pot] = +t.value; renderPlan(); }
  if (t.dataset.hc) { const h = D.hipotesis.find((x) => x.id === t.dataset.hc); if (t.value === h.estado) delete S.cambios[h.id]; else S.cambios[h.id] = t.value; renderHip(); renderCambios(); }
  if (t.dataset.wk) { const [id, k] = t.dataset.wk.split('|'), orig = D.pruebas[id][k]; (S.pesos[id] ??= {})[k] = +t.value; if (+t.value === orig) delete S.pesos[id][k]; if (!Object.keys(S.pesos[id]).length) delete S.pesos[id]; renderHip(); renderCambios(); document.getElementById('hy-' + id)?.querySelector('details')?.setAttribute('open', ''); }
  if (t.id === 'ffmt') { S.fmt = t.value; renderVid(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { S.drawer = null; renderDrawer(); } });

function refresh() { V = build(); renderTop(); renderClaves(); acciones(); renderHip(); renderVid(); renderForm(); renderCambios(); renderCrit(); renderPlan(); renderDrawer(); }
refresh(); renderAud(); renderIdeas();
})();
