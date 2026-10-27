#!/usr/bin/env node
// Tres formas de preparar la voz de un vídeo (id = E1, M1…):
//   1) Manual (recomendada): generas el audio en la web de ElevenLabs con el texto de `npm run texto -- E1`,
//      guardas el archivo y ejecutas:  npm run voz -- E1 --audio ruta/al/audio.mp3
//   2) API de ElevenLabs (opcional, necesita .env):  npm run voz -- E1
//   3) Solo diseño, sin voz:  npm run voz -- E1 --simulado
import fs from "node:fs";
import path from "node:path";
import { carpetaVideo } from "./rutas.mjs";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
const simulado = args.includes("--simulado");
const iAudio = args.indexOf("--audio");
const audioIn = iAudio >= 0 ? args[iAudio + 1] : null;
if (!id) { console.error("Falta el id. Ej: npm run voz -- E1 --audio audio.mp3"); process.exit(1); }

const raiz = path.resolve(import.meta.dirname, "..");
const guionPath = path.join(carpetaVideo(id), "guion.json");
if (!fs.existsSync(guionPath)) { console.error(`No existe ${guionPath}`); process.exit(1); }
const guion = JSON.parse(fs.readFileSync(guionPath, "utf8"));
const config = JSON.parse(fs.readFileSync(path.join(raiz, "config.json"), "utf8"));
const fps = config.fps ?? 30;

// Palabras del guion y a qué escena pertenece cada una
const palabrasGuion = [];
const rangoEscena = guion.escenas.map((e) => {
  const ws = e.texto.trim().split(/\s+/);
  const ini = palabrasGuion.length;
  palabrasGuion.push(...ws);
  return [ini, palabrasGuion.length - 1];
});
const completo = palabrasGuion.join(" ");
const N = palabrasGuion.length;
let tiempos; // [{start,end}] por palabra del guion
let audioB64 = null, metodo = "";

const sh = (cmd, a) => spawnSync(cmd, a, { encoding: "utf8" });
const duracionAudio = (f) => parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout);

