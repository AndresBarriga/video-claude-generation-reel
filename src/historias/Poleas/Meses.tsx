// 4 · «Y las poleas no han ido nunca al gimnasio: tardan meses.»: la polea, tímida, con su bocadillo.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chip, Svg, ei, type P } from "../Pump/comun";
import { Bocadillo, Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Meses: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fGim = pal("ritmo") ?? 60, fMes = pal("meses") ?? 100;
  const css = `#pA_antebrazo,#pA_barra_control,#pA_mano,#pA_regleta,#pA_piel{opacity:0.4}#pA_poleas_indice{filter:drop-shadow(0 0 12px #fff)}`;
  return (
    <Camara d={d} empuje={0.03} foco="55% 60%">
      <Svg>
        <Lamina html={PA} css={css} tf={alrededor(600, 1000, 1.05)} />
        <ellipse cx={600} cy={1020} rx={120} ry={80} fill="none" stroke="#fff" strokeWidth={8} opacity={ei(f, 6, 14, 0, 0.9)} />
        <Bocadillo x={520} y={780} t="…YO NO HE ENTRENADO" col="#fff" o={ei(f, 14, 22, 0, 1) * (1 - ei(f, fMes - 2, fMes + 6, 0, 1))} lado={1} w={600} />
        <Chip x={830} y={1230} t="MESES" col="#FF8A4A" o={ei(f, fMes - 4, fMes + 4, 0, 1)} />
      </Svg>
    </Camara>
  );
};
