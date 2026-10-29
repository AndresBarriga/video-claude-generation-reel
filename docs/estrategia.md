# Estrategia (fuente de verdad; el PRD completo está en https://claude.ai/artifact/3Nf3ndsDCyLLPdTnEux4Ls)

- Cuenta anónima, sin cara, reels animados en español de España. Instagram + TikTok (mismo archivo); Shorts después.
- Test de nichos: escalada vs mascotas. Fechas orientativas (decisión hacia el 30 nov 2026; revisión a 90 días ~28 feb 2027). Andrés puede adelantar o publicar antes; no es un experimento de laboratorio.
- Métricas que importan, por orden: **envíos por 1.000 visualizaciones**, % que ve el vídeo entero / repeticiones, comentarios, seguidores por vídeo.
- Qué buscan los vídeos: retención (gancho que te pone en la situación, segundo gancho a mitad, bucle final), comentarios (pregunta moral o de identidad sin respuesta obvia), envíos (a quién se lo mandarías).
- Las ideas de escalada salen de la lista aprobada (`docs/ideas/escalada.md`). Las de mascotas están por rehacer con el mismo nivel.
- Voz: ElevenLabs a mano en la web; plan de pago activo antes de generar audio para publicar (licencia comercial).
- Visuales: todo hecho por IA en código (sin ilustradora humana). Estándar en `docs/guia-visual.md`.

## Registro de decisiones
- 2026-10-27 · Todo el trabajo se hace en chats del proyecto con este repo en GitHub (no zip, no Claude Code local).
- 2026-10-27 · Voz manual en la web de ElevenLabs; Claude sincroniza el audio subido.
- 2026-10-27 · Rigor rebajado: fuente solo para cifras/estudios; estricto en salud/seguridad.
- 2026-10-27 · Escalada empieza por la lista de 28; E14 (Honnold) propuesto para abrir la cuenta, E15 (Tocando el vacío) segundo. Pendiente de confirmar en el chat de Estrategia.
- 2026-10-27 · Instrucciones menos estrictas: producir sin pedir permiso, fechas orientativas, enseñar borradores pronto.
- 2026-10-27 · Manual de viralidad (`docs/viralidad.md`) obligatorio: todo guion se puntúa (≥12/14) antes de enseñarse. E15 v3 con estructura in medias res + cierre de envío.
- 2026-10-27 · Identidad visual fija (caras/expresiones, cuerda naranja, paleta, tipografía, apertura en tensión, cierre en bucle) en `docs/guia-visual.md`. Cada vídeo lleva capa de sonido (`docs/sonido.md`).
- 2026-10-27 · Andrés produce un stock de vídeos antes de abrir la cuenta; el orden de publicación se decide después con lo que haya.
- 2026-10-27 · Cada vídeo nuevo empieza con una propuesta (opinión, 5 aperturas, guion, reparto, bocetos) que Andrés aprueba antes de producir. Reparto variado con el mismo estilo de dibujo.
- 2026-10-27 · Crítico independiente (subagente `critico`) obligatorio antes de enseñar propuesta y vídeo; referencias en `docs/referencias.md`. E6 se hace en bloque.
- 2026-10-27 · Vídeos de cuerpo/explicación con conflicto o humor (E11: el asegurador que se ríe y el vídeo te defiende). Inicios alternativos que solo cambian el rótulo, para reels de prueba sin rehacer la voz.
- 2026-10-28 · Formato «las N fases de…»: escalada de tensión reconocible, una fase cada 3–4 s con marcador de progreso y chiste final (E11: «¡pilla!» y caes 20 cm). La ciencia entra como remate/alivio, no como cuerpo del vídeo. Andrés descartó pruebas para el espectador («tirado en la cama no quiere hacer pruebas»).
- 2026-10-28 · Nuevos formatos (referencias de Andrés): (1) personaje fijo reventado que se queja de lo cotidiano (identidad, se envía); (2) datos que se mueven; (3) «¿Qué pasaría si…?». Segunda cuenta de humor general **fuera de nicho** con personaje fijo (original, no imitar a Alejandro); la cuenta de escalada se mantiene y también prueba estos formatos («escalador estancado por meses», «¿y si todos los escaladores…?»). Mascotas: lista en `docs/ideas/mascotas.md`, en pausa; el dibujo solo gana en pensamientos de la mascota/humor del dueño. Estudios fuera de las descripciones; verificar solo cifras que salgan en pantalla.
- 2026-10-28 · Listón: si el crítico no da ≥7 y no pasa el test del mensaje, el vídeo no se produce. Rotar mecánica de humor entre vídeos (contador máx. 1 de cada 3). Ideas de vida adulta en `docs/ideas/vida-adulta.md`.
- 2026-10-29 · Primeros datos (Instagram, 0 seguidores, ~11 h): **E15** 15,6K vistas, 35 s de media sobre 56 s, skip 17 %, likes 6,2 %, guardados 61, 6 reposts, 11 seguidores, 99,9 % no seguidores, aún creciendo. **E6** 2,6K vistas, 24 s sobre ~42 s, skip 14 %, 0 % envíos, 3 guardados, 3 seguidores, curva plana a las ~4 h. Lectura (n=2): la historia universal (E15) se distribuye; el humor con jerga de escalada (E6: «pegue», «bloque») retiene bien pero no se envía fuera del nicho. Audiencia 18–34 años (~80 %). Conversión a seguidor ~0,1 %: hace falta más cuadrícula. Prioridad: contenido universal (E14, E11) antes que humor con jerga (E30, E3).

