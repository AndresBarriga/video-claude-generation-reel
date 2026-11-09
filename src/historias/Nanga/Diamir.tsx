// 5 · La cara del Diamir a escala enorme: dos frontales diminutas suben de noche dejando estela; contador de metros y reloj.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, INV, Svg, Ventisca, type P } from "./comun";

const RUTA: [number, number][] = [[600, 1820], [640, 1600], [560, 1400], [620, 1200], [540, 1000], [600, 820]];
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
        {/* el macizo: base ancha, varias cimas, gran cara de nieve con espolones de roca (no una torre) */}
        <path d="M-200 2100 L-200 1150 L80 900 L230 760 L330 640 L450 470 L560 330 L640 380 L720 300 L830 470 L960 600 L1280 820 L1280 2100 Z" fill={INV.nieveSS} />
        <path d="M720 300 L830 470 L960 600 L1280 820 L1280 2100 L820 2100 L760 1200 Z" fill="#3A3F68" opacity={0.75} />
        <path d="M-200 1150 L80 900 L230 760 L330 640 L300 1300 L-200 1700 Z" fill="#3A3F68" opacity={0.55} />
        {[[560, 330, 380, 1900], [560, 330, 700, 1900], [450, 470, 200, 1500], [720, 300, 900, 1400], [640, 380, 560, 1700]].map(([x0, y0, x1, y1], i) => <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2 + (i % 2 ? 40 : -40)} ${(y0 + y1) / 2} ${x1} ${y1}`} stroke={INV.roca} strokeWidth={26 - i * 2} fill="none" opacity={0.75} strokeLinecap="round" />)}
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${120 + i * 140} ${1020 + (i % 3) * 40} l70 -14 l14 46 l-76 16 Z`} fill={INV.nieve} opacity={0.6} />)}
        <path d="M560 330 L600 390 L520 410 Z M720 300 L760 360 L690 360 Z" fill={INV.nieve} />
        <path d="M-200 1900 Q540 1780 1280 1900 L1280 2100 L-200 2100 Z" fill={INV.nieve} opacity={0.6} />
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
