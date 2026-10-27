// Crash pad naranja (el color-hilo del bloque, como la cuerda en vía). En el suelo o plegado a la espalda.
import React from "react";

const NAR = "#FF6A1F", NAR_S = "#B8460E", NAR_C = "#FF9A5C";
/** En el suelo: (x, y) = esquina superior izquierda de la cara de arriba. */
export const CrashPad: React.FC<{ x: number; y: number; w?: number; grosor?: number; hundido?: number }> = ({ x, y, w = 300, grosor = 34, hundido = 0 }) => (
  <g>
    <ellipse cx={x + w / 2} cy={y + grosor + 4} rx={w * 0.55} ry={10} fill="#000" opacity={0.2} />
    <path d={`M${x} ${y + 6} Q${x + w / 2} ${y + hundido * 18} ${x + w} ${y + 6} L${x + w} ${y + grosor} Q${x + w / 2} ${y + grosor + 4} ${x} ${y + grosor} Z`} fill={NAR} />
    <path d={`M${x} ${y + 6} Q${x + w / 2} ${y + hundido * 18} ${x + w} ${y + 6}`} stroke={NAR_C} strokeWidth={6} fill="none" />
    <rect x={x} y={y + grosor * 0.55} width={w} height={grosor * 0.45} fill={NAR_S} opacity={0.6} />
    <path d={`M${x + 12} ${y + grosor * 0.4} L${x + w - 12} ${y + grosor * 0.4}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeDasharray="10 8" />
  </g>
);

/** Plegado a la espalda. (x, y) = cadera del personaje que lo lleva; `mira` igual que el personaje. */
export const PadEspalda: React.FC<{ x: number; y: number; s?: number; mira?: 1 | -1 }> = ({ x, y, s = 1, mira = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * mira} ${s})`}>
    <rect x={-96} y={-150} width={74} height={150} rx={14} fill={NAR} />
    <rect x={-96} y={-150} width={20} height={150} rx={8} fill={NAR_S} />
    <path d="M-60 -150 L-60 0" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} strokeDasharray="10 8" />
    <path d="M-30 -132 L4 -110 M-30 -40 L4 -60" stroke="#1B2230" strokeWidth={8} strokeLinecap="round" />
  </g>
);
