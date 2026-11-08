// 4 · La regla (de espaldas, plano cerrado de las piernas): el pie izquierdo se levanta POR ENCIMA de la cuerda y vuelve a su lado.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chapa, Etiqueta, Svg, Zoom, sube, FondoEspalda, type P } from "./comun";
import { Espalda, CHAPA_L } from "./Espalda";
import { PresasEspalda, X, Y, S } from "./Gancho";

export const Regla: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t = (pal("encima") ?? Math.round(d * 0.35)) - 14;
  const m = sube(f, t, t + 22);
  const alza = Math.sin(Math.PI * m), pie = m;
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg>
        <Zoom s={1.35} cx={X + 10 * S} cy={Y + 40 * S} tx={540} ty={1080}>
          <FondoEspalda id="r" />
          <PresasEspalda />
          <Chapa x={X + CHAPA_L[0] * S} y={Y + (CHAPA_L[1] - 30) * S - 106} s={1.6} />
          <Espalda x={X} y={Y} s={S} pie={pie} alza={alza} mira={0.6} cara={m > 0.95 ? "alivio" : "miedo"} />
        </Zoom>
      </Svg>
      <Etiqueta texto={m < 0.98 ? "PIE POR ENCIMA" : "NUNCA POR DETRÁS"} top={230} tam={104} desde={m < 0.98 ? 2 : t + 22} />
    </Camara>
  );
};
