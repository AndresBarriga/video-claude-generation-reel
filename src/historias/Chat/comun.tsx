// E50 «No pasa nada»: piezas comunes de la interfaz de móvil (genérica, sin marcas reales).
import React from "react";
import { Escalador } from "../../piezas/Escalador";
export { ei, clamp } from "../Rapel/comun";
export type { P } from "../Pegue/comun";

export const UI = "Figtree, sans-serif", TIT = "Bricolage Grotesque, sans-serif";
export const NARANJA = "#FF6A1F";

export const Smiley: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#FFCC33" />
    <circle cx={-r * 0.35} cy={-r * 0.2} r={r * 0.11} fill="#4A3300" /><circle cx={r * 0.35} cy={-r * 0.2} r={r * 0.11} fill="#4A3300" />
    <path d={`M${-r * 0.5} ${r * 0.2} Q0 ${r * 0.85} ${r * 0.5} ${r * 0.2}`} stroke="#4A3300" strokeWidth={r * 0.13} fill="none" strokeLinecap="round" />
  </g>
);

/** «Foto» de él escalando (el personaje de la cuenta sobre arenisca), w×h con origen en (0,0). */
export const Foto: React.FC<{ w: number; h: number; id: string }> = ({ w, h, id }) => {
  const k = h / 340;
  return (
    <g>
      <defs>
        <linearGradient id={"fg" + id} x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#E3B985" /><stop offset="1" stopColor="#A9794B" /></linearGradient>
        <radialGradient id={"fv" + id} cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.45" /></radialGradient>
        <clipPath id={"fc" + id}><rect width={w} height={h} /></clipPath>
      </defs>
      <g clipPath={`url(#fc${id})`}>
        <rect width={w} height={h} fill={`url(#fg${id})`} />
        <g stroke="#7E5532" strokeWidth={3 * k} fill="none" opacity={0.5} strokeLinecap="round">
          <path d={`M${w * 0.12} 0 L${w * 0.2} ${h * 0.4} L${w * 0.15} ${h}`} /><path d={`M${w * 0.82} 0 L${w * 0.76} ${h * 0.5} L${w * 0.86} ${h}`} />
          <path d={`M${w * 0.35} ${h * 0.12} l${w * 0.12} ${h * 0.05}`} /><path d={`M${w * 0.58} ${h * 0.85} l${w * 0.14} ${-h * 0.04}`} />
        </g>
        <path d={`M${w * 0.52} 0 C${w * 0.55} ${h * 0.25} ${w * 0.49} ${h * 0.4} ${w * 0.5} ${h * 0.55}`} stroke={NARANJA} strokeWidth={7 * k} fill="none" />
        <Escalador quien="joe" pose="escalando" x={w * 0.5} y={h * 0.66} s={0.78 * k} />
        <rect width={w} height={h} fill={`url(#fv${id})`} />
      </g>
    </g>
  );
};
