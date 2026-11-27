// Carruseles (4:5, 1080×1350): piezas comunes. Estilo de la cuenta (Miedo/Frenada): fondo azul claro, tinta, Bricolage 900.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, F } from "../historias/Miedo/comun";
import { fuenteTexto } from "../tema";
export { COL, F };
export const W = 1080, H = 1350;
export const FONDO = "#E8F2FC";
export const CUERDA = "#FF7A1A", CUERDA_L = "#FFD2A6";
export type Pt = [number, number];

/** Catmull-Rom → Bézier. Curvas suaves a partir de pocos puntos. */
export const cr = (pts: Pt[], cerrado = true): string => {
  const s = cerrado ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${s[1][0]} ${s[1][1]}`;
  for (let i = 1; i < s.length - 2; i++) {
    const [p0, p1, p2, p3] = [s[i - 1], s[i], s[i + 1], s[i + 2]];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(0)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(0)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(0)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(0)} ${p2[0]} ${p2[1]}`;
  }
  return d + (cerrado ? " Z" : "");
};
export const Forma: React.FC<{ p: Pt[]; c: string; w?: number }> = ({ p, c, w = 9 }) => <path d={cr(p)} fill={c} stroke={COL.tinta} strokeWidth={w} strokeLinejoin="round" />;
export const Linea: React.FC<{ p: Pt[]; c: string; w: number; o?: number }> = ({ p, c, w, o = 1 }) => <path d={cr(p, false)} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
/** Cuerda gruesa de primer plano: contorno, color, trenzado y sombra opcional sobre la roca. */
export const Cuerda: React.FC<{ p: Pt[]; sombra?: number; g?: number }> = ({ p, sombra = 0, g = 22 }) => {
  const d = cr(p, false);
  return (
    <g>
      {sombra > 0 && <path d={d} stroke="#000" strokeOpacity={0.16} strokeWidth={g + 6} fill="none" strokeLinecap="round" transform={`translate(${sombra} ${sombra * 0.8})`} />}
      <path d={d} stroke={COL.tinta} strokeWidth={g + 10} fill="none" strokeLinecap="round" />
      <path d={d} stroke={CUERDA} strokeWidth={g} fill="none" strokeLinecap="round" />
      <path d={d} stroke={CUERDA_L} strokeWidth={g * 0.25} fill="none" strokeDasharray={`${g * 0.6} ${g * 0.8}`} strokeLinecap="round" />
    </g>
  );
};
export const Svg: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = W, h = H }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
/** Marco de cada diapositiva: contador «n/10», usuario y «desliza →». */
export const Marco: React.FC<{ n: number; total?: number; fondo?: string; desliza?: boolean; children: React.ReactNode }> = ({ n, total = 10, fondo = FONDO, desliza = true, children }) => (
  <AbsoluteFill style={{ background: fondo, overflow: "hidden" }}>
    {children}
    <div style={{ position: "absolute", top: 44, right: 56, fontFamily: F, fontWeight: 800, fontSize: 34, color: "#fff", background: COL.tinta, borderRadius: 24, padding: "4px 18px 7px" }}>{n}/{total}</div>
    <div style={{ position: "absolute", bottom: 40, left: 56, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 30, color: COL.tinta, opacity: 0.75 }}>@ultimo.pegue</div>
    {desliza && <div style={{ position: "absolute", bottom: 34, right: 56, fontFamily: F, fontWeight: 800, fontSize: 36, color: COL.tinta }}>desliza →</div>}
  </AbsoluteFill>
);
export const Chip: React.FC<{ t: string; bg?: string; fg?: string; fs?: number }> = ({ t, bg = COL.tinta, fg = "#fff", fs = 44 }) => (
  <span style={{ fontFamily: F, fontWeight: 800, fontSize: fs, color: fg, background: bg, borderRadius: 30, padding: "6px 28px 10px", whiteSpace: "nowrap" }}>{t}</span>
);

/** Contorno de una extremidad que se estrecha: `pts` = eje (cadera→rodilla→tobillo), `ws` = anchura en cada punto. */
export const tubo = (pts: Pt[], ws: number[]): Pt[] => {
  const izq: Pt[] = [], der: Pt[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, w = ws[i] / 2;
    izq.push([Math.round(p[0] + nx * w), Math.round(p[1] + ny * w)]);
    der.push([Math.round(p[0] - nx * w), Math.round(p[1] - ny * w)]);
  });
  return [...izq, ...der.reverse()];
};
/** Punto a fracción t del segmento a→b. */
export const en = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
