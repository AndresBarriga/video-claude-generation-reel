// s0: mano agarrotada → la cuerda baja hasta quien asegura → su cara → la mano otra vez. Rótulo: «TU CEREBRO NO VE LA CUERDA».
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, Etiqueta, clamp, type P, Fondo, Cueva, CuerdaSL, Tu, Asegura, ARRIBA, ASE, ANG_AGARRE, cam } from "./comun";
import { PrimerPlano } from "./Mano";

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fT = pal("tu") ?? 31, fY = pal("aun") ?? 72, fM = pal("mano") ?? 100;
  const io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const enMano = f < fT || f >= fM;
  const cy = f < fY ? interpolate(f, [fT, fT + 8, fY - 6], [760, 900, 2250], io) : interpolate(f, [fY, fM], [660, 640], clamp);
  const cx = f < fY ? interpolate(f, [fT + 8, fY - 6], [ARRIBA.x + 40, ASE.x - 60], io) : ARRIBA.x + 30;
  const z = f < fY ? interpolate(f, [fT, fT + 8, fY - 6], [1.9, 1.15, 1.35], io) : interpolate(f, [fY, fM], [1.9, 2.05], clamp);
  return (
    <AbsoluteFill>
      {enMano ? <PrimerPlano f={f} tiembla={f < fT ? 0.6 : 1} blancos={f < fT ? 0.6 : 1} zoom={f < fT ? interpolate(f, [0, fT], [1.12, 1.04], clamp) : interpolate(f, [fM, d], [1.0, 1.12], clamp)} /> : (
        <Svg>
          <Fondo cx={cx} cy={cy} z={z} />
          <g transform={cam(cx, cy, z)}>
            <Cueva />
            <CuerdaSL arnes={ARRIBA} tension={0} />
            <Asegura cara="normal" />
            <Tu x={ARRIBA.x} y={ARRIBA.y} ang={ANG_AGARRE} tiembla={f >= fY ? Math.sin(f * 1.9) * 3 : 0} />
          </g>
        </Svg>
      )}
      <Etiqueta texto="TU CEREBRO NO VE LA CUERDA" desde={14} top={300} tam={92} />
    </AbsoluteFill>
  );
};