## 2026-10-29 · Segunda cuenta: criterios estrictos (3 candidatos)
Candidatos: humor de vida adulta (personaje fijo), mascotas «uy qué mono», historias reales de animales.
- **Puertas (un NO descarta):** (1) el espectador lo vive ahora; (2) la animación aporta algo que el vídeo real no da; (3) ≥30 ideas que pasen el test del mensaje sin repetir mecánica; (4) producible con nuestras piezas en ≤1 día; (5) hay una persona concreta a quien enviarlo.
- **Resultado:** mascotas «uy qué mono» **descartada** (falla 2: el vídeo real es más mono; solo ~12 ideas de «lo que piensa»). Vida adulta y animales reales pasan, con riesgos: vida adulta depende de la escritura y no tiene datos propios (E6 humor = 4K frente a E15 historia = 44–66K, n=2); animales reales solo tiene 4 ideas y las historias famosas (Hachiko) están muy contadas.
- **Datos de saturación:** no hay cifras fiables de cuentas animadas en español (TikTok bloquea la consulta automática; fuentes = blogs). Mascotas reales en España: techo ~0,2–0,9 M en IG (Kolsquare, ago-2024); monetizan con marcas y animal real.
- **Decisión pendiente de Andrés:** antes de abrir cuenta, 10 min de búsqueda manual (protocolo en el chat) y producir 1 vídeo de prueba de animales (en la cuenta de escalada) para ver si la fórmula generaliza.

## 2026-10-29 · Patrón E15 (n=1 viral, hipótesis)
E15 ~44K+ y creciendo frente a E6 ~4K. Lo que E15 tiene y E6/E14 no:
1. **Dilema que el espectador resuelve en su cabeza** («¿cortas?»): sin respuesta obvia, cada uno opina → comentarios largos.
2. **Vida o muerte real**: se entiende sin saber escalar (99,9 % no seguidores).
3. **Bucle imposible de adivinar** («cortó… y el amigo volvió»).
4. **La pregunta final es sobre una persona concreta** («¿te cortaría tu compañero?») → envío.
E14 Honnold tiene 2 y 3 a medias, pero el espectador mira, no decide. Siguiente candidato: misma estructura «decisión límite real + ¿qué harías tú?» (Caldwell empuja al secuestrador; alternativa: David Sharp, Everest 2006). Pendiente: curva de retención y datos de E14.
- 2026-10-29 · Andrés: prioridad absoluta a viralidad; fuera restricciones de tono/respeto y de verificación total. Se mantiene solo: no inventar hechos sobre personas reales (riesgo legal) y evitar gore explícito (Instagram lo tapa como «contenido sensible» y mata el alcance).
