// Pulla 1: «¿Pongo a Elvis?». El asegurador levanta el móvil y se menea; bocadillo con la pulla corta.
import React from "react";
import { Bocadillo, Camara, type P } from "./comun";
import { PlanoAbajo } from "./Abajo";

export const Elvis: React.FC<P> = ({ e, d }) => (
  <Camara d={d} empuje={0.07} foco="45% 55%">
    <PlanoAbajo cara="alivio" gesto="movil" baile={1} />
    <Bocadillo texto={e.titulo} x={420} y={430} desde={2} ancho={560} tam={72} />
  </Camara>
);
