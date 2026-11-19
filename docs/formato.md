# Formato fijo (propuesta v1, 19-nov, pendiente de OK de Andrés)

Sale del análisis de las referencias de @pin_v1ew (pies de gato) y @diariodeescalada_ (poleas, antebrazos, depresión), apuntadas en `docs/referencias.md`. Son los mismos temas que nuestros E39 y E43 y tienen 10–100× más vistas: **la diferencia es de ejecución y formato, no de tema**.

## 1. Patrones de las referencias (todos)
**Tema**
- Explica el **mecanismo** de algo que el escalador ya siente o hace (dedos, pump, gatos, miedo). «Lo que nadie te cuenta».
- Valida lo que ya hace el espectador («por eso sacudes la mano»).
- Uno de cada tres vídeos abre a quien no escala (escalar contra la depresión: más envíos que «me gusta»).

**Gancho (0–3 s)**
- La primera frase hablada **es** el gancho, y en pantalla es el subtítulo: no hay rótulo aparte.
- Hay tres tipos: pregunta en «tú» sobre lo que siente («¿Por qué se te cargan los antebrazos a mitad de vía?»), una paradoja que todos conocen («se compran las zapatillas dos tallas más chicas… a propósito») o una afirmación provocadora con dato («funciona contra la depresión… mejor que ir a terapia»).
- La imagen es **la acción misma** en primer plano y moviéndose (la mano en la regleta, el pie en el gato). No hay plano general ni consecuencia.
- Lo que está en juego llega en la 2.ª frase («…y a veces se rompe con un chasquido»).

**Estructura (siempre la misma)**
1. Pregunta o paradoja.
2. Reencuadre: «No es X: es Y».
3. Por dentro: rayos X o anatomía, con la pieza clave iluminada.
4. Analogía cotidiana: caña de pescar, manguera pisada, guante gigante, cuerda de arco.
5. Cifras: 2–4 por vídeo, siempre en gráfico.
6. «Por eso…», que lo conecta con lo que vive.
7. «Pero / Además», el giro.
8. Qué hacer, en lista numerada con progreso (1-2-3 con ✓ y candados).
9. CTA.

Cada vídeo se cuenta con estos bloques.

**Pruebas**
- Estudio científico con cifra concreta, contado sin nombres de autores («En Alemania lo probaron: 156 personas…», «En un estudio con 140.000 personas…»).
- Siempre comparado: tú frente a escalador, 53 % frente a <5 %, 2:17 frente a 6:57, ×3, ÷36, 1 de 5.

**Imagen**
- Un objeto protagonista, centrado en la franja media (libre de los botones de IG).
- Fondo oscuro con partículas desenfocadas; brillo rojo o naranja en lo que sufre, verde en lo que está bien.
- Movimiento continuo de cámara y transformaciones en vez de cortes (casi no hay cortes duros).
- Estelas de movimiento.
- **Algo nuevo cada ~1 s**: cifra, flecha, etiqueta con línea guía, tarjeta ✓/✗, barra, manómetro, cronómetro, cuadrícula de personitas, pantalla partida «tú / escalador».
- Paleta fija: azul marino, naranja/amarillo, rojo, verde.
- Etiquetas en versalitas pequeñas («TALLA DE CALLE», «FUERZA», «ESTUDIO»).

**Texto**
- Subtítulo **arriba**, 1–2 líneas y 2–5 palabras.
- Efecto karaoke: lo ya dicho en gris y la palabra actual en blanco y negrita.
- **La palabra clave dentro de un recuadro** con tiradores, como un cuadro de texto seleccionado.
- Algún emoji suelto.
- No hay más rótulos grandes: los datos van dentro del gráfico.

**Sonido**
- Música de fondo continua (nunca silencio) y voz rápida y natural.

**Duración**
- 50–65 s, con mucha información y sin relleno.

**CTA**
- «Comenta DEDOS» (palabra clave → guía por DM; el perfil vende una guía) → cientos de comentarios.
- O «Guárdalo para tu próxima compra y mándaselo a **ese amigo que dice "…"**», animando el icono de guardar y **la hoja de enviar de IG**.

**Descripción**
- La primera línea es el gancho o el dato, en tono personal («Hasta 4 tallas menos he visto yo 😩»).

**Cuenta**
- La bio es una promesa clara («Lo que nadie te cuenta de la escalada · Datos, historia y trucos») más un producto.
- Las portadas llevan el título grande.
- Pocos vídeos y todos con el mismo formato.

## 2. Qué adoptamos (manteniendo la cuenta)
Mantenemos nuestra animación, los personajes, el humor y el kit. Cambia el **formato**.

**A. Plantilla obligatoria para vídeos de información** (45–60 s). Los bloques 1–9 de arriba, con la pregunta o paradoja en la primera frase. Los personajes salen en el bloque 1 como contexto (la acción en primer plano) y en los chistes; el resto es «por dentro» y gráficos.

**B. Mínimos de cada vídeo (lo comprueba la propuesta y `npm run qa`)**
- Primera frase = gancho, con la acción en primer plano desde el fotograma 0.
- Reencuadre antes de los 6 s.
- Al menos 1 vista por dentro o del mecanismo.
- Al menos 1 analogía cotidiana.
- Al menos 2 cifras en gráfico, una de ellas comparada.
- Al menos 1 estudio o dato verificado (fuente en la ficha, no en pantalla).
- Lista con progreso si hay consejos.
- Algo nuevo cada ~1 s; máximo 2 elementos a la vez además del subtítulo.
- CTA fijo: guardar + «mándaselo a ese que dice "…"» con la hoja de enviar animada.

**C. Subtítulos nuevos para todos los vídeos:** arriba, karaoke en gris y blanco, palabra clave en recuadro. Es un cambio en `src/Subtitulos.tsx` y sirve para todo.

**D. Kit infográfico** (`src/piezas/kit/info`):
- cuadrícula de personitas;
- barra que se llena o se vacía;
- manómetro;
- cronómetros comparados;
- pantalla partida tú/escalador;
- tarjeta ✓/✗;
- lista 1-2-3 con candados;
- cifra grande con etiqueta;
- etiqueta con línea guía;
- vista de rayos X (filtro sobre nuestras piezas);
- hoja de enviar de IG.

**E. Normas que cambian**
- «Persona en una decisión con algo en juego» deja de ser obligatoria en el gancho.
- «Abrir con la consecuencia» pasa a ser una opción, no la regla.
- Los estudios están permitidos y se buscan (verificados; sin nombres en pantalla).
- Duración 45–60 s en información.

**F. Más adelante:** guía gratuita o de pago y «Comenta X» con DM automático. Es la vía de monetización que encaja con lo que hacen las referencias.
