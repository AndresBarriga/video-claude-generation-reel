// «Vives en una tienda y comes lo que dejan los turistas»: tú con tu bandeja de sobras… y un mapache que te la roba.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Pieza, Pj, Svg, type P } from "./comun";

export const Sobras: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const mx = interpolate(f, [d * 0.25, d * 0.5, d * 0.62, d], [1200, 620, 620, 1300], cl);
  const tiene = f < d * 0.55;
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg>
        <rect width={1080} height={1920} fill="#C9DCE6" />
        <g opacity={0.55}><Pieza nombre="campamento" x={-560} y={420} alto={1100} /></g>
        <rect y={1500} width={1080} height={420} fill="#6E7A3E" />
        <Pj q="tu" cx={360} suelo={1620} alto={1000} cara={tiene ? "feliz" : "platos"}
          rot={tiene ? { brazo_superior_der: -70, antebrazo_der: -40 } : { brazo_superior_der: -110, antebrazo_der: -10, brazo_superior_izq: 40 }} />
        <Pieza nombre="mapache" x={mx} y={1060} alto={560} ocultar={f < d * 0.55 ? ["bandeja"] : []} rot={{ cola: Math.sin(f / 4) * 14 }} espejo={f < d * 0.55} />
        {tiene && <g transform="translate(560 900)"><ellipse cx={0} cy={0} rx={110} ry={22} fill="#B9C2CC" stroke="#3A4656" strokeWidth={6} /><circle cx={-30} cy={-14} r={16} fill="#C98A4A" /><path d="M10 -18 L60 -10 L30 -2 Z" fill="#E8D27A" /></g>}
      </Svg>
    </Camara>
  );
};
