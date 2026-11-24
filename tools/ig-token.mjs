// Renueva el token de Instagram (60 días) antes de que caduque.
// Lo ejecuta la Action diaria. Con GH_PAT (token de GitHub con permiso de escribir secrets)
// renueva y reescribe el secret IG_TOKEN; sin GH_PAT solo avisa (y falla a ≤10 días para que llegue el correo).
// Estado no secreto en datos/ig-token.json: { renovado, caduca }.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const F = 'datos/ig-token.json', MARGEN = 30, ALARMA = 10;
const est = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : {};
const quedan = est.caduca ? (Date.parse(est.caduca) - Date.now()) / 864e5 : null;
const fin = (msg, code = 0) => { console.log(msg); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + '\n'); process.exit(code); };

if (quedan != null && quedan > MARGEN) fin(`Token IG: quedan ${Math.floor(quedan)} días (caduca ${est.caduca.slice(0, 10)}).`);
if (!process.env.IG_TOKEN) fin('Falta IG_TOKEN.', 1);
if (!process.env.GH_PAT) {
  if (quedan == null) fin(`⚠️ Token IG: no sé cuándo caduca. Añade el secret GH_PAT (renovación automática) o pon {"caduca":"AAAA-MM-DD"} en ${F}.`);
  fin(`⚠️ Token IG caduca en ${Math.floor(quedan)} días (${est.caduca.slice(0, 10)}). Genera uno nuevo y pégalo en el secret IG_TOKEN (docs/metricas-api.md).`, quedan <= ALARMA ? 1 : 0);
}

const u = new URL('https://graph.instagram.com/refresh_access_token');
u.searchParams.set('grant_type', 'ig_refresh_token');
u.searchParams.set('access_token', process.env.IG_TOKEN);
const j = await (await fetch(u)).json().catch(() => ({}));
if (!j.access_token) { // p. ej. token de menos de 24 h: se reintenta mañana
  const msg = `⚠️ No se pudo renovar el token IG: ${j.error?.message || 'respuesta sin token'}.`;
  fin(quedan != null ? `${msg} Caduca en ${Math.floor(quedan)} días.` : msg, quedan != null && quedan <= ALARMA ? 1 : 0);
}
execFileSync('gh', ['secret', 'set', 'IG_TOKEN', '--repo', process.env.GITHUB_REPOSITORY], { input: j.access_token, env: { ...process.env, GH_TOKEN: process.env.GH_PAT }, stdio: ['pipe', 'ignore', 'inherit'] });
const caduca = new Date(Date.now() + (j.expires_in || 5184000) * 1e3).toISOString();
fs.writeFileSync(F, JSON.stringify({ renovado: new Date().toISOString(), caduca }, null, 1) + '\n');
fin(`Token IG renovado; caduca ${caduca.slice(0, 10)}.`);
