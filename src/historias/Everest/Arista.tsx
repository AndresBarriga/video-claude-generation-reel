// Escenario de E53: la arista noreste del Everest. Un mismo encuadre para Hall (amanecer) y Sharp (noche):
// a la izquierda el vacío y el mar de nubes; en el centro, el borde donde se sientan; arriba a la derecha, la pirámide cimera.
// luz: 0 = noche, 1 = amanecer. cueva: dibuja el saliente de roca (la cueva de Sharp).
import React from "react";
import { interpolateColors, random } from "remotion";
import { BORDE } from "./comun";

const mix = (a: string, b: string, t: number) => interpolateColors(t, [0, 1], [a, b]);
export const Arista: React.FC<{ luz: number; cueva?: boolean; f: number; cima?: number }> = ({ luz, cueva = false, f, cima = 1 }) => {
  const cielo0 = mix("#040814", "#2B3A6B", luz), cielo1 = mix("#0E1A33", "#F4A47C", luz), cielo2 = mix("#16233F", "#FFD9A0", luz);
  const nieve = mix("#5E6F8A", "#FBE7DA", luz), nieveS = mix("#33415A", "#C9A7B8", luz), roca = mix("#151B27", "#4A3A48", luz), rocaS = mix("#0B0F17", "#2E2433", luz);
  const nubes = mix("#1B2740", "#FBD3C2", luz);
  return (
    <g>
      <defs>
        <linearGradient id="arCielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cielo0} /><stop offset="0.55" stopColor={cielo1} /><stop offset="0.75" stopColor={cielo2} /></linearGradient>
        <radialGradient id="arSol" cx="120" cy="1180" r="900" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFE2A8" stopOpacity={0.55 * luz} /><stop offset="1" stopColor="#FFE2A8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-300} y={-300} width={1680} height={2520} fill="url(#arCielo)" />
      {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={random(`es${i}`) * 1080} cy={random(`ey${i}`) * 1000} r={0.8 + random(`er${i}`) * 2} fill="#fff" opacity={(1 - luz) * (0.3 + random(`eo${i}`) * 0.6)} />)}
      <rect x={-300} y={-300} width={1680} height={2520} fill="url(#arSol)" />
      {/* pirámide cimera, al fondo (cima: 1 visible, 0 sale por arriba) */}
      <g transform={`translate(0 ${-700 * (1 - cima)})`}>
        <path d="M380 1080 L700 300 L760 260 L820 310 L1300 1000 L1300 1180 L380 1180 Z" fill={nieveS} />
        <path d="M760 260 L820 310 L1300 1000 L1300 1180 L860 1180 L800 700 Z" fill={roca} opacity={0.55} />
        <path d="M700 300 L760 260 L740 420 L640 560 Z" fill={nieve} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${560 + i * 90} ${640 + i * 80} Q${700 + i * 60} ${700 + i * 90} ${880 + i * 70} ${660 + i * 90}`} stroke={roca} strokeWidth={14} fill="none" opacity={0.6} />)}
      </g>
      {/* mar de nubes abajo a la izquierda, muy por debajo */}
      {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={-60 + i * 120 + Math.sin(f / 60 + i) * 8} cy={1580 + (i % 3) * 30} rx={150} ry={46} fill={nubes} opacity={0.85} />)}
      <rect x={-300} y={1600} width={1100} height={900} fill={nubes} opacity={0.9} />
      {/* la arista: plataforma de nieve a la derecha, cortada en el borde (precipicio a la izquierda) */}
      <path d={`M${BORDE.x - 60} ${BORDE.y + 10} L${BORDE.x + 40} ${BORDE.y - 14} L1300 ${BORDE.y - 120} L1300 2400 L${BORDE.x - 80} 2400 Z`} fill={nieve} />
      <path d={`M${BORDE.x - 60} ${BORDE.y + 10} L${BORDE.x - 30} ${BORDE.y + 300} L${BORDE.x - 110} ${BORDE.y + 620} L${BORDE.x - 70} 2400 L${BORDE.x + 120} 2400 L${BORDE.x + 60} ${BORDE.y + 40} Z`} fill={roca} />
      <path d={`M${BORDE.x - 30} ${BORDE.y + 300} L${BORDE.x + 40} ${BORDE.y + 260} L${BORDE.x - 40} ${BORDE.y + 700} Z`} fill={rocaS} />
      <path d={`M${BORDE.x - 60} ${BORDE.y + 10} L${BORDE.x + 40} ${BORDE.y - 14} L1300 ${BORDE.y - 120}`} stroke={mix("#8FA5BC", "#FFFFFF", luz)} strokeWidth={8} fill="none" opacity={0.8} />
      {/* huellas que llegan por la arista */}
      {Array.from({ length: 7 }).map((_, i) => <ellipse key={i} cx={1240 - i * 80} cy={BORDE.y - 110 + i * 13 + (i % 2) * 14} rx={16} ry={7} fill={nieveS} opacity={0.7} />)}
      {cueva && (
        <g>
          {/* saliente de roca que forma la cueva sobre el borde */}
          <path d={`M${BORDE.x - 200} ${BORDE.y - 380} Q${BORDE.x + 100} ${BORDE.y - 520} ${BORDE.x + 520} ${BORDE.y - 420} L${BORDE.x + 700} ${BORDE.y - 300} L${BORDE.x + 700} ${BORDE.y - 120} L${BORDE.x + 300} ${BORDE.y - 60} Q${BORDE.x + 160} ${BORDE.y - 330} ${BORDE.x - 200} ${BORDE.y - 280} Z`} fill={roca} />
          <path d={`M${BORDE.x - 200} ${BORDE.y - 280} Q${BORDE.x + 160} ${BORDE.y - 330} ${BORDE.x + 300} ${BORDE.y - 60}`} stroke={rocaS} strokeWidth={30} fill="none" />
          <path d={`M${BORDE.x + 300} ${BORDE.y - 60} L${BORDE.x + 700} ${BORDE.y - 120} L${BORDE.x + 700} ${BORDE.y + 40} L${BORDE.x + 60} ${BORDE.y + 40} Z`} fill={rocaS} opacity={0.7} />
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${BORDE.x - 150 + i * 120} ${BORDE.y - 330 - (i % 2) * 40} l60 -30`} stroke="#000" strokeOpacity={0.35} strokeWidth={6} />)}
        </g>
      )}
    </g>
  );
};
