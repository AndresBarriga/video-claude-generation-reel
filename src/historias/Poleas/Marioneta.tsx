// 2 · «Tus dedos casi no tienen músculos: son una marioneta.»: la mano-marioneta de huesos con cuerdas.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Rotulo, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Marioneta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fMar = pal("marioneta") ?? Math.round(d * 0.6);
  const ent = ei(f, 0, 10, 0, 1), k = ei(f, 0, d, 1.12, 1.02);
  const bal = Math.sin(f * 0.18) * 0.6;
  return (
    <Camara d={d} empuje={0.02} foco="50% 45%">
      <Svg>
        <Lamina html={PA} o={ent} tf={`rotate(${bal} 540 300) ${alrededor(540, 700, k)}`} />
        <Rotulo f={f} ini={fMar - 2} t="MARIONETA" y={1290} tam={90} col="#FF8A4A" />
      </Svg>
    </Camara>
  );
};
