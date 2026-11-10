// Escena estrella: el disipador. Congelado justo tras llegar al anclaje («¿QUÉ TE FRENA?»); después la funda se abre,
// las costuras saltan una a una y la cinta blanca sale hasta ser mucho más larga que la bolsa. Marta baja con ella.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { FE, MARTA, Cielo, Montes, Cable, Mosqueton, Elastico, anilla, Etiqueta, Svg, clamp, golpe, type P } from "./comun";

const cableY = (x: number) => 330 - (x + 100) * 0.125;
const ANCLA = 300, S: [number, number] = [470, 560]; // anclaje del cable; giratorio donde se unen los brazos
const LMAX = 620, FW = 120, FH = 150, CW = 54; // extensión final, funda, ancho de cinta

const Pared: React.FC = () => (
  <g>
    <path d="M190 -200 L230 400 L170 900 L210 1500 L160 2300 L1300 2300 L1300 -200 Z" fill={FE.caliza} />
    <path d="M190 -200 L230 400 L170 900 L210 1500 L160 2300 L260 2300 L300 1500 L262 900 L318 400 L280 -200 Z" fill={FE.calizaS} />
    {Array.from({ length: 22 }).map((_, i) => { const x = 300 + random(`dx${i}`) * 900, y = -100 + random(`dy${i}`) * 2300; return <path key={i} d={`M${x} ${y} q${-20 + random(`dq${i}`) * 40} 70 ${6} ${120 + random(`dl${i}`) * 140}`} stroke={FE.calizaSS} strokeWidth={6} fill="none" opacity={0.5} />; })}
  </g>
);

/** Cinta desplegada entre y0 y y1: blanca, con barras negras y costuras rotas (agujeritos) en los bordes. */
const CintaAbierta: React.FC<{ x: number; y0: number; y1: number }> = ({ x, y0, y1 }) => {
  const n = Math.max(0, Math.floor((y1 - y0) / 34));
  return (
    <g>
      <rect x={x - CW / 2 - 3} y={y0} width={CW + 6} height={Math.max(0, y1 - y0)} fill={FE.cintaS} />
      <rect x={x - CW / 2} y={y0} width={CW} height={Math.max(0, y1 - y0)} fill={FE.cinta} />
      {Array.from({ length: n }).map((_, i) => { const y = y0 + 14 + i * 34; return (
        <g key={i}>
          <rect x={x - CW / 2 + 8} y={y} width={CW - 16} height={i % 3 === 1 ? 10 : 5} fill="#1E232B" />
          {[-1, 1].map((sd) => <circle key={sd} cx={x + sd * (CW / 2 - 4)} cy={y + 16} r={2.4} fill="#8B9089" />)}
          {[-1, 1].map((sd) => <path key={`h${sd}`} d={`M${x + sd * (CW / 2)} ${y + 6} l${sd * (5 + random(`h${i}${sd}`) * 6)} ${4}`} stroke={FE.cinta} strokeWidth={2.5} />)}
        </g>); })}
    </g>
  );
};

/** Funda del disipador con la cinta plegada dentro. p = parte ya desplegada (0–1). */
const Funda: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  const abierta = p > 0, pl = Math.round(9 * (1 - p));
  return (
    <g>
      {abierta && Array.from({ length: pl }).map((_, i) => <path key={i} d={`M${x - CW / 2} ${y + 14 + i * 12} L${x + CW / 2} ${y + 20 + i * 12}`} stroke={i % 2 ? FE.cintaS : FE.cinta} strokeWidth={9} />)}
      <path d={`M${x - FW / 2} ${y + (abierta ? 18 : 0)} ${abierta ? `L${x - FW / 2 + 16} ${y + 4} L${x - 20} ${y + 22} L${x + 4} ${y + 2} L${x + 26} ${y + 20} L${x + FW / 2} ${y + 6}` : `Q${x} ${y - 16} ${x + FW / 2} ${y}`} L${x + FW / 2 - 6} ${y + FH} Q${x} ${y + FH + 18} ${x - FW / 2 + 6} ${y + FH} Z`}
        fill={FE.funda} stroke="#11151B" strokeWidth={4} opacity={abierta ? 0.96 : 1} />
      <path d={`M${x - FW / 2 + 16} ${y + 26} L${x + FW / 2 - 18} ${y + 26} L${x + FW / 2 - 22} ${y + FH - 14} L${x - FW / 2 + 20} ${y + FH - 14} Z`} fill="none" stroke={FE.fundaS} strokeWidth={4} strokeDasharray="10 8" />
      {abierta && <path d={`M${x - 18} ${y + 22} q-26 -30 -54 -16`} stroke={FE.fundaS} strokeWidth={9} fill="none" strokeLinecap="round" />}
      <rect x={x - 22} y={y + FH + 4} width={44} height={44} rx={16} fill="none" stroke={FE.cintaS} strokeWidth={11} />
    </g>
  );
};

