// «No empezó desde abajo»: esquema de perfil del pilar de Deep Blue Sea (1 m ≈ 1,4 px). Arista noroeste a la izquierda,
// repisa horizontal, muro final (~180 m, ligeramente desplomado) y debajo ~600 m de vacío. El tramo bajo de la vía, en rojo:
// no lo hizo. Un punto camina por la repisa (discontinua) y sube el muro (verde).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Valle, Svg, clamp, Roca, CALIZA, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

const PM = 1.39, REP = 760, MURO = REP - 180 * PM, PIE = REP + 600 * PM; // repisa (y), final del muro, fondo del vacío
const XM = 560; // pie del muro sobre la repisa
const T: React.FC<{ x: number; y: number; t: string; o: number; tam?: number; col?: string; ancla?: "start" | "end" | "middle" }> = ({ x, y, t, o, tam = 60, col = "#fff", ancla = "middle" }) => (
  <text x={x} y={y} opacity={o} textAnchor={ancla} fontFamily={fuenteTitulo} fontWeight={800} fontSize={tam} fill={col} stroke="#0B1624" strokeWidth={tam * 0.2} paintOrder="stroke">{t}</text>
);
const Cota: React.FC<{ x: number; y0: number; y1: number; t: string; o: number; ty: number }> = ({ x, y0, y1, t, o, ty }) => (
  <g opacity={o}>
    <path d={`M${x - 16} ${y0} L${x + 16} ${y0} M${x} ${y0} L${x} ${y1} M${x - 16} ${y1} L${x + 16} ${y1}`} stroke="#fff" strokeWidth={6} />
    <T x={x - 28} y={ty} t={t} o={1} tam={64} ancla="end" />
  </g>
);

export const Repisa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fRe = pal("repisa") ?? Math.round(d * 0.15), fFr = pal("evito") ?? Math.round(d * 0.35), fSe = pal("chocaria") ?? Math.round(d * 0.7);
  const fade = interpolate(f, [0, 16], [1, 0], clamp); // la foto del Eiger se funde con el dibujo
  const rojo = interpolate(f, [4, 16], [0, 1], clamp);
  const camino = interpolate(f, [fRe, fRe + 36], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const muro = interpolate(f, [fFr, fSe + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const oC = interpolate(f, [fFr - 4, fFr + 8], [0, 1], clamp);
  const z = interpolate(f, [0, d], [1, 1.05], clamp);
  const px = interpolate(camino, [0, 1], [150, XM - 10]), my = REP - muro * 180 * PM, mx = XM - 10 - muro * 14;
  return (
    <>
    <Svg>
      <Valle f={f} id="re" y0={640} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        {/* macizo: arista NO bajando a la izquierda, repisa, muro final desplomado, pilar que cae ~600 m */}
        <Roca id="reM" h="tarde" pm={14} tono={CALIZA} d={`M-300 ${REP + 280} L0 ${REP + 120} L130 ${REP + 6} L${XM} ${REP + 6} L${XM - 20} ${MURO + 20} L${XM - 4} ${MURO} L${XM + 60} ${MURO - 160} L${XM + 200} ${MURO - 420} L1400 ${MURO - 600} L1400 2400 L${XM + 120} 2400 L${XM + 60} ${PIE} L${XM + 30} ${REP + 300} L${XM + 10} ${REP + 30} L130 ${REP + 40} L0 ${REP + 160} L-300 ${REP + 330} Z`} />
        <path d={`M-300 ${REP + 280} L0 ${REP + 120} L130 ${REP + 6} L${XM} ${REP + 6}`} stroke="#E3E6E8" strokeWidth={7} fill="none" />
        <T x={40} y={REP + 250} t="ARISTA" o={rojo} tam={44} ancla="start" />
        {/* tramo bajo de la vía, que no hizo */}
        <g opacity={rojo}><path d={`M${XM + 40} ${REP + 340} L${XM + 22} ${REP + 30}`} stroke="#E5432E" strokeWidth={10} strokeDasharray="18 12" />
          <T x={XM + 70} y={REP + 220} t="NO LO HIZO" o={1} tam={50} col="#FFD1C7" ancla="start" />
          <T x={XM + 70} y={REP + 400} t="REPISA" o={oC} tam={46} col="#FFD1C7" ancla="start" /></g>
        {/* camino por la repisa y muro final */}
        <path d={`M150 ${REP - 2} L${px} ${REP - 2}`} stroke="#fff" strokeWidth={7} strokeDasharray="14 10" />
        <T x={300} y={REP - 30} t="REPISA" o={camino} tam={46} />
        {muro > 0 && <path d={`M${XM - 10} ${REP - 4} L${mx} ${my}`} stroke="#4CC777" strokeWidth={11} strokeLinecap="round" />}
        <circle cx={muro > 0 ? mx : px} cy={muro > 0 ? my : REP - 8} r={12} fill="#FFE7A8" stroke="#0B1624" strokeWidth={4} />
        {/* repisa de abajo (~15 m, exagerada para que se vea) y caída desde el tramo bajo que choca con ella */}
        <path d={`M${XM + 40} ${REP + 330} L${XM - 60} ${REP + 336} L${XM - 54} ${REP + 352} L${XM + 40} ${REP + 350} Z`} fill="#8D9296" stroke="#E5432E" strokeWidth={oC > 0 ? 5 : 0} />
        {(() => { const t = interpolate(f, [fSe, fSe + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }); const y = REP + 130 + t * 200, x = XM + 18 - t * 40;
          return t > 0 && <g><circle cx={x} cy={Math.min(y, REP + 326)} r={12} fill="#E5432E" stroke="#fff" strokeWidth={4} />
            {t >= 1 && <path d={`M${x - 30} ${REP + 300} l60 50 M${x + 30} ${REP + 300} l-60 50`} stroke="#fff" strokeWidth={9} />}</g>; })()}
        <Cota x={XM - 110} y0={MURO} y1={REP - 20} t="180 m" o={muro} ty={(MURO + REP) / 2 + 20} />
        <Cota x={XM - 110} y0={REP + 30} y1={PIE} t="600 m" o={oC} ty={REP + 300} />
        <T x={XM - 138} y={REP + 370} t="de vacío" o={oC} tam={46} ancla="end" />
      </g>
    </Svg>
    {fade > 0 && <AbsoluteFill style={{ opacity: fade }}><Img src={staticFile("fotos/E55/eiger-video.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 40%", transform: `scale(${1.2 + (1 - fade) * 0.1})` }} /></AbsoluteFill>}
    </>
  );
};
