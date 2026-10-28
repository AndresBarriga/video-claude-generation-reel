// Cierre en bucle: vuelve al plano del gancho (metro 3) con la pregunta.
import React from "react";
import { type P } from "./comun";
import { PlanoGancho } from "./Gancho";

export const Cierre: React.FC<P> = ({ e, d }) => <PlanoGancho d={d} titulo={e.titulo} desde={3} hasta={9} />;
