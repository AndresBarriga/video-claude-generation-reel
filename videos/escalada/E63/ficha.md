# E63 · Pies de gato «180 € para sufrir» — ficha

> Hecho por el amigo de Andrés (llegó como E58 por parche; renumerado al integrarlo el 19-nov porque esos IDs ya estaban usados).
- **Estado:** producido con voz (36,6 s, Danny; sincronía por pausas con `frases` + `tools/ajustar-tiempos.py`, sin Whisper). Pendiente de revisión de Andrés y de subir.
- **Formato:** identidad + cuerpo por dentro (un «por qué» para dos públicos). Público: quien escala; se lo manda al de los gatos pequeños o a quien le pregunta por qué le duelen.
- **Mensaje:** pagas 180 € por unos zapatos que sabes que te van a doler. Tienen que ir sin hueco (cantos minúsculos), pero ajustado no es machacado: si duelen tanto que no pisas, escalas peor; para vías largas, cómodos.
- **Hipótesis que prueba:** H8 (identidad → seguir) y una nueva: curiosidad de identidad pensada para enviarse (lo contrario de H2). Riesgo: H13 (info limpia 2–5k) si se lee como explicador de material.
- **Idea visual:** el gato en CORTE dibujado en centímetros reales (pie del 43 = 27 cm; gato del 40 = 25 cm por dentro): huesos, dedos en garra, hueco en amarillo, dolor en rojo. Moneda de 1 € a escala (2,33 mm) bajo un canto de 2,3 mm.
- **Escenarios nuevos:** tienda de escalada al anochecer (`Tienda.tsx`) y placa de granito con la hora avanzando: mañana → tarde dorada (repisa de vía larga) → anochecer al pie (`Placa.tsx`).
- **Reparto nuevo:** él (barba, gorro teja / casco crema, forro verde), la dependienta (melena, gafas), ella (melena, casco azul; asegura con la mano de freno en la cuerda y madeja en el suelo) y diez escaladores distintos en el estudio.
- **Crítico:** el subagente no está disponible en el chat de claude.ai; pauta pasada por Claude (no independiente). Propuesta v3: 6,5 estimado, viralidad 12/14. Cambios de Andrés aplicados en v2/v3 (fuera la madre; eje 180 € + arrepentimiento; explicación en una frase; estudio antes de «escalas peor»).
- **QA:** `npm run qa` sin fallos (aviso: gancho de 16 palabras, texto de voz aprobado). `npm run qa-final`: 37,2 s, 1080×1920, −15,5 LUFS, pico −2,3 dBTP, todo correcto (audio pasado por limitador tras el render: el normalizado de `render` dejaba el pico en −0,6).
- **Archivos:** `guion.json` · `sonido.json` · `final.mp4` (no se versiona) · plantilla `src/historias/Gatos/`.

## Hechos (verificados 11-nov)
- McHenry, Arnold, Wang y Abboud, *Footwear in rock climbing: Current practice*, The Foot 25(3), 2015: 56 escaladores; 55 con calzado mal ajustado; dolor de pies al escalar en el 91 %; de media casi 4 tallas británicas menos que su calzado de calle. En voz: «en un estudio, nueve de cada diez»; en pantalla: fuente y «56 escaladores».
- BMC, «Climbing shoes: is pain insane?»: no hay estudios conocidos que demuestren que forzar los dedos mejore el rendimiento; lo que hace falta es que no quede espacio muerto. En pantalla: «SIN DEMOSTRAR» + fuente.
- Climbing.com / REI: si aprietan demasiado, apenas cargas los pies por el dolor.
- El 43 → 40 y los 180 € son el caso del personaje (gama alta), no un dato general. Sin consejos médicos.

## Publicación
**Descripción:** Te gastas 180 € en unos pies de gato que sabes que te van a hacer daño. Tienen que ir justos: escalas sobre cantos del grosor de una moneda y no puede quedar hueco delante de los dedos. Pero ajustado no es machacado: en un estudio con 56 escaladores, 9 de cada 10 escalaban con dolor de pies, y nadie ha demostrado que sufrir más pise mejor. Si te duelen tanto que no quieres pisar, escalas peor. Y para vías largas, cómodos.
Fuente: McHenry et al., The Foot (2015); BMC.
#escalada #piesdegato #rocodromo #escaladadeportiva #boulder
**Comentario fijado:** ¿Cuántos números bajas tú respecto a tu zapatilla de calle? ¿Y aguantas una vía entera sin quitártelos?
