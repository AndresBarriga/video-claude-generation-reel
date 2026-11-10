// Rehook: la pared entera de perfil con la franja roja: «demasiado alta para sobrevivir a la caída… y demasiado baja
// para abrir el paracaídas». Arriba, verde (da tiempo). Un escalador cae desde la franja roja: corte a negro antes del suelo.
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ESC, AZUL, PIES, Valle, ParedEiger, Svg, clamp, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

const PM = 2.2; // pared de ~700 m en pantalla (1 m ≈ 2,2 px): la persona va marcada con un círculo para que se vea
const BORDE = 640, TOPE = 220, SUELO = 1720, VERDE = 820, ROJO = 1380;

const Banda: React.FC<{ y0: number; y1: number; col: string; o: number; txt?: string; ty?: number }> = ({ y0, y1, col, o, txt, ty }) => (
  <g opacity={o}>
    <rect x={-100} y={y0} width={1300} height={y1 - y0} fill={col} opacity={0.32} />
    <path d={`M-100 ${y0} L1200 ${y0}`} stroke={col} strokeWidth={6} strokeDasharray="22 14" />
    {txt && <text x={60} y={ty ?? y0 + 70} fontFamily={fuenteTitulo} fontWeight={800} fontSize={70} fill="#fff" stroke="#0B1624" strokeWidth={14} paintOrder="stroke">{txt}</text>}
  </g>
);

export const Franja: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fR = pal("franja") ?? 12, fAl = pal("alta") ?? Math.round(d * 0.35), fBa = pal("baja") ?? Math.round(d * 0.65);
  const oR = interpolate(f, [fR - 2, fR + 10], [0, 1], clamp), oV = interpolate(f, [2, 14], [0, 1], clamp);
  const oA = interpolate(f, [fAl - 2, fAl + 8], [0, 1], clamp), oB = interpolate(f, [fBa - 2, fBa + 8], [0, 1], clamp);
  const fC = fBa + 10, tc = Math.max(0, (f - fC) / fps), y = 1020 + 0.5 * 9.8 * PM * 60 * tc * tc;
  const negro = interpolate(y, [1330, 1430], [0, 1], clamp);
  return (
    <Svg>
      <Valle f={f} id="fr" y0={420} />
      <ParedEiger x={BORDE} pm={PM * 40} id="frp" y0={TOPE} y1={SUELO + 400} />
      <path d={`M${BORDE - 40} ${TOPE} L${BORDE + 200} ${TOPE - 60} L1300 ${TOPE - 40}`} stroke="#E8EAEB" strokeWidth={8} fill="none" />
      <path d={`M-200 ${SUELO} Q300 ${SUELO - 40} ${BORDE} ${SUELO - 10} L1300 ${SUELO} L1300 2200 L-200 2200 Z`} fill="#8C8F86" />
      <Banda y0={TOPE} y1={VERDE} col="#4CC777" o={oV} txt="DA TIEMPO" ty={VERDE - 50} />
      <Banda y0={VERDE} y1={ROJO} col="#E5432E" o={oR} />
      {oA > 0 && <g opacity={oA}><path d={`M${BORDE + 10} ${VERDE + 120} l0 -80 m-18 18 l18 -18 l18 18`} stroke="#fff" strokeWidth={7} fill="none" />
        <text x={50} y={VERDE + 110} fontFamily={fuenteTitulo} fontWeight={800} fontSize={68} fill="#fff" stroke="#0B1624" strokeWidth={14} paintOrder="stroke">DEMASIADO ALTO</text>
        <text x={50} y={VERDE + 172} fontFamily={fuenteTitulo} fontWeight={800} fontSize={52} fill="#FFD1C7" stroke="#0B1624" strokeWidth={10} paintOrder="stroke">para sobrevivir a la caída</text></g>}
      {oB > 0 && <g opacity={oB}><path d={`M${BORDE + 10} ${ROJO - 200} l0 80 m-18 -18 l18 18 l18 -18`} stroke="#fff" strokeWidth={7} fill="none" />
        <text x={50} y={ROJO - 110} fontFamily={fuenteTitulo} fontWeight={800} fontSize={68} fill="#fff" stroke="#0B1624" strokeWidth={14} paintOrder="stroke">DEMASIADO BAJO</text>
        <text x={50} y={ROJO - 48} fontFamily={fuenteTitulo} fontWeight={800} fontSize={52} fill="#FFD1C7" stroke="#0B1624" strokeWidth={10} paintOrder="stroke">para abrir el paracaídas</text></g>}
      <circle cx={BORDE + 30 - Math.min(1, tc * 2) * 40} cy={y - 12} r={34 + Math.sin(f / 4) * 4} fill="none" stroke="#fff" strokeWidth={5} />
      <Escalador x={BORDE + 30 - Math.min(1, tc * 2) * 40} y={y} quien="joe" s={0.1} cara={f < fC ? "esfuerzo" : "miedo"} aspecto={ESC} mochila={AZUL} pies={PIES} pose={f < fC ? "escalando" : "cayendo"} rot={f < fC ? 0 : tc * 120} />
      <rect x={0} y={0} width={1080} height={1920} fill="#000" opacity={negro} />
    </Svg>
  );
};
