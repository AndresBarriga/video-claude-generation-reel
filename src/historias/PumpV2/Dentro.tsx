// Por dentro (corte grande del antebrazo): al apretar se hincha y estrecha sus vasos → entra menos sangre → se acumula lo que quema → la mano se abre.
import React from "react";
import { useCurrentFrame } from "remotion";
import { BarraBloques, Camara, Chip, PM, Svg, ei, type P } from "./comun";
import { FondoInfo } from "../../piezas/kit";
import { Rx } from "./Rx";

export const Dentro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fH = pal("hincha") ?? 30, fV = pal("vasos") ?? 70, fS = pal("sangre") ?? 110, fQ = pal("quema") ?? 150, fA = pal("abre") ?? 200;
  const aprieta = ei(f, 0, fV + 6, 0.2, 1), flujo = 1 - 0.9 * ei(f, fS - 6, fQ, 0, 1), res = ei(f, fQ - 6, fA, 0, 1);
  const bomba = 0.5 + 0.7 * ei(f, fH - 6, fV, 0, 1) + 0.3 * res, abre = ei(f, fA - 4, fA + 10, 0, 1);
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  return (
    <Camara d={d} empuje={0.04} foco="50% 52%">
      
      <FondoInfo />
      <Rx pump={Math.min(1, bomba / 1.5)} aprieta={aprieta} flujo={flujo} residuos={res} z={1.25} dy={60} tiembla={abre} />
      <Svg>
        <Chip x={540} y={600} t="SE HINCHA" col="#FF9A3C" o={o(fH - 4, fV - 4)} />
        <Chip x={540} y={600} t="APRIETA LOS VASOS" col={PM.arteria} o={o(fV - 4, fS - 4)} />
        <Chip x={540} y={600} t="NO SALE LO QUE QUEMA" col="#FF6A1F" o={o(fQ - 4, fA)} />
        <Chip x={540} y={600} t="LA MANO SE ABRE" col={PM.hielo} o={o(fA - 2, d + 10)} />
        <BarraBloques x={990} y0={560} y1={1220} v={5 * flujo} n={5} ancho={50} cols={[PM.arteria]} etiqueta="SANGRE" o={ei(f, fS - 10, fS, 0, 1)} />
      </Svg>
    </Camara>
  );
};
