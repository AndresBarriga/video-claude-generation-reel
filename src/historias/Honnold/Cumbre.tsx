// Cumbre: 884 m · 3 h 56 min. Arriba él en el borde, con su sonrisa; abajo tú, tumbado en la hierba, sin fuerzas.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Contador, Pino, PH, Svg, type P } from "./comun";
import { Fuente } from "../Pierna/comun";

const TU = { chaqueta: "#2F7F8A", chaquetaSombra: "#215C64", pantalon: "#39424F", casco: null, peinado: "rizado" as const, pelo: "#2B1D14", arnes: false, manos: "piel" as const };
export const Cumbre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const m = interpolate(f, [0, 18], [840, 884], { extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.04}>
      <Svg>
        <Cielo />
        <path d="M-100 780 L700 760 Q820 760 860 940 L-100 940 Z" fill={PH.granito} />
        {Array.from({ length: 6 }).map((_, i) => <Pino key={i} x={60 + i * 90} y={772} s={0.9} />)}
        <Escalador x={470} y={700} quien="joe" s={1.6} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="alivio" mira={-1}
          angulos={{ torso: -4, cabeza: -8, brazoA: [20, 10], brazoB: [-20, -10] }} />
        <rect x={-300} y={940} width={1700} height={1200} fill={PH.prado} />
        <rect x={0} y={936} width={1080} height={8} fill="#fff" />
        <Escalador x={520} y={1330} quien="joe" pose="tumbado" s={2.2} aspecto={TU} cara="cerrados" sombra={1380} />
      </Svg>
      <Contador m={m} nota="3 h 56 min" grande />
      <Fuente texto="Guinness World Records" />
    </Camara>
  );
};
