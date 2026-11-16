// KIT · cuerda y material: cuerda por puntos, cinta exprés (a escala y en primer plano), presas.
import React from "react";
import { random } from "remotion";
import { C, PC, type Pt } from "./base";
import { nudo, type Via } from "./via";

export const dSoga = (pts: Pt[]) => pts.map((p, i) => { if (!i) return `M${p.x} ${p.y}`; const q = pts[i - 1]; return `Q${(p.x + q.x) / 2 + (p.sx ?? 0)} ${(p.y + q.y) / 2 + (p.sag ?? 0)} ${p.x} ${p.y}`; }).join(" ");
/** Cuerda por puntos. `brillo` 0–1 la ilumina desde el punto `desde` · `fantasma` = trazo rojo discontinuo (lo que habría pasado) · `idea` 0–1 = se vuelve gris (el cerebro «no la ve»). */
export const Soga: React.FC<{ pts: Pt[]; brillo?: number; desde?: number; w?: number; fantasma?: boolean; idea?: number }> = ({ pts, brillo = 0, desde = 0, w = 10, fantasma, idea = 0 }) => {
  const d = dSoga(pts);
  if (fantasma) return <path d={d} stroke={PC.miedo} strokeWidth={7} fill="none" strokeDasharray="16 14" strokeLinecap="round" opacity={0.9} />;
  return (
    <g>
      {brillo > 0 && <path d={dSoga(pts.slice(desde))} stroke="#FFE3A0" strokeWidth={34} opacity={0.5 * brillo} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <g opacity={1 - idea}>
        <path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke="#FFB27F" strokeWidth={2.5} fill="none" strokeDasharray="9 11" opacity={0.7} />
      </g>
      {idea > 0 && <path d={d} stroke="#AEB6C0" strokeWidth={6} fill="none" strokeDasharray="18 16" opacity={idea * 0.8} />}
    </g>
  );
};
/** Recorrido habitual: aparato de quien asegura → las `n` primeras chapas → nudo de quien escala (cadera `p`). `comba`/`floja` en px. */
export const porChapas = (via: Via, desde: Pt, n: number, p: Pt, o: { comba?: number; floja?: number; sx?: number } = {}): Pt[] => [
  desde, ...Array.from({ length: n }, (_, i) => ({ ...via.mos(i), sag: i ? 0 : o.comba ?? 26 })), { ...nudo(p), sag: o.floja ?? 0, sx: o.sx ?? 0 },
];

/** Chapa en la pared + cinta exprés colgando; (x, y) = la chapa. El mosquetón de la cuerda queda en (x − 6, y + 54). */
export const Expres: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = "#3D7FD0" }) => (
  <g>
    <circle cx={x + 4} cy={y} r={11} fill="#B8C0C8" stroke={PC.tinta} strokeWidth={4} />
    <path d={`M${x + 2} ${y + 6} L${x - 4} ${y + 40}`} stroke={color} strokeWidth={12} strokeLinecap="round" />
    <ellipse cx={x - 6} cy={y + 46} rx={9} ry={15} fill="none" stroke="#C9D1D8" strokeWidth={5} />
  </g>
);
/** Todas las cintas de una vía (o las `n` primeras). */
export const Cintas: React.FC<{ via: Via; n?: number }> = ({ via, n }) => <g>{via.chapas.slice(0, n).map((y, i) => <Expres key={i} x={via.xF(y)} y={y} />)}</g>;
/** Presas con magnesio a lo largo de la vía. */
export const Presas: React.FC<{ via: Via; ys?: number[]; color?: string }> = ({ via, ys = via.presas, color = "#585F69" }) => (
  <g>{ys.map((y, i) => <g key={i}><ellipse cx={via.xF(y) + 12} cy={y} rx={22} ry={9} fill={color} /><ellipse cx={via.xF(y) + 12} cy={y - 4} rx={18} ry={6} fill="#F1F3F5" opacity={0.35 + random(`pm${i}`) * 0.4} /></g>)}</g>
);

