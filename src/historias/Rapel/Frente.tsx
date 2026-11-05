// Pilar de roca visto de frente sobre un mar de nubes; el escalador de perfil cuelga delante. Se ve el hueco entre el extremo de la cuerda y la reunión.
import React from "react";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { Anclaje, ASP, CieloNubes, Cuerda, Extremo, MarNubes, Muro, Svg } from "./comun";

export const HX = 470, FIN = 1250, REU = 1560;

export const Frente: React.FC<{ f: number; cam: number; baja: number; hueco?: number; cara?: Cara }> = ({ f, cam, baja, hueco = 0, cara = "serio" }) => {
  const hipY = 790 + baja, dev = { x: HX + 36, y: hipY - 14 }, mano = { x: HX + 114, y: hipY - 400 }, sw = Math.sin(f * 0.07) * 8;
  const cola = `M${dev.x} ${dev.y} C${dev.x + 10} ${dev.y + 140} ${dev.x - 16 + sw} ${FIN - 180} ${dev.x - 4 + sw} ${FIN}`;
  const ex = dev.x - 4 + sw;
  return (
    <Svg>
      <CieloNubes />
      <g transform={`translate(0 ${-cam})`}>
        <Muro y0={-500} y1={2000} />
        <path d={`M300 ${REU} L800 ${REU} L770 ${REU + 34} L330 ${REU + 34} Z`} fill="#A9B6C6" /><path d={`M330 ${REU + 34} L770 ${REU + 34} L750 ${REU + 100} L350 ${REU + 100} Z`} fill="#56657B" />
        <Anclaje x={550} y={REU - 22} s={0.9} />
        <Anclaje x={mano.x} y={-120} s={1.1} />
        <Cuerda d={`M${mano.x} -90 L${mano.x} ${mano.y} L${dev.x} ${dev.y}`} w={12} />
        <Cuerda d={cola} w={12} />
        <Extremo x={ex} y={FIN} />
        {hueco > 0 && <line x1={ex} y1={FIN + 44} x2={ex} y2={FIN + 44 + (REU - FIN - 60) * hueco} stroke="#fff" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" />}
        <Escalador x={HX} y={hipY} quien="simon" aspecto={ASP} pose="colgado" cara={cara} s={2.3} mira={1} />
        <g transform={`translate(${dev.x} ${dev.y})`}><rect x={-20} y={-12} width={40} height={26} rx={10} fill="#9AA5B3" stroke="#0B1624" strokeWidth={5} /><circle cx={4} cy={-14} r={11} fill="none" stroke="#C9D2DC" strokeWidth={6} /></g>
        <MarNubes y={1830} />
      </g>
    </Svg>
  );
};
