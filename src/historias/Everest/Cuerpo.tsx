// Escena «cuerpo»: el cuerpo medio enterrado en el nicho, la cuerda fija cruzándolo y una bota con crampones pasando por encima.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
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
        <g transform="translate(-170 -330) scale(1.2)">
        {/* cuerpo: pantalón azul y bota amarilla con crampones saliendo de la nieve (hacia abajo-derecha) */}
        <path d="M430 1180 Q520 1150 600 1210 L760 1390 L700 1440 L520 1300 Z" fill="#3B5B8C" />
        <path d="M430 1230 Q520 1210 600 1260 L740 1400" stroke="#27406A" strokeWidth={26} fill="none" opacity={0.7} />
        <path d="M720 1370 L850 1330 L900 1400 L880 1470 L750 1480 L700 1430 Z" fill="#E0B93A" />
        <path d="M750 1480 L880 1470 L890 1500 L760 1512 Z" fill="#2B3442" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${765 + i * 24} 1508 L${772 + i * 24} 1540 L${782 + i * 24} 1508 Z`} fill="#AEB6C0" />)}
        {/* torso con chaqueta roja cubierta de nieve y capucha vuelta hacia la roca */}
        <path d="M200 1090 Q330 1000 520 1090 Q560 1170 470 1240 Q330 1280 220 1210 Z" fill="#7E2A2A" />
        <path d="M200 1090 Q330 1000 520 1090 Q420 1100 330 1120 Q250 1130 200 1160 Z" fill="#9E3A33" opacity={0.8} />
        <ellipse cx={300} cy={1065} rx={92} ry={78} fill="#561D1D" />
        <ellipse cx={278} cy={1050} rx={50} ry={44} fill="#AEB6C0" opacity={0.9} />
        <path d="M180 1200 Q330 1160 520 1230 Q430 1290 300 1285 Z" fill="#E6F0F8" opacity={0.85} />
        <path d="M400 1090 Q470 1060 540 1100 Q500 1130 430 1135 Z" fill="#E6F0F8" opacity={0.8} />
        <Escarcha x={278} y={1048} r={64} n={30} seed="cu" />
        {/* cuerda fija cruzando por encima del cuerpo */}
        <path d="M-60 930 L1140 1700" stroke="#FF6A1F" strokeWidth={18} strokeLinecap="round" />
        <path d="M-60 930 L1140 1700" stroke="#FFC9A8" strokeWidth={5} strokeDasharray="6 22" strokeLinecap="round" />
        </g>
        {/* luz de la frontal del que pasa */}
        <Cono x={bx + 60} y={by - 330} tx={260} ty={950} ancho={380} op={0.42} id="cn" />
        {/* bota con crampones del escalador que pasa por encima de la cuerda, en primer plano */}
        <g transform={`translate(${bx} ${by})`}>
          <path d="M-60 -60 L40 -300 L150 -290 L130 -120 L200 -70 L210 20 L-70 20 Z" fill="#3A4556" />
          <path d="M-80 20 L220 20 L230 70 L-90 74 Z" fill="#2B3442" />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-70 + i * 50} 72 L${-55 + i * 50} 120 L${-35 + i * 50} 72 Z`} fill="#D5DCE4" />)}
        </g>
        <Nieve f={f} n={55} />
        <Rotulo f={f} ini={0} t="EVEREST 2006" y={270} tam={74} col="#fff" />
        <Rotulo f={f} ini={6} t="SEGUÍA VIVO" y={470} tam={150} col="#FF6A1F" />
        <rect width={1080} height={1920} fill="none" />
      </Svg>
    </AbsoluteFill>
  );
};
