// Primer plano de Honnold (su cara de calma total). Sirve de boceto de parecido y de plano de reacción.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Contador, Granito, Svg, type P } from "./comun";
import { interpolate } from "remotion";

export const PlanoRetrato: React.FC<{ d: number; cara?: Cara; m?: [number, number] }> = ({ d, cara = "normal", m }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.05} foco="50% 40%">
      <Svg>
        <Cielo />
        <Granito x0={720} sem="r" />
        <g transform={`translate(420 ${720 + Math.sin(f / 20) * 4}) scale(7.5)`}><CabezaHonnold cara={cara} /></g>
        <rect x={210} y={1180} width={440} height={500} rx={200} fill={ASPECTO_H.chaqueta} />
      </Svg>
      {m && <Contador m={interpolate(f, [0, d], m)} />}
    </Camara>
  );
};
export const Retrato: React.FC<P> = ({ d }) => <PlanoRetrato d={d} m={[100, 170]} />;
