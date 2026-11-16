// KIT · caídas con física real: 9,8 m/s² a 170 px/m y 30 fps → y = G·k² (k = fotogramas desde que se suelta).
import type { Pt } from "./base";
import { POSE, mix, type Angulos } from "./rig";
import { PM, nudo, type Via } from "./via";

export const G = 0.925;
export const kSuelo = (via: Via, y0: number) => Math.sqrt((via.pie - y0) / G);
export const kTensa = (d: number, dy = 0) => Math.sqrt((d - dy) / G);

/** Caída hasta el SUELO: de pie, las piernas ceden y acaba sentada. `j` ≥ 0 = fotogramas desde el golpe. */
export const caeSuelo = (via: Via, k: number, p0: Pt, a0: Angulos, xFin: number) => {
  const kI = kSuelo(via, p0.y), { pie, suelo } = via;
  if (k <= 0) return { x: p0.x, y: p0.y, ang: a0, rot: 0, est: 0, j: -1, suelo: true };
  if (k < kI) { const g = k / kI; return { x: p0.x + (xFin - p0.x) * g, y: p0.y + G * k * k, ang: mix(a0, POSE.cae, Math.min(1, k / 5)), rot: -6 * g, est: 0, j: -1, suelo: true }; }
  const j = k - kI, t = Math.min(1, j / 7), e = 1 - (1 - t) ** 2;
  return { x: xFin - 18 * e, y: pie + (suelo - 16 - pie) * e, ang: mix(POSE.cae, POSE.sentado, e), rot: -6 * (1 - e), est: 0, j, suelo: true };
};
/** Caída que para la CUERDA: `d` px de caída libre, estirón con rebote y péndulo hasta quedar bajo `ancla` (última chapa pasada).
 *  `dy` = lo ya caído a cámara lenta. `j` ≥ 0 = fotogramas desde que tensa; `est` = estiramiento (para sacudir cámara y levantar a quien asegura). */
export const caeCuerda = (k: number, p0: Pt, a0: Angulos, o: { d: number; ancla: Pt; dy?: number; aire?: Angulos }) => {
  const dy = o.dy ?? 0, kT = kTensa(o.d, dy), xFn = o.ancla.x - 30, aire = o.aire ?? POSE.cae;
  if (k <= 0) return { x: p0.x, y: p0.y, ang: a0, rot: 0, est: 0, j: -1, suelo: false };
  if (k < kT) { const g = k / kT; return { x: p0.x + (xFn - p0.x) * 0.3 * g * g, y: p0.y + G * k * k, ang: mix(a0, aire, Math.min(1, k / 5)), rot: 0, est: 0, j: -1, suelo: false }; }
  const j = k - kT, est = 62 * Math.exp(-j / 9) * Math.sin(j / 3.2) + 18 * (1 - Math.exp(-j / 6));
  const sw = 1 - Math.exp(-j / 12) * Math.cos(j / 7);
  return { x: p0.x + (xFn - p0.x) * (0.3 + 0.7 * sw), y: p0.y + o.d - dy + est, ang: mix(aire, POSE.colgado, Math.min(1, j / 8)), rot: 0, est, j, suelo: false };
};
/** Caída libre (px) si se suelta con la cadera en `p` y la última chapa pasada es la `i`: 2 × lo que sube por encima + comba (m) + cuerda sacada para chapar (m). */
export const distCaida = (via: Via, p: Pt, i: number, comba = 0.3, sacada = 0) => 2 * Math.max(0, via.mos(i).y - nudo(p).y) + (comba + sacada) * PM;
/** ¿Llega al suelo? (con ~0,5 m de estiramiento de cuerda y salto de quien asegura). */
export const tocaSuelo = (via: Via, p: Pt, d: number) => p.y + d + 0.5 * PM >= via.pie;
/** Caída automática: decide cuerda o suelo según la geometría. i = última chapa pasada (-1 = ninguna). */
export const caida = (via: Via, k: number, p0: Pt, a0: Angulos, o: { i: number; comba?: number; sacada?: number; dy?: number; aire?: Angulos }) => {
  if (o.i < 0) return caeSuelo(via, k, p0, a0, p0.x - 24);
  const d = distCaida(via, p0, o.i, o.comba, o.sacada);
  return tocaSuelo(via, p0, d) ? caeSuelo(via, k, p0, a0, p0.x - 24) : caeCuerda(k, p0, a0, { d, ancla: via.mos(o.i), dy: o.dy, aire: o.aire });
};
/** Cuánto levanta la frenada a quien asegura (px, negativo = sube), a partir del `est` de caeCuerda. `dina` 0–1 = cuánto acompaña (dinamiza). */
export const saltoAseg = (est: number, j: number, dina = 0.5) => (j < 0 ? 0 : -est * (0.5 + dina));
