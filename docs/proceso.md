# Proceso de trabajo

## Chats del proyecto (todos usan este repo)
| Chat | Para qué | Escribe en |
|---|---|---|
| **Estrategia** | pensar, decidir, orden de publicación, revisar métricas | `docs/estrategia.md`, `docs/calendario.md` |
| **Escalada** | ideas, storyboards y vídeos de escalada | `docs/ideas/escalada.md`, `videos/escalada/` |
| **Mascotas** | ideas, storyboards y vídeos de mascotas | `docs/ideas/mascotas.md`, `videos/mascotas/` |

- Cada chat empieza leyendo `CLAUDE.md` y los docs que le tocan. El repo es la memoria: nada importante vive solo en el chat.
- Cambios en código compartido (`src/piezas`, `src/Subtitulos.tsx`, `tools/`): `git pull --rebase` antes y commit pequeño después. Cada chat solo toca su carpeta de vídeos.
- Un chat nuevo cuando uno se alarga (>~2 lotes). Al cerrar, todo debe estar en commits.

## Ciclo por lote de 3 vídeos (≈2 interacciones de Andrés por vídeo)
1. **Storyboard (Claude):** para cada vídeo, 3 ganchos, secuencia de escenas (qué se ve / qué se dice) y 4–6 fotogramas clave renderizados como imagen fija (`npm run fotograma`). Todo en una página de revisión publicada.
2. **Revisión (Andrés, 1 mensaje):** elige gancho y pide cambios.
3. **Producción (Claude, sin interrumpir):** construye, renderiza con tiempos simulados, revisa fotogramas con la lista de `docs/guia-visual.md`, corrige.
4. **Voz (Andrés):** `npm run texto -- <id>` → pega el texto en ElevenLabs → sube el audio al chat.
5. **Final (Claude → Andrés):** sincroniza, renderiza, entrega `final.mp4` + `publicacion.md`. Andrés aprueba o pide un último ajuste.

## Rigor (suficiente, no paralizante)
- Historias famosas e ideas de identidad: una comprobación rápida de los hechos clave basta; sin fuente en pantalla.
- Cifras o estudios: fuente en `guion.json` y, si la cifra es el clímax, rótulo pequeño en pantalla.
- Salud y seguridad: estrictos (nada de instrucciones; "aprende con un instructor"/"consulta al veterinario").
