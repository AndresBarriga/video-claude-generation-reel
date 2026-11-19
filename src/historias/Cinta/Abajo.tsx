// s3: «Y abajo, igual»: primer plano del mosquetón de la cuerda. Con la puerta hacia donde escalas, la cuerda sale cruzando POR ENCIMA de la puerta;
// al caer, el cabo baja de golpe, empuja la puerta, la abre y se sale. La cinta se queda vacía, balanceándose.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Destello, Chip } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, type P, ROJO } from "./comun";
import { CintaF, ParedCerca, CuerdaM, abajoDe } from "./Macro";
import { Rot } from "./Bien";

export const Abajo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fP = pal("pasa") ?? 50, fS = (pal("sale") ?? 115) - 2;
  const baja = suave((f - fP) / (fS - fP)), fuera = f - fS, vacia = fuera > 0 ? Math.sin(fuera * 0.45) * 16 * Math.exp(-fuera / 26) : 0;
  const cinta = { x: 470, y: -150, puerta: "der" as const, giro: -8 + 30 * suave((baja - 0.1) / 0.5) * (fuera > 0 ? 0 : 1) + vacia, abreAbajo: fuera > 0 ? Math.max(0, 1 - fuera / 8) : suave((baja - 0.55) / 0.4), haloAbajo: fuera > 0 ? undefined : ROJO };
  const ab = abajoDe(cinta), th = (-48 + 118 * baja) * Math.PI / 180, L = 1100;
  const ex = ab.x + 30 + Math.cos(th) * L, ey = ab.y + 30 + Math.sin(th) * L, sh = golpe(f, fS, 16), z = interpolate(f, [0, 30, d], [1.25, 1.55, 1.65], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
      <Svg><g transform={`translate(540 880) scale(${z}) translate(${-(ab.x + 60)} ${-(ab.y - 40)})`}>
        <ParedCerca seed="ab" />
        {fuera <= 0 && <CuerdaM d={`M${ab.x - 150} 2200 Q${ab.x - 110} ${ab.y + 400} ${ab.x - 4} ${ab.y + 44}`} />}
        <CintaF {...cinta} />
        {fuera <= 0 ? <CuerdaM d={`M${ab.x - 4} ${ab.y + 44} Q${ab.x + 70 + 40 * baja} ${ab.y + 10 + 60 * baja} ${ex} ${ey}`} />
          : <CuerdaM d={`M${ab.x - 150 + fuera * 6} 2200 Q${ab.x + 60 + fuera * 16} ${ab.y + 300 + fuera * 10} ${ab.x + 150 + fuera * 26} ${ab.y + 120 + fuera * 30} T${ab.x + 900} ${ab.y + 1300 + fuera * 40}`} />}
        <Destello x={ab.x + 50} y={ab.y + 10} k={fuera} r={110} />
      </g></Svg>
      <Rot x={210} y={300} texto={fuera > 0 ? "✗ FALLO 2/2" : "FALLO 2/2"} color={fuera > 0 ? "#FF8E7E" : "#fff"} k={interpolate(f, [0, 8], [0, 1], clamp)} tam={64} />
      <Rot x={300} y={430} texto="CAES ↓" k={interpolate(f, [fP - 4, fP + 4, fS - 2, fS + 4], [0, 1, 1, 0], clamp)} tam={78} />
      <Rot x={540} y={520} texto="¡FUERA!" color="#FF8E7E" k={fuera > 0 ? Math.min(1, fuera / 5) : 0} tam={120} />
    </AbsoluteFill>
  );
};
