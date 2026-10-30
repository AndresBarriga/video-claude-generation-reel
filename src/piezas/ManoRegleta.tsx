// Mano de perfil cerrando una regleta (macro). `k` 0 = mano abierta llegando · 0.5 = semiarqueo · 1 = arqueo cerrado con el pulgar encima.
// Pared a la derecha, regleta saliendo de ella. Dedos gruesos con contorno, como el resto de piezas.
import React from "react";

const T = "#141B26";
type Pt = [number, number];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const lerp3 = (a: Pt, b: Pt, c: Pt, t: number): Pt => (t < 0.5 ? lerp(a, b, t * 2) : lerp(b, c, (t - 0.5) * 2));

// Articulaciones de un dedo [MCP, PIP, DIP, punta] en tres estados: abierto → semiarqueo → arqueo
const ABIERTO: Pt[] = [[560, 1180], [610, 1050], [660, 960], [700, 900]];
const SEMI: Pt[] = [[580, 1060], [600, 920], [668, 880], [722, 902]];
const ARQUEO: Pt[] = [[590, 1040], [610, 870], [690, 868], [730, 904]];

export const REGLETA = { x: 712, y: 912, w: 64 };

export const ManoRegleta: React.FC<{ k: number; tiembla?: number; piel?: string; pielS?: string; manga?: string; presa?: string; pared?: string; blancos?: number }> = ({ k, tiembla = 0, piel = "#A86E4A", pielS = "#86543A", manga = "#2F4A7A", presa = "#E0A526", pared = "#5C6E86", blancos = 0 }) => {
  const dedo = (i: number) => {
    const o: Pt = [-i * 26, i * 24]; // del índice (0, delante) al meñique (3, detrás)
    return [0, 1, 2, 3].map((j) => { const p = lerp3(ABIERTO[j], SEMI[j], ARQUEO[j], k); return [p[0] + o[0] + tiembla, p[1] + o[1]] as Pt; });
  };
  const trazo = (pts: Pt[], w: number, c: string) => <path d={"M" + pts.map((p) => p.join(" ")).join(" L")} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  const D = [3, 2, 1, 0].map(dedo);
  const mcp = dedo(0)[0];
  const pulgar = k > 0.6 ? (k - 0.6) / 0.4 : 0;
  const pBase: Pt = [mcp[0] - 40 + tiembla, mcp[1] + 40], pTip = lerp([mcp[0] - 30, mcp[1] - 20], [672 + tiembla, 870], pulgar);
  return (
    <g>
      {/* pared y regleta */}
      <rect x={REGLETA.x + REGLETA.w - 10} y={-200} width={600} height={2400} fill={pared} />
      <path d={`M${REGLETA.x + REGLETA.w - 10} -200 L${REGLETA.x + REGLETA.w - 10} 2200`} stroke={T} strokeWidth={8} opacity={0.5} />
      <path d={`M${REGLETA.x - 6} ${REGLETA.y} L${REGLETA.x + REGLETA.w} ${REGLETA.y - 4} L${REGLETA.x + REGLETA.w} ${REGLETA.y + 34} Q${REGLETA.x + 10} ${REGLETA.y + 30} ${REGLETA.x - 6} ${REGLETA.y + 12} Z`} fill={presa} stroke={T} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M${REGLETA.x + 2} ${REGLETA.y - 2} L${REGLETA.x + REGLETA.w - 6} ${REGLETA.y - 5}`} stroke="#F4F7FA" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      {/* antebrazo y dorso */}
      <path d={`M${mcp[0] - 260} 2100 L${mcp[0] - 120} ${mcp[1] + 260} Q${mcp[0] - 60} ${mcp[1] - 30} ${mcp[0] + 30} ${mcp[1] + 10} Q${mcp[0] + 40} ${mcp[1] + 200} ${mcp[0] + 10} ${mcp[1] + 330} L${mcp[0] + 120} 2100 Z`} fill={piel} stroke={T} strokeWidth={10} strokeLinejoin="round" />
      <rect x={mcp[0] - 250} y={mcp[1] + 560} width={420} height={1400} rx={60} fill={manga} stroke={T} strokeWidth={10} transform={`rotate(14 ${mcp[0]} ${mcp[1] + 560})`} />
      {/* dedos, del meñique al índice */}
      {D.map((pts, i) => <g key={i}>{trazo(pts, 62, T)}{trazo(pts, 48, i === 3 ? piel : i === 2 ? pielS : "#7A4A30")}
        {[1, 2].map((j) => <path key={j} d={`M${pts[j][0] - 14} ${pts[j][1] - 6} q14 -10 28 0`} stroke={T} strokeWidth={4} opacity={0.5} fill="none" strokeLinecap="round" />)}
        <circle cx={pts[1][0]} cy={pts[1][1]} r={11} fill="#F4F7FA" opacity={blancos * 0.7} />
        <circle cx={pts[3][0]} cy={pts[3][1] - 4} r={14} fill="#F4F7FA" opacity={0.75} />
      </g>)}
      {/* pulgar: en arqueo cerrado bloquea encima del índice */}
      {pulgar > 0 && <g>{trazo([pBase, pTip], 66, T)}{trazo([pBase, pTip], 52, piel)}</g>}
    </g>
  );
};
