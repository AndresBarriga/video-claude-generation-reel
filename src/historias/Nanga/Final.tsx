// 9 · La bajaron: tres frontales descienden por la cara; arriba, la luz de Tomek se apaga.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, INV, Svg, Ventisca, type P } from "./comun";

export const Final: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tM = (pal("murio") ?? Math.round(d * 0.45)) - 2;
  const apaga = interpolate(f, [tM, tM + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const baja = interpolate(f, [0, d], [0, 260]);
  return (
    <Camara d={d} empuje={0.04} entrada={false}>
      <Svg>
        <CieloNoche id="fi" />
        <path d="M-200 2100 L-200 1150 L80 900 L230 760 L330 640 L450 470 L560 330 L640 380 L720 300 L830 470 L960 600 L1280 820 L1280 2100 Z" fill={INV.nieveSS} />
        <path d="M720 300 L830 470 L960 600 L1280 820 L1280 2100 L820 2100 L760 1200 Z" fill="#3A3F68" opacity={0.75} />
        <circle cx={600} cy={560} r={60} fill="#E05A4A" opacity={0.25 * apaga + 0.08} /><circle cx={600} cy={560} r={12} fill="#FFB0A0" opacity={0.3 + 0.7 * apaga} />
        {[0, 1, 2].map((i) => { const x = 520 + i * 40, y = 1150 + i * 30 + baja; return <g key={i}><circle cx={x} cy={y} r={30} fill={INV.luz} opacity={0.25} /><circle cx={x} cy={y} r={9} fill="#FFF8DD" /></g>; })}
        <Ventisca f={f} n={70} fuerza={1.2} />
      </Svg>
    </Camara>
  );
};