if (simulado) {
  const pps = 15, w = palabrasGuion.map((p) => p.length + 1);
  let t = 0.2;
  tiempos = w.map((l) => { const s = t; t += l / pps; return { start: s, end: t - 0.04 }; });
  metodo = "SIMULADO, sin audio";
} else if (audioIn) {
  if (!fs.existsSync(audioIn)) { console.error("No encuentro el archivo:", audioIn); process.exit(1); }
  fs.mkdirSync(path.join(raiz, "public/voz"), { recursive: true });
  const destino = path.join(raiz, `public/voz/${id}.mp3`);
  const r = sh("ffmpeg", ["-y", "-loglevel", "error", "-i", audioIn, "-vn", "-ar", "44100", "-b:a", "128k", destino]);
  if (r.status !== 0) { console.error("ffmpeg no pudo leer el audio (¿está instalado ffmpeg?):", r.stderr); process.exit(1); }
  const dur = duracionAudio(destino);
  // Intento 1: Whisper local (preciso). Se instala una vez con `npm run whisper`.
  let whisperWords = null;
  const wDir = path.join(raiz, "whisper");
  if (fs.existsSync(path.join(wDir, "listo.json"))) {
    try {
      const { transcribe } = await import("@remotion/install-whisper-cpp");
      const info = JSON.parse(fs.readFileSync(path.join(wDir, "listo.json"), "utf8"));
      const wav = path.join(wDir, `${id}.wav`);
      sh("ffmpeg", ["-y", "-loglevel", "error", "-i", destino, "-ar", "16000", "-ac", "1", wav]);
      const out = await transcribe({
        inputPath: wav, whisperPath: path.join(wDir, "whisper.cpp"), whisperCppVersion: info.version,
        model: info.model, modelFolder: wDir, tokenLevelTimestamps: true, language: "es", splitOnWord: true,
      });
      whisperWords = out.transcription
        .map((x) => ({ t: x.text.trim(), start: x.offsets.from / 1000, end: x.offsets.to / 1000 }))
        .filter((x) => x.t && !/^[\[\(].*[\]\)]$/.test(x.t));
    } catch (e) { console.warn("Whisper falló, uso estimación por proporción:", e.message); }
  }
  if (whisperWords?.length >= N * 0.8) {
    const W = whisperWords.length;
    tiempos = palabrasGuion.map((_, i) => {
      const a = whisperWords[Math.min(W - 1, Math.floor((i * W) / N))];
      const b = whisperWords[Math.min(W - 1, Math.max(0, Math.ceil(((i + 1) * W) / N) - 1))];
      return { start: a.start, end: Math.max(a.start + 0.05, b.end) };
    });
    metodo = `audio ${dur.toFixed(1)} s, tiempos con Whisper`;
  } else {
    // Intento 2: reparto proporcional a la longitud de cada palabra (impreciso; sirve para probar)
    const lead = 0.15, cola = 0.3, total = Math.max(1, dur - lead - cola);
    const pesos = palabrasGuion.map((p) => p.length + 2 + (/[.,;:!?]$/.test(p) ? 4 : 0));
    const suma = pesos.reduce((a, b) => a + b, 0);
    let t = lead;
    tiempos = pesos.map((p) => { const d = (p / suma) * total; const s = t; t += d; return { start: s, end: t - 0.03 }; });
    metodo = `audio ${dur.toFixed(1)} s, tiempos ESTIMADOS (instala Whisper con npm run whisper para precisión)`;
  }
  fs.writeFileSync(path.join(raiz, `public/datos/.dur-${id}`), String(dur));
} else {
  const envPath = path.join(raiz, ".env");
  if (fs.existsSync(envPath)) {
    for (const l of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
  const key = process.env.ELEVENLABS_API_KEY, v = config.voz;
  if (!key) { console.error("Sin ELEVENLABS_API_KEY. Usa el flujo manual: --audio archivo.mp3 (ver README)."); process.exit(1); }
  if (!v.voice_id || v.voice_id.startsWith("PON_AQUI")) { console.error("Falta voice_id en config.json"); process.exit(1); }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice_id}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text: completo, model_id: v.model_id, voice_settings: { stability: v.stability, similarity_boost: v.similarity_boost, style: v.style } }),
  });
  if (!res.ok) { console.error("Error ElevenLabs:", res.status, await res.text()); process.exit(1); }
  const j = await res.json();
  audioB64 = j.audio_base64;
  const { characters: ch, character_start_times_seconds: cs, character_end_times_seconds: ce } = j.alignment;
  const ws = []; let buf = "", t0 = 0;
  ch.forEach((c, i) => {
    if (/\s/.test(c)) { if (buf) ws.push({ start: t0, end: ce[i - 1] }); buf = ""; }
    else { if (!buf) t0 = cs[i]; buf += c; }
  });
  if (buf) ws.push({ start: t0, end: ce[ch.length - 1] });
  tiempos = ws;
  metodo = "voz por API";
}

// Escenas: empiezan donde empieza su primera palabra
const escenas = guion.escenas.map((e, i) => {
  const [a, b] = rangoEscena[i];
  return { ...e, inicio: i === 0 ? 0 : +tiempos[a].start.toFixed(3), fin: +tiempos[b].end.toFixed(3) };
});
const palabras = palabrasGuion.map((w, i) => ({ w, start: +tiempos[i].start.toFixed(3), end: +tiempos[i].end.toFixed(3) }));
let duracion = +(tiempos[N - 1].end + 0.6).toFixed(2);
const durFile = path.join(raiz, `public/datos/.dur-${id}`);
if (audioIn && fs.existsSync(durFile)) { duracion = +(Math.max(duracion, parseFloat(fs.readFileSync(durFile, "utf8")))).toFixed(2); fs.unlinkSync(durFile); }

fs.mkdirSync(path.join(raiz, "public/datos"), { recursive: true });
let vozRuta;
if (audioB64) {
  fs.mkdirSync(path.join(raiz, "public/voz"), { recursive: true });
  fs.writeFileSync(path.join(raiz, `public/voz/${id}.mp3`), Buffer.from(audioB64, "base64"));
}
if (audioB64 || audioIn) vozRuta = `voz/${id}.mp3`;
const datos = { id, titulo: guion.titulo, nicho: guion.nicho ?? "otro", plantilla: guion.plantilla, fps, voz: vozRuta, duracion, palabras, escenas };
fs.writeFileSync(path.join(raiz, `public/datos/${id}.json`), JSON.stringify(datos, null, 2));
console.log(`OK ${id}: ${N} palabras, ${duracion}s (${metodo})`);
