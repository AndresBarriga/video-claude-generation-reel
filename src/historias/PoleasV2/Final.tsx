// E68 · cómo evitarla (3 fichas + músculo semanas / poleas años) y cierre («lo que te sostiene es un anillo» + guardar/enviar).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Guardar, HojaEnviar } from "../../piezas/kit";
import { Dedo, geom } from "./Dedo";
import { FondoRx, Cam, Grande, Ficha, cl, COL, F, type P } from "./comun";

const G = geom(1), CX = (G.mcp.x + G.pip.x) / 2, CY = (G.mcp.y + G.pip.y) / 2;
const BarraT: React.FC<{ t: string; v: number; top: number; col: string; fin: string }> = ({ t, v, top, col, fin }) => (
  <div style={{ position: "absolute", top, left: 70, width: 940 }}>
    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 48, color: "#fff", marginBottom: 8 }}>{t} <span style={{ color: col }}>{v >= 0.99 ? fin : ""}</span></div>
    <div style={{ height: 56, borderRadius: 28, background: "rgba(255,255,255,.12)", border: "6px solid #fff", overflow: "hidden" }}><div style={{ width: `${v * 100}%`, height: "100%", background: col }} /></div>
  </div>
);
export const Consejos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fC = pal("calienta") ?? 20, fA = pal("abierto") ?? 60, fS = pal("sube") ?? 100, fD = pal("fuertes") ?? 140, fPo = pal("poleas") ?? 170;
  const barras = f >= fD - 4;
  const m = interpolate(f, [fD, fD + 12], [0, 1], cl), p = interpolate(f, [fPo, fPo + 60], [0, 0.35], cl);
  return (
    <>
      <FondoRx />
      <Cam s={0.78} px={(geom(0.15).meta0.x + geom(0.15).tip.x) / 2} py={(geom(0.15).meta0.y + geom(0.15).tip.y) / 2} cy={barras ? 640 : 760}><Dedo k={0.15} calor={0.1} xray={1} /></Cam>
      <AbsoluteFill style={{ background: "rgba(5,10,28,.35)" }} />
      {!barras && <>
        <Ficha icono="mano" texto="CALIENTA" x={200} y={1460} k={f - fC} ok s={0.95} />
        <Ficha icono="dedos" texto="ABIERTO" x={540} y={1460} k={f - fA} ok s={0.95} />
        <Ficha icono="bateria" texto="POCO A POCO" x={880} y={1460} k={f - fS} ok s={0.95} />
      </>}
      {barras && <><BarraT t="TUS DEDOS" v={m} top={1240} col={COL.verde} fin="· SEMANAS" /><BarraT t="TUS POLEAS" v={p} top={1420} col={COL.naranja} fin="" />
        {f >= fPo + 6 && <div style={{ position: "absolute", top: 1560, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 64, color: COL.naranja }}>⏳ AÑOS</div>}</>}
    </>
  );
};
export const Cierre: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fS = pal("sostiene") ?? 40, fG = pal("guardalo") ?? 80, fM = pal("mandaselo") ?? 100;
  const hoja = interpolate(f, [fM, d - 10], [0.02, 1], cl);
  return (
    <>
      <FondoRx claro={1} />
      <Cam s={1.15} px={CX - 30} py={CY + 140}><Dedo k={1} calor={0.6} glowA2={1} etiquetas={1} /></Cam>
      {f < fG && <Grande t={"LO QUE TE SOSTIENE\nES UN ANILLO"} top={1400} k={f - fS} tam={80} fondo={COL.amarillo} />}
      {f >= fG && f < fM && <Guardar k={(f - fG) / 20} y={1150} />}
      <HojaEnviar k={f >= fM ? hoja : 0} para="Al que arquea a muerte 😬" />
    </>
  );
};
