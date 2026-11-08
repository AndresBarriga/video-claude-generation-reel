// 6 · Cierre (≤3 s): el mismo plano del gancho, ahora con la cuerda bien. Vuelve al principio (bucle).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Etiqueta, type P } from "./comun";
import { CaraAseg } from "./CaraAseg";

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.06}>
      <CaraAseg f={f} grita={false} />
      <Etiqueta texto="MÁNDASELO A QUIEN TE ASEGURA" top={230} tam={84} desde={2} />
    </Camara>
  );
};
