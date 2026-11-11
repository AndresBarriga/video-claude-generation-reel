// s6: la misma mano del s0 (bucle) con luz cálida · «te sueltas»: la mano se abre sola · caída tranquila con el MIEDO casi vacío ·
// «¿cuánto llevas diciendo "ya voy"?» + rótulo de envío · último plano = la mano agarrada otra vez (empalma con el s0).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, Etiqueta, clamp, type P, Fondo, Cueva, CuerdaSL, Tu, Asegura, Medidor, posCaida, cam } from "./comun";
import { PrimerPlano } from "./Mano";

export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fS = pal("sueltas") ?? 28, fQ = pal("cuanto") ?? 89, fFin = Math.min(d - 10, (pal("voy") ?? 140) + 14);
  const abre = interpolate(f, [fS, fS + 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const mano = f < fS + 14 || f >= fFin;
  const t = interpolate(f, [fS + 14, fS + 40], [0, 1], clamp);
  const p = posCaida(t);
  const cy = interpolate(f, [fS + 14, fS + 40], [700, 1150], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      {mano ? <PrimerPlano f={f} tiembla={f >= fFin ? 0.6 : 0.15} blancos={f >= fFin ? 0.6 : 0.2} abre={f >= fFin ? 0 : abre} calido={f >= fFin ? 0 : 1} zoom={1.06} /> : (
        <Svg>
          <Fondo cx={p.x + 40} cy={cy} z={1.15} calido={1} />
          <g transform={cam(p.x + 40, cy, 1.15)}>
            <Cueva />
            <CuerdaSL arnes={p} floja={p.floja} tension={1} />
            <Asegura cara="alivio" />
            <Tu x={p.x} y={p.y} ang={p.ang} cara="alivio" />
          </g>
          <rect x={0} y={0} width={1080} height={1920} fill="#FFB27F" opacity={0.08} />
        </Svg>
      )}
      {!mano && <Medidor v={interpolate(f, [fS + 14, fS + 40], [0.3, 0.08], clamp)} o={interpolate(f, [fQ - 6, fQ], [1, 0], clamp)} />}
      {f >= fQ && <Etiqueta texto={"MÁNDASELO AL DEL «YA VOY»"} desde={fQ} top={300} tam={84} />}
    </AbsoluteFill>
  );
};
