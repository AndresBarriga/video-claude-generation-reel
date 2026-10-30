// Voz por la API de ElevenLabs (lo usa voz.mjs): ajustes de voz, llamada con errores claros, caché por vídeo
// (videos/<nicho>/<id>/voz-elevenlabs.mp3 + voz.json) y paso de la alineación por letras a tiempos por palabra.
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { conContenido } from "./texto-voz.mjs";

export class ErrorVoz extends Error {}
const API = "https://api.elevenlabs.io";
const FORMATO = "mp3_44100_128";
const AJUSTES = ["stability", "similarity_boost", "style", "use_speaker_boost", "speed"];

/** Voz por defecto de config.json, sobrescrita campo a campo por "voz" de guion.json si existe. */
export function ajustesVoz(config, guion) {
  const v = { ...config.voz, ...(guion.voz ?? {}) };
  const raros = Object.keys(v).filter((k) => !["voice_id", "model_id", ...AJUSTES].includes(k));
  if (raros.length) throw new ErrorVoz(`Campo de voz desconocido: ${raros.join(", ")}. Válidos: voice_id, model_id, ${AJUSTES.join(", ")}.`);
  if (!v.voice_id || /^PON_AQUI|VOICE_ID/i.test(v.voice_id))
    throw new ErrorVoz('Falta voice_id. Ponlo en config.json → "voz": { "voice_id": … } (voz por defecto) o en guion.json → "voz": { "voice_id": … } (solo este vídeo).\nLo copias en ElevenLabs → Voices → tu voz → «Copy voice ID».');
  const voice_settings = Object.fromEntries(AJUSTES.filter((k) => v[k] !== undefined).map((k) => [k, v[k]]));
  return { voice_id: v.voice_id, model_id: v.model_id ?? "eleven_multilingual_v2", voice_settings, origen: guion.voz ? "guion.json" : "config.json" };
}

