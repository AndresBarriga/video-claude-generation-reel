// «…al lado de los escaladores más pobres de América»: el campamento; los cuatro hippies asoman uno tras otro.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Camara, Pieza, Pj, Svg, type P, type Pj as Q } from "./comun";

const QUIEN: [Q, number][] = [["lider", 170], ["escaladora", 420], ["tu", 650], ["flaco", 900]];
export const Campamento: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg>
        <rect width={1080} height={1920} fill="#C9DCE6" />
        <Pieza nombre="campamento" x={-560} y={520} alto={1100} />
        <rect y={1560} width={1080} height={400} fill="#6E7A3E" />
        {QUIEN.map(([q, x], i) => { const k = spring({ frame: f - 3 - i * 5, fps: 30, config: { damping: 11, stiffness: 180 } }); return <Pj key={q} q={q} cx={x} suelo={1640 + (1 - k) * 600} alto={760} cara="platos" rot={{ cabeza: -6 + i * 4 }} />; })}
      </Svg>
    </Camara>
  );
};
