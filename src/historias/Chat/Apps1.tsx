// Pantallas de las apps (1080×1920): tiempo, rutas de montaña y mapa. Genéricas, sin marcas.
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

export const Rutas: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#E8EEE0" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-60 + i * 30} ${420 + i * 150} C${260} ${300 + i * 150} ${620} ${620 + i * 110} ${1140} ${380 + i * 150}`} stroke="#C6D3B8" strokeWidth={5} fill="none" />)}
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={760} cy={900} rx={90 + i * 80} ry={60 + i * 62} fill="none" stroke="#C0CEB0" strokeWidth={5} />)}
    <path d="M-40 1380 C260 1260 460 1500 1120 1240" stroke="#9FD0E6" strokeWidth={46} fill="none" />
    <path d="M200 1500 C260 1300 360 1180 480 1120 C640 1040 600 880 760 800 C860 750 900 640 860 560" stroke={NARANJA} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray="1 0" />
    <circle cx={200} cy={1500} r={26} fill="#fff" stroke={NARANJA} strokeWidth={10} /><circle cx={860} cy={560} r={30} fill={NARANJA} />
    <rect x={40} y={110} width={1000} height={120} rx={60} fill="#fff" /><circle cx={110} cy={170} r={22} fill="none" stroke="#6B7A5C" strokeWidth={7} /><path d="M126 186 L146 206" stroke="#6B7A5C" strokeWidth={7} strokeLinecap="round" />
    <text x={180} y={186} fontFamily={UI} fontWeight={500} fontSize={46} fill="#2B3A22">El Balcón, Chulilla</text>
    <rect x={40} y={1470} width={1000} height={380} rx={44} fill="#fff" />
    <rect x={80} y={1510} width={230} height={230} rx={28} fill="#C9A06E" /><path d="M80 1700 L170 1580 L230 1650 L270 1610 L310 1740 L80 1740Z" fill="#9A7447" />
    <text x={350} y={1565} fontFamily={UI} fontWeight={700} fontSize={50} fill="#1D2B16">Aproximación al sector</text>
    <text x={350} y={1630} fontFamily={UI} fontWeight={500} fontSize={42} fill="#5B6B4E">0,7 km  ·  55 m de desnivel</text>
    <rect x={350} y={1672} width={290} height={84} rx={42} fill={NARANJA} /><text x={495} y={1730} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={42} fill="#fff">Ver ruta</text>
  </g>
);

export const Mapa: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#1B2733" />
    {[[0, 300, 1080, 420], [0, 700, 1080, 640], [0, 1000, 1080, 980], [200, 0, 280, 1920], [620, 0, 700, 1920], [900, 0, 840, 1920]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} stroke="#2E3F50" strokeWidth={i < 3 ? 30 : 22} />)}
    <path d="M-40 1250 C240 1100 330 1160 470 980 C640 780 560 560 800 420 L900 330" stroke="#3D8BFF" strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={110} cy={1230} r={24} fill="#fff" stroke="#3D8BFF" strokeWidth={10} />
    <g transform="translate(900 330)"><path d="M0 0 C-36 -50 -52 -74 -52 -102 A52 52 0 1 1 52 -102 C52 -74 36 -50 0 0Z" fill="#E94B4B" /><circle cy={-102} r={20} fill="#fff" /></g>
    <rect x={40} y={110} width={1000} height={200} rx={36} fill="#10181F" />
    <text x={110} y={190} fontFamily={UI} fontWeight={500} fontSize={44} fill="#9FB1C4">Mi ubicación</text><text x={110} y={265} fontFamily={UI} fontWeight={700} fontSize={50} fill="#fff">Chulilla</text>
    <rect y={1480} width={1080} height={440} rx={56} fill="#10181F" />
    <text x={80} y={1610} fontFamily={UI} fontWeight={700} fontSize={110} fill="#5BD16F">1 h 05</text>
    <text x={80} y={1690} fontFamily={UI} fontWeight={500} fontSize={46} fill="#9FB1C4">78 km  ·  ruta más rápida</text>
    <rect x={640} y={1560} width={360} height={130} rx={65} fill="#3D8BFF" /><text x={820} y={1645} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={54} fill="#fff">Empezar</text>
  </g>
);
