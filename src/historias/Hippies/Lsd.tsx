// Rehook «Y vuestro líder escala… con LSD»: la pared se vuelve psicodélica, el líder trepa feliz; al final, destello de la visión.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Pieza, Pj, Svg, trepar, type P } from "./comun";

export const Lsd: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), t = pal("LSD") ?? Math.round(d * 0.6);
  const vision = interpolate(f, [t - 2, t + 6, d], [0, 0.85, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.08} foco="50% 45%" sacudida={f > t && f < t + 8 ? 3 : 0}>
      <Svg>
        <Pieza nombre="fondo_yosemite" x={0} y={0} alto={1920} />
        <g opacity={interpolate(f, [0, t], [0.2, 1], { extrapolateRight: "clamp" })}><Pieza nombre="pared_psicodelica" x={0} y={0} alto={1920} /></g>
        <Pj q="lider" cx={540} suelo={1500 - f * 1.5} alto={1000} cara="feliz" rot={trepar(f)} />
        <g opacity={vision}><Pieza nombre="vision_lsd" x={0} y={0} alto={1920} /></g>
      </Svg>
    </Camara>
  );
};
