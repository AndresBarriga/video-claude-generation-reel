#!/usr/bin/env node
// Uso: npm run verificar-voz -- E35
// Transcribe el audio de ElevenLabs (public/voz/<id>.mp3) con Whisper y lo compara con el guion:
// detecta palabras saltadas, cambiadas o inventadas ANTES de renderizar. Necesita `npm run whisper` (una vez, en tu máquina).
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { carpetaVideo, raiz } from "./rutas.mjs";

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();
const palabras = (s) => norm(s).split(" ").filter(Boolean);

const NUM = new Set("cero uno una un dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte veinti treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento doscientos trescientos cuatrocientos quinientos seiscientos setecientos ochocientos novecientos mil millon millones primera primero segundo".split(" "));

/** Compara por subsecuencia común más larga. Las cifras se ignoran (el guion las escribe en letras y Whisper en dígitos). */
export function comparar(esperado, oido) {
  const hayDigitos = palabras(oido).some((w) => /\d/.test(w));
  const e = palabras(esperado).filter((w) => !/\d/.test(w) && !(hayDigitos && NUM.has(w))), o = palabras(oido).filter((w) => !/\d/.test(w));
  const n = e.length, m = o.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = e[i] === o[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const faltan = [], sobran = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (e[i] === o[j]) { i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) faltan.push({ pos: i, w: e[i++] });
    else sobran.push({ pos: i, w: o[j++] });
  }
  while (i < n) faltan.push({ pos: i, w: e[i++] });
  while (j < m) sobran.push({ pos: n, w: o[j++] });
  return { total: n, cobertura: n ? (n - faltan.length) / n : 1, faltan, sobran, contexto: (p) => e.slice(Math.max(0, p - 3), p + 3).join(" ") };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const id = process.argv[2];
  if (!id) { console.error("Falta el id. Ej: npm run verificar-voz -- E35"); process.exit(1); }
  const guion = JSON.parse(fs.readFileSync(path.join(carpetaVideo(id), "guion.json"), "utf8"));
  const audio = path.join(raiz, `public/voz/${id}.mp3`), wDir = path.join(raiz, "whisper");
  if (!fs.existsSync(audio)) { console.error(`No hay ${audio}. Sincroniza antes: npm run voz -- ${id} --audio ruta.mp3`); process.exit(1); }
  if (!fs.existsSync(path.join(wDir, "listo.json"))) { console.error("Whisper no está instalado (npm run whisper, ~500 MB, en tu ordenador; en la nube de Claude no se puede descargar). Escucha el audio a mano."); process.exit(2); }
  const { transcribe } = await import("@remotion/install-whisper-cpp");
  const info = JSON.parse(fs.readFileSync(path.join(wDir, "listo.json"), "utf8"));
  const wav = path.join(wDir, `${id}.verif.wav`);
  spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", audio, "-ar", "16000", "-ac", "1", wav]);
  const out = await transcribe({ inputPath: wav, whisperPath: path.join(wDir, "whisper.cpp"), whisperCppVersion: info.version, model: info.model, modelFolder: wDir, language: "es" });
  fs.unlinkSync(wav);
  const oido = out.transcription.map((x) => x.text).join(" ");
  const r = comparar(guion.escenas.map((e) => e.texto).join(" "), oido);
  console.log(`VOZ ${id}: ${(r.cobertura * 100).toFixed(0)}% del guion está en el audio (${r.total} palabras)`);
  r.faltan.slice(0, 12).forEach((f) => console.log(`  ✗ falta «${f.w}»  …${r.contexto(f.pos)}…`));
  r.sobran.slice(0, 8).forEach((s) => console.log(`  ! suena «${s.w}» que no está en el guion  …${r.contexto(s.pos)}…`));
  console.log("  (Whisper se equivoca con nombres propios y cifras: comprueba escuchando solo lo marcado.)");
  process.exit(r.cobertura < 0.8 ? 1 : 0);
}
