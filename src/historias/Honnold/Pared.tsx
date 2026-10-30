// «Él subió esto sin cuerda»: la pared entera, él un punto rojo con un aro que lo señala.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Camara, Cielo, Pino, PH, Svg, type P } from "./comun";

export const Pared: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 6, fps: 30, config: { damping: 12, stiffness: 160 } });
  const hx = 560, hy = 900;
  return (
    <Camara d={d} empuje={-0.0} foco="50% 50%">
      <Svg>
        <Cielo />
        <path d="M60 1500 Q200 420 520 260 Q760 180 1180 300 L1180 1500 Z" fill={PH.granito} />
        <path d="M520 260 Q470 800 560 1500 M760 230 Q700 800 800 1500" stroke={PH.veta} strokeWidth={6} fill="none" opacity={0.45} />
        <path d="M800 520 q120 60 260 20 l0 160 q-140 -40 -240 0 Z" fill={PH.veta} opacity={0.18} />
        <rect x={-300} y={1480} width={1700} height={600} fill={PH.pino} />
        {Array.from({ length: 26 }).map((_, i) => <Pino key={i} x={-20 + i * 44} y={1500} s={0.8} />)}
        <circle cx={hx} cy={hy} r={6} fill="#C43D2F" stroke="#fff" strokeWidth={2} />
        <circle cx={hx} cy={hy} r={20 + 30 * k + 4 * Math.sin(f / 4)} fill="none" stroke="#FFD34D" strokeWidth={6} opacity={k} />
      </Svg>
    </Camara>
  );
};
