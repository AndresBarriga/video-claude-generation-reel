---
description: Produce un vídeo aprobado (con o sin audio) y lo revisa contra la guía visual
argument-hint: "<id> [ruta del audio]"
---
Produce `$ARGUMENTS`. Si hay audio: `npm run voz -- <id> --audio <ruta>`; si no: `--simulado`. Construye/ajusta la plantilla en `src/historias/`, renderiza, extrae un fotograma por escena y pásalos por la lista de revisión de `docs/guia-visual.md`. Corrige hasta que pase. Entrega el vídeo, una hoja de contacto de escenas y `publicacion.md` (descripción con "mándaselo a…", pregunta, 3–5 hashtags). Commit + push (sin mp4).
