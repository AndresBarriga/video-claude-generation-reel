# Prompts para otros chats (29-oct)
Para pegar tal cual. Los dos de vídeo exigen propuesta primero y parar: Andrés discute el guion antes de producir.

## 1. Chat de diseño del personaje (cuenta 2, vida adulta) — lienzo de diseño de Claude, sin repo
```
Soy Andrés. Diseño el personaje fijo de una cuenta anónima de reels animados de humor de "vida adulta" en español de España (Instagram + TikTok). Público 18–34: pisos, ticket del súper, correos del trabajo, domingos por la noche.

OBJETIVO: que la gente quiera seguir al personaje. Es el activo principal de la cuenta.

IDEA DE PARTIDA (hipótesis a mejorar, no obligatoria): una criatura pequeña, redonda y cuca (no humana: sin edad, sexo ni cara real) con voz educada y serena. Humor = contraste entre lo cuco y el desastre adulto, con "optimismo terco" y cortesía imperturbable ante la burocracia y el alquiler ("tiene mucha luz… de la farola"). NO quiero un muñeco cansado que se queja: eso ya lo hace otra cuenta (Alejandro) y sería una copia.

QUÉ QUIERO:
1. 5–6 propuestas de personaje en una hoja lado a lado (mayoría criaturas; incluye 1 humana y 1 objeto para contrastar). Para cada una: nombre, rasgo-defecto que da ternura, y cómo suena (voz masculina/femenina/neutra: indícala, es una variable que decido yo después).
2. Para cada una: hoja de 5 expresiones (neutra, resignada, ilusión forzada, pánico educado, ternura).
3. Debajo de cada una, la misma viñeta de prueba: visita un piso de 18 m² y dice "tiene mucha luz… de la farola".
4. Prueba de miniatura: cada silueta legible a 100 px.

RESTRICCIONES TÉCNICAS (después lo rehago como pieza SVG animada en Remotion): formas simples, colores planos (máx. 5 + piel/blanco), sin degradados ni texturas, ojos y boca separados (para animarlos), cuerpo que se pueda mover por poses. Formato vertical 1080×1920.

No uses personajes ni estilos reconocibles de marcas o series. Responde en español, breve; justifica cada propuesta en 2 líneas y dime cuál elegirías y por qué.
```

## 2. Vídeo: Tommy Caldwell (el dedo) — chat del amigo, repo
```
Lee primero CLAUDE.md, docs/proceso.md, docs/viralidad.md (obligatorio), docs/guia-visual.md, docs/no-me-gusta.md, docs/referencias.md y la idea #16 en docs/ideas/escalada.md. Repo: AndresBarriga/video-claude-generation-reel. Trabaja en una rama video/E16-caldwell (o entrega un git bundle).

FASE 1 — SOLO PROPUESTA, SIN CÓDIGO NI RENDER. Entrega en UN mensaje copiable para que Andrés la discuta antes de producir: (1) tu opinión en 2–3 líneas (¿buena idea? riesgo principal, qué cambiarías); (2) 5 aperturas y la que eliges; (3) guion escena por escena (qué se ve / qué se dice) con puntuación de viralidad (≥12/14); (4) reparto y la idea visual. Pásala antes por el subagente `critico` (.claude/agents/critico.md) y añade su veredicto y su nota de envío (≥7/10). Después PARA y espera la respuesta de Andrés. No produzcas hasta que la dé.

HISTORIA: Tommy Caldwell, hilo con tensión creciente y pago al final. Hechos verificados (Wikipedia, 29-oct): ago-2000 secuestro de 6 días en Kirguistán (empuja a un secuestrador por un acantilado; el hombre sobrevivió); 2001 sierra de mesa, pierde gran parte del índice izquierdo (reimplantado, luego decide quitarlo); 2003 Flex Luthor (9a+); 2005 The Nose en menos de 12 h; 27-dic-2014 a 14-ene-2015 Dawn Wall con Kevin Jorgeson, 19 días. NO VERIFICADO, NO USAR salvo que lo confirmes con fuente fiable: «Salathé a los cinco meses» y la comparación lado a lado con/sin dedo del documental. Andrés recuerda (sin verificar) que proyectaba una vía en El Capitán, no pudo y al año siguiente, ya sin el dedo, la escaló: verifica quién, qué vía y qué pasó; si no consta, cuenta otra cosa.

REGLAS DE FORMATO (lo que ha funcionado: E15 ~66K; E14 Honnold retuvo peor): historia universal sin jerga, espectador dentro, dilema o número que se mueve (contador de años 2000→2015), primer fotograma = acción física (nunca rótulo), 40–45 s, el remate al final y SIN llamada a la acción hablada al final (la gente se va antes: el mecanismo de envío va en el pie de foto/comentario fijado o antes), sin estudios. VISUAL: nuestra pieza `Mano` en SVG (macro, sin gore, el corte sin mostrar la herida), pantalla dividida dibujada; sin imágenes reales del documental ni fotos de personas reales; sin IA generativa en manos.

Voz: no la generes; pasa el texto con `npm run texto -- <id>` a Andrés.
```

