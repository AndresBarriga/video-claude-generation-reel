// Corte anatómico de la pantorrilla de perfil (mira a la derecha), apoyada de puntillas en un reglete.
// Origen = punta del pie (pivote). θ > 0 = el talón sube. c = contracción (0–1), e = estiramiento (0–1), sensor = brillo del huso (0–1).
import React from "react";
import { P11, TU } from "./comun";

const HUESO = "#F1E6D2", TENDON = "#F4E2CF";
export const Pantorrilla: React.FC<{ th: number; c?: number; e?: number; sensor?: number }> = ({ th, c = 0, e = 0, sensor = 0 }) => {
  const sx = 1 + 0.22 * c - 0.06 * e, sy = 1 - 0.06 * c + 0.08 * e; // la barriga se acorta y engorda al contraerse
  const tono = c > 0 ? `rgb(${229 + 20 * c}, ${142 - 30 * c}, ${126 - 30 * c})` : `rgb(${229 + 10 * e}, ${142 + 40 * e}, ${126 + 40 * e})`;
  return (
    <g>
      {/* roca y reglete (no giran) */}
      <rect x={18} y={-700} width={120} height={1100} fill={P11.roca} opacity={0.85} />
      <path d="M18 -700 L18 400" stroke="#000" strokeOpacity={0.25} strokeWidth={8} />
      <path d="M18 2 L-40 6 L-34 22 L18 26 Z" fill={P11.rocaL} stroke="#000" strokeOpacity={0.3} strokeWidth={3} />
      <g transform={`rotate(${th})`}>
        {/* contorno de la pierna (mallas, translúcido) */}
        <path d="M-108 -96 L-66 -540 L-196 -540 Q-262 -420 -248 -320 Q-236 -200 -200 -110 Q-196 -70 -178 -60 Z" fill={TU.pantalon} opacity={0.55} stroke="#0B1624" strokeWidth={6} />
        {/* tibia */}
        <path d="M-118 -118 L-92 -520" stroke={HUESO} strokeWidth={26} strokeLinecap="round" />
        <circle cx={-92} cy={-520} r={24} fill={HUESO} />
        {/* gemelo (dos cabezas) que se contrae / estira desde la rodilla */}
        <g transform={`translate(-196 -500) scale(${sx} ${sy}) translate(196 500)`}>
          <path d="M-178 -505 Q-262 -440 -246 -330 Q-236 -250 -196 -215 Q-170 -300 -168 -400 Z" fill={tono} stroke="#9E4F44" strokeWidth={4} />
          <path d="M-182 -480 Q-226 -420 -220 -330 Q-214 -270 -194 -240" stroke="#B8615A" strokeWidth={5} fill="none" opacity={0.8} />
          {/* sensor (huso muscular) */}
          <ellipse cx={-214} cy={-350} rx={11} ry={36} fill={sensor > 0 ? `rgba(255,236,170,${0.5 + 0.5 * sensor})` : "#C9776C"} stroke="#7A3A33" strokeWidth={3} />
          {sensor > 0 && <ellipse cx={-214} cy={-350} rx={11 + 26 * sensor} ry={36 + 26 * sensor} fill="#FFE7A8" opacity={0.35 * sensor} />}
        </g>
        {/* tendón de Aquiles hasta el talón */}
        <path d={`M-196 ${-215 + 10 * c} Q-200 -140 -190 -72`} stroke={TENDON} strokeWidth={20} strokeLinecap="round" fill="none" />
        <ellipse cx={-178} cy={-58} rx={30} ry={24} fill={HUESO} />
        {/* pie de gato */}
        <path d="M6 -4 Q2 -42 -62 -62 L-150 -84 Q-206 -86 -210 -42 Q-210 2 -168 6 L-20 8 Z" fill="#2B3442" stroke="#0B1624" strokeWidth={5} />
        <path d="M6 -4 Q4 8 -20 8 L-168 6 Q-200 4 -208 -24" stroke="#B4614A" strokeWidth={12} fill="none" strokeLinecap="round" />
        <circle cx={-120} cy={-96} r={12} fill="#0B1624" opacity={0.5} />
      </g>
    </g>
  );
};
