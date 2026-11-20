// Gancho (v4): el escalador colgado en la vía, su antebrazo en radiografía brillando en rojo encima del dibujo (persona + causa en el
// segundo 1); la mano de abajo se suelta. Reencuadre: la cámara entra en ese antebrazo y pasa al antebrazo en radiografía grande.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Pasos } from "../../piezas/kit";
import { type V } from "../Pump/Perfil";
import { ESC, Esc, FondoGym, MANOS, cyDoblado } from "../Pump/Gym";
import { Macro } from "./Macro";
import { Chip, Svg, Vig, ei, type P } from "./comun";

// Escalador de frente (el de E43 en el rocódromo), colgado de dos presas con los codos doblados.
const S = ESC, CX = 540, CY = cyDoblado;
const codo = (sh: V, m: V, l1: number, l2: number, lado: number): V => {
  const dx = m[0] - sh[0], dy = m[1] - sh[1], d = Math.min(l1 + l2 - 0.5, Math.hypot(dx, dy)), b = Math.atan2(dy, dx);
  const an = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  return [sh[0] + Math.cos(b + lado * an) * l1, sh[1] + Math.sin(b + lado * an) * l1];
};
const HOMBRO_R: V = [CX + 40 * S, CY - 132 * S];
export const ANTEBRAZO = { a: codo(HOMBRO_R, MANOS.R, 62 * S, 58 * S, -1), b: MANOS.R as V };
const Escena: React.FC<{ manoL?: V; f: number }> = ({ manoL = MANOS.L, f }) => (
  <g><FondoGym fuerte={0.3} /><Esc cx={CX} cy={CY} hx={CX} manoL={manoL} manoR={MANOS.R} cara="esfuerzo" f={f} /></g>
);

/** Antebrazo en rayos X superpuesto al dibujo (coordenadas de pantalla antes del zoom). */
const RxBrazo: React.FC<{ a: V; b: V; pump: number; f: number }> = ({ a, b, pump, f }) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const lat = 1 + 0.06 * Math.sin(f * 0.7) * pump, col = pump > 0.5 ? "#FF5A5F" : "#FF9A3C";
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <rect x={-20} y={-34} width={L + 40} height={68} rx={34} fill="#0E1C2E" opacity={0.75} />
      <ellipse cx={L * 0.42} cy={0} rx={L * 0.36 * lat} ry={22 * lat} fill={col} opacity={0.35 + 0.4 * pump} />
      <ellipse cx={L * 0.42} cy={0} rx={L * 0.36 * lat + 16} ry={22 * lat + 12} fill={col} opacity={0.25 * pump} filter="url(#rxB)" />
      <path d={`M0 -10 L${L} -6`} stroke="#FF5A5F" strokeWidth={8} strokeLinecap="round" />
      <rect x={-20} y={-34} width={L + 40} height={68} rx={34} fill="none" stroke="#9EC5FF" strokeWidth={6} />
    </g>
  );
};

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fF = pal("flojo") ?? 60;
  const pump = ei(f, 0, 24, 0.3, 1), suelta = ei(f, 26, 40, 0, 1), sh = ei(f, 26, 40, 0, 1) * Math.sin(f * 2.4) * 6;
  const mL: V = [MANOS.L[0] - 30 * suelta, MANOS.L[1] + 150 * suelta];
  const z = 1.3 + 0.35 * ei(f, 0, d, 0, 1), c = ANTEBRAZO, cx = (c.a[0] + c.b[0]) / 2, cy = (c.a[1] + c.b[1]) / 2 + 150;
  return (
    <AbsoluteFill style={{ background: "#0E1A27" }}>
      <Svg>
        <defs><filter id="rxB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter></defs>
        <g transform={`translate(${540 + sh} 1000) scale(${z}) translate(${-cx} ${-cy})`}>
          <Escena manoL={mL} f={f} />
          <RxBrazo a={c.a} b={c.b} pump={pump} f={f} />
        </g>
        <Vig />
        <Chip x={540} y={1500} t="✗ FLOJO" col="#FF8E7E" o={ei(f, fF - 2, fF + 6, 0, 1)} />
      </Svg>
    </AbsoluteFill>
  );
};

export const Reencuadre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), k = ei(f, 0, 12, 0, 1), c = ANTEBRAZO, cx = (c.a[0] + c.b[0]) / 2, cy = (c.a[1] + c.b[1]) / 2;
  return (
    <AbsoluteFill style={{ background: "#0E1A27" }}>
      {k < 1 && <Svg><g opacity={1 - k} transform={`translate(540 1000) scale(${1.5 + 3 * k}) translate(${-cx} ${-cy})`}>
        <Escena f={f} />
        <RxBrazo a={c.a} b={c.b} pump={1} f={f} />
      </g></Svg>}
      <div style={{ position: "absolute", inset: 0, opacity: k, transform: `scale(${0.85 + 0.15 * k})` }}>
        <Macro bomba={1.5} aprieta={0.9} flujo={0.2} residuos={ei(f, 10, d, 0, 0.6)} z={1.1} tiembla={0.6}>
          <Chip x={540} y={1500} t="✓ SIN RIEGO" col="#8FE0AE" o={ei(f, 10, 18, 0, 1)} />
        </Macro>
      </div>
    </AbsoluteFill>
  );
};

export const Lista: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fT = pal("tres") ?? 40;
  return (
    <AbsoluteFill>
      <Macro bomba={1.0} aprieta={0.5} flujo={0.5} residuos={0.3} z={1.0} />
      <Pasos actual={0} y={430} k={(f - fT + 4) / 8} />
    </AbsoluteFill>
  );
};
