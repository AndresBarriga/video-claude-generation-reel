// Pilar de roca visto de frente sobre un mar de nubes; el escalador de perfil cuelga delante. Se ve el hueco entre el extremo de la cuerda y la reunión.
import React from "react";
import { fuenteTitulo } from "../../tema";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { Anclaje, ASP, CieloNubes, Cuerda, Extremo, MarNubes, Muro, Nudo, Svg } from "./comun";

export const HX = 470, FIN = 1250, REU = 1850;

export const Frente: React.FC<{ f: number; cam: number; baja: number; hueco?: number; cara?: Cara; nudo?: number; etq?: string; sacude?: number }> = ({ f, cam, baja, hueco = 0, cara = "serio", nudo = 0, etq, sacude = 0 }) => {
  const hipY = 790 + baja, dev = { x: HX + 36, y: hipY - 14 }, mano = { x: HX + 114, y: hipY - 400 }, sw = Math.sin(f * 0.07) * 8 + Math.sin(f * 1.9) * sacude;
  const ex = dev.x + 80 + sw;
  const cola = `M${dev.x} ${dev.y} C${dev.x + 70} ${dev.y + 30} ${ex + 40} ${FIN - 110} ${ex} ${FIN}`;
  return (
    <Svg>
      <CieloNubes />
      <g transform={`translate(0 ${-cam})`}>
        <Muro y0={-500} y1={2400} />
        <path d={`M300 ${REU} L800 ${REU} L770 ${REU + 34} L330 ${REU + 34} Z`} fill="#A9B6C6" /><path d={`M330 ${REU + 34} L770 ${REU + 34} L750 ${REU + 100} L350 ${REU + 100} Z`} fill="#56657B" />
        <Anclaje x={550} y={REU - 22} s={0.9} />
        <Anclaje x={mano.x} y={-120} s={1.1} />
        <Cuerda d={`M${mano.x} -90 L${mano.x} ${mano.y} L${dev.x} ${dev.y}`} w={12} />
        {hueco > 0 && <line x1={ex} y1={FIN + 44} x2={ex} y2={FIN + 44 + (REU - FIN - 60) * hueco} stroke="#fff" strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" />}
        {etq && hueco > 0.5 && <text x={ex + 36} y={(FIN + REU) / 2 + 60} fontFamily={fuenteTitulo} fontWeight={800} fontSize={170} fill="#fff" stroke="#050B14" strokeWidth={38} paintOrder="stroke" opacity={hueco}>{etq}</text>}
        <Escalador x={HX} y={hipY} quien="simon" aspecto={ASP} pose="colgado" cara={cara} s={2.3} mira={1} />
        <Cuerda d={cola} w={12} />
        <g transform={`translate(${ex} ${FIN}) scale(1.9) translate(${-ex} ${-FIN})`}><Extremo x={ex} y={FIN} /></g>
        <Nudo x={ex} y={FIN - 8} k={nudo * 1.7} />
        <g transform={`translate(${dev.x} ${dev.y})`}><rect x={-20} y={-12} width={40} height={26} rx={10} fill="#9AA5B3" stroke="#0B1624" strokeWidth={5} /><circle cx={4} cy={-14} r={11} fill="none" stroke="#C9D2DC" strokeWidth={6} /></g>
        <MarNubes y={2230} />
      </g>
    </Svg>
  );
};
