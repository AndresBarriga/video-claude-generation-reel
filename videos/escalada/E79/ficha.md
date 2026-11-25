# E79 — Frenada según la pared (serie «Caer y asegurar» 1/3)
- **Estado:** producido 25-nov con tiempos **simulados** (42,4 s; borrador sin voz). **Falta la voz de ElevenLabs** (texto v3 de `propuesta.md`) → `npm run voz -- E79 --audio …` + `python3 tools/alinear-fw.py E79` + render + qa-final. Publicar esta noche, **solo apertura A** como reel normal; C es plan B (ver `propuesta.md`).
- **Formato:** información, lista con progreso (contador 1/4 → 4/4) + tarjeta para guardar (2,5 s fija). Hilo visual: la misma caída en cuatro paredes de roca clara; solo cambia cómo se mueve Dani y dónde acaba ella.
- **Reparto:** Irene (escala; nueva: chaqueta azul, casco amarillo, melena oscura; Andrés pidió no usar a Lola) y Dani (asegura). Plantilla `Frenada` (`src/historias/Frenada`), kit de cuerda: `PERFILES` desplome/vertical/placa, `sistemaCaida` (dina 1 blanda, 0 seca, 0,4 corta), `Asegurador` (paso/alza).
- **Mecánica en pantalla:** blanda = dina 1 con comba normal (0,3 m), nunca comba de más · seca = dina 0 → péndulo y golpe contra la pared · corta = poca cuerda fuera (0,05 m) y dina 0,4: sin tirón · placa = Dani da dos pasos atrás, la caída se acorta.
- **Checklist §9:** titular «EL PEOR SITIO PARA CAERTE» desde el fotograma 0 · subtítulos bajados a y=255 (zona segura 250, cambio en `Subtitulos.tsx` para todos) · rótulos y contador en y 1150–1540 (dentro del 3:4 y por encima de los 350 px de abajo) · portada propia `portada.jpg` · bucle: el cierre vuelve al plano del fotograma 0.
- **QA:** `npm run qa` solo avisos (sin bloque «cifras»: el encargo pide no meter cifras; 42 s < 45 objetivo del formato fijo, aceptado). `qa-final` del borrador sin voz: pico 0 dBTP → bajados golpe/crujido; repetir con la voz.
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

**Comentario fijado:** «¿Le dices a tu asegurador cómo quieres que te frene, o lo dejas a su criterio?»

## Resultado
(pendiente)
