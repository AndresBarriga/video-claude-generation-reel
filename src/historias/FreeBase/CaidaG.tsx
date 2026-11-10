// La caída en grande (sigue al congelado del gancho). 1 m = 160 px: la cámara cae con él, la pared pasa rozando, el
// cronómetro corre. A 1,6 s lanza el extractor; a 2,3 s la vela (≈7 m) se abre llenando la pantalla y la cámara se
// aleja hasta enseñar el valle: vuela. Caída libre a 9,8 m/s².
import React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ESC, AZUL, PIES, Abismo, ParedEiger, Vela, Etiqueta, Svg, clamp, golpe, sPersona, type P } from "./comun";

const PM = 160, SP = sPersona(PM), G = 9.8 * PM, BORDE = 640, TA = 2.3;

export const CaidaG: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const f0 = 3, fA = f0 + Math.round(TA * fps);
  const tc = Math.max(0, (Math.min(f, fA) - f0) / fps), ta = Math.max(0, (f - fA) / fps);
  const yb = 1000 + 0.5 * G * tc * tc + (f > fA ? (G * TA * 0.25 + 4 * PM) * ta * Math.exp(-ta * 0.4) : 0);
  const sep = interpolate(tc, [0, 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const xb = BORDE - 40 - sep * 2.2 * PM - ta * 1.6 * PM;
  const tt = Math.max(0, (f - f0) / fps); // tiempo total desde que suelta
  const a = interpolate(tt, [2.15, 2.7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  const pcY = interpolate(tt, [1.6, 1.95], [0, 3.6], clamp) * PM, bolsa = interpolate(tt, [1.95, 2.15], [0, 2.4], clamp) * PM;
  const lanza = tc > 1.6;
  const z = interpolate(ta, [0.25, 1.8], [1, 0.32], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sh = golpe(f, fA, 22);
  const cy = yb - 120, cx = xb + 120 * z;
  const vel = Math.min(1, tc / TA) * (f < fA ? 1 : 0);
  return (
    <>
      <Svg>
        <g transform={`translate(0 ${-Math.min(260, (yb - 1000) * 0.06)})`}><Abismo f={f} id="cg" hz={410} /></g>
        <g transform={`translate(${540 + sh} ${820}) scale(${z}) translate(${-cx} ${-cy})`}>
          <ParedEiger x={BORDE} pm={PM} id="cgp" y0={-400} y1={9000} />
          {vel > 0 && Array.from({ length: 16 }).map((_, i) => { const x = xb - 260 + random(`sl${i}`) * 520, y = yb - 500 + ((random(`sy${i}`) * 1400 - f * 60) % 1400 + 1400) % 1400;
            return <path key={i} d={`M${x} ${y} l0 ${80 + vel * 160}`} stroke="#fff" strokeWidth={4} opacity={0.18 + vel * 0.3} />; })}
          {lanza && a < 0.5 && <g>
            <path d={`M${xb - 10} ${yb - 90} L${xb - 26} ${yb - 90 - pcY}`} stroke="#F4F4F4" strokeWidth={4} />
            <circle cx={xb - 26} cy={yb - 90 - pcY} r={20 + interpolate(tt, [1.6, 1.9], [0, 34], clamp)} fill="#F2C230" stroke="#B8860B" strokeWidth={4} />
            {bolsa > 0 && <><path d={`M${xb - 6} ${yb - 90} L${xb - 18} ${yb - 90 - bolsa}`} stroke="#3A3F48" strokeWidth={3} /><rect x={xb - 46} y={yb - 130 - bolsa} width={56} height={70} rx={14} fill="#E04A2A" stroke="#A83018" strokeWidth={4} /></>}
          </g>}
          {a > 0 && <Vela x={xb + 20} y={yb - (2.4 + 1.9 * a) * PM} pm={PM} a={a} cuerpo={[xb, yb - 60]} rot={-6 + Math.sin(ta * 2) * 4} />}
          <Escalador x={xb} y={yb} quien="joe" s={SP} aspecto={ESC} mochila={AZUL} pies={PIES} cara={f < fA + 25 ? "miedo" : "alivio"}
            pose={f < fA ? "cayendo" : "colgado"} rot={f < fA ? -30 + Math.sin(tc * 3) * 18 : 0} />
        </g>
      </Svg>
      <Etiqueta texto={`${Math.min(TA, tc).toFixed(1).replace(".", ",")} s`} desde={0} top={300} tam={130} />
    </>
  );
};
