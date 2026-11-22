// E68 · arqueo (cuerda de arco, ×3), mano abierta (36 veces menos, barras) y la rotura («pop», lesión n.º 1, 6 semanas → 3 meses).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Dedo, geom } from "./Dedo";
import { FondoRx, Cam, Grande, cl, pop, COL, F, golpe, type P } from "./comun";

const G = geom(1), CX = (G.mcp.x + G.pip.x) / 2, CY = (G.mcp.y + G.pip.y) / 2;
const ArcoIcono: React.FC<{ k: number }> = ({ k }) => k <= 0 ? null : (
  <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}><g transform={`translate(860 640) scale(${pop(k)})`}><rect x={-150} y={-170} width={300} height={340} rx={36} fill={COL.crema} stroke="#14213A" strokeWidth={8} /><path d="M-40 -130 Q90 0 -40 130" stroke="#8B5A2B" strokeWidth={18} fill="none" strokeLinecap="round" /><path d={`M-40 -130 L${-40 - 50 * Math.min(1, k / 10)} 0 L-40 130`} stroke="#FF8A2E" strokeWidth={8} fill="none" /><text y={150} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill="#14213A">ARCO</text></g></svg>
);
export const Arco: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fF = pal("fuera") ?? 30, fT = pal("tres") ?? 90;
  const fl = interpolate(f, [fF - 4, fF + 12], [0, 1], cl), k = interpolate(f, [0, 16], [0.7, 1], cl);
  return (
    <>
      <FondoRx />
      <Cam s={1.2} px={CX - 20} py={CY + 120}><Dedo k={k} flechas={fl} calor={0.4 + 0.5 * fl} glowA2={fl} etiquetas={1} /></Cam>
      <ArcoIcono k={f - (pal("arco") ?? 30)} />
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
  const sp = interpolate(f, [fA - 6, fA + 12], [0, 1], cl), b = interpolate(f, [fT - 4, fT + 14], [0, 1], cl);
  const g1 = geom(1), g0 = geom(0);
  return (
    <>
      <FondoRx />
      <div style={{ position: "absolute", inset: 0, clipPath: sp > 0 ? `inset(0 ${50 * sp}% 0 0)` : undefined }}><Cam s={1.05 - 0.35 * sp} px={560} py={1080} cx={540 - 270 * sp} cy={900}><Dedo k={1} calor={0.95} glowA2={1} etiquetas={1} /></Cam></div>
      {sp > 0 && <div style={{ opacity: sp }}><div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 0 50%)" }}><FondoRx /><Cam s={0.7} px={480} py={1060} cx={810} cy={900}><Dedo k={0} calor={0} etiquetas={1} /></Cam></div>
        <div style={{ position: "absolute", left: 537, top: 0, width: 6, height: 1920, background: "#fff", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 470, left: 0, width: 540, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 60, color: COL.rojo }}>ARQUEO</div>
        <div style={{ position: "absolute", top: 470, left: 540, width: 540, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 60, color: COL.verde }}>ABIERTO</div></div>}
      {b > 0 && <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: b }}>
        <rect x={190} y={1640 - 380 * b} width={180} height={380 * b} rx={18} fill={COL.rojo} stroke="#fff" strokeWidth={6} />
        <rect x={710} y={1640 - Math.max(14, 380 * b / 36)} width={180} height={Math.max(14, 380 * b / 36)} rx={8} fill={COL.verde} stroke="#fff" strokeWidth={6} />
        <text x={280} y={1600 - 380 * b} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={56} fill="#fff">36</text><text x={800} y={1590} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={56} fill="#fff">1</text>
      </svg>}
      <Grande t="36 VECES MENOS" top={1690} k={f - fT - 8} tam={80} fondo={COL.verde} color="#fff" />
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
      <Cam s={interpolate(f, [fP - 4, fP + 6], [1.25, 1.5], cl)} px={CX} py={CY + 40} sx={golpe(f, fP, 30)}><Dedo k={1} calor={1} roto={roto} etiquetas={1} glowA2={1 - roto} /></Cam>
      {f >= fP && f < fP + 6 && <AbsoluteFill style={{ background: "rgba(255,255,255,.7)" }} />}
      {fase === 0 && <Grande t="POP" top={1420} k={f - fP} tam={200} fondo={COL.rojo} color="#fff" />}
      {fase === 1 && <Grande t="LESIÓN N.º 1" top={1380} k={f - fF + 2} tam={100} fondo={COL.amarillo} />}
      {f >= fS - 2 && <Grande t={f >= fM - 4 ? "HASTA 3 MESES" : "6 SEMANAS"} top={1560} k={f >= fM - 4 ? f - fM + 4 : f - fS + 2} tam={84} fondo={f >= fM - 4 ? COL.rojo : COL.naranja} color="#fff" />}
      {void pop}
    </>
  );
};
