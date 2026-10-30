// Rehook «Y vuestro líder escala… con LSD»: la pared real se tiñe con un barrido de color hasta la psicodélica; el líder trepa feliz;
// en «LSD» entra la visión animada a pantalla completa.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Pieza, Pj, Svg, trepar, type P } from "./comun";
import { VisionLsd } from "./Vision";

export const Lsd: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), t = pal("LSD") ?? Math.round(d * 0.6), cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const barrido = interpolate(f, [0, t], [1920, 0], cl);
  const vision = interpolate(f, [t - 3, t + 6], [0, 1], cl);
  return (
    <Camara d={d} empuje={0.08} foco="50% 45%" sacudida={f > t && f < t + 8 ? 3 : 0}>
      <Svg>
        <Pieza nombre="fondo_yosemite" x={0} y={0} alto={1920} />
        <defs><clipPath id="barr"><rect x={0} y={barrido} width={1080} height={1920} /></clipPath></defs>
        <g clipPath="url(#barr)"><Pieza nombre="pared_psicodelica" x={0} y={0} alto={1920} /></g>
        <Pj q="lider" cx={540} suelo={1500 - f * 1.5} alto={1000} cara="feliz" rot={trepar(f)} />
        <VisionLsd op={vision} zoom={interpolate(f, [t, d], [1.15, 1.02], cl)} />
      </Svg>
    </Camara>
  );
};
