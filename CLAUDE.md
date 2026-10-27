# Reels animados — repo de producción

Cuenta anónima de reels animados en español de España (Instagram + TikTok). Test escalada vs mascotas hasta el **30-nov-2026**. Este repo es la memoria compartida de todos los chats del proyecto: lo que no está aquí no existe.

## Al empezar un chat
1. Lee `docs/proceso.md` (qué chat hace qué y el ciclo por lote) y `docs/estrategia.md`.
2. Si vas a producir: lee `docs/guia-visual.md` (estándar obligatorio) y la lista de ideas de tu nicho en `docs/ideas/`.
3. `npm install` si no hay `node_modules`. Chromium para renderizar: si existe `/opt/pw-browsers`, exporta `BROWSER_EXE=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome | head -1)`.

## Cómo trabajar con Andrés
- Directo, breve, crítico. En español. Decide lo decidible y di qué decidiste; pregunta solo lo que cambia el resultado.
- Lo que más importa, en este orden: **gancho → retención → visuales → envíos/comentarios**. Un vídeo correcto pero sin gancho no sirve.
- Pocas interacciones: trabaja por lotes de 3 vídeos con una página de storyboard (ver `docs/proceso.md`). No le enseñes nada que no pase la lista de revisión de `docs/guia-visual.md`.
- Al terminar algo: commit + push. Si cambia una decisión, añádela al registro en `docs/estrategia.md`.

## Cada guion
- Gancho que pone al espectador DENTRO de la situación ("Tu amigo cuelga de tu cuerda…") o que le etiqueta ("Eres de los que…"). ≤14 palabras, se entiende en 3 s.
- Segundo gancho a mitad (giro, "y no", contador). Final en bucle con el inicio + pregunta que provoque comentarios. El envío ("mándaselo a…") va en la descripción.
- 35–55 s según historia (identidad ~35 s, historia ~50 s). Escribir como se habla (cifras en palabras).
- Rigor: ver `docs/proceso.md` (suficiente, no paralizante; estricto en salud/seguridad).

## Estructura
- `videos/<nicho>/<id>/guion.json` (escenas con `texto` hablado, `visual` = escena a medida, `titulo` = rótulo de dato) · `publicacion.md` · `final.mp4` (no se sube a git).
- `src/historias/<Plantilla>.tsx`: escenas a medida por vídeo (ej. `Vacio.tsx` para E15). `src/piezas/`: personajes y elementos reutilizables (crear y ampliar aquí).
- `src/Reel.tsx`: plantilla genérica antigua de tarjetas de texto. **No usar para vídeos publicables**; solo pruebas.
- Herramientas: `npm run texto -- <id>` (texto para ElevenLabs) · `npm run voz -- <id> --audio ruta` (sincroniza audio subido; `--simulado` sin audio) · `npm run qa -- <id>` · `npm run render -- <id>` · `npm run fotograma -- <id> <segundo>` (imagen fija para storyboard) · `npm run whisper` (una vez, mejora la sincronía).

## Técnico
- Remotion 4.0.539 fijado. 1080×1920, 30 fps. Fuentes locales en `public/fuentes` (no depender de Google Fonts).
- Tras renderizar, mira fotogramas antes de entregar. Si algo falla dos veces, para y explícalo.
- Audio solo con plan de pago activo de ElevenLabs para lo que se publique. Nunca claves en el repo.
