// Primer plano de la quemadura: pantorrilla con pantalón corto; la cuerda resbala por detrás y deja la marca roja.
import React from "react";
import { interpolate } from "remotion";
import { Cuerda, Svg, TU } from "./comun";

export const Quemadura: React.FC<{ f: number }> = ({ f }) => {
  const k = interpolate(f, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const off = 120 * k; // la cuerda baja rozando
  const PIEL = TU.piel!, PIELS = TU.pielSombra!;
  return (
    <Svg>
      <defs>
        <linearGradient id="qFondo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7E8794" /><stop offset="1" stopColor="#4A525E" /></linearGradient>
        <linearGradient id="qPiel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={PIELS} /><stop offset="0.45" stopColor={PIEL} /><stop offset="1" stopColor={PIELS} /></linearGradient>
        <linearGradient id="qMarca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D7263D" stopOpacity="0" /><stop offset="0.2" stopColor="#E0442E" /><stop offset="0.8" stopColor="#E0442E" /><stop offset="1" stopColor="#D7263D" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#qFondo)" />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M-50 ${300 + i * 210} L1130 ${180 + i * 210}`} stroke="#000" strokeOpacity={0.12} strokeWidth={6} />)}
      {/* pierna: muslo con pantalón corto arriba, pantorrilla, tobillo, zapatilla abajo */}
      <g transform="rotate(-14 540 960)">
        <path d="M330 -100 L760 -100 L740 520 L360 520 Z" fill="#2B3442" />
        <path d="M352 470 L748 470 L742 540 L356 540 Z" fill="#1E2632" />
        <path d="M372 520 Q330 900 420 1240 Q450 1420 470 1560 L640 1560 Q650 1420 690 1240 Q770 900 730 520 Z" fill="url(#qPiel)" />
        <path d="M640 600 Q720 880 660 1200" stroke={PIELS} strokeWidth={22} fill="none" opacity={0.5} />
        <path d="M430 1540 L690 1540 L760 1700 Q770 1780 700 1800 L400 1800 Q360 1760 400 1640 Z" fill="#1B2230" />
        <path d="M400 1760 L740 1760" stroke="#E04F8A" strokeWidth={22} strokeLinecap="round" />
        {/* la marca: aparece donde ha rozado la cuerda */}
        <path d={`M360 ${820} Q560 ${880} 760 ${800}`} stroke="url(#qMarca)" strokeWidth={70 * k} fill="none" opacity={0.9 * k} strokeLinecap="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${420 + i * 110} ${838 + i * 6} l60 -6`} stroke="#FFB4A0" strokeWidth={6} strokeLinecap="round" opacity={k} />)}
        <Cuerda d={`M-120 ${700 + off} Q560 ${860 + off} 1200 ${760 + off}`} w={26} />
      </g>
    </Svg>
  );
};
