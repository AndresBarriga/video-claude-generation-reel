// 1 · «Fermín no es débil. Fermín es una puerta.» Ya en la pared desde el fotograma 0: estira el brazo hacia la presa
// amarilla, no llega, el cuerpo se abre como una puerta (chirrido), pierde las presas y queda colgando de la cuerda, girando.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Fermin, POSES_FERMIN, mezclaPose } from "../../piezas/Fermin";
import { BarraGiro, Cam, H, Objetivo, Pared, PRESAS_VIA, Svg, Titular, cl, sale, type P } from "./comun";

/** Fotograma en que suelta (lo usa también la escena 2 para rebobinar). */
export const SUELTA = 56;
/** Estado colgado al final de la caída (cadera y apertura). */
export const COLGADO = { y: H.y + 230, abre: 0.18 };

export const Abre: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame();
  const tiembla = f < SUELTA ? Math.sin(f * 1.9) * 6 * (0.4 + f / SUELTA) : 0;
  const cae = sale((f - SUELTA) / 12);
  // apertura: vaivén que crece y luego se abre del todo; tras caer, gira colgado y se amortigua
  const abre = f < 34 ? 0.06 + 0.1 * (f / 34) + 0.04 * Math.sin(f / 3)
    : f < SUELTA ? interpolate(f, [34, SUELTA], [0.2, 0.95], cl)
    : COLGADO.abre + 0.6 * Math.cos((f - SUELTA) / 5) * Math.exp(-(f - SUELTA) / 12);
  const base = { ...POSES_FERMIN.puerta, manoI: { x: POSES_FERMIN.puerta.manoI.x + 30, y: POSES_FERMIN.puerta.manoI.y + 30 + tiembla } };
  const pose = f < SUELTA ? base : mezclaPose(base, POSES_FERMIN.colgado, cae);
  const y = H.y + (COLGADO.y - H.y) * cae;
  const giro = interpolate(f, [0, SUELTA], [0.35, 1], cl);
  const k2 = (pal("puerta.") ?? 30) - 2;
  return (
    <>
      <Svg>
        <Cam z={1 + 0.05 * (f / 90)}>
          <Pared presas={PRESAS_VIA} />
          <Objetivo f={f} />
          <Fermin x={H.x} y={y} s={1.15} pose={pose} abre={abre} cara={f < 30 ? "esfuerzo" : "miedo"} mira={f < 30 ? 0 : -1} cuerdaX={H.x + 4} sombra />
        </Cam>
        <BarraGiro v={giro} />
      </Svg>
      <Titular l1="FERMÍN NO ES DÉBIL." l2="ES UNA PUERTA." k2={f - k2} />
    </>
  );
};
