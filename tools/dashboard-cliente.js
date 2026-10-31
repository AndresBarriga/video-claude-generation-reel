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
const NUMK = ['vistas', 'espectadores', 'visto_medio_s', 'duracion_s', 'skip_pct', 'envios', 'guardados', 'likes', 'comentarios', 'reposts', 'visitas_perfil', 'seguidores'];
const S = { win: 'last', fmt: '', sort: { k: 'vistas', d: -1 }, hf: 'todas', extra: [], cambios: {}, drawer: null, preview: '' };

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

// Valor de una métrica acumulativa en una ventana (horas) o la última medición
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

// ---------- Pruebas de hipótesis ----------
function evalVideo(sp, id) {
  const v = V[id] || Object.values(V).find((x) => x.id === id);
  if (!v) {
    const est = D.estados[id];
    return est ? { id, st: 'sinpub', txt: est } : { id, st: 'sinprod', txt: 'sin producir' };
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
  const eta = T(v.subido) + sp.ventana * 36e5;
  return { id, st: pend ? 'curso' : ref ? 'refuta' : 'sostiene', prov: pend && vals.length ? (ref ? 'refuta' : 'sostiene') : null, vals, aprox, eta };
}
function resumen(h) {
  const sp = D.pruebas[h.id];
  if (!sp) return { k: 'manual', res: [], sp: null, txt: 'Sin prueba definida en datos/pruebas.json' };
  if (sp.manual) return { k: 'manual', res: [], sp, txt: sp.manual };
  let res;
  if (sp.estilo) {
    const mine = Object.values(V).filter((v) => v.estilo === sp.estilo);
    const base = med(Object.values(V).filter((v) => v.estilo === sp.vs).map((v) => v.last.skip_pct));
    res = mine.length ? mine.map((v) => { const x = v.last.skip_pct; return x == null ? { id: v.id, st: 'curso', vals: [] } : { id: v.id, st: x >= base ? 'refuta' : 'sostiene', vals: [{ m: 'skip_pct', val: x, hit: x >= base }] }; }) : [{ id: 'sin vídeos ' + sp.estilo, st: 'sinprod', txt: 'ninguno marcado' }];
    sp.texto = sp.texto + (base != null ? ` (mediana ${sp.vs}: ${fmt(base, 1)} %)` : '');
  } else res = sp.videos.map((id) => evalVideo(sp, id));
  const n = res.length, c = (s) => res.filter((r) => r.st === s).length;
  const nR = c('refuta'), nS = c('sostiene'), nC = c('curso');
  let k;
  if (sp.modo === 'todos') k = nR === n ? 'refutada' : nS > 0 ? 'sostiene' : nC ? 'curso' : 'espera';
  else k = nR > 0 ? 'refutada' : nS === n && n > 0 ? 'sostiene' : nC ? 'curso' : 'espera';
  return { k, res, sp };
}
const KT = { refutada: ['Refutada (propuesta)', 'no'], sostiene: ['Se sostiene por ahora', 'ok'], curso: ['Midiendo', 'curso'], espera: ['Esperando vídeo', ''], manual: ['Prueba manual', ''] };

function chip(r, sp) {
  if (r.st === 'sinpub') return `<span class="chip sin" title="${esc(r.txt)}"><b>${esc(r.id)}</b>sin publicar · listo</span>`;
  if (r.st === 'sinprod') return `<span class="chip sin"><b>${esc(r.id)}</b>${esc(r.txt || 'sin producir')}</span>`;
  const cls = r.st === 'sostiene' ? 'ok' : r.st === 'refuta' ? 'no' : 'curso';
  const val = r.vals.length ? r.vals.map((x) => fmtM(x.m, x.val)).join(' · ') : 'sin datos';
  const tag = r.st === 'curso' ? ` · ${r.prov ? (r.prov === 'refuta' ? '✗' : '✓') + ' provisional' : 'midiendo'}, ${sp.ventana} h: ${en(r.eta)}` : r.st === 'sostiene' ? ' ✓' : ' ✗';
  return `<span class="chip ${cls}" data-v="${esc(r.id)}" title="Abrir ${esc(r.id)}"><b>${esc(r.id)}</b>${val}${r.aprox ? '<i class="ap">≈</i>' : ''}<small>${tag}</small></span>`;
}
const vchip = (id) => (V[id] ? `<span class="chip" data-v="${esc(id)}"><b>${esc(id)}</b>${esc(V[id].titulo || '')}</span>` : `<span class="chip sin"><b>${esc(id)}</b></span>`);

function siguiente(r) {
  if (r.k === 'espera') { const p = r.res.find((x) => x.st === 'sinpub'), q = r.res.find((x) => x.st === 'sinprod'); return p ? `<b>Siguiente:</b> publicar ${esc(p.id)} (${esc(p.txt)})` : q ? `<b>Siguiente:</b> producir ${esc(q.id)} (cola)` : ''; }
  if (r.k === 'curso') { const c = r.res.filter((x) => x.st === 'curso').sort((a, b) => a.eta - b.eta)[0]; return c ? `<b>Siguiente:</b> medir ${esc(c.id)} a ${r.sp.ventana} h → ${dia(c.eta)}` : ''; }
  if (r.k === 'sostiene' || r.k === 'refutada') return `<b>Siguiente:</b> proponer a Andrés el cambio de estado`;
  return `<b>Cómo:</b> ${esc(r.txt)}`;
}

// ---------- Render ----------
function renderTop() {
  const last = Math.max(...Object.values(V).map((v) => T(v.medido)));
  const h = (Date.now() - last) / 36e5;
  $('#fresh').innerHTML = `Último dato: ${dia(last)} · <span class="${h < 24 ? 'fresh-ok' : h < 72 ? 'fresh-warn' : 'fresh-bad'}">hace ${h < 48 ? Math.round(h) + ' h' : Math.round(h / 24) + ' d'}</span>${S.extra.length ? ' · <b>vista previa con ' + S.extra.length + ' medición(es) sin guardar</b>' : ''}`;
  const c = D.cuenta, tot = Object.values(V);
  const k = [['Seguidores', fmt(c.seguidores)], ['Visualiz. 30 d', fmt(c.visualizaciones)], ['Vídeos', tot.length], ['Vistas (suma)', fmt(tot.reduce((a, v) => a + (v.last.vistas || 0), 0))], ['De no seguidores', c.no_seguidores_pct + ' %'], ['Visitas perfil', fmt(c.visitas_perfil)]];
  $('#kpis').innerHTML = k.map(([a, b]) => `<div class="kp"><b>${b}</b><span>${a}</span></div>`).join('');
}

function hypsFor(id) {
  return D.hipotesis.filter((h) => { const sp = D.pruebas[h.id]; return h.favIds.includes(id) || h.conIds.includes(id) || (sp && sp.videos && sp.videos.some((x) => x === id)); }).map((h) => h.id);
}
function acciones() {
  const A = [], now = Date.now();
  const H = (ids) => ids.map((i) => `<span class="pill">${i}</span>`).join(' ');
  for (const v of Object.values(V)) {
    const age = (now - T(v.subido)) / 36e5;
    for (const [w, lo, hi, l, soon] of [[48, 42, 60, '48 h', 24], [168, 160, 190, '7 d', 48]]) {
      const has = v.pts.some((p) => p.h >= lo && p.h <= hi);
      if (age >= lo && age <= hi && !has) A.push({ t: 'Medir', u: 0, x: `<b>${v.id}</b> a ${l}: toca ahora (instantánea de Insights)`, hs: hypsFor(v.id) });
      else if (age < lo && w - age <= soon) A.push({ t: 'Medir', u: 1, x: `<b>${v.id}</b> a ${l}: ${dia(T(v.subido) + w * 36e5)} (${en(T(v.subido) + w * 36e5)})`, hs: hypsFor(v.id) });
    }
    if (v.last.skip_pct > 25) A.push({ t: 'Revisar', u: 3, x: `<b>${v.id}</b> skip ${fmt(v.last.skip_pct, 1)} %: revisar el gancho antes de repetir el formato`, hs: ['H5'] });
    const est = D.estados[v.id];
    if (est && /pendiente de publicar|programado|sin publicar/i.test(est)) A.push({ t: 'Revisar', u: 3, x: `Ficha de <b>${v.id}</b> dice «${esc(est)}» pero ya tiene datos`, hs: [] });
  }
  for (const [id, est] of Object.entries(D.estados)) if (!V[id] && /pendiente de publicar/i.test(est)) A.push({ t: 'Publicar', u: 1, x: `<b>${id}</b> está listo (${esc(est)})`, hs: hypsFor(id) });
  D.cola.slice(0, 3).forEach((c) => {
    const hs = D.hipotesis.filter((h) => (D.pruebas[h.id]?.videos || []).some((x) => !V[x] && !D.estados[x] && c.toLowerCase().includes(x.toLowerCase()))).map((h) => h.id);
    A.push({ t: 'Producir', u: 2, x: md(c), hs });
  });
  for (const h of D.hipotesis) { const n = D.pruebas[h.id]?.nota; if (n) A.push({ t: 'Decidir', u: 2, x: esc(n), hs: [h.id] }); }
  A.sort((a, b) => a.u - b.u);
  $('#acciones').innerHTML = `<div class="card">${A.map((a) => `<div class="acc"><span class="tg ${a.t}">${a.t}</span><div>${a.x} ${H(a.hs)}</div></div>`).join('') || '<span class="mut">Nada pendiente</span>'}</div>`;
}

function renderHip() {
  const items = D.hipotesis.map((h) => ({ h, r: resumen(h) }));
  const rank = (x) => (x.r.k === 'curso' ? [0, Math.min(...x.r.res.filter((r) => r.st === 'curso').map((r) => r.eta))] : x.r.k === 'espera' ? [1, 0] : x.r.k === 'manual' ? [3, 0] : [2, 0]);
  items.sort((a, b) => { const [x, y] = [rank(a), rank(b)]; return x[0] - y[0] || x[1] - y[1]; });
  const F = [['todas', 'Todas'], ['curso', 'Midiendo'], ['espera', 'Esperando vídeo'], ['sostiene', 'Se sostienen'], ['refutada', 'Refutadas'], ['manual', 'Manuales']];
  $('#hfiltros').innerHTML = F.map(([k, l]) => `<button data-hf="${k}" class="${S.hf === k ? 'on' : ''}">${l} ${k === 'todas' ? items.length : items.filter((i) => i.r.k === k).length}</button>`).join('');
  $('#hip').innerHTML = items.filter((i) => S.hf === 'todas' || i.r.k === S.hf).map(({ h, r }) => {
    const est = S.cambios[h.id] || h.estado, kt = KT[r.k];
    return `<article class="hy k-${r.k}"><header><span class="id">${h.id}</span><span class="pill ${est.split(' ')[0]}">${esc(est)}${S.cambios[h.id] ? ' *' : ''}</span><span class="pill ${kt[1]}">${kt[0]}</span></header>
<p class="tx">${md(h.h)}</p>
${r.sp && r.sp.texto ? `<div class="ref"><small>Se refuta si:</small> ${md(r.sp.texto)}</div>` : `<div class="ref"><small>Se refutaría:</small> ${md(h.ref)}</div>`}
${r.res.length ? `<div class="chips">${r.res.map((x) => chip(x, r.sp)).join('')}</div>` : ''}
<div class="next">${siguiente(r)}</div>
<details><summary>Evidencia y detalle</summary><p class="mut">A favor: ${h.favIds.length ? '' : md(h.fav)}</p><div class="chips">${h.favIds.map(vchip).join('')}</div><p class="mut">En contra: ${h.conIds.length ? '' : md(h.con)}</p><div class="chips">${h.conIds.map(vchip).join('')}</div>${h.estadoNota ? `<p class="mut">Nota: ${esc(h.estadoNota)}</p>` : ''}${r.sp && r.sp.nota ? `<p class="nota">${esc(r.sp.nota)}</p>` : ''}</details>
<footer><small>Cambiar estado:</small><select data-hc="${h.id}">${['abierta', 'reforzada', 'descartada'].map((o) => `<option ${o === est ? 'selected' : ''}>${o}</option>`).join('')}</select></footer></article>`;
  }).join('');
}

function renderVid() {
  const fm = [...new Set(Object.values(V).map((v) => v.formato))];
  $('#vfiltros').innerHTML = `<small>Ventana:</small> ${[['last', 'Última medición'], [48, '48 h'], [168, '7 d']].map(([k, l]) => `<button data-win="${k}" class="${String(S.win) === String(k) ? 'on' : ''}">${l}</button>`).join('')} <small style="margin-left:10px">Formato:</small> <select id="ffmt"><option value="">todos</option>${fm.map((f) => `<option ${S.fmt === f ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select>${S.win !== 'last' ? '<small>≈ = interpolado entre dos mediciones · «–» = aún no llega a esa ventana</small>' : '<small>Cuidado: la «última medición» mezcla edades distintas; compara por ventana.</small>'}`;
  const w = S.win === 'last' ? 'last' : +S.win;
  const cell = (v, m, d) => { const r = M(v, m, w); if (r.s === 'sin') return '–'; if (r.s === 'pend') return `<span class="dim" title="Aún no llega a ${w} h (va por ${Math.round(r.h)} h)">–</span>`; return (r.s === 'aprox' ? '<i class="ap">≈</i>' : '') + fmt(r.val, d); };
  const list = Object.values(V).filter((v) => !S.fmt || v.formato === S.fmt).map((v) => ({ v, x: { vistas: M(v, 'vistas', w).val, seg: M(v, 'seg', w).val, segk: M(v, 'segk', w).val, envk: M(v, 'envk', w).val, skip: v.last.skip_pct, h: v.pts[v.pts.length - 1].h } }));
  list.sort((a, b) => ((b.x[S.sort.k] ?? -1) - (a.x[S.sort.k] ?? -1)) * -S.sort.d);
  const mx = Math.max(...list.map((l) => l.x.vistas || 0), 1);
  const cols = [['vistas', 'Vistas'], ['seg', 'Seg.'], ['segk', 'Seg./1k'], ['envk', 'Env./1k'], ['skip', 'Skip'], ['h', 'Edad']];
  $('#vt').innerHTML = `<tr><th class="l">Vídeo</th><th class="l">Formato</th>${cols.map(([k, l]) => `<th data-s="${k}">${l}${S.sort.k === k ? (S.sort.d < 0 ? ' ↓' : ' ↑') : ''}</th>`).join('')}</tr>` + list.map(({ v, x }) => `<tr class="v" data-v="${v.id}"><td><b>${v.id}</b> <small>${esc(v.titulo)}</small></td><td class="l"><small>${esc(v.formato)}</small></td><td>${cell(v, 'vistas')}<span class="mini"><i style="width:${((x.vistas || 0) / mx) * 100}%"></i></span></td><td>${cell(v, 'seg')}</td><td class="${x.segk >= 1 ? 'good' : ''}">${cell(v, 'segk', 2)}</td><td>${cell(v, 'envk', 1)}</td><td class="${v.last.skip_pct > 25 ? 'bad' : ''}">${v.last.skip_pct != null ? fmt(v.last.skip_pct, 1) + ' %' : '–'}</td><td>${Math.round(x.h)} h</td></tr>`).join('');
}

function renderForm() {
  const now = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }).format(new Date()).replace(' ', 'T');
  const F = [['vistas', 'Vistas'], ['seguidores', 'Seguidores'], ['envios', 'Envíos'], ['guardados', 'Guardados'], ['skip_pct', 'Skip %'], ['likes', 'Likes'], ['comentarios', 'Comentarios'], ['reposts', 'Reposts'], ['visitas_perfil', 'Visitas perfil'], ['espectadores', 'Espectadores']];
  $('#form').innerHTML = `<div class="card"><div class="fg"><label>Vídeo<select id="fv">${Object.keys(V).map((i) => `<option>${i}</option>`).join('')}</select></label><label>Fecha y hora<input id="ff" type="datetime-local" value="${now}"></label>${F.map(([k, l]) => `<label>${l}<input data-f="${k}" type="number" step="any"></label>`).join('')}</div>
<div class="bar2" style="margin-top:10px"><button id="fprev" class="on">Previsualizar</button><button id="fundo">Deshacer</button></div><div id="fout">${S.preview}</div><p class="mut">Es una vista previa: no guarda nada. Para guardarla, ejecuta el comando o pégamelo en el chat y lo registro.</p></div>`;
}
function renderCambios() {
  const c = Object.entries(S.cambios);
  $('#cambios').innerHTML = `<div class="card">${c.length ? `<ul>${c.map(([k, v]) => `<li><b>${k}</b> → ${v}</li>`).join('')}</ul><pre id="ctxt">${esc('Cambiar en docs/aprendizajes.md: ' + c.map(([k, v]) => `${k} → ${v}`).join(', '))}</pre><button data-copy="ctxt">Copiar</button> <button id="creset">Descartar</button>` : '<span class="mut">Ningún cambio. Cambia el estado de una hipótesis en su tarjeta y aparecerá aquí para copiarlo.</span>'}</div>`;
}
function renderAud() {
  const c = D.cuenta, bars = (t, o) => `<div class="card"><small>${t}</small>${Object.entries(o || {}).map(([k, v]) => `<div class="row"><span>${esc(k)}</span><div class="bar"><i style="width:${Math.min(100, v)}%"></i></div><b>${v}%</b></div>`).join('')}</div>`;
  const env = Object.fromEntries(Object.values(V).filter((v) => v.last.envios && v.last.vistas).map((v) => [v.id, +((v.last.envios / v.last.vistas) * 100).toFixed(2)]));
  $('#aud').innerHTML = bars('Género', c.genero) + bars('Edad', c.edad) + bars('Países', c.paises) + bars('Envíos / vistas (%)', env) + (c.notas ? `<div class="card"><small>Nota de datos (${esc(c.fecha)})</small><p class="nota">${esc(c.notas)}</p></div>` : '');
}
function renderIdeas() { $('#ideas').innerHTML = `<div class="card"><ol>${D.cola.map((c) => `<li>${md(c)}</li>`).join('')}</ol><ul>${D.ideas.map((b) => `<li><b>${esc(b.k)}:</b> ${md(b.v)}</li>`).join('')}</ul></div>`; }

// ---------- Cajón de vídeo ----------
function curve(v, k, label) {
  const p = v.pts.filter((x) => x[k] != null);
  if (p.length < 2) return `<p class="mut">${label}: ${p.length ? fmt(p[0][k]) : '–'} (un solo punto)</p>`;
  const W = 400, Hh = 110, L = 34, xM = Math.max(...p.map((x) => x.h), 48), yM = Math.max(...p.map((x) => x[k])) || 1;
  const X = (x) => L + (x / xM) * (W - L - 8), Y = (y) => Hh - 18 - (y / yM) * (Hh - 28);
  const marks = [48, 168].filter((m) => m <= xM).map((m) => `<line x1="${X(m)}" x2="${X(m)}" y1="6" y2="${Hh - 18}" stroke="#3a3f4c" stroke-dasharray="3 3"/><text x="${X(m)}" y="${Hh - 6}" text-anchor="middle">${m === 48 ? '48 h' : '7 d'}</text>`).join('');
  return `<p class="mut" style="margin:10px 0 2px">${label}</p><svg viewBox="0 0 ${W} ${Hh}" width="100%"><line x1="${L}" x2="${W - 8}" y1="${Hh - 18}" y2="${Hh - 18}" stroke="#3a3f4c"/><text x="2" y="${Y(yM) + 3}">${fmt(yM)}</text><text x="2" y="${Hh - 15}">0</text>${marks}<polyline fill="none" stroke="#5b9cff" stroke-width="2" points="${p.map((x) => `${X(x.h)},${Y(x[k])}`).join(' ')}"/>${p.map((x) => `<circle cx="${X(x.h)}" cy="${Y(x[k])}" r="3" fill="#ff8a3d"><title>${Math.round(x.h)} h: ${fmt(x[k])}</title></circle>`).join('')}</svg>`;
}
function renderDrawer() {
  const el = $('#drawer'), v = V[S.drawer];
  if (!v) { el.hidden = true; return; }
  el.hidden = false;
  const L = v.last, up = T(v.subido);
  const k = [['Vistas', fmt(L.vistas)], ['Seguidores', fmt(L.seguidores)], ['Seg./1k', fmt(M(v, 'segk', 'last').val, 2)], ['Env./1k', fmt(M(v, 'envk', 'last').val, 1)], ['Skip', L.skip_pct != null ? fmt(L.skip_pct, 1) + ' %' : '–'], ['Guardados', fmt(L.guardados)]];
  const hs = hypsFor(v.id).map((id) => D.hipotesis.find((h) => h.id === id)).filter(Boolean);
  el.innerHTML = `<button class="x" data-close>✕</button><h3>${esc(v.id)} · ${esc(v.titulo)}</h3><div class="mut">${esc(v.formato)} · ${esc(v.estilo)} · subido ${dia(up)}</div><div class="mut">${esc(D.estados[v.id] || '')}</div>
<div class="dk">${k.map(([a, b]) => `<div><b>${b}</b><span>${a}</span></div>`).join('')}</div>${curve(v, 'vistas', 'Vistas según la edad del vídeo (horas)')}${curve(v, 'seguidores', 'Seguidores')}
<p class="mut" style="margin-top:12px">Próximas ventanas: 48 h → ${dia(up + 48 * 36e5)} · 7 d → ${dia(up + 168 * 36e5)}</p>
<p class="mut">Hipótesis donde aparece:</p><ul>${hs.map((h) => `<li><b>${h.id}</b> ${md(h.h)}</li>`).join('') || '<li class="mut">ninguna</li>'}</ul>
<p class="mut">Mediciones (${v.pts.length}):</p><table><tr><th class="l">Edad</th><th>Vistas</th><th>Seg.</th><th>Skip</th></tr>${v.pts.map((p) => `<tr><td class="l">${Math.round(p.h)} h</td><td>${fmt(p.vistas)}</td><td>${fmt(p.seguidores)}</td><td>${p.skip_pct != null ? fmt(p.skip_pct, 1) + ' %' : '–'}</td></tr>`).join('')}</table>`;
}

// ---------- Eventos ----------
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-v],[data-hf],[data-win],[data-s],[data-close],[data-copy],#fprev,#fundo,#creset');
  if (!t) return;
  if (t.dataset.v) { S.drawer = t.dataset.v; renderDrawer(); }
  else if (t.dataset.close !== undefined) { S.drawer = null; renderDrawer(); }
  else if (t.dataset.hf) { S.hf = t.dataset.hf; renderHip(); }
  else if (t.dataset.win) { S.win = t.dataset.win; renderVid(); }
  else if (t.dataset.s) { S.sort = { k: t.dataset.s, d: S.sort.k === t.dataset.s ? -S.sort.d : -1 }; renderVid(); }
  else if (t.dataset.copy) { navigator.clipboard?.writeText($('#' + t.dataset.copy).textContent); t.textContent = 'Copiado'; }
  else if (t.id === 'creset') { S.cambios = {}; renderHip(); renderCambios(); }
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
  if (t.dataset.hc) { const h = D.hipotesis.find((x) => x.id === t.dataset.hc); if (t.value === h.estado) delete S.cambios[h.id]; else S.cambios[h.id] = t.value; renderHip(); renderCambios(); }
  if (t.id === 'ffmt') { S.fmt = t.value; renderVid(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { S.drawer = null; renderDrawer(); } });

function refresh() { V = build(); renderTop(); acciones(); renderHip(); renderVid(); renderForm(); renderCambios(); renderDrawer(); }
refresh(); renderAud(); renderIdeas();
})();
