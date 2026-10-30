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
        <g transform={`translate(420 ${850 + Math.sin(f / 20) * 4}) scale(7.5)`}><CabezaHonnold cara={cara} /></g>
        <path d="M150 1700 Q170 1230 300 1200 L540 1200 Q670 1230 690 1700 Z" fill={ASPECTO_H.chaqueta} />
        <path d="M330 1200 Q420 1260 510 1200" stroke={ASPECTO_H.chaquetaSombra} strokeWidth={14} fill="none" />
        <path d="M260 1420 Q300 1380 330 1460" stroke={ASPECTO_H.chaquetaSombra} strokeWidth={10} fill="none" />
      </Svg>
      {m && <Contador m={interpolate(f, [0, d], m)} />}
    </Camara>
  );
};
export const Retrato: React.FC<P> = ({ d }) => <PlanoRetrato d={d} m={[100, 170]} />;
