// Cierre: abajo, por fin, silencio (el asegurador callado, mirando arriba). En «Mándaselo», vuelve el plano del gancho (bucle).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, type P } from "./comun";
import { PlanoAbajo } from "./Abajo";
import { PlanoVertigo } from "./Vertigo";

export const Cierre: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame();
  const corte = (pal("Mándaselo") ?? Math.round(d * 0.4)) - 2;
  if (f < corte) return <Camara d={corte} empuje={0.05} foco="45% 60%"><PlanoAbajo cara="normal" gesto="quieto" /></Camara>;
  return <PlanoVertigo d={d} titulo={e.titulo} />;
};
