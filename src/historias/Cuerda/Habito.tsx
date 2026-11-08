// 5 · El hábito: el asegurador, desde abajo, no siempre lo ve → ella chapa y gira la cabeza para mirar la cuerda.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chapa, Etiqueta, Svg, Zoom, sube, temblor, FondoEspalda, type P } from "./comun";
import { PlanoAbajo } from "../Pierna/Abajo";
import { Espalda, CHAPA_L } from "./Espalda";
import { PresasEspalda, X, Y, S } from "./Gancho";
import { Garabato } from "./Garabato";

export const Habito: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tB = (pal("habito") ?? Math.round(d * 0.45)) - 8;
  if (f < tB) return (
    <Camara d={tB} empuje={0.06} foco="40% 60%"><PlanoAbajo cara="serio" gesto="quieto" /><Etiqueta texto="DESDE ABAJO NO SIEMPRE SE VE" top={230} tam={84} desde={2} /></Camara>
  );
  const g = f - tB, tM = (pal("mira") ?? tB + 40) - tB;
  const mira = sube(g, tM - 4, tM + 8);
  return (
    <Camara d={d - tB} empuje={0.05} entrada={false}>
      <Svg>
        <Zoom s={1.15} cx={X} cy={Y} tx={540} ty={960}>
          <FondoEspalda id="h" />
          <PresasEspalda fx={-42} />
          <Chapa x={X + CHAPA_L[0] * S} y={Y + (CHAPA_L[1] - 30) * S - 106} s={1.6} t={temblor(f, 3)} />
          <Espalda x={X} y={Y} s={S} pie={1} mira={mira} cara="alivio" tr={temblor(f, 0.6)} />
        </Zoom>
        {g > tM + 6 && <Garabato x={540 + 4 * S * 1.15} y={960 + 110 * S * 1.15} r={150} f={g - tM - 6} />}
      </Svg>
      <Etiqueta texto={g < tM ? "EL HÁBITO ES TUYO" : "MIRA DÓNDE QUEDA LA CUERDA"} top={230} tam={84} desde={g < tM ? 2 : tM} />
    </Camara>
  );
};
