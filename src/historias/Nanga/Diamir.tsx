// 5 · La cara del Diamir a escala enorme: dos frontales diminutas suben de noche dejando estela; contador de metros y reloj.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, INV, Svg, Ventisca, type P } from "./comun";

const RUTA: [number, number][] = [[560, 1780], [600, 1560], [520, 1360], [580, 1140], [500, 940], [560, 760]];
const en = (t: number): [number, number] => { const s = t * (RUTA.length - 1), k = Math.min(Math.floor(s), RUTA.length - 2), r = s - k; return [RUTA[k][0] + (RUTA[k + 1][0] - RUTA[k][0]) * r, RUTA[k][1] + (RUTA[k + 1][1] - RUTA[k][1]) * r]; };

export const Diamir: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, d], [0.02, 0.92]);
  const m = Math.round(1100 * t / 0.92 / 10) * 10, h = 18 + Math.floor(8 * t / 0.92);
  const [x1, y1] = en(t), [x2a, y2] = en(Math.max(0, t - 0.06)); const x2 = x2a - 40;
  return (
    <Camara d={d} empuje={0.08} entrada={false}>
      <Svg>
        <CieloNoche id="di" />
        {/* la cara: pirámide gigante con bandas de roca, seracs y canales */}
        <path d="M-200 2100 L120 900 L420 380 L560 180 L720 420 L1000 860 L1300 2100 Z" fill={INV.nieveSS} />
        <path d="M560 180 L720 420 L1000 860 L1300 2100 L700 2100 L640 1200 Z" fill="#3A3F68" opacity={0.85} />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${60 + i * 30} ${980 + i * 120} Q${520} ${900 + i * 120 + random(`b${i}`) * 60} ${1020 - i * 10} ${980 + i * 125}`} stroke={INV.roca} strokeWidth={22 + random(`bw${i}`) * 20} fill="none" opacity={0.7} />)}
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={160 + random(`sx${i}`) * 760} y={700 + random(`sy${i}`) * 900} width={40 + random(`sw${i}`) * 60} height={24 + random(`sh${i}`) * 30} fill={INV.nieve} opacity={0.75} transform={`rotate(${-10 + random(`sr${i}`) * 20} 540 960)`} />)}
        <path d="M560 180 L620 260 L520 300 Z" fill={INV.nieve} />
        {/* estela de la subida */}
        <path d={"M" + Array.from({ length: 40 }).map((_, k) => en(t * k / 39).join(" ")).join(" L")} stroke={INV.luz} strokeWidth={4} strokeDasharray="2 14" fill="none" opacity={0.6} />
        {[[x1, y1], [x2, y2]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={70} fill={INV.luz} opacity={0.18} /><circle cx={x} cy={y} r={30} fill={INV.luz} opacity={0.35} /><circle cx={x} cy={y} r={13} fill="#FFF8DD" /></g>)}
        <Ventisca f={f} n={40} fuerza={0.8} />
        {/* contador y reloj */}
        <g transform="translate(80 1200)">
          <text x={0} y={0} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={170} fill="#FF6A1F" stroke="#05040C" strokeWidth={22} paintOrder="stroke">{m.toLocaleString("es-ES")} m</text>
          <text x={6} y={80} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={64} fill="#fff" stroke="#05040C" strokeWidth={12} paintOrder="stroke">{`${String(h % 24).padStart(2, "0")}:${String(Math.floor((f * 7) % 60)).padStart(2, "0")} · DE NOCHE`}</text>
        </g>
      </Svg>
    </Camara>
  );
};
