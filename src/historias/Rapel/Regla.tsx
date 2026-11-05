// 4 · La regla: el rapel mide 25 m; con la cuerda doblada cada brazo tiene que pasar de 25 m. Los dos extremos llevan nudo.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Anclaje, Chip, Cuerda, Nudo, Roca, Rotulo, Suelo, Svg, ei, type P, Camara } from "./comun";

const A = { x: 700, y: 560 }, SUELO = 1300;
export const Regla: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fBajar = pal("bajar,") ?? pal("bajar") ?? 20, fLlegue = pal("llegue.") ?? pal("llegue") ?? 70, fDob = pal("doblada,") ?? pal("doblada") ?? 150, fDoble = pal("doble") ?? 210, fNudo = pal("nudo") ?? 270, fExt = pal("extremos.") ?? pal("extremos") ?? 300;
  const cae = ei(f, fLlegue - 6, fLlegue + 18, 0, 1, Easing.in(Easing.quad));
  const doblada = ei(f, fDob - 4, fDob + 14, 0, 1);
  const largo = (SUELO - A.y - 20) * cae;
  const sobra = ei(f, fDoble, fDoble + 20, 0, 1);
  return (
    <Camara d={d} empuje={0.025} entrada={false}>
      <Svg>
        <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C1622" /><stop offset="1" stopColor="#1D3340" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#rg)" />
        <Roca y0={-100} y1={SUELO} x0={730} />
        <g transform="translate(540 950) scale(1.25) translate(-540 -950)">
        <Suelo y={SUELO} />
        <Anclaje x={A.x} y={A.y} />
        <Cuerda d={`M${A.x - 14} ${A.y + 20} L${A.x - 160} ${A.y + 20 + largo}`} w={12} />
        {doblada > 0 && <Cuerda d={`M${A.x + 10} ${A.y + 20} L${A.x - 60} ${A.y + 20 + largo + 40 * sobra}`} w={12} />}
        {sobra > 0 && <path d={`M${A.x - 60} ${SUELO + 20} q-30 40 -70 18 q-40 -20 -90 8`} stroke="#FF6A1F" strokeWidth={12} fill="none" strokeLinecap="round" opacity={sobra} />}
        <Nudo x={A.x - 160} y={SUELO - 6} k={ei(f, fNudo, fNudo + 8, 0, 1)} /><Nudo x={A.x - 60} y={SUELO + 28} k={ei(f, fExt, fExt + 8, 0, 1)} />
        {f > fBajar && <g opacity={ei(f, fBajar, fBajar + 10, 0, 1)}>
          <path d={`M300 ${A.y} L300 ${SUELO}`} stroke="#fff" strokeWidth={6} /><path d={`M280 ${A.y} L320 ${A.y} M280 ${SUELO} L320 ${SUELO}`} stroke="#fff" strokeWidth={6} />
          <Chip x={300} y={(A.y + SUELO) / 2} t="RAPEL 25 m" />
        </g>}
        </g>
        <Rotulo f={f} ini={fDoble} t="60 m > 2 × 25 m" y={250} tam={104} />
        {f > fLlegue + 18 && f < fDob && <Chip x={560} y={A.y + 20 + largo + 100} t="✓" col="#5FD1C5" o={ei(f, fLlegue + 18, fLlegue + 26, 0, 1)} />}
      </Svg>
    </Camara>
  );
};
