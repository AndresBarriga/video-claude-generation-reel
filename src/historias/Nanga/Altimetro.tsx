// Altímetro lateral que acompaña el centro del vídeo: la luz de ella baja desde 7.280 m; la de los rescatadores sube desde 4.800 m. Se encuentran a ~6.100 m.
import React from "react";
import { interpolate } from "remotion";

const Y0 = 400, Y1 = 1230, A0 = 8126, A1 = 4500; // escala vertical
const yDe = (a: number) => Y0 + ((A0 - a) / (A0 - A1)) * (Y1 - Y0);
export type Tramo = { t: number[]; ella: number[]; ellos?: number[] };
export const Altimetro: React.FC<{ s: number; tramo: Tramo; horas?: number }> = ({ s, tramo, horas }) => {
  const op = interpolate(s, [tramo.t[0], tramo.t[0] + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ella = interpolate(s, tramo.t, tramo.ella, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ellos = tramo.ellos ? interpolate(s, tramo.t, tramo.ellos, { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : null;
  const txt = (a: number) => `${(Math.round(a / 10) * 10).toLocaleString("es-ES")} m`;
  const luz = (a: number, col: string, etq: string) => (
    <g transform={`translate(70 ${yDe(a)})`}>
      <circle r={40} fill={col} opacity={0.3} /><circle r={18} fill={col} /><circle r={8} fill="#fff" />
      <text x={44} y={-4} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={58} fill="#fff" stroke="#05040C" strokeWidth={8} paintOrder="stroke">{txt(a)}</text>
      <text x={46} y={40} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={36} fill={col} stroke="#05040C" strokeWidth={6} paintOrder="stroke">{etq}</text>
    </g>
  );
  return (
    <g opacity={op}>
      <rect x={60} y={Y0} width={20} height={Y1 - Y0} rx={8} fill="#05040C" opacity={0.55} />
      <path d={`M54 ${yDe(8126)} L86 ${yDe(8126)}`} stroke="#fff" strokeWidth={4} />
      <text x={96} y={yDe(8126) + 10} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={700} fontSize={34} fill="#fff" opacity={0.8}>CIMA 8.126</text>
      {ellos !== null && luz(ellos, "#FF8A3D", "RESCATE")}
      {luz(ella, "#B48CFF", horas ? `ELISABETH · ${horas} h` : "ELISABETH")}
    </g>
  );
};
