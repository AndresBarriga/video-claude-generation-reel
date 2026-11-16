// KIT · ACCIONES completas en función de t (0–1) o k (fotogramas): devuelven posición, pose y cuerda listas para dibujar.
import { suave, type Pt } from "./base";
import { POSE, mix, mano, pChapa, conMano, conManoB, type Angulos } from "./rig";
import { caida, saltoAseg } from "./fisica";
import { porChapas } from "./Cuerda";
import { aparato, nudo, type Via } from "./via";

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const tr = (t: number, a: number, b: number) => c01((t - a) / (b - a));
const FASE_B: Angulos = { torso: 14, cabeza: -26, brazoA: [148, 170], brazoB: [164, 182], piernaA: [58, 6], piernaB: [94, 36] };

/** ESCALAR de la altura y0 a y1 (cadera) en `pasos` movimientos alternos. */
export const accEscalar = (via: Via, y0: number, y1: number, t: number, pasos = Math.max(1, Math.round(Math.abs(y1 - y0) / 90))) => {
  const u = c01(t) * pasos, n = Math.min(pasos - 1, Math.floor(u)), fr = u - n, e = suave(fr), sube = Math.sin(fr * Math.PI);
  const de = n % 2 ? FASE_B : POSE.agarre, a = n % 2 ? POSE.agarre : FASE_B, ang = mix(de, a, e);
  if (n % 2) ang.brazoA = [ang.brazoA[0] - 10 * sube, ang.brazoA[1] - 26 * sube]; else ang.brazoB = [ang.brazoB[0] - 10 * sube, ang.brazoB[1] - 26 * sube];
  return { p: via.cadera(y0 + (y1 - y0) * ((n + e) / pasos)), ang };
};
/** CHAPAR la chapa i desde la cadera p: mano al nudo → saca cuerda → al mosquetón → clic → vuelve a la presa.
 *  Devuelve la pose, `lleva` (la mano lleva la cuerda), `chapada` y `clic` (fotogramas·30 desde el clic, <0 antes) y la cuerda completa con `sogaChapar`. */
export const accChapar = (via: Via, p: Pt, i: number, t: number, o: { temblor?: number; base?: Angulos } = {}) => {
  const base = o.base ?? POSE.agarreMira, m = via.mos(i), j = (o.temblor ?? 0) * t * 40;
  const ang = t < 0.22 ? mix(base, pChapa(p, m, 0, 0, base), suave(t / 0.22)) : t < 0.8 ? pChapa(p, m, tr(t, 0.22, 0.68), t < 0.68 ? j : 0, base) : mix(pChapa(p, m, 1, 0, base), base, suave(tr(t, 0.8, 1)));
  const h = mano(ang);
  return { ang, mano: { x: p.x + h.x, y: p.y + h.y }, lleva: t > 0.2 && t < 0.74, chapada: t >= 0.74, clic: (t - 0.74) * 30 };
};
/** Cuerda mientras se chapa: hasta la chapa i−1, sube a la mano (bucle) y vuelve al nudo; una vez chapada pasa por la chapa i. */
export const sogaChapar = (via: Via, desde: Pt, i: number, p: Pt, a: { mano: Pt; lleva: boolean; chapada: boolean }): Pt[] => {
  if (a.chapada) return porChapas(via, desde, i + 1, p);
  const pts = porChapas(via, desde, i, p);
  return a.lleva ? [...pts.slice(0, -1), { ...a.mano, sx: -24 }, { ...nudo(p), sx: -46, sag: 10 }] : pts;
};
/** CAÍDA COMPLETA del sistema: quien cae, quien asegura (la frenada lo levanta) y la cuerda. k = fotogramas desde que se suelta.
 *  `dina` 0 = frenada seca (asegurador clavado, golpe contra la pared) · 1 = dinamizada (salta y acompaña). `sh` = sacudida de cámara. */
export const sistemaCaida = (via: Via, k: number, p0: Pt, a0: Angulos, o: { i: number; xAseg: number; comba?: number; sacada?: number; dina?: number; aire?: Angulos }) => {
  const dina = o.dina ?? 0.5, c = caida(via, k, p0, a0, o), dy = c.suelo ? 0 : saltoAseg(c.est, c.j, dina) - (c.j >= 0 ? 150 * dina * (1 - Math.exp(-c.j / 4)) * Math.exp(-c.j / 40) : 0);
  const seco = c.j >= 0 && !c.suelo ? (1 - dina) * Math.exp(-c.j / 10) : 0;
  const p = { x: c.x + seco * 34, y: c.y - (c.suelo ? 0 : dy * 0.5) }, ang = seco > 0.05 ? mix(c.ang, POSE.recibe, Math.min(1, seco * 1.6)) : c.ang;
  return {
    p, ang, rot: c.rot, j: c.j, suelo: c.suelo, est: c.est, golpe: seco,
    cara: (c.j >= 0 ? (c.suelo || dina < 0.3 ? "dolor" : "alivio") : "miedo") as "dolor" | "alivio" | "miedo",
    aseg: { x: o.xAseg, dy, vuelo: c01(-dy / 70), comba: c.j < 0 ? 0.25 : 0, cuerda: false, cara: (c.j >= 0 ? "esfuerzo" : "miedo") as "esfuerzo" | "miedo" },
    pts: porChapas(via, aparato(via, o.xAseg, dy), c.suelo ? Math.max(0, o.i + 1) : o.i + 1, p, { comba: c.j < 0 ? 50 : 6, floja: c.j < 0 || c.suelo ? 46 : 0 }),
    sh: c.j >= 0 && c.j < 9 ? Math.sin(c.j * 2.6) * (c.suelo ? 20 : 8 + 10 * (1 - dina)) * (1 - c.j / 9) : 0,
  };
};
/** DESCOLGAR: baja colgada de y0 a y1 con los pies en la pared y las manos en la cuerda. */
export const accDescolgar = (via: Via, y0: number, y1: number, t: number) => {
  const y = y0 + (y1 - y0) * c01(t), paso = Math.sin(t * Math.PI * 6) * 8;
  const base: Angulos = { torso: -22, cabeza: 8, brazoA: [0, 0], brazoB: [0, 0], piernaA: [84 + paso, 62], piernaB: [70 - paso, 48] };
  return { p: { x: via.hipX(y) - 26, y }, ang: conManoB(conMano(base, 20, -60), 14, -34) };
};
/** ASEGURAR · gestos de quien asegura (props para <Asegurador>): dar cuerda (un bombeo por ciclo), recoger, mirar arriba. */
export const accAseg = (modo: "dar" | "recoger" | "atento", t: number) => {
  const pulso = Math.sin(c01(t) * Math.PI);
  if (modo === "dar") return { feed: pulso, alza: 1, comba: 0.1 + 0.2 * suave(t) };
  if (modo === "recoger") return { feed: 1 - suave(t), alza: 1, comba: 0.5 * (1 - suave(t)) };
  return { feed: 0, alza: 1, comba: 0.08 };
};
/** Cámara lenta: a partir de f0 y durante `dur` fotogramas el tiempo corre a `factor`; después sigue normal. Devuelve el tiempo remapeado. */
export const lento = (f: number, f0: number, dur: number, factor = 0.25) => (f < f0 ? f : f < f0 + dur ? f0 + (f - f0) * factor : f0 + dur * factor + (f - f0 - dur));
/** 0→1 en los últimos `n` fotogramas de un vídeo de `total` (para fundir al estado del fotograma 0 y que el bucle no se note). */
export const bucle = (f: number, total: number, n = 10) => c01((f - (total - n)) / n);
