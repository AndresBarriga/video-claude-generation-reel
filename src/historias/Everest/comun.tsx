// E53 «Sharp / Everest»: piezas comunes. Noche azul fría, un cono de luz naranja de frontal, nieve cayendo, escarcha.
import React from "react";
import { random } from "remotion";
export { C, Camara, Svg, clamp, golpe, type P } from "../Pegue/comun";
export { Rotulo, Chip, ei, salida } from "../Pump/comun";

export const NOCHE = { cieloA: "#050B14", cieloB: "#13243B", nieve: "#C9D8E6", nieveS: "#8FA5BC", roca: "#1A2230", rocaS: "#0F1620", luz: "#FFB36B", escarcha: "#F4FAFF" };

/** Nieve cayendo (n copos), deriva a la derecha por el viento. */
export const Nieve: React.FC<{ f: number; n?: number; op?: number }> = ({ f, n = 70, op = 0.7 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const sp = 2.2 + random(`ns${i}`) * 3.4, x0 = random(`nx${i}`) * 1300 - 100, y0 = random(`ny${i}`) * 2100;
    const x = (x0 + f * (1.6 + random(`nw${i}`) * 2.2)) % 1300 - 100, y = (y0 + f * sp) % 2100 - 100;
    return <circle key={i} cx={x} cy={y} r={2 + random(`nr${i}`) * 4.5} fill="#fff" opacity={op * (0.35 + random(`no${i}`) * 0.65)} />;
  })}</g>
);

/** Escarcha en una zona (pestañas, mejillas, hombros): puntitos blancos sobre un círculo de radio r. */
export const Escarcha: React.FC<{ x: number; y: number; r: number; n?: number; seed?: string; op?: number }> = ({ x, y, r, n = 26, seed = "e", op = 0.9 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const a = random(`${seed}a${i}`) * Math.PI * 2, d = Math.sqrt(random(`${seed}d${i}`)) * r;
    return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={1.5 + random(`${seed}r${i}`) * 3.5} fill={NOCHE.escarcha} opacity={op * (0.5 + random(`${seed}o${i}`) * 0.5)} />;
  })}</g>
);

/** Foco de luz (de frontal): cono desde (x,y) hacia (tx,ty). */
export const Cono: React.FC<{ x: number; y: number; tx: number; ty: number; ancho?: number; op?: number; id: string }> = ({ x, y, tx, ty, ancho = 260, op = 0.4, id }) => {
  const dx = tx - x, dy = ty - y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  return (
    <g>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={tx} y2={ty}><stop offset="0" stopColor="#FFE9B8" stopOpacity={op} /><stop offset="1" stopColor="#FFB36B" stopOpacity={0} /></linearGradient></defs>
      <path d={`M${x} ${y} L${tx + nx * ancho} ${ty + ny * ancho} L${tx - nx * ancho} ${ty - ny * ancho} Z`} fill={`url(#${id})`} />
    </g>
  );
};

// ---- E53 v10 «Hall y Sharp»: reparto y luz ----
export { Etiqueta, Zoom } from "../Pegue/comun";
export { Bocadillo, Marca, sube, temblor } from "../Pierna/comun";
/** Lincoln Hall: traje de plumas amarillo abierto, sin gorro ni guantes, pelo canoso. */
export const HALL = { chaqueta: "#E0A526", chaquetaSombra: "#A8771A", pantalon: "#C78F1C", casco: null, peinado: "corto" as const, pelo: "#B8B2A8", barba: "#9C968C", manos: "piel" as const, piel: "#E6B48F", pielSombra: "#C08E6B" };
/** David Sharp: plumas rojo, gorro, guantes. */
export const SHARP = { chaqueta: "#B8322A", chaquetaSombra: "#82231D", pantalon: "#2B3442", casco: null, gorro: "#2D3A4E", barba: "#4A3426", pelo: "#3B2A20", manos: "guante" as const };
/** Equipo de Mazur (los cuatro). */
export const MAZUR = [
  { chaqueta: "#2F6FB0", chaquetaSombra: "#1F4E80", pantalon: "#1E2633", casco: null, gorro: "#C8402E", manos: "guante" as const },
  { chaqueta: "#3B8F5A", chaquetaSombra: "#28653F", pantalon: "#1E2633", casco: null, gorro: "#F2C230", manos: "guante" as const },
  { chaqueta: "#8A4FB0", chaquetaSombra: "#62377E", pantalon: "#1E2633", casco: null, gorro: "#2E5E8C", manos: "guante" as const },
  { chaqueta: "#D95F2B", chaquetaSombra: "#A0431C", pantalon: "#1E2633", casco: null, gorro: "#1E2633", manos: "guante" as const },
];
/** Su equipo de la noche anterior (sherpas). */
export const SHERPAS = [
  { chaqueta: "#4C5C70", chaquetaSombra: "#36424F", pantalon: "#1E2633", casco: null, gorro: "#8E2A1F", manos: "guante" as const },
  { chaqueta: "#6A5A3E", chaquetaSombra: "#4B402C", pantalon: "#1E2633", casco: null, gorro: "#2E5E8C", manos: "guante" as const },
];
/** Pose sentado al borde, piernas colgando (mira -1 = hacia el vacío a la izquierda). El origen es la cadera, apoyada en el borde. */
export const SENTADO_BORDE = { torso: -4, cabeza: 34, brazoA: [44, 70] as [number, number], brazoB: [36, 62] as [number, number], piernaA: [92, 4] as [number, number], piernaB: [86, -4] as [number, number] };
export const BORDE = { x: 600, y: 1300, s: 2.5 }; // posición común de Hall y de Sharp (el espejo)
