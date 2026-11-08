// E52 «Cuerda detrás de la pierna». Mismo sistema y reparto que E11 (la escaladora de la pierna de Elvis): pared de caliza, valle, cuerda naranja.
// Plano nuevo: DE ESPALDAS (la cámara es el asegurador) para ver la cuerda contra la pantorrilla; la caída, de perfil.
import React from "react";
export { C, Camara, Cuerda, Etiqueta, Svg, Zoom, golpe, clamp, type P } from "../Pegue/comun";
export { TU, ASEG, P11, Cielo, Montanas, Valle, Pajaros, Pared, Bocadillo, Marca, Chapa, temblor, sube, borde } from "../Pierna/comun";
import { Cielo, Montanas, Pared, Valle, P11 } from "../Pierna/comun";

export const rad = (g: number) => (g * Math.PI) / 180;
export const ext = (x: number, y: number, a: number, l: number): [number, number] => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Fondo del plano de espaldas: la pared llena casi todo; a la izquierda asoma el vacío (cielo, montañas, valle). */
export const FondoEspalda: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <Cielo id={id} />
    <Montanas y={1150} />
    <Valle y={1650} />
    <Pared x0={150} semilla={id} />
    <rect x={150} y={-400} width={1400} height={2800} fill={P11.rocaS} opacity={0.12} />
  </g>
);

/** Presa natural de caliza vista de frente (repisa con sombra) y magnesio. */
export const PresaFrente: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 90 }) => (
  <g>
    <path d={`M${x - w / 2} ${y} Q${x} ${y - w * 0.32} ${x + w / 2} ${y} Q${x} ${y + w * 0.16} ${x - w / 2} ${y} Z`} fill={P11.rocaL} stroke="#000" strokeOpacity={0.25} strokeWidth={3} />
    <ellipse cx={x} cy={y + w * 0.14} rx={w * 0.45} ry={w * 0.08} fill="#000" opacity={0.22} />
    <ellipse cx={x} cy={y - w * 0.1} rx={w * 0.28} ry={w * 0.06} fill="#F4EFE6" opacity={0.7} />
  </g>
);
