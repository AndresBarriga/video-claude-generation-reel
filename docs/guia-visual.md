# Guía visual (estándar de calidad)

Objetivo: que cada fotograma aguante comparación con las cuentas de referencia (numerosdepareja, dasdingo, resultaaquee). Si un fotograma no la aguanta, no se enseña.

## Identidad de la cuenta (norma fija, no se cambia por vídeo)
Esto es lo que hace reconocible la cuenta en el feed. Todo vídeo nuevo lo cumple; si alguna vez hay que romperlo, se decide en el chat de Estrategia y se anota en `docs/estrategia.md`.
- **Personajes con cara y expresión.** Las caras son la firma de la cuenta. Lo fijo es el **estilo**, no los personajes: cada vídeo tiene su reparto. Estilo de `src/piezas/Escalador.tsx`: cabeza redonda de piel cálida, casco de color, dos ojos + boca, cuerpo de bloques redondeados con extremidades gruesas, guantes y botas oscuros, sombra en el suelo. Las emociones se cuentan con la cara (miedo, dolor, esfuerzo, alivio, ojos cerrados) y la postura, nunca con iconos ni símbolos. Siempre hay al menos una cara reaccionando en cada escena con personajes.
- **Reparto variado, mismo estilo.** Cambia en cada vídeo: género, edad, pelo, tono de piel, ropa, casco o gorro, complexión, gafas, barba… Mismo dibujo (proporciones, trazo, caras), personas distintas. Joe (rojo, casco amarillo) y Simon (azul petróleo, casco blanco) son de E15, no protagonistas de la cuenta. En historias reales se presenta a cada personaje con su nombre en una etiqueta de su color la primera vez que sale. En vídeos de identidad, que el espectador pueda verse en alguno (variedad de perfiles).
- **La cuerda naranja (`#FF6A1F`) es el hilo conductor.** Es el único naranja intenso de la paleta: une a los personajes, marca la tensión y, cuando se rompe, se ve deshilachada. La palabra activa del subtítulo va en el mismo naranja. En mascotas el equivalente es la correa verde.
- **Paleta.** Fríos de montaña (azules noche, gris nieve, hielo) + naranja de acento; los cálidos (arena, atardecer, fuego) solo para alivio o final. Nada de violetas brillantes, neón ni degradados de interfaz.
- **Tipografía.** Bricolage Grotesque 800 para rótulos, contadores y subtítulos; Figtree 700 para textos secundarios. Subtítulos con contorno oscuro grueso.
- **Apertura en tensión.** El primer fotograma ya es el momento de máxima tensión (una mano, una cuerda, una cara), con un rótulo de 1–3 palabras que plantea la pregunta («¿Cortas?»). Nada de presentaciones, logos ni contexto antes del gancho.
- **Cierre en bucle.** La última escena repite el plano y el rótulo de la primera para que el vídeo empalme consigo mismo, y cierra con una pregunta al espectador que invite a mandárselo a alguien.
- **Sonido.** Cada vídeo lleva capa de efectos (`sonido.json`, ver `docs/sonido.md`): ambiente constante, un sonido-firma en el momento clave y un silencio justo después.

## Movimiento (reglas de motion designer)
- **Sincronía con la palabra:** cuando la voz nombra algo, aparece o actúa en ese instante (± 2 frames). Usa `framePalabra()` de `src/piezas/sincro.ts`; nunca tiempos fijos «a ojo» si hay palabra que lo ancle.
- **Nada lineal.** Entradas con *ease-out*, salidas con *ease-in*, objetos con peso con un pequeño rebote al asentarse (*overshoot* 5–10 %).
- **Anticipación y continuidad:** antes de una acción fuerte, un gesto contrario breve (agacharse antes de saltar); después, el movimiento sigue un poco (pelo, mochila, cuerda) y se detiene.
- **Escalonar:** elementos de un grupo entran con 2–4 frames de diferencia, nunca todos a la vez.
- **Una acción principal a la vez.** Si dos cosas importantes pasan juntas, una espera.
- **Tiempo de lectura:** un rótulo se mantiene al menos 0,3 s por palabra (mínimo 1 s) antes de cambiar.
- **Cámara motivada:** se mueve porque algo pasa (cae → la cámara cae; tensión → empuje lento), no por decorar. Sacudida solo en impactos y < 10 frames.
- **Transiciones con sentido:** corte en la palabra clave, *match cut* (misma forma/posición entre escenas) o barrido en la dirección del movimiento. Nada de fundidos genéricos.

