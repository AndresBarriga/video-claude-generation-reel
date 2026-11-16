// s4 LA REGLA, de frente: la cuerda sube por dos cintas; primero vas a la derecha y luego a la izquierda. En cada chapa las puertas se dan
// la vuelta al lado contrario (rojo → verde, ✓). Al final, tirón de caída: la cuerda se tensa y las dos aguantan.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Destello, Sello } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, type P, ROJO, VERDE } from "./comun";
import { CintaF, ParedCerca, CuerdaM, abajoDe } from "./Macro";
import { Flecha, Rot } from "./Bien";

const S = 0.5, C1 = { x: 300, y: 860 }, C2 = { x: 760, y: 300 };
export const Regla: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fPu = pal("puertas") ?? 30, fCo = pal("contrario") ?? 64, fVa = pal("vas") ?? 111, fIz = pal("izquierda") ?? 160;
  const v1 = spring({ frame: f - fCo, fps, config: { damping: 9, stiffness: 160 } }), v2 = spring({ frame: f - fCo - 9, fps, config: { damping: 9, stiffness: 160 } });
  const tir = f - (fIz + 12), jerk = tir >= 0 ? Math.sin(tir * 0.9) * 8 * Math.exp(-tir / 7) : 0;
  const cinta = (c: { x: number; y: number }, v: number, lado: "der" | "izq") => {
    const bien = v > 0.5, puerta = (bien ? (lado === "der" ? "izq" : "der") : lado) as "izq" | "der", col = f < fPu ? undefined : bien ? VERDE : ROJO;
    return { x: c.x, y: c.y, s: S, puerta, giro: (lado === "der" ? -8 : 8) + jerk * (lado === "der" ? 1 : -1), haloArriba: col, haloAbajo: col };
  };
  const a = cinta(C1, v1, "der"), b = cinta(C2, v2, "izq"), pa = abajoDe(a), pb = abajoDe(b);
  const flip = (v: number) => `scale(${Math.abs(Math.cos(Math.min(1, v) * Math.PI)) * 0.85 + 0.15} 1)`, comba = tir >= 0 ? 0 : 40;
  return (
    <AbsoluteFill style={{ transform: `translate(${golpe(f, fIz + 12, 12)}px, 0)` }}>
      <Svg><g transform={`translate(0 ${interpolate(f, [0, d], [50, -20], clamp)})`}>
        <g transform="translate(540 900) scale(0.62) translate(-540 -900)"><ParedCerca seed="rg" /></g>
        <CuerdaM d={`M230 2000 Q${230 + comba} 1600 ${pa.x} ${pa.y + 22}`} w={24} corre={f * 6} />
        <g transform={`translate(${C1.x} 0) ${flip(v1)} translate(${-C1.x} 0)`}><CintaF {...a} /></g>
        <CuerdaM d={`M${pa.x} ${pa.y + 22} Q${(pa.x + pb.x) / 2 + comba} ${(pa.y + pb.y) / 2 + comba} ${pb.x} ${pb.y + 22}`} w={24} corre={f * 6} />
        <g transform={`translate(${C2.x} 0) ${flip(v2)} translate(${-C2.x} 0)`}><CintaF {...b} /></g>
        <CuerdaM d={`M${pb.x} ${pb.y + 22} Q${pb.x - 160 - comba} ${pb.y - 260} 250 -120`} w={24} corre={f * 6} />
        <Flecha x1={pa.x + 150} y1={pa.y + 40} x2={pa.x + 330} y2={pa.y - 130} k={interpolate(f, [fVa - 8, fVa + 6], [0, 1], clamp)} w={22} />
        <Flecha x1={pb.x - 190} y1={pb.y - 40} x2={pb.x - 370} y2={pb.y - 250} k={interpolate(f, [fIz + 2, fIz + 12], [0, 1], clamp)} w={22} />
        <Destello x={C1.x} y={C1.y + 20} k={tir} r={110} color="#8FE0AE" /><Destello x={C2.x} y={C2.y + 20} k={tir - 2} r={110} color="#8FE0AE" />
      </g></Svg>
      <Sello x={C1.x + 170} y={C1.y + 130} ok k={suave((f - fCo - 6) / 8)} s={0.75} /><Sello x={C2.x - 170} y={C2.y + 190} ok k={suave((f - fCo - 15) / 8)} s={0.75} />
      <Rot x={760} y={1130} texto="VAS →" k={interpolate(f, [fVa - 6, fVa + 2], [0, 1], clamp)} tam={84} />
      <Rot x={300} y={760} texto="← PUERTAS" color="#8FE0AE" k={interpolate(f, [fIz - 22, fIz - 14], [0, 1], clamp)} tam={84} />
    </AbsoluteFill>
  );
};
