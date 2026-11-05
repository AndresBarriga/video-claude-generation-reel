// 1 · Gancho: cuenta atrás de la cuerda que queda (peligro y urgencia desde el segundo 1) y el hueco hasta la siguiente parada.
// Cierre: el mismo plano; el nudo del extremo llega al freno y para a la figurita.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camara, Rotulo, ei, type P } from "./comun";
import { Frente } from "./Frente";

const PX_M = 40, RESTO0 = 474; // píxeles por metro y cuerda que queda al empezar

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fCuatro = pal("cuatro") ?? 80, fQuince = pal("quince") ?? 160;
  const baja = f <= fCuatro ? ei(f, 0, fCuatro, 0, 314, Easing.linear) : ei(f, fCuatro, d, 314, 340, Easing.linear);
  const cam = ei(f, 0, fQuince - 22, 0, 200, Easing.inOut(Easing.cubic)) + ei(f, fQuince - 22, fQuince + 8, 0, 330, Easing.inOut(Easing.cubic)), zoom = ei(f, 0, 16, 2.6, 1, Easing.out(Easing.cubic));
  const m = Math.max(3, Math.ceil((RESTO0 - baja) / PX_M));
  const hueco = ei(f, fQuince - 14, fQuince + 6, 0, 1);
  const alarma = ei(f, fCuatro - 20, fCuatro, 0, 1);
  return (
    <Camara d={d} empuje={0.04} foco="50% 50%">
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "54% 65%" }}>
        <Frente f={f} cam={cam} baja={baja} hueco={hueco} etq="15 m" cara="serio" sacude={alarma * 3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(210,30,20,0.55) 100%)", opacity: alarma * (0.45 + 0.35 * Math.sin(f * 0.55)) }} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}><Rotulo f={f} ini={-6} fin={fQuince - 6} t={`QUEDAN ${m} m`} y={300} tam={124} col="#FF5A4A" /></svg>
    </Camara>
  );
};

export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fNudo = pal("nudo") ?? 8, fPare = pal("pare") ?? 80, fOlvides = pal("Nunca") ?? 140;
  const fStop = fPare + 6;
  const rebote = f > fStop ? 12 * Math.exp(-(f - fStop) / 7) * Math.sin((f - fStop) * 0.85) : 0;
  const baja = ei(f, 0, fStop, 340, 434, Easing.in(Easing.quad)) + rebote;
  const parado = f >= fStop;
  return (
    <Camara d={d} empuje={0.03} foco="50% 50%" entrada={false}>
      <Frente f={f} cam={360} baja={baja} nudo={ei(f, fNudo, fNudo + 8, 0, 1)} cara={parado ? "normal" : "serio"} sacude={parado ? 6 * Math.exp(-(f - fStop) / 10) : 0} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Rotulo f={f} ini={fStop} fin={fOlvides - 4} t="EL NUDO TE PARA" y={300} tam={104} col="#5FD1C5" />
        <Rotulo f={f} ini={fOlvides} t="NUNCA OLVIDES" y={290} tam={92} col="#FF6A1F" /><Rotulo f={f} ini={fOlvides + 3} t="EL NUDO" y={385} tam={104} col="#FF6A1F" />
      </svg>
    </Camara>
  );
};
