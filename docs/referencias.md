# Referencias: qué hace que se compartan (para el crítico y para los guiones)

| Cuenta / vídeo | Formato | Por qué se comparte |
|---|---|---|
| numerosdepareja | Datos sobre relaciones | El vídeo es un mensaje para tu pareja: «mira, esto somos». ≈5 envíos por 1.000 vistas. |
| getkeyframes (pantalla y guante) | Explicación de algo cotidiano | Misterio que todos han vivido + el objeto aparece justo cuando se nombra. 15–16 M de vistas. |
| beaniesurvives / porquetuperro | Identidad de dueño | «Esto es mi perro»: detalle hiperconcreto que el dueño reconoce. |
| climb_at_life «You're not too weak» | Identidad de escalador | Te quita la culpa: identidad + alivio. 908 K frente a 3–6 K de los tutoriales. |
| Tocando el vacío (E15) | Historia con dilema | Dilema moral + giro imposible + pregunta sobre TU compañero. |

## Lo que tienen en común
1. **Especificidad:** detalles que solo reconoce alguien de ese mundo (yemas peladas, «pegue 14», el que asegura bostezando). Lo genérico no se comparte.
2. **Test del mensaje:** puedes escribir exactamente qué pondrías al mandarlo («jajaja eres tú», «esto nos pasa», «¿tú me cortarías?»). Si no sale la frase, no se va a enviar.
3. **Sentir antes que entender:** risa, alivio, tensión o indignación primero; el dato o la explicación, al servicio de eso.
4. **Un formato, un público por vídeo.** No mezclar vía y bloque, perro y gato, historia y consejo.

## Patrones de gancho más repetidos en fuentes externas (2-nov, búsqueda web)
Calidad: casi todo son blogs de herramientas de vídeo; lo único «primera mano» es la ayuda de TikTok Ads (gancho en 6 s; suspense/sorpresa/emoción) y su estudio de anuncios (texto superpuesto 1,4× más probable de enganchar; decir «tú» en 5 s sube intención de compra) → son anuncios, no retención orgánica. No hay estudio revisado por pares sobre ganchos en vídeo corto.
Patrones que repiten ≥4 fuentes: (1) hueco de curiosidad (Loewenstein, 1994) con payoff pronto; (2) interrupción de patrón visual; (3) reconocimiento/punto de dolor/llamada al público; (4) afirmación específica (cifra) o contraria; (5) texto en pantalla <0,5 s, que se entienda sin sonido. Menos comunes: reiniciar la atención cada 3–5 s (Toptal), «flash» de 0,5–1 s del mejor momento (ClipSpeed), probar solo los 3 primeros s con reels de prueba (Inrō, Bytecap; ya lo hacemos).
Fisiología pump (para E43): oclusión completa ~50–60 % de la fuerza máxima (PMC 2015); >20 % ya perjudica el flujo (Lacrux); reoxigenación tras soltar: T½ 8 s (élite) a 95 s (sin entrenar) (Fryer 2015); la fuerza tarda más: descanso de 2 min insuficiente en boulderers avanzados (Bevins y Ashby, póster); fuerza de agarre −22 % tras vueltas hasta caer y antebrazo +4,5 % de perímetro (MacDonald 2022); sacudir el brazo al lado del cuerpo +22 % de tiempo y +32 % de reoxigenación frente a quedarse agarrado (Baláš 2016).

