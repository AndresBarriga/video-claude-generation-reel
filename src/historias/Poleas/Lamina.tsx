// Lámina de Claude Design incrustada como SVG; `css` escoge capas por id (los ids llevan prefijo: tA_, tB_, pA_, pB_, ag_).
import React from "react";
export const Lamina: React.FC<{ html: string; css?: string; o?: number; tf?: string }> = ({ html, css = "", o = 1, tf }) => (
  <g opacity={o} transform={tf}><g dangerouslySetInnerHTML={{ __html: html + (css ? `<style>${css}</style>` : "") }} /></g>
);
/** Escala alrededor de (x, y). */
export const alrededor = (x: number, y: number, k: number, dx = 0, dy = 0) => `translate(${x + dx} ${y + dy}) scale(${k}) translate(${-x} ${-y})`;
