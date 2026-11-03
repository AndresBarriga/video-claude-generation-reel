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
        <defs><radialGradient id="rojoM"><stop offset="0" stopColor="#FF5A4A" stopOpacity="0.5" /><stop offset="1" stopColor="#FF5A4A" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={590} cy={480} rx={340 * pulso} ry={220 * pulso} fill="url(#rojoM)" opacity={pres} />
        <g opacity={pres}>
          <rect x={470} y={395} width={120} height={64} rx={26} fill="#0B1624" stroke="#fff" strokeWidth={4} /><rect x={610} y={395} width={120} height={64} rx={26} fill="#0B1624" stroke="#fff" strokeWidth={4} /><path d="M590 420 q10 -10 20 0" stroke="#fff" strokeWidth={6} fill="none" />
          <path d="M520 410 l50 0 M650 410 l50 0" stroke="#fff" strokeWidth={5} opacity={0.5} strokeLinecap="round" /><path d="M520 520 q70 40 140 -10" stroke="#0B1624" strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
        <Bocadillo x={780} y={250} t="¡DALE MÁS!" col="#FFB070" o={ei(f, fCh, fCh + 6, 0, 1) * (1 - ei(f, fSem + 12, fSem + 20, 0, 1))} lado={-1} />
      </Svg>
    </Camara>
  );
};
