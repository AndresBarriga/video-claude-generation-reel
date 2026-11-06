// App de topos de escalada (1080×1920): croquis claro del sector con vías numeradas y grados.
import React from "react";
import { NARANJA, UI } from "./comun";

const VIAS = [
  { n: 1, g: "5c", nom: "Calentando", c: "#FFD23F", x: 170, tope: 600, cur: 18 },
  { n: 2, g: "6a", nom: "La chapa", c: "#3DD6C4", x: 380, tope: 520, cur: -22 },
  { n: 3, g: "6b+", nom: "El balcón", c: NARANJA, x: 600, tope: 470, cur: 16 },
  { n: 4, g: "6c", nom: "Directa", c: "#FF5FA2", x: 800, tope: 560, cur: -18 },
  { n: 5, g: "7a", nom: "El techo", c: "#FFFFFF", x: 950, tope: 640, cur: 14 },
];
const BASE = 1190;

export const Topo: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="tpw" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#E6BE8B" /><stop offset="1" stopColor="#B07B4C" /></linearGradient>
      <linearGradient id="tpc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EC8F0" /><stop offset="1" stopColor="#D7ECF8" /></linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="#14181E" />
    <rect y={0} width={1080} height={250} fill="#1E252E" /><text x={60} y={165} fontFamily={UI} fontWeight={700} fontSize={58} fill="#fff">Sector El Balcón</text>
    <text x={1020} y={165} textAnchor="end" fontFamily={UI} fontWeight={500} fontSize={40} fill="#9FB1C4">24 vías</text>
    <g transform="translate(40 300)">
      <clipPath id="tpclip"><rect width={1000} height={960} rx={36} /></clipPath>
      <g clipPath="url(#tpclip)">
        <rect width={1000} height={960} fill="url(#tpc)" />
        <path d="M0 130 C120 100 200 160 330 120 C470 80 560 150 700 110 C820 80 920 130 1000 100 L1000 960 L0 960Z" fill="url(#tpw)" />
        <path d="M0 880 L1000 880 L1000 960 L0 960Z" fill="#4C7A3A" />
        {[250, 400, 560, 720].map((y, i) => <path key={i} d={`M0 ${y} C300 ${y - 26} 650 ${y + 30} 1000 ${y - 10}`} stroke="#8D5E37" strokeWidth={5} fill="none" opacity={0.4} />)}
        <path d="M470 160 L500 520 L470 880" stroke="#7A5230" strokeWidth={6} fill="none" opacity={0.5} /><path d="M700 880 C720 700 640 640 700 520" stroke="#7A5230" strokeWidth={5} fill="none" opacity={0.4} />
        {VIAS.map((v) => {
          const x = v.x - 40, top = v.tope - 300, b = BASE - 300 - 60;
          const d = `M${x} ${b} C${x + v.cur} ${b - 200} ${x - v.cur} ${top + 220} ${x + v.cur / 2} ${top}`;
          return (
            <g key={v.n}>
              <path d={d} stroke="#000" strokeWidth={14} fill="none" opacity={0.35} /><path d={d} stroke={v.c} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="22 14" />
              {[0.25, 0.5, 0.75].map((t) => <circle key={t} cx={x + v.cur * (t - 0.5)} cy={b - (b - top) * t} r={9} fill="#fff" stroke="#222" strokeWidth={4} />)}
              <circle cx={x} cy={b + 36} r={34} fill={v.c} stroke="#000" strokeWidth={4} /><text x={x} y={b + 50} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={40} fill="#14181E">{v.n}</text>
              <rect x={x + v.cur / 2 - 40} y={top - 70} width={80} height={52} rx={14} fill="#14181E" /><text x={x + v.cur / 2} y={top - 31} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={36} fill={v.c}>{v.g}</text>
            </g>
          );
        })}
      </g>
    </g>
    {VIAS.map((v, i) => (
      <g key={v.n}>
        <rect x={40} y={1320 + i * 112} width={1000} height={96} rx={22} fill={i === 2 ? "#26303C" : "#1E252E"} />
        <circle cx={100} cy={1368 + i * 112} r={30} fill={v.c} /><text x={100} y={1382 + i * 112} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={36} fill="#14181E">{v.n}</text>
        <text x={160} y={1380 + i * 112} fontFamily={UI} fontWeight={700} fontSize={46} fill="#fff">{v.nom}</text>
        <text x={1000} y={1380 + i * 112} textAnchor="end" fontFamily={UI} fontWeight={700} fontSize={46} fill={v.c}>{v.g}</text>
      </g>
    ))}
  </g>
);
