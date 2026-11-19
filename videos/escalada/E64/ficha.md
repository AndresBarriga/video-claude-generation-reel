# E64 · «La puerta de la cinta» — ficha

> Hecho por el amigo de Andrés (llegó como E62 por parche; renumerado al integrarlo el 19-nov porque esos IDs ya estaban usados).
- **Estado:** producido con voz (45,5 s, Danny; sincronía por pausas con `frases` + `tools/ajustar-tiempos.py`, sin Whisper). Pendiente de revisión de Andrés y de subir.
- **Formato:** seguridad con cuerda + paradoja física visible (H14, molde de E59). Público: quien escala de primero en deportiva.
- **Mensaje:** una cinta «bien chapada» puede soltarte si las puertas miran hacia donde escalas: arriba se sale de la chapa, abajo se sale la cuerda. Regla: puertas al lado contrario de hacia donde vas. Además: el mosquetón de la goma es el de la cuerda (el otro coge rebabas y lija la cuerda) y, si queda apoyado en un canto, cinta más larga.
- **Idea de Andrés (16-nov):** cómo colocar las cintas según hacia dónde escalas; todo con consecuencias (cinta que se desclipa, cuerda que se desgarra, alguien que cae mucho), no una clase.
- **Gancho:** rótulo-pregunta «¿SE SUELTA?» desde el fotograma 0; él, altísimo, se cae y la última cinta se sale de la chapa a cámara lenta (lupa de frente). No llega al suelo: le para la chapa de abajo (6,3 m frente a 2,7 m; cota «6 m» y silueta roja de dónde le habría parado).
- **Escenario:** decorado «roca» de día del kit (primer vídeo que lo usa), vía vertical de seis chapas a escala (`crearVia`, última a 11,6 m). Primeros planos de frente nuevos en `src/historias/Cinta/Macro.tsx` (chapa, cinta con las dos puertas al mismo lado, goma, rebabas, cuerda): candidatos a pasar al kit.
- **Reparto:** `REPARTO.tu` (escala) y `REPARTO.ase` (asegura, mano de freno en la cuerda).
- **Crítico:** el subagente no está disponible en el chat de claude.ai; pauta pasada por Claude (no independiente): 7 estimado, viralidad 12/14.
- **QA:** `npm run qa-final` correcto tras pasar el audio por limitador (el normalizado de `render` dejaba el pico en +2,9 dBTP: revisar `tools/render.mjs`). `npm run qa` sin fallos (avisos: gancho de 15 palabras, 151 palabras/45 s, dos escenas largas con cambios de plano internos).
- **Archivos:** `guion.json` · `sonido.json` · `final.mp4` (no se versiona) · plantilla `src/historias/Cinta/`.

## Hechos (mecánica de seguridad, verificada 16-nov)
- Petzl, Tech Tips «Positioning the quickdraw and clipping the rope»: la puerta siempre al lado contrario del sentido de la escalada; la cuerda entra por el lado de la pared; una mala colocación puede hacer que la cuerda se salga, por el movimiento de la cuerda o porque el mosquetón gira sobre la chapa en una caída; mosquetón de chapa móvil (sin goma), el de la cuerda fijo (con goma).
- REI «How to clip quickdraws»: recto a la chapa y curvo a la cuerda siempre, para que el de la cuerda no coja los bordes afilados que deja la chapa; que el mosquetón de abajo no quede a medias sobre un canto: cinta más larga.
- Todo va con «puede»: no se afirma que pase siempre. La caída del gancho no llega al suelo (sería falso con una sola cinta fallando tan alto).

## Publicación
**Descripción:** ¿Hacia dónde miran las puertas de tus cintas? Si miran hacia donde escalas, en una caída la cinta puede salirse de la chapa, o la cuerda del mosquetón. La regla: puertas al lado contrario de hacia donde vas. Y dos más: el mosquetón de la goma es siempre el de la cuerda, y si queda apoyado en un canto, cinta más larga. Guárdalo y mándaselo a tu cordada.
#escalada #escaladadeportiva #seguridadenescalada #cintaexpres #rocodromo
**Comentario fijado:** ¿Te fijas en hacia dónde miran las puertas o chapas como caiga?

## Revisión (Claude, 19-nov)
- Técnica OK (qa-final: 46,1 s, -15,3 LUFS, pico -1,3). Sigue la línea vigente: pregunta «¿SE SUELTA?» en el fotograma 0, consecuencia, regla y bucle al final.
- **Demasiado largo para un consejo:** 46 s con tres ideas (puerta, arriba/abajo, canto). Recortar el canto (y quizá rebabas) → ~32 s; las dos últimas valen para otro vídeo.
- En el fotograma 0 el escalador es diminuto y la lupa no entra hasta ~1,3 s: abrir ya con la lupa sobre la cinta.
- Errata: un rótulo dice «ESCALABAS» y el siguiente «ESCALAS».
- Hechos: los mecanismos (la puerta contra la chapa, la cuerda que sale por la puerta, el mosquetón con rebabas, la palanca en un canto) son correctos en lo esencial.
