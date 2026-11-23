// E77 · razón 2: cada roca se escala distinto (caliza: regletas y agujeros · granito: adherencia y fisuras · conglomerado: bolos) y tú vienes de la resina.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { cl, pop, COL, T, Razones, Etiq, Grande, type P } from "./comun";

const Caliza: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#E6D6B8" />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${80 + i * 150} 0 q${random(`ct${i}`) * 60 - 30} 960 0 1920`} stroke={i % 2 ? "#C9B38E" : "#A9B0B8"} strokeWidth={30 + random(`cw${i}`) * 40} opacity={0.45} fill="none" />)}
    <path d="M180 900 Q540 850 900 905 L880 935 Q540 890 200 930 Z" fill="#B89E77" stroke={T} strokeWidth={8} />
    <path d="M200 930 Q540 895 880 935" stroke="#7A6448" strokeWidth={10} fill="none" />
    {[[330, 1180, 70], [680, 1260, 56], [520, 1430, 46]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill="#5E4B36" stroke={T} strokeWidth={8} /><ellipse cx={x} cy={y - r * 0.25} rx={r * 0.7} ry={r * 0.35} fill="#2E241A" /></g>)}
  </g>
);
const Granito: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#C8C4BD" />
    {Array.from({ length: 420 }).map((_, i) => <circle key={i} cx={random(`gx${i}`) * 1080} cy={random(`gy${i}`) * 1920} r={2 + random(`gr${i}`) * 5} fill={["#3B3B3B", "#FFFFFF", "#D9A3A0"][i % 3]} opacity={0.7} />)}
    <path d="M700 520 L640 760 L690 980 L620 1250 L660 1520" stroke="#2B2B2B" strokeWidth={34} fill="none" strokeLinejoin="round" />
    <path d="M700 520 L640 760 L690 980 L620 1250 L660 1520" stroke="#6A6A6A" strokeWidth={10} fill="none" transform="translate(16 0)" strokeLinejoin="round" />
    <g transform="translate(300 1240) rotate(-12)"><path d="M-130 30 Q-130 -40 -40 -40 H60 Q140 -40 150 30 Q150 70 100 70 H-90 Q-130 70 -130 30 Z" fill={COL.lila} stroke={T} strokeWidth={9} /><path d="M-130 52 H150" stroke={T} strokeWidth={14} /></g>
    <path d="M220 1330 Q300 1360 400 1320" stroke="#fff" strokeWidth={8} strokeDasharray="10 12" fill="none" />
  </g>
);
const Conglo: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#B98E66" />
    {Array.from({ length: 70 }).map((_, i) => { const x = random(`bx${i}`) * 1080, y = random(`by${i}`) * 1920, r = 18 + random(`br${i}`) * 50; return <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill={["#D9C7AA", "#8C7B6A", "#C7A07A", "#A99C8C"][i % 4]} stroke="#5A4330" strokeWidth={5} /><ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.3} ry={r * 0.18} fill="#fff" opacity={0.4} /></g>; })}
    <g><ellipse cx={540} cy={1000} rx={120} ry={95} fill="#D9C7AA" stroke={T} strokeWidth={10} /><ellipse cx={500} cy={960} rx={40} ry={22} fill="#fff" opacity={0.5} /></g>
  </g>
);
const Resina: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#FFFDF8" />
    {[[260, 820, COL.rosa], [760, 700, COL.amarillo], [420, 1140, COL.menta], [800, 1320, COL.lila], [300, 1500, COL.azul]].map(([x, y, c], i) => <path key={i} d={`M${x as number - 90} ${y} q90 -110 180 0 q-90 50 -180 0 Z`} fill={c as string} stroke={T} strokeWidth={9} />)}
    <path d="M560 600 l260 -120 l40 260 Z" fill={COL.naranja} opacity={0.8} stroke={T} strokeWidth={8} />
  </g>
);
const CARTAS = [Caliza, Granito, Conglo, Resina];
const Carta: React.FC<{ i: number; k: number }> = ({ i, k }) => {
  const C = CARTAS[i], x = interpolate(k, [0, 8], [1080, 0], cl), z = 1 + k * 0.0012;
  return <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${z})` }}><svg viewBox="0 0 1080 1920" width={1080} height={1920}><C /></svg></AbsoluteFill>;
};
export const Dos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fs = [pal("caliza") ?? 60, pal("granito") ?? 140, pal("conglomerado") ?? 210, pal("resina") ?? 280].map((v) => v - 6);
  const i = fs.filter((v) => f >= v).length - 1;
  return (
    <>
      <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>{[Caliza, Granito, Conglo].map((C, j) => <div key={j} style={{ flex: 1, overflow: "hidden" }}><svg viewBox="360 0 360 1920" width={360} height={1920}><C /></svg></div>)}</AbsoluteFill>
      {i < 0 && <Grande t={"CADA ROCA,\nOTRO DEPORTE"} top={1120} k={f + 6} tam={96} />}
      {i >= 1 && <Carta i={i - 1} k={99} />}
      {i >= 0 && <Carta i={i} k={f - fs[i]} />}
      {i === 0 && <><Grande t="CALIZA" top={560} k={f - fs[0]} tam={100} /><Etiq t="REGLETA" x={540} y={1010} k={f - fs[0] - 8} /><Etiq t="AGUJEROS" x={540} y={1560} k={f - fs[0] - 16} /></>}
      {i === 1 && <><Grande t="GRANITO" top={560} k={f - fs[1]} tam={100} /><Etiq t="FISURA" x={820} y={860} k={f - fs[1] - 8} /><Etiq t="ADHERENCIA" x={320} y={1440} k={f - fs[1] - 14} /></>}
      {i === 2 && <><Grande t="CONGLOMERADO" top={560} k={f - fs[2]} tam={92} /><Etiq t="BOLOS" x={540} y={1160} k={f - fs[2] - 8} tam={60} /></>}
      {i === 3 && <><Grande t={"TÚ VIENES\nDE LA RESINA"} top={1180} k={f - fs[3]} tam={92} fondo={COL.rosa} color="#fff" /></>}
      <Razones actual={2} top={1700} k={99} />
    </>
  );
};
