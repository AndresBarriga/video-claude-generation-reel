// Helicóptero de rescate de montaña, de perfil (mira a la izquierda): fuselaje rojo y blanco, cabina acristalada,
// botalón de cola con deriva y rotor de cola girando, patines con montantes, disco del rotor principal y foco bajo el morro.
import React from "react";
import { useCurrentFrame } from "remotion";

const T = "#0B1624", ROJO = "#D2352A", ROJOS = "#9E241C", BLANCO = "#F2F4F6", CRISTAL = "#9CC9E8";
export const Heli: React.FC<{ x: number; y: number; rot?: number; s?: number; foco?: boolean }> = ({ x, y, rot = 0, s = 1, foco = true }) => {
  const f = useCurrentFrame();
  const pala = Math.sin(f * 1.9), cola = (f * 47) % 360;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* rotor principal: disco borroso + pala */}
      <ellipse cx={10} cy={-92} rx={230} ry={14} fill={T} opacity={0.18} />
      <path d={`M${10 - 230 * pala} -92 L${10 + 230 * pala} -92`} stroke={T} strokeWidth={8} strokeLinecap="round" opacity={0.75} />
      <rect x={2} y={-92} width={16} height={26} rx={4} fill="#3A4656" />
      {/* botalón de cola, deriva y rotor de cola */}
      <path d="M110 -40 L300 -26 L300 -10 L110 0 Z" fill={ROJO} stroke={T} strokeWidth={5} strokeLinejoin="round" />
      <path d="M150 -26 L290 -18" stroke={BLANCO} strokeWidth={6} />
      <path d="M280 -26 L318 -88 L336 -88 L312 -14 Z" fill={ROJO} stroke={T} strokeWidth={5} strokeLinejoin="round" />
      <g transform={`translate(322 -44) rotate(${cola})`}><path d="M0 -34 L0 34" stroke={T} strokeWidth={5} strokeLinecap="round" opacity={0.7} /></g>
      <circle cx={322} cy={-44} r={34} fill={T} opacity={0.1} />
      {/* fuselaje */}
      <path d="M-150 -6 C-150 -60 -100 -72 -30 -74 L80 -74 C120 -72 140 -50 140 -20 L140 10 C140 30 120 42 90 42 L-90 42 C-130 42 -152 24 -150 -6 Z" fill={ROJO} stroke={T} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-148 6 L140 6 L140 20 L-146 20 Z" fill={BLANCO} />
      <path d="M-110 30 L120 30" stroke={ROJOS} strokeWidth={8} />
      {/* cabina y ventanillas */}
      <path d="M-148 -8 C-146 -52 -104 -66 -60 -66 L-60 -6 Z" fill={CRISTAL} stroke={T} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-120 -50 L-82 -60" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      <rect x={-40} y={-60} width={56} height={46} rx={10} fill={CRISTAL} stroke={T} strokeWidth={5} />
      <rect x={34} y={-60} width={70} height={46} rx={10} fill={CRISTAL} stroke={T} strokeWidth={5} />
      <path d="M26 -66 L26 36" stroke={T} strokeWidth={4} opacity={0.5} />
      {/* patines */}
      <path d="M-90 42 L-100 74 M70 42 L80 74" stroke="#3A4656" strokeWidth={8} strokeLinecap="round" />
      <path d="M-150 76 L120 76 Q136 76 140 66" stroke="#3A4656" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* foco bajo el morro */}
      {foco && <><circle cx={-120} cy={34} r={11} fill="#FFF6D0" stroke={T} strokeWidth={3} /><circle cx={-120} cy={34} r={26} fill="#FFF6D0" opacity={0.35} /></>}
    </g>
  );
};
