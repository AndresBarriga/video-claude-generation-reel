// Escena estrella, primer plano de perfil a escala real (1 m = 520 px). Sigue al congelado de la caída: mosquetones
// apoyados en el anclaje, brazos tensos (~90 cm). La funda se abre por arriba, las costuras saltan y la cinta sale
// ~0,8 m: el arnés (y Marta) bajan con ella. Al final, contorno de dónde estaba la funda: mucho más largo que antes.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { MARTA, Svg, clamp, golpe, anilla, type P } from "./comun";
import { Cielo, Cordillera, Bruma, CIELO } from "./paisaje";
import { Roca, CableE, MosqE, BrazoE, Anclaje, pieMosq, sPersona, M } from "./roca";

const PM = 520, SP = sPersona(PM), h = "tarde" as const;
const CX = 800, ANC = 230, GIRO: [number, number] = [668, ANC + 0.9 * PM * 0.92]; // cable, anclaje, giratorio
const FL = M.fundaL * PM, FA = M.fundaA * PM, CW = M.cinta * PM, LMAX = 0.8 * PM;

const Cinta: React.FC<{ x: number; y0: number; y1: number }> = ({ x, y0, y1 }) => {
  const n = Math.max(0, Math.floor((y1 - y0) / (0.04 * PM)));
  return (
    <g>
      <rect x={x - CW / 2 - 2} y={y0} width={CW + 4} height={Math.max(0, y1 - y0)} fill="#BFC4BD" />
      <rect x={x - CW / 2} y={y0} width={CW} height={Math.max(0, y1 - y0)} fill="#F4F5F2" />
      {Array.from({ length: n }).map((_, i) => { const y = y0 + 8 + i * 0.04 * PM; return (
        <g key={i}><rect x={x - CW / 2 + 4} y={y} width={CW - 8} height={i % 4 === 2 ? 6 : 3} fill="#1E232B" />
          {[-1, 1].map((sd) => <path key={sd} d={`M${x + sd * CW / 2} ${y + 6} l${sd * (3 + random(`fi${i}${sd}`) * 7)} ${2 + random(`fj${i}${sd}`) * 4}`} stroke="#F4F5F2" strokeWidth={1.6} />)}</g>); })}
    </g>
  );
};

const Funda: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  const ab = p > 0.01, plieg = Math.round(7 * (1 - p));
  return (
    <g>
      {ab && Array.from({ length: plieg }).map((_, i) => <path key={i} d={`M${x - CW / 2} ${y + 8 + i * 8} L${x + CW / 2} ${y + 12 + i * 8}`} stroke={i % 2 ? "#C9CDC7" : "#F4F5F2"} strokeWidth={6} />)}
      <path d={`M${x - FA / 2} ${y + (ab ? 10 : 0)} ${ab ? `L${x - FA / 4} ${y + 2} L${x - 4} ${y + 12} L${x + FA / 4} ${y} L${x + FA / 2} ${y + 9}` : `Q${x} ${y - 10} ${x + FA / 2} ${y}`} L${x + FA / 2 - 3} ${y + FL} Q${x} ${y + FL + 10} ${x - FA / 2 + 3} ${y + FL} Z`} fill="#262B33" stroke="#11151B" strokeWidth={3} />
      <path d={`M${x - FA / 2 + 8} ${y + 16} L${x + FA / 2 - 8} ${y + 16} L${x + FA / 2 - 10} ${y + FL - 10} L${x - FA / 2 + 10} ${y + FL - 10} Z`} fill="none" stroke="#4A525E" strokeWidth={2.5} strokeDasharray="7 6" />
      {ab && <path d={`M${x - 6} ${y + 10} q-14 -20 -34 -10`} stroke="#3A414C" strokeWidth={6} fill="none" strokeLinecap="round" />}
      <rect x={x - 14} y={y + FL + 2} width={28} height={36} rx={12} fill="none" stroke="#C9CDC7" strokeWidth={8} />
    </g>
  );
};

const Fibras: React.FC<{ x: number; y: number; f: number; f0: number; f1: number }> = ({ x, y, f, f0, f1 }) => (
  <g>{Array.from({ length: 70 }).map((_, i) => {
    const tn = f0 + (i / 70) ** 1.7 * (f1 - f0), a = f - tn;
    if (a < 0 || a > 12) return null;
    const lado = random(`fl${i}`) > 0.5 ? 1 : -1, v = 5 + random(`fv${i}`) * 8, ang = (-30 - random(`fa${i}`) * 80) * (Math.PI / 180);
    return <path key={i} d={`M${x + lado * (CW / 2 + Math.cos(ang) * v * a)} ${y + Math.sin(ang) * v * a + 0.6 * a * a} l${lado * (4 + random(`fw${i}`) * 6)} ${-2 + random(`fz${i}`) * 4}`} stroke={i % 3 ? "#FFFFFF" : "#1E232B"} strokeWidth={2.5} strokeLinecap="round" opacity={1 - a / 12} />;
  })}</g>
);

