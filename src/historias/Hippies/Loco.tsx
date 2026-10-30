// «Y eso no es lo más loco de esta historia»: corte a primer plano del líder, que mira a cámara con su sonrisa; rótulo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pieza, Pj, Svg, type P } from "./comun";

export const Loco: React.FC<P> = ({ d, e }) => {
  const f = useCurrentFrame(), z = interpolate(f, [0, d], [1, 1.1]);
  return (
    <Camara d={d} empuje={0} entrada={false} sacudida={f < 6 ? 4 : 0}>
      <Svg>
        <rect width={1080} height={1920} fill="#C9DCE6" />
        <g opacity={0.5}><Pieza nombre="campamento" x={-700} y={300} alto={1400} /></g>
        <g transform={`translate(540 1920) scale(${z}) translate(-540 -1920)`}>
          <Pj q="lider" cx={540} suelo={3000} alto={2500} cara="feliz" rot={{ cabeza: 6 + Math.sin(f / 5) * 3, brazo_superior_der: -30, antebrazo_der: -120 }} />
        </g>
      </Svg>
      <Etiqueta texto={e.titulo} top={250} tam={90} desde={4} />
    </Camara>
  );
};
