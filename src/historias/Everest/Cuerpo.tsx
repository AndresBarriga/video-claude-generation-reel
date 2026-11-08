// Escena «cuerpo»: el cuerpo medio enterrado en el nicho, la cuerda fija cruzándolo y una bota con crampones pasando por encima.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CuerpoDibujo } from "./CuerpoDibujo";
import { NOCHE, Nieve, Escarcha, Cono, Svg, Rotulo, ei, type P } from "./comun";

export const Cuerpo: React.FC<P> = () => {
  const f = useCurrentFrame();
  const paso = ei(f, 0, 150, 0, 1); // la bota avanza sobre la cuerda
  const bx = 640 + paso * 260, by = 1560 + paso * 120;
  return (
    <AbsoluteFill style={{ background: NOCHE.cieloA }}>
      <Svg>
        <defs>
          <linearGradient id="cieloC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NOCHE.cieloA} /><stop offset="1" stopColor={NOCHE.cieloB} /></linearGradient>
          <linearGradient id="nieveC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B9C9DA" /><stop offset="1" stopColor="#6F86A0" /></linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#cieloC)" />
        {/* roca y nicho */}
        <path d="M-100 560 Q300 520 700 600 Q1000 640 1200 700 L1200 1260 L-100 1260 Z" fill={NOCHE.roca} />
        <path d="M-100 560 Q300 520 700 600 L560 760 Q200 720 -100 800 Z" fill="#2A3548" />
        <path d="M-100 900 Q250 840 560 900 L600 1260 L-100 1260 Z" fill={NOCHE.rocaS} />
        {/* ladera de nieve */}
        <path d="M-100 1180 Q300 1120 700 1210 T1200 1280 L1200 2100 L-100 2100 Z" fill="url(#nieveC)" />
        <path d="M-100 1180 Q300 1120 700 1210 T1200 1280" stroke="#E6F0F8" strokeWidth={6} fill="none" opacity={0.6} />
        <g transform="translate(40 790) scale(1.22)"><CuerpoDibujo /></g>
        {/* cuerda fija cruzando por encima del cuerpo */}
        <path d="M-60 740 L1140 1590" stroke="#FF6A1F" strokeWidth={18} strokeLinecap="round" />
        <path d="M-60 740 L1140 1590" stroke="#FFC9A8" strokeWidth={5} strokeDasharray="6 22" strokeLinecap="round" />
        {/* luz de la frontal del que pasa */}
        <Cono x={bx + 60} y={by - 330} tx={230} ty={1050} ancho={380} op={0.42} id="cn" />
        {/* bota con crampones del escalador que pasa por encima de la cuerda, en primer plano */}
        <g transform={`translate(${bx + 60} ${by + 40})`}>
          <path d="M-20 -420 L120 -430 L150 -190 Q250 -150 270 -70 L275 10 L-80 10 L-60 -120 Z" fill="#2F6F6B" />
          <path d="M-60 -120 L150 -190 L160 -150 L-62 -70 Z" fill="#2B3442" />
          <path d="M-70 -90 Q40 -130 160 -120 Q250 -110 270 -50 L275 10 L-80 10 Z" fill="#3A4556" />
          <path d="M-84 10 L282 10 L292 62 L-92 66 Z" fill="#161C25" />
          <path d="M120 -125 Q210 -100 250 -40" stroke="#6B7A8E" strokeWidth={8} fill="none" opacity={0.7} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-78 + i * 52} 64 L${-62 + i * 52} 118 L${-42 + i * 52} 64 Z`} fill="#D5DCE4" />)}
          <path d="M276 10 L330 -20 L338 40 L292 62 Z" fill="#D5DCE4" opacity={0.9} />
        </g>
        <Nieve f={f} n={55} />
        <Rotulo f={f} ini={0} t="EVEREST 2006" y={270} tam={74} col="#fff" />
        <Rotulo f={f} ini={6} t="SEGUÍA VIVO" y={470} tam={150} col="#FF6A1F" />
        <rect width={1080} height={1920} fill="none" />
      </Svg>
    </AbsoluteFill>
  );
};
