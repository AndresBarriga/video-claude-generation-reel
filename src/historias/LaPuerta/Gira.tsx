// 3 · «La gravedad hace girar a Fermín sobre esa bisagra. Palanca larga, giro enorme. Fermín no hizo las cuentas,»
// Cámara lenta: se abre sobre la línea (flecha roja). En «Palanca» vuelve casi a la pared y aparece la cota del peso a la
// línea (horizontal). En «giro» la barra GIRO sube. En «cuentas» gira la cara a cámara.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Fermin } from "../../piezas/Fermin";
import { BarraGiro, COL, Cam, Etiqueta, FlechaGiro, H, Linea, Objetivo, Pared, PRESAS_VIA, Svg, T, cl, sale, xLinea, type P } from "./comun";

/** Cota horizontal del peso (cadera) a la línea de la bisagra. */
export const Cota: React.FC<{ x0: number; y: number; k: number; col: string }> = ({ x0, y, k, col }) => {
  const e = sale(k);
  if (e <= 0) return null;
  const x1 = x0 + (xLinea(y) - x0) * e;
  return (
    <g>
      <path d={`M${x0} ${y} L${x1} ${y}`} stroke={col} strokeWidth={10} strokeLinecap="round" />
      <path d={`M${x1} ${y - 22} L${x1} ${y + 22}`} stroke={col} strokeWidth={8} strokeLinecap="round" opacity={e} />
      <circle cx={x0} cy={y} r={17} fill="#fff" stroke={T} strokeWidth={6} />
    </g>
  );
};

export const Gira: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tPa = pal("Palanca") ?? Math.round(d * 0.45), tG = pal("giro") ?? Math.round(d * 0.58), tC = pal("cuentas,") ?? Math.round(d * 0.85);
  const abre = f < tPa - 14 ? 0.6 * sale(f / 70) : interpolate(f, [tPa - 14, tPa], [0.6 * sale((tPa - 14) / 70), 0.1], cl);
  const flecha = f < tPa - 10 ? (f - 4) / 22 : 1 - (f - tPa + 10) / 8;
  const yC = H.y - 60;
  return (
    <>
      <Svg>
        <Cam z={1 + 0.06 * (f / d)}>
          <Pared presas={PRESAS_VIA} />
          <Objetivo f={f} />
          <Linea k={1} pulso={f < tPa ? 0.5 + 0.5 * Math.sin(f / 4) : 0} />
          <Fermin x={H.x} y={H.y} s={1.15} pose="puerta" abre={abre} cara={f >= tC ? "miedo" : "esfuerzo"} mira={f >= tC - 2 ? -1 : 0} cuerdaX={H.x + 4} sombra />
          <FlechaGiro x={300} y={1080} k={flecha} s={1.2} />
          <Cota x0={H.x - 45} y={yC} k={(f - tPa) / 12} col={COL.rojo} />
        </Cam>
        <BarraGiro v={f < tG ? 0.55 + 0.1 * sale(f / 60) : interpolate(f, [tG, tG + 12], [0.65, 1], cl)} />
      </Svg>
      <Etiqueta x={540} y={480} t="CÁMARA LENTA" k={f < tPa - 12 ? f + 1 : 0} tam={30} />
      <Etiqueta x={(H.x + xLinea(yC)) / 2} y={yC + 70} t="PALANCA LARGA" k={f - tPa} c={COL.rojo} tam={32} />
    </>
  );
};
