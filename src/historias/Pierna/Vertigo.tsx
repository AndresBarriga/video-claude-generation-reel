// Gancho: tu pierna de Elvis en el reglete; desde abajo, «¡Confía en los pies!». También es el plano del cierre (bucle).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bocadillo, Camara, Etiqueta, temblor, type P } from "./comun";
import { PlanoPared } from "./Plano";

export const PlanoVertigo: React.FC<{ d: number; titulo?: string; grito?: number; k?: number; f0?: number }> = ({ d, titulo, grito, k = 1, f0 = 0 }) => {
  const f = useCurrentFrame() + f0;
  return (
    <Camara d={d} empuje={0.06} foco="60% 55%">
      <PlanoPared f={f} tr={temblor(f, k)} amp={k} />
      <Etiqueta texto={titulo} top={205} tam={104} desde={-30} />
      {grito !== undefined && <Bocadillo texto="¡Confía en los pies!" x={230} y={1410} desde={grito} ancho={460} tam={62} />}
    </Camara>
  );
};

export const Vertigo: React.FC<P> = ({ e, d, pal }) => <PlanoVertigo d={d} titulo={e.titulo} grito={(pal("Y") ?? Math.round(d * 0.5)) + 4} />;
