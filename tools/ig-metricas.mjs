// Métricas de Instagram por API → datos/publicados.csv (+ dashboard).
// Uso: IG_TOKEN=… npm run ig [-- --ultimos 5] [--dry]
//   --ultimos N  mide los N reels más recientes (ignora la ventana de días)
//   --dry        enseña las filas sin escribir nada
// Sin --ultimos mide reels de ≤7 días y los de 14 y 30 días exactos (1 fila por reel y ejecución).
// Guía: docs/metricas-api.md. API con inicio de sesión de Instagram (graph.instagram.com).
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parseCsv, quote } from './csv.mjs';

const TOKEN = process.env.IG_TOKEN;
const VER = process.env.IG_API_VERSION || 'v25.0';
// Token de Instagram (IG…) → graph.instagram.com; token de Facebook (EAA…, apps nuevas con «Unified login») → graph.facebook.com
let FB = /^EAA/.test(TOKEN || '');
let API = `https://graph.${FB ? 'facebook' : 'instagram'}.com/${VER}`;
const IG_ID = process.env.IG_USER_ID || '17841432984190346'; // @ultimo.pegue (no es secreto)
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ULT = args.includes('--ultimos') ? Number(args[args.indexOf('--ultimos') + 1]) : 0;
const MAP = 'datos/ig-map.json', DIARIO = 'datos/ig-diario.json', CSV = 'datos/publicados.csv';
const METRICAS = ['views', 'reach', 'likes', 'comments', 'shares', 'saved', 'reposts', 'ig_reels_avg_watch_time', 'reels_skip_rate'];
if (!TOKEN) { console.error('Falta IG_TOKEN (ver docs/metricas-api.md).'); process.exit(1); }

