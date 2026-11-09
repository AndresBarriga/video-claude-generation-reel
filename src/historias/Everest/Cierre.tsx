// 8 · Cierre: vuelve al plano del gancho (bucle): Hall levanta la cabeza. ¿Te habrías parado?
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Svg, sube, type P } from "./comun";
import { EscenaHall } from "./Gancho";

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg><EscenaHall f={f} alza={sube(f, 10, 26)} zoom={1.0} /></Svg>
      <Etiqueta texto="¿TE HABRÍAS PARADO?" top={230} tam={100} desde={2} />
    </Camara>
  );
};
