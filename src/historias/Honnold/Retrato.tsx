// Primer plano de Honnold (su cara de calma total). Sirve de boceto de parecido y de plano de reacción.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { ASPECTO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Granito, Svg, type P } from "./comun";

export const PlanoRetrato: React.FC<{ d: number; cara?: Cara }> = ({ d, cara = "normal" }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.05} foco="50% 40%">
      <Svg>
        <Cielo />
        <Granito x0={720} sem="r" />
        <g transform={`translate(430 ${760 + Math.sin(f / 20) * 4}) scale(8)`}><CabezaHonnold cara={cara} /></g>
        <rect x={150} y={1100} width={560} height={500} rx={240} fill={ASPECTO_H.chaqueta} />
        <Escalador x={870} y={1230} quien="joe" s={0.9} aspecto={ASPECTO_H} Cabeza={CabezaHonnold} cara="normal" sombra={1360} />
      </Svg>
    </Camara>
  );
};
export const Retrato: React.FC<P> = ({ d }) => <PlanoRetrato d={d} />;