// --- utilidades ---
const leerJson = (p, def) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : def);
const escribirJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
const berlin = (d) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }).format(d); // "AAAA-MM-DD HH:MM"
const diaBerlin = (d) => berlin(d).slice(0, 10);
const desdeBerlin = (s) => { // "AAAA-MM-DD HH:MM" (hora de Berlín, con horario de verano) → Date
  const guess = new Date(s.replace(' ', 'T') + ':00Z');
  const off = guess - new Date(berlin(guess).replace(' ', 'T') + ':00Z');
  return new Date(guess.getTime() + off);
};
const palabras = (s) => new Set((s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/#\S+/g, '').match(/[a-zñ0-9]{3,}/g) || []);
const parecido = (a, b) => { const A = palabras(a), B = palabras(b); if (!A.size || !B.size) return 0; let i = 0; for (const w of A) if (B.has(w)) i++; return i / Math.min(A.size, B.size); };

async function get(ruta, params = {}) {
  const u = new URL(ruta.startsWith('http') ? ruta : API + ruta);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set('access_token', TOKEN);
  const r = await fetch(u);
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) { const e = new Error(`${ruta}: ${j.error?.message || r.status}`); e.code = j.error?.code; throw e; }
  return j;
}

// --- 1. reels de la cuenta ---
console.log(`Token: empieza por «${TOKEN.slice(0, 4)}», ${TOKEN.length} caracteres${/\s/.test(TOKEN) ? ', ¡CONTIENE ESPACIOS!' : ''}`);
const viaFb = async () => ({ user_id: IG_ID, ...(await get(`/${IG_ID}`, { fields: 'username,followers_count' })) });
let me;
if (FB) me = await viaFb();
else try { me = await get('/me', { fields: 'user_id,username,followers_count' }); }
catch (e) { // algunos tokens del «Unified login» solo funcionan en graph.facebook.com
  console.warn(`graph.instagram.com: ${e.message} → pruebo graph.facebook.com`);
  FB = true; API = `https://graph.facebook.com/${VER}`; me = await viaFb();
}
console.log(`@${me.username} · ${me.followers_count} seguidores · ${FB ? 'token de Facebook' : 'token de Instagram'}`);
const reels = [];
for (let url = `/${me.user_id}/media`, p = { fields: 'id,caption,media_product_type,timestamp,permalink', limit: '50' }; url && reels.length < 200;) {
  const j = await get(url, p);
  reels.push(...j.data.filter((m) => m.media_product_type === 'REELS'));
  url = j.paging?.next; p = {};
  if (j.data.length && new Date(j.data.at(-1).timestamp) < Date.now() - 60 * 864e5) break; // basta con 60 días
}
reels.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

// --- 2. asociar a nuestros ids ---
const { header, rows } = parseCsv(fs.readFileSync(CSV, 'utf8'));
const ultimaFila = (id) => [...rows].reverse().find((r) => r.video === id);
const nuestros = {}; // id → { subido, pie }
for (const r of rows) if (r.subido && r.plataforma === 'instagram') (nuestros[r.video] ||= {}).subido = r.subido;
for (const nicho of fs.existsSync('videos') ? fs.readdirSync('videos') : []) {
  const d = `videos/${nicho}`; if (!fs.statSync(d).isDirectory()) continue;
  for (const id of fs.readdirSync(d)) {
    const f = `${d}/${id}/ficha.md`; if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, 'utf8').match(/## Descripci[oó]n para publicar\s*\n([\s\S]*?)(?:\n## |$)/);
    if (m) (nuestros[id] ||= {}).pie = m[1];
  }
}
const mapa = leerJson(MAP, {});
const usados = new Set(Object.values(mapa).map((m) => m.video).filter(Boolean));
function asociar(m) {
  if (mapa[m.id]?.video) return mapa[m.id].video; // "-" = ignorar
  const t = new Date(m.timestamp);
  let mejor = null;
  for (const [id, n] of Object.entries(nuestros)) {
    if (usados.has(id)) continue;
    const dh = n.subido ? Math.abs(desdeBerlin(n.subido) - t) / 36e5 : Infinity;
    const sim = n.pie ? parecido(m.caption, n.pie) : 0;
    // Vale si el pie coincide (≥60 % de palabras), si la hora de subida del CSV está a ≤1 h, o a ≤3 h sin que el pie lo contradiga.
    const ok = sim >= 0.6 || dh <= 1 || (dh <= 3 && (!n.pie || sim >= 0.25));
    const score = sim * 2 - Math.min(dh, 48) / 24;
    if (ok && (!mejor || score > mejor.score)) mejor = { id, score };
  }
  return mejor?.id || null;
}
const sinAsociar = [];
for (const m of reels) {
  m.video = asociar(m);
  if (m.video && m.video !== '-') { usados.add(m.video); if (!mapa[m.id]) mapa[m.id] = { video: m.video, auto: true }; }
  else if (!m.video) { sinAsociar.push(m); mapa[m.id] = { video: '', fecha: berlin(new Date(m.timestamp)), pie: (m.caption || '').split('\n')[0].slice(0, 90), enlace: m.permalink }; }
}

// --- 3. insights por reel ---
async function insights(id) {
  const leer = (j) => Object.fromEntries(j.data.map((d) => [d.name, d.values?.[0]?.value ?? d.total_value?.value ?? null]));
  try { return leer(await get(`/${id}/insights`, { metric: METRICAS.join(',') })); }
  catch { // una métrica no disponible tumba la llamada entera → una a una
    const o = {};
    for (const k of METRICAS) { try { Object.assign(o, leer(await get(`/${id}/insights`, { metric: k }))); } catch (e) { o[k] = null; o._faltan = [...(o._faltan || []), k]; } }
    return o;
  }
}
const ahora = new Date(), hoy = diaBerlin(ahora);
const edadDias = (m) => (ahora - new Date(m.timestamp)) / 864e5;
const recientes = reels.filter((m) => edadDias(m) <= 31);
const ins = {};
for (const m of recientes) ins[m.id] = await insights(m.id);

// --- 4. seguidores: altas diarias de la cuenta y reparto estimado ---
const diario = leerJson(DIARIO, { altas: {}, vistas: {} });
try { // follower_count: solo últimos 30 días, sin el de hoy; cuentas ≥100 seguidores
  const j = await get(`/${me.user_id}/insights`, { metric: 'follower_count', period: 'day', since: String(Math.floor(ahora / 1e3) - 29 * 86400), until: String(Math.floor(ahora / 1e3) - 3600) });
  for (const v of j.data?.[0]?.values || []) diario.altas[diaBerlin(new Date(new Date(v.end_time) - 864e5))] = v.value;
} catch (e) { console.warn('Aviso: sin altas diarias (' + e.message + ').'); }
diario.vistas[hoy] = Object.fromEntries(recientes.filter((m) => m.video && m.video !== '-' && ins[m.id].views != null).map((m) => [m.video, ins[m.id].views]));
diario.seguidores = { ...(diario.seguidores || {}), [hoy]: me.followers_count };

// Reparto: las altas del día D se reparten entre reels según las vistas que ganó cada uno ese día
// (diferencia entre la foto de D y la de D+1). Sin fotos de esos días: al reel o reels publicados el día D.
const pubDia = {}; for (const m of reels) if (m.video && m.video !== '-') (pubDia[diaBerlin(new Date(m.timestamp))] ||= []).push(m.video);
const siguiente = (d) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); };
const reparto = {}; // id → { seg, porVistas, porDia }
for (const [d, n] of Object.entries(diario.altas)) {
  const a = diario.vistas[d], b = diario.vistas[siguiente(d)];
  let pesos = null;
  if (a && b) { pesos = {}; for (const id of Object.keys(b)) pesos[id] = Math.max(0, b[id] - (a[id] || 0)); }
  const tot = pesos ? Object.values(pesos).reduce((s, v) => s + v, 0) : 0;
  if (tot > 0) for (const [id, w] of Object.entries(pesos)) { const r = (reparto[id] ||= { seg: 0, v: 0, d: 0 }); r.seg += (n * w) / tot; r.v++; }
  else for (const id of pubDia[d] || []) { const r = (reparto[id] ||= { seg: 0, v: 0, d: 0 }); r.seg += n / pubDia[d].length; r.d++; }
}

