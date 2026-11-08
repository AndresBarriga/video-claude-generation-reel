// Escena 6 · Cierre: primer plano del pie con la cuerda por delante y la cara del escalador aliviada.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Asegurador } from "./Asegurador";
import { Trepador } from "./Trepador";
import { GYM, Pared, Svg, Rotulo, type P } from "./comun";

export const Cierre: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: GYM.paredA }}>
      <Svg>
        <Pared f={f} />
        <g><Trepador f={f} detras={false} /></g>
        <Asegurador grita={false} f={f} />
        <Rotulo f={f} ini={4} t="MÁNDASELO A QUIEN TE ASEGURA" y={300} tam={52} col={GYM.cuerda} />
      </Svg>
    </AbsoluteFill>
  );
};
