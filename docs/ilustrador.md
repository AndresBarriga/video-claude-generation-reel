# Qué entregar si dibuja un ilustrador (prueba corta)

Remotion no dibuja: mueve capas. Pipeline ya existente: SVG con grupos con id → `node tools/piezas-svg.mjs <set>` → `<PiezaSvg>` (rota/mueve/escala/oculta grupos por id, cambia de cara).

## Prueba mínima: 1 personaje, 5 s
Entrega: `personaje.svg` (Illustrator/Figma/Inkscape, vector puro, sin imágenes incrustadas ni efectos raster) con:
1. **Un grupo por parte móvil, con id**: `cabeza`, `torso`, `brazo_sup_izq/der`, `antebrazo_izq/der`, `muslo_izq/der`, `pierna_izq/der` (+ `mano`, `pie` si se quiere).
2. **Cada extremidad dibujada ya completa y con solape** en las articulaciones (hombro, codo, cadera, rodilla), para que al rotar no se vea un hueco.
3. **Pivote de cada grupo** en la articulación: `style="transform-origin:Xpx Ypx;transform-box:view-box"` (o un círculo guía que luego se lee). Si no sabe, basta con marcar un punto por articulación.
4. **Caras alternativas** como grupos: `cara_normal`, `cara_sorpresa`, `cara_feliz` (solo una visible por defecto).
5. Orden de capas correcto (brazo trasero detrás del torso, etc.). Fondo en SVG aparte.
6. Mejor 1 vista (frontal o 3/4) bien hecha que 3 a medias. Poses/ángulos extra = otro SVG.

## Qué queda bien y qué no
- Bien: estilo plano/vectorial, personajes que gesticulan, caminan, señalan, reaccionan; cámara (zoom/paneo), parallax, objetos, rótulos.
- Regular: giros de cuerpo (hay que dibujar otro ángulo), cuerpo que se dobla (escalada con torsión).
- No: dibujo cuadro a cuadro, trazo orgánico/acuarela, deformación tipo goma. Eso es otro flujo (Rive/After Effects/Procreate) y se importaría como vídeo o Lottie, con límites.

## Alternativa si anima en After Effects (biblioteca de clips)
Ella conserva su calidad AE; Remotion monta guion, voz, subtítulos, cortes, cámara y sonido sobre sus clips.
- Entrega: 1 personaje + 6–10 clips cortos (1–3 s, en bucle si es idle/habla): idle, hablar, sorpresa, señalar, encogerse de hombros, reír, "mente volada", caída.
- Formato: fondo transparente (WebM VP9 con alfa, ProRes 4444 o secuencia PNG), 30 fps, lienzo solo del personaje. Nombres claros (`pj_sorpresa.webm`). Guardar el proyecto AE para añadir clips.
- Lottie (Bodymovin) solo si es todo capas de forma: texturas, efectos y expresiones suelen romperse. Mejor vídeo con alfa.
- Contra: menos flexible que el rig (no hay poses nuevas por guion) y se nota la repetición; se compensa con cámara, cortes y fondos distintos. Comprobar el alfa con una prueba antes de pedir más.
