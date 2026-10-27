// Sincronía sin Whisper: alinea las pausas de la locución con los signos de puntuación del guion.
// 1) ffmpeg silencedetect → silencios del audio. 2) Programación dinámica: cada final de frase/cláusula del guion
// se empareja con un silencio (o se queda sin pareja, p. ej. una coma que el locutor no respeta).
// 3) Dentro de cada tramo de voz, las palabras se reparten por longitud. Error típico: < 0,15 s en cada frase.
import { spawnSync } from "node:child_process";

export function silencios(audio, umbral = "-38dB", minimo = 0.15) {
  const r = spawnSync("ffmpeg", ["-i", audio, "-af", `silencedetect=n=${umbral}:d=${minimo}`, "-f", "null", "-"], { encoding: "utf8" });
  const s = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const e = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  return s.map((a, i) => ({ a, b: e[i] ?? a + minimo }));
}

/** palabras: array de strings del guion. Devuelve [{start, end}] por palabra y los emparejamientos de pausa. */
export function alinear(audio, palabras, dur) {
  const sil = silencios(audio);
  const ini = sil.length && sil[0].a < 0.05 ? sil[0].b : 0.05;
  const ultimo = sil.length && sil[sil.length - 1].b >= dur - 0.05 ? sil[sil.length - 1].a : dur;
  const internos = sil.filter((s) => s.a > ini + 0.05 && s.b < ultimo - 0.05);
  // fronteras: índice de la última palabra de cada cláusula
  const fronteras = [];
  palabras.forEach((p, i) => { if (i < palabras.length - 1 && /[.,;:!?]$/.test(p)) fronteras.push(i); });
  const peso = (p) => p.replace(/[^\p{L}\p{N}]/gu, "").length + 1;
  const pesos = palabras.map(peso), total = pesos.reduce((a, b) => a + b, 0);
  const acum = []; let c = 0; pesos.forEach((w) => { c += w; acum.push(c); });
  const voz = (ultimo - ini) - internos.reduce((a, s) => a + (s.b - s.a), 0);
  // tiempo esperado de cada frontera (suponiendo pausas medias)
  const pausaMedia = internos.length ? internos.reduce((a, s) => a + (s.b - s.a), 0) / Math.max(1, fronteras.length) : 0;
  const esperado = fronteras.map((i, k) => ini + (acum[i] / total) * voz + k * pausaMedia);
  const castigo = (i) => (/[.?!:]$/.test(palabras[i]) ? 0.9 : 0.25);
  // DP clásica de alineamiento
  const F = fronteras.length, S = internos.length;
  const D = Array.from({ length: F + 1 }, () => new Float64Array(S + 1).fill(Infinity));
  const B = Array.from({ length: F + 1 }, () => new Int8Array(S + 1));
  D[0][0] = 0;
  for (let i = 0; i <= F; i++) for (let j = 0; j <= S; j++) {
    if (i === 0 && j === 0) continue;
    let best = Infinity, b = 0;
    if (i > 0 && j > 0) { const m = (internos[j - 1].a + internos[j - 1].b) / 2; const v = D[i - 1][j - 1] + Math.abs(m - esperado[i - 1]); if (v < best) { best = v; b = 1; } }
    if (i > 0) { const v = D[i - 1][j] + castigo(fronteras[i - 1]); if (v < best) { best = v; b = 2; } }
    if (j > 0) { const v = D[i][j - 1] + 0.35; if (v < best) { best = v; b = 3; } }
    D[i][j] = best; B[i][j] = b;
  }
  const pareja = new Map(); // índice de palabra → silencio
  for (let i = F, j = S; i > 0 || j > 0;) {
    const b = B[i][j];
    if (b === 1) { pareja.set(fronteras[i - 1], internos[j - 1]); i--; j--; } else if (b === 2) i--; else j--;
  }
  // anclas: tramos de voz entre silencios emparejados
  const cortes = [...pareja.keys()].sort((a, b) => a - b);
  const tiempos = new Array(palabras.length);
  let desde = 0, t0 = ini;
  for (const fin of [...cortes, palabras.length - 1]) {
    const s = pareja.get(fin), t1 = s ? s.a : ultimo;
    const ws = pesos.slice(desde, fin + 1), suma = ws.reduce((a, b) => a + b, 0);
    let t = t0;
    ws.forEach((w, k) => { const d = (w / suma) * (t1 - t0); tiempos[desde + k] = { start: t, end: t + d - 0.02 }; t += d; });
    desde = fin + 1; t0 = s ? s.b : t1;
  }
  return { tiempos, pareja, sil: internos };
}
