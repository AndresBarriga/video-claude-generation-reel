# E83 «La puerta» — propuesta v2 (25-nov, tras el crítico)
Réplica del reel de @boldr.climbing «Carl is a door» (90K vistas, 7,9× su mediana; `radar/boldr.climbing-17966751636208046/`). El original está en inglés, así que el guion se copia casi tal cual (`docs/decisiones.md`, 25-nov). Animación, personaje, escenario y colores son nuestros. Contexto y comparación con E42 en `brief.md`.

**Opinión:** buena idea. El tema es el de E42 (1,8K), pero aquí el problema era de ejecución, no de tema: gancho absurdo sin respuesta, una sola técnica con su porqué y un personaje fijo que da serie. **Riesgo principal:** el dibujo. Hace falta un personaje **de espaldas** que todavía no tenemos (ver bocetos), y la puerta tiene que leerse en 2D. Lo resuelvo encogiendo el cuerpo sobre la línea de la bisagra, con flecha curva y el chirrido de una bisagra como sonido de firma. **Cambios frente al original:** lo pasamos a una vía de rocódromo con cuerda naranja (nuestro público es de cuerda); quitamos los «175 Nm → 88 Nm», que son cifras sin respaldo y en una unidad que nadie entiende; y «palanca a la mitad» pasa a «palanca más corta» (ver Respaldo).

## Mensaje primero
- **Mensaje:** si te abres como una puerta no es por falta de fuerza: mano y pie del mismo lado hacen de bisagra, y se arregla con la bandera.
- **Problema del espectador:** estira el brazo hacia una presa y el cuerpo gira y le saca de la pared.
- **Valor:** una técnica concreta (bandera) y el porqué (palanca corta + contragiro).
- **Cómo le ayuda:** en el próximo paso lateral cruza la pierna libre y llega.
- **Se identifica:** «mano y pie derechos puestos, voy a por la presa de la izquierda… y me abro». Además: «¿eres un Fermín?».

## 5 aperturas
1. **«Fermín no es débil. Fermín es una puerta.»** ← elegida. Es la del original: absurda, no se responde y el reencuadre ya está en el segundo 0.
2. «No te falta brazo. Te sobra bisagra.»
3. «Estiras el brazo y te abres como una puerta.» (la de E42, que se respondía sola)
4. «Mano y pie del mismo lado: ya sabes cómo acaba esto.»
5. «Este paso no se falla por fuerza. Se falla por física.»

## Personaje (fijo, NUEVO)
Principiante de rocódromo, torpe y entrañable. Va **de espaldas** (como el original, para que se vean las dos mitades del cuerpo y la línea de la bisagra) y **gira la cara por encima del hombro** para reaccionar: así seguimos teniendo caras, que son la firma de la cuenta. Arnés amarillo, pies de gato con calcetín, sin casco (rocódromo).
- **Fermín** ← recomendado: suena a novato entrañable, «Fermín es una puerta» suena bien y no lo hemos usado nunca. Camiseta azul, gafas redondas, pelo revuelto.
- **Quique:** rizos pelirrojos, camiseta verde, todo ilusión.
- **Toño:** barba, cuarentón, camiseta granate.

**Bocetos** (`bocetos.jpg`, hechos con la pieza borrador `src/piezas/Novato.tsx`): 1) los 3 candidatos; 2) la puerta abriéndose con la bisagra; 3) la bandera con palanca y contragiro.

## Guion v1 · ≈34 s (pegado al original)
Escenario: rocódromo claro (pared beige con tornillos y presas de colores, **fondo claro desde el fotograma 0**). Fermín ocupa ~45 % de la altura. El titular del gancho va fijo desde el fotograma 0 (funciona sin sonido) y los subtítulos van arriba con karaoke.