## Principios
1. **Cada vídeo tiene una idea visual propia** que lo recorre (en E15: la cuerda naranja). Se decide en el storyboard, no al programar.
2. **Un foco por escena.** El ojo sabe dónde mirar en <0,5 s. Lo demás, en segundo plano y más apagado.
3. **Causa visible.** Si la voz dice "porque…", la imagen muestra el porqué (ej.: Simon resbalando hacia el borde antes de cortar). Si no se entiende sin audio, la escena falla.
4. **Movimiento con intención:** cada escena tiene cámara (empuje, paneo o caída), una acción principal y una reacción. Nada estático >1,5 s.
5. **Ritmo:** cambio visual cada 2–4 s; los cortes caen en las palabras clave de la voz.

## Personajes
- Nada de palitos ni puntos de color para heridas. Personajes con **silueta reconocible**: cabeza con casco o pelo, torso con chaqueta de color, extremidades con grosor, manos/pies con forma.
- Escalada: personajes nuevos por vídeo con el mismo estilo; `src/piezas/Escalador.tsx` debe aceptar variantes (pelo, piel, ropa, casco, edad, género) en vez de dos personajes cerrados. Mascotas: misma idea con perros y gatos de razas y colores distintos.
- Mínimo 8 poses por personaje en `src/piezas/` (de pie, sentado asegurando, colgado, cayendo, arrastrándose, escalando, señalando, celebrando). Las emociones se cuentan con postura y cara (2 ojos + boca bastan), no con iconos.
- Tamaño: el protagonista ocupa ≥25 % de la altura en planos medios.

## Composición y profundidad
- Tres planos: fondo (cielo/montaña, poco contraste), medio (escena), primer plano (nieve, roca, cuerda) que enmarca.
- Luz: un degradado de cielo + sombra proyectada simple bajo personajes y objetos.
- Textura sutil (grano o ruido al 3–5 %) para evitar el "vector plano de plantilla".
- Zona segura 1080×1920: nada importante en 200 px superiores ni 290 px inferiores. Subtítulos entre y≈1450 y 1600; la acción principal entre y≈350 y 1350.

## Color
- Paleta por vídeo de 5–6 colores + el color-hilo (cuerda, correa…). Prohibido: degradados violeta/azul con brillo, neón sobre negro, glassmorphism, etiquetas "// 01", interfaces de dashboard.
- Escalada: fríos de montaña + acento naranja. Mascotas: cálidos de casa + acento verde.

## Texto en pantalla
- Subtítulos palabra a palabra, contorno oscuro, palabra activa en color-hilo. Máx. 4 palabras por bloque.
- Rótulo superior solo para **datos** (cifra, lugar, tiempo). Nunca repite lo que dice la voz.
- Cifras animadas (contadores) cuando una cifra es el clímax.

## Lista de revisión (cada fotograma clave, antes de enseñarlo)
- [ ] ¿Se entiende qué pasa sin audio?
- [ ] ¿Hay un solo foco claro?
- [ ] ¿Personajes con silueta y cara, sin puntos/iconos sustitutos?
- [ ] ¿Tres planos y algo de luz/sombra?
- [ ] ¿Nada tapado por subtítulos ni fuera de zona segura?
- [ ] ¿Parece hecho a propósito para esta historia, no una plantilla?
- [ ] ¿Aguanta al lado de un fotograma de la cuenta de referencia?
