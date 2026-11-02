// 3 · Fase 3 (12,1–16,2 s): «duro como una piedra. Y late.» El otro puño golpea el antebrazo y el antebrazo no cede.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { BR, Cabeza, Camara, Fondo, P, Rotulo, Svg, BLOQUES, ei } from "./comun";

const T = "#141B26";
const Puno: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-56} y={-130} width={112} height={110} rx={34} fill="#2E7D8C" stroke={T} strokeWidth={8} />
    <rect x={-62} y={-30} width={124} height={92} rx={40} fill="#D9A37A" stroke={T} strokeWidth={8} />
    {[-30, 0, 30].map((dx) => <path key={dx} d={`M${dx - 2} ${-12} q0 ${-12} 0 ${-12}`} stroke="#B8845E" strokeWidth={6} strokeLinecap="round" fill="none" />)}
    <path d="M-40 30 q40 14 80 0" stroke="#B8845E" strokeWidth={6} strokeLinecap="round" fill="none" />
  </g>
);

export const Fase3: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fDuro = pal("duro") ?? 28, fPiedra = pal("piedra") ?? 60, fLate = pal("late") ?? 92;
  const bomba = ei(f, fDuro, fPiedra + 10, 0.32, 0.78);
  const golpe = (t0: number) => { const k = f - t0; return k < -10 ? 0 : k < 0 ? ei(f, t0 - 10, t0, 0, 1) : ei(f, t0, t0 + 8, 1, 0); };
  const g1 = golpe(fPiedra), g2 = golpe(fPiedra + 14), g = Math.max(g1, g2);
    const latido = f >= fLate ? Math.max(0, Math.sin((f - fLate) * 0.55)) : 0;
  return (
    <Camara d={d} empuje={0.04} foco="52% 50%">
      <Svg>
        <Fondo />
        <Brazo {...BR} f={f} bomba={bomba} calor={0.75} latido={latido} dy={g > 0.9 ? 3 : 0} polvo={0.45} />
        {g > 0 && <Puno x={262 + (1 - g) * -70} y={846 + (1 - g) * -130} rot={-14} />}
        {g > 0.85 && [0, 1, 2].map((i) => <path key={i} d={`M${352 + i * 22} ${812 - i * 16} l${30} ${-16}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" />)}
        <Cabeza x={170} y={470} cara={f < fLate ? "esfuerzo" : "dolor"} aro={BLOQUES[2]} />
        <Rotulo f={f} ini={0} t="FASE 3" y={250} tam={128} col={BLOQUES[2]} />
      </Svg>
    </Camara>
  );
};
