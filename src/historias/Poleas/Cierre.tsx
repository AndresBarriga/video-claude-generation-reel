// 7 · vuelve el Kilter del principio (bucle) y la pregunta.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Rotulo, Svg, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { TA } from "./laminas";

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const vib = Math.sin(f * 2.6) * 1.2;
  return (
    <Camara d={d} empuje={0.03} foco="40% 30%">
      <Svg>
        <g transform={`translate(${vib} 0)`}><Lamina html={TA} tf={alrededor(430, 440, 1.1)} /></g>
        <Rotulo f={f} ini={0} t="¿ARQUEAS O ABRES?" y={235} tam={92} col="#fff" />
        <Rotulo f={f} ini={8} t="EN EL SIGUIENTE: CÓMO CUIDARLAS" y={1250} tam={42} col="#FFB070" />
      </Svg>
    </Camara>
  );
};
