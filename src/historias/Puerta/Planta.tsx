// Vista desde arriba: la pared es una línea, la bisagra un punto y tu cuerpo la puerta que se abre.
import React from "react";
import { PU, Txt } from "./comun";

export const Planta: React.FC<{ x: number; y: number; th: number; largo?: number; col?: string; titulo?: boolean; cerrada?: boolean; k?: number }> = ({ x, y, th, largo = 150, col = PU.chaqueta, titulo = true, cerrada, k = 1.15 }) => {
  const t = (th * Math.PI) / 180, hx = x + 80, hy = y + 190, ex = hx - largo * Math.cos(t), ey = hy - largo * Math.sin(t);
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <rect x={x - 90} y={y - 30} width={340} height={270} rx={30} fill="#0B1624" opacity={0.82} stroke="#fff" strokeOpacity={0.25} strokeWidth={4} />
      {titulo && <Txt x={x + 80} y={y + 12} t="VISTA DESDE ARRIBA" tam={30} col="#C9D3DE" />}
      <rect x={x - 70} y={hy} width={300} height={26} rx={6} fill="#7B8CA6" />
      <path d={`M${hx - largo} ${hy} A${largo} ${largo} 0 0 1 ${ex} ${ey}`} stroke="#FF6A1F" strokeWidth={5} strokeDasharray="10 9" fill="none" opacity={th > 3 ? 1 : 0} />
      <path d={`M${hx} ${hy} L${ex} ${ey}`} stroke={col} strokeWidth={22} strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={24} fill={PU.piel} stroke={PU.tinta} strokeOpacity={0.5} strokeWidth={4} />
      <circle cx={hx} cy={hy} r={13} fill="#FF6A1F" stroke="#fff" strokeWidth={4} />
      <Txt x={hx + 24} y={hy + 70} t={cerrada ? "CERRADA" : "LA LÍNEA"} tam={36} col="#FF8A4A" ancla="start" />
    </g>
  );
};
