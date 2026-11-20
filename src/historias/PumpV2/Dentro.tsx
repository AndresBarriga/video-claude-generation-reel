// Por dentro (v3): viaje continuo. Antebrazo en radiografía → zoom al músculo que se hincha → entramos en la arteria: el músculo la
// pisa, los glóbulos se atascan, se acumula lo que quema → al salir, el brazo tiembla («la mano se abre»). Pajita pisada como analogía visual.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FondoInfo } from "../../piezas/kit";
import { Chip, Svg, ei, type P } from "./comun";
import { Rx } from "./Rx";
import { Vaso, Pajita } from "./Vaso";

export const Dentro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fH = pal("hincha") ?? 40, fV = pal("vasos") ?? 90, fS = pal("sangre") ?? 120, fQ = pal("quema") ?? 170, fA = pal("abre") ?? 205;
  const entra = ei(f, fH - 10, fH + 10, 0, 1), sale = ei(f, fA - 8, fA + 4, 0, 1);
  const zoomRx = 1.1 + 2.4 * entra, dentro = entra * (1 - sale);
  const pinch = ei(f, fH, fV + 6, 0, 1), atasco = ei(f, fS - 6, fQ, 0, 1);
  const o = (a: number, b: number) => ei(f, a, a + 6, 0, 1) * (1 - ei(f, b, b + 6, 0, 1));
  return (
    <AbsoluteFill>
      <FondoInfo />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - dentro }}><Rx pump={0.5 + 0.5 * pinch} aprieta={pinch} flujo={1 - 0.8 * atasco} residuos={atasco} z={sale > 0 ? 1.1 : zoomRx} tiembla={sale} /></div>
      <div style={{ position: "absolute", inset: 0, opacity: dentro, transform: `scale(${0.6 + 0.4 * entra + 0.05 * ei(f, fH, fA, 0, 1)})` }}>
        <Vaso pinch={Math.max(pinch, atasco)} flujo={1 - 0.85 * atasco} residuos={ei(f, fQ - 8, fA, 0, 1)} />
      </div>
      <Pajita k={o(fV - 24, fS) * 1} p={ei(f, fV - 16, fV, 0, 1)} />
      <Svg>
        <Chip x={540} y={600} t="EL MÚSCULO SE HINCHA" col="#FF9A3C" o={o(fH - 8, fV - 20)} />
        <Chip x={540} y={600} t="PISA LA ARTERIA" col="#FF9A3C" o={o(fV - 20, fS - 2)} />
        <Chip x={540} y={600} t="LA SANGRE SE ATASCA" col="#FF8A8A" o={o(fS - 2, fQ - 4)} />
        <Chip x={540} y={600} t="NO SALE LO QUE QUEMA" col="#E6E35A" o={o(fQ - 4, fA - 8)} />
        <Chip x={540} y={600} t="LA MANO SE ABRE" col="#9EC5FF" o={o(fA - 4, d + 10)} />
      </Svg>
    </AbsoluteFill>
  );
};
