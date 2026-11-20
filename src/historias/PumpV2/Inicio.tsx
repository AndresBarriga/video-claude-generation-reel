// Gancho (los dedos se despegan uno a uno), reencuadre (el MISMO plano se vuelve rayos X: ✗ FLOJO → ✓ SIN RIEGO) y lista (aparecen los candados).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Pasos } from "../../piezas/kit";
import { Macro } from "./Macro";
import { Chip, ei, type P } from "./comun";

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fF = pal("flojo") ?? 60;
  return (
    <AbsoluteFill>
      <Macro bomba={1.5 * ei(f, 0, 30, 0, 1)} aprieta={0.8 * ei(f, 0, 30, 0, 1)} flujo={1 - 0.7 * ei(f, 0, 30, 0, 1)} tiembla={ei(f, fF - 10, fF, 0, 1)} z={1.0 + 0.1 * ei(f, 0, d, 0, 1)}>
        <Chip x={540} y={1500} t="✗ FLOJO" col="#FF8E7E" o={ei(f, fF - 2, fF + 6, 0, 1)} />
      </Macro>
    </AbsoluteFill>
  );
};

export const Reencuadre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), r = ei(f, 0, 14, 0, 1);
  return (
    <AbsoluteFill>
      <Macro bomba={1.5} aprieta={0.8 + 0.2 * r} flujo={0.2} residuos={ei(f, 10, d, 0, 0.6)} z={1.1 + 0.05 * r} tiembla={0.6}>
        <Chip x={540} y={1500} t="✓ SIN RIEGO" col="#8FE0AE" o={ei(f, 4, 12, 0, 1)} />
      </Macro>
    </AbsoluteFill>
  );
};

export const Lista: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fT = pal("tres") ?? 40;
  return (
    <AbsoluteFill>
      <Macro bomba={1.0} aprieta={0.5} flujo={0.5} residuos={0.3} z={1.0} />
      <Pasos actual={0} y={430} k={(f - fT + 4) / 8} />
    </AbsoluteFill>
  );
};
