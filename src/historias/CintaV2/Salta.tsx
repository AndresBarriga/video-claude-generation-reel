// Primer plano de frente: la cuerda pasa por encima de la puerta al caer, la abre y se sale (causa visible). Lo usan el gancho (desde el
// fotograma 0), el giro y el error 2. `fP` = empieza a bajar el cabo; `fS` = se sale. `ok` = antes de salir, halo verde (parecía bien).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Destello } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, ROJO, VERDE, CintaF, ParedCerca, CuerdaM, abajoDe, Rot } from "./comun";

export const Salta: React.FC<{ fP: number; fS: number; d: number; ok?: boolean; fuera?: string; zoom?: [number, number] }> = ({ fP, fS, d, ok, fuera: txt = "¡FUERA!", zoom = [1.45, 1.7] }) => {
  const f = useCurrentFrame();
  const baja = suave((f - fP) / Math.max(1, fS - fP)), fuera = f - fS, vacia = fuera > 0 ? Math.sin(fuera * 0.45) * 16 * Math.exp(-fuera / 26) : 0;
  const halo = fuera > 0 ? undefined : ok && baja < 0.5 ? VERDE : baja > 0.3 ? ROJO : undefined;
  const cinta = { x: 470, y: -150, puerta: "der" as const, giro: -8 + 30 * suave((baja - 0.1) / 0.5) * (fuera > 0 ? 0 : 1) + vacia, abreAbajo: fuera > 0 ? Math.max(0, 1 - fuera / 8) : suave((baja - 0.55) / 0.4), haloAbajo: halo };
  const ab = abajoDe(cinta), th = (-48 + 118 * baja) * Math.PI / 180, L = 1100;
  const ex = ab.x + 30 + Math.cos(th) * L, ey = ab.y + 30 + Math.sin(th) * L, sh = golpe(f, fS, 16), z = interpolate(f, [0, d], zoom, clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
      <Svg><g transform={`translate(540 1240) scale(${z}) translate(${-(ab.x + 60)} ${-(ab.y - 40)})`}>
        <ParedCerca seed="ab" />
        {fuera <= 0 && <CuerdaM d={`M${ab.x - 150} 2200 Q${ab.x - 110} ${ab.y + 400} ${ab.x - 4} ${ab.y + 44}`} />}
        <CintaF {...cinta} />
        {fuera <= 0 ? <CuerdaM d={`M${ab.x - 4} ${ab.y + 44} Q${ab.x + 70 + 40 * baja} ${ab.y + 10 + 60 * baja} ${ex} ${ey}`} corre={baja * 400} />
          : <CuerdaM d={`M${ab.x - 150 + fuera * 6} 2200 Q${ab.x + 60 + fuera * 16} ${ab.y + 300 + fuera * 10} ${ab.x + 150 + fuera * 26} ${ab.y + 120 + fuera * 30} T${ab.x + 900} ${ab.y + 1300 + fuera * 40}`} />}
        <Destello x={ab.x + 50} y={ab.y + 10} k={fuera} r={110} />
      </g></Svg>
      <Rot x={300} y={1450} texto="CAES ↓" k={interpolate(f, [fP - 4, fP + 4, fS - 2, fS + 4], [0, 1, 1, 0], clamp)} tam={78} />
      <Rot x={540} y={1400} texto={txt} color="#FF8E7E" k={fuera > 0 ? Math.min(1, fuera / 5) : 0} tam={120} />
    </AbsoluteFill>
  );
};
