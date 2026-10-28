// Fase 3: el asegurador, tan tranquilo, con la mano en bocina: «¡Confía en los pies!».
import React from "react";
import { Camara, type P } from "./comun";
import { PlanoAbajo } from "./Abajo";
import { Marcador } from "./Fases";

export const Fase3: React.FC<P> = ({ d }) => (
  <Camara d={d} empuje={0.07} foco="45% 55%">
    <PlanoAbajo cara="alivio" gesto="bocina" />
    <Marcador n={3} nombre="«¡Confía en los pies!»" />
  </Camara>
);
