// Plano protagonista (v2): antebrazo en radiografía sobre fondo oscuro, sin mano. Lo comparten gancho, reencuadre, lista, cronos y CTA.
// Se mantiene la interfaz de la v1 (bomba/rayos/abre se traducen o se ignoran) para no tocar las escenas.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FondoInfo } from "../../piezas/kit";
import { Svg } from "./comun";
import { Rx } from "./Rx";

export const Macro: React.FC<{ bomba: number; abre?: number; calor?: number; rayos?: number; aprieta?: number; flujo?: number; residuos?: number; z?: number; verde?: number; tiembla?: number; children?: React.ReactNode }> = ({ bomba, aprieta = 0.3, flujo = 0.6, residuos = 0, z = 1, verde = 0, tiembla = 0, children }) => (
  <AbsoluteFill>
    <FondoInfo />
    <Rx pump={Math.min(1, bomba / 1.5)} aprieta={aprieta} flujo={flujo} residuos={residuos} z={z} verde={verde} tiembla={tiembla} />
    {children && <Svg>{children}</Svg>}
  </AbsoluteFill>
);
