// 6 · «Ese crac era una polea»: destello en la polea de la base; «si duele, para y ve a un fisio».
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Camara, Chip, Rotulo, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Crac: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fCrac = pal("crac") ?? 10, fFis = fCrac + 18;
  const t = f - fCrac, sac = t >= 0 && t < 8 ? (random(`c${f}`) - 0.5) * 18 * (1 - t / 8) : 0;
  const bur = ei(f, fCrac, fCrac + 14, 0, 1);
  return (
    <Camara d={d} empuje={0.02} foco="55% 55%">
      <Svg>
        <g transform={`translate(${sac} ${sac * 0.4})`}>
          <Lamina html={PA} css={`#pA_poleas_indice{filter:drop-shadow(0 0 ${12 * bur}px #FF3A2A)}`} tf={alrededor(540, 700, 1.1, 0, -40)} />
          {t >= 0 && [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (i / 7) * Math.PI * 2 + 0.3, r0 = 70, r1 = 70 + 130 * bur; return <path key={i} d={`M${600 + Math.cos(a) * r0} ${1020 + Math.sin(a) * r0} L${600 + Math.cos(a) * r1} ${1020 + Math.sin(a) * r1}`} stroke="#FFD9A0" strokeWidth={12} strokeLinecap="round" opacity={1 - ei(f, fCrac + 8, fCrac + 22, 0, 1)} />; })}
        </g>
        <g transform="translate(540 1330) scale(1.35) translate(-540 -1330)"><Chip x={540} y={1330} t="SI LO OYES: FISIO" col="#9ED8F2" o={ei(f, fFis - 4, fFis + 6, 0, 1)} /></g>
        <Rotulo f={f} ini={fFis - 2} t="INFORMACIÓN GENERAL" y={1440} tam={44} col="#B9C6D3" />
      </Svg>
    </Camara>
  );
};
