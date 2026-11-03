// 3 · antebrazo (titiritero) → tendones (cuerdas) → poleas (anillas): se ilumina cada parte cuando se nombra.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chip, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Partes: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAnt = pal("titiritero") ?? 40, fCue = pal("cuerdas") ?? 90, fAni = pal("anillas") ?? 140;
  const fase = f < fAnt - 6 ? -1 : f < fCue - 6 ? 0 : f < fAni - 6 ? 1 : 2;
  const dim = (on: boolean) => (fase < 0 || on ? 1 : 0.3);
  const css = `
    #pA_antebrazo,#pA_barra_control{opacity:${dim(fase === 0)}}
    #pA_dedo_menique,#pA_dedo_anular,#pA_dedo_corazon,#pA_dedo_indice{opacity:${dim(fase === 1)}}
    #pA_poleas_indice{opacity:${dim(fase === 2)};filter:drop-shadow(0 0 ${fase === 2 ? 14 : 0}px #fff)}
    #pA_mano,#pA_regleta,#pA_piel{opacity:${fase < 0 ? 1 : fase === 2 ? 0.6 : 0.45}}`;
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  return (
    <Camara d={d} empuje={0.02} foco="50% 45%">
      <Svg>
        <Lamina html={PA} css={css} tf={alrededor(540, 700, 1.02)} />
        <g transform="translate(830 480) scale(1.5) translate(-830 -480)"><Chip x={830} y={480} t="ANTEBRAZO" col="#FF8A4A" o={o(fAnt - 4, fCue - 8)} /></g>
        <g transform="translate(830 820) scale(1.5) translate(-830 -820)"><Chip x={830} y={820} t="TENDONES" col="#FF6A1F" o={o(fCue - 4, fAni - 8)} /></g>
        <g transform="translate(830 1130) scale(1.5) translate(-830 -1130)"><Chip x={830} y={1130} t="POLEAS" col="#fff" o={o(fAni - 4, d + 20)} /></g>
      </Svg>
    </Camara>
  );
};