function clave(raiz) {
  const envPath = path.join(raiz, ".env");
  if (fs.existsSync(envPath)) {
    for (const l of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Z_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new ErrorVoz(`Falta ELEVENLABS_API_KEY en .env.\nCopia .env.example a .env y pega tu clave (ElevenLabs → Developers → API Keys). .env no se sube a git.\nSin clave: genera el audio en la web y usa --audio ruta.mp3.`);
  return key;
}

const local = (id) => `Si estás en la nube de Claude, la red está bloqueada: ejecuta «npm run voz -- ${id}» en tu ordenador (local) y sube voz-elevenlabs.mp3 y voz.json.`;

function explicar(status, j, cuerpo, id) {
  const d = j?.detail, estado = typeof d === "object" && !Array.isArray(d) ? d.status : undefined;
  const msg = typeof d === "string" ? d : Array.isArray(d) ? d.map((x) => x.msg).join("; ") : d?.message ?? cuerpo.slice(0, 300);
  if (!j?.detail && (status === 403 || status === 407 || status >= 500 && /proxy|gateway|block|allow/i.test(cuerpo)))
    return `La conexión con api.elevenlabs.io la ha cortado un proxy o cortafuegos (HTTP ${status}).\n${local(id)}`;
  if (estado === "quota_exceeded" || status === 402) return `Sin créditos en ElevenLabs (HTTP ${status}): ${msg}\nRevisa el plan o espera a la renovación mensual.`;
  if (estado === "missing_permissions") return `La clave no tiene permiso para esto (HTTP ${status}): ${msg}\nEn ElevenLabs → API Keys, activa «Text to Speech» para esta clave.`;
  if (estado === "detected_unusual_activity") return `ElevenLabs ha bloqueado el plan gratuito por actividad inusual (VPN/proxy o varias cuentas) (HTTP ${status}): ${msg}`;
  if (status === 401) return `Clave de ElevenLabs no válida (HTTP 401): ${msg}\nRevisa ELEVENLABS_API_KEY en .env (sin espacios ni comillas de más).`;
  if (status === 429) return `ElevenLabs ha rechazado la petición por límite (HTTP 429: ${estado ?? "too_many_requests"}): ${msg}\nEspera un minuto y repite; si es de créditos, revisa el plan.`;
  if (status === 404 || estado === "voice_not_found") return `No existe ese voice_id en tu cuenta (HTTP ${status}): ${msg}\nAñade la voz a «My Voices» en ElevenLabs o corrige el voice_id.`;
  return `Error de ElevenLabs (HTTP ${status}${estado ? `, ${estado}` : ""}): ${msg}`;
}

async function llamar({ key, voz, texto, id }) {
  let res;
  try {
    res = await fetch(`${API}/v1/text-to-speech/${encodeURIComponent(voz.voice_id)}/with-timestamps?output_format=${FORMATO}`, {
      method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json" }, signal: AbortSignal.timeout(180_000),
      body: JSON.stringify({ text: texto, model_id: voz.model_id, voice_settings: voz.voice_settings }),
    });
  } catch (e) {
    const codigo = e.cause?.code ?? e.name;
    throw new ErrorVoz(`No hay conexión con api.elevenlabs.io (${codigo}${e.cause?.message ? `: ${e.cause.message}` : ""}).\n${local(id)}`);
  }
  const rid = res.headers.get("request-id");
  const cuerpo = await res.text();
  let j; try { j = JSON.parse(cuerpo); } catch { /* respuesta que no es de ElevenLabs */ }
  if (!res.ok) throw new ErrorVoz(explicar(res.status, j, cuerpo, id) + (rid ? `\n(request-id ${rid})` : ""));
  if (!j?.audio_base64 || !j.alignment) throw new ErrorVoz(`Respuesta inesperada de ElevenLabs (sin audio o sin alineación)${rid ? `, request-id ${rid}` : ""}.`);
  return { j, rid, historial: res.headers.get("history-item-id"), coste: res.headers.get("character-cost") };
}

async function creditosRestantes(key) {
  try {
    const r = await fetch(`${API}/v1/user/subscription`, { headers: { "xi-api-key": key }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null; // la clave puede no tener permiso de lectura: no importa
    const s = await r.json();
    return s.character_limit - s.character_count;
  } catch { return null; }
}

async function confirmar(pregunta) {
  if (!process.stdin.isTTY) throw new ErrorVoz("No hay terminal para confirmar. Repite con --si para generar sin preguntar.");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const r = await rl.question(pregunta);
  rl.close();
  return /^(s|si|sí|y|yes)$/i.test(r.trim());
}

// voz.json legible: metadatos con sangría, listas de números en una línea
const aJson = (o) => JSON.stringify(o, null, 2).replace(/\[\s+([^[\]{}]*?)\s+\]/g, (_, c) => `[${c.replace(/\s*\n\s*/g, " ")}]`) + "\n";
const ordenado = (o) => JSON.stringify(Object.fromEntries(Object.entries(o ?? {}).sort()));

/**
 * Devuelve { mp3, alignment, cache, info } reutilizando la toma guardada si texto y ajustes no han cambiado.
 * nueva: fuerza otra toma. si: no pregunta antes de gastar créditos.
 */
export async function vozElevenLabs({ raiz, carpeta, id, texto, voz, nueva, si }) {
  const mp3 = path.join(carpeta, "voz-elevenlabs.mp3"), jsonPath = path.join(carpeta, "voz.json"), rel = (f) => path.relative(raiz, f).replaceAll("\\", "/");
  const previa = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : null;
  const cambios = previa ? [
    previa.texto !== texto && "texto", previa.voice_id !== voz.voice_id && "voice_id", previa.model_id !== voz.model_id && "model_id",
    ordenado(previa.voice_settings) !== ordenado(voz.voice_settings) && "voice_settings", previa.output_format !== FORMATO && "formato",
  ].filter(Boolean) : null;
  if (previa && !cambios.length && fs.existsSync(mp3) && !nueva) return { mp3, alignment: previa.alignment, cache: true, info: previa };
  if (!previa && fs.existsSync(mp3) && !nueva)
    throw new ErrorVoz(`Ya hay ${rel(mp3)} sin voz.json (toma hecha en la web).\nPara sincronizarla: npm run voz -- ${id} --audio "${rel(mp3)}". Para sustituirla por una toma de la API: añade --nueva.`);

  const key = clave(raiz);
  const motivo = nueva ? "otra toma (--nueva)" : !previa ? "primera toma" : cambios.length ? `ha cambiado: ${cambios.join(", ")}` : "falta el mp3 de la caché";
  const quedan = await creditosRestantes(key);
  console.log(`Voz ${voz.voice_id} (${voz.origen}) · ${voz.model_id} · ${JSON.stringify(voz.voice_settings)}`);
  console.log(`Motivo: ${motivo}${previa ? " → sustituye voz-elevenlabs.mp3 y voz.json" : ""}`);
  console.log(`Se envían ${texto.length} caracteres → hasta ${texto.length} créditos${quedan != null ? ` (te quedan ${quedan})` : ""}.`);
  if (!si && !(await confirmar("¿Generar la voz? [s/N] "))) throw new ErrorVoz("Cancelado: no se ha llamado a la API.");

  const { j, rid, historial, coste } = await llamar({ key, voz, texto, id });
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
  const info = {
    fecha: new Date().toISOString(), request_id: rid, history_item_id: historial, creditos: coste != null ? +coste : undefined,
    voice_id: voz.voice_id, model_id: voz.model_id, voice_settings: voz.voice_settings, output_format: FORMATO,
    texto, mp3: path.basename(mp3), alignment: j.alignment, normalized_alignment: j.normalized_alignment,
  };
  fs.writeFileSync(jsonPath, aJson(info));
  return { mp3, alignment: j.alignment, cache: false, info };
}

/**
 * Alineación por letras → { start, end } por palabra del guion. Las etiquetas <break …/> no cuentan (solo son silencio).
 * Las palabras con letras o cifras se emparejan una a una; si el número o el texto no cuadra, error: nunca tiempos desplazados.
 */
export function tiemposDesdeAlineacion(al, palabras, rangos) {
  const { characters: ch, character_start_times_seconds: cs, character_end_times_seconds: ce } = al;
  const tokens = [];
  let cur = null, enEtiqueta = false;
  ch.forEach((c, i) => {
    if (c === "<") enEtiqueta = true;
    const corta = enEtiqueta || /\s/.test(c);
    if (c === ">") enEtiqueta = false;
    if (corta) { if (cur) tokens.push(cur); cur = null; return; }
    if (!cur) cur = { w: "", start: cs[i], end: ce[i] };
    cur.w += c; cur.end = ce[i];
  });
  if (cur) tokens.push(cur);

  const api = tokens.filter((t) => conContenido(t.w));
  const idx = palabras.map((_, i) => i).filter((i) => conContenido(palabras[i]));
  const norm = (p) => p.toLowerCase().normalize("NFD").replace(/[^\p{L}\p{N}]/gu, "");
  let k = 0;
  while (k < Math.min(api.length, idx.length) && norm(api[k].w) === norm(palabras[idx[k]])) k++;
  if (k < api.length || k < idx.length) {
    const escena = k < idx.length ? rangos.findIndex(([a, b]) => idx[k] >= a && idx[k] <= b) + 1 : rangos.length;
    const g = idx.slice(Math.max(0, k - 3), k + 4).map((i) => palabras[i]).join(" ");
    const a = api.slice(Math.max(0, k - 3), k + 4).map((t) => t.w).join(" ");
    throw new ErrorVoz(`La alineación de ElevenLabs no cuadra con el guion (${idx.length} palabras en el guion, ${api.length} en la respuesta).\n` +
      `Se descuadra en la palabra ${k + 1} (escena ${escena}): guion «${palabras[idx[k]] ?? "—"}» ≠ API «${api[k]?.w ?? "—"}»\n  guion: «${g}»\n  API:   «${a}»\n` +
      `No asigno tiempos desplazados. Prueba otra toma con --nueva; si se repite, quita símbolos raros del texto o avisa con el request-id de voz.json.`);
  }
  // Palabras sin letras ("—" suelto): sin duración propia, pegadas a la anterior
  const tiempos = new Array(palabras.length);
  idx.forEach((i, n) => { tiempos[i] = { start: api[n].start, end: api[n].end }; });
  for (let i = 0; i < palabras.length; i++) {
    if (tiempos[i]) continue;
    const t = i > 0 ? tiempos[i - 1].end : api[0]?.start ?? 0;
    tiempos[i] = { start: t, end: t };
  }
  return tiempos;
}
