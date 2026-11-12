// Macro de la puntera pisando un canto de 2,3 mm (el grosor de una moneda de 1 €). Origen = el borde del canto.
// `Ventana` = recuadro con su propio encuadre (para comparar dos gatos en el mismo paso).
import React, { useId } from "react";
import { G, T } from "./comun";
import { Canto, Gato, Pie } from "./Gato";

export const Puntera: React.FC<{ k: number; x: number; y: number; L: number; g: number; hueco?: boolean; dobla?: number; cae?: number; dolor?: number; pulso?: number; halo?: string; haloO?: number; aplasta?: number; children?: React.ReactNode }> = ({ k, x, y, L, g, hueco, dobla = 0, cae = 0, dolor = 0, pulso = 1, halo, haloO = 0, aplasta = 0, children }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <g transform={`translate(${-(L + 1.17)} -1.12)`}>
      <Canto x={L + 1.42} y={1.12} />
      {cae > 0 && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={L + 1.1 - i * 0.12} cy={1.4 + cae * (3 + i * 1.7)} r={0.16 + 0.05 * i} fill="#E8EDF2" opacity={Math.max(0, 0.8 - cae * 0.6)} />)}
      <g transform={`translate(${-cae * 0.5} ${cae * cae * 9}) rotate(${cae * 7} ${L} 0)`}>
        <Gato L={L} g={g} hueco={hueco} dobla={dobla} halo={halo} haloO={haloO} aplasta={aplasta}><Pie g={g} dolor={dolor} pulso={pulso} /></Gato>
      </g>
      {children}
    </g>
  </g>
);

/** Moneda de 1 € de canto (2,33 mm) bajo el canto de roca, con guías: mismo grosor. Y la moneda de frente (23,25 mm) para reconocerla. `o` 0–1. */
export const Moneda: React.FC<{ L: number; o: number }> = ({ L, o }) => {
  const x0 = L + 1.17, x1 = L + 1.403, y = 2.7 + (1 - o) * 0.8;
  return (
    <g opacity={Math.min(1, o * 1.6)}>
      <circle cx={L + 1.3} cy={1.15} r={0.75 + (1 - o) * 1.2} fill="none" stroke="#fff" strokeWidth={0.07} opacity={0.95} />
      <path d={`M${x0} 1.25 V${y + 2.5} M${x1} 1.3 V${y + 2.5}`} stroke="#fff" strokeWidth={0.035} strokeDasharray="0.12 0.1" opacity={0.9} />
      <rect x={x0} y={y} width={0.233} height={2.325} rx={0.05} fill="#D9B24A" stroke={T} strokeWidth={0.05} />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${x0} ${y + 0.12 + i * 0.16} h0.233`} stroke="#8A6A1E" strokeWidth={0.03} />)}
      <g transform={`translate(${L - 1.9} ${y + 1.16}) scale(${0.6 + 0.4 * o})`}>
        <circle r={1.1625} fill="#D9B24A" stroke={T} strokeWidth={0.09} /><circle r={0.8} fill="#D5DADF" stroke="#8A6A1E" strokeWidth={0.04} />
        <text x={0} y={0.36} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={0.95} fill={T}>1 €</text>
        <path d="M-0.5 -0.95 A1.07 1.07 0 0 1 0.5 -0.95" stroke="#fff" strokeOpacity={0.6} strokeWidth={0.07} fill="none" />
      </g>
      <path d={`M${L - 0.62} ${y + 1.16} H${x0 - 0.12}`} stroke="#fff" strokeWidth={0.05} strokeDasharray="0.12 0.1" />
    </g>
  );
};

export const Ventana: React.FC<{ x: number; y: number; w: number; h: number; borde: string; dy?: number; children: React.ReactNode }> = ({ x, y, w, h, borde, dy = 0, children }) => {
  const id = "vt" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g transform={`translate(${x} ${y + dy})`}>
      <defs><clipPath id={id}><rect width={w} height={h} rx={34} /></clipPath><linearGradient id={id + "g"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2F5F8F" /><stop offset="1" stopColor="#A9CFE6" /></linearGradient></defs>
      <rect x={6} y={10} width={w} height={h} rx={34} fill="#000" opacity={0.35} />
      <g clipPath={`url(#${id})`}><rect width={w} height={h} fill={`url(#${id}g)`} /><ellipse cx={w * 0.2} cy={h * 0.95} rx={w * 0.5} ry={h * 0.28} fill="#6F97B4" opacity={0.6} />{children}</g>
      <rect width={w} height={h} rx={34} fill="none" stroke={T} strokeWidth={12} /><rect x={5} y={5} width={w - 10} height={h - 10} rx={30} fill="none" stroke={borde} strokeWidth={7} />
    </g>
  );
};
export { G };
