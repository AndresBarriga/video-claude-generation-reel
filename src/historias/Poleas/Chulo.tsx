// 2 · «Tu antebrazo es el chulo del gimnasio»: el músculo presume (bocadillo) y se ilumina.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Svg, ei, type P } from "../Pump/comun";
import { Bocadillo, Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Chulo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fCh = pal("chulo") ?? 20, fSem = pal("semanas") ?? 80;
  const pres = ei(f, fCh - 4, fCh + 8, 0, 1), pulso = 1 + 0.06 * Math.sin(f * 0.5);
  const css = `#pA_dedo_menique,#pA_dedo_anular,#pA_dedo_corazon,#pA_dedo_indice,#pA_poleas_indice,#pA_mano,#pA_regleta,#pA_piel{opacity:${1 - 0.55 * pres}}`;
  return (
    <Camara d={d} empuje={0.025} foco="50% 35%">
      <Svg>
        <Lamina html={PA} css={css} o={ei(f, 0, 6, 0, 1)} tf={alrededor(540, 700, 1.04)} />
        <ellipse cx={590} cy={480} rx={330 * pulso} ry={210 * pulso} fill="#FF5A4A" opacity={0.3 * pres} />
        <Bocadillo x={780} y={250} t="¡DALE MÁS!" col="#FFB070" o={ei(f, fCh, fCh + 6, 0, 1) * (1 - ei(f, fSem + 12, fSem + 20, 0, 1))} lado={-1} />
      </Svg>
    </Camara>
  );
};
