// E11 «La pierna de máquina de coser» (vía). Piezas comunes.
// Idea visual: el temblor se ve siempre (pierna, cinta exprés, cuerda naranja vibrando) y se para solo una vez: cuando baja el talón.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import type { Look } from "../../piezas/Escalador";
export { C, Camara, Cuerda, Etiqueta, Svg, Zoom, golpe, clamp, W, H, type P } from "../Pegue/comun";

/* ---- reparto (nuevo en E11) ---- */
export const TU: Partial<Look> = { chaqueta: "#8E2E3B", chaquetaSombra: "#61202A", pantalon: "#2E3A4A", casco: "#5E8C6A", pelo: "#1A1210", piel: "#8A5A3B", pielSombra: "#6E452C", peinado: "trenzas" };
export const ASEG: Partial<Look> = { chaqueta: "#C9962E", chaquetaSombra: "#946C1E", pantalon: "#4A4F3C", casco: null, gorro: "#2F4A6E", pelo: "#B8BCC2", piel: "#F0C4A8", pielSombra: "#D09E84", barba: "#B8BCC2", gafas: true };
export const SUJETO: Partial<Look> = { chaqueta: "#8A96A6", chaquetaSombra: "#66717F", pantalon: "#39424F", casco: null, peinado: "rapado", piel: "#C98E62", pielSombra: "#A8714A" };
export const CIENTIFICA: Partial<Look> = { chaqueta: "#E8ECF0", chaquetaSombra: "#BCC5CF", pantalon: "#2E3A4A", casco: null, pelo: "#5A3A24", peinado: "coleta", piel: "#EBC3A0", pielSombra: "#C99B78", gafas: true };

/* ---- paleta: caliza fría y cielo de media mañana ---- */
export const P11 = { cieloA: "#5B8DB8", cieloB: "#CFE2EE", roca: "#9AA3AE", rocaS: "#7C8693", rocaL: "#B9C1CA", valle: "#6F8A78", valleL: "#9FB3A6", tinta: "#0B1624", musculo: "#E58E7E", metal: "#AEB8C4", cinta: "#3D7FD0" };

/** Temblor de máquina de coser: oscilación rápida (≈ 6 por segundo) con algo de irregularidad. k = intensidad 0–1. */
export const temblor = (f: number, k = 1, fase = 0) => k * (Math.sin(f * 1.26 + fase) * 0.8 + Math.sin(f * 2.9 + fase * 2) * 0.2);

export const Cielo: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P11.cieloA} /><stop offset="1" stopColor={P11.cieloB} /></linearGradient></defs>
    <rect x={-300} y={-500} width={1700} height={3000} fill={`url(#${id})`} />
  </>
);

/** Valle muy abajo (lo que ves al mirar abajo): campos, árboles diminutos y neblina. `y` = altura del valle en pantalla. */
export const Valle: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M-300 ${y} Q300 ${y - 30} 1400 ${y + 10} L1400 2600 L-300 2600 Z`} fill={P11.valleL} />
    <path d={`M-300 ${y + 60} Q500 ${y + 20} 1400 ${y + 70} L1400 2600 L-300 2600 Z`} fill={P11.valle} />
    {Array.from({ length: 26 }).map((_, i) => {
      const x = random(`vx${i}`) * 900 - 100, yy = y + 30 + random(`vy${i}`) * 300, r = 5 + random(`vr${i}`) * 6;
      return <g key={i}><ellipse cx={x} cy={yy + r} rx={r} ry={r * 0.35} fill="#000" opacity={0.15} /><circle cx={x} cy={yy} r={r} fill="#4E6B57" /></g>;
    })}
    <rect x={-300} y={y - 120} width={1700} height={160} fill={P11.cieloB} opacity={0.45} />
  </g>
);

/** Pared de caliza vertical: cara a la derecha de x0, con grietas, regletes y textura. */
export const Pared: React.FC<{ x0: number; y0?: number; y1?: number; semilla?: string }> = ({ x0, y0 = -400, y1 = 2400, semilla = "p" }) => (
  <g>
    <path d={`M${x0} ${y0} L${x0 + 6} ${y1} L1500 ${y1} L1500 ${y0} Z`} fill={P11.roca} />
    <path d={`M${x0} ${y0} L${x0 + 6} ${y1} L${x0 + 60} ${y1} L${x0 + 54} ${y0} Z`} fill={P11.rocaL} opacity={0.5} />
    {Array.from({ length: 16 }).map((_, i) => {
      const y = y0 + i * ((y1 - y0) / 16) + random(`${semilla}g${i}`) * 60;
      return <path key={i} d={`M${x0 + 4} ${y} q${80 + random(`${semilla}a${i}`) * 90} ${10 + random(`${semilla}b${i}`) * 30} ${260} ${random(`${semilla}c${i}`) * 50}`} stroke={P11.rocaS} strokeWidth={5} fill="none" opacity={0.6} />;
    })}
    {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={x0 + 20 + random(`${semilla}x${i}`) * 500} cy={y0 + random(`${semilla}y${i}`) * (y1 - y0)} r={2 + random(`${semilla}r${i}`) * 4} fill={P11.rocaS} opacity={0.5} />)}
    <path d={`M${x0} ${y0} L${x0 + 6} ${y1}`} stroke="#000" strokeOpacity={0.22} strokeWidth={8} />
  </g>
);

/** Reglete: repisa mínima donde apoya la punta del pie. */
export const Reglete: React.FC<{ x: number; y: number; ancho?: number }> = ({ x, y, ancho = 26 }) => (
  <g>
    <path d={`M${x} ${y} L${x - ancho} ${y + 2} L${x - ancho + 4} ${y + 9} L${x} ${y + 12} Z`} fill={P11.rocaL} stroke="#000" strokeOpacity={0.25} strokeWidth={2} />
    <ellipse cx={x - ancho / 2} cy={y + 14} rx={ancho / 2} ry={4} fill="#000" opacity={0.2} />
  </g>
);

/** Chapa con cinta exprés que tintinea con el temblor y la cuerda pasando. `t` = tintineo (grados). */
export const Chapa: React.FC<{ x: number; y: number; t?: number; s?: number }> = ({ x, y, t = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={9} fill={P11.metal} stroke="#000" strokeOpacity={0.3} strokeWidth={2} />
    <g transform={`rotate(${t})`}>
      <path d="M-5 6 Q-12 4 -10 -4 Q-6 -12 0 -10 L4 4 Z" fill="none" stroke={P11.metal} strokeWidth={4} />
      <rect x={-7} y={8} width={14} height={44} rx={7} fill={P11.cinta} />
      <ellipse cx={0} cy={66} rx={13} ry={17} fill="none" stroke={P11.metal} strokeWidth={5} />
    </g>
  </g>
);

/** Rótulo pequeño de fuente (dato científico). */
export const Fuente: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", fontFamily: "Figtree", fontWeight: 700, fontSize: 30, color: "#fff", opacity: 0.8, textShadow: "0 2px 6px #0008" }}>{texto}</div>
);

export const usaTemblor = (k: number) => { const f = useCurrentFrame(); return { f, tr: (fase = 0) => temblor(f, k, fase) }; };
export const sube = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
