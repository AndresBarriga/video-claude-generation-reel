// E59 «La segunda chapa». Usa el KIT de cuerda (src/piezas/kit): aquí solo quedan el reparto, la geometría de ESTA vía y sus poses.
// Escala real: 170 px = 1 m. 1.ª chapa (mosquetón) a 3 m, 2.ª a 4,5 m. Chapando por encima de la cabeza la cadera está 1,1 m más abajo:
// la caída mide lo mismo (2 × distancia entre chapas = 3 m) pero empieza más abajo → los pies llegan al suelo.
import { crearVia, REPARTO, POSE, conMano, mix, pChapa, caeSuelo as caeSueloKit, caeCuerda as caeCuerdaKit, kSuelo as kSueloKit, kTensa as kTensaKit, type Angulos, type Cara } from "../../piezas/kit";
export { C, Etiqueta, Svg, clamp, golpe, type P, PC, G, PM, nudo, hombro, mano, cabeza, boca, ikBrazo, conMano, mix, suave, resbala, pNudo } from "../../piezas/kit";
export type { Angulos, Cara };

export const ELLA = REPARTO.ella, EL = REPARTO.el, FANTASMA = REPARTO.fantasma;

/* ---- geometría de esta vía ---- */
export const VIA = crearVia({ chapas: [2086, 1831, 1531, 1231, 931], presas: [1700, 1765, 1850, 1930, 2010, 2105, 2190, 2280, 2370, 2460] });
export const { xF, suelo: SUELO, pie: PIE, chapas: HY, mos, hipX } = VIA;
export const B1 = mos(0), B2 = mos(1);
export const ALTO = VIA.cadera(2070); // chapando por encima de la cabeza
export const CINT = VIA.cadera(1885); // con la chapa en la cintura
export const LEJOS = 400, CERCA = 735; // cadera de quien asegura
export const HOOK = { cx: ALTO.x + 62, cy: 2000, z: 1.75 };

/* ---- poses ---- */
export const AG = POSE.agarreMira, CAE = POSE.cae, ANG_COLGADO = POSE.colgado;
/** Chapando por encima de la cabeza: la mano (con la cuerda) junto al mosquetón de la 2.ª. `j` = temblor. */
export const pAlto = (j = 0) => pChapa(ALTO, B2, 1, j);
/** Chapando con la chapa a la cintura. */
export const pCint = (t = 1) => mix(conMano({ ...AG, cabeza: -6 }, 22, -18, false), conMano({ ...AG, cabeza: -6 }, B2.x - 14 - CINT.x, B2.y + 2 - CINT.y, false), t);

/* ---- caídas ---- */
export const D_CAIDA = 510; // 3 m
export const kSuelo = (y0: number) => kSueloKit(VIA, y0);
export const kTensa = (dy = 0) => kTensaKit(D_CAIDA, dy);
export const caeSuelo = (k: number, p0: { x: number; y: number }, a0: Angulos, xFin: number) => caeSueloKit(VIA, k, p0, a0, xFin);
export const caeCuerda = (k: number, p0: { x: number; y: number }, a0: Angulos, dy = 0) => caeCuerdaKit(k, p0, a0, { d: D_CAIDA, ancla: B1, dy });
