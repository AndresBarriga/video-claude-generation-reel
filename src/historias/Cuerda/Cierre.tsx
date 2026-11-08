// 6 · Cierre: «Chapa. Mira. Sube.» — tres golpes sincronizados con la voz; ella sube y queda lista para la siguiente chapa (bucle con el whip).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chapa, Etiqueta, Svg, Zoom, sube, FondoEspalda, type P } from "./comun";
import { Espalda, CHAPA_L } from "./Espalda";
import { PresasEspalda, X, Y, S } from "./Gancho";

export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tC = pal("chapa") ?? 0, tM = pal("mira") ?? 12, tS = pal("sube") ?? 24;
  const sub = sube(f, tS, tS + 14);
  const txt = f < tM ? "CHAPA" : f < tS ? "MIRA" : "SUBE";
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <Zoom s={1.15} cx={X} cy={Y - 300 * sub} tx={540} ty={960}>
          <FondoEspalda id="ci" />
          <PresasEspalda fx={-42} />
          <Chapa x={X + CHAPA_L[0] * S} y={Y + (CHAPA_L[1] - 30) * S - 106} s={1.6} />
          <g transform={`translate(0 ${-300 * sub})`}><Espalda x={X} y={Y} s={S} pie={1} mira={f >= tM && f < tS + 6 ? 1 : 0} cara="alivio" /></g>
        </Zoom>
      </Svg>
      <Etiqueta texto={txt} top={230} tam={170} desde={f < tM ? tC : f < tS ? tM : tS} />
    </Camara>
  );
};
