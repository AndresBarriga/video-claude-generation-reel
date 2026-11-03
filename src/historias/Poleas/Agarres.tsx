// 4 · arqueo (full crimp), semiarqueo y mano abierta: la polea de la base carga más en el arqueo.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Svg, ei, type P } from "../Pump/comun";
import { Lamina } from "./Lamina";
import { AG } from "./laminas";

export const Agarres: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fArq = pal("arqueas") ?? 10;
  const foco = ei(f, fArq - 4, fArq + 8, 0, 1);
  const pulso = 0.75 + 0.25 * Math.sin(f * 0.35);
  const css = `
    #ag_agarre_semiarqueo,#ag_agarre_mano_abierta,#ag_rotulo_semiarqueo,#ag_rotulo_mano_abierta{opacity:${1 - 0.55 * foco}}
    #ag_halo_A2_arqueo{opacity:${pulso}}`;
  return (
    <Camara d={d} empuje={0.015} foco="50% 40%">
      <Svg><Lamina html={AG} css={css} o={ei(f, 0, 8, 0, 1)} /></Svg>
    </Camara>
  );
};
