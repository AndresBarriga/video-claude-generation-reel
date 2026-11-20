# Reels animados — repo de producción

Cuenta anónima de reels animados en español de España (Instagram + TikTok), probando escalada y mascotas. Este repo es la memoria compartida de todos los chats del proyecto: lo que no está aquí no existe.

## Al empezar un chat
1. **Mapa de todo: `docs/mapa.md`.** Lee `docs/proceso.md` (qué chat hace qué y el ciclo por lote), `docs/estrategia.md` (lo vigente), `docs/aprendizajes.md` (hipótesis con datos) y **`docs/viralidad.md` (obligatorio para cualquier guion)**. Historial de decisiones en `docs/decisiones.md`; docs antiguos en `archivo/` (no hace falta leerlos).
2. Si vas a producir: lee `docs/guia-visual.md` (estándar obligatorio), `docs/no-me-gusta.md` y la lista de ideas de tu nicho en `docs/ideas/`.
3. `npm install` si no hay `node_modules`. Chromium para renderizar: si existe `/opt/pw-browsers`, exporta `BROWSER_EXE=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome | head -1)`.

## Cómo trabajar con Andrés
- **Vídeo nuevo = primero una propuesta, luego producir.** Antes de escribir código o renderizar, entrega en un solo mensaje (barato, sin render de vídeo):
  1. Tu opinión en 2–3 líneas: si la idea es buena, el riesgo principal y qué cambiarías.
  2. 5 aperturas y la que eliges.
  3. Guion puntuado (`docs/viralidad.md`), escena por escena: qué se ve / qué se dice.
  4. Reparto y la idea visual que recorre el vídeo, y como mucho 2–3 bocetos (fotogramas fijos rápidos) si ayudan.
  **Antes de enseñarla, pásala por el subagente `critico` (modelo ligero, una sola pasada por vídeo)** (Agent con `subagent_type: critico`): aplica lo que tenga razón y añade a la propuesta su veredicto y su nota de envío en una línea, **y añade la línea a `docs/criticas.md`**. El vídeo terminado NO pasa por el crítico (decisión 16-nov): bastan `npm run qa`, `qa-final` y la hoja; el crítico solo si Andrés lo pide.
  Espera su OK o sus cambios. Después produce sin interrumpir.
- **Todo lo demás (correcciones, cambios concretos, tareas claras): haz, no pidas permiso.** No termines con "¿arranco?" ni ofrezcas opciones que no ha pedido.
- **Andrés decide ritmo, orden y fechas.** Calendario y test son orientativos: no frenes la producción por ellos ni le sermonees sobre "romper el test". Si ves un riesgo real, dilo en una línea y sigue trabajando.
- **Enseña pronto.** Mejor un borrador visible (fotogramas, vídeo) que un plan o una lista de problemas. Revisa con `docs/guia-visual.md` antes de enseñar, pero no esperes a la perfección.
- Directo, breve, crítico cuando aporte. En español.
- Prioridad: **gancho → retención → visuales → envíos/comentarios**.
- Puede ser un vídeo suelto o un lote; lo que pida Andrés.
- Al terminar algo: commit + push. Si cambia una decisión, añade una línea a `docs/decisiones.md` y, si cambia lo vigente, reescribe `docs/estrategia.md`. Si Andrés manda métricas: filas en `datos/publicados.csv`, tabla de `docs/resultados.md` y ficha del vídeo.
- **Dashboard = centro de trabajo** (`docs/dashboard.html`, generado; no editar a mano). Tras tocar datos, hipótesis, cola o estados: `npm run dashboard` y commit. Medición nueva: `npm run medir -- <id> vistas=… seg=… env=… skip=…` (añade la fila al CSV y regenera). Cada hipótesis de `docs/aprendizajes.md` tiene su prueba, pesos (impacto/calidad/coste) y «por qué importa» en `datos/pruebas.json`: al crear o cambiar una hipótesis, actualiza también eso. Vídeo nuevo → añade su descripción breve a `datos/videos.json`. Estado de los criterios de viralidad en `datos/criterios.json`; notas del crítico por vídeo en `datos/notas-critico.json` (actualízala cada vez que el crítico puntúa); candidatos a publicar en `datos/plan.json`. Vista previa de vídeo en el dashboard: `previews/<id>.mp4` (ligera, se versiona) o `videos/escalada/<id>/final*.mp4`. Grabación de Insights de cuenta → `datos/cuenta.json`.
- **Capturas de Insights de un vídeo: lee siempre la curva de retención** (caída en los primeros 6 s, tramos planos, caídas fuertes y a qué escena corresponden, final), no solo las cifras. Apunta la lectura en la ficha del vídeo.
- Si Andrés rechaza o elogia algo concreto, añádelo a `docs/no-me-gusta.md` en ese momento.