| # | s | Se ve | Se dice |
|---|---|---|---|
| 1 | 0–3 | Fermín ya en la pared: mano y pie derechos puestos, el brazo izquierdo se estira hacia una presa amarilla que brilla. La barra **GIRO** (HUD pequeño y sin cifra, se queda todo el vídeo) se llena en rojo. El cuerpo **se abre como una puerta** (chirrido), pierde las presas y queda colgando de la cuerda, girando. Titular: **FERMÍN NO ES DÉBIL. / ES UNA PUERTA.** | Fermín no es débil. Fermín es una puerta. |
| 2 | 3–7 | Chip «◀◀ REBOBINA»: vuelve a la pared. Aparece una línea roja discontinua **inclinada** que une la mano y el pie derechos (la mano más afuera que el pie), con la etiqueta **BISAGRA** y debajo «MANO + PIE DEL MISMO LADO». | Es lo que llamamos el efecto puerta. Mano y pie del mismo lado hacen de bisagra. |
| 3 | 7–13 | Cámara lenta: el cuerpo gira sobre la línea. Entran escalonados y nunca más de 2 a la vez: primero la flecha roja curva; después, un punto en la cadera (el peso) con una cota **horizontal** roja hasta la línea, etiquetada **PALANCA**. En «no hizo las cuentas», Fermín gira la cara a cámara con cara de miedo. | La gravedad hace girar a Fermín sobre esa bisagra. Palanca larga, giro enorme. Fermín no hizo las cuentas, |
| 4 | 13–18 | Chip «LA SOLUCIÓN». La pierna izquierda cruza estirada al otro lado de la línea, por delante de la pierna de apoyo vista desde cámara, que es lo más legible en 2D. El pie queda **claramente apoyado** en la pared (sombra de contacto y polvo de magnesio). La línea pasa a verde. Etiqueta **LA BANDERA**. | así que le enseñamos un truco nuevo: la bandera. La pierna libre, al otro lado de la bisagra. |
| 5 | 18–25 | Primero la cota se encoge (de rojo a verde) mientras la barra GIRO baja a ámbar. Después, una flecha verde **CONTRAGIRO** desde el pie apoyado. Rótulo pequeño ≥1,5 s sobre la pierna de apoyo: **RODILLA DE APOYO HACIA DONDE APUNTA EL PIE**. | Palanca más corta, mucho menos giro. Y además, su pie empuja la pared: un contragiro. |
| 6 | 25–29 | La mano llega a la presa amarilla (destello). Fermín gira la cara a cámara con media sonrisa (sin más gag). | Ahora llega fácil. Y Fermín está insoportable. |
| 7 | 29–34 | Corte: Fermín ante un paso con el pie a la altura de la cadera, lo mira con cara de miedo. Chip **PARTE 2 · ROCK OVER** y el botón «Seguir» animado; debajo, chip «Mándaselo a tu Fermín». | Parte dos: el rock over. Sígueme para ver si Fermín lo consigue. |

**Idea visual que recorre el vídeo:** la **línea de la bisagra**, roja cuando abre y verde cuando la bandera la cruza. Más el chirrido de bisagra como sonido de firma.
**Técnica única y su porqué:** bandera. La bisagra es la línea **inclinada** que une mano y pie. Si fuera vertical, la gravedad no podría girarte sobre ella, así que se dibuja siempre inclinada y la palanca se mide en horizontal, del peso a la línea. La pierna libre pasa al otro lado, acerca el peso a la línea (palanca más corta) y el pie, apoyado, empuja en contra del giro.
**Seguridad:** la torsión está en la **pierna de apoyo**, la que hace de pivote, no en la de la bandera, que va sin carga. La pierna de apoyo se dibuja con la rodilla hacia donde apunta el pie, sin girarla sobre el pie fijo, y la bandera estirada y relajada. El rótulo lo dice y el pie de foto lo repite. Nada de «suelta»: la caída del gancho es por el giro, que le arranca de las presas.

**Pie de foto:** «Fermín no es débil. Fermín es una puerta 🚪 / Mano y pie del mismo lado = bisagra: la gravedad te gira y te saca de la pared (el efecto puerta). La bandera: pierna libre al otro lado de la línea. Rodilla de apoyo siempre hacia donde apunta el pie. / Parte 2: el rock over. Sígueme para ver si Fermín lo consigue ↓ / #escalada #rocodromo #tecnicadeescalada #boulder #ultimopegue». **Comentario fijado:** «¿En qué paso te abres tú como una puerta?».

