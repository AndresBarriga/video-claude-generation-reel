// Lámina de Claude Design incrustada como SVG; `css` escoge capas por id (los ids llevan prefijo: tA_, tB_, pA_, pB_, ag_).
import React from "react";
export const Lamina: React.FC<{ html: string; css?: string; o?: number; tf?: string }> = ({ html, css = "", o = 1, tf }) => (
  <g opacity={o} transform={tf}><g dangerouslySetInnerHTML={{ __html: html + (css ? `<style>${css}</style>` : "") }} /></g>
);
/** Escala alrededor de (x, y). */
export const alrededor = (x: number, y: number, k: number, dx = 0, dy = 0) => `translate(${x + dx} ${y + dy}) scale(${k}) translate(${-x} ${-y})`;

/** Bocadillo de cómic (humor): rectángulo redondeado con rabito y texto corto. */
export const Bocadillo: React.FC<{ x: number; y: number; t: string; col?: string; o?: number; lado?: 1 | -1; w?: number }> = ({ x, y, t, col = "#fff", o = 1, lado = 1, w }) => {
  const W = w ?? t.length * 27 + 50;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      <path d={`M${-W / 2} -48 h${W} a28 28 0 0 1 28 28 v40 a28 28 0 0 1 -28 28 h${-W / 2 + 40 * lado} l${-30 * lado} 40 l${-4 * lado} -40 h${-W / 2 - 36 * lado} a28 28 0 0 1 -28 -28 v-40 a28 28 0 0 1 28 -28 z`} fill="#0B1624" stroke={col} strokeWidth={5} />
      <text x={0} y={12} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={42} fill={col}>{t}</text>
    </g>
  );
};
