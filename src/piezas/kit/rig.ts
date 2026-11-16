// KIT · esqueleto de Escalador (s = 1, mira = 1): dónde quedan mano, cabeza y boca, cinemática inversa de brazos, mezcla y catálogo de poses.
// Ángulos: 0 = hacia abajo, 90 = hacia la pared (derecha), 180 = arriba. torso > 0 = inclinado hacia la pared.
import { POSES as BASE, type Angulos } from "../Escalador";
import { suave } from "./base";
export type { Angulos };

const rad = (g: number) => (g * Math.PI) / 180;
const ext = (x: number, y: number, a: number, L: number): [number, number] => [x + Math.sin(rad(a)) * L, y + Math.cos(rad(a)) * L];
export const hombro = (torso: number) => ext(0, 0, 180 - torso, 88);
/** Posición de la mano respecto a la cadera. A = brazo delantero. */
export const mano = (a: Angulos, cual: "A" | "B" = "A") => { const h = hombro(a.torso), g = cual === "A" ? a.brazoA : a.brazoB, e = ext(h[0], h[1], g[0], 52), m = ext(e[0], e[1], g[1], 50); return { x: m[0], y: m[1] }; };
export const cabeza = (a: Angulos) => { const c = ext(0, 0, 180 - a.torso, 136); return { x: c[0], y: c[1], rot: a.torso * 0.6 + a.cabeza }; };
/** Punto de la boca respecto a la cadera. */
export const boca = (a: Angulos) => { const c = cabeza(a), r = rad(c.rot); return { x: c.x + 14 * Math.cos(r) - 19 * Math.sin(r), y: c.y + 14 * Math.sin(r) + 19 * Math.cos(r) }; };
const ik = (sh: [number, number], tx: number, ty: number, codo: 1 | -1): [number, number] => {
  const L1 = 52, L2 = 50, dx = tx - sh[0], dy = ty - sh[1], d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const a1 = base + codo * al, e = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
  return [(a1 * 180) / Math.PI, (Math.atan2(tx - e[0], ty - e[1]) * 180) / Math.PI];
};
/** Ángulos de un brazo para llevar la mano a (tx, ty) respecto a la cadera. */
export const ikBrazo = (torso: number, tx: number, ty: number, codo: 1 | -1) => ik(hombro(torso), tx, ty, codo);
const arriba = (g: number) => (g < -60 ? g + 360 : g);
/** Lleva la mano delantera (A) a (dx, dy) respecto a la cadera. `alta` = brazo por arriba (ángulos continuos al mezclar). */
export const conMano = (a: Angulos, dx: number, dy: number, alta = dy < hombro(a.torso)[1]): Angulos => {
  const g = ik(hombro(a.torso), dx, dy, alta ? 1 : -1);
  return { ...a, brazoA: alta ? [arriba(g[0]), arriba(g[1])] : g };
};
/** Igual con la mano trasera (B). */
export const conManoB = (a: Angulos, dx: number, dy: number, alta = dy < hombro(a.torso)[1]): Angulos => {
  const g = ik(hombro(a.torso), dx, dy, alta ? 1 : -1);
  return { ...a, brazoB: alta ? [arriba(g[0]), arriba(g[1])] : g };
};
export const mix = (a: Angulos, b: Angulos, t: number): Angulos => { const l = (x: number, y: number) => x + (y - x) * t; return { torso: l(a.torso, b.torso), cabeza: l(a.cabeza, b.cabeza), brazoA: [l(a.brazoA[0], b.brazoA[0]), l(a.brazoA[1], b.brazoA[1])], brazoB: [l(a.brazoB[0], b.brazoB[0]), l(a.brazoB[1], b.brazoB[1])], piernaA: [l(a.piernaA[0], b.piernaA[0]), l(a.piernaA[1], b.piernaA[1])], piernaB: [l(a.piernaB[0], b.piernaB[0]), l(a.piernaB[1], b.piernaB[1])] }; };

/* ---- catálogo de poses de cuerda (se ven en la plantilla Catalogo) ---- */
const AGARRE: Angulos = { torso: 18, cabeza: -22, brazoA: [160, 178], brazoB: [146, 168], piernaA: [86, 30], piernaB: [64, 10] };
export const POSE = {
  /** Agarrada a la pared con las dos manos. */ agarre: AGARRE,
  /** Agarrada mirando arriba (a la chapa). */ agarreMira: { ...AGARRE, cabeza: -30 } as Angulos,
  /** Reposo: un brazo estirado colgando de la presa, el otro suelto sacudiendo. */ reposo: { torso: 4, cabeza: -4, brazoA: [168, 180], brazoB: [-14, 6], piernaA: [80, 24], piernaB: [58, 6] } as Angulos,
  /** Colgada de la cuerda tras la caída. */ colgado: { torso: 4, cabeza: -6, brazoA: [40, 20], brazoB: [-30, -10], piernaA: [40, 6], piernaB: [16, -10] } as Angulos,
  /** En el aire, descontrolada (brazos abiertos). */ cae: { torso: -10, cabeza: -18, brazoA: [130, 110], brazoB: [-120, -100], piernaA: [22, 0], piernaB: [-8, -8] } as Angulos,
  /** En el aire con piernas recogidas (desplome). */ caeRecogida: { torso: -10, cabeza: -18, brazoA: [130, 110], brazoB: [-120, -100], piernaA: [50, -10], piernaB: [10, -30] } as Angulos,
  /** Caída BUENA: manos delante sin agarrar nada, piernas semiflexionadas hacia la pared. */ caeBien: { torso: -4, cabeza: -8, brazoA: [62, 104], brazoB: [44, 92], piernaA: [72, 14], piernaB: [52, 2] } as Angulos,
  /** Recibe la pared con los pies tras el péndulo. */ recibe: { torso: -14, cabeza: 0, brazoA: [58, 96], brazoB: [40, 84], piernaA: [88, 58], piernaB: [70, 40] } as Angulos,
  /** Sentada en el suelo tras el golpe. */ sentado: BASE.sentadoSuelo as Angulos,
  /** De pie, relajada. */ pie: BASE.pie as Angulos,
};
/** Mano delantera al nudo (antes de sacar cuerda). */
export const pNudo = (a: Angulos = POSE.agarreMira) => conMano(a, 26, -22, false);
/** Chapar: la mano delantera lleva la cuerda al punto `m` (mosquetón) desde la cadera `p`. t 0–1 = del nudo al mosquetón. `j` = temblor. */
export const pChapa = (p: { x: number; y: number }, m: { x: number; y: number }, t = 1, j = 0, a: Angulos = POSE.agarreMira): Angulos => {
  const dx = m.x - 16 - p.x + Math.sin(j * 1.7) * 5, dy = m.y + 8 - p.y + Math.cos(j * 2.3) * 4, alta = dy < hombro(a.torso)[1];
  return t >= 1 ? conMano(a, dx, dy, alta) : mix(conMano(a, 26, -22, alta), conMano(a, dx, dy, alta), suave(t));
};
/** Agarra algo (cinta, cuerda) con la mano delantera en el punto `m`: el error típico al caer. */
export const pAgarra = (p: { x: number; y: number }, m: { x: number; y: number }, a: Angulos = POSE.cae) => conMano(a, m.x - p.x, m.y - p.y);
/** Resbalón a cámara lenta (t 0–1): el pie se va y el cuerpo se despega. */
export const resbala = (a: Angulos, t: number): Angulos => mix(a, { ...a, torso: a.torso - 10, piernaA: [48, -6], piernaB: [40, -4], brazoB: [150, 150] }, suave(t));
