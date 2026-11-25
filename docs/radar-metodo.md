# Radar de virales: cuentas de referencia y reverse engineering (25-nov)
## Automático, sin que Andrés pase vídeos
1. **Lunes 06:41 — Action «Radar de virales»** (`tools/radar.mjs`, Business Discovery con el `IG_TOKEN` de métricas, coste 0): reels de 60 días de `datos/radar-cuentas.json` → `docs/radar.md` (ranking, outliers ≥3× la mediana de su cuenta, cuentas candidatas sacadas de las @menciones de las referencias).
2. Misma Action, `tools/radar-media.py`: de hasta 8 outliers nuevos baja el MP4 (solo si el dueño permite descargas), guarda fotogramas + transcripción (faster-whisper) + pie en `radar/<cuenta>-<id>/` y borra el vídeo.
3. **Lunes 09:23 — tarea programada de Claude**: lee `docs/radar.md` y `radar/`, desmonta cada outlier con el método de abajo, apunta en `docs/referencias.md`, propone 3 ideas en `docs/ideas/escalada.md` (sección «Del radar») y añade a `datos/radar-cuentas.json` las candidatas que sean de divulgación. Commit + push.
Andrés solo: leer las ideas del lunes y, si quiere, mirar en el móvil los reels enlazados. Límites: sin retención ni comentarios de cuentas ajenas; sin vídeo de las que desactivan descargas (queda pie + cifras).

## 1. Encontrar cuentas (el radar propone candidatas por @menciones; a mano, 10 min, para arrancar)
- **Sugeridas de Instagram:** en el perfil de cada referencia, flecha ▾ junto a «Seguir» → apuntar las de divulgación de escalada. Es la mejor fuente: el algoritmo ya agrupa el nicho.
- **Explorar y Reels con @ultimo.pegue**: las cuentas que salgan 2+ veces.
- **Inglés:** el nicho en español es pequeño; las ideas que ya funcionaron en inglés y aún no existen en español son la mejor fuente de temas.
- Se queda una cuenta si: divulgación (no atleta ni marca), publica reels con regularidad y en el radar sale con **outliers ≥3×** o **vistas/seguidor alto**. Las cuentas enormes inflan las vistas por tamaño: pesan menos.

## 2. Reverse engineering de un outlier (método de `viral-reverse-engineering`, social-media-skills, MIT; no instalada)
Claude no ve el vídeo desde el enlace. Entrada: grabación de pantalla de Andrés (fotogramas + voz) o como mínimo pie + comentarios principales + cifras.
1. **Desmontar** en una línea por capa: gancho (0–3 s), detonante emocional, estructura de retención, formato, tema/ángulo, motivo de envío, distribución (CTA con palabra clave, colaboración, tamaño).
2. **Contrafactual:** «si quito esto, ¿sigue funcionando?». Lo que no se puede quitar es el motor (normalmente 1–2: gancho + motivo de envío); lo demás es ruido.
3. **Motivo de envío:** por qué se lo mandan a alguien (identidad, emoción fuerte, utilidad, «es como tú»). Los comentarios son la prueba.
4. **¿Se puede repetir?** Descartar si lo explica el tamaño de la cuenta, un momento puntual, la suerte o un CTA de sorteo. Un viral suelto es anécdota: buscar el mismo motor en ≥2 cuentas.
5. **Principio en una línea → aplicado a nuestro tema** con el ciclo normal (`docs/proceso.md`, `docs/viralidad.md`).
**Qué se copia (25-nov, Andrés: «copia igual no, subliminal sí»):** sí el tema, el patrón de gancho, el orden de bloques, el ritmo, la composición de planos y la metáfora visual; no el texto literal, sus personajes ni una secuencia plano a plano reconocible. Riesgo: Instagram reparte menos alcance al contenido que detecta como no original.
Guardar cada desmontaje en `docs/referencias.md` y los motores que se repiten como hipótesis en `docs/aprendizajes.md`.
