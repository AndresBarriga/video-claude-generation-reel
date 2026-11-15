// E59 «La segunda chapa». Misma cueva desplomada de E47 (se reutiliza el escenario y el sistema de personajes), reparto nuevo.
// Escala real: 170 px = 1 m. 1.ª chapa (mosquetón) a 3 m, 2.ª a 4,5 m. Chapando por encima de la cabeza la cadera está 1,1 m más abajo:
// la caída mide lo mismo (2 × distancia entre chapas = 3 m) pero empieza más abajo → los pies llegan al suelo.
import { POSES, type Angulos, type Cara } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { xF, SUELO, ANG_AGARRE, ANG_COLGADO } from "../Suelta/comun";
export { C, Etiqueta, Svg, clamp, golpe, type P } from "../Pegue/comun";
export { xF, SUELO, PC, ANG_COLGADO } from "../Suelta/comun";
export type { Angulos, Cara };

export const ELLA: Aspecto = { chaqueta: "#C9A23C", chaquetaSombra: "#94762A", pantalon: "#2F3B4C", casco: "#3E6FB0", pelo: "#3A2418", peinado: "melena", piel: "#D9A57C", pielSombra: "#B6835C", manos: "piel" };
export const EL: Aspecto = { chaqueta: "#3F7F86", chaquetaSombra: "#2A5A60", pantalon: "#3A3530", casco: null, gorro: "#B4553C", pelo: "#3B2A20", peinado: "corto", barba: "#3B2A20", piel: "#C99068", pielSombra: "#A46F4C", manos: "piel" };
export const FANTASMA: Aspecto = { chaqueta: "#E2533F", chaquetaSombra: "#B23A2A", pantalon: "#B23A2A", casco: "#E2533F", pelo: "#B23A2A", peinado: "melena", piel: "#F08A78", pielSombra: "#E2533F", manos: "piel" };

/* ---- geometría ---- */
export const PM = 170, PIE = SUELO - 136; // PIE = altura de la cadera de pie en el suelo
export const HY = [2086, 1831, 1531, 1231, 931]; // chapas (la cinta cuelga 54 px)
export const mos = (i: number) => ({ x: xF(HY[i]) - 6, y: HY[i] + 54 });
export const B1 = mos(0), B2 = mos(1);
export const hipX = (y: number) => xF(y) - 78;
export const ALTO = { x: hipX(2070), y: 2070 }; // chapando por encima de la cabeza
export const CINT = { x: hipX(1885), y: 1885 }; // con la chapa en la cintura
export const LEJOS = 400, CERCA = 735; // cadera de quien asegura
export const nudo = (p: { x: number; y: number }) => ({ x: p.x + 18, y: p.y - 6 });
export const HOOK = { cx: ALTO.x + 62, cy: 2000, z: 1.75 };

/* ---- esqueleto (mismas medidas que Escalador, s = 1, mira = 1) ---- */
const rad = (g: number) => (g * Math.PI) / 180;
const ext = (x: number, y: number, a: number, L: number): [number, number] => [x + Math.sin(rad(a)) * L, y + Math.cos(rad(a)) * L];
export const hombro = (torso: number) => ext(0, 0, 180 - torso, 88);
export const mano = (a: Angulos, cual: "A" | "B" = "A") => { const h = hombro(a.torso), g = cual === "A" ? a.brazoA : a.brazoB, e = ext(h[0], h[1], g[0], 52), m = ext(e[0], e[1], g[1], 50); return { x: m[0], y: m[1] }; };
export const cabeza = (a: Angulos) => { const c = ext(0, 0, 180 - a.torso, 136); return { x: c[0], y: c[1], rot: a.torso * 0.6 + a.cabeza }; };
/** Punto de la boca en coordenadas relativas a la cadera. */
export const boca = (a: Angulos) => { const c = cabeza(a), r = rad(c.rot); return { x: c.x + 14 * Math.cos(r) - 19 * Math.sin(r), y: c.y + 14 * Math.sin(r) + 19 * Math.cos(r) }; };
const ik = (sh: [number, number], tx: number, ty: number, codo: 1 | -1): [number, number] => {
  const L1 = 52, L2 = 50, dx = tx - sh[0], dy = ty - sh[1], d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const a1 = base + codo * al, e = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
  return [(a1 * 180) / Math.PI, (Math.atan2(tx - e[0], ty - e[1]) * 180) / Math.PI];
};
export const ikBrazo = (torso: number, tx: number, ty: number, codo: 1 | -1) => ik(hombro(torso), tx, ty, codo);
const arriba = (g: number) => (g < -60 ? g + 360 : g);
/** Lleva la mano delantera a (dx, dy) respecto a la cadera. `alta` = brazo por arriba (ángulos continuos al mezclar poses). */
export const conMano = (a: Angulos, dx: number, dy: number, alta = dy < hombro(a.torso)[1]): Angulos => {
  const g = ik(hombro(a.torso), dx, dy, alta ? 1 : -1);
  return { ...a, brazoA: alta ? [arriba(g[0]), arriba(g[1])] : g };
};
export const mix = (a: Angulos, b: Angulos, t: number): Angulos => { const l = (x: number, y: number) => x + (y - x) * t; return { torso: l(a.torso, b.torso), cabeza: l(a.cabeza, b.cabeza), brazoA: [l(a.brazoA[0], b.brazoA[0]), l(a.brazoA[1], b.brazoA[1])], brazoB: [l(a.brazoB[0], b.brazoB[0]), l(a.brazoB[1], b.brazoB[1])], piernaA: [l(a.piernaA[0], b.piernaA[0]), l(a.piernaA[1], b.piernaA[1])], piernaB: [l(a.piernaB[0], b.piernaB[0]), l(a.piernaB[1], b.piernaB[1])] }; };
export const suave = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };

