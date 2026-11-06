// Recetas de sonido de móvil (E50 «No pasa nada»): teclas, envío, deslizar entre apps. Se añaden a RECETAS de tools/sonido.mjs.
export function recetasChat(u) {
  const { SR, buf, ruido, biquad, mezclar, env, normalizar, seno } = u;
  /** Una tecla de teclado de móvil: clic seco y agudo con un cuerpo muy corto. */
  function tecla(out, en, g = 1, seed = 1) {
    mezclar(out, env(biquad(ruido(Math.round(0.03 * SR), seed), "bp", 3800, 1.1), (s) => Math.exp(-s * 160)), en, 0.9 * g);
    mezclar(out, env(seno(0.04, 1500 - 400 * 0), (s) => Math.exp(-s * 150)), en, 0.25 * g);
  }
  return {
    /** 12 pulsaciones a 7 por segundo (coincide con la animación de escritura). */
    teclado() {
      const out = buf(2.0);
      for (let i = 0; i < 12; i++) tecla(out, i / 7, 0.75 + 0.25 * Math.sin(i * 2.3), 100 + i);
      return normalizar(out, 0.55);
    },
    /** Enviar mensaje: whoosh corto y «pop» suave. */
    envio() {
      const out = buf(0.7);
      mezclar(out, env(biquad(ruido(Math.round(0.35 * SR), 71), "bp", (t) => 900 + 3200 * t / 0.3, 0.8), (s) => Math.min(1, s / 0.05) * Math.exp(-s * 9)), 0, 0.5);
      mezclar(out, env(seno(0.2, (t) => 520 + 380 * Math.exp(-t * 30)), (s) => Math.exp(-s * 22)), 0.18, 0.6);
      return normalizar(out, 0.7);
    },
    /** Deslizar la tira de apps: aire que cruza de izquierda a derecha. */
    desliza() {
      const out = buf(0.8);
      mezclar(out, env(biquad(biquad(ruido(Math.round(0.6 * SR), 81), "bp", (t) => 600 + 2400 * Math.sin(Math.PI * Math.min(1, t / 0.5)), 0.7), "lp", 5000), (s) => Math.sin(Math.PI * Math.min(1, s / 0.55)) ** 1.5), 0, 0.8);
      return normalizar(out, 0.5);
    },
    /** Sonido de la tira al empezar (el móvil «abre» las apps): golpe suave. */
    abre() {
      const out = buf(0.5);
      mezclar(out, env(seno(0.3, (t) => 160 * Math.exp(-t * 10) + 70), (s) => Math.exp(-s * 14)), 0, 0.7);
      mezclar(out, env(biquad(ruido(Math.round(0.2 * SR), 91), "bp", 1800, 0.9), (s) => Math.exp(-s * 30)), 0, 0.4);
      return normalizar(out, 0.6);
    },
    /** Cerrar una app: tirón hacia arriba, aire corto y agudo. */
    cierra() {
      const out = buf(0.5);
      mezclar(out, env(biquad(ruido(Math.round(0.3 * SR), 111), "bp", (t) => 3800 - 2600 * Math.min(1, t / 0.25), 0.9), (s) => Math.min(1, s / 0.02) * Math.exp(-s * 12)), 0, 0.7);
      mezclar(out, env(seno(0.12, (t) => 420 + 700 * t / 0.1), (s) => Math.exp(-s * 40)), 0.02, 0.25);
      return normalizar(out, 0.55);
    },
    /** Final resignado: dos notas suaves que bajan. */
    triste() {
      const out = buf(2.2);
      mezclar(out, env(seno(1.4, 392), (s) => Math.min(1, s / 0.03) * Math.exp(-s * 2.6)), 0, 0.5);
      mezclar(out, env(seno(1.6, 311), (s) => Math.min(1, s / 0.03) * Math.exp(-s * 2.2)), 0.55, 0.5);
      return normalizar(out, 0.4);
    },
  };
}
