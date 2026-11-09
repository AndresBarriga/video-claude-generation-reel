// Piezas de E53: el sentado en el borde (Hall o Sharp, misma pose = espejo), el vaho (está vivo) y la oscuridad que se cierra.
import React from "react";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { BORDE, SENTADO_BORDE } from "./comun";

export const CADERA = { x: BORDE.x + 46, y: BORDE.y - 18 };
/** Cabeza aproximada del sentado (para bocadillos, marcas y vaho). */
export const CABEZA = { x: CADERA.x - 20, y: CADERA.y - 136 * BORDE.s - 20 };

export const Sentado: React.FC<{ aspecto: object; cabeza: number; cara: Cara; tr?: number }> = ({ aspecto, cabeza, cara, tr = 0 }) => (
  <Escalador x={CADERA.x + tr} y={CADERA.y} quien="joe" aspecto={aspecto} s={BORDE.s} mira={-1} cara={cara}
    angulos={{ ...SENTADO_BORDE, cabeza, torso: SENTADO_BORDE.torso + cabeza * 0.15 }} />
);

/** Vaho: nubecillas que salen de la boca cada ~1,5 s mientras está vivo. */
export const Vaho: React.FC<{ f: number; x: number; y: number; on?: number }> = ({ f, x, y, on = 1 }) => {
  const c = (f % 45) / 45;
  return (
    <g opacity={on * (1 - c) * 0.8}>
      <circle cx={x - 20 - c * 90} cy={y - c * 40} r={14 + c * 34} fill="#EAF2FA" />
      <circle cx={x - 50 - c * 110} cy={y - 10 - c * 50} r={10 + c * 24} fill="#EAF2FA" opacity={0.7} />
    </g>
  );
};

/** Oscuridad radial con un hueco de luz (r) en (x,y). */
export const Hueco: React.FC<{ x: number; y: number; r: number; id: string; base?: number }> = ({ x, y, r, id, base = 0.9 }) => (
  <g>
    <defs><radialGradient id={`hu${id}`} cx={x} cy={y} r={Math.max(1, r)} gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="0.6" stopColor="#000" stopOpacity={base * 0.3} /><stop offset="1" stopColor="#000" stopOpacity={base} />
    </radialGradient></defs>
    <rect x={-300} y={-300} width={1680} height={2520} fill={`url(#hu${id})`} />
  </g>
);
