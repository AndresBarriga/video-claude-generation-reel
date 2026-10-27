// «Y cuando por fin recogéis, tu compañero se calza: uno y nos vamos.» De noche, tú con la mochila; él se pone los pies de gato y señala la vía.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Cielo, Pared, SUELO, Suelo, Svg, Zoom, clamp, enSuelo, type P } from "./comun";

export const Calza: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tCalza = pal("calza:") ?? Math.round(d * 0.45);
  const tUno = pal("uno") ?? Math.round(d * 0.65);
  const pie = interpolate(f, [tUno - 6, tUno + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const pone = f < tUno ? Math.sin(Math.max(0, f - tCalza + 4) / 3) : 0;
  const sS = 1.2, jS = 1.2;
  return (
    <Camara d={d} empuje={0.05} foco="45% 60%">
      <Svg>
        <Cielo h={1} id="cal" />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={random(`zx${i}`) * 1080} cy={random(`zy${i}`) * 900} r={1.5 + random(`zr${i}`) * 2.5} fill="#fff" opacity={0.3 + 0.5 * random(`zo${i}`)} />)}
        <Zoom s={1.4} cx={460} cy={1420} tx={520} ty={990}>
          <Pared h={1} marcas={8} />
          <Suelo h={1} />
          <Escalador x={250} y={enSuelo(jS)} quien="joe" pose="pie" s={jS} mochila frontal sombra={SUELO + 4}
            cara={f > tUno ? "miedo" : "cerrados"} angulos={{ cabeza: 8, brazoA: [20, 10] }} />
          {pie < 1 && <g opacity={1 - pie}>
            <Escalador x={520} y={SUELO - 70 * sS} quien="simon" pose="sentadoSuelo" s={sS} frontal sombra={SUELO + 4} cara="esfuerzo"
              angulos={{ brazoA: [80 + pone * 10, 110], brazoB: [70, 100] }} />
          </g>}
          {pie > 0 && <g opacity={pie}>
            <Escalador x={520} y={enSuelo(sS) + (1 - pie) * 40} quien="simon" pose="senalando" s={sS} frontal sombra={SUELO + 4} cara="normal"
              angulos={{ brazoA: [150, 155], cabeza: -30 }} />
          </g>}
        </Zoom>
      </Svg>
    </Camara>
  );
};
