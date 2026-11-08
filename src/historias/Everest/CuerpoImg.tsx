// Escena «cuerpo» con la ilustración generada: encuadre que viaja de la cara a las botas, cuerda y bota que pasan, luz de frontal.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { NOCHE, Nieve, Svg, Rotulo, ei, type P } from "./comun";

const W = 944, ESC = 1.9, VW = 1080 / ESC; // ventana visible de la imagen en px de origen
export const CuerpoImg: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const vx = ei(f, d * 0.55, d, 40, W - VW);
  const luz = ei(f, 0, d, -300, 1400); // barrido de luz de la frontal que pasa
  const paso = ei(f, d * 0.15, d * 0.85, 0, 1);
  return (
    <AbsoluteFill style={{ background: NOCHE.cieloA }}>
      <Svg>
        <defs>
          <filter id="desenf"><feGaussianBlur stdDeviation="7" /></filter>
          <linearGradient id="fadeT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NOCHE.cieloA} /><stop offset="1" stopColor={NOCHE.cieloA} stopOpacity="0" /></linearGradient>
          <linearGradient id="fadeB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={NOCHE.cieloA} /><stop offset="1" stopColor={NOCHE.cieloA} stopOpacity="0" /></linearGradient>
          <linearGradient id="barrido" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFE9B8" stopOpacity="0" /><stop offset="0.5" stopColor="#FFE9B8" stopOpacity="0.28" /><stop offset="1" stopColor="#FFE9B8" stopOpacity="0" /></linearGradient>
          <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></radialGradient>
        </defs>
        <rect width={1080} height={1920} fill={NOCHE.cieloA} />
        <svg x={0} y={620} width={1080} height={823} viewBox={`${vx} 25 ${VW} 433`}>
          <image href={staticFile("img/e53-cuerpo.png")} width={W} height={498} />
        </svg>
        <rect x={0} y={620} width={1080} height={150} fill="url(#fadeT)" />
        <rect x={0} y={1293} width={1080} height={150} fill="url(#fadeB)" />
        {/* barrido de luz */}
        <rect x={luz - 220} y={620} width={440} height={823} fill="url(#barrido)" />
        {/* cuerda fija cruzando la imagen */}
        <path d="M-60 1500 L1140 1090" stroke="#FF6A1F" strokeWidth={16} strokeLinecap="round" />
        <path d="M-60 1500 L1140 1090" stroke="#FFC9A8" strokeWidth={4} strokeDasharray="6 22" strokeLinecap="round" />
        {/* bota con crampones que pasa por encima, de derecha a izquierda, en primer plano */}
        <g filter="url(#desenf)" opacity={0.92} transform={`translate(${1250 - paso * 1000} ${1650 - paso * 60})`}>
          <path d="M-20 -380 L120 -390 L150 -190 Q250 -150 270 -70 L275 10 L-80 10 L-60 -120 Z" fill="#0B1118" />
          <path d="M-70 -90 Q40 -130 160 -120 Q250 -110 270 -50 L275 10 L-80 10 Z" fill="#121A24" />
          <path d="M-84 10 L282 10 L292 62 L-92 66 Z" fill="#161C25" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-78 + i * 52} 64 L${-62 + i * 52} 118 L${-42 + i * 52} 64 Z`} fill="#D5DCE4" />)}
        </g>
        <Nieve f={f} n={50} />
        <rect width={1080} height={1920} fill="url(#vig)" />
        <Rotulo f={f} ini={0} t="EVEREST 2006" y={270} tam={74} col="#fff" />
        <Rotulo f={f} ini={6} t="SEGUÍA VIVO" y={470} tam={150} col="#FF6A1F" />
      </Svg>
    </AbsoluteFill>
  );
};
