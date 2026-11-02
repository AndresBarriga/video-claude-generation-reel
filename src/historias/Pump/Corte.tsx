// Interior del antebrazo: músculo, tendones, arteria y vena. El músculo aprieta (`aprieta` 0–1) y estrecha los vasos; la sangre fluye según `flujo`.
import React from "react";
import { random } from "remotion";
import { PM } from "./comun";

const PX = -110; // posición del estrechamiento
const ys = (x: number, base: number) => base + 12 * Math.sin((x + 560) / 130);
const ancho0 = 30;
const ancho = (x: number, k: number) => ancho0 * (1 - 0.82 * k * Math.exp(-(((x - PX) / 95) ** 2)));

const Tubo: React.FC<{ base: number; col: string; k: number; tinta?: string }> = ({ base, col, k }) => {
  const seg: React.ReactNode[] = [];
  for (let x = -560; x < 270; x += 10) seg.push(<line key={x} x1={x} y1={ys(x, base)} x2={x + 11} y2={ys(x + 11, base)} stroke={col} strokeWidth={ancho(x, k)} strokeLinecap="round" />);
  return <g>{seg}</g>;
};

export const Corte: React.FC<{ f: number; aprieta?: number; flujo?: number; residuos?: number; o2?: number; brilla?: number }> = ({ f, aprieta = 0, flujo = 1, residuos = 0, o2 = 0, brilla = 0 }) => {
  const m = 1 + aprieta * 0.05 * (1 + Math.sin(f * 0.5));
  const celdas = Array.from({ length: 16 }).map((_, i) => {
    const v = 5 * flujo + 0.6, L = 830, x = -560 + ((i * 53 + f * v) % L), art = i % 2 === 0, y = ys(x, art ? -52 : 52);
    const paso = x > PX + 20 ? flujo : 1;
    return <circle key={i} cx={x} cy={y} r={9} fill={art ? "#FF8A8A" : "#8FA8E8"} opacity={paso} />;
  });
  return (
    <g>
      <rect x={-600} y={-230} width={900} height={460} fill="#8A2E34" />
      <g transform={`translate(-150 0) scale(1 ${m}) translate(150 0)`}>
        <path d="M-520 -92 Q-150 -190 230 -64 L230 64 Q-150 190 -520 92 Z" fill={PM.musculo} stroke="#7A2A2E" strokeWidth={8} />
        {[-60, -30, 0, 30, 60].map((d) => <path key={d} d={`M-500 ${d * 0.9} Q-150 ${d * 1.9} 210 ${d * 0.55}`} stroke={PM.musculoS} strokeWidth={6} fill="none" opacity={0.7} />)}
      </g>
      {[-22, 0, 22].map((d) => <path key={d} d={`M220 ${d} L390 ${d * 0.6}`} stroke="#F2E6D6" strokeWidth={9} strokeLinecap="round" />)}
      <Tubo base={-52} col="#B73A3A" k={aprieta} /><Tubo base={52} col="#3F5BA8" k={aprieta} />
      <Tubo base={-52} col={PM.arteria} k={aprieta} /><Tubo base={52} col={PM.vena} k={aprieta} />
      {celdas}
      {aprieta > 0.3 && [0, 1, 2].map((i) => <path key={i} d={`M${PX - 30 + i * 30} ${-150 + Math.sin(f * 0.4 + i) * 4} l0 ${52}`} stroke="#FF6A1F" strokeWidth={9} strokeLinecap="round" opacity={aprieta} markerEnd="" />)}
      {o2 > 0 && Array.from({ length: 7 }).map((_, i) => {
        const x = PX - 260 + ((f * 2 + i * 41) % 230), y = ys(x, i % 2 ? -52 : 52), o = 0.9;
        return <circle key={i} cx={x} cy={y + Math.sin(f * 0.3 + i) * 3} r={8} fill={PM.hielo} opacity={o * o2} />;
      })}
      {residuos > 0 && Array.from({ length: Math.floor(residuos * 46) }).map((_, i) => <rect key={i} x={-480 + random(`rx${i}`) * 640} y={-80 + random(`ry${i}`) * 160} width={10} height={10} rx={3} fill={PM.residuo} opacity={0.9} transform={`rotate(${random(`rr${i}`) * 90} ${-480 + random(`rx${i}`) * 640} ${-80 + random(`ry${i}`) * 160})`} />)}
      {brilla > 0 && <rect x={-600} y={-230} width={900} height={460} fill="#fff" opacity={brilla * 0.25} />}
    </g>
  );
};
