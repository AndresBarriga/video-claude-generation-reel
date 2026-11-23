// E77 · razón 3: el grado no se mide, se opina; lo pone quien equipa; en escuelas clásicas suele ser más duro (6a de entonces = 6b de hoy).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c01, pop, COL, F, T, Razones, Etiq, Grande, type P } from "./comun";

const Croquis: React.FC<{ viejo: number; tacha: number; nuevo: number }> = ({ viejo, tacha, nuevo }) => (
  <svg viewBox="0 0 600 760" width={600} height={760} style={{ filter: `sepia(${viejo * 0.9}) contrast(${1 - viejo * 0.1})` }}>
    <rect x={10} y={10} width={580} height={740} rx={18} fill="#FFFDF5" stroke={T} strokeWidth={10} />
    <path d="M300 700 Q250 560 320 430 Q380 300 290 120" stroke={COL.rojo} strokeWidth={10} strokeDasharray="22 14" fill="none" />
    {[[290, 610], [330, 470], [345, 330], [300, 190]].map(([x, y], i) => <text key={i} x={x + 22} y={y} fontFamily={F} fontWeight={900} fontSize={42} fill={T}>×</text>)}
    <text x={70} y={130} fontFamily={F} fontWeight={700} fontSize={140} fill={T}>6a</text>
    {tacha > 0 && <path d={`M60 95 L${60 + 170 * tacha} 70`} stroke={COL.rojo} strokeWidth={16} strokeLinecap="round" />}
    {nuevo > 0 && <text x={120} y={260} fontFamily={F} fontWeight={700} fontSize={150 * nuevo} fill={COL.rojo}>6b</text>}
    {viejo > 0.3 && <g opacity={viejo}><circle cx={470} cy={640} r={80} fill="none" stroke="#9A6B3A" strokeWidth={8} /><text x={470} y={655} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#9A6B3A">1985</text></g>}
  </svg>
);
export const Tres: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fM = pal("mide") ?? 30, fO = pal("opina") ?? 50, fE = pal("equipa") ?? 80, fC = pal("clasicas") ?? 170, fD = pal("duros") ?? 230, fH = pal("hoy") ?? 300;
  const card = pop(f - fE + 4), viejo = c01((f - fC) / 12), tacha = c01((f - fD) / 8), nuevo = pop(f - fH + 8);
  return (
    <AbsoluteFill style={{ background: "#FDF3E3" }}>
      {f < fE - 4 && <>
        <Grande t={"EL GRADO\nNO SE MIDE"} top={600} k={f + 8} tam={104} fondo={COL.crema} />
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          {pop(f - fM + 4) > 0 && <g transform={`translate(540 1060) scale(${pop(f - fM + 4)})`}><rect x={-300} y={-50} width={600} height={100} rx={12} fill={COL.amarillo} stroke={T} strokeWidth={8} />{Array.from({ length: 13 }).map((_, i) => <path key={i} d={`M${-270 + i * 45} -50 v${i % 2 ? 30 : 50}`} stroke={T} strokeWidth={6} />)}<path d="M-320 -120 L320 120 M320 -120 L-320 120" stroke={COL.rojo} strokeWidth={26} strokeLinecap="round" opacity={c01((f - fO + 4) / 6)} /></g>}
        </svg>
        <Grande t="SE OPINA 💬" top={1260} k={f - fO + 2} tam={110} fondo={COL.verde} color="#fff" />
      </>}
      {card > 0 && <div style={{ position: "absolute", left: 240, top: 620, transform: `scale(${card}) rotate(${-3 + viejo * 2}deg)` }}><Croquis viejo={viejo} tacha={tacha} nuevo={nuevo} /></div>}
      <Etiq t="LO PONE QUIEN EQUIPA" x={540} y={560} k={f - fE} fondo={COL.amarillo} />
      <Etiq t="ESCUELA CLÁSICA" x={540} y={1460} k={f - fC} fondo="#C79A62" color="#fff" />
      <Etiq t="SUELE SER MÁS DURO" x={540} y={1570} k={f - fD} fondo={COL.rojo} color="#fff" />
      <Razones actual={3} revela={f >= 2} top={1700} k={99} />
    </AbsoluteFill>
  );
};