## 3. Vídeo: Stonemasters (avión de marihuana, Yosemite) — chat del amigo, repo
```
Lee primero CLAUDE.md, docs/proceso.md, docs/viralidad.md (obligatorio), docs/guia-visual.md, docs/no-me-gusta.md, docs/referencias.md y la idea #33 en docs/ideas/escalada.md. Repo: AndresBarriga/video-claude-generation-reel. Trabaja en una rama video/E33-stonemasters (o entrega un git bundle).

FASE 1 — SOLO PROPUESTA, SIN CÓDIGO NI RENDER. Entrega en UN mensaje copiable para que Andrés la discuta antes de producir: (1) tu opinión en 2–3 líneas (riesgo principal y qué cambiarías); (2) 5 aperturas y la que eliges; (3) guion escena por escena (qué se ve / qué se dice) con puntuación de viralidad (≥12/14); (4) reparto y la idea visual. Pásala antes por el subagente `critico` y añade su veredicto y su nota de envío (≥7/10). Después PARA y espera a Andrés.

HISTORIA: los escaladores sin dinero de Camp 4 (Yosemite, años 70), el avión cargado de marihuana que se estrelló cerca, Bridwell y el LSD, el casete y la cerveza en la pared. Es una historia muy conocida (documental Valley Uprising): Andrés decide que no hace falta contrastar más. Aun así: SIN cifras concretas del avión (las fuentes se contradicen: 1976/1977, 4 millones $/6.000 libras; di "un avión cargado de marihuana"); sin afirmar quién se quedó con qué (es relato oral: cuéntalo como "se cuenta que…"); sin clips ni fotos reales (derechos); la "foto mítica del casete y la cerveza" se dibuja como escena ORIGINAL, no copies ninguna foto concreta.

TONO: cute y gracioso, drogas como anécdota (sin mostrar consumo, sin "mola"). Riesgo asumido: Instagram/TikTok pueden limitar alcance; no uses imágenes de consumo ni la palabra "droga" en rótulos grandes.

REGLAS DE FORMATO: la jerga ("Stonemasters", "Camp 4") no dice nada a quien no escala: abre con lo universal ("los más pobres del valle y un avión que cae a su lado"); espectador dentro; clímax visual en el primer fotograma (nunca un rótulo); un número o cambio que se mueva; 40–50 s; remate que vuelve al espectador ("¿qué harías tú con un golpe de suerte así?") y SIN llamada a la acción hablada al final (el envío va en el pie de foto/comentario fijado). Piezas: reutiliza `Escalador` (props de E30: Cabeza, cuerpo, pies, bolsa, prismáticos); casete, cerveza y avión no existen aún: créalos como piezas nuevas en `src/piezas/` o dentro de la plantilla, sin tocar el código compartido salvo un cambio pequeño y explicado.

Voz: no la generes; pasa el texto con `npm run texto -- <id>` a Andrés.
```
