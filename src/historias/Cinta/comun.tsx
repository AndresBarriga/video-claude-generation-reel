// E64 «La puerta de la cinta». Usa el KIT de cuerda: aquí solo quedan la vía de ESTE vídeo, el reparto y la cinta en primer plano de frente.
// Escala real (170 px = 1 m): vía vertical de roca de día con seis chapas; la última a 11,6 m. Él cae 1,2 m por encima de la 6.ª:
// si la cinta aguanta cae 2,7 m; si se sale de la chapa le para la 5.ª y cae 6,3 m.
import { crearVia, PERFILES, REPARTO, POSE, distCaida, kTensa, PM } from "../../piezas/kit";
export { C, Etiqueta, Svg, clamp, golpe, type P, PC, suave, cam } from "../../piezas/kit";

export const VIA = crearVia({ perfil: PERFILES.vertical, metros: [3, 4.6, 6.3, 8, 9.8, 11.6], presas: Array.from({ length: 26 }, (_, i) => 2460 - i * 88 - (i % 3) * 9) });
export const TU = REPARTO.tu, ASE = REPARTO.ase, FANTASMA = REPARTO.fantasma;
export const TOP = 5, B6 = VIA.mos(TOP), B5 = VIA.mos(TOP - 1);
/** Cadera en el momento de caer: 1,2 m por encima del mosquetón de la 6.ª. */
export const P0 = VIA.cadera(B6.y - 1.2 * PM);
export const D_BIEN = distCaida(VIA, P0, TOP, 0.3), D_MAL = distCaida(VIA, P0, TOP - 1, 0.3); // 2,7 m y 6,3 m
export const K1 = kTensa(D_BIEN), K2 = kTensa(D_MAL);
export const XASE = 430;
export const AG = POSE.agarreMira;
export const ROJO = "#E2533F", VERDE = "#3FA76A";
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
