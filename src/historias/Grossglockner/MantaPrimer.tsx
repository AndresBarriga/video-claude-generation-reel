// Escena 1b: primer plano de su mochila de noche; la manta térmica dorada asoma y brilla con el frontal. «¿Te quedas?»
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, CieloNoche, Manta, Svg, Viento, type P } from "./comun";

export const MantaPrimer: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.08} foco="50% 55%">
      <Svg>
        <CieloNoche id="mp" />
        <path transform={`translate(0 ${Math.abs(Math.sin(f / 6)) * -14})`} d="M200 1500 Q190 760 300 640 L760 640 Q880 760 870 1500 Z" fill="#3A4656" stroke="#0B1624" strokeWidth={10} />
        <path d="M300 760 L780 760" stroke="#2A3442" strokeWidth={14} />
        <rect x={420} y={880} width={230} height={150} rx={30} fill="#2E3A4A" stroke="#0B1624" strokeWidth={6} />
        <g transform={`rotate(${Math.sin(f / 3) * 4} 540 640)`}><Manta x={540} y={640 + Math.abs(Math.sin(f / 6)) * -14} s={5.5} /></g>
        <circle cx={540 + 60 * Math.sin(f / 12)} cy={600} r={170} fill="#FFF6D0" opacity={0.08} />
        <Viento n={40} fuerza={1.2} op={0.5} />
      </Svg>
      
    </Camara>
  );
};
