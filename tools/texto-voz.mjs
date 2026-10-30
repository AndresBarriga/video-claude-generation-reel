// Texto que se envía a ElevenLabs (web o API) y palabras del guion. Lo usan texto.mjs y voz.mjs: tiene que ser el mismo.

/** Texto exacto para la voz: escenas unidas por espacios; "pausa" → etiqueta <break> de ElevenLabs (modelos v2). */
export function textoVoz(guion) {
  return guion.escenas.map((e) => e.texto.trim() + (e.pausa ? ` <break time="${e.pausa}s" />` : "")).join(" ");
}

/** Palabras del guion (las de los subtítulos) y el rango [primera, última] de cada escena. */
export function palabrasGuion(guion) {
  const palabras = [];
  const rangos = guion.escenas.map((e) => {
    const ini = palabras.length;
    palabras.push(...e.texto.trim().split(/\s+/));
    return [ini, palabras.length - 1];
  });
  return { palabras, rangos };
}

/** ¿La palabra tiene letras o cifras? ("—" o "…" sueltos no cuentan como palabra hablada) */
export const conContenido = (p) => /[\p{L}\p{N}]/u.test(p);
