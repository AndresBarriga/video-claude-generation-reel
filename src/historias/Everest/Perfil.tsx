// Escena «perfil»: la montaña como protagonista. Altímetro, zona de la muerte, punto de la cueva y contador de gente que pasa.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NOCHE, Nieve, Svg, Rotulo, ei, type P } from "./comun";

// ruta de subida (de abajo a la derecha hacia la cima arriba a la izquierda) y cueva a ~8.500 m
const RUTA: [number, number][] = [[880, 1520], [810, 1350], [740, 1200], [650, 1000], [600, 900], [550, 810], [500, 730], [455, 675]];
const yDe = (m: number) => 1500 - (m - 8000) * (860 / 848);
const CUEVA = { x: 640, y: yDe(8500) };
const M = (y: number) => Math.round(8000 + ((1500 - y) / 1500) * 848); // metros aprox. por altura
export const Perfil: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const n = Math.floor(ei(f, 6, d - 6, 0, 34));
  const pulso = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ background: NOCHE.cieloA }}>
      <Svg>
        <defs>
          <linearGradient id="cieloP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NOCHE.cieloA} /><stop offset="1" stopColor={NOCHE.cieloB} /></linearGradient>
          <linearGradient id="zona" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7E2A2A" stopOpacity="0" /><stop offset="1" stopColor="#7E2A2A" stopOpacity="0.38" /></linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#cieloP)" />
        {/* silueta de la montaña */}
        <path d="M-100 2100 L-100 1500 L200 1300 L330 1000 L400 700 L470 640 L560 760 L650 960 L760 1150 L900 1380 L1200 1560 L1200 2100 Z" fill={NOCHE.roca} />
        <path d="M400 700 L470 640 L560 760 L650 960 L760 1150 L900 1380 L1200 1560 L1200 2100 L560 2100 L640 1500 L560 1100 Z" fill={NOCHE.rocaS} opacity={0.8} />
        <path d="M330 1000 L400 700 L470 640 L560 760" stroke={NOCHE.nieve} strokeWidth={5} fill="none" opacity={0.5} />
        {/* zona de la muerte (>8.000 m) */}
        <rect x={0} y={640} width={1080} height={860} fill="url(#zona)" />
        <path d="M0 1500 L1080 1500" stroke="#C8402E" strokeWidth={4} strokeDasharray="22 16" opacity={0.85} />
        <text x={30} y={1478} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={44} fill="#E86A5A" opacity={0.95}>ZONA DE LA MUERTE</text>
        {/* altímetro (derecha) */}
        {[8848, 8700, 8500, 8300, 8100].map((m) => {
          const y = yDe(m);
          return <g key={m}><path d={`M1020 ${y} L1080 ${y}`} stroke={NOCHE.nieve} strokeWidth={4} opacity={0.7} /><text x={1008} y={y + 14} textAnchor="end" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={700} fontSize={38} fill={NOCHE.nieve} opacity={0.85}>{m.toLocaleString("es-ES")} m</text></g>;
        })}
        {/* ruta */}
        <path d={"M" + RUTA.map((p) => p.join(" ")).join(" L")} stroke="#FFE9B8" strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" fill="none" opacity={0.45} />
        {/* luces de los que pasan: una por cada +1, subiendo por la ruta */}
        {Array.from({ length: Math.min(n, 12) }).map((_, i) => {
          const t = ((i * 0.083 + f / 140) % 1) * (RUTA.length - 1), k = Math.floor(t), r = t - k;
          const a = RUTA[k], b = RUTA[Math.min(k + 1, RUTA.length - 1)];
          const x = a[0] + (b[0] - a[0]) * r, y = a[1] + (b[1] - a[1]) * r;
          return <g key={i}><circle cx={x} cy={y} r={22} fill="#FFE9B8" opacity={0.2} /><circle cx={x} cy={y} r={8} fill="#FFF7D6" /></g>;
        })}
        {/* el punto de la cueva */}
        <circle cx={CUEVA.x} cy={CUEVA.y} r={46 + pulso * 16} fill="#FF6A1F" opacity={0.18 + pulso * 0.12} />
        <circle cx={CUEVA.x} cy={CUEVA.y} r={16} fill="#FF6A1F" />
        <path d={`M${CUEVA.x - 30} ${CUEVA.y} L${CUEVA.x - 110} ${CUEVA.y - 30}`} stroke="#FF6A1F" strokeWidth={4} />
        <text x={CUEVA.x - 120} y={CUEVA.y - 34} textAnchor="end" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={54} fill="#fff" stroke="#050B14" strokeWidth={10} paintOrder="stroke">SIGUE VIVO</text>
        <text x={CUEVA.x - 120} y={CUEVA.y + 14} textAnchor="end" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={700} fontSize={38} fill={NOCHE.nieve} stroke="#050B14" strokeWidth={8} paintOrder="stroke">8.500 m · cueva</text>
        <Nieve f={f} n={45} />
        <Rotulo f={f} ini={0} t="EVEREST 2006" y={270} tam={74} col="#fff" />
        {/* contador */}
        <text x={540} y={500} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={300} fill="#FF6A1F" stroke="#050B14" strokeWidth={56} paintOrder="stroke">{n}</text>
        <text x={540} y={590} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={58} fill="#fff" stroke="#050B14" strokeWidth={12} paintOrder="stroke">HAN PASADO DE LARGO</text>
        <rect width={1080} height={1920} fill="none" />
      </Svg>
    </AbsoluteFill>
  );
};
