// 2 · La noche en la grieta: los dos acurrucados; amanece por la boca; él ya no se mueve. Rótulo NANGA PARBAT · 2018 y altímetro.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Cuerda, ELI, Etiqueta, Svg, TOMEK, sube, type P } from "./comun";
import { Grieta } from "./Hielo";

export const EnGrieta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tA = (pal("mañana") ?? Math.round(d * 0.7)) - 6;
  const alba = sube(f, tA, tA + 20);
  return (
    <Camara d={d} empuje={0.06} entrada={false}>
      <Svg>
        <Grieta alba={alba} />
        <Cuerda d="M420 1420 Q540 1500 660 1430" w={9} />
        <Escalador x={400} y={1440 - 120 * 2.7} quien="joe" aspecto={ELI} s={2.7} pose="sentadoSuelo" cara={alba > 0.5 ? "miedo" : "cerrados"} frontal={alba < 0.5} mira={1} angulos={{ cabeza: alba > 0.5 ? 6 : 20 }} />
        <Escalador x={690} y={1450 - 120 * 2.7} quien="simon" aspecto={TOMEK} s={2.7} pose="sentadoSuelo" cara="cerrados" mira={-1} angulos={{ torso: -16, cabeza: 30 }} />
        <text x={980} y={560} textAnchor="end" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={64} fill="#fff" stroke="#06233D" strokeWidth={10} paintOrder="stroke">7.280 m</text>
      </Svg>
      <Etiqueta texto="NANGA PARBAT · 2018" top={230} tam={84} desde={2} />
    </Camara>
  );
};
