// E72 · gancho (cae desde el fotograma 6; «¿MIEDO A CAER?» ya en el 0), material vs cabeza (2 toneladas), y qué te hace el miedo.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE } from "../../piezas/kit";
import { Gym, VIA, LOLA, LEO, XA, caer, cl, pop, COL, F, type P } from "./comun";
import { Ficha, Grande } from "./Ui";

export const P0 = VIA.cadera(VIA.mos(3).y - 70);
/** Caída de Lola desde P0 (chapa 3), k fotogramas; `tiempo` permite repetirla. */
export const Cae: React.FC<{ k: number; z?: number; claro?: number; cara?: "miedo" | "alivio" }> = ({ k, z = 1.45, claro = 0, cara }) => {
  const s = caer(k, P0, 3, 0.4), cy = interpolate(k, [0, 30], [P0.y - 40, P0.y + 300], cl);
  return (
    <>
      <Gym cx={P0.x + 170} cy={cy} z={z} sh={s.sh * 0.6}>
        <Asegurador via={VIA} aspecto={LEO} {...s.aseg} alza={1} />
        <Soga pts={s.pts} />
        <Persona p={s.p} ang={k <= 0 ? POSE.agarreMira : s.ang} aspecto={LOLA} cara={cara ?? (k <= 0 ? "miedo" : s.cara)} rot={s.rot} tiembla={k <= 0 ? Math.sin(k * 3) * 3 : 0} />
      </Gym>
      {claro > 0 && <AbsoluteFill style={{ background: `rgba(255,248,238,${claro})` }} />}
    </>
  );
};
export const Gancho: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fQ = pal("quita") ?? 34;
  return (
    <>
      <Cae k={f - 8} z={1.9} />
      <Grande t="¿MIEDO A CAER?" top={1380} k={fQ - 2 - f > 0 ? 12 : 0} tam={118} />
      <Grande t={"SE QUITA\nCAYENDO"} top={1330} k={f - fQ + 2} tam={124} fondo={COL.verde} color="#fff" />
    </>
  );
};
export const Material: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fM = pal("material") ?? 10, fT = pal("dos") ?? 50, fC = pal("cabeza") ?? 120;
  const tacha = interpolate(f, [fC - 4, fC + 6], [0, 1], cl), cuelga = f - fT;
  const bote = cuelga < 0 ? -400 : 40 * Math.exp(-cuelga / 8) * Math.cos(cuelga / 2.2);
  return (
    <>
      <Cae k={70 + f} claro={0.55} cara="alivio" />
      <Ficha icono="mosqueton" texto="MATERIAL" x={300} y={900} k={f - fM} ok={f >= fC ? false : undefined} tachar={tacha} s={1.05} />
      {cuelga >= 0 && f < fC + 4 && (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <path d={`M300 1060 V${1180 + bote}`} stroke={COL.tinta} strokeWidth={10} />
          <g transform={`translate(300 ${1270 + bote})`}><path d="M-120 -90 H120 L150 110 H-150 Z" fill="#4A5568" stroke={COL.tinta} strokeWidth={10} strokeLinejoin="round" /><text y={50} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff">2 t</text></g>
        </svg>
      )}
      <Grande t="≈ 2 TONELADAS" top={1470} k={f - fT} tam={96} fondo={COL.amarillo} />
      <Ficha icono="cabeza" texto="CABEZA" x={700} y={900} k={f - fC} ok s={1.05} />
    </>
  );
};
const BarraH: React.FC<{ t: string; v: number; top: number; col: string; tope?: boolean }> = ({ t, v, top, col, tope }) => (
  <div style={{ position: "absolute", top, left: 60, width: 820 }}>
    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 46, color: COL.tinta, marginBottom: 6 }}>{t}</div>
    <div style={{ height: 60, borderRadius: 30, background: COL.crema, border: `7px solid ${COL.tinta}`, overflow: "hidden" }}><div style={{ width: `${v * 100}%`, height: "100%", background: col }} /></div>
    {tope && <div style={{ position: "absolute", left: `${v * 100}%`, top: 40, transform: "translate(-50%, 0)", fontSize: 76 }}>✋</div>}
  </div>
);
export const Bucle: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fA = pal("agarrotas") ?? 10, fCa = pal("cansas") ?? 30, fL = pal("limite") ?? 60, fP = pal("para") ?? 80;
  const k = (a: number) => interpolate(f, [a, a + 18], [0, 1], cl);
  const cuerpo = k(fP), cab = Math.min(0.58, k(fP) * 1.2);
  const p = VIA.cadera(VIA.mos(2).y - 40);
  return (
    <>
      <Gym cx={p.x + 160} cy={p.y + 80} z={1.7}>
        <Asegurador via={VIA} x={XA} aspecto={LEO} />
        <Soga pts={[{ x: XA + 40, y: VIA.pie - 40 }, VIA.mos(0), VIA.mos(1), VIA.mos(2), { x: p.x + 20, y: p.y + 10 }]} />
        <Persona p={p} ang={POSE.agarreMira} aspecto={LOLA} cara="esfuerzo" tiembla={Math.sin(f * 2.1) * (f > fA ? 5 : 1)} />
      </Gym>
      <AbsoluteFill style={{ background: "rgba(255,248,238,0.45)" }} />
      <Ficha icono="puno" texto="AGARROTAS" x={210} y={820} k={f - fA} s={0.8} />
      <Ficha icono="bateria" texto="TE CANSAS" x={480} y={820} k={f - fCa} s={0.8} />
      <Ficha icono="mano" texto="NO LLEGAS" x={750} y={820} k={f - fL} s={0.8} />
      {f >= fP - 4 && <div style={{ opacity: pop(f - fP + 4) }}><BarraH t="CUERPO" v={cuerpo} top={1180} col={COL.verde} /><BarraH t="CABEZA" v={cab} top={1340} col={COL.rojo} tope={cab > 0.5} /></div>}
      {void d}
    </>
  );
};
