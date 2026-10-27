// Pulla 2: «¿Atornillando la chapa?». Cámara cerca de la chapa y tu pie: la cinta exprés repiquetea contra la roca.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bocadillo, Camara, borde, temblor, type P } from "./comun";
import { PlanoPared, PX, PY, X0 } from "./Plano";

export const Chapa: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const cx = (PX + borde(1330, X0)) / 2 - 60, cy = (PY + 1360) / 2 - 40;
  return (
    <Camara d={d} empuje={0.08} foco="55% 45%">
      <PlanoPared f={f} tr={temblor(f, 1.4)} amp={1.4} tintineo={1.6} zoom={{ s: 1.35, cx, cy, tx: 560, ty: 820 }} />
      <Bocadillo texto={e.titulo} x={240} y={1400} desde={4} ancho={520} tam={60} />
    </Camara>
  );
};
