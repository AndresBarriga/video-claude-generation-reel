// E68 «poleas» (rayos X): utilidades comunes.
import React from "react";
import { AbsoluteFill } from "remotion";
export { Svg, golpe, type P } from "../Pegue/comun";
export { Ficha, Grande, ICONOS } from "../Miedo/Ui";
export { cl, c01, pop, COL, F } from "../Miedo/comun";
/** Sala de rayos X: azul profundo con viñeta y rejilla suave. */
export const FondoRx: React.FC<{ claro?: number }> = ({ claro = 0 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${claro ? "#2C4F8C" : "#1B3266"} 0%, #0B1636 60%, #050A1C 100%)` }}>
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 100} 0 V1920`} stroke="#7FB8FF" strokeWidth={2} />)}
      {Array.from({ length: 20 }).map((_, i) => <path key={i} d={`M0 ${i * 100} H1080`} stroke="#7FB8FF" strokeWidth={2} />)}
    </svg>
  </AbsoluteFill>
);
/** Cámara: escala alrededor de un punto (px,py) y lo lleva al centro (cx,cy). */
export const Cam: React.FC<{ s: number; px: number; py: number; cx?: number; cy?: number; sx?: number; children: React.ReactNode }> = ({ s, px, py, cx = 540, cy = 960, sx = 0, children }) => (
  <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}><g transform={`translate(${cx + sx} ${cy}) scale(${s}) translate(${-px} ${-py})`}>{children}</g></svg>
);
