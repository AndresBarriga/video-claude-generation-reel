// E47: mano en arqueo sobre una regleta de caliza, dibujada para el primer plano (pantalla 1080×1920, sin zoom extra).
// `abre` 0 = arqueo cerrado con el pulgar bloqueando · 1 = dedos estirados soltando. `tiembla` px. `blancos` 0–1 = nudillos blancos.
import React from "react";
import { random } from "remotion";

type Pt = [number, number];
const T = "#141B26";
const L = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const BORDE = { x: 655, y: 888, x1: 800 }; // cara superior de la regleta

// [MCP, PIP, DIP, punta] del índice en arqueo y abierto; el resto se desplaza hacia atrás (meñique el último)
const ARQ: Pt[] = [[600, 1004], [628, 836], [692, 872], [748, 880]];
const ABI: Pt[] = [[600, 1004], [584, 836], [574, 748], [568, 686]];
const OFF = [[0, 0], [-36, 18], [-70, 38], [-100, 64]] as Pt[];
const LARGO = [1, 1.05, 0.98, 0.84];
const ANCHO = [[64, 58, 50], [66, 60, 52], [62, 56, 48], [54, 48, 42]];

export const ManoCerca: React.FC<{ abre: number; tiembla: number; blancos: number; piel: string; pielS: string; manga: string; f: number }> = ({ abre, tiembla, blancos, piel, pielS, manga, f }) => {
  const dedo = (i: number): Pt[] => {
    const base: Pt = [ARQ[0][0] + OFF[i][0] + tiembla, ARQ[0][1] + OFF[i][1]];
    return [0, 1, 2, 3].map((j) => {
      if (j === 0) return base;
      const a = L(ARQ[j], ABI[j], abre), d: Pt = [(a[0] - ARQ[0][0]) * LARGO[i], (a[1] - ARQ[0][1]) * LARGO[i]];
      return [base[0] + d[0] + i * 10 * (1 - abre) * (j === 3 ? 1.6 : 1), base[1] + d[1] - i * 6 * (1 - abre)] as Pt;
    });
  };
  const D = [3, 2, 1, 0].map((i) => ({ i, p: dedo(i) }));
  const seg = (a: Pt, b: Pt, w: number, c: string) => <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={c} strokeWidth={w} strokeLinecap="round" />;
  const tx = tiembla;
  // dorso: de los nudillos a la muñeca
  const m = D.map((d) => d.p[0]);
  const dorso = `M${m[3][0] + 22} ${m[3][1] - 20} Q${m[2][0] + 10} ${m[2][1] - 34} ${m[1][0]} ${m[1][1] - 30} Q${m[0][0] - 10} ${m[0][1] - 28} ${m[0][0] - 40} ${m[0][1] + 6}
    Q${430 + tx} 1120 ${420 + tx} 1290 L${610 + tx} 1310 Q${640 + tx} 1150 ${m[3][0] + 40} ${m[3][1] + 20} Z`;
  // pulgar: bloquea encima del índice en arqueo; se separa al abrir
  const pBase: Pt = [596 + tx, 1112], pMed: Pt = L([652 + tx, 978], [640 + tx, 1010], abre), pTip: Pt = L([694 + tx, 862], [692 + tx, 962], abre);
  return (
    <g>
      {/* regleta de caliza saliendo de la pared */}
      <path d={`M${BORDE.x - 10} ${BORDE.y + 6} Q${BORDE.x} ${BORDE.y - 8} ${BORDE.x + 40} ${BORDE.y - 6} L${BORDE.x1} ${BORDE.y - 14} L${BORDE.x1 + 10} ${BORDE.y + 70} Q${BORDE.x + 90} ${BORDE.y + 74} ${BORDE.x - 6} ${BORDE.y + 40} Z`} fill="#8E969F" stroke={T} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M${BORDE.x + 6} ${BORDE.y + 2} L${BORDE.x1 - 4} ${BORDE.y - 9}`} stroke="#C9D0D6" strokeWidth={8} strokeLinecap="round" />
      <path d={`M${BORDE.x + 10} ${BORDE.y + 30} Q${BORDE.x + 100} ${BORDE.y + 52} ${BORDE.x1} ${BORDE.y + 40}`} stroke="#6A727C" strokeWidth={5} fill="none" opacity={0.7} />
      {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={BORDE.x + 30 + random(`rm${i}`) * 150} cy={BORDE.y - 4 + random(`rn${i}`) * 10} r={4 + random(`ro${i}`) * 5} fill="#F4F6F8" opacity={0.75} />)}
      <path d={`M${BORDE.x1 + 10} ${BORDE.y + 72} Q${BORDE.x + 140} ${BORDE.y + 150} ${BORDE.x1 + 10} ${BORDE.y + 200}`} fill="#2F353E" opacity={0.45} />

      {/* antebrazo con músculo y manga */}
      <path d={`M${420 + tx} 1290 Q${360 + tx} 1500 ${240 + tx} 1980 L${720 + tx} 1980 Q${640 + tx} 1560 ${610 + tx} 1310 Z`} fill={piel} stroke={T} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M${450 + tx} 1330 Q${400 + tx} 1520 ${330 + tx} 1760`} stroke={pielS} strokeWidth={34} fill="none" opacity={0.55} strokeLinecap="round" />
      <path d={`M${560 + tx} 1360 Q${560 + tx} 1500 ${600 + tx} 1660`} stroke="#F2C9A8" strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
      <path d={`M${200 + tx} 1700 L${760 + tx} 1640 L${790 + tx} 1990 L${170 + tx} 1990 Z`} fill={manga} stroke={T} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M${215 + tx} 1745 L${762 + tx} 1688`} stroke="#000" strokeWidth={8} opacity={0.2} />

      {/* dorso, tendones y vena */}
      <path d={dorso} fill={piel} stroke={T} strokeWidth={10} strokeLinejoin="round" />
      {m.map((p, k) => <path key={k} d={`M${p[0] - 4} ${p[1] + 20} Q${p[0] - 30} ${p[1] + 140} ${520 + tx + k * 14} 1270`} stroke={pielS} strokeWidth={7} fill="none" opacity={0.35 + 0.35 * blancos} strokeLinecap="round" />)}
      <path d={`M${470 + tx} 1240 q30 -60 10 -110 t40 -90`} stroke="#7E9AB8" strokeWidth={6} fill="none" opacity={0.35} strokeLinecap="round" />

      {/* dedos, del meñique al índice */}
      {D.map(({ i, p }) => {
        const [w1, w2, w3] = ANCHO[i], tono = i === 0 ? piel : i === 1 ? piel : pielS;
        const dir = Math.atan2(p[3][1] - p[2][1], p[3][0] - p[2][0]);
        const nx = p[3][0] - Math.cos(dir) * 18 + Math.sin(dir) * 10, ny = p[3][1] - Math.sin(dir) * 18 - Math.cos(dir) * 10;
        return (
          <g key={i}>
            {seg(p[0], p[1], w1 + 18, T)}{seg(p[1], p[2], w2 + 18, T)}{seg(p[2], p[3], w3 + 18, T)}
            {seg(p[0], p[1], w1, tono)}{seg(p[1], p[2], w2, tono)}{seg(p[2], p[3], w3, tono)}
            {/* brillo lateral */}
            <path d={`M${p[0][0] - 12} ${p[0][1] - 10} L${p[1][0] - 12} ${p[1][1] + 6}`} stroke="#F2C9A8" strokeWidth={8} opacity={i === 0 ? 0.45 : 0.25} strokeLinecap="round" />
            {/* uña */}
            <rect x={nx - 15} y={ny - 11} width={30} height={22} rx={10} fill="#E9CDB9" stroke={T} strokeWidth={4} transform={`rotate(${(dir * 180) / Math.PI} ${nx} ${ny})`} />
            {/* pliegues */}
            {[1, 2].map((j) => <path key={j} d={`M${p[j][0] - 16} ${p[j][1] + 4} q16 -12 32 0`} stroke={T} strokeWidth={4} opacity={0.45} fill="none" strokeLinecap="round" />)}
            {/* nudillo blanco y magnesio en la yema */}
            <ellipse cx={p[1][0]} cy={p[1][1] - 4} rx={18} ry={12} fill="#FBEFE6" opacity={0.25 + 0.55 * blancos} />
            <circle cx={p[3][0] - 4} cy={p[3][1] + 8} r={16} fill="#F4F6F8" opacity={0.7} />
          </g>
        );
      })}
      {/* pulgar */}
      {seg(pBase, pMed, 82, T)}{seg(pMed, pTip, 72, T)}{seg(pBase, pMed, 64, piel)}{seg(pMed, pTip, 54, piel)}
      <path d={`M${pBase[0] - 18} ${pBase[1] - 20} L${pMed[0] - 14} ${pMed[1] + 6}`} stroke="#F2C9A8" strokeWidth={9} opacity={0.4} strokeLinecap="round" />
      <ellipse cx={pTip[0] + 6} cy={pTip[1] - 8} rx={15} ry={11} fill="#E9CDB9" stroke={T} strokeWidth={4} transform={`rotate(-40 ${pTip[0] + 6} ${pTip[1] - 8})`} />
      {/* magnesio en el dorso */}
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={500 + tx + random(`dm${i}`) * 140} cy={1000 + random(`dn${i}`) * 200} r={2 + random(`do${i}`) * 4} fill="#F4F6F8" opacity={0.35} />)}
    </g>
  );
};
