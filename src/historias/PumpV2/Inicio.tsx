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
      <Macro bomba={0.9 + 0.6 * ei(f, 0, d, 0, 1)} abre={0.15 + 0.85 * ei(f, 0, fF, 0, 1)} calor={0.1 + 0.4 * ei(f, 0, d, 0, 1)} z={1.05 + 0.08 * ei(f, 0, d, 0, 1)}>
        <Chip x={540} y={1500} t="✗ FLOJO" col="#FF8E7E" o={ei(f, fF - 2, fF + 6, 0, 1)} />
      </Macro>
    </AbsoluteFill>
  );
};

export const Reencuadre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), r = ei(f, 0, 14, 0, 1);
  return (
    <AbsoluteFill>
      <Macro bomba={1.5} abre={1} calor={0.5} rayos={r} aprieta={1} flujo={0.15} residuos={ei(f, 10, d, 0, 0.6)} z={1.13}>
        <Chip x={540} y={1500} t="✓ SIN RIEGO" col="#8FE0AE" o={ei(f, 4, 12, 0, 1)} />
      </Macro>
    </AbsoluteFill>
  );
};

export const Lista: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fT = pal("tres") ?? 40;
  return (
    <AbsoluteFill>
      <Macro bomba={1.2} abre={0.3} calor={0.3} rayos={1} aprieta={0.6} flujo={0.5} residuos={0.3} z={1.0} />
      <Pasos actual={0} y={430} k={(f - fT + 4) / 8} />
    </AbsoluteFill>
  );
};