## Cada guion
- **Formato de las referencias (`docs/formato.md`, 19-nov, matizado por Andrés):** se adopta sobre todo **lo visual y cómo enganchan** (gancho en la 1.ª frase/subtítulo, acción en primer plano, algo nuevo cada ~1 s, subtítulos arriba, cifras en gráfico, CTA de mandar). **No es estricto ni para todos los vídeos:** seguimos con distintos tipos de idea (dilemas, historias, información). Los 9 bloques son una guía para los de información, no una plantilla obligatoria. Rayos X, analogía, estudio y lista con progreso **solo cuando encajan**: en cada guion elige **la que más encaje** (normalmente una) y di por qué. Se sigue midiendo (H16). No hay que tener miedo a parecerse a las referencias en formato y estructura (sí: nunca copiar sus dibujos ni sus textos).
- **Primero el mensaje y la historia, después las palancas (decisión 9-nov, Andrés).** Lo más importante es qué cuenta el vídeo, lo interesante de la historia y qué ofrece a quien lo ve; el gancho, el rehook y el resto de `docs/viralidad.md` se buscan **respetando eso**, no al revés. No cambies el tema ni el enfoque de una idea para encajarla en la fórmula, ni recortes lo que da curiosidad solo para ganar segundos. Los datos de `docs/aprendizajes.md` son advertencias, no vetos. Antes de afirmar un hecho que sostiene el giro, verifícalo (E55 v2 afirmó «no le salva» sin comprobar y era falso).
- **Mensaje primero (vídeos de información):** antes de la estructura, escribe en una línea cada uno: qué mensaje se quiere transmitir, cuál es el problema del espectador, qué valor aporta y cómo le ayuda. Añade una quinta línea: **cómo se identifica el espectador** (la situación concreta que reconoce en 1 s, p. ej. «pump en la chapa ocho»). Si no cabe en 3 líneas, aún no hay guion. Orden de contenido: lo que tenga sentido para el problema (p. ej. qué es → cómo se produce → cómo se evita → cómo se descansa); lo más útil y más visual va protagonista.
- **Aplica `docs/viralidad.md` siempre, sin que Andrés lo pida**: clímax en el segundo 1, espectador dentro, bucle abierto antes de 5 s, segundo gancho, causa visible, final que vuelve a su vida, envío/comentario/bucle con mecanismo.
- Antes de enseñar un guion, puntúalo con la tabla de `docs/viralidad.md` (≥12/14) **y pásalo por el `critico`**. La tabla sola no basta: te puntúas a ti mismo. El crítico sirve para **detectar y corregir errores** (hechos, atribuciones, huecos), **no como corte**: una nota baja no impide producir si Andrés quiere (decisión 5-nov; hay vídeos con nota baja que han funcionado). Sigue valiendo el test del mensaje de `docs/referencias.md`.
- **Las 4 preguntas, siempre, en cada guion y cada cambio de gancho** (se contestan en 4 líneas al enseñar, y se pasan al `critico`): 1) **Gancho**: qué frena el dedo en los primeros 3 s y por qué (pregunta en «tú» sobre lo que siente o hace, paradoja que todos conocen, afirmación con dato, o persona en una decisión; la imagen es la acción misma en primer plano). 2) **Rehook**: cuándo y cuál (el dato «¿cómo que…?» que evita el abandono a mitad). 3) **Qué mantiene a la persona hasta el final**: el bucle abierto que solo se cierra al final, el reloj/progreso visible y el último giro colocado al final. 4) **Qué sabe o busca ya la gente** de la historia (titulares, términos, polémica) y si lo aprovechamos. Usar lo que más conecta y lo que ya dicen los medios; no esconder lo fuerte.
- **Lenguaje y atribuciones:** dejar claras las versiones de cada parte pero sin saturar de «según…» (una atribución por vídeo como máximo; el resto, narrado). Con casos reales: sin inventar, sin heroizar ni demonizar, estado legal en una frase («hay recurso»), nada de datos sin comprobar (p. ej. «cuatro veces» era 14–15).
- **Poda antes de enseñar:** pasa el guion línea por línea (`/podar`); lo que no ayude a entender la idea, fuera. Rótulos ≥0,8 s en pantalla; ningún silencio de voz >0,26 s salvo `pausa` declarada (`npm run qa` y `npm run voz` lo aplican).
- **Un formato y un público por vídeo** (vía *o* bloque; historia *o* consejo).
- Si Andrés ya ha aprobado un guion pero ves que puntúa bajo, dilo y propón la versión mejorada; no lo produzcas tal cual.
- 35–55 s según historia (identidad ~35 s, historia ~50 s); información con el formato fijo, 45–60 s. Escribir como se habla (cifras en palabras).
- Rigor: ver `docs/proceso.md` (suficiente, no paralizante). Sin casos reales ni estudios citados no hay que comprobar datos; estricto solo en mecánica de seguridad. Los estudios **se buscan** (dan las cifras del formato): verificados, la fuente en la ficha y en pantalla sin nombres («En un estudio con 156 personas…»).

