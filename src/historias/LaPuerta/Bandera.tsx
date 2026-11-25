// 4 · «así que le enseñamos un truco nuevo: la bandera. La pierna libre, al otro lado de la bisagra.»
// Cierra la puerta; en «bandera» la pierna izquierda cruza estirada al otro lado de la línea (la cadera sube y se acerca),
// el pie se apoya en la pared (polvo) y la línea pasa a verde. La mano izquierda queda a un palmo de la presa.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Fermin, POSES_FERMIN, apoyos, mezclaPose, type PoseFermin } from "../../piezas/Fermin";
import { Anillo, BarraGiro, COL, Cam, Etiqueta, H, H2, Linea, Objetivo, Pared, Polvo, PRESAS_VIA, S, Svg, sale, type P } from "./comun";

/** Bandera con la mano izquierda aún sin coger la presa (`falta` 0–1 = cuánto le falta). */
export const banderaCasi = (falta: number): PoseFermin => {
  const b = POSES_FERMIN.bandera;
  return { ...b, manoI: { x: b.manoI.x + 30 * falta, y: b.manoI.y + 34 * falta } };
};

export const Bandera: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tB = pal("bandera.") ?? Math.round(d * 0.4), tO = pal("otro") ?? Math.round(d * 0.75);
  const k = sale((f - tB + 4) / 22);
  const pose = mezclaPose(POSES_FERMIN.puerta, banderaCasi(1), k);
  const x = H.x + (H2.x - H.x) * k, y = H.y + (H2.y - H.y) * k;
  const pie = apoyos(POSES_FERMIN.bandera, H2.x, H2.y, S).pieI;
  const apoyo = tB + 18;
  return (
    <>
      <Svg>
        <Cam z={1.04 - 0.03 * (f / d)}>
          <Pared presas={PRESAS_VIA} />
          <Objetivo f={f} />
          <Linea k={1} verde={sale((f - tB - 8) / 14)} />
          <Fermin x={x} y={y} s={S} pose={pose} abre={Math.max(0, 0.1 - f / 60)} cara={f < tB ? "normal" : "esfuerzo"} mira={f < tB - 10 ? -1 : 0} cuerdaX={H.x + 4} />
          <Polvo p={pie} k={f - apoyo} />
          <Anillo p={pie} k={f - tO} col={COL.verde} />
        </Cam>
        <BarraGiro v={0.95 - 0.25 * k} />
      </Svg>
      <Etiqueta x={540} y={480} t="LA SOLUCIÓN" k={f < tB - 2 ? f + 1 : 0} c={COL.verde} tam={36} />
      <Etiqueta x={540} y={480} t="LA BANDERA" k={f - tB} c={COL.verde} tam={44} />
    </>
  );
};
