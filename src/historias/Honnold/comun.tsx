// E14 «Honnold»: piezas comunes. Idea visual: el contador de metros no para de subir (y tú, abajo con prismáticos, cada vez peor).
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { fuenteTitulo, fuenteTexto } from "../../tema";
export { C, Camara, Etiqueta, Svg, Zoom, golpe, clamp, W, H, type P } from "../Pegue/comun";

export const PH = { cieloA: "#4F8CC4", cieloB: "#D6E8F2", granito: "#D9D5CB", granitoS: "#B9B3A6", granitoL: "#ECE8DF", veta: "#6F6A62", pino: "#2F4A3A", pinoL: "#3F5E48", prado: "#8FA65F", pradoS: "#768C4C" };

export const Cielo: React.FC = () => (
  <>
    <defs><linearGradient id="hcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PH.cieloA} /><stop offset="1" stopColor={PH.cieloB} /></linearGradient></defs>
    <rect x={-400} y={-600} width={1900} height={3200} fill="url(#hcielo)" />
  </>
);

/** Pino de Yosemite (copa en pisos). */
export const Pino: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-4} y={-10} width={8} height={14} fill="#4A3524" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-26 + i * 5} ${-8 - i * 22} L0 ${-44 - i * 22} L${26 - i * 5} ${-8 - i * 22} Z`} fill={i % 2 ? PH.pinoL : PH.pino} />)}
  </g>
);

/** Granito de El Capitán: placa casi vertical con fisuras largas y vetas oscuras. x0 = canto izquierdo de la pared. */
export const Granito: React.FC<{ x0: number; y0?: number; y1?: number; sem?: string }> = ({ x0, y0 = -600, y1 = 2600, sem = "g" }) => (
  <g>
    <defs><linearGradient id={`gr${sem}`} x1="0" x2="1"><stop offset="0" stopColor={PH.granitoL} /><stop offset="0.3" stopColor={PH.granito} /><stop offset="1" stopColor={PH.granitoS} /></linearGradient></defs>
    <path d={`M${x0} ${y0} L${x0 - 20} ${y1} L1600 ${y1} L1600 ${y0} Z`} fill={`url(#gr${sem})`} />
    {Array.from({ length: 5 }).map((_, i) => { const x = x0 + 90 + i * 120 + random(`${sem}f${i}`) * 50; return <path key={i} d={`M${x} ${y0} Q${x - 30 + random(`${sem}q${i}`) * 60} ${(y0 + y1) / 2} ${x - 10} ${y1}`} stroke={PH.veta} strokeWidth={4 + random(`${sem}w${i}`) * 4} fill="none" opacity={0.55} />; })}
    {Array.from({ length: 4 }).map((_, i) => { const y = y0 + random(`${sem}v${i}`) * (y1 - y0); return <path key={i} d={`M${x0 + 200} ${y} q120 60 260 20 q80 -30 200 30 l0 120 q-140 -40 -240 0 q-120 40 -220 -60 Z`} fill={PH.veta} opacity={0.12} />; })}
    {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={x0 + random(`${sem}x${i}`) * 700} cy={y0 + random(`${sem}y${i}`) * (y1 - y0)} r={2 + random(`${sem}r${i}`) * 4} fill={PH.granitoS} opacity={0.6} />)}
    <path d={`M${x0} ${y0} L${x0 - 20} ${y1}`} stroke="#000" strokeOpacity={0.18} strokeWidth={8} />
  </g>
);

/** Torre Eiffel en silueta (altura h en px; base en (x, y)). Dibujo propio, sin iluminación nocturna. */
export const Eiffel: React.FC<{ x: number; y: number; h: number; color?: string }> = ({ x, y, h, color = "#4A5563" }) => {
  const w = h * 0.38;
  return (
    <g transform={`translate(${x} ${y})`} fill={color}>
      <path d={`M${-w / 2} 0 Q${-w * 0.18} ${-h * 0.25} ${-w * 0.06} ${-h * 0.62} L${-w * 0.02} ${-h * 0.95} L0 ${-h} L${w * 0.02} ${-h * 0.95} L${w * 0.06} ${-h * 0.62} Q${w * 0.18} ${-h * 0.25} ${w / 2} 0 L${w * 0.3} 0 Q${0} ${-h * 0.2} ${-w * 0.3} 0 Z`} />
      <rect x={-w * 0.3} y={-h * 0.2} width={w * 0.6} height={h * 0.025} />
      <rect x={-w * 0.14} y={-h * 0.4} width={w * 0.28} height={h * 0.02} />
    </g>
  );
};

/** Contador de metros (arriba a la derecha): número grande + «m». */
export const Contador: React.FC<{ m: number; nota?: string; grande?: boolean }> = ({ m, nota, grande }) => (
  <div style={{ position: "absolute", top: 210, right: 60, textAlign: "right" }}>
    <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: grande ? 190 : 140, lineHeight: 1, color: "#fff", WebkitTextStroke: "14px #050B14", paintOrder: "stroke fill", fontVariantNumeric: "tabular-nums" }}>
      {Math.round(m)}<span style={{ fontSize: grande ? 100 : 76 }}> m</span>
    </div>
    {nota && <div style={{ fontFamily: fuenteTexto, fontWeight: 800, fontSize: 46, color: "#fff", background: "rgba(5,11,20,.7)", borderRadius: 16, padding: "4px 18px", display: "inline-block", marginTop: 6 }}>{nota}</div>}
  </div>
);

export const useF = () => useCurrentFrame();
