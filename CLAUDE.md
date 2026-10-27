# Reels animados — repo de producción

Cuenta anónima de reels animados en español de España (Instagram + TikTok), probando escalada y mascotas. Este repo es la memoria compartida de todos los chats del proyecto: lo que no está aquí no existe.

## Al empezar un chat
1. Lee `docs/proceso.md` (qué chat hace qué y el ciclo por lote), `docs/estrategia.md` y **`docs/viralidad.md` (obligatorio para cualquier guion)**.
2. Si vas a producir: lee `docs/guia-visual.md` (estándar obligatorio), `docs/no-me-gusta.md` y la lista de ideas de tu nicho en `docs/ideas/`.
3. `npm install` si no hay `node_modules`. Chromium para renderizar: si existe `/opt/pw-browsers`, exporta `BROWSER_EXE=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome | head -1)`.

## Cómo trabajar con Andrés
- **Vídeo nuevo = primero una propuesta, luego producir.** Antes de escribir código o renderizar, entrega en un solo mensaje (barato, sin render de vídeo):
  1. Tu opinión en 2–3 líneas: si la idea es buena, el riesgo principal y qué cambiarías.
  2. 5 aperturas y la que eliges.
  3. Guion puntuado (`docs/viralidad.md`), escena por escena: qué se ve / qué se dice.
  4. Reparto y la idea visual que recorre el vídeo, y como mucho 2–3 bocetos (fotogramas fijos rápidos) si ayudan.
  **Antes de enseñarla, pásala por el subagente `critico`** (Agent con `subagent_type: critico`): aplica lo que tenga razón y añade a la propuesta su veredicto y su nota de envío en una línea. Haz lo mismo con el vídeo terminado (hoja de escenas + guion).
  Espera su OK o sus cambios. Después produce sin interrumpir.
- **Todo lo demás (correcciones, cambios concretos, tareas claras): haz, no pidas permiso.** No termines con "¿arranco?" ni ofrezcas opciones que no ha pedido.
- **Andrés decide ritmo, orden y fechas.** Calendario y test son orientativos: no frenes la producción por ellos ni le sermonees sobre "romper el test". Si ves un riesgo real, dilo en una línea y sigue trabajando.
- **Enseña pronto.** Mejor un borrador visible (fotogramas, vídeo) que un plan o una lista de problemas. Revisa con `docs/guia-visual.md` antes de enseñar, pero no esperes a la perfección.
- Directo, breve, crítico cuando aporte. En español.
- Prioridad: **gancho → retención → visuales → envíos/comentarios**.
- Puede ser un vídeo suelto o un lote; lo que pida Andrés.
- Al terminar algo: commit + push. Si cambia una decisión, añádela al registro en `docs/estrategia.md`.
- Si Andrés rechaza o elogia algo concreto, añádelo a `docs/no-me-gusta.md` en ese momento.

## Cada guion
- **Aplica `docs/viralidad.md` siempre, sin que Andrés lo pida**: clímax en el segundo 1, espectador dentro, bucle abierto antes de 5 s, segundo gancho, causa visible, final que vuelve a su vida, envío/comentario/bucle con mecanismo.
- Antes de enseñar un guion, puntúalo con la tabla de `docs/viralidad.md` (≥12/14) **y pásalo por el `critico`**. La tabla sola no basta: te puntúas a ti mismo. Lo que manda es la nota de envío del crítico (≥7/10) y el test del mensaje de `docs/referencias.md`.
- **Un formato y un público por vídeo** (vía *o* bloque; historia *o* consejo).
- Si Andrés ya ha aprobado un guion pero ves que puntúa bajo, dilo y propón la versión mejorada; no lo produzcas tal cual.
- 35–55 s según historia (identidad ~35 s, historia ~50 s). Escribir como se habla (cifras en palabras).
- Rigor: ver `docs/proceso.md` (suficiente, no paralizante; estricto en salud/seguridad).

## Estructura
- `videos/<nicho>/<id>/guion.json` (escenas con `texto` hablado, `visual` = escena a medida, `titulo` = rótulo de dato, `pausa` = silencio en s) · `sonido.json` · `publicacion.md` · `final.mp4` (no se sube a git).
- `src/historias/<Plantilla>.tsx`: escenas a medida por vídeo (ej. `Vacio.tsx` para E15). `src/piezas/`: personajes y elementos reutilizables (`Escalador.tsx`: Joe/Simon con poses por ángulos y caras; `Grano.tsx`: grano + viñeta). Hoja de poses: plantilla `Poses` con `public/datos/_poses.json`.
- `src/Reel.tsx`: plantilla genérica antigua de tarjetas de texto. **No usar para vídeos publicables**; solo pruebas.
- Herramientas: `npm run texto -- <id>` (texto para ElevenLabs) · `npm run voz -- <id> --audio ruta` (sincroniza audio subido; `--simulado` sin audio) · `npm run qa -- <id>` · `npm run render -- <id>` · `npm run fotograma -- <id> <segundo>` (imagen fija para storyboard) · `npm run hoja -- <id>` (un fotograma por escena + hoja de contacto en `out/<id>-hoja.png`; `MOMENTOS=24.5,25` añade instantes) · `npm run sonido -- <id>` (efectos de `sonido.json`, ver `docs/sonido.md`) · `npm run whisper` (una vez, mejora la sincronía).

## Si no eres Andrés
Lee `docs/colaborar.md`: rama por vídeo, pull request, sin tocar los gustos de Andrés, voz la genera él.

## Ahorro de tokens
- Un chat por vídeo; ciérralo cuando el vídeo esté publicado. El estado vive en el repo, no en el chat.
- No leas archivos grandes enteros: busca con grep y lee solo el trozo (offset/limit). Plantillas nuevas: **una escena por archivo** en `src/historias/<Plantilla>/` (< 150 líneas cada uno).
- Revisa con **una** hoja de contacto (`npm run hoja`), no fotograma a fotograma; mira fotogramas sueltos solo de lo que falla. Máximo 2 rondas de corrección antes de enseñar.
- Silencia la salida de render y npm (`| tail -3`).
- Docs: añade, no dupliques. Si un doc pasa de ~8 KB, condénsalo.

## Técnico
- Remotion 4.0.539 fijado. 1080×1920, 30 fps. Fuentes locales en `public/fuentes` (no depender de Google Fonts).
- Tras renderizar, mira fotogramas antes de entregar. Si algo falla dos veces, para y explícalo.
- Audio solo con plan de pago activo de ElevenLabs para lo que se publique. Nunca claves en el repo.
