// 3 · antebrazo (titiritero) → tendones (cuerdas) → poleas (anillas): se ilumina cada parte cuando se nombra.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chip, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Partes: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAnt = pal("antebrazo") ?? 20, fCue = pal("cuerdas") ?? 70, fAni = pal("anillas") ?? 120;
  const fase = f < fCue - 6 ? 0 : f < fAni - 6 ? 1 : 2;
  const dim = (on: boolean) => (on ? 1 : 0.3);
  const css = `
    #pA_antebrazo,#pA_barra_control{opacity:${dim(fase === 0)}}
    #pA_dedo_menique,#pA_dedo_anular,#pA_dedo_corazon,#pA_dedo_indice{opacity:${dim(fase === 1)}}
    #pA_poleas_indice{opacity:${dim(fase === 2)};filter:drop-shadow(0 0 ${fase === 2 ? 14 : 0}px #fff)}
    #pA_mano,#pA_regleta,#pA_piel{opacity:${fase === 2 ? 0.6 : 0.45}}`;
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  return (
    <Camara d={d} empuje={0.02} foco="50% 45%">
      <Svg>
        <Lamina html={PA} css={css} tf={alrededor(540, 700, 1.02)} />
        <Chip x={830} y={480} t="ANTEBRAZO" col="#FF8A4A" o={o(fAnt - 4, fCue - 8)} />
        <Chip x={830} y={820} t="TENDONES" col="#FF6A1F" o={o(fCue - 4, fAni - 8)} />
        <Chip x={830} y={1130} t="POLEAS" col="#fff" o={o(fAni - 4, d + 20)} />
      </Svg>
    </Camara>
  );
};
