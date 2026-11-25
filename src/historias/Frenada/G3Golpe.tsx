// E81 · escenas 3-4. Golpe: la cuerda sale de golpe hacia arriba (flecha) y el grigri se clava (causa visible).
// Agarra: mano rodeando el aparato (✗), leva apretada (✗) y medio segundo de cuerda corriendo por el aparato, sin desenlace (✗ FRENO ANULADO).
// La mano de freno está SIEMPRE dibujada en la cuerda (abajo).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Foco } from "../../piezas/kit";
import { PP, PuestoG, Marca, Contexto, ROJO, TAB, golpe, cl, type P } from "./G3comun";

const Flecha: React.FC<{ x: number; y: number; o: number; dy: number }> = ({ x, y, o, dy }) => o <= 0 ? null : (
  <g opacity={Math.min(1, o)} transform={`translate(${x} ${y - dy})`}>
    <path d="M0 120 V-60 M-46 -14 L0 -66 L46 -14" stroke="#050B14" strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 120 V-60 M-46 -14 L0 -66 L46 -14" stroke="#fff" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const GGolpe: React.FC<P> = ({ pal, d }) => {
  // tirón: la cuerda del lado de Irene sube de golpe (rayas de velocidad) y al decir «frenar» se para en seco (el rótulo queda >0,8 s)
  const f = useCurrentFrame(), fG = (pal("golpe,") ?? 22) - 4, fB = pal("frenar") ?? d - 30;
  const corre = f < fG ? f * 6 : f < fB ? fG * 6 + (f - fG) * 70 : fG * 6 + (fB - fG) * 70;
  const clava = f >= fB;
  return (
    <>
      <PP sh={golpe(f, fB, 16)} mal={clava ? 1 : 0}>
        <PuestoG modo="normal" corre={corre} da={f < fB && f >= fG ? 1 : 0.3} leva={clava ? ROJO : undefined} otra={false} />
        {f >= fG && f < fB && [0, 1, 2].map((i) => <path key={i} d={`M${560 + i * 40} ${470 - ((f * 60 + i * 70) % 200)} v-90`} stroke="#050B14" strokeWidth={9} strokeLinecap="round" opacity={0.45} />)}
        <Flecha x={430} y={470} o={(f - fG) / 4} dy={f < fB ? ((f - fG) % 8) * 6 : 0} />
        {clava && <Foco x={TAB.x + 10} y={TAB.y - 20} r={90} color={ROJO} k={(f - fB) / 4} />}
      </PP>
      <Contexto k={f / 6} x={210} y={1270} feed={f >= fG && f < fB ? 1 : 0} />
      {!clava && <Marca t="TIRÓN DE GOLPE" ok={false} top={1430} k={f - fG} tam={58} />}
      {clava && <Marca t="FRENA COMO SI CAYERA" ok={false} top={1430} k={f - fB + 1} tam={64} />}
    </>
  );
};
export const GAgarra: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fE = (pal("entero") ?? 12) - 2, fL = (pal("aprietas") ?? Math.round(d * 0.5)) - 2, fN = (pal("anulas") ?? Math.round(d * 0.7)) - 3;
  // medio segundo (15 fotogramas) de cuerda corriendo por el aparato; después queda quieta, en rojo: no hay desenlace
  const corre = f < fN ? Math.max(0, f - fE) * 8 : (fN - fE) * 8 + Math.min(15, f - fN) * 90, corriendo = f >= fN && f < fN + 15;
  const leva = f >= fL;
  return (
    <>
      <PP mal={f >= fN ? 1 : 0} sh={corriendo ? Math.sin(f * 2.4) * 5 : 0}>
        <PuestoG modo="mal" corre={corre} leva={leva ? ROJO : undefined} />
        {leva && <Foco x={TAB.x - 40} y={TAB.y - 40} r={110} color={ROJO} k={(f - fL) / 4} />}
        {corriendo && [0, 1, 2, 3].map((i) => <path key={i} d={`M${470 + i * 34} ${430 - ((f * 70 + i * 60) % 220)} v-100`} stroke="#050B14" strokeWidth={9} strokeLinecap="round" opacity={0.5} />)}
      </PP>
      {f < fL && <Marca t="AGARRADO ENTERO" ok={false} top={430} k={f - fE} />}
      {f >= fL && f < fN && <Marca t="LEVA APRETADA" ok={false} top={430} k={f - fL + 2} />}
      {f >= fN && <Marca t="FRENO ANULADO" ok={false} top={430} k={f - fN + 2} tam={76} />}
      {void interpolate}{void cl}
    </>
  );
};
