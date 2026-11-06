// Pantallas de las apps (1080×1920): tiempo y senderismo (tipo Wikiloc, genérica).
import React from "react";
import { NARANJA, UI } from "./comun";

const Sol: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 34 }) => (
  <g transform={`translate(${x} ${y})`}><circle r={r} fill="#FFD23F" />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={-r * 1.35} x2={0} y2={-r * 1.8} stroke="#FFD23F" strokeWidth={r * 0.18} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}</g>
);
const Nube: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#E7EEF7"><ellipse cx={0} cy={6} rx={46} ry={26} /><circle cx={-14} cy={-12} r={26} /><circle cx={16} cy={-18} r={30} /></g>
);

export const Tiempo: React.FC = () => (
  <g>
    <defs><linearGradient id="tp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2C6DB5" /><stop offset="1" stopColor="#8EC3EE" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#tp)" />
    <text x={540} y={330} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={78} fill="#fff">Chulilla</text>
    <text x={540} y={600} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={250} fill="#fff">14°</text>
    <text x={540} y={690} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={54} fill="#fff">Soleado</text>
    <text x={540} y={760} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={44} fill="#EAF3FC">Máx. 16°  ·  Mín. 5°</text>
    <rect x={60} y={900} width={960} height={900} rx={50} fill="#0B2A4A" opacity={0.28} />
    {[["Hoy", 0, "13°"], ["Mañana", 1, "14°"], ["Dom", 1, "15°"], ["Lun", 1, "14°"], ["Mar", 0, "12°"], ["Mié", 0, "11°"]].map(([d, sol, g], i) => (
      <g key={String(d)}>
        {i === 1 && <rect x={90} y={1010 + i * 130} width={900} height={110} rx={26} fill="#fff" opacity={0.22} />}
        <text x={130} y={1085 + i * 130} fontFamily={UI} fontWeight={700} fontSize={54} fill="#fff">{d}</text>
        {sol ? <Sol x={620} y={1065 + i * 130} r={26} /> : <Nube x={620} y={1068 + i * 130} s={0.9} />}
        <text x={960} y={1085 + i * 130} textAnchor="end" fontFamily={UI} fontWeight={700} fontSize={54} fill="#fff">{g}</text>
      </g>
    ))}
  </g>
);

/** App de rutas a pie: terreno con relieve, track naranja, estadísticas y perfil de altitud. */
export const Rutas: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="rt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#DCE6C6" /><stop offset="0.5" stopColor="#C8D6A8" /><stop offset="1" stopColor="#B7C894" /></linearGradient>
      <linearGradient id="rp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF6A1F" stopOpacity="0.55" /><stop offset="1" stopColor="#FF6A1F" stopOpacity="0.05" /></linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#rt)" />
    <path d="M0 700 C260 560 520 740 1080 560 L1080 1180 C700 1300 360 1120 0 1260Z" fill="#B3C48C" opacity={0.7} /><path d="M0 1260 C360 1120 700 1300 1080 1180 L1080 1500 L0 1500Z" fill="#9FB478" opacity={0.7} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M-40 ${300 + i * 105} C260 ${220 + i * 105} 700 ${420 + i * 90} 1120 ${260 + i * 110}`} stroke="#8FA46E" strokeWidth={i % 4 === 0 ? 5 : 3} fill="none" opacity={0.7} />)}
    <path d="M80 1340 C300 1260 520 1280 760 1200 C960 1130 1040 1000 1000 900" stroke="#7FBBE0" strokeWidth={30} fill="none" opacity={0.9} />
    <path d="M180 1110 C260 960 380 900 500 800 C640 690 700 760 820 640 C900 560 880 470 760 420" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M180 1110 C260 960 380 900 500 800 C640 690 700 760 820 640 C900 560 880 470 760 420" stroke={NARANJA} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={180} cy={1110} r={28} fill="#2E9E4F" stroke="#fff" strokeWidth={8} /><circle cx={760} cy={420} r={28} fill="#E94B4B" stroke="#fff" strokeWidth={8} />
    <rect width={1080} height={250} fill="#2E9E4F" /><text x={70} y={170} fontFamily={UI} fontWeight={700} fontSize={58} fill="#fff">Aproximación a El Balcón</text>
    <rect y={1380} width={1080} height={540} rx={56} fill="#fff" />
    {[["Distancia", "0,7 km"], ["Desnivel +", "55 m"], ["Tiempo", "20 min"]].map(([a, b], i) => <g key={a}><text x={90 + i * 330} y={1470} fontFamily={UI} fontWeight={500} fontSize={38} fill="#6B7A5C">{a}</text><text x={90 + i * 330} y={1540} fontFamily={UI} fontWeight={700} fontSize={64} fill="#1D2B16">{b}</text></g>)}
    <path d="M90 1830 L90 1730 C220 1750 300 1650 440 1680 C620 1720 700 1600 840 1610 C920 1616 960 1580 990 1560 L990 1830Z" fill="url(#rp)" /><path d="M90 1730 C220 1750 300 1650 440 1680 C620 1720 700 1600 840 1610 C920 1616 960 1580 990 1560" stroke={NARANJA} strokeWidth={8} fill="none" />
    <path d="M90 1830 L990 1830" stroke="#D5DBC9" strokeWidth={4} />
  </g>
);