/* ---- poses ---- */
export const AG: Angulos = { ...ANG_AGARRE, cabeza: -30 };
/** Chapando por encima de la cabeza: la mano (con la cuerda) junto al mosquetón de la 2.ª. `j` = temblor. */
export const pAlto = (j = 0) => conMano(AG, B2.x - 16 - ALTO.x + Math.sin(j * 1.7) * 5, B2.y + 8 - ALTO.y + Math.cos(j * 2.3) * 4, true);
/** Mano en el nudo (antes de sacar cuerda). */
export const pNudo = (a: Angulos = AG) => conMano(a, 26, -22, false);
/** Chapando con la chapa a la cintura. */
export const pCint = (t = 1) => mix(conMano({ ...AG, cabeza: -6 }, 22, -18, false), conMano({ ...AG, cabeza: -6 }, B2.x - 14 - CINT.x, B2.y + 2 - CINT.y, false), t);
export const CAE: Angulos = { torso: -10, cabeza: -18, brazoA: [130, 110], brazoB: [-120, -100], piernaA: [22, 0], piernaB: [-8, -8] };
const SENT = POSES.sentadoSuelo as Angulos;
/** Resbalón a cámara lenta (t 0–1): el pie se va y el cuerpo empieza a despegarse. */
export const resbala = (a: Angulos, t: number): Angulos => mix(a, { ...a, torso: a.torso - 10, piernaA: [48, -6], piernaB: [40, -4], brazoB: [150, 150] }, suave(t));

/* ---- caídas (física real: 9,8 m/s² a 170 px/m y 30 fps → y = G·k²) ---- */
export const G = 0.925;
export const kSuelo = (y0: number) => Math.sqrt((PIE - y0) / G);
/** Caída hasta el SUELO: de pie, las piernas ceden y acaba sentada. k = fotogramas desde que se suelta. */
export const caeSuelo = (k: number, p0: { x: number; y: number }, a0: Angulos, xFin: number) => {
  const kI = kSuelo(p0.y);
  if (k <= 0) return { x: p0.x, y: p0.y, ang: a0, rot: 0, j: -1 };
  if (k < kI) { const g = k / kI; return { x: p0.x + (xFin - p0.x) * g, y: p0.y + G * k * k, ang: mix(a0, CAE, Math.min(1, k / 5)), rot: -6 * g, j: -1 }; }
  const j = k - kI, t = Math.min(1, j / 7), e = 1 - (1 - t) ** 2;
  return { x: xFin - 18 * e, y: PIE + (SUELO - 16 - PIE) * e, ang: mix(CAE, SENT, e), rot: -6 * (1 - e), j };
};
export const D_CAIDA = 510; // 3 m
export const kTensa = (dy = 0) => Math.sqrt((D_CAIDA - dy) / G);
/** Caída que para la CUERDA: 3 m, estirón con rebote y péndulo hasta quedar bajo la 1.ª chapa. `dy` = lo ya caído a cámara lenta. */
export const caeCuerda = (k: number, p0: { x: number; y: number }, a0: Angulos, dy = 0) => {
  const kT = kTensa(dy), xFn = B1.x - 30;
  if (k <= 0) return { x: p0.x, y: p0.y, ang: a0, est: 0, j: -1 };
  if (k < kT) { const g = k / kT; return { x: p0.x + (xFn - p0.x) * 0.3 * g * g, y: p0.y + G * k * k, ang: mix(a0, CAE, Math.min(1, k / 5)), est: 0, j: -1 }; }
  const j = k - kT, est = 62 * Math.exp(-j / 9) * Math.sin(j / 3.2) + 18 * (1 - Math.exp(-j / 6));
  const sw = 1 - Math.exp(-j / 12) * Math.cos(j / 7);
  return { x: p0.x + (xFn - p0.x) * (0.3 + 0.7 * sw), y: p0.y + D_CAIDA - dy + est, ang: mix(CAE, ANG_COLGADO, Math.min(1, j / 8)), est, j };
};
