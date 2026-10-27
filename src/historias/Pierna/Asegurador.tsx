// «Esto va por él»: el asegurador se ríe (corte a él); en «tu pierna…» corte a tu cara, mirándole con cara de pocos amigos.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, temblor, type P } from "./comun";
import { PlanoAbajo } from "./Abajo";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";

export const Asegurador: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const corte = (pal("tu") ?? Math.round(d * 0.4)) - 2;
  if (f < corte) return <Camara d={corte} empuje={0.05} foco="45% 60%"><PlanoAbajo cara="alivio" gesto="quieto" /></Camara>;
  const h = caderaDe(PX, PY, 3, 40);
  return (
    <Camara d={d - corte} empuje={0.06} foco="50% 40%">
      <PlanoPared f={f} tr={temblor(f, 1)} amp={0.6} cara="esfuerzo" cabeza={40}
        zoom={{ s: 2.1, cx: h.x + 30, cy: h.y - 300, tx: 540, ty: 1000 }} />
    </Camara>
  );
};
