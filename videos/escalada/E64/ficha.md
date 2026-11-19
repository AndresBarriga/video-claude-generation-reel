# E64 · «Cómo chapar: 3 errores» — ficha

- **Estado (19-nov):** v4 producida con la voz de Andrés (ElevenLabs, Danny). 51,0 s, -14,9 LUFS, pico -1,1 dBTP (qa-final OK). Plantilla `CintaV2` (reutiliza la vía, la caída, los primeros planos, la regla y las marcas de `Cinta`; nuevo: back-clip de frente con delante/detrás, candados 1-2-3, tarjetas, repaso, CTA con hoja de enviar). Subtítulos arriba (añadido contorno oscuro para fondos claros, afecta a todos los vídeos con `estilo="arriba"`). Música de E63 reutilizada. Sincronía sin Whisper: `frases` (41 tramos) + `tools/ajustar-tiempos.py` (5–8 síl/s en todos los tramos); repetir tras cada `npm run voz`.
- **Formato:** información, formato de las referencias (H16) + seguridad con cuerda (H14). Herramienta: lista 1-2-3 con candados.
- **Guion y crítico:** `propuesta-v4.md` (crítico 7).
- **Descripción para publicar:**
  Tres errores al chapar que hacen que la cuerda se salga (el tercero casi nadie lo mira) 👀
  1️⃣ Nada de back-clip: el tramo que va a tu arnés sale por delante.
  2️⃣ La puerta del mosquetón de la cuerda, al lado contrario de hacia donde vas.
  3️⃣ Sin goma a la chapa, con goma a la cuerda. No los cambies.
  ¿Por qué la goma va abajo? Sujeta el mosquetón de la cuerda para que no gire y la cuerda no cargue sobre el gatillo, y ayuda a chapar. Ojo: la goma no es un elemento de seguridad ni impide del todo que gire. Y no los cambies: el de la chapa se marca con el acero y esas marcas desgastan la cuerda.
  Guárdalo y mándaselo a quien te asegura: desde abajo se ve.
  #escalada #escaladadeportiva #backclip #seguridad #climbing
- **Comentario fijado:** «¿Cuál de los tres te han tenido que corregir alguna vez? 👇»

---
## Versión anterior (v1c, del amigo; archivada: guion-v1c.json, voz-v1c.mp3, sonido-v1c.json)

> Hecho por el amigo de Andrés (llegó como E62 por parche; renumerado al integrarlo el 19-nov porque esos IDs ya estaban usados).
- **Estado:** v1b (19-nov, recorte rápido; no confundir con la propuesta v2 «La cuerda se sale» de otro chat) recortada a 32,6 s y entregada a Andrés para publicar. Fuera las escenas «rebabas» y «canto» (audio cortado en 29,13 s y 42,6 s, sin voz nueva); lupa desde el fotograma 0; errata «ESCALABAS» → «ESCALAS». qa-final OK (-14,9 LUFS, pico -1,3 dBTP). Rebabas y canto quedan para otro vídeo.
- **v1c (19-nov, feedback de Andrés):** corte de audio corregido (quedaba «tu cinta tiene un arriba»; ahora 0–27,1 s + 42,6–45,05 s, 30,6 s); mosquetón de la cuerda con la nariz hacia abajo (estaba invertido); en «gira» la cinta sigue girando casi dando la vuelta y se abre contra la chapa (antes se desclipaba de forma poco real); en «abajo» la caída (CAES ↓) tira de la cuerda y gira la cinta antes de que la cuerda abra la puerta. Capa informativa (H15): barra CAÍDA 0→6,3 m con marca de 2,7 m en el gancho y contador FALLO 1/2 · 2/2 con ✗. Audio con limitador (pico -1,6 dBTP, -15,2 LUFS).
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
**Descripción:** ¿Hacia dónde miran las puertas de tus cintas? Si miran hacia donde escalas, en una caída la cinta puede salirse de la chapa, o la cuerda del mosquetón. La regla: puertas al lado contrario de hacia donde vas. Guárdalo y mándaselo a tu cordada.
#escalada #escaladadeportiva #seguridadenescalada #cintaexpres #rocodromo
**Comentario fijado:** ¿Te fijas en hacia dónde miran las puertas o chapas como caiga?

## Revisión (Claude, 19-nov)
- Técnica OK (qa-final: 46,1 s, -15,3 LUFS, pico -1,3). Sigue la línea vigente: pregunta «¿SE SUELTA?» en el fotograma 0, consecuencia, regla y bucle al final.
- **Demasiado largo para un consejo:** 46 s con tres ideas (puerta, arriba/abajo, canto). Recortar el canto (y quizá rebabas) → ~32 s; las dos últimas valen para otro vídeo.
- En el fotograma 0 el escalador es diminuto y la lupa no entra hasta ~1,3 s: abrir ya con la lupa sobre la cinta.
- Errata: un rótulo dice «ESCALABAS» y el siguiente «ESCALAS».
- Hechos: los mecanismos (la puerta contra la chapa, la cuerda que sale por la puerta, el mosquetón con rebabas, la palanca en un canto) son correctos en lo esencial.