## Estructura
- `videos/<nicho>/<id>/guion.json` (escenas con `texto` hablado, `visual` = escena a medida, `titulo` = rótulo de dato, `pausa` = silencio en s) · `sonido.json` · `ficha.md` (estado, formato, resultado, aprendizajes y la descripción para publicar) · `final.mp4` (no se sube a git).
- `src/historias/<Plantilla>.tsx`: escenas a medida por vídeo (ej. `Vacio.tsx` para E15). `src/piezas/`: personajes y elementos reutilizables (`Escalador.tsx`: Joe/Simon con poses por ángulos y caras; `Grano.tsx`: grano + viñeta). Hoja de poses: plantilla `Poses` con `public/datos/_poses.json`.
- **Kit de cuerda `src/piezas/kit`** (vías a escala, poses, caídas con física, asegurador, cuerda, decorados cueva/sala): **úsalo en todo vídeo de cuerda** en vez de redibujar; guía en `docs/kit.md`, catálogo visual con `npm run catalogo`.
- `src/Reel.tsx`: plantilla genérica antigua de tarjetas de texto. **No usar para vídeos publicables**; solo pruebas.
- Herramientas: `npm run texto -- <id>` (texto para ElevenLabs) · `npm run voz -- <id> --audio ruta` (sincroniza audio subido; `--simulado` sin audio) · `npm run qa -- <id>` · `npm run verificar-voz -- <id>` (audio vs guion con Whisper, local) · `npm run render -- <id>` · `npm run qa-final -- <id>` (revisa el final.mp4: LUFS, pico, negros, formato) · `npm run fotograma -- <id> <segundo>` (imagen fija para storyboard) · `npm run hoja -- <id>` (un fotograma por escena + hoja de contacto en `out/<id>-hoja.png`; `MOMENTOS=24.5,25` añade instantes) · `npm run sonido -- <id>` (efectos de `sonido.json`, ver `docs/sonido.md`) · `npm run whisper` (una vez, mejora la sincronía; en la nube de Claude no se puede descargar). **Sincronía buena sin whisper.cpp (20-nov):** `python3 tools/alinear-fw.py <id>` tras `npm run voz` (faster-whisper con el modelo «small» bajado de npm; ver cabecera del script). Úsalo siempre antes de renderizar. Sin él, si la voz se desincroniza: pon en `guion.json` `"frases": [palabras por tramo de voz]` (un número por cada trozo entre pausas del audio) y repite `npm run voz`. Si aun así se desincroniza: `python3 tools/ajustar-tiempos.py <id>` (reparte las palabras de cada tramo de `frases` entre las pausas reales del audio por sílabas e imprime síl/s por tramo: si alguno sale <4 o >9, el reparto de `frases` está mal; `"cortes": [s]` fuerza cortes en pausas muy cortas; repetir tras cada `npm run voz`). Evita `pausa` en el guion si la voz ya hace la pausa: sin Whisper se inserta en el sitio equivocado.

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
