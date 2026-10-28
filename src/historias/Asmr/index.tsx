// E32 «ASMR cepillado»: 8 s en bucle perfecto, sin texto. Todo es función periódica del fotograma (P = duración),
// así que el último fotograma empalma con el primero. El «reinicio» (presa sucia otra vez) queda escondido en la nube del soplido.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { Cepillo, PanelMacro, Presa, Suspension } from "../../piezas/Cepillado";
import { Svg, clamp } from "../Pegue/comun";
import { MANO } from "../Presa/comun";

const HX = 540, HY = 1080, HS = 1.55;
const sup = (x: number) => HY + HS * (-168 + 0.0024 * ((x - HX) / HS) ** 2);
/** Tiempos (en fracción del bucle) compartidos con el sonido (tools/sonido-cepillado.mjs). */
export const ASMR = { nube: 0.1, limpiaDe: 0.1, limpiaA: 0.84, brilloDe: 0.8, brilloA: 0.9, rate: 1 };

export const Asmr: React.FC<{ datos: Datos }> = ({ datos }) => {
  const f = useCurrentFrame(), { durationInFrames: P, fps } = useVideoConfig();
  const u = f / P, dist = Math.min(u, 1 - u); // distancia al punto de bucle
  const densa = Math.exp(-((dist / (ASMR.nube * 0.5)) ** 2));
  const limpio = interpolate(u, [ASMR.limpiaDe, ASMR.limpiaA], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const brillo = interpolate(u, [ASMR.brilloDe, ASMR.brilloA], [0, 1], clamp);
  const L = interpolate(dist, [ASMR.nube * 0.6, ASMR.nube * 1.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }); // cepillo dentro
  const a = 2 * Math.PI * ASMR.rate * (f / fps), v = Math.cos(a);
  const x = HX - 200 + 400 * Math.min(1, limpio + 0.08) + 110 * Math.sin(a);
  const sway = 1 + 0.012 * Math.sin((2 * Math.PI * f) / P);
  return (
    <AbsoluteFill style={{ background: "#2C3748" }}>
      <Sonidos datos={datos} />
      <AbsoluteFill style={{ transform: `scale(${sway})` }}>
        <Svg>
          <defs><filter id="difuso" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28" /></filter><linearGradient id="haz" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE7A8" stopOpacity="0.35" /><stop offset="1" stopColor="#FFE7A8" stopOpacity="0" /></linearGradient></defs>
          <PanelMacro />
          <Presa x={HX} y={HY} s={HS} sucia={1} limpio={limpio} brillo={brillo} seed="asmr" tw={(4 * f) / P} />
          <path d="M1080 0 L1080 520 L120 1920 L-300 1920 L620 0 Z" fill="url(#haz)" />
          <Suspension t={f} P={P} cx={560} cy={880} ancho={1000} alto={1300} n={70} seed="asmr" />
          <g filter="url(#difuso)">
            <Suspension t={f} P={P} cx={HX + (1 - densa) * 120} cy={HY - 120 - (1 - densa) * 160} ancho={700} alto={500} n={0} densa={densa} seed="sopl" />
            <ellipse cx={HX} cy={HY - 60} rx={430} ry={300} fill="#F4F6F8" opacity={0.95 * Math.max(0, (densa - 0.3) / 0.7)} />
          </g>
          <g transform={`translate(${(1 - L) * 900} ${(1 - L) * -900})`}>
            <Cepillo x={x} y={sup(x)} rot={32 - v * 9} s={0.85} doblado={-v} {...MANO} />
          </g>
        </Svg>
      </AbsoluteFill>
      <Grano />
    </AbsoluteFill>
  );
};
