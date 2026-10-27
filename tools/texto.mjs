#!/usr/bin/env node
// Uso: npm run texto -- E1  → imprime el texto EXACTO para pegar en ElevenLabs (y lo guarda en videos/E1/texto-voz.txt)
import fs from "node:fs";
import path from "node:path";
import { carpetaVideo } from "./rutas.mjs";
const id = process.argv[2];
if (!id) { console.error("Ej: npm run texto -- E1"); process.exit(1); }
const raiz = path.resolve(import.meta.dirname, "..");
const g = JSON.parse(fs.readFileSync(path.join(carpetaVideo(id), "guion.json"), "utf8"));
// "pausa" en una escena → etiqueta de pausa de ElevenLabs (modelos v2)
const t = g.escenas.map((e) => e.texto.trim() + (e.pausa ? ` <break time="${e.pausa}s" />` : "")).join(" ");
fs.writeFileSync(path.join(carpetaVideo(id), "texto-voz.txt"), t + "\n");
console.log(t + `\n\n(${t.replace(/<[^>]+>/g, "").split(/\s+/).length} palabras, ${t.length} caracteres → créditos aprox. en ElevenLabs)`);
console.log("\nPega este texto tal cual en ElevenLabs. No lo cambies: los subtítulos y escenas se sincronizan con él.");