const mosq = (abre: number, gatillo: "izq" | "der") => {
  // Mosquetón en D, 120 × 200, origen en su centro. El gatillo gira hacia dentro desde su bisagra inferior.
  const s = gatillo === "izq" ? -1 : 1, T = PC.tinta;
  return (
    <g>
      <path d={`M${-s * 6} -92 Q${-s * 62} -96 ${-s * 58} -30 L${-s * 50} 62 Q${-s * 44} 98 ${-s * 4} 94 Q${s * 44} 90 ${s * 46} 56`} stroke={T} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={`M${-s * 6} -92 Q${-s * 62} -96 ${-s * 58} -30 L${-s * 50} 62 Q${-s * 44} 98 ${-s * 4} 94 Q${s * 44} 90 ${s * 46} 56`} stroke="#C9D1D8" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M${-s * 44} -40 L${-s * 40} 50`} stroke="#F4F6F8" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <path d={`M${-s * 6} -92 Q${s * 34} -92 ${s * 48} -62`} stroke={T} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={`M${-s * 6} -92 Q${s * 34} -92 ${s * 48} -62`} stroke="#C9D1D8" strokeWidth={22} fill="none" strokeLinecap="round" />
      <g transform={`translate(${s * 46} 56) rotate(${-s * abre * 34})`}>
        <path d="M0 0 L2 -116" stroke={T} strokeWidth={24} strokeLinecap="round" /><path d="M0 0 L2 -116" stroke="#8FA0B2" strokeWidth={13} strokeLinecap="round" />
        <circle cx={0} cy={0} r={7} fill={T} />
      </g>
    </g>
  );
};
/** Cinta exprés en PRIMER PLANO (≈5× la de escala): chapa, mosquetón de arriba, cinta cosida y mosquetón de la cuerda.
 *  (x, y) = centro del mosquetón de la cuerda. `abre` 0–1 = gatillo abierto · `gira` = grados que se balancea · `cuerda` = pasa la cuerda por dentro. */
export const ExpresGrande: React.FC<{ x: number; y: number; s?: number; abre?: number; gira?: number; color?: string; cuerda?: boolean; gatillo?: "izq" | "der"; pared?: boolean }> = ({ x, y, s = 1, abre = 0, gira = 0, color = "#3D7FD0", cuerda, gatillo = "izq", pared = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`rotate(${gira} 0 -560)`}>
      {pared && <g transform="translate(18 -590)"><rect x={-46} y={-40} width={92} height={96} rx={18} fill="#B8C0C8" stroke={PC.tinta} strokeWidth={10} /><circle cx={0} cy={-8} r={20} fill="#6E7782" stroke={PC.tinta} strokeWidth={8} /><circle cx={0} cy={30} r={15} fill="#2B3039" /></g>}
      <g transform="translate(8 -470) scale(0.9)">{mosq(0, gatillo === "izq" ? "der" : "izq")}</g>
      <path d="M2 -392 L-2 -92" stroke={PC.tinta} strokeWidth={74} strokeLinecap="round" />
      <path d="M2 -392 L-2 -92" stroke={color} strokeWidth={56} strokeLinecap="round" />
      {[-360, -330, -150, -120].map((yy) => <path key={yy} d={`M-22 ${yy} L22 ${yy}`} stroke="#fff" strokeWidth={5} strokeDasharray="7 7" opacity={0.6} />)}
      {cuerda && <g><path d="M-250 150 Q-70 40 -8 30 Q60 20 230 -260" stroke={C.cuerdaS} strokeWidth={46} fill="none" strokeLinecap="round" /><path d="M-250 150 Q-70 40 -8 30 Q60 20 230 -260" stroke={C.cuerda} strokeWidth={36} fill="none" strokeLinecap="round" /><path d="M-250 150 Q-70 40 -8 30 Q60 20 230 -260" stroke="#FFB27F" strokeWidth={7} fill="none" strokeDasharray="26 30" opacity={0.7} /></g>}
      {mosq(abre, gatillo)}
    </g>
  </g>
);
