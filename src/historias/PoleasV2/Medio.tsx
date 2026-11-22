// E68 · arqueo (cuerda de arco, ×3), mano abierta (36 veces menos, barras) y la rotura («pop», lesión n.º 1, 6 semanas → 3 meses).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Dedo, geom } from "./Dedo";
import { FondoRx, Cam, Grande, cl, pop, COL, F, golpe, type P } from "./comun";

const G = geom(1), CX = (G.mcp.x + G.pip.x) / 2, CY = (G.mcp.y + G.pip.y) / 2;
export const Arco: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fF = pal("fuera") ?? 30, fT = pal("tres") ?? 90;
  const fl = interpolate(f, [fF - 4, fF + 12], [0, 1], cl), k = interpolate(f, [0, 16], [0.7, 1], cl);
  return (
    <>
      <FondoRx />
      <Cam s={1.12} px={CX - 30} py={CY + 120}><Dedo k={k} flechas={fl} calor={0.4 + 0.5 * fl} glowA2={fl} etiquetas={1} /></Cam>
      <Grande t="×3" top={1420} k={f - fT} tam={170} fondo={COL.rojo} color="#fff" />
      <Grande t="LO QUE APRIETAS" top={1650} k={f - fT - 6} tam={60} fondo={COL.crema} />
    </>
  );
};
const Barra: React.FC<{ x: number; h: number; col: string; t: string }> = ({ x, h, col, t }) => (
  <g><rect x={x} y={1560 - h} width={150} height={h} rx={16} fill={col} stroke="#fff" strokeWidth={6} /><text x={x + 75} y={1615} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={32} fill="#fff">{t}</text></g>
);
export const Abierto: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fA = pal("abierta") ?? 20, fT = pal("treinta") ?? 60;
  const k = interpolate(f, [fA - 6, fA + 18], [1, 0], cl), b = interpolate(f, [fT - 4, fT + 14], [0, 1], cl);
  return (
    <>
      <FondoRx />
      {(() => { const g = geom(k); return <Cam s={0.82} px={(g.meta0.x + g.tip.x) / 2} py={(g.meta0.y + g.tip.y) / 2} cx={420}><Dedo k={k} calor={k * 0.9} glowA2={k} etiquetas={1} /></Cam>; })()}
      {b > 0 && <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: b }}>
        <rect x={700} y={1060} width={360} height={600} rx={30} fill="rgba(5,10,28,.75)" stroke="#7FB8FF" strokeWidth={4} />
        <Barra x={730} h={440 * b} col={COL.rojo} t="ARQUEO" />
        <Barra x={900} h={Math.max(12, 440 * b / 36)} col={COL.verde} t="ABIERTO" />
      </svg>}
      <Grande t="36 VECES MENOS" top={1700} k={f - fT - 8} tam={80} fondo={COL.verde} color="#fff" />
    </>
  );
};
export const Rompe: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fP = pal("pop") ?? 30, fF = pal("frecuente") ?? 70, fS = pal("seis") ?? 100, fM = pal("meses") ?? 130;
  const roto = interpolate(f, [fP, fP + 8], [0, 1], cl);
  const fase = f < fF - 2 ? 0 : 1;
  return (
    <>
      <FondoRx />
      <Cam s={1.2} px={CX - 30} py={CY + 120} sx={golpe(f, fP, 26)}><Dedo k={1} calor={1} roto={roto} etiquetas={1} glowA2={1 - roto} /></Cam>
      {f >= fP && f < fP + 6 && <AbsoluteFill style={{ background: "rgba(255,255,255,.7)" }} />}
      {fase === 0 && <Grande t="POP" top={1420} k={f - fP} tam={200} fondo={COL.rojo} color="#fff" />}
      {fase === 1 && <Grande t="LESIÓN N.º 1" top={1380} k={f - fF + 2} tam={100} fondo={COL.amarillo} />}
      {f >= fS - 2 && <Grande t={f >= fM - 4 ? "HASTA 3 MESES" : "6 SEMANAS"} top={1560} k={f >= fM - 4 ? f - fM + 4 : f - fS + 2} tam={84} fondo={f >= fM - 4 ? COL.rojo : COL.naranja} color="#fff" />}
      {void pop}
    </>
  );
};
