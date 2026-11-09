// E54 «Nanga Parbat». Escenarios nuevos: noche violeta de invierno con estrellas, grieta de hielo azul, la cara del Diamir a escala enorme.
import React from "react";
import { random } from "remotion";
export { C, Camara, Cuerda, Etiqueta, Svg, Zoom, golpe, clamp, type P } from "../Pegue/comun";
export { Bocadillo, sube, temblor } from "../Pierna/comun";

export const INV = { cielo0: "#05040C", cielo1: "#151236", cielo2: "#2B2160", nieve: "#DCE3F2", nieveS: "#9AA5C8", nieveSS: "#5D6693", roca: "#262640", hielo0: "#0E3B5E", hielo1: "#1C6E9E", hielo2: "#56B4D8", hielo3: "#BFEAF7", luz: "#FFE7B0" };

// Reparto (aspecto de Escalador)
export const ELI = { chaqueta: "#6B3FA0", chaquetaSombra: "#4A2A73", pantalon: "#1E2233", casco: "#F2F2F2", peinado: "melena" as const, pelo: "#4A2E1C", manos: "guante" as const };
export const TOMEK = { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#1E2233", casco: null, gorro: "#2E5E8C", barba: "#4A3426", pelo: "#3B2A20", manos: "guante" as const };
export const DENIS = { chaqueta: "#E2742B", chaquetaSombra: "#A9501A", pantalon: "#1E2233", casco: "#F2C230", barba: "#6B4A2E", manos: "guante" as const };
export const ADAM = { chaqueta: "#E6C030", chaquetaSombra: "#A88A1C", pantalon: "#1E2233", casco: "#3A7BD5", manos: "guante" as const };

export const CieloNoche: React.FC<{ id: string; alba?: number }> = ({ id, alba = 0 }) => (
  <g>
    <defs><linearGradient id={`cn${id}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={INV.cielo0} /><stop offset="0.6" stopColor={INV.cielo1} /><stop offset="1" stopColor={alba ? "#7A4A7E" : INV.cielo2} />
    </linearGradient></defs>
    <rect x={-300} y={-300} width={1680} height={2520} fill={`url(#cn${id})`} />
    {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={random(`sx${id}${i}`) * 1080} cy={random(`sy${id}${i}`) * 1300} r={0.8 + random(`sr${id}${i}`) * 2.2} fill="#fff" opacity={(0.35 + random(`so${id}${i}`) * 0.6) * (1 - alba)} />)}
  </g>
);

/** Nieve arrastrada por el viento (horizontal y rápida). */
export const Ventisca: React.FC<{ f: number; n?: number; fuerza?: number }> = ({ f, n = 70, fuerza = 1 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const v = 14 + random(`vv${i}`) * 22, y = random(`vy${i}`) * 1920, x = ((random(`vx${i}`) * 1400 + f * v * fuerza) % 1400) - 160;
    const l = 20 + random(`vl${i}`) * 50;
    return <path key={i} d={`M${x} ${y} l${l} ${l * 0.12}`} stroke="#fff" strokeWidth={2 + random(`vw${i}`) * 3} strokeLinecap="round" opacity={0.25 + random(`vo${i}`) * 0.4} />;
  })}</g>
);

/** Oscuridad con un agujero de luz (la frontal). r = radio; k = 0 negro total, 1 = luz completa. */
export const Oscuridad: React.FC<{ x: number; y: number; r: number; id: string; base?: number }> = ({ x, y, r, id, base = 0.88 }) => (
  <g>
    <defs><radialGradient id={`os${id}`} cx={x} cy={y} r={Math.max(1, r)} gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="0.55" stopColor="#000" stopOpacity={base * 0.25} /><stop offset="1" stopColor="#000" stopOpacity={base} />
    </radialGradient></defs>
    <rect x={-300} y={-300} width={1680} height={2520} fill={`url(#os${id})`} />
  </g>
);
