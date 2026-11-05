// Primera persona: miras hacia abajo por la cuerda desde tu puño. El mundo sube mientras bajas: el extremo y la reunión se acercan.
import React from "react";
import { random } from "remotion";
import { Cuerda, Puno, Svg, Chip, MarNubes, ei } from "./comun";

const mod = (v: number, m: number) => ((v % m) + m) % m;

export const Pov: React.FC<{ f: number; p: number; fReu?: number }> = ({ f, p, fReu = 9999 }) => {
  const off = p * 560, yEnd = 1420 - off, yReu = 1780 - off, sw = Math.sin(f * 0.08) * 12;
  const o = ei(f, fReu, fReu + 10, 0, 1);
  return (
    <Svg>
      <defs>
        <linearGradient id="pw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3C4A60" /><stop offset="0.5" stopColor="#6A7B93" /><stop offset="1" stopColor="#3C4A60" /></linearGradient>
        <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3050" stopOpacity="0" /><stop offset="1" stopColor="#1A1830" stopOpacity="0.95" /></linearGradient>
        <radialGradient id="pv" cx="50%" cy="45%" r="75%"><stop offset="55%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.6" /></radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#pw)" />
      {Array.from({ length: 12 }).map((_, i) => { const y = mod(i * 190 - off * 1.05, 2300) - 200, x = 80 + random(`c${i}`) * 700; return <path key={i} d={`M${x} ${y} l${120 + random(`l${i}`) * 200} ${20 + random(`h${i}`) * 40} l${-40 + random(`m${i}`) * 80} ${30}`} stroke="#1E2838" strokeOpacity={0.45} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />; })}
      <g transform={`translate(0 ${yReu})`}>
        <path d="M120 0 L960 0 L900 70 L180 70 Z" fill="#B9A9A0" /><path d="M180 70 L900 70 L900 140 L180 140 Z" fill="#6E6068" />
        <path d="M300 30 L540 30 L780 30" stroke="#0B1624" strokeWidth={5} fill="none" strokeDasharray="2 22" strokeLinecap="round" />
        {[420, 660].map((x) => <circle key={x} cx={x} cy={36} r={13} fill="#C9D2DC" stroke="#0B1624" strokeWidth={5} />)}
        <path d="M420 40 Q540 100 660 40" stroke="#C9D2DC" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="14 7" /><circle cx={540} cy={86} r={22} fill="none" stroke="#C9D2DC" strokeWidth={9} />
      </g>
      <MarNubes y={yReu + 330} />
      <Cuerda d={`M540 -60 L${560} 420`} w={16} />
      <Cuerda d={`M560 440 C${566 + sw} ${(440 + yEnd) / 2} ${548 + sw} ${yEnd - 200} ${556 + sw} ${yEnd}`} w={16} />
      <g transform={`translate(${556 + sw} ${yEnd})`}><rect x={-11} y={-4} width={22} height={30} rx={6} fill="#3A1A0A" />{[-7, 0, 7].map((dx) => <path key={dx} d={`M${dx} 22 q${dx * 0.8} 14 ${dx * 1.6} 26`} stroke="#FF8A4A" strokeWidth={4} strokeLinecap="round" fill="none" />)}</g>
      <line x1={556 + sw} y1={yEnd + 70} x2={556} y2={yReu - 30} stroke="#fff" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={o} />
      <Puno x={560} y={440} s={1.15} manga={[330, -380]} />
      <rect width={1080} height={1920} fill="url(#pv)" />
      <Chip x={540} y={yReu - 100} t="SIGUIENTE REUNIÓN" o={o} />
    </Svg>
  );
};
