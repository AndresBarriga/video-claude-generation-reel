// Escena 1 · Gancho: primer plano del escalador (escarcha en las pestañas) y su frontal ilumina al hombre sentado, gris, bajo la roca.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { NOCHE, Nieve, Escarcha, Svg, Rotulo, ei, type P } from "./comun";

export const Gancho: React.FC<P> = () => {
  const f = useCurrentFrame();
  const zoom = ei(f, 0, 90, 1.0, 1.08);
  return (
    <AbsoluteFill style={{ background: NOCHE.cieloA }}>
      <Svg>
        <defs><linearGradient id="cieloE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NOCHE.cieloA} /><stop offset="1" stopColor={NOCHE.cieloB} /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#cieloE)" />
        <g transform={`translate(540 960) scale(${zoom}) translate(-540 -960)`}>
          {/* ladera de nieve y saliente de roca (la «cueva») */}
          <path d="M-100 1500 Q300 1440 620 1470 T1200 1430 L1200 2100 L-100 2100 Z" fill={NOCHE.nieveS} opacity={0.6} />
          <path d="M-100 1500 Q300 1440 620 1470 T1200 1430" stroke={NOCHE.nieve} strokeWidth={5} fill="none" opacity={0.55} />
          <path d="M330 560 Q640 470 1000 520 L1200 560 L1200 1470 L330 1480 Q380 1000 330 560 Z" fill={NOCHE.roca} />
          <path d="M330 560 Q640 470 1000 520 L1200 560 L1200 660 Q760 600 420 720 Z" fill="#2A3548" />
          <path d="M470 700 Q800 640 1200 700 L1200 1470 L520 1480 Q560 1100 470 700 Z" fill={NOCHE.rocaS} />
          <ellipse cx={830} cy={1478} rx={330} ry={26} fill="#05080D" opacity={0.6} />
          {/* el hombre sentado, gris, abrazándose las piernas */}
          <Escalador x={850} y={1325} quien="simon" pose="sentadoSuelo" cara="cerrados" s={2.5} mira={-1}
            angulos={{ torso: -8, cabeza: 14, brazoA: [58, 140], brazoB: [50, 130], piernaA: [105, 12], piernaB: [100, 8] }}
            aspecto={{ chaqueta: "#7E2A2A", chaquetaSombra: "#561D1D", pantalon: "#222B38", casco: null, peinado: "corto", pelo: "#3A2A1E", piel: "#AEB6C0", pielSombra: "#8B95A1", manos: "piel" }} />
          <Escarcha x={800} y={1040} r={85} n={34} seed="sh" />
          <Escarcha x={850} y={1330} r={120} n={22} seed="sc" op={0.55} />
          {/* escalador en primer plano a la izquierda: su frontal ilumina al hombre */}
          <Escalador x={170} y={1750} quien="joe" pose="pie" cara="miedo" s={6.2} mira={1} frontal
            aspecto={{ chaqueta: "#1F4E7A", chaquetaSombra: "#143555", pantalon: "#222B38", casco: "#EDEFF2", peinado: "corto", pelo: "#2B1D14", piel: "#E2B08A", pielSombra: "#C08E68", manos: "guante" }} />
          <Escarcha x={185} y={915} r={95} n={34} seed="ce" op={0.95} />
        </g>
        <Nieve f={f} />
      </Svg>
      <Svg>
        <Rotulo f={f} ini={0} t="EVEREST 2006" y={270} tam={74} col="#fff" />
        <Rotulo f={f} ini={15} t="¿PARAS?" y={420} tam={190} col="#FF6A1F" />
      </Svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};
