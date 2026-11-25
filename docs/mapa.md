# Mapa del proyecto (qué tenemos y cómo se construye un vídeo)

Para no perder el rastro. Si algo no está aquí, búscalo en el sitio que indica la tabla. Actualizar cuando cambie una pieza.

## 1. Dónde vive cada cosa
| Quiero saber… | Dónde |
|---|---|
| Qué vídeos hay y en qué estado, la cola y qué toca | **`docs/dashboard.html`** (`npm run dashboard`); la cola es «Resumen de estado» en `docs/ideas/escalada.md` |
| Cómo se hace un vídeo de información | **`docs/formato.md`** (formato fijo, manda) |
| Reglas de trabajo con Andrés y de cada guion | `CLAUDE.md` |
| Qué hacemos ahora y por qué | `docs/estrategia.md` · historial en `docs/decisiones.md` |
| Qué ha funcionado (datos) | `datos/publicados.csv` · `docs/resultados.md` · hipótesis en `docs/aprendizajes.md` (+ pruebas en `datos/pruebas.json`) |
| Qué no le gusta / le gusta a Andrés | `docs/no-me-gusta.md` |
| Cuentas que funcionan y por qué | `docs/referencias.md` |
| Estándar visual | `docs/guia-visual.md` · personajes y material en `docs/kit.md` |
| Sonido | `docs/sonido.md` |
| Ideas | `docs/ideas/escalada.md` (por zonas + cola arriba) |
| Notas del crítico | `docs/criticas.md` · `datos/notas-critico.json` |
| Un vídeo concreto | `videos/escalada/<id>/` (propuesta, guion, sonido, voz, ficha con resultado y descripción) · vista previa en `previews/<id>.mp4` |

## 2. Piezas de código
- **Plantillas por vídeo:** `src/historias/<Nombre>/` (una escena por archivo), registradas en `src/Root.tsx`. Hay ~30 (E15 `Vacio`, E59 `Chapa`, E60 `Agarra`, E62 `Freno`, E63 `Gatos`, E64 `Cinta`…).
- **Kit reutilizable `src/piezas/kit`:**
  - Cuerda: vías, poses, física de caídas, asegurador, cuerda, cintas, decorados roca/sala/cueva, primeros planos (mano, grigri, ocho, mosquetón), acciones (escalar, chapar, caer, descolgar). Catálogo: `npm run catalogo`.
  - Montaje: `Pregunta`, `Chip`, `Lupa`, `Partida`, `Sello`, `Envio`.
  - **Info (formato fijo):** `FondoInfo`, `Cifra`, `Personitas`, `Barra`, `Manometro`, `Nota`, `Pasos`, `Tarjeta`, `Cronos`, `RayosX`, `Guardar`, `HojaEnviar`. Muestrario: `npm run fotograma -- _info <s>`.
- **Subtítulos:** `src/Subtitulos.tsx`; formato fijo = `estilo="arriba"` + `claves`.
- **Personajes antiguos:** `src/piezas/Escalador.tsx` (Joe/Simon, caras).

## 3. Cómo se construye un vídeo (pasos)
1. **Idea** → en la cola (`docs/ideas/escalada.md`).
2. **Propuesta** (`videos/escalada/<id>/propuesta.md`), sin render:
   - opinión;
   - 5 aperturas;
   - guion por bloques del formato (qué se ve / qué se dice);
   - las 4 preguntas;
   - la tabla de `formato.md`.

   → **crítico** (una pasada) → línea en `docs/criticas.md` → a Andrés.
3. **OK de Andrés** → `guion.json` (`"formato": "fijo"`, `bloque`, `claves`, `cifras` por escena) → `npm run texto -- <id>` (texto para ElevenLabs) → **Andrés graba la voz**.
4. **Voz:** `npm run voz -- <id> --audio voz.mp3` (+ `frases` / `ajustar-tiempos.py` si se desincroniza).
5. **Escenas:** plantilla nueva en `src/historias/<Nombre>/` usando el kit; `npm run sonido -- <id>`; `npm run qa -- <id>`.
6. **Revisión:** `npm run hoja -- <id>` (una hoja de contacto) → como mucho 2 rondas de corrección.
7. **Render:** `npm run render -- <id>` → `npm run qa-final -- <id>` → `previews/<id>.mp4` → ficha con descripción y comentario fijado → commit + push → a Andrés.
8. **Publicado:** las cifras de Instagram entran solas cada mañana (Action, `docs/metricas-api.md`); por captura solo la curva de retención y los seguidores reales de los que destaquen (`npm run medir`).

## 4. Pendiente de construir
- **TODO de estrategia vigente: `docs/todo.md`** (aprendizajes en `docs/referencias-skills.md`).

- Mini web para Andrés (ver todo más fácil): el dashboard es la base; ampliar con cola, propuestas y vídeos navegables.
- Monetización: checklist gratis + DM automático («Comenta CUERDA») cuando el formato dé 3 vídeos ≥ 20K.
