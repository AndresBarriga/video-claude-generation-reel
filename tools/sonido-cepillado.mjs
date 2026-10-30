// Recetas de sonido de cepillado (E31 «La presa perfecta», E32 «ASMR cepillado»). Se añaden a RECETAS de tools/sonido.mjs.
// Un cepillo sobre resina suena a tres capas: fricción (ruido agudo que sigue la velocidad de la pasada),
// grano (miles de cerdas que se enganchan y sueltan: chasquidos diminutos) y cuerpo (la presa y la pared resuenan en graves).
// Las pasadas siguen la misma función que la animación: velocidad = |cos(2π·rate·(t − fase))|.
export function recetasCepillado(u) {
  const { SR, buf, ruido, biquad, mezclar, env, normalizar, nivelar, prng, seno } = u;

  /** Capas de cepillado. contacto(t) 0–1 (cepillo apoyado); tono(t) multiplica la banda de fricción. */
  function cerdas(seg, { rate, fase = 0, seed = 1, capas = 3, contacto = () => 1, tono = () => 1, grano = 2500, plastico = false }) {
    const n = Math.round(seg * SR), out = new Float32Array(n);
    const vel = (t) => Math.abs(Math.cos(2 * Math.PI * rate * (t - fase))) * contacto(t);
    // 1) fricción
    const fr = biquad(biquad(ruido(n, seed), "bp", (t) => (plastico ? 5200 : 3400) * tono(t), 0.9), "hp", 1500);
    for (let i = 0; i < n; i++) out[i] += fr[i] * vel(i / SR) ** 1.3 * 0.6;
    if (capas >= 2) { // 2) grano: impulsos de Poisson con tasa proporcional a la velocidad
      const r = prng(seed + 7), ch = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const v = vel(i / SR);
        if (Math.abs(r()) < (grano * v) / SR) {
          const a = (0.2 + Math.abs(r())) ** 2, L = 12 + Math.floor(Math.abs(r()) * 30);
          for (let k = 0; k < L && i + k < n; k++) ch[i + k] += r() * a * Math.exp(-k / (L / 3));
        }
      }
      const g = biquad(ch, "hp", plastico ? 5000 : 3000);
      for (let i = 0; i < n; i++) out[i] += g[i] * 0.9;
    }
    if (capas >= 3) { // 3) cuerpo + sala corta
      const cu = biquad(biquad(ruido(n, seed + 3), "bp", plastico ? 900 : 420, 1.4), "lp", 900);
      for (let i = 0; i < n; i++) out[i] += cu[i] * vel(i / SR) * 0.35;
      const seco = Float32Array.from(out);
      for (const [ms, g] of [[11, 0.22], [17, 0.16], [29, 0.1], [41, 0.06]]) {
        const d = Math.round((ms / 1000) * SR), lp = biquad(seco, "lp", 2500);
        for (let i = d; i < n; i++) out[i] += lp[i - d] * g;
      }
    }
    return out;
  }
  /** Soplido: aire turbulento, ataque rápido y cola larga. */
  function soplido(seg = 0.9, seed = 21, fuerza = 1) {
    const n = Math.round(seg * SR);
    const b = biquad(biquad(ruido(n, seed), "bp", (t) => 900 + 700 * Math.min(1, t / 0.15), 0.6), "lp", 3200);
    const grave = biquad(ruido(n, seed + 1), "lp", 260);
    for (let i = 0; i < n; i++) b[i] += grave[i] * 0.5;
    return env(b, (t) => fuerza * Math.min(1, t / 0.07) * Math.exp(-Math.max(0, t - 0.25) / (seg * 0.3)));
  }
  /** Polvo en suspensión: siseo muy suave con alguna chispa. */
  function polvo(seg, seed = 31) {
    const n = Math.round(seg * SR), b = biquad(ruido(n, seed), "hp", 7000), r = prng(seed + 1);
    for (let i = 0; i < n; i++) { b[i] *= 0.06; if (Math.abs(r()) < 6 / SR) for (let k = 0; k < 40 && i + k < n; k++) b[i + k] += r() * 0.08 * Math.exp(-k / 8); }
    return b;
  }
  /** Mezcla circular (para bucles perfectos): lo que se sale por el final entra por el principio. */
  const mezclarCirc = (dst, src, en, g = 1) => { const o = Math.round(en * SR); for (let i = 0; i < src.length; i++) dst[(((o + i) % dst.length) + dst.length) % dst.length] += src[i] * g; };

  /** E32: 8 s exactos, mismas fracciones que src/historias/Asmr (nube 0.1, limpieza 0.1→0.84). capas = 1 liso, 2 grano, 3 completo. */
  const asmr = (capas) => () => {
    const P = 8, n = Math.round(P * SR);
    const dist = (t) => Math.min(t / P, 1 - t / P);
    const ss = (a, b, x) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
    const contacto = (t) => ss(0.06, 0.13, dist(t));
    const tono = (t) => 1 + 0.35 * ss(0.1, 0.84, t / P); // la presa limpia «canta» más agudo
    const out = cerdas(P, { rate: 1, seed: 100 + capas, capas, contacto, tono });
    const sp = soplido(1.3, 120, 1.3);
    mezclarCirc(out, sp, P - 0.55, capas === 1 ? 0.6 : 0.8);
    if (capas >= 2) mezclarCirc(out, polvo(P, 130), 0, 1);
    return nivelar(out, 0.11, 0.75);
  };

  return {
    asmr1: asmr(1), asmr2: asmr(2), asmr3: asmr(3),
    /** Sala de rocódromo: zumbido de ventilación, murmullo lejano y caídas sordas en las colchonetas (bucle). */
    sala() {
      const seg = 14, n = Math.round(seg * SR), out = new Float32Array(n), r = prng(201);
      const hum = biquad(ruido(n, 202), "lp", 180), mur = biquad(ruido(n, 203), "bp", (t) => 500 + 200 * Math.sin(t * 1.3), 1.2);
      for (let i = 0; i < n; i++) { const t = i / SR; out[i] = hum[i] * 0.5 + mur[i] * 0.18 * (0.6 + 0.4 * Math.sin(t * 2.1) * Math.sin(t * 0.7)); }
      for (let t = 1.2; t < seg - 1; t += 2.5 + Math.abs(r()) * 3) mezclar(out, env(biquad(ruido(Math.round(0.3 * SR), 210 + Math.round(t)), "lp", 140), (s) => Math.exp(-s * 18)), t, 0.9);
      return nivelar(out, 0.06, 0.5);
    },
    cepillo3: () => normalizar(cerdas(1.35, { rate: 3, seed: 301 }), 0.8),
    cepillo5: () => normalizar(cerdas(1.05, { rate: 5, seed: 302, grano: 3500 }), 0.85),
    dientes: () => normalizar(cerdas(1.55, { rate: 8, seed: 303, plastico: true, grano: 4000 }), 0.8),
    /** Cepillo de dientes sobre la suela (goma): empieza a 0,8 s y acaba en fase 0, como el fotograma 0. */
    suela() {
      const seg = 2.0, ini = 0.8, rate = 3;
      const out = cerdas(seg, { rate, fase: seg, seed: 304, plastico: true, contacto: (t) => (t > ini + 0.05 ? 1 : 0) });
      return normalizar(biquad(out, "lp", 7000), 0.8);
    },
    soplido: () => normalizar(soplido(1.0, 401), 0.8),
    soplidoCorto: () => normalizar(soplido(0.45, 402), 0.6),
    palmada() {
      const out = buf(0.8);
      mezclar(out, env(biquad(ruido(Math.round(0.08 * SR), 501), "bp", 1600, 0.9), (s) => Math.exp(-s * 70)), 0, 1);
      mezclar(out, env(biquad(ruido(Math.round(0.6 * SR), 502), "bp", 2400, 0.5), (s) => Math.exp(-s * 6)), 0.01, 0.25);
      return normalizar(out, 0.85);
    },
    cremallera() {
      const seg = 0.7, out = buf(seg), r = prng(601);
      for (let t = 0.05, dt = 0.03; t < 0.6; t += dt, dt = Math.max(0.009, dt * 0.93)) mezclar(out, env(biquad(ruido(Math.round(0.004 * SR), 600 + Math.round(t * 1000)), "bp", 2800 + r() * 400, 2), (s) => Math.exp(-s * 900)), t, 0.6 + Math.abs(r()) * 0.4);
      return normalizar(out, 0.6);
    },
    /** Brillo discreto (no un «ting» de dibujos): parciales agudos con ataque lento. */
    brillo() {
      const out = buf(0.9);
      for (const [f, g] of [[2637, 0.4], [3951, 0.25], [5274, 0.15]]) mezclar(out, env(seno(0.9, f), (s) => Math.min(1, s / 0.12) * Math.exp(-s * 5)), 0, g);
      return normalizar(out, 0.3);
    },
    agarre() {
      const out = buf(0.4);
      mezclar(out, env(biquad(ruido(Math.round(0.15 * SR), 701), "lp", 600), (s) => Math.exp(-s * 40)), 0, 1);
      mezclar(out, env(biquad(ruido(Math.round(0.05 * SR), 702), "hp", 2500), (s) => Math.exp(-s * 120)), 0, 0.3);
      return normalizar(out, 0.7);
    },
    /** Goma que patina sobre polvo. */
    chirrido() {
      const seg = 0.35, out = seno(seg, (t) => 1100 - 900 * t + 40 * Math.sin(t * 160));
      const rr = biquad(ruido(out.length, 801), "bp", 2500, 1);
      for (let i = 0; i < out.length; i++) out[i] = out[i] * 0.5 + rr[i] * 0.6;
      return normalizar(env(out, (s) => Math.min(1, s / 0.02) * Math.exp(-s * 6)), 0.75);
    },
    /** Caída en la colchoneta y rebote. */
    golpePad() {
      const out = buf(1.6);
      const thump = (en, g, sd) => { mezclar(out, env(seno(0.5, (t) => 75 - 30 * t), (s) => Math.exp(-s * 12)), en, g); mezclar(out, env(biquad(ruido(Math.round(0.4 * SR), sd), "lp", 380), (s) => Math.exp(-s * 14)), en, g * 0.8); };
      thump(0, 1, 901); thump(0.32, 0.35, 902); thump(0.55, 0.12, 903);
      mezclar(out, env(biquad(ruido(Math.round(1 * SR), 904), "bp", 1800, 0.6), (s) => Math.exp(-s * 4)), 0.02, 0.08);
      return normalizar(out, 0.95);
    },
  };
}
