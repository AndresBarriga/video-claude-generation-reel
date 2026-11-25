// E80 · decorado propio: ACANTILADO CALIZO SOBRE EL MAR (Andrés, 25-nov: no quemar «roca» de E79 ni el rocódromo de E81).
// Pared gris azulada con chorreras ocres y negras, plataforma de roca abajo (donde asegura Dani) y mar abierto de fondo.
import React from "react";
import { random } from "remotion";
import { Expres, type Via } from "../../piezas/kit";

const T = "#14213A";
/** Fondo: cielo de mañana, mar con oleaje suave y una isla lejana (paralaje). */
export const FondoMar: React.FC<{ cx: number; cy: number; z: number; f?: number }> = ({ cx, cy, z, f = 0 }) => {
  const px = (cx - 600) * 0.2, py = (cy - 1500) * 0.12, s = 1 + (z - 1) * 0.2;
  return (
    <g>
      <defs>
        <linearGradient id="e80-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7CC0E8" /><stop offset="0.55" stopColor="#CDEAF5" /><stop offset="1" stopColor="#E9F6F8" /></linearGradient>
        <linearGradient id="e80-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3E9DB8" /><stop offset="1" stopColor="#1D6E8E" /></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#e80-cielo)" />
      <g transform={`translate(540 960) scale(${s}) translate(${-540 - px} ${-960 - py})`}>
        {[[120, 520, 1], [560, 420, 1.3]].map(([x, y, k], i) => <g key={i} opacity={0.9}><ellipse cx={x} cy={y} rx={120 * k} ry={30 * k} fill="#fff" /><ellipse cx={x + 60 * k} cy={y - 22 * k} rx={70 * k} ry={28 * k} fill="#fff" /></g>)}
        <path d="M-60 1095 Q60 1040 170 1060 Q260 1030 330 1095 Z" fill="#8FB0BE" />
        <rect x={-300} y={1095} width={1400} height={1400} fill="url(#e80-mar)" />
        {Array.from({ length: 18 }).map((_, i) => { const y = 1130 + i * 60, x = -260 + random(`mo${i}`) * 900 + Math.sin(f / 20 + i) * 18; return <path key={i} d={`M${x} ${y} q40 -14 80 0 t80 0`} stroke="#BFE6F0" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />; })}
      </g>
    </g>
  );
};
/** Pared del acantilado (mundo) + plataforma de roca + agua al pie. `repisa` = y de una repisa natural (opcional). */
export const Acantilado: React.FC<{ via: Via; repisa?: number; aviso?: number; f?: number }> = ({ via, repisa, aviso = 0, f = 0 }) => {
  const xF = via.xF, suelo = via.suelo, ys = Array.from({ length: 64 }, (_, i) => -500 + i * 52), cara = ys.map((y) => `${xF(y)} ${y}`).join(" L");
  return (
    <g>
      <defs><linearGradient id="e80-roca" x1="0" y1="0" x2="1" y2="0.05"><stop offset="0" stopColor="#E3E3DD" /><stop offset="0.25" stopColor="#C6C7C2" /><stop offset="1" stopColor="#8F949A" /></linearGradient></defs>
      <path d={`M${cara} L1700 ${suelo + 400} L1700 -500 Z`} fill="url(#e80-roca)" />
      {/* chorreras: ocres y negras, verticales (típicas de la caliza junto al mar) */}
      {Array.from({ length: 11 }).map((_, i) => { const y0 = -400 + random(`cy${i}`) * 1800, x0 = xF(y0) + 70 + random(`cx${i}`) * 650, l = 500 + random(`cl${i}`) * 900; return <path key={i} d={`M${x0} ${y0} q${-15 + random(`cq${i}`) * 30} ${l / 2} ${-6} ${l}`} stroke={i % 3 ? "#C98B5A" : "#4C5560"} strokeWidth={26 + random(`cw${i}`) * 40} fill="none" opacity={0.28} strokeLinecap="round" />; })}
      {/* fisuras y gotas de agua (pequeños agujeros) */}
      {Array.from({ length: 7 }).map((_, i) => { const y = 100 + i * 340 + random(`fy${i}`) * 80; return <path key={i} d={`M${xF(y) + 10} ${y} l${180 + random(`fl${i}`) * 200} ${-30 + random(`fq${i}`) * 60} l${120} ${20}`} stroke="#6F757C" strokeWidth={5} fill="none" opacity={0.55} />; })}
      {Array.from({ length: 34 }).map((_, i) => { const y = random(`gy${i}`) * 2600, x = xF(y) + 60 + random(`gx${i}`) * 760, r = 6 + random(`gr${i}`) * 10; return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#5E646B" opacity={0.6} />; })}
      {/* mata de lentisco agarrada a la pared */}
      {[[700, 1.0], [1650, 0.8]].map(([y, k], i) => <g key={i} transform={`translate(${xF(y) + 520} ${y}) scale(${k})`}>{[0, 1, 2, 3].map((j) => <circle key={j} cx={-30 + j * 22} cy={-10 - (j % 2) * 18} r={26} fill={j % 2 ? "#4E7D5E" : "#3F6B52"} />)}</g>)}
      <path d={`M${cara}`} stroke="#F6F7F2" strokeWidth={10} fill="none" opacity={0.7} />
      <path d={`M${cara}`} stroke={T} strokeWidth={4} fill="none" opacity={0.55} />
      {repisa !== undefined && <RepisaNat via={via} y={repisa} aviso={aviso} />}
      {/* plataforma de roca donde asegura Dani; el mar asoma por la izquierda */}
      <path d={`M-500 ${suelo + 30} Q-180 ${suelo - 10} 120 ${suelo + 4} Q500 ${suelo - 16} 1700 ${suelo} L1700 3300 L-500 3300 Z`} fill="#9A9690" />
      <path d={`M-500 ${suelo + 30} Q-180 ${suelo - 10} 120 ${suelo + 4} Q500 ${suelo - 16} 1700 ${suelo}`} stroke="#D7D4CC" strokeWidth={12} fill="none" />
      {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-380 + i * 230 + random(`px${i}`) * 80} cy={suelo + 70 + random(`py${i}`) * 140} rx={50 + random(`pr${i}`) * 40} ry={14} fill="#7C7872" opacity={0.6} />)}
      <path d={`M-500 ${suelo + 220} Q-200 ${suelo + 200 + Math.sin(f / 12) * 8} 100 ${suelo + 260} L100 3300 L-500 3300 Z`} fill="#2A86A6" opacity={0.85} />
      {via.chapas.map((y, i) => <Expres key={i} x={xF(y)} y={y} color="#2A3442" />)}
    </g>
  );
};
/** Repisa natural de caliza (mundo): bloque irregular que sale de la pared a la altura y. */
export const RepisaNat: React.FC<{ via: Via; y: number; aviso?: number }> = ({ via, y, aviso = 0 }) => {
  const x = via.xF(y) + 4;
  return (
    <g>
      <path d={`M${x} ${y - 6} L${x - 150} ${y - 2} Q${x - 200} ${y + 6} ${x - 190} ${y + 34} Q${x - 160} ${y + 70} ${x - 110} ${y + 96} Q${x - 60} ${y + 140} ${x} ${y + 170} Z`} fill="#B5B6B0" stroke={T} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M${x - 150} ${y + 2} Q${x - 80} ${y - 6} ${x} ${y}`} stroke="#ECEDE7" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M${x - 120} ${y + 60} q30 20 60 10`} stroke="#7C8086" strokeWidth={5} fill="none" />
      {aviso > 0 && <path d={`M${x - 196} ${y - 8} Q${x - 90} ${y - 20} ${x + 4} ${y - 12}`} stroke="#F04E4E" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.35 + 0.65 * aviso} />}
    </g>
  );
};
