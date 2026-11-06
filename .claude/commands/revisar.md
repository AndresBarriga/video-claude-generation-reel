---
description: Revisión final de un vídeo renderizado (guion, sonido, volumen, negros, voz) antes de enseñarlo
argument-hint: "<id>"
---
Revisa `$ARGUMENTS` antes de enseñarlo a Andrés, en este orden y sin parar entre pasos:
1. `npm run qa -- <id>` (guion, tiempos, rótulos, reglas y anclas de `sonido.json`).
2. Si hay `public/voz/<id>.mp3` y Whisper instalado: `npm run verificar-voz -- <id>`. Sin Whisper, dilo en una línea y sigue.
3. `npm run qa-final -- <id>` sobre `final.mp4` (LUFS, pico, negros, 1080×1920).
4. `npm run hoja -- <id>` y repasa la hoja con `docs/guia-visual.md`.
Corrige lo que sea tuyo (máx. 2 rondas). Entrega un resumen de 3–5 líneas: qué falló, qué arreglaste, qué queda. Si cambias algo, commit + push (sin mp4).
