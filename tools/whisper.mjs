#!/usr/bin/env node
// Instala Whisper (transcripción local) UNA vez, para sincronizar subtítulos con tu audio. Descarga ~500 MB.
import fs from "node:fs";
import path from "node:path";
import { installWhisperCpp, downloadWhisperModel } from "@remotion/install-whisper-cpp";
const raiz = path.resolve(import.meta.dirname, "..");
const dir = path.join(raiz, "whisper");
const version = "1.5.5", model = "small";
fs.mkdirSync(dir, { recursive: true });
await installWhisperCpp({ to: path.join(dir, "whisper.cpp"), version });
await downloadWhisperModel({ model, folder: dir });
fs.writeFileSync(path.join(dir, "listo.json"), JSON.stringify({ version, model }));
console.log("Whisper listo. Ya puedes usar: npm run voz -- E1 --audio tu_audio.mp3");
