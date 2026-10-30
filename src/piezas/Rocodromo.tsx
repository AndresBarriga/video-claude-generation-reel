// Rocódromo de bloque, visto de perfil como el bloque exterior (misma geometría de canto: valen `trepa`, `AG`, `colgado` de Bloque/comun).
// Pared del fondo con presas de resina de colores y cintas de grado, focos, reloj de pared y colchoneta azul continua.
import React from "react";
import { random } from "remotion";

export const MAT = 1318; // superficie de la colchoneta
export const dePieR = (s = 1.2) => MAT + 8 - 136 * s;
export const sentadoR = (s = 1.2) => MAT + 6 - 12 * s;
export const RESINA = ["#E0A526", "#2FA39A", "#E8E4DA", "#C8566B", "#6FA34A", "#4F7FC9"];
const T = "#141B26";
const canto = (y: number) => (y >= 1060 ? 400 + ((y - 1060) * 80) / 280 : y >= 930 ? 372 + ((y - 930) * 28) / 130 : 372 + ((930 - y) * 30) / 140);

/** Presa de resina (forma redondeada). */
export const Resina: React.FC<{ x: number; y: number; r?: number; c: string; seed: string; magnesio?: number }> = ({ x, y, r = 22, c, seed, magnesio = 0.6 }) => {
  const k = 0.7 + random(seed) * 0.6;
  return (
    <g>
      <ellipse cx={x + 3} cy={y + r * 0.5} rx={r * 1.1 * k} ry={r * 0.45} fill="#000" opacity={0.25} />
      <path d={`M${x - r * k} ${y + 4} q${r * 0.2} ${-r * 1.1} ${r * k} ${-r} q${r * 0.9 * k} ${-r * 0.1} ${r * k} ${r} q${-r * k} ${r * 0.4} ${-r * 2 * k} 0 Z`} fill={c} stroke={T} strokeOpacity={0.35} strokeWidth={3} />
      {magnesio > 0 && <path d={`M${x - r * 0.6 * k} ${y - r * 0.5} q${r * 0.6} ${-r * 0.4} ${r * 1.2 * k} 0`} stroke="#F4F7FA" strokeWidth={5} strokeLinecap="round" fill="none" opacity={magnesio} />}
    </g>
  );
};

/** Reloj de pared. `min` = minutos que han pasado (las agujas giran). */
export const Reloj: React.FC<{ x: number; y: number; r?: number; min: number }> = ({ x, y, r = 70, min }) => {
  const am = (min / 60) * 360 + 60, ah = ((17 + min / 60) / 12) * 360;
  const mano = (a: number, L: number, w: number) => <path d={`M${x} ${y} L${x + Math.sin((a * Math.PI) / 180) * L} ${y - Math.cos((a * Math.PI) / 180) * L}`} stroke={T} strokeWidth={w} strokeLinecap="round" />;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 10} fill="#1E2733" />
      <circle cx={x} cy={y} r={r} fill="#F4F2EE" />
      {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <circle key={i} cx={x + Math.sin(a) * r * 0.8} cy={y - Math.cos(a) * r * 0.8} r={i % 3 ? 3 : 6} fill={T} />; })}
      {mano(ah, r * 0.5, 9)}{mano(am, r * 0.78, 6)}
      <circle cx={x} cy={y} r={7} fill="#C9384A" />
    </g>
  );
};

/** Fondo de rocódromo. `min` = minutos del reloj; `reloj` = dónde (o false). */
export const Rocodromo: React.FC<{ min?: number; reloj?: boolean; hundido?: number; grado?: string }> = ({ min = 0, reloj = true, hundido = 0, grado }) => (
  <g>
    <rect x={-300} y={-500} width={1700} height={2900} fill="#2C3748" />
    {/* focos */}
    {[120, 480, 840].map((x, i) => <g key={i}><rect x={x - 90} y={60} width={180} height={18} rx={9} fill="#F4F2EE" /><path d={`M${x - 90} 78 L${x - 240} 700 L${x + 240} 700 L${x + 90} 78 Z`} fill="#FFF3C4" opacity={0.05} /></g>)}
    {/* paneles del fondo con presas y cintas */}
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${-100 + i * 220} 160 L${-100 + i * 220} ${MAT}`} stroke="#243040" strokeWidth={4} />)}
    {Array.from({ length: 34 }).map((_, i) => (
      <Resina key={i} x={-60 + random(`fx${i}`) * 1200} y={200 + random(`fy${i}`) * 1000} r={12 + random(`fr${i}`) * 10} c={RESINA[i % RESINA.length]} seed={`f${i}`} magnesio={0.3} />
    ))}
    {[[80, 1180, "#E0A526"], [240, 1210, "#2FA39A"], [960, 1190, "#C8566B"]].map(([x, y, c], i) => <rect key={i} x={x as number} y={y as number} width={46} height={14} rx={3} fill={c as string} opacity={0.9} />)}
    {reloj && <Reloj x={170} y={520} min={min} />}
    <rect x={-300} y={-500} width={1700} height={2900} fill="#0B1624" opacity={0.28} />
    {/* pared principal (perfil) */}
    <path d={`M480 ${MAT} L400 1060 L372 930 L541 140 L1400 140 L1400 ${MAT} Z`} fill="#5C6E86" />
    <path d={`M480 ${MAT} L400 1060 L372 930 L541 140`} stroke="#3E4C60" strokeWidth={14} fill="none" />
    {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={470 + (i % 6) * 110} cy={230 + Math.floor(i / 6) * 220} r={5} fill="#3E4C60" />)}
    {[1110, 1000, 900, 790, 640].map((y, i) => <Resina key={i} x={canto(y) + 8} y={y} r={26} c="#E0A526" seed={`p${i}`} magnesio={0.85} />)}
    {grado && <g><rect x={470} y={1150} width={120} height={56} rx={6} fill="#E0A526" /><text x={530} y={1192} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={42} fill={T}>{grado}</text></g>}
    {/* colchoneta */}
    <path d={`M-300 ${MAT + 4} Q540 ${MAT - 6 + hundido * 16} 1400 ${MAT + 4} L1400 2400 L-300 2400 Z`} fill="#2E4B7A" />
    <path d={`M-300 ${MAT + 4} Q540 ${MAT - 6 + hundido * 16} 1400 ${MAT + 4}`} stroke="#4E6FA6" strokeWidth={10} fill="none" />
    {[140, 520, 900].map((x, i) => <path key={i} d={`M${x} ${MAT + 10} L${x - 40} 1920`} stroke="#22385E" strokeWidth={6} />)}
  </g>
);