## Repos externos revisados (6-nov-2026) — qué se aprovecha
Lemo-opuscar, rea-video, reels-af, OpenMontage, hypit, anything2explainer, tiktok-viral-hooks. Ideas, no código (salvo rea-video y reels-af, Apache-2.0).
- **rea-video** (Apache-2.0, `JuneYaooo/rea-video`): analiza un mp4 de referencia offline (~2 min): cortes por plano, subtítulos por OCR a ~0,1 s (SRT), estilo del texto, efectos de sonido. Probado con previews/E35.mp4: 11 planos = nuestras 11 escenas y subtítulos correctos. **Ignorar** su veredicto de estilo (llamó «3D 91 %» a una animación 2D) y su BPM. Uso: pasarle 8–10 reels de escalada/divulgación (los mp4 los aporta Andrés) y medir duración media de plano, tiempo hasta el primer cambio, cadencia de subtítulos y rótulos para calibrar nuestras reglas con datos.
- **reels-af** (Apache-2.0): generación de ideas con ángulos forzados (cifra concreta con nombre / lo obvio al revés / fecha que reencuadra / puente con otro campo), lista anti-tópicos, crítico que puntúa novedad-especificidad-gancho-narrabilidad y elige un top-3 **diverso**, y juez entre borradores. Aplicable a `/ideas`. Ojo: su regla «el gancho no revela la respuesta» contradice nuestro clímax en el segundo 1; seguimos con la nuestra.
- **OpenMontage** (AGPL: solo ideas): dirección de voz por escena (ritmo, palabras con énfasis, pausas, ajustes de ElevenLabs) y «prueba con la frase más difícil antes de generar todo el audio»; cadena de voz IA (paso alto 80 Hz, recorte ~500 Hz, compresión 3:1). Zona segura de Reels que citan: 210 px arriba / 310 abajo (la nuestra: 200/290), de fuente secundaria sin verificar.
- Descartados: anything2explainer (PolyForm no comercial, 16:9 de 2–8 min), tiktok-viral-hooks (CC BY-NC-SA, nichos ajenos, desglose escrito por IA), hypit (DSL pesado; ya anclamos a palabras).
- **ElevenLabs (docs oficiales, verificado 6-nov):** `<break>` solo vale en Multilingual v2 y Flash/Turbo v2, no en v3 ni v4 (v3/v4 usan etiquetas de audio y puntuación). El endpoint `/v1/text-to-speech/{voice_id}/with-timestamps` devuelve el audio con tiempos por carácter: con API key local permitiría sincronía exacta sin Whisper ni `pausaFrase`. Pendiente de decidir (ahora la voz se genera en la web).
- **yapcut** (CC BY-NC, solo ideas): «outlier» = vídeo con ≥5× la mediana de las últimas publicaciones de la misma cuenta (compara contra la propia base, no contra seguidores); controles mecánicos de guion (gancho ≤9 palabras, palabras prohibidas, antítesis «no es X, es Y», dos ganchos del lote que abren igual); apilar bucles abiertos cada ~20 s; la ambivalencia empuja los envíos; serializar lo que funciona.

## @pin_v1ew «Hasta 4 tallas menos» (pies de gato, ~60 s; 6,6K «me gusta», 3,1K envíos, 242 reposts; grabación de Andrés, 19-nov)
- **Gancho:** dice un hecho raro que todo escalador ya conoce: «Los escaladores se compran las zapatillas hasta dos tallas más chicas… a propósito». Visual: zapatilla y dos radiografías del pie, 43 → 41, «−2». No hay persona ni pregunta: el gancho es la paradoja.
- **Bucle:** «Entonces, ¿por qué?» → «No es masoquismo: es física» (cambia el marco) → **«LAS 3 REGLAS» con candados**: promete 3 cosas y enseña el progreso, que no se cierra hasta el final.
- **Analogía para el que no escala:** escribir con un guante gigante = pie en una zapatilla floja.
- **Capa infográfica constante:** algo nuevo **cada ~1 s** (cifras grandes, «0 mm», «+1 TALLA», barra de FUERZA que se vacía, manómetro de PRESIÓN, cuadrícula de puntos 53 % frente a <5 %, ✓/✗, contador 1-2-3 con ✓). Subtítulo arriba, palabra a palabra, con la palabra clave en un recuadro.
- **Giro:** «Pero apretada no es dolorosa» + dato fuerte (juanetes, 53 % frente a <5 %).
- **Cierre con mecanismo:** «Guárdalo para tu próxima compra y mándaselo a ese amigo que dice que las zapatillas deben doler». Anima el icono de guardar y **la hoja de enviar de Instagram**. El envío va a una persona definida por **una frase que dice**.
- **Estética:** fondo oscuro, radiografías que brillan, un objeto por plano, sin personajes.
- **Para nosotros:** (1) la lista con candados y progreso como bucle de retención; (2) el envío a «ese amigo que dice X»; (3) cadencia de ~1 s (más rápida que nuestra regla de 1,5–2 s); (4) una analogía universal; (5) la paradoja conocida vale como gancho sin persona. Ojo: **es el mismo tema y contenido que nuestro E63**, y mejor hecho; E63 tal cual llegaría tarde y peor.
