// Él escalando sin cuerda, pegado a la roca. Manos, pies, presas y regletes se colocan con el esqueleto (IK), no a ojo.
// Bucle de 2 s: la mano de atrás baja a la bolsa (nube de magnesio) y sube a la siguiente presa; la de delante va metida en la grieta.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Contador, Etiqueta, Granito, Pino, PH, Svg } from "./comun";

const S = 2.6, HX = 360, HY = 960, TORSO = 14;
const K = CUERPO_H.cuerpo.brazos, L1 = 52 * K, L2 = 50 * K;
const rad = (g: number) => (g * Math.PI) / 180;
const HOMBRO: [number, number] = [Math.sin(rad(180 - TORSO)) * 88, Math.cos(rad(180 - TORSO)) * 88];
const alcanza = (t: [number, number], codo = 1): [number, number] => {
  const dx = t[0] - HOMBRO[0], dy = t[1] - HOMBRO[1], d = Math.min(L1 + L2 - 1, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), a = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)), a1 = base + codo * a;
  const ex = HOMBRO[0] + Math.sin(a1) * L1, ey = HOMBRO[1] + Math.cos(a1) * L1;
  return [(a1 * 180) / Math.PI, (Math.atan2(t[0] - ex, t[1] - ey) * 180) / Math.PI];
};
const W = (p: [number, number]): [number, number] => [HX + p[0] * S, HY + p[1] * S]; // relativo a la cadera → pantalla
const PIE_A: [number, number] = [84, 41], PIE_B: [number, number] = [84, 102]; // puntas (pierna alta flexionada / baja extendida)
const X0 = HX + 86 * S; // canto de la pared
const GRIETA: [number, number] = [96, -108], PRESA: [number, number] = [90, -196], BOLSA: [number, number] = [-30, -32];

export const PlanoGancho: React.FC<{ d: number; titulo?: string; desde?: number; hasta?: number; nota?: string }> = ({ d, titulo, desde, hasta, nota }) => {
  const f = useCurrentFrame();
  const c = f % 60, cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const aBolsa = interpolate(c, [0, 10, 18, 32], [0, 1, 1, 0], cl);
  const manoB: [number, number] = [PRESA[0] + (BOLSA[0] - PRESA[0]) * aBolsa, PRESA[1] + (BOLSA[1] - PRESA[1]) * aBolsa];
  const nube = interpolate(c, [12, 30], [0, 1], cl);
  const m = interpolate(f, [0, d], [desde ?? 3, hasta ?? 9]);
  const g = W(GRIETA), p = W(PRESA), pa = W(PIE_A), pb = W(PIE_B), b = W(BOLSA);
  return (
    <Camara d={d} empuje={0.06} foco="45% 50%">
      <Svg>
        <Cielo />
        {/* altura: horizonte bajo, sierra lejana, valle diminuto y neblina azulada */}
        <path d="M-200 1560 L80 1500 L240 1540 L420 1480 L600 1530 L760 1490 L1300 1560 L1300 2000 L-200 2000 Z" fill="#8FA7BF" />
        <rect x={-300} y={1580} width={1700} height={600} fill={PH.prado} />
        <path d="M-200 1700 Q200 1660 500 1730 T1200 1780" stroke="#A9C9DA" strokeWidth={8} fill="none" />
        {Array.from({ length: 30 }).map((_, i) => <Pino key={i} x={-30 + i * 30} y={1600 + (i % 4) * 22} s={0.2} />)}
        <defs><linearGradient id="niebla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE0EE" stopOpacity={0} /><stop offset="0.5" stopColor="#CFE0EE" stopOpacity={0.75} /><stop offset="1" stopColor="#CFE0EE" stopOpacity={0.35} /></linearGradient></defs>
        <rect x={-300} y={1300} width={1700} height={700} fill="url(#niebla)" />
        <Granito x0={X0} />
        {/* grieta: grosor irregular, sombra dentro y borde de luz a un lado */}
        <path d={`M${g[0] - 6} 200 L${g[0] + 10} 420 L${g[0] - 4} 600 L${g[0] + 14} 800 L${g[0] + 2} 1000 L${g[0] + 18} 1250 L${g[0] + 34} 1250 L${g[0] + 22} 1000 L${g[0] + 36} 800 L${g[0] + 20} 600 L${g[0] + 30} 420 L${g[0] + 10} 200 Z`} fill="#2E2A26" />
        <path d={`M${g[0] + 10} 200 L${g[0] + 30} 420 L${g[0] + 20} 600 L${g[0] + 36} 800 L${g[0] + 22} 1000 L${g[0] + 34} 1250`} stroke="#F4F1EA" strokeWidth={6} fill="none" />
        {/* presa y regletes justo donde van mano y pies */}
        <path d={`M${X0} ${p[1] - 26} L${p[0] + 4} ${p[1] - 10} Q${p[0] + 2} ${p[1] + 18} ${X0} ${p[1] + 22} Z`} fill={PH.granitoL} stroke={PH.veta} strokeWidth={3} />
        {[pa, pb].map(([x, y], i) => <path key={i} d={`M${X0} ${y - 2} L${x - 30} ${y + 4} L${x - 26} ${y + 16} L${X0} ${y + 20} Z`} fill={PH.granitoL} stroke={PH.veta} strokeWidth={3} />)}
        <Escalador x={HX} y={HY} quien="joe" s={S} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="normal"
          angulos={{ torso: TORSO, cabeza: 4, brazoA: alcanza(GRIETA, -1), brazoB: alcanza(manoB), piernaA: [110, 0], piernaB: [30, 30] }} />
        {/* nube de magnesio al sacar la mano de la bolsa */}
        <g opacity={nube > 0 ? 0.85 * (1 - nube) : 0}>{[0, 1, 2, 3].map((i) => <circle key={i} cx={b[0] - 10 + i * 14 + nube * 30} cy={b[1] - 20 - nube * 50 - i * 8} r={(10 + i * 4) * (0.5 + nube)} fill="#fff" />)}</g>
      </Svg>
      <Contador m={m} nota={nota} />
      <Etiqueta texto={titulo} top={1170} tam={84} desde={15} />
    </Camara>
  );
};
