// Revelación «eran los mismos que ya habían subido El Capitán en un solo día»: la pose mítica (dibujo propio) balanceándose ante El Capitán.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pieza, Svg, type P } from "./comun";

export const Pose: React.FC<P> = ({ d, e }) => {
  const f = useCurrentFrame(), b = Math.sin(f / 12);
  return (
    <Camara d={d} empuje={0.06} foco="50% 40%">
      <Svg>
        <Pieza nombre="fondo_yosemite" x={0} y={0} alto={1920} />
        <Pieza nombre="pose_mitica" x={110} y={220} alto={1250} rot={{ pierna_izq: 8 * b, pierna_der: -6 * b, muslo_izq: 4 * b }} />
      </Svg>
      <Etiqueta texto={e.titulo} top={1240} tam={96} desde={Math.round(d * 0.4)} />
    </Camara>
  );
};
