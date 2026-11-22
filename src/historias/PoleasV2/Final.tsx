// E68 · cómo evitarla (3 fichas + músculo semanas / poleas años) y cierre («lo que te sostiene es un anillo» + guardar/enviar).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Guardar, HojaEnviar } from "../../piezas/kit";
import { Dedo, geom } from "./Dedo";
import { FondoRx, Cam, Grande, Ficha, cl, COL, F, type P } from "./comun";

const G = geom(1), CX = (G.mcp.x + G.pip.x) / 2, CY = (G.mcp.y + G.pip.y) / 2;
const BarraT: React.FC<{ t: string; v: number; top: number; col: string; fin: string }> = ({ t, v, top, col, fin }) => (
  <div style={{ position: "absolute", top, left: 70, width: 940 }}>
    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 48, color: "#14213A", marginBottom: 8 }}>{t} <span style={{ color: col }}>{v >= 0.99 ? fin : ""}</span></div>
    <div style={{ height: 56, borderRadius: 28, background: "rgba(20,33,58,.08)", border: "6px solid #14213A", overflow: "hidden" }}><div style={{ width: `${v * 100}%`, height: "100%", background: col }} /></div>
  </div>
);
export const Consejos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fC = pal("calienta") ?? 20, fA = pal("abierto") ?? 60, fS = pal("sube") ?? 100, fD = pal("fuertes") ?? 140, fPo = pal("poleas") ?? 170;
  const barras = f >= fD - 4, foco = f >= fS ? 2 : f >= fA ? 1 : 0;
  const m = interpolate(f, [fD, fD + 12], [0, 1], cl), p = interpolate(f, [fPo, fPo + 60], [0, 0.35], cl);
  const manoIcon = Math.floor(f / 8) % 2 ? "puno" : "mano";
  const items: [string, string, number][] = [[manoIcon, "CALIENTA", fC], ["dedos", "ABIERTO", fA], ["bateria", "POCO A POCO", fS]];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#FFF6E8, #F1E3CC)" }}>
      {!barras && items.map(([ic, t, f0], i) => { const grande = i === foco; return <Ficha key={t} icono={ic} texto={t} x={grande ? 540 : 200 + i * 340} y={grande ? 1000 : 1560} k={f - f0} ok={f > f0 + 10 ? true : undefined} s={grande ? 1.7 : 0.8} activa={grande || f > f0 + 10} />; })}
      {barras && <><BarraT t="TUS DEDOS" v={m} top={900} col={COL.verde} fin="· SEMANAS" /><BarraT t="TUS POLEAS" v={p} top={1120} col={COL.naranja} fin="" />
        {f >= fPo + 6 && <div style={{ position: "absolute", top: 1300, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 90, color: COL.naranja }}>⏳ AÑOS</div>}</>}
    </AbsoluteFill>
  );
};
export const Cierre: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fS = pal("sostiene") ?? 40, fG = pal("guardalo") ?? 80, fM = pal("mandaselo") ?? 100;
  const hoja = interpolate(f, [fM, d - 10], [0.02, 1], cl);
  return (
    <>
      <FondoRx claro={1} />
      <Cam s={1.0} px={600} py={1180}><Dedo k={1} calor={0.6} glowA2={1} etiquetas={1} /></Cam>
      {f < fG && <Grande t={"LO QUE TE SOSTIENE\nES UN ANILLO"} top={1400} k={f - fS} tam={80} fondo={COL.amarillo} />}
      {f >= fG && f < fM && <Guardar k={(f - fG) / 20} y={1150} />}
      <HojaEnviar k={f >= fM ? hoja : 0} para="Al que arquea a muerte 😬" />
    </>
  );
};
