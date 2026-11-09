// Escenario de E53: la arista noreste del Everest. Un mismo encuadre para Hall (amanecer) y Sharp (noche):
// a la izquierda el vacío y el mar de nubes; en el centro, el borde donde se sientan; arriba a la derecha, la pirámide cimera.
// luz: 0 = noche, 1 = amanecer. cueva: dibuja el saliente de roca (la cueva de Sharp).
import React from "react";
import { interpolateColors, random } from "remotion";
import { BORDE } from "./comun";

const mix = (a: string, b: string, t: number) => interpolateColors(t, [0, 1], [a, b]);
/** Ruta normal por encima de la cueva (donde pasan los que suben): puntos [x, y] del lomo nevado. */
const RUTA: [number, number][] = [[-300, 1140], [150, 1000], [400, 905], [700, 852], [1120, 876], [1400, 1000]];
export const ruta = (x: number) => { for (let i = 1; i < RUTA.length; i++) { const [x0, y0] = RUTA[i - 1], [x1, y1] = RUTA[i]; if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0); } return RUTA[RUTA.length - 1][1]; };
const lomo = (dy = 0) => RUTA.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y + dy}`).join(" ");
export const Arista: React.FC<{ luz: number; cueva?: boolean; f: number; cima?: number }> = ({ luz, cueva = false, f, cima = 1 }) => {
  const cielo0 = mix("#040814", "#2B3A6B", luz), cielo1 = mix("#0E1A33", "#F4A47C", luz), cielo2 = mix("#16233F", "#FFD9A0", luz);
  const nieve = mix("#7586A3", "#FBE7DA", luz), nieveS = mix("#3E4D68", "#C9A7B8", luz), roca = mix("#151B27", "#4A3A48", luz), rocaS = mix("#0B0F17", "#2E2433", luz);
  const nubes = mix("#1B2740", "#FBD3C2", luz);
  return (
    <g>
      <defs>
        <linearGradient id="arCielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cielo0} /><stop offset="0.55" stopColor={cielo1} /><stop offset="0.75" stopColor={cielo2} /></linearGradient>
        <radialGradient id="arSol" cx="120" cy="1180" r="900" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFE2A8" stopOpacity={0.55 * luz} /><stop offset="1" stopColor="#FFE2A8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-300} y={-300} width={2600} height={2520} fill="url(#arCielo)" />
      {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={random(`es${i}`) * 1080} cy={random(`ey${i}`) * 1000} r={0.8 + random(`er${i}`) * 2} fill="#fff" opacity={(1 - luz) * (0.3 + random(`eo${i}`) * 0.6)} />)}
      <rect x={-300} y={-300} width={2600} height={2520} fill="url(#arSol)" />
      {/* pirámide cimera, al fondo (cima: 1 visible, 0 sale por arriba) */}
      <g transform={`translate(0 ${-700 * (1 - cima)})`}>
        <path d="M380 1080 L700 300 L760 260 L820 310 L1300 1000 L1480 1180 L380 1180 Z" fill={nieveS} />
        <path d="M760 260 L820 310 L1300 1000 L1480 1180 L860 1180 L800 700 Z" fill={roca} opacity={0.55} />
        <path d="M700 300 L760 260 L740 420 L640 560 Z" fill={nieve} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${560 + i * 90} ${640 + i * 80} Q${700 + i * 60} ${700 + i * 90} ${880 + i * 70} ${660 + i * 90}`} stroke={roca} strokeWidth={14} fill="none" opacity={0.6} />)}
        {[[820, 380, 980, 640], [900, 520, 1120, 820], [1000, 700, 1220, 1000], [640, 600, 560, 900]].map(([a, b, c, e], i) => <path key={`g${i}`} d={`M${a} ${b} Q${(a + c) / 2 + 30} ${(b + e) / 2} ${c} ${e}`} stroke={nieve} strokeWidth={18 - i * 2} strokeLinecap="round" fill="none" opacity={0.85} />)}
        <path d={`M760 262 Q${960 + Math.sin(f / 20) * 20} ${220 + Math.sin(f / 13) * 12} ${1300} ${250 + Math.sin(f / 17) * 18} Q${1000} ${300} 790 300 Z`} fill="#fff" opacity={0.28} />
      </g>
      {/* picos lejanos que asoman del mar de nubes (rellenan el vacío de la izquierda) */}
      {[[-60, 1330, 260], [230, 1420, 200], [470, 1460, 150]].map(([x, y, h], i) => <g key={i}>
        <path d={`M${x - h * 1.3} 1620 L${x} ${y} L${x + h * 1.2} 1620 Z`} fill={mix("#1A2338", "#C99AAE", luz)} />
        <path d={`M${x} ${y} L${x - h * 0.35} ${y + h * 0.42} L${x - h * 0.08} ${y + h * 0.3} L${x + h * 0.1} ${y + h * 0.5} L${x + h * 0.32} ${y + h * 0.36} Z`} fill={nieve} opacity={0.9} />
      </g>)}
      {/* mar de nubes abajo a la izquierda, muy por debajo */}
      {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={-60 + i * 120 + Math.sin(f / 60 + i) * 8} cy={1580 + (i % 3) * 30} rx={150} ry={46} fill={nubes} opacity={0.85} />)}
      <rect x={-300} y={1600} width={1100} height={900} fill={nubes} opacity={0.9} />
      {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-200 + i * 110 + Math.sin(f / 80 + i * 2) * 10} cy={1700 + (i % 4) * 90} rx={120 + (i % 3) * 30} ry={34} fill={mix("#24314D", "#FFE6DA", luz)} opacity={0.55} />)}
      {/* la arista: plataforma de nieve a la derecha, cortada en el borde (precipicio a la izquierda) */}
      <path d={`M${BORDE.x - 60} ${BORDE.y + 10} L${BORDE.x + 40} ${BORDE.y - 14} L2000 ${BORDE.y - 232} L2000 2400 L${BORDE.x - 80} 2400 Z`} fill={nieve} />
      <path d={`M${BORDE.x - 60} ${BORDE.y + 10} L${BORDE.x - 30} ${BORDE.y + 300} L${BORDE.x - 110} ${BORDE.y + 620} L${BORDE.x - 70} 2400 L${BORDE.x + 120} 2400 L${BORDE.x + 60} ${BORDE.y + 40} Z`} fill={roca} />
      <path d={`M${BORDE.x - 30} ${BORDE.y + 300} L${BORDE.x + 40} ${BORDE.y + 260} L${BORDE.x - 40} ${BORDE.y + 700} Z`} fill={rocaS} />
      {/* textura de la nieve: ondas de viento, sombra hacia abajo, rocas que asoman */}
      {Array.from({ length: 9 }).map((_, i) => { const y = BORDE.y + 120 + i * 120, x0 = BORDE.x + 120 + (i % 3) * 40; return <path key={i} d={`M${x0} ${y} Q${x0 + 180} ${y - 40} ${x0 + 360} ${y - 10} T${x0 + 720} ${y - 30}`} stroke={nieveS} strokeWidth={7} fill="none" opacity={0.55} />; })}
      <rect x={BORDE.x - 80} y={BORDE.y + 500} width={1500} height={1200} fill={nieveS} opacity={0.25} />
      {[[880, 1640, 70], [1130, 1460, 50], [760, 1980, 90], [1060, 2160, 60]].map(([x, y, r], i) => <g key={i}>
        <path d={`M${x - r} ${y + r * 0.4} L${x - r * 0.4} ${y - r * 0.6} L${x + r * 0.5} ${y - r * 0.4} L${x + r} ${y + r * 0.4} Z`} fill={roca} />
        <path d={`M${x - r * 0.55} ${y - r * 0.45} L${x - r * 0.4} ${y - r * 0.6} L${x + r * 0.5} ${y - r * 0.4} L${x + r * 0.7} ${y - r * 0.1} Q${x} ${y - r * 0.2} ${x - r * 0.55} ${y - r * 0.45} Z`} fill={nieve} />
      </g>)}
      {/* nieve pegada al pilar de roca */}
      {[[BORDE.y + 120, 120], [BORDE.y + 380, 150], [BORDE.y + 640, 110], [BORDE.y + 900, 140], [BORDE.y + 1080, 100]].map(([y, w], i) => <path key={i} d={`M${BORDE.x - 100 + (i % 2) * 30} ${y} q${w / 2} -30 ${w} 8 q-${w / 2} 16 -${w} 26 Z`} fill={nieve} opacity={0.9} />)}
      {/* cornisa: labio de nieve sobre el borde */}
      <path d={`M${BORDE.x - 74} ${BORDE.y + 16} Q${BORDE.x - 70} ${BORDE.y - 6} ${BORDE.x + 40} ${BORDE.y - 22} L2000 ${BORDE.y - 244} L2000 ${BORDE.y - 216} L${BORDE.x + 40} ${BORDE.y - 2} Z`} fill={mix("#8FA5BC", "#FFFFFF", luz)} />
      {Array.from({ length: 6 }).map((_, i) => { const x = BORDE.x + 140 + i * 110, y = BORDE.y - 30 - 0.16 * (x - BORDE.x - 40); return <ellipse key={i} cx={x} cy={y + 4} rx={46} ry={12} fill={mix("#8FA5BC", "#FFFFFF", luz)} />; })}
      {/* ventisca rasante sobre la arista */}
      {Array.from({ length: 5 }).map((_, i) => { const x = ((f * (9 + i * 2) + i * 300) % 1700) - 300, y = BORDE.y - 40 - 0.16 * (x - BORDE.x) - i * 14; return <path key={i} d={`M${x} ${y} q90 -16 200 -8`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.35} fill="none" />; })}
      {/* huellas que llegan por la arista */}
      {Array.from({ length: 7 }).map((_, i) => <ellipse key={i} cx={1240 - i * 80} cy={BORDE.y - 110 + i * 13 + (i % 2) * 14} rx={16} ry={7} fill={nieveS} opacity={0.7} />)}
      {cueva && (
        <g>
          {/* el lomo de la arista pasa por encima: roca con gorro de nieve (la ruta) y la cueva debajo */}
          <path d={`${lomo()} L1400 ${BORDE.y - 120} L${BORDE.x + 300} ${BORDE.y - 60} Q${BORDE.x + 160} ${BORDE.y - 330} ${BORDE.x - 200} ${BORDE.y - 280} L-300 1320 Z`} fill={roca} />
          <path d={`M-300 1320 L${BORDE.x - 200} ${BORDE.y - 280} Q${BORDE.x + 160} ${BORDE.y - 330} ${BORDE.x + 300} ${BORDE.y - 60}`} stroke={rocaS} strokeWidth={30} fill="none" />
          <path d={`M${BORDE.x + 300} ${BORDE.y - 60} L${BORDE.x + 800} ${BORDE.y - 120} L${BORDE.x + 800} ${BORDE.y + 40} L${BORDE.x + 60} ${BORDE.y + 40} Z`} fill={rocaS} opacity={0.7} />
          {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${BORDE.x - 300 + i * 130} ${ruta(BORDE.x - 300 + i * 130) + 90 + (i % 2) * 40} l60 -30`} stroke="#000" strokeOpacity={0.35} strokeWidth={6} />)}
          <path d={lomo(10)} stroke={nieve} strokeWidth={46} strokeLinejoin="round" fill="none" />
          <path d={lomo(-6)} stroke={mix("#8FA5BC", "#FFFFFF", luz)} strokeWidth={14} strokeLinejoin="round" fill="none" />
          {Array.from({ length: 12 }).map((_, i) => { const x = -250 + i * 140; return <path key={i} d={`M${x} ${ruta(x) + 30} q10 ${26 + (i % 3) * 14} 22 0 Z`} fill={nieve} />; })}
          <path d={lomo(-2)} stroke={nieveS} strokeWidth={4} strokeDasharray="10 16" fill="none" opacity={0.8} />
        </g>
      )}
    </g>
  );
};
