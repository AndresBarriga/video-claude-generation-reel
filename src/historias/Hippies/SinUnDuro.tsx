// «Pero lo increíble es lo que hacían sin un duro»: los cuatro, en fila ante El Capitán, mirando arriba; la cámara sube por la pared.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pieza, Pj, Svg, type P, type Pj as Q } from "./comun";

const FILA: [Q, number][] = [["lider", 170], ["escaladora", 410], ["tu", 650], ["flaco", 890]];
export const SinUnDuro: React.FC<P> = ({ d, e }) => {
  const f = useCurrentFrame(), sube = interpolate(f, [0, d], [0, 260]);
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg>
        <g transform={`translate(0 ${sube})`}>
          <Pieza nombre="fondo_yosemite" x={0} y={-260} alto={2180} />
          {FILA.map(([q, x], i) => <Pj key={q} q={q} cx={x} suelo={1740} alto={700} cara={i % 2 ? "platos" : "feliz"} rot={{ cabeza: -10, brazo_superior_izq: i === 1 ? 150 : 10, antebrazo_izq: i === 1 ? -30 : 0 }} />)}
        </g>
      </Svg>
      <Etiqueta texto={e.titulo} top={250} tam={120} desde={6} />
    </Camara>
  );
};
