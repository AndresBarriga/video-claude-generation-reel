// 5 · «Palanca más corta, mucho menos giro. Y además, su pie empuja la pared: un contragiro.»
// La cota se encoge de rojo a verde; la barra GIRO baja; luego la flecha verde de contragiro sale del pie apoyado.
// Seguridad (≥1,5 s): rótulo sobre la rodilla de apoyo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Fermin, POSES_FERMIN, apoyos } from "../../piezas/Fermin";
import { banderaCasi } from "./Bandera";
import { Cota } from "./Gira";
import { BarraGiro, COL, Cam, Etiqueta, FlechaGiro, H, H2, Linea, Objetivo, Pared, PRESAS_VIA, S, Svg, cl, mezcla, sale, xLinea, type P } from "./comun";

export const Contragiro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tC = pal("corta,") ?? Math.round(d * 0.12), tM = pal("menos") ?? Math.round(d * 0.25), tE = pal("empuja") ?? Math.round(d * 0.6), tCg = pal("contragiro.") ?? Math.round(d * 0.85);
  const yC = H2.y - 30;
  // el peso (cadera) pasa de lejos de la línea a cerca: la cota se acorta
  const enc = sale((f - tC + 4) / 16);
  const x0 = interpolate(enc, [0, 1], [H.x - 120, xLinea(yC) - 110], cl);
  const colCota = mezcla(COL.rojo, COL.verde, enc);
  const pie = apoyos(POSES_FERMIN.bandera, H2.x, H2.y, S).pieI;
  const cota = f < tE - 4;
  return (
    <>
      <Svg>
        <Cam z={1.01 + 0.04 * (f / d)} cy={1150}>
          <Pared presas={PRESAS_VIA} />
          <Objetivo f={f} />
          <Linea k={1} verde={1} />
          <Fermin x={H2.x} y={H2.y} s={S} pose={banderaCasi(1)} cara="esfuerzo" />
          {cota && <Cota x0={x0} y={yC} k={1} col={colCota} />}
          <FlechaGiro x={pie.x - 30} y={pie.y + 140} k={(f - tE) / 16} col={COL.verde} s={0.7} espejo />
        </Cam>
        <BarraGiro v={interpolate(f, [tM, tM + 16], [0.7, 0.28], cl)} />
      </Svg>
      {cota && <Etiqueta x={x0 + 60} y={yC + 70} t="PALANCA CORTA" k={f - tC} c={colCota} tam={32} />}
      <Etiqueta x={Math.min(860, pie.x - 120)} y={pie.y + 260} t="CONTRAGIRO" k={f - tCg} c={COL.verde} tam={34} />
      <Etiqueta x={540} y={480} t="RODILLA DE APOYO HACIA DONDE APUNTA EL PIE" k={f >= 6 && f < tE + 30 ? f - 6 : 0} tam={29} />
    </>
  );
};
