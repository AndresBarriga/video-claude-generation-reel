# E79 — Frenada según la pared (serie «Caer y asegurar» 1/3)
- **Estado:** listo para publicar 25-nov (39,2 s, qa-final OK: -14,7 LUFS, pico -1,2 dBTP). Voz de Andrés (ElevenLabs, «Danny», v4), 38,6 s tras apretar 17 silencios; sincronía con `alinear-fw.py` (101/103 palabras). Solo apertura A como reel normal; C es plan B (ver `propuesta.md`).
- **Formato:** información, lista con progreso (contador 1/4 → 4/4) + tarjeta para guardar (2,5 s fija). Hilo visual: la misma caída en cuatro paredes de roca clara; solo cambia cómo se mueve Dani y dónde acaba ella.
- **Reparto:** Irene (escala; nueva: chaqueta azul, casco amarillo, melena oscura; Andrés pidió no usar a Lola) y Dani (asegura). Plantilla `Frenada` (`src/historias/Frenada`), kit de cuerda: `PERFILES` desplomeFuerte (nuevo, ~27°: el desplome normal se leía vertical)/vertical/placa, `sistemaCaida` (dina 1 blanda, 0 seca, 0,4 corta), `Asegurador` (paso/alza).
- **Mecánica en pantalla:** blanda = dina 1 con comba normal (0,3 m), nunca comba de más · seca = dina 0 → péndulo y golpe contra la pared · corta = poca cuerda fuera (0,05 m) y dina 0,4: sin tirón · placa = Dani da dos pasos atrás, la caída se acorta.
- **Checklist §9:** titular «EL PEOR SITIO PARA CAERTE» desde el fotograma 0 · subtítulos bajados a y=255 (zona segura 250, cambio en `Subtitulos.tsx` para todos) · rótulos y contador en y 1150–1540 (dentro del 3:4 y por encima de los 350 px de abajo) · portada propia `portada.jpg` · bucle: el cierre vuelve al plano del fotograma 0.
- **Cambios tras el borrador (aprobados por Andrés):** desplome más empinado · rebobinado de 0,3 s (◀◀) antes de la frenada seca: la misma caída, frenada de otra forma · contador con el nombre de la pared («1/4 · DESPLOME»…) para que se entienda sin sonido · cierre con la pregunta de la parte 2 («¿CÓMO FRENA BLANDO SIN DAR COMBA DE MÁS?») · texto: «frenarte suave» → «frenarte blando» (mismo término en todo el vídeo).
- **QA:** `npm run qa` solo avisos (sin bloque «cifras» a propósito; 39 s < 45 del formato fijo, aceptado). `qa-final` OK.
- **Crítico (propuesta v1):** 7/10, envío 6,5 → aplicado en v2/v3.

## Respaldo
| Afirmación | Fuente |
|---|---|
| Frenada blanda si caes al aire desde un desplome o vas a pendular contra la pared | REI, «How to Belay a Lead Climber» |
| Si puede golpear una repisa, un saliente o el suelo: nada de frenada blanda, acortar; decirle al asegurador lo que quieres | Climbing.com, «The art of the soft catch» |
| La frenada blanda alarga la caída; mirar repisas y salientes | Climbing Tech Tips, «Soft catches» |
| Primeras chapas: cerca de la pared, mínima comba, recoger al chapar | Mountain Project (curso de rocódromo) |
| Placa: pasos atrás para acortar | Mountain Project |
| Con poca cuerda bajo un techo, péndulo contra el borde | Mountain Project |

**Respuestas preparadas:** «una frenada blanda no es dar comba de más» → «exacto: es acompañar el tirón, no soltar cuerda; lo vemos en la parte 2» · «en rocódromo no hay repisas» → «pero hay volúmenes y primeras chapas».

## Publicación
**Portada:** `portada.jpg` — «CAER Y ASEGURAR · 1/3» + «¿CÓMO TE TIENEN QUE FRENAR?» + desplome / repisa / placa (todo en el 3:4 central).

**Pie:**
Frenada blanda o corta: tu asegurador no debería frenarte igual en un desplome que con una repisa debajo 👀
La frenada blanda (asegurar dinámico) alarga la caída: te salva en el desplome y te estampa si hay algo debajo o vas por las primeras chapas.
(Y depende del peso: si pesas mucho menos que quien escala, ya sale blanda sin saltar.)
Mándaselo a quien te asegura 🧗‍♂️
#escalada #escaladadeportiva #asegurardinamico #ultimopegue

(Falta 1 hashtag mediano: comprobar en Instagram que tenga 10K–500K publicaciones antes de añadirlo.)

**Comentario fijado:** «¿Le dices a tu asegurador cómo quieres que te frene, o lo dejas a su criterio? En la parte 2: cómo se frena blando sin dar comba de más.»

## Resultado
(pendiente)
