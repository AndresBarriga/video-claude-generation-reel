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

/** «Foto» de él escalando: arenisca con estratos, cielo, árboles, chapa con cinta y la cuerda; luz cálida y grano. */
export const Foto: React.FC<{ w: number; h: number; id: string }> = ({ w, h, id }) => {
  const k = h / 340, X = (v: number) => w * v, Y = (v: number) => h * v;
  return (
    <g>
      <defs>
        <linearGradient id={"fg" + id} x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stopColor="#EBC592" /><stop offset="0.55" stopColor="#CD9962" /><stop offset="1" stopColor="#9C6A40" /></linearGradient>
        <linearGradient id={"fs" + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5FA8E8" /><stop offset="1" stopColor="#BFE0F7" /></linearGradient>
        <radialGradient id={"fv" + id} cx="0.5" cy="0.45" r="0.8"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#1A0E05" stopOpacity="0.55" /></radialGradient>
        <linearGradient id={"fl" + id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFE9B8" stopOpacity="0.45" /><stop offset="0.5" stopColor="#FFE9B8" stopOpacity="0" /></linearGradient>
        <filter id={"fr" + id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" /><feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.07  0 0 0 0 0.04  0 0 0 0.55 0" /></filter>
        <clipPath id={"fc" + id}><rect width={w} height={h} /></clipPath>
      </defs>
      <g clipPath={`url(#fc${id})`}>
        <rect width={w} height={h} fill={`url(#fg${id})`} />
        <path d={`M${X(0.72)} 0 L${w} 0 L${w} ${Y(0.34)} C${X(0.9)} ${Y(0.3)} ${X(0.8)} ${Y(0.14)} ${X(0.72)} 0Z`} fill={`url(#fs${id})`} />
        <g fill="#3F6B34"><ellipse cx={X(0.86)} cy={Y(0.3)} rx={X(0.09)} ry={Y(0.06)} /><ellipse cx={X(0.8)} cy={Y(0.2)} rx={X(0.06)} ry={Y(0.04)} /></g>
        {[0.16, 0.3, 0.47, 0.66, 0.82].map((v, i) => <path key={i} d={`M0 ${Y(v)} C${X(0.3)} ${Y(v - 0.03)} ${X(0.6)} ${Y(v + 0.04)} ${w} ${Y(v - 0.01)}`} stroke={i % 2 ? "#8D5E37" : "#E4B684"} strokeWidth={(4 + i) * k} fill="none" opacity={0.45} />)}
        <g stroke="#6F4A2B" strokeWidth={3 * k} fill="none" opacity={0.55} strokeLinecap="round">
          <path d={`M${X(0.1)} 0 L${X(0.18)} ${Y(0.45)} L${X(0.12)} ${h}`} /><path d={`M${X(0.34)} ${Y(0.1)} l${X(0.1)} ${Y(0.05)} l${-X(0.03)} ${Y(0.1)}`} /><path d={`M${X(0.58)} ${Y(0.84)} l${X(0.16)} ${-Y(0.04)}`} />
        </g>
        {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={X(((i * 37) % 100) / 100)} cy={Y(((i * 53) % 100) / 100)} r={(1.6 + (i % 3)) * k} fill="#7A5230" opacity={0.28} />)}
        <path d={`M0 ${Y(0.93)} C${X(0.2)} ${Y(0.86)} ${X(0.4)} ${Y(0.95)} ${X(0.6)} ${Y(0.9)} C${X(0.8)} ${Y(0.86)} ${X(0.9)} ${Y(0.94)} ${w} ${Y(0.9)} L${w} ${h} L0 ${h}Z`} fill="#3A5A2E" />
        <path d={`M${X(0.52)} 0 C${X(0.56)} ${Y(0.2)} ${X(0.46)} ${Y(0.34)} ${X(0.5)} ${Y(0.5)}`} stroke={NARANJA} strokeWidth={7 * k} fill="none" />
        <g transform={`translate(${X(0.53)} ${Y(0.16)})`}><circle r={6 * k} fill="#C9CED6" stroke="#4A5360" strokeWidth={2 * k} /><ellipse cx={4 * k} cy={13 * k} rx={5 * k} ry={14 * k} fill="#E8B923" stroke="#6B5410" strokeWidth={1.5 * k} /></g>
        <path d={`M${X(0.5)} ${Y(0.5)} C${X(0.44)} ${Y(0.7)} ${X(0.58)} ${Y(0.82)} ${X(0.5)} ${Y(0.93)}`} stroke={NARANJA} strokeWidth={6 * k} fill="none" opacity={0.9} />
        <Escalador quien="joe" pose="escalando" x={X(0.5)} y={Y(0.66)} s={0.8 * k} />
        <rect width={w} height={h} fill={`url(#fl${id})`} /><rect width={w} height={h} fill={`url(#fv${id})`} />
        <rect width={w} height={h} filter={`url(#fr${id})`} opacity={0.5} />
      </g>
    </g>
  );
};
