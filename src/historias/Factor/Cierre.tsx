// s7: vuelve al plano partido del inicio (bucle) con la pregunta y el rótulo de envío.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Etiqueta, Pildora, type P } from "./comun";
import { Dos } from "./Dos";

export const Cierre: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fR = (pal("seca") ?? 30);
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      <Dos f={f} fL={0} fR={0} resetL resetR />
      <Pildora x={270} texto="TÚ" /><Pildora x={810} texto="TU COMPAÑERO" />
      {f >= fR && <Etiqueta texto="MÁNDASELO A TU CORDADA" desde={fR} top={300} tam={84} />}
    </AbsoluteFill>
  );
};
