// 1 · «Crac. Tu invierno acaba de irse al sofá.»: el escalador carga la regleta, crac (en la primera palabra) y suelta la mano.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Camara, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { TA, TB } from "./laminas";

export const Kilter: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fCrac = 4;
  const antes = f < fCrac;
  const k = antes ? 1.1 : 1.14 - 0.06 * ei(f, fCrac, d, 0, 1);
  const t = f - fCrac, sac = !antes && t < 10 ? (random(`s${f}`) - 0.5) * 26 * (1 - t / 10) : 0;
  const led = 0.85 + 0.15 * Math.sin(f * 0.5);
  const fSofa = pal("invierno") ?? Math.round(d * 0.8);
  const hunde = ei(f, fSofa - 8, fSofa + 18, 0, 1);
  return (
    <Camara d={d} empuje={0.02} foco="40% 30%">
      <Svg>
        <g transform={`translate(${sac} ${sac * 0.5 + 30 * hunde})`}>
          {antes ? <Lamina html={TA} css={`#tA_leds{opacity:${led}}`} tf={alrededor(430, 440, k)} /> : <Lamina html={TB} tf={alrededor(430, 440, k)} />}
        </g>
        {!antes && t < 4 && <rect width={1080} height={1920} fill="#fff" opacity={0.6 * (1 - t / 4)} />}
        <rect width={1080} height={1920} fill="#0B1624" opacity={0.45 * hunde} />
      </Svg>
    </Camara>
  );
};
