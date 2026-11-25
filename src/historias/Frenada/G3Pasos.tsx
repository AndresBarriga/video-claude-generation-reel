// E81 · escenas 5-7: los tres pasos de Petzl, cada uno con el contador 1/3 → 3/3.
// Uno: mano de freno en la cuerda (brilla). Dos: ÍNDICE bajo el borde y PULGAR en la leva solo mientras da (rótulos ≥1,5 s),
// con Dani de cuerpo entero en el recuadro. Tres: Irene chapa (plano general) → pulgar fuera → la mano de freno sigue en la cuerda.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, accChapar, sogaChapar, aparato, suave } from "../../piezas/kit";
import { Gym, PP, PuestoG, Senal, Contexto, Contador3, VS, XA, I, P0, IRENE, DANI, VERDE, NAR, TAB, PEST, FRENO, cl, type P } from "./G3comun";

export const GUno: React.FC<P> = () => {
  const f = useCurrentFrame(), da = 0.5 - 0.5 * Math.cos(f / 6);
  return (
    <>
      <PP><PuestoG modo="normal" da={da} corre={f * 10} brillo={0.6 + 0.4 * Math.sin(f / 4)} /></PP>
      <Senal t="MANO DE FRENO" x={370} y={1250} tx={FRENO.x - 40} ty={FRENO.y - 120 * da} o={(f - 6) / 6} col={VERDE} w={500} />
      <Contador3 n={1} k={f + 2} />
    </>
  );
};
export const GDos: React.FC<P> = ({ d, pal }) => {
  // índice al empezar (≥1,5 s) · pulgar en la palabra «pulgar» (hasta el final) · la leva se aprieta en «instante» y se suelta tras «das»
  const f = useCurrentFrame(), fP = (pal("pulgar") ?? Math.round(d * 0.35)) - 2, fI = (pal("instante,") ?? Math.round(d * 0.6)) - 2, fD = (pal("das.") ?? d - 20) + 10;
  const pisa = interpolate(f, [fI, fI + 5, fD, fD + 6], [0, 1, 1, 0], cl), corre = interpolate(f, [fI + 5, fD], [0, 900], cl);
  return (
    <>
      <PP><PuestoG modo="rapido" pisa={pisa} corre={corre} hiDedos={f < fP} hiPulgar={pisa > 0.5} /></PP>
      <Senal t="ÍNDICE" x={880} y={440} tx={PEST.x + 10} ty={PEST.y + 10} o={(f - 4) / 6} col={VERDE} w={250} />
      <Senal t="PULGAR" x={210} y={1050} tx={TAB.x} ty={TAB.y} o={(f - fP) / 6} col={NAR} w={260} />
      <Contexto x={220} y={1290} feed={pisa} k={(f - 8) / 6} />
      <Contador3 n={2} k={f + 2} />
    </>
  );
};
export const GTres: React.FC<P> = ({ d, pal }) => {
  // plano general: Irene chapa en «chapa» → corte al puesto en «fuera»: el pulgar sale, la mano de freno brilla en «siempre»
  const f = useCurrentFrame(), fC = (pal("chapa,") ?? 20) + 2, fF = (pal("fuera.") ?? 50) - 3, fS = pal("siempre") ?? d - 40;
  if (f < fF) {
    const t = interpolate(f, [0, fC], [0.45, 0.78], cl), a = accChapar(VS, P0, I, t), clic = f >= fC - 2;
    return (
      <>
        <Gym cx={(XA + P0.x) / 2 + 60} cy={(VS.pie + P0.y) / 2 + 40} z={0.95}>
          <Asegurador via={VS} x={XA} aspecto={DANI} alza={1} feed={clic ? 0.2 : 1} comba={0.15} cara="serio" />
          <Soga pts={sogaChapar(VS, aparato(VS, XA), I, P0, a)} />
          <Persona p={P0} ang={a.ang} aspecto={IRENE} cara={clic ? "alivio" : "esfuerzo"} />
          {clic && f < fC + 10 && <circle cx={VS.mos(I).x} cy={VS.mos(I).y} r={40 + (f - fC) * 9} fill="none" stroke={VERDE} strokeWidth={10} opacity={1 - (f - fC) / 10} />}
        </Gym>
        <Contador3 n={3} k={f + 2} />
      </>
    );
  }
  const g = f - fF, pisa = 1 - suave(g / 6), normal = g >= 7;
  return (
    <>
      <PP><PuestoG modo={normal ? "normal" : "rapido"} pisa={pisa} hiPulgar={!normal} brillo={f >= fS - 2 ? 0.6 + 0.4 * Math.sin(f / 4) : 0} /></PP>
      {f < fS - 2 && <Senal t="PULGAR FUERA" x={250} y={1060} tx={TAB.x} ty={TAB.y} o={(g + 6) / 6} col={VERDE} w={420} />}
      {normal && <Senal t="FRENO EN LA CUERDA" x={420} y={1250} tx={FRENO.x - 40} ty={FRENO.y} o={(f - fS + 2) / 6} col={VERDE} w={640} />}
      <Contador3 n={3} k={12} />
    </>
  );
};
