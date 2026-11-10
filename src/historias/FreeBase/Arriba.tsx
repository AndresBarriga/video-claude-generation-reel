// «Necesita unos segundos de caída, lejos de la pared. Y si todo sale bien, vuela.» Ilustración genérica (no es Potter):
// se impulsa lejos de la pared de un salto, se separa de la pared, lanza el extractor, la vela se abre girada hacia la pared (1 s) y corrige; vuela.
// Física: caída libre 9,8 m/s² a escala (1 m = 90 px).
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ESC, AZUL, PIES, Valle, ParedEiger, Vela, Etiqueta, Svg, clamp, sPersona, type P } from "./comun";

const PM = 90, SP = sPersona(PM), G = 9.8 * PM, BORDE = 720, Y0 = 820;

export const Arriba: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fS = 16, tA = 2.3, fA = fS + Math.round(tA * fps); // suelta · se abre la vela tras ~2,3 s de caída libre
  const tc = Math.max(0, (Math.min(f, fA) - fS) / fps);
  const yLibre = Y0 + 0.5 * G * tc * tc;
  const ta = Math.max(0, (f - fA) / fps), a = interpolate(ta, [0, 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const yb = yLibre + (f > fA ? G * tA * 0.35 * ta + 1.5 * PM * ta : 0); // tras abrir: frena a ~4 m/s
  const sep = interpolate(f, [fS, fS + 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hacia = interpolate(ta, [0.3, 0.9, 1.6], [0, 1, 0], clamp); // giro hacia la pared y corrección
  const xb = BORDE + 30 - sep * 3 * PM + hacia * 1.2 * PM - Math.max(0, ta - 1.4) * 3 * PM;
  const lanza = f > fS + Math.round(1.5 * fps);
  const cuerpo: [number, number] = [xb, yb];
  const cara = f < fS ? "esfuerzo" : f < fA + 20 ? "miedo" : "alivio";
  const fy = Math.max(860, yb + 40), cron = Math.min(tA, tc);
  return (
    <>
      <Svg>
        <g transform={`translate(0 ${-(fy - 860) * 0.12})`}><Valle f={f} id="ar" y0={-40} /></g>
        <g transform={`translate(${540 - (xb * 0.65 + BORDE * 0.35) + 120} ${860 - fy})`}>
          <ParedEiger x={BORDE} pm={PM} id="arp" y0={-600} y1={7000} />
          {f > fS && f < fA + 6 && Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${xb - 120 + i * 26} ${yb + 160 + (i % 3) * 60} l0 ${120 + (i % 4) * 40}`} stroke="#fff" strokeWidth={4} opacity={0.35} />)}
          {lanza && a < 0.2 && <><path d={`M${xb} ${yb - 60} L${xb - 40} ${yb - 260}`} stroke="#F4F4F4" strokeWidth={3} /><circle cx={xb - 40} cy={yb - 260} r={22} fill="#F2C230" /></>}
          {f > fA && <Vela x={xb + hacia * 30} y={yb - 4.2 * PM} pm={PM} a={a} cuerpo={[xb, yb - 30]} rot={hacia * 28 - Math.max(0, ta - 1.4) * 6} />}
          <Escalador x={xb} y={yb} quien="joe" s={SP} cara={cara} aspecto={ESC} mochila={AZUL} pies={PIES}
            pose={f < fS - 6 ? "escalando" : f < fS ? "agachado" : f < fA ? "cayendo" : "colgado"} rot={f < fS ? 0 : f < fA ? -35 + sep * 40 : 0} />
        </g>
      </Svg>
      {f >= fS && <Etiqueta texto={`${cron.toFixed(1).replace(".", ",")} s`} desde={fS} top={300} tam={130} />}
    </>
  );
};
