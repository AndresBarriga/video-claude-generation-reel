// E82 · Honnold en una PLACA de granito: de pie sobre los pies, cadera dentro, brazos largos, manos que apenas tocan.
// Placa (escena 5, mediodía) y Vuelta (escena 10, la misma placa con luz cálida de final y la cámara más cerca).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Svg, COL, F, pop, cl, type P } from "./comun";
import { Cielo } from "./Capitan";

/** Superficie de la placa: x en la altura y (~13°: la recta pasa por los pies y las manos de la pose HONN a escala 1,6). */
const xP = (y: number) => 760 + (1500 - y) * 0.236;
const Losa: React.FC = () => (
  <g>
    <path d={`M${xP(400)} 400 L${xP(1900)} 1900 L1600 1900 L1600 400 Z`} fill="#D8D5CD" stroke={COL.tinta} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${xP(500 + i * 280) + 30} ${500 + i * 280} l300 -40`} stroke="#BDB8AE" strokeWidth={6} strokeLinecap="round" />)}
    {[[0.2, 1180], [0.5, 900], [0.8, 700]].map(([o, y], i) => <ellipse key={i} cx={xP(y as number) + 18} cy={y as number} rx={16} ry={6} fill="#fff" opacity={o as number} />)}
  </g>
);
/** Etiqueta con flecha (pantalla). */
const Nota: React.FC<{ t: string; x: number; y: number; ax: number; ay: number; k: number; color?: string }> = ({ t, x, y, ax, ay, k, color = COL.verde }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: Math.min(1, e) }}><path d={`M${x} ${y} L${ax} ${ay}`} stroke={COL.tinta} strokeWidth={14} strokeLinecap="round" /><path d={`M${x} ${y} L${ax} ${ay}`} stroke={color} strokeWidth={7} strokeLinecap="round" /><circle cx={ax} cy={ay} r={12} fill={color} stroke={COL.tinta} strokeWidth={5} /></svg>
      <div style={{ position: "absolute", left: x - 230, width: 460, top: y - 40, display: "flex", justifyContent: "center", transform: `scale(${e})` }}><div style={{ fontFamily: F, fontWeight: 900, fontSize: 44, color: "#fff", background: color, border: `6px solid ${COL.tinta}`, borderRadius: 22, padding: "2px 18px 6px", whiteSpace: "nowrap" }}>{t}</div></div>
    </>
  );
};

const HONN = (f: number, dentro: number) => ({ torso: 6 * dentro, cabeza: -6, brazoA: [100, 108], brazoB: [92, 100], piernaA: [58 + Math.sin(f / 9) * 2, 22], piernaB: [36, 12] }) as any;
/** Plano de la placa. cam: escala y centro; dentro 0–1 = cadera hacia la placa; notas = [texto, k, objetivo]. */
const Escena: React.FC<{ z: number; cx: number; cy: number; dentro: number; calido?: number; children?: React.ReactNode }> = ({ z, cx, cy, dentro, calido, children }) => {
  const f = useCurrentFrame(), hy = 1240 - f * 0.6;
  return (
    <>
      <Svg>
        <g transform={`translate(540 1060) scale(${z}) translate(${-cx} ${-cy})`}>
          <Cielo calido={calido} /><Losa />
          <Escalador x={xP(hy + 150) - 136 + 6 * dentro} y={hy} quien="joe" s={1.6} angulos={HONN(f, dentro)} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="normal" />
        </g>
      </Svg>
      {children}
    </>
  );
};

export const Placa: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fM = pal("manos") ?? 20, fP = pal("pie") ?? d - 40;
  const z = interpolate(f, [0, d], [0.95, 1.08], cl);
  return (
    <Escena z={z} cx={720} cy={1080} dentro={interpolate(f, [fP - 10, fP + 6], [0.3, 1], cl)}>
      <Nota t="MANOS CASI ABIERTAS" x={360} y={800} ax={700} ay={900} k={f - fM + 2} color={COL.azul} />
      <Nota t="DE PIE EN LOS PIES" x={330} y={1470} ax={640} ay={1420} k={f - fP + 2} />
    </Escena>
  );
};

export const Vuelta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fC = pal("cuelgues") ?? 10, fP = pal("pie") ?? d - 30;
  const z = interpolate(f, [0, d], [1.25, 1.4], cl);
  return (
    <Escena z={z} cx={700} cy={1060} dentro={1} calido={1}>
      {f < fP - 2 && <Nota t="CADERA DENTRO" x={330} y={900} ax={630} ay={1060} k={f - 2} color={COL.azul} />}
      <Nota t="BRAZOS LARGOS" x={380} y={1460} ax={700} ay={950} k={f - fC - 6} color={COL.azul} />
      {f >= fP - 2 && <Nota t="EMPUJAN LOS PIES" x={330} y={1470} ax={640} ay={1420} k={f - fP + 2} />}
    </Escena>
  );
};
