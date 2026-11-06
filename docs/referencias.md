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
