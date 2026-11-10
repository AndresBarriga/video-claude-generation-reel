// Rehook: «hay una franja donde la caída ya mata… y todavía no da tiempo a abrirlo». La pared entera de perfil (~700 m).
// Dos caídas que se entienden sin audio: desde ARRIBA (verde) se abre la vela; desde la franja ROJA no da tiempo → negro.
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ESC, AZUL, PIES, Abismo, ParedEiger, Vela, Svg, clamp, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

const BORDE = 640, TOPE = 220, SUELO = 1720, VERDE = 820, ROJO = 1380, PX = 2.2; // 1 m ≈ 2,2 px
const T: React.FC<{ y: number; t: string; o: number; tam?: number; col?: string }> = ({ y, t, o, tam = 66, col = "#fff" }) => (
  <text x={50} y={y} opacity={o} fontFamily={fuenteTitulo} fontWeight={800} fontSize={tam} fill={col} stroke="#0B1624" strokeWidth={tam * 0.21} paintOrder="stroke">{t}</text>
);
const Banda: React.FC<{ y0: number; y1: number; col: string; o: number }> = ({ y0, y1, col, o }) => (
  <g opacity={o}><rect x={-100} y={y0} width={1300} height={y1 - y0} fill={col} opacity={0.3} /><path d={`M-100 ${y0} L1200 ${y0}`} stroke={col} strokeWidth={6} strokeDasharray="22 14" /></g>
);
/** Persona marcada con un círculo (a esta escala mide ~4 px). */
const Marca: React.FC<{ x: number; y: number; f: number; cayendo: boolean; rot: number }> = ({ x, y, f, cayendo, rot }) => (
  <g><circle cx={x} cy={y - 10} r={30 + Math.sin(f / 4) * 3} fill="none" stroke="#fff" strokeWidth={5} />
    <Escalador x={x} y={y} quien="joe" s={0.1} cara="miedo" aspecto={ESC} mochila={AZUL} pies={PIES} pose={cayendo ? "cayendo" : "escalando"} rot={rot} /></g>
);

export const Franja: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fM = pal("mata") ?? Math.round(d * 0.4), fT = pal("todavia") ?? Math.round(d * 0.65);
  const oB = interpolate(f, [0, 10], [0, 1], clamp);
  // caída 1 (verde): cae desde arriba y abre
  const t1 = Math.max(0, (f - 6) / fps), y1 = 340 + 0.5 * 9.8 * PX * 14 * Math.min(t1, 1.1) ** 2 + Math.max(0, t1 - 1.1) * 40;
  const a1 = interpolate(t1, [0.9, 1.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  // caída 2 (roja): cae desde la franja y no da tiempo → negro antes del suelo
  const t2 = Math.max(0, (f - fT - 4) / fps), y2 = 1080 + 0.5 * 9.8 * PX * 14 * t2 * t2;
  const negro = interpolate(y2, [1500, 1640], [0, 1], clamp);
  const oM = interpolate(f, [fM - 2, fM + 8], [0, 1], clamp), oT = interpolate(f, [fT - 2, fT + 8], [0, 1], clamp);
  return (
    <Svg>
      <Abismo f={f} id="fr" hz={330} />
      <ParedEiger x={BORDE} pm={90} id="frp" y0={TOPE} y1={SUELO + 400} />
      <path d={`M${BORDE - 40} ${TOPE} L${BORDE + 200} ${TOPE - 60} L1300 ${TOPE - 40}`} stroke="#E8EAEB" strokeWidth={8} fill="none" />
      <path d={`M-200 ${SUELO} Q300 ${SUELO - 40} ${BORDE} ${SUELO - 10} L1300 ${SUELO} L1300 2200 L-200 2200 Z`} fill="#8C8F86" />
      <Banda y0={TOPE} y1={VERDE} col="#4CC777" o={oB} />
      <Banda y0={VERDE} y1={ROJO} col="#E5432E" o={oB} />
      <T y={VERDE - 40} t="DA TIEMPO A ABRIR" o={oB} />
      <T y={VERDE + 100} t="LA CAÍDA YA MATA…" o={oM} />
      <T y={VERDE + 170} t="…Y NO DA TIEMPO" o={oT} tam={58} col="#FFD1C7" />
      {f < fT + 4 && <>
        {a1 > 0 && <Vela x={BORDE - 70 - t1 * 30} y={y1 - 40 * a1} pm={17} a={a1} cuerpo={[BORDE - 70 - t1 * 30, y1 - 6]} />}
        <Marca x={BORDE - 70 - t1 * 30} y={y1} f={f} cayendo={a1 === 0 && t1 > 0} rot={a1 > 0 ? 0 : t1 * 90} />
      </>}
      {f >= fT && <Marca x={BORDE - 40 - t2 * 30} y={y2} f={f} cayendo={t2 > 0} rot={t2 * 140} />}
      <rect x={0} y={0} width={1080} height={1920} fill="#000" opacity={negro} />
    </Svg>
  );
};
