// 1 · Gancho: último rapel del día; el extremo de la cuerda cuelga lejos del suelo y el escalador no lo sabe. Cámara baja y revela el hueco.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { Cielo } from "../Pegue/comun";
import { Anclaje, ASP, Camara, Cuerda, Extremo, H_DIA, Roca, Rotulo, Suelo, Svg, ei, type P } from "./comun";

export const ANC = { x: 704, y: 120 }, HX = 560, FIN = 1700, SUELO_Y = 2300;

/** Escena completa del descenso. baja = píxeles que ya ha bajado; cam = desplazamiento de cámara; hueco = 0..1 línea guía hasta el suelo. */
export const Descenso: React.FC<{ f: number; cam: number; baja: number; hueco?: number; cara?: Cara }> = ({ f, cam, baja, hueco = 0, cara = "serio" }) => {
  const hipY = 1000 + baja, dev = { x: HX + 36, y: hipY - 14 }, mano = { x: HX + 114, y: hipY - 400 };
  const sw = Math.sin(f * 0.07) * 8;
  const cola = `M${dev.x} ${dev.y} C${dev.x + 10} ${dev.y + 160} ${dev.x - 20 + sw} ${FIN - 200} ${dev.x - 6 + sw} ${FIN}`;
  return (
    <Svg>
      <Cielo h={H_DIA} id="cieloR" />
      <g transform={`translate(0 ${-cam})`}>
        <Roca y0={-200} y1={2400} />
        <Suelo y={SUELO_Y} />
        <Anclaje x={ANC.x - 6} y={ANC.y} />
        <Cuerda d={`M${ANC.x - 6} ${ANC.y + 20} L${mano.x} ${mano.y} L${dev.x} ${dev.y}`} w={11} />
        <Cuerda d={cola} w={11} />
        <Extremo x={dev.x - 6 + sw} y={FIN} />
        {hueco > 0 && <line x1={dev.x - 6 + sw} y1={FIN + 40} x2={dev.x - 6 + sw} y2={FIN + 40 + (SUELO_Y - FIN - 50) * hueco} stroke="#fff" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={0.9} />}
        <Escalador x={HX} y={hipY} quien="simon" aspecto={ASP} pose="colgado" cara={cara} s={2.3} mira={1} />
        <g transform={`translate(${dev.x} ${dev.y})`}><rect x={-20} y={-12} width={40} height={26} rx={10} fill="#9AA5B3" stroke="#0B1624" strokeWidth={5} /><circle cx={4} cy={-14} r={11} fill="none" stroke="#C9D2DC" strokeWidth={6} /></g>
      </g>
    </Svg>
  );
};

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSuelo = pal("suelo") ?? 100;
  const cam = ei(f, 24, fSuelo + 24, 0, 500, Easing.inOut(Easing.cubic));
  return (
    <Camara d={d} empuje={0.02} foco="50% 50%">
      <Descenso f={f} cam={cam} baja={ei(f, 0, d, 0, 300, Easing.linear)} hueco={ei(f, fSuelo, fSuelo + 22, 0, 1)} cara={f > (pal("sabes") ?? 150) ? "normal" : "serio"} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}><Rotulo f={f} ini={-6} t="¿LLEGA?" y={270} tam={130} /></svg>
    </Camara>
  );
};

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.03} foco="50% 50%" entrada={false}>
      <Descenso f={f} cam={0} baja={0} cara="serio" />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Rotulo f={f} ini={-6} t="¿LLEGA?" y={270} tam={130} />
        <Rotulo f={f} ini={6} t="MÁNDASELO A QUIEN" y={1300} tam={56} /><Rotulo f={f} ini={9} t="BAJA CONTIGO" y={1366} tam={56} col="#FF6A1F" />
      </svg>
    </Camara>
  );
};
