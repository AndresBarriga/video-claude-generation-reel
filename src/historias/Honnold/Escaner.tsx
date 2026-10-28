// 2.º gancho: le meten en una resonancia. Él, tumbado, con la misma cara de cola del súper; en la pantalla, su cerebro y la amígdala apagada.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Svg, type P } from "./comun";
import { Cerebro } from "./Cerebro";
import { fuenteTexto } from "../../tema";

export const Escaner: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t = pal("amígdala") ?? pal("amigdala") ?? Math.round(d * 0.5);
  const marca = interpolate(f, [t, t + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg>
        <rect width={1080} height={1920} fill="#DCE3EA" />
        <rect y={1260} width={1080} height={700} fill="#B9C4CF" />
        {/* pantalla */}
        <rect x={140} y={300} width={800} height={460} rx={24} fill="#0E1A2A" stroke="#5A6676" strokeWidth={10} />
        <Cerebro x={540} y={520} s={1.5} luz={0} sem="h" />
        <g opacity={marca}><path d="M562 574 L700 690" stroke="#fff" strokeWidth={5} /><rect x={680} y={670} width={240} height={64} rx={32} fill="#fff" /><text x={800} y={714} textAnchor="middle" fontFamily={fuenteTexto} fontWeight={800} fontSize={40} fill="#0E1A2A">amígdala</text></g>
        {/* resonancia: anillo, camilla, él tumbado con la cabeza dentro */}
        <rect x={120} y={1150} width={840} height={60} rx={20} fill="#EEF2F6" stroke="#9AA6B2" strokeWidth={6} />
        <Escalador x={340} y={1112} quien="joe" pose="tumbado" s={1.8} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="normal" mira={-1} />
        <rect x={760} y={860} width={400} height={460} rx={40} fill="#F7F9FB" stroke="#9AA6B2" strokeWidth={8} />
        <ellipse cx={760} cy={1090} rx={60} ry={200} fill="#C9D3DC" stroke="#9AA6B2" strokeWidth={8} />
      </Svg>
    </Camara>
  );
};
