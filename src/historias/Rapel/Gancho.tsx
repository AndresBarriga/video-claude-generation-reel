// 1 · Gancho en primera persona: miras hacia abajo por la cuerda; el extremo cuelga lejos de la siguiente reunión y tú no lo sabes.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Camara, Rotulo, ei, type P } from "./comun";
import { Pov } from "./Pov";

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fReu = pal("reunión") ?? 90;
  return (
    <Camara d={d} empuje={0.02} foco="50% 50%">
      <Pov f={f} p={ei(f, 0, d, 0, 1, Easing.linear)} fReu={fReu} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}><Rotulo f={f} ini={-6} t="¿LLEGA?" y={270} tam={130} /></svg>
    </Camara>
  );
};

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.03} foco="50% 50%" entrada={false}>
      <Pov f={f} p={0} fReu={0} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Rotulo f={f} ini={-6} t="¿LLEGA?" y={270} tam={130} />
        <Rotulo f={f} ini={6} t="MÁNDASELO A QUIEN" y={1250} tam={56} /><Rotulo f={f} ini={9} t="BAJA CONTIGO" y={1316} tam={56} col="#FF6A1F" />
      </svg>
    </Camara>
  );
};