export const Disipador: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const F0 = 16, F1 = F0 + Math.min(110, d - F0 - 40);
  const p = interpolate(f, [F0, F1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const top = GIRO[1] + 14 + p * LMAX, ring: [number, number] = [GIRO[0], top + FL + 34];
  const sw = f > F1 ? Math.sin((f - F1) / 8) * 3 * Math.exp(-(f - F1) / 35) : 0;
  const o = anilla(0, 0, SP, -26), hip: [number, number] = [ring[0] - o[0] + sw * 4, ring[1] - o[1]];
  const cara = f < F0 ? "miedo" : p < 0.92 ? "dolor" : "serio";
  const z = interpolate(f, [0, F0, F1], [1.25, 1.25, 0.82], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fy = interpolate(f, [0, F0, F1], [GIRO[1] + 60, GIRO[1] + 60, 860], { ...clamp, easing: Easing.inOut(Easing.cubic) }), sy = golpe(f, F0, 8);
  const fantasma = interpolate(f, [F1 - 6, F1 + 12], [0, 1], clamp), y0 = GIRO[1] + 14;
  return (
    <Svg>
      <g transform={`translate(540 ${960 + sy}) scale(${1 + (z - 1) * 0.1}) translate(-540 ${-(960 + (fy - 960) * 0.1)})`}>
        <Cielo h={h} id="dis" sol={[120, 360]} r={44} />
        <Cordillera id="diA" y={1400} amp={900} color="#6A79A6" h={h} lejos={0.55} nieve={0.33} picos={2} x1={1100} />
        <Bruma y={1200} alto={500} color={CIELO[h].bruma} id="di1" o={0.6} />
      </g>
      <g transform={`translate(540 ${960 + sy}) scale(${z}) translate(${-600} ${-fy})`}>
        <Roca id="diR" h={h} pm={PM} tono="#CDBFA9" d={`M${CX + 18} -800 L${CX + 30} 300 L${CX + 14} 900 L${CX + 26} 1600 L${CX + 10} 2800 L2200 2800 L2200 -800 Z`} />
        <CableE d={`M${CX} -800 L${CX} 2800`} pm={PM} />
        <Anclaje x={CX} y={ANC + 0.11 * PM} pm={PM} />
        <BrazoE a={GIRO} b={pieMosq(CX - 6, ANC - 0.02 * PM, PM)} pm={PM} tension={1} />
        <BrazoE a={GIRO} b={pieMosq(CX + 4, ANC, PM)} pm={PM} tension={1} />
        <MosqE x={CX - 6} y={ANC - 0.02 * PM} pm={PM} ang={-6} /><MosqE x={CX + 4} y={ANC} pm={PM} ang={5} />
        <Escalador x={hip[0]} y={hip[1]} quien="simon" s={SP} cara={cara} aspecto={MARTA} mochila
          angulos={{ torso: -26, cabeza: -14, brazoA: [150, 176], brazoB: [-60, -30], piernaA: [40, -10], piernaB: [10, -20] }} />
        {fantasma > 0 && <g opacity={fantasma}>
          <rect x={GIRO[0] - FA / 2 - 10} y={y0 - 4} width={FA + 20} height={FL + 8} rx={14} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="12 10" />
          <path d={`M${GIRO[0] + FA / 2 + 30} ${y0} l12 0 L${GIRO[0] + FA / 2 + 42} ${top} l-12 0`} stroke="#fff" strokeWidth={5} fill="none" />
        </g>}
        <Cinta x={GIRO[0]} y0={GIRO[1] + 8} y1={top + 6} />
        <circle cx={GIRO[0]} cy={GIRO[1]} r={12} fill="#5B6573" /><circle cx={GIRO[0]} cy={GIRO[1]} r={6} fill="#C3CCD6" />
        <Funda x={GIRO[0]} y={top} p={p} />
        {f >= F0 && f <= F1 + 12 && <Fibras x={GIRO[0]} y={top + 4} f={f} f0={F0} f1={F1} />}
      </g>
      {f < F0 && <rect x={0} y={0} width={1080} height={1920} fill="#14233A" opacity={0.32} />}
    </Svg>
  );
};