### Respaldo
- Efecto puerta y bandera: técnica estándar (fuentes de E42: Philarockgym, Movement Gyms, Nicros, Climbing House).
- «Palanca más corta»: una pierna pesa ≈16–17 % del cuerpo (tablas antropométricas de Dempster/Winter). Al pasarla al otro lado de la línea, el centro de masas se acerca a la bisagra. Con una postura típica sale «casi la mitad», pero depende de la postura, así que **no se dice en voz** y en pantalla va como cota que se encoge, sin cifra.

## Puntuación (`docs/formato.md`, información): 11/14 (por debajo del mínimo de 12, a sabiendas)
Gancho 2 (paradoja absurda con la acción en primer plano) · Reencuadre 2 («no es débil: es una puerta» en el segundo 0) · Mecanismo 2 (bisagra, palanca y contragiro se ven) · Cifras **0** (quitamos a propósito los Nm y la «mitad»: no tienen respaldo) · Giro 2 («Y además, su pie empuja»: el contragiro no lo espera nadie) · Ritmo 2 (algo nuevo cada ~1 s, como mucho 2 elementos a la vez) · CTA **1** (seguir + parte 2 en voz, y «mándaselo a tu Fermín» en pantalla; sin guardar). Los dos puntos que faltan son el precio de no inventar cifras y de usar el cierre del original, que busca seguidores para la serie.

## Las 4 preguntas
1. **Gancho:** un muñeco que sale de la pared «como una puerta» mientras el titular dice que no es débil. Frena porque es absurdo y porque todo el que escala se ha abierto así alguna vez («¿eres un Fermín?»).
2. **Rehook:** en el s 13–18, «le enseñamos un truco nuevo» (promesa de solución), y en el s 21, «su pie empuja la pared: un contragiro», que es el «¿cómo que…?».
3. **Qué retiene hasta el final:** la presa amarilla que brilla desde el s 0 y que no se alcanza hasta el s 25, con la barra de GIRO que baja como progreso visible. El último giro es la parte 2 anunciada.
4. **Qué sabe o busca ya la gente:** «efecto puerta» / *barn door* y «bandera» / *flag* son términos que se buscan y que se dicen, se ven en pantalla y van en el pie. El original ya demostró el formato en inglés (90K con 3,2K seguidores).

## Filtro de 7 preguntas (`docs/formato.md` §11)
Gancho ✓ · Promesa ✓ («no es débil» → ¿entonces qué?) · Segundo gancho ✓ (contragiro) · Aprendizaje ✓ (bandera en su próximo paso lateral; E42 dio 3 técnicas y no se quedó ninguna) · Guardar ≈ (una sola regla, poco que consultar) · Enviar ≈ («a tu Fermín», el amigo que se abre siempre; va en el pie) · Seguir ✓ (serie con personaje fijo y parte 2).

## Crítico (una pasada, propuesta v1): 6 de envío, 7 con cambios
Aplicado:
- La barra «BRAZO 91→9 %» contradecía «no es débil» y era una cifra inventada: ahora es la barra GIRO, sin cifra.
- El aviso de la rodilla iba en la pierna equivocada: ahora va en la de apoyo, que es la que pivota.
- Física: una bisagra vertical no gira con la gravedad, así que la línea va inclinada y la palanca se mide en horizontal.
- La nota «cae porque se abre, no porque se suelte» era falsa: quitada.
- Pie de la bandera claramente apoyado.
- Como mucho 2 elementos a la vez en las escenas 3 y 5.
- Puntuación rebajada a 11/14.
- «Mándaselo a tu Fermín» en pantalla.
- Sin gag de gafas.

No aplicado:
- «El gancho se responde en 3 s»: el s 3 nombra el problema, no la solución (la bandera llega en el s 13). Es la estructura que dio 90K al original.
- Cerrar con «mándaselo» en vez de «sígueme»: el brief pide la parte 2 anunciada.
- Pregunta en voz: alarga un cierre que ya va justo; va en el comentario fijado.

Riesgo que queda: el personaje de espaldas tiene que quedar bien dibujado y la bandera tiene que leerse en 2D (bocetos actualizados).
