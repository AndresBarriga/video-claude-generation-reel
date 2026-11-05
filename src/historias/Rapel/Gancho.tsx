// 1 · Gancho: pilar de roca visto de frente sobre un mar de nubes (impacto de escala), inserto en primera persona con el puño y el hueco hasta la reunión, y vuelta al escalador sin saberlo.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camara, Rotulo, ei, type P } from "./comun";
import { Frente } from "./Frente";
import { Pov } from "./Pov";

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fPov = (pal("Tu") ?? 60) - 2, fVuelve = (pal("Y") ?? 150) - 2, fReu = pal("reunión") ?? fPov + 40;
  const pov = f >= fPov && f < fVuelve;
  const cam = ei(f, 0, d, 0, 240, Easing.inOut(Easing.cubic)), zoom = ei(f, 0, 22, 1.16, 1);
  return (
    <Camara d={d} empuje={0.02} foco="50% 50%">
      {pov ? <Pov f={f - fPov} p={ei(f, fPov, fVuelve, 0, 0.55, Easing.linear)} fReu={fReu - fPov} />
        : <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}><Frente f={f} cam={cam} baja={ei(f, 0, d, 0, 190, Easing.linear)} hueco={ei(f, fVuelve, fVuelve + 18, 0, 1)} cara={f > fVuelve ? "normal" : "serio"} /></AbsoluteFill>}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}><Rotulo f={f} ini={-6} t="¿LLEGA?" y={270} tam={130} /></svg>
    </Camara>
  );
};

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.03} foco="50% 50%" entrada={false}>
      <Frente f={f} cam={0} baja={0} hueco={1} cara="serio" />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Rotulo f={f} ini={-6} t="¿LLEGA?" y={270} tam={130} />
        <Rotulo f={f} ini={6} t="MÁNDASELO A QUIEN" y={1250} tam={56} /><Rotulo f={f} ini={9} t="BAJA CONTIGO" y={1316} tam={56} col="#FF6A1F" />
      </svg>
    </Camara>
  );
};
