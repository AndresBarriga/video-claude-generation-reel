// 7 · el sofá: semanas sin colgarte y tú viendo escalar a otros. (Lámina de Design pendiente: ahora, marcador.)
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Rotulo, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { TB } from "./laminas";

export const Sofa: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.03} foco="50% 50%">
      <Svg>
        <Lamina html={TB} tf={alrededor(430, 440, 1.0)} o={0.5} />
        <rect width={1920} height={1920} fill="#0B1624" opacity={0.5} />
        <Rotulo f={f} ini={4} t="[LÁMINA DEL SOFÁ PENDIENTE]" y={900} tam={52} col="#FFB070" />
        <Rotulo f={f} ini={ei(f, 0, 1, 0, 1) > 0 ? Math.round(d * 0.35) : 0} t="SEMANAS SIN COLGARTE" y={235} tam={80} col="#fff" />
      </Svg>
    </Camara>
  );
};
