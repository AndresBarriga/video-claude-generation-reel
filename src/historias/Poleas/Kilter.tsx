// 1 · «Hoy estás en tu mejor momento. Crac.»: el escalador carga la regleta del Kilter, vibra, crac y suelta la mano.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Camara, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { TA, TB } from "./laminas";

export const Kilter: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const fCrac = Math.round(d * 0.78);
  const antes = f < fCrac;
  const vib = antes ? (1 + ei(f, 0, fCrac, 0, 2.2)) * Math.sin(f * 2.6) : 0;
  const k = antes ? ei(f, 0, fCrac, 1, 1.16) : 1.16 - 0.04 * ei(f, fCrac, fCrac + 20, 0, 1);
  const t = f - fCrac, sac = !antes && t < 10 ? (random(`s${f}`) - 0.5) * 26 * (1 - t / 10) : 0;
  const led = 0.85 + 0.15 * Math.sin(f * 0.5);
  return (
    <Camara d={d} empuje={0.02} foco="40% 30%">
      <Svg>
        <g transform={`translate(${sac + vib * 0.8} ${sac * 0.5})`}>
          {antes
            ? <Lamina html={TA} css={`#tA_leds{opacity:${led}}`} tf={alrededor(430, 440, k)} />
            : <Lamina html={TB} tf={alrededor(430, 440, k)} />}
        </g>
        {!antes && t < 4 && <rect width={1080} height={1920} fill="#fff" opacity={0.6 * (1 - t / 4)} />}
      </Svg>
    </Camara>
  );
};
