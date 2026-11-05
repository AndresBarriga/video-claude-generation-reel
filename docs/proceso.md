# Proceso de trabajo

## Chats del proyecto (todos usan este repo)
| Chat | Para qué | Escribe en |
|---|---|---|
| **Estrategia** | pensar, decidir, orden de publicación, revisar métricas | `docs/estrategia.md`, `docs/decisiones.md`, `docs/aprendizajes.md`, `datos/publicados.csv` |
| **Escalada** | ideas, storyboards y vídeos de escalada | `docs/ideas/escalada.md`, `videos/escalada/` |
| **Mascotas** | ideas, storyboards y vídeos de mascotas | `docs/ideas/mascotas.md`, `videos/mascotas/` |

- Cada chat empieza leyendo `CLAUDE.md` y los docs que le tocan. El repo es la memoria: nada importante vive solo en el chat.
- Cambios en código compartido (`src/piezas`, `src/Subtitulos.tsx`, `tools/`): `git pull --rebase` antes y commit pequeño después. Cada chat solo toca su carpeta de vídeos.
- Un chat nuevo cuando uno se alarga (>~2 lotes). Al cerrar, todo debe estar en commits.

## Ciclo de un vídeo (o de un lote; ≈2 interacciones de Andrés por vídeo)
La propuesta (paso 1) no se salta salvo que Andrés diga explícitamente «produce directamente».
1. **Propuesta (Claude), siempre antes de producir:** opinión breve, 5 aperturas, guion puntuado con qué se ve / qué se dice, reparto e idea visual, y 2–3 bocetos fijos si ayudan. Es barato: corregir aquí cuesta mucho menos que tras el render.
2. **Revisión (Andrés, 1 mensaje):** elige gancho y pide cambios.
3. **Producción (Claude, sin interrumpir):** construye, renderiza con tiempos simulados, revisa fotogramas con la lista de `docs/guia-visual.md`, corrige.
4. **Voz (Andrés):** `npm run texto -- <id>` → pega el texto en ElevenLabs → sube el audio al chat.
5. **Final (Claude → Andrés):** sincroniza, renderiza, entrega `final.mp4` + `ficha.md` (con la descripción para publicar). Andrés aprueba o pide un último ajuste.

## Rigor (suficiente, no paralizante)
- Historias famosas e ideas de identidad: una comprobación rápida de los hechos clave basta; sin fuente en pantalla.
- Cifras o estudios: fuente en `guion.json` y, si la cifra es el clímax, rótulo pequeño en pantalla.
- Salud y seguridad: estrictos (nada de instrucciones; "aprende con un instructor"/"consulta al veterinario").
- **Guion visual (desde E46):** junto al texto de cada escena, escribe la imagen más impactante posible (escala, movimiento, primer plano, qué hace el espectador al verla), no solo qué se ve. El gancho visual cuenta tanto como el verbal.
