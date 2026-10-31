// Añade una medición a datos/publicados.csv y regenera el dashboard.
// Uso: npm run medir -- E15 vistas=210000 seg=75 env=1200 skip=18.8 [fecha="2026-10-31 18:40"]
// Claves: vistas seg env guard likes com rep visitas skip visto espect dur notas fecha
// Vídeo nuevo: añade titulo="..." formato=... estilo=codigo subido="2026-11-01 20:00" (+ plataforma, ubicacion)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parseCsv, quote } from './csv.mjs';

const ALIAS = { seg: 'seguidores', env: 'envios', guard: 'guardados', com: 'comentarios', rep: 'reposts', visitas: 'visitas_perfil', skip: 'skip_pct', visto: 'visto_medio_s', espect: 'espectadores', dur: 'duracion_s', fecha: 'medido' };
const [id, ...kv] = process.argv.slice(2);
if (!id || !kv.length) { console.error('Uso: npm run medir -- <id> vistas=… seg=… env=… skip=… [fecha="AAAA-MM-DD HH:MM"]'); process.exit(1); }

const txt = fs.readFileSync('datos/publicados.csv', 'utf8');
const { header, rows } = parseCsv(txt);
const prev = [...rows].reverse().find((r) => r.video === id);
const ahora = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }).format(new Date());

const r = Object.fromEntries(header.map((k) => [k, '']));
if (prev) for (const k of ['titulo', 'plataforma', 'ubicacion', 'formato', 'estilo', 'subido', 'duracion_s']) r[k] = prev[k];
r.video = id; r.plataforma ||= 'instagram'; r.ubicacion ||= 'cuadricula'; r.medido = ahora;
for (const a of kv) {
  const i = a.indexOf('='); if (i < 1) { console.error('Argumento no válido: ' + a); process.exit(1); }
  const k = ALIAS[a.slice(0, i)] ?? a.slice(0, i);
  if (!header.includes(k)) { console.error('Columna desconocida: ' + k + '. Válidas: ' + header.join(', ')); process.exit(1); }
  r[k] = a.slice(i + 1);
}
if (!r.subido) { console.error(`Vídeo nuevo: falta subido="AAAA-MM-DD HH:MM" (y titulo, formato, estilo).`); process.exit(1); }
const t = (s) => Date.parse(s.replace(' ', 'T') + ':00+01:00');
if (!r.horas) r.horas = String(Math.round((t(r.medido) - t(r.subido)) / 36e5));

fs.appendFileSync('datos/publicados.csv', (txt.endsWith('\n') ? '' : '\n') + header.map((k) => quote(r[k])).join(',') + '\n');
console.log(`+ ${id} · ${r.medido} (${r.horas} h) · ${kv.join(' ')}`);
execFileSync('node', ['tools/dashboard.mjs'], { stdio: 'inherit' });
