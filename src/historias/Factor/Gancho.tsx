// s0: las dos caídas a la vez. Tú: dos metros y frenazo seco (en «seco»). Él: diez metros y frenada suave (en «suave»).
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Etiqueta, Pildora, Dato, type P } from "./comun";
import { Dos } from "./Dos";

export const Gancho: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const sL = (pal("seco") ?? 75) - 19, sR = (pal("suave") ?? 144) - 44;
  const a = spring({ frame: f - sL, fps, config: { damping: 12, stiffness: 190 } }), b = spring({ frame: f - sR, fps, config: { damping: 12, stiffness: 190 } });
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      <Dos f={f} fL={f - sL} fR={f - sR} />
      <Pildora x={270} texto="TÚ" />
      <Pildora x={810} texto="TU COMPAÑERO" />
      {f >= sL && <Dato x={270} y={470} texto="2 M" s={a} />}
      {f >= sR && <Dato x={810} y={470} texto="10 M" s={b} />}
      {f < (pal("como") ?? 160) && <Etiqueta texto="¿CUÁL DUELE MÁS?" desde={-15} top={300} tam={96} />}
      {f >= (pal("como") ?? 160) && <Etiqueta texto="¿CÓMO PUEDE SER?" desde={pal("como") ?? 160} top={300} tam={96} />}
    </AbsoluteFill>
  );
};
