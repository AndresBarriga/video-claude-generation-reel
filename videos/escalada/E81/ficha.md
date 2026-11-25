# E81 — Dar cuerda rápido con el grigri (serie «Caer y asegurar» 3/3)
- **Estado:** listo para publicar 25-nov (33,5 s, qa-final OK: −14,8 LUFS, pico −1,4 dBTP). Voz de Andrés (ElevenLabs, «Danny», v4), 32,9 s tras apretar 15 silencios; sincronía con `alinear-fw.py` (101/104 palabras). Se publica DESPUÉS de E80.
- **Formato:** información, pasos 1/3 → 3/3 + tarjeta para guardar (fija ≥2,5 s). Guion y voz aprobados (`encargo.md`); no pasa por el crítico (decisión 16-nov).
- **Cambio de voz (25-nov):** se mantiene «se bloquea» en el gancho (lo que dice todo el mundo y lo que se busca); «puede bloquearse» → «si tira de golpe para chapar, el grigri frena como si cayera» (antes «si la cuerda sale de golpe»: se leía como que la cuerda corría sin freno), porque Petzl llama «bloqueo» a la función de seguridad: así se distingue frenar cuando no toca (molesto) de anular el frenado (peligroso).
- **Idea visual:** el mismo puesto de Dani (grigri de lado sobre la foto de Andrés, de E62) en lámina clara, con la **mano de freno siempre dibujada en la cuerda**, también cuando agarra el aparato entero. Rocódromo claro (fondo y muro de E72), no la sala oscura del kit: nada de arranque oscuro.
- **Reparto:** Irene (escala) y Dani (asegura), aspectos de `src/historias/Frenada/comun.tsx`. Sin Lola. Mangas de Dani en menta también en los primeros planos.
- **Plantilla:** `Frenada` (de E79), escenas nuevas en `G3comun`, `G3Gancho`, `G3Golpe`, `G3Pasos`, `G3Cierre`. `Portada.tsx` ahora elige por id (E79 sin cambios).
- **Mecánica en pantalla:** bloqueo al dar = la cuerda sale de golpe y el grigri frena como en una caída (rótulos «TIRÓN AL CHAPAR» → «FRENA COMO SI CAYERA») · agarre incorrecto = mano rodeando el aparato + leva apretada + medio segundo de cuerda corriendo, **sin caída ni desenlace** · paso 2 = ÍNDICE bajo el borde y PULGAR en la leva rotulados ≥1,5 s, el pulgar aprieta solo mientras da · paso 3 = chapa hecha → pulgar fuera.
- **Tarjeta:** sello genérico de «verificado» + «TÉCNICA DE PETZL» en grande (sin logotipo de la marca).
- **Checklist §9:** «¡CUERDA!» desde el fotograma 0 · subtítulos arriba (y=255) · rótulos y contador en y 430–1530 · lo clave en el 3:4 · tarjeta fija · bucle al plano del fotograma 0 · portada propia `portada.jpg`.
- **QA:** `npm run qa` solo avisos (sin bloque «cifras» a propósito; 33 s < 45 del formato fijo, aceptado como en E79). `qa-final` OK. Rótulos de pasos ≥1,5 s (ÍNDICE, PULGAR, PULGAR FUERA); «FRENA COMO SI CAYERA» entra en «frenar» para durar >0,8 s.

## Respaldo
| Afirmación | Fuente |
|---|---|
| Única técnica recomendada; incorrecto agarrar el GRIGRI con toda la mano, dar cuerda sin sujetar la cuerda de freno o dejar el pulgar siempre en la leva | Petzl, «Belaying with the GRIGRI» |
| Bloquear el aparato o la leva anula el frenado («cualquier bloqueo del aparato, o de la leva, anula el bloqueo de la cuerda») | Petzl España, «Asegurar con el GRIGRI» |
| Si la cuerda sale de golpe, la leva puede pivotar y bloquear como en una caída (Petzl: la leva pinza la cuerda cuando se tensa) | Petzl, «Belaying with the GRIGRI» |
| Dar rápido: índice bajo el borde, pulgar en la leva solo mientras se da, mano de freno en la cuerda | Vídeo oficial de Petzl (contrastado en E62) |

**Respuestas preparadas:** «yo uso otro aparato» → «cada uno tiene su técnica: mira su manual; esto es la del grigri» · «el pulgar en la leva es peligroso» → «por eso solo un instante, mientras das, y fuera en cuanto chapa; nunca agarrado entero».

## Publicación
**Portada:** `portada.jpg` — «CAER Y ASEGURAR · 3/3» + «DAR CUERDA RÁPIDO CON EL GRIGRI» + el puesto con pulgar e índice + «SIN QUITARLE EL FRENO».

**Pie:**
¿Tu grigri se bloquea cuando tu compañero va a chapar? Así se da cuerda rápido sin quitarle el freno 👇
Agarrar el grigri entero parece la solución, pero si sujetas el aparato o la leva no puede frenar. El pulgar en la leva es para un instante, no para ir agarrado.
Mándaselo a quien te asegura 🧗‍♀️
#escalada #escaladadeportiva #grigri #asegurar #ultimopegue

(Comprobar en Instagram que #grigri y #asegurar estén en 10K–500K publicaciones antes de publicar.)

**Comentario fijado:** «¿Cómo das cuerda cuando van a chapar: agarras el grigri o pulgar solo un instante? Cierre de la serie «Caer y asegurar» (1/3 frenada según la pared, 2/3 lo que no es una frenada blanda).»

## Resultado
(pendiente)
