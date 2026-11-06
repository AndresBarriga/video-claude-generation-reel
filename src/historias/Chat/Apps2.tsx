// Pantallas de las apps (1080×1920): música y galería.
import React from "react";
import { Foto, NARANJA, UI } from "./comun";

const PISTAS = ["Magnesio", "Última chapa", "Reunión", "Cinta exprés", "Pie de gato"];

export const Musica: React.FC = () => (
  <g>
    <defs><linearGradient id="mu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A3516" /><stop offset="0.55" stopColor="#2A140B" /><stop offset="1" stopColor="#120905" /></linearGradient>
      <linearGradient id="mc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#C2410C" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#mu)" />
    <rect x={130} y={200} width={820} height={820} rx={34} fill="url(#mc)" />
    <path d="M300 420 C420 360 540 560 660 480 C760 410 790 600 700 700 C620 780 470 760 420 860" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" />
    <circle cx={420} cy={865} r={44} fill="none" stroke="#fff" strokeWidth={20} />
    <text x={130} y={1130} fontFamily={UI} fontWeight={700} fontSize={72} fill="#fff">Para escalar</text>
    <text x={130} y={1200} fontFamily={UI} fontWeight={500} fontSize={44} fill="#D9B8A4">Lista  ·  48 canciones</text>
    <circle cx={900} cy={1150} r={78} fill="#FF6A1F" /><path d="M872 1112 L872 1188 L936 1150Z" fill="#fff" />
    {PISTAS.map((p, i) => (
      <g key={p}>
        <rect x={130} y={1290 + i * 120} width={96} height={96} rx={14} fill={i === 2 ? "#FF6A1F" : "#4A2A1B"} />
        <text x={260} y={1354 + i * 120} fontFamily={UI} fontWeight={i === 2 ? 700 : 500} fontSize={50} fill={i === 2 ? NARANJA : "#fff"}>{p}</text>
      </g>
    ))}
    <rect x={130} y={1880} width={820} height={8} rx={4} fill="#5A3A2A" /><rect x={130} y={1880} width={330} height={8} rx={4} fill="#fff" />
  </g>
);

export const Galeria: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#0A0D12" />
    <text x={540} y={170} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={50} fill="#fff">Ayer</text>
    <text x={540} y={222} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={36} fill="#8DA0B5">18:32</text>
    <g transform="translate(60 330)"><clipPath id="gf"><rect width={960} height={1300} rx={30} /></clipPath><g clipPath="url(#gf)"><Foto w={960} h={1300} id="gal" /></g></g>
    <g fill="#fff" opacity={0.9}><circle cx={150} cy={1790} r={9} /><circle cx={540} cy={1790} r={9} /><circle cx={930} cy={1790} r={9} /></g>
  </g>
);