// --- 5. filas ---
const medir = ULT ? reels.filter((m) => m.video && m.video !== '-').slice(0, ULT)
  : recientes.filter((m) => m.video && m.video !== '-' && (edadDias(m) <= 7.5 || [14, 30].includes(Math.round(edadDias(m)))));
const nuevas = [];
for (const m of medir) {
  const x = ins[m.id] || (await insights(m.id));
  const prev = ultimaFila(m.video) || {};
  const r = Object.fromEntries(header.map((k) => [k, '']));
  for (const k of ['titulo', 'formato', 'estilo', 'duracion_s']) r[k] = prev[k] || '';
  if (!r.titulo) r.titulo = leerJson('datos/videos.json', {})[m.video]?.corto || (m.caption || '').split('\n')[0].slice(0, 60);
  Object.assign(r, { video: m.video, plataforma: 'instagram', ubicacion: prev.ubicacion || 'cuadricula', subido: berlin(new Date(m.timestamp)), medido: berlin(ahora) });
  r.horas = String(Math.round(((ahora - new Date(m.timestamp)) / 36e5) * 10) / 10);
  const n = (v, dec = 0) => (v == null ? '' : String(Math.round(v * 10 ** dec) / 10 ** dec));
  Object.assign(r, { vistas: n(x.views), espectadores: n(x.reach), likes: n(x.likes), comentarios: n(x.comments), envios: n(x.shares), guardados: n(x.saved), reposts: n(x.reposts), visto_medio_s: n(x.ig_reels_avg_watch_time != null ? x.ig_reels_avg_watch_time / 1000 : null, 1), skip_pct: n(x.reels_skip_rate, 1) });
  const rp = reparto[m.video];
  const notas = ['API IG'];
  if (rp) { r.seguidores = n(rp.seg); notas.push(`seg. estimados por día (${rp.v ? 'reparto por vistas del día' : 'día de publicación'}${rp.v && rp.d ? ' + día de publicación' : ''})`); }
  else notas.push('seg. sin estimar (faltan altas diarias)');
  if (x.reels_skip_rate == null) notas.push('skip vacío en la API');
  if (x._faltan) notas.push('sin: ' + x._faltan.join(' '));
  r.notas = notas.join('; ');
  nuevas.push(r);
}

// --- 6. salida ---
for (const r of nuevas) console.log(`+ ${r.video} · ${r.horas} h · vistas ${r.vistas} · alc ${r.espectadores} · env ${r.envios} · guard ${r.guardados} · skip ${r.skip_pct || '–'} · visto ${r.visto_medio_s || '–'} s · seg≈${r.seguidores || '–'}`);
if (sinAsociar.length) console.log(`\n${sinAsociar.length} reel(s) sin asociar → rellena "video" en ${MAP} (o "-" para ignorar):\n` + sinAsociar.map((m) => `  ${m.id} · ${berlin(new Date(m.timestamp))} · ${(m.caption || '').split('\n')[0].slice(0, 60)}`).join('\n'));
if (DRY) { console.log('\n(--dry: no se ha escrito nada)'); process.exit(0); }
const txt = fs.readFileSync(CSV, 'utf8');
if (nuevas.length) fs.appendFileSync(CSV, (txt.endsWith('\n') ? '' : '\n') + nuevas.map((r) => header.map((k) => quote(r[k])).join(',')).join('\n') + '\n');
escribirJson(MAP, mapa);
escribirJson(DIARIO, diario);
if (nuevas.length) execFileSync('node', ['tools/dashboard.mjs'], { stdio: 'inherit' });