/** Fibras y costuras que saltan al salir la cinta (sale en (x,y) mientras la velocidad > 0). */
const Chispas: React.FC<{ x: number; y: number; f: number; f0: number; f1: number }> = ({ x, y, f, f0, f1 }) => (
  <g>{Array.from({ length: 60 }).map((_, i) => {
    const tn = f0 + (i / 60) ** 1.8 * (f1 - f0), a = f - tn;
    if (a < 0 || a > 14) return null;
    const ang = (-160 + random(`ca${i}`) * 140) * (Math.PI / 180), v = 7 + random(`cv${i}`) * 9;
    const px = x + (random(`cs${i}`) > 0.5 ? CW / 2 : -CW / 2) + Math.cos(ang) * v * a * (random(`cs${i}`) > 0.5 ? 1 : -1), py = y + Math.sin(ang) * v * a * 0.6 + 0.5 * a * a;
    return <path key={i} d={`M${px} ${py} l${6 + random(`cl${i}`) * 8} ${-3 + random(`cm${i}`) * 6}`} stroke={i % 3 ? "#FFFFFF" : "#1E232B"} strokeWidth={3.5} strokeLinecap="round" opacity={1 - a / 14} />;
  })}</g>
);

export const Disipador: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const F0 = 30, F1 = F0 + Math.min(150, d - F0 - 40);
  const p = interpolate(f, [F0, F1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const L = 16 + p * LMAX, top = S[1] + 14 + L; // la funda baja con el arnés; la cinta sale por arriba
  const sw = f > F1 ? Math.sin((f - F1) / 9) * 6 * Math.exp(-(f - F1) / 40) : 0;
  const rot = 16 + sw, ring: [number, number] = [S[0], top + FH + 30];
  const off = anilla(0, 0, 1.9, 6, rot, -1), hip: [number, number] = [ring[0] - off[0], ring[1] - off[1]];
  const cara = f < F0 ? "miedo" : p < 0.9 ? "dolor" : "serio";
  const z = interpolate(f, [0, F0, F1], [1.32, 1.32, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = S[0], cy = interpolate(f, [0, F1], [S[1] + 120, 900], clamp), sy = golpe(f, F0, 10);
  const ghost = interpolate(f, [F1 - 10, F1 + 10], [0, 1], clamp);
  return (
    <>
      <Svg>
        <g transform={`translate(${cx} ${cy + sy}) scale(${z}) translate(${-cx} ${-cy})`}>
          <Cielo id="dis" /><Montes y={1300} seed="dism" /><path d="M-300 1500 Q200 1460 400 1520 L400 2300 L-300 2300 Z" fill={FE.valle} />
          <Pared />
          <Cable d={`M-100 ${cableY(-100)} L1180 ${cableY(1180)}`} w={11} />
          <g><rect x={ANCLA - 26} y={cableY(ANCLA) - 22} width={52} height={60} rx={10} fill={FE.aceroS} /><circle cx={ANCLA} cy={cableY(ANCLA)} r={13} fill={FE.aceroL} stroke={FE.aceroS} strokeWidth={4} /></g>
          {[ANCLA + 46, ANCLA + 86].map((x, i) => <Mosqueton key={i} x={x} y={cableY(x) - 6} ang={-6 + i * 4} s={1.05} />)}
          <Elastico a={S} b={[ANCLA + 50, cableY(ANCLA + 46) + 118]} w={20} tension={1} />
          <Elastico a={S} b={[ANCLA + 92, cableY(ANCLA + 86) + 118]} w={20} tension={1} />
          <circle cx={S[0]} cy={S[1]} r={16} fill={FE.aceroS} /><circle cx={S[0]} cy={S[1]} r={8} fill={FE.aceroL} />
          {ghost > 0 && <g opacity={ghost * 0.9}>
            <rect x={S[0] - FW / 2 - 14} y={S[1] + 30} width={FW + 28} height={FH} rx={20} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="14 12" />
            <path d={`M${S[0] + FW / 2 + 40} ${S[1] + 30} L${S[0] + FW / 2 + 56} ${S[1] + 30} L${S[0] + FW / 2 + 56} ${top} L${S[0] + FW / 2 + 40} ${top}`} stroke="#fff" strokeWidth={6} fill="none" />
          </g>}
          <Escalador x={hip[0]} y={hip[1]} quien="simon" mira={-1} rot={rot} s={1.9} cara={cara} aspecto={MARTA} angulos={{ torso: 6, cabeza: -10, brazoA: [150, 178], brazoB: [-30, -10], piernaA: [14, -4], piernaB: [-4, -10] }} />
          <CintaAbierta x={S[0]} y0={S[1] + 12} y1={top + 8} />
          <Funda x={S[0]} y={top} p={p} />
          {f >= F0 && f <= F1 + 14 && <Chispas x={S[0]} y={top + 6} f={f} f0={F0} f1={F1} />}
          {f < F0 && <rect x={-400} y={-600} width={1880} height={3200} fill="#16263C" opacity={0.38} />}
        </g>
      </Svg>
      <Etiqueta texto={f < F0 ? "¿QUÉ TE FRENA?" : undefined} desde={f < F0 ? 2 : F1} top={300} tam={f < F0 ? 104 : 80} />
    </>
  );
};
