// «Entonces cae el avión. ¿Bajas?»: primer plano tuyo con los ojos como platos; detrás, el avión en el lago a lo lejos.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pieza, Pj, Svg, type P } from "./comun";

export const Dilema: React.FC<P> = ({ d, e }) => {
  const f = useCurrentFrame(), z = interpolate(f, [0, d], [1, 1.08]);
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#BFD6E4" />
        <g opacity={0.9}><Pieza nombre="avion" x={-160} y={330} alto={700} /></g>
        <rect y={1000} width={1080} height={920} fill="#EEF2F2" />
        <g transform={`translate(540 1920) scale(${z}) translate(-540 -1920)`}><Pj q="tu" cx={540} suelo={2700} alto={2100} cara="platos" rot={{ cabeza: Math.sin(f / 3) * 3 }} /></g>
      </Svg>
      <Etiqueta texto={e.titulo} top={250} tam={140} desde={Math.round(d * 0.45)} />
    </Camara>
  );
};
