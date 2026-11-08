import React from "react";
export { C, Camara, Svg, clamp, golpe, type P } from "../Pegue/comun";
export { Rotulo, Chip, ei, salida } from "../Pump/comun";

// Rocódromo cálido (a propósito distinto de la paleta fría de montaña del resto del canal)
export const GYM = { paredA: "#3B2430", paredB: "#5A3A3A", panel: "#4A2F38", junta: "#2A1A22", luz: "#FFD9A0", cuerda: "#FF6A1F", suelo: "#241A22", magnesio: "#F4EFE6" };
const PRESAS = ["#2FB8A8", "#F2C230", "#E04F8A", "#6B7CE0", "#F28A30", "#7BD389"];

export const Pared: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="gymBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GYM.paredA} /><stop offset="1" stopColor={GYM.paredB} /></linearGradient>
      <radialGradient id="gymLuz" cx="0.5" cy="0.38" r="0.7"><stop offset="0" stopColor={GYM.luz} stopOpacity="0.32" /><stop offset="1" stopColor={GYM.luz} stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#gymBg)" />
    {[0, 360, 720].map((x) => <rect key={x} x={x} y={0} width={360} height={1920} fill={GYM.panel} opacity={x === 360 ? 0.55 : 0.9} />)}
    {[0, 360, 720, 1080].map((x) => <path key={x} d={`M${x} 0 L${x} 1920`} stroke={GYM.junta} strokeWidth={10} />)}
    {[480, 960, 1440].map((y) => <path key={y} d={`M0 ${y} L1080 ${y}`} stroke={GYM.junta} strokeWidth={10} />)}
    {Array.from({ length: 26 }).map((_, i) => {
      const x = 60 + ((i * 197) % 960), y = 130 + ((i * 331) % 1500), r = 22 + (i % 4) * 7;
      return <g key={i} opacity={0.75}><ellipse cx={x} cy={y + 6} rx={r} ry={r * 0.8} fill="#000" opacity={0.3} /><ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill={PRESAS[i % PRESAS.length]} /></g>;
    })}
    <rect width={1080} height={1920} fill="url(#gymLuz)" />
    {Array.from({ length: 36 }).map((_, i) => {
      const x = (i * 131) % 1080, y = ((i * 97 + f * 0.6) % 1900);
      return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill={GYM.magnesio} opacity={0.35} />;
    })}
  </g>
);
