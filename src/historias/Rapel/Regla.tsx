// 4 · La regla: hay 25 m entre reuniones; con la cuerda doblada cada brazo tiene que pasar de 25 m y llegar a la reunión de abajo.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Anclaje, Chip, Cuerda, Roca, Rotulo, Svg, ei, type P, Camara } from "./comun";

const A = { x: 700, y: 520 }, B = { x: 700, y: 1260 };
export const Regla: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fBajar = pal("bajar") ?? 20, fReu = pal("reunión") ?? 70, fDob = pal("doblada") ?? 150, fDoble = pal("doble") ?? 210;
  const cae = ei(f, fReu - 30, fReu + 8, 0, 1, Easing.in(Easing.quad)), doblada = ei(f, fDob - 4, fDob + 14, 0, 1), sobra = ei(f, fDoble, fDoble + 20, 0, 1);
  const largo = (B.y - A.y + 20) * cae, pulso = f > fReu ? 1 + 0.1 * Math.sin((f - fReu) * 0.4) : 1;
  return (
    <Camara d={d} empuje={0.025} entrada={false}>
      <Svg>
        <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C1622" /><stop offset="1" stopColor="#1D3340" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#rg)" />
        <g transform="translate(540 900) scale(1.2) translate(-540 -900)">
          <Roca y0={-100} y1={1700} x0={730} />
          <rect x={400} y={B.y + 30} width={340} height={44} rx={12} fill="#52667A" stroke="#0B1624" strokeWidth={6} />
          <Anclaje x={A.x} y={A.y} /><Anclaje x={B.x} y={B.y} />
          <Cuerda d={`M${A.x - 14} ${A.y + 20} L${A.x - 170} ${A.y + 20 + largo}`} w={12} />
          {doblada > 0 && <Cuerda d={`M${A.x + 10} ${A.y + 20} L${A.x - 80} ${A.y + 20 + largo + 24 * sobra}`} w={12} />}
          {sobra > 0 && <path d={`M${A.x - 80} ${B.y + 34} q-30 30 -60 8 q-34 -18 -74 4`} stroke="#FF6A1F" strokeWidth={12} fill="none" strokeLinecap="round" opacity={sobra} />}
          {f > fBajar && <g opacity={ei(f, fBajar, fBajar + 10, 0, 1)}>
            <path d={`M290 ${A.y} L290 ${B.y}`} stroke="#fff" strokeWidth={6} /><path d={`M270 ${A.y} L310 ${A.y} M270 ${B.y} L310 ${B.y}`} stroke="#fff" strokeWidth={6} />
            <Chip x={290} y={(A.y + B.y) / 2} t="25 m" />
          </g>}
          {f > fReu && <circle cx={B.x} cy={B.y} r={54 * pulso} fill="none" stroke="#5FD1C5" strokeWidth={6} strokeDasharray="8 12" opacity={ei(f, fReu, fReu + 8, 0, 1)} />}
        </g>
        <Chip x={870} y={A.y + 110} t="REUNIÓN" o={ei(f, fBajar, fBajar + 10, 0, 1)} />
        <Chip x={870} y={B.y + 100} t="REUNIÓN" o={ei(f, fReu, fReu + 10, 0, 1)} col="#5FD1C5" />
        <Rotulo f={f} ini={fDoble} t="60 m > 2 × 25 m" y={250} tam={104} />
      </Svg>
    </Camara>
  );
};
