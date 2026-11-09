// Interior de la grieta: paredes de hielo azul con capas, boca arriba con el cielo (noche → alba).
import React from "react";
import { random } from "remotion";
import { INV } from "./comun";

const capas = (lado: 1 | -1, id: string) => {
  const out: React.ReactNode[] = [];
  const cols = [INV.hielo0, INV.hielo1, "#2A86B8", INV.hielo2, "#2A86B8", INV.hielo1];
  for (let i = 0; i < 6; i++) {
    const x0 = lado === -1 ? -40 : 1120, w = 330 - i * 40, dx = lado * -w;
    const pts = Array.from({ length: 14 }).map((_, k) => {
      const y = 300 + k * 130, j = (random(`${id}${i}${k}`) - 0.5) * 40;
      return `${x0 + dx + lado * (Math.sin(k * 0.9 + i) * 26 + j)} ${y}`;
    });
    out.push(<path key={i} d={`M${x0} 300 L${pts.join(" L")} L${x0} 2100 Z`} fill={cols[i]} opacity={0.95} />);
  }
  return out;
};

export const Grieta: React.FC<{ alba?: number }> = ({ alba = 0 }) => (
  <g>
    <defs>
      <linearGradient id="gBoca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={alba > 0.5 ? "#F4B88A" : "#1B1640"} /><stop offset="1" stopColor={alba > 0.5 ? "#9FD3EE" : "#3B3480"} /></linearGradient>
      <linearGradient id="gFondo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3FA2CF" /><stop offset="1" stopColor="#06233D" /></linearGradient>
      <radialGradient id="gHaz" cx="540" cy="250" r="1100" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={INV.hielo3} stopOpacity={0.25 + 0.35 * alba} /><stop offset="1" stopColor={INV.hielo3} stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={-300} y={-300} width={1680} height={2520} fill="url(#gFondo)" />
    <path d="M300 -100 Q540 120 790 -100 L820 330 Q540 420 270 330 Z" fill="url(#gBoca)" />
    {capas(-1, "l")}
    {capas(1, "r")}
    {/* carámbanos y destellos */}
    {Array.from({ length: 16 }).map((_, i) => { const x = 200 + random(`c${i}`) * 680; return <path key={i} d={`M${x - 10} 330 L${x} ${360 + random(`cl${i}`) * 90} L${x + 10} 330 Z`} fill={INV.hielo3} opacity={0.8} />; })}
    {/* suelo de nieve dentro */}
    <path d="M-100 1500 Q540 1420 1180 1500 L1180 2400 L-100 2400 Z" fill="#CFE6F2" />
    <path d="M-100 1500 Q540 1420 1180 1500" stroke="#fff" strokeWidth={8} fill="none" opacity={0.7} />
    <rect x={-300} y={-300} width={1680} height={2520} fill="url(#gHaz)" />
  </g>
);
