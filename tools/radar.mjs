// Radar de virales: lee reels de cuentas de referencia (Business Discovery) → datos/radar.json + docs/radar.md.
// Uso: IG_TOKEN=… node tools/radar.mjs [--dias 60]   · Cuentas en datos/radar-cuentas.json. Guía: docs/radar.md
// Solo cuentas Business/Creator. Sin vídeo: pie, cifras y enlace. Outlier = vistas ÷ mediana de su cuenta.
import fs from 'node:fs';

const TOKEN = process.env.IG_TOKEN;
const VER = process.env.IG_API_VERSION || 'v25.0';
const IG_ID = process.env.IG_USER_ID || '17841432994190346'; // @ultimo.pegue
const API = `https://graph.facebook.com/${VER}`;
const args = process.argv.slice(2);
const DIAS = args.includes('--dias') ? Number(args[args.indexOf('--dias') + 1]) : 60;
const MIN_RATIO = 3; // un reel es outlier si tiene ≥3× la mediana de su cuenta
if (!TOKEN) { console.error('Falta IG_TOKEN (ver docs/metricas-api.md).'); process.exit(1); }

const leer = (p, d) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : d);
const mediana = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const corto = (s, n = 160) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);

async function get(params) {
  const u = new URL(`${API}/${IG_ID}`);
  for (const [k, v] of Object.entries({ ...params, access_token: TOKEN })) u.searchParams.set(k, v);
  const r = await fetch(u); const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error?.message || String(r.status));
  return j;
}

async function cuenta(user) {
  const campos = 'id,caption,media_product_type,media_url,permalink,timestamp,like_count,comments_count,view_count';
  const desde = Date.now() - DIAS * 864e5, reels = [];
  let after = '', base;
  for (let pag = 0; pag < 6; pag++) { // ≤300 publicaciones
    const media = `media${after ? `.after(${after})` : ''}.limit(50){${campos}}`;
    const j = await get({ fields: `business_discovery.username(${user}){username,name,followers_count,media_count,${media}}` });
    base = j.business_discovery;
    const datos = base.media?.data || [];
    for (const m of datos) if (m.media_product_type === 'REELS' && new Date(m.timestamp) >= desde) reels.push(m);
    after = base.media?.paging?.cursors?.after;
    if (!after || !datos.length || new Date(datos.at(-1).timestamp) < desde) break;
  }
  const vistas = reels.map((r) => r.view_count).filter((v) => v > 0);
  const med = mediana(vistas);
  const top = reels.filter((r) => r.view_count > 0)
    .map((r) => ({ id: r.id, url: r.permalink, video: r.media_url || null, fecha: r.timestamp.slice(0, 10), vistas: r.view_count, likes: r.like_count, comentarios: r.comments_count, ratio: med ? +(r.view_count / med).toFixed(1) : null, pie: corto(r.caption), pie_completo: r.caption || '' }))
    .sort((a, b) => b.ratio - a.ratio).slice(0, 5);
  const menciones = reels.flatMap((r) => (r.caption || '').match(/@[\w.]{3,30}/g) || []).map((m) => m.slice(1).replace(/\.$/, '').toLowerCase());
  return { menciones, user: base.username, nombre: base.name, seguidores: base.followers_count, reels: reels.length, mediana: Math.round(med),
    vistas_por_seguidor: base.followers_count ? +(med / base.followers_count).toFixed(2) : null, outliers: top.filter((t) => t.ratio >= MIN_RATIO).length, top };
}

const lista = leer('datos/radar-cuentas.json', { cuentas: [] }).cuentas;
const ok = [], fallos = [];
for (const c of lista) {
  const user = (c.user || c).replace(/^@/, '');
  try { const r = await cuenta(user); ok.push({ ...r, nota: c.nota || '' }); console.log(`@${user}: ${r.seguidores} seg · ${r.reels} reels · mediana ${r.mediana} · ${r.outliers} outliers`); }
  catch (e) { fallos.push({ user, error: e.message }); console.warn(`@${user}: ${e.message}`); }
}
// Cuentas nuevas: las que mencionan las referencias (colaboraciones, citas). Se prueban y se proponen, no se añaden solas.
const conocidas = new Set([...lista.map((c) => (c.user || c).replace(/^@/, '').toLowerCase()), 'ultimo.pegue']);
const cuenta_m = {};
for (const c of ok) for (const m of new Set(c.menciones)) if (!conocidas.has(m)) cuenta_m[m] = (cuenta_m[m] || 0) + 1;
const candidatas = [];
for (const [user, veces] of Object.entries(cuenta_m).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  try { const j = await get({ fields: `business_discovery.username(${user}){username,followers_count,media_count,biography}` });
    candidatas.push({ user, veces, seguidores: j.business_discovery.followers_count, bio: corto(j.business_discovery.biography, 90) }); }
  catch { /* personal o inexistente: no sirve para el radar */ }
}
for (const c of ok) delete c.menciones;
// Ranking: cuentas con más outliers y más vistas por seguidor (= alcance que no depende de su tamaño) primero
ok.sort((a, b) => b.outliers - a.outliers || b.vistas_por_seguidor - a.vistas_por_seguidor);
const fecha = new Date().toISOString().slice(0, 10);
fs.writeFileSync('datos/radar.json', JSON.stringify({ fecha, dias: DIAS, cuentas: ok, candidatas, fallos }, null, 1) + '\n');

const md = [`# Radar de virales · ${fecha} (reels de los últimos ${DIAS} días)`, '', 'Generado por `tools/radar.mjs`; no editar a mano. Método y uso: `docs/radar-metodo.md`.', '',
  '| Cuenta | Seg. | Reels | Mediana vistas | Vistas/seg. | Outliers (≥3×) |', '|---|---|---|---|---|---|',
  ...ok.map((c) => `| @${c.user} | ${c.seguidores} | ${c.reels} | ${c.mediana} | ${c.vistas_por_seguidor} | ${c.outliers} |`), '',
  '## Reels que más superan a su cuenta', '',
  ...ok.flatMap((c) => c.top.filter((t) => t.ratio >= MIN_RATIO).map((t) => `- **${t.ratio}×** @${c.user} · ${t.vistas} vistas · ${t.comentarios} com. · ${t.fecha} · [ver](${t.url}) — ${t.pie}`)),
  ...(candidatas.length ? ['', '## Cuentas candidatas (mencionadas por las referencias; añadir a `datos/radar-cuentas.json` si son de divulgación)', '', ...candidatas.map((c) => `- @${c.user} · ${c.seguidores} seg. · citada por ${c.veces} · ${c.bio}`)] : []),
  ...(fallos.length ? ['', '## No se pudieron leer (cuenta personal, nombre mal escrito o privada)', '', ...fallos.map((f) => `- @${f.user}: ${f.error}`)] : [])];
fs.writeFileSync('docs/radar.md', md.join('\n') + '\n');
console.log(`Radar: ${ok.length} cuentas leídas, ${fallos.length} fallos → docs/radar.md`);
