// TOMA 1 · cinta: primer plano. El puño resbala por la cinta hasta el mosquetón, que «muerde»; la cuerda se tensa y todo el peso tira de la mano.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Agarre, ExpresGrande, Destello, Bocadillo, suave } from "../../piezas/kit";
import { PP, Toma, clamp, golpe, type P } from "./comun";

export const Cinta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fE = pal("engancha") ?? 34, fP = pal("peso") ?? pal("tira") ?? 80;
  const baja = suave(interpolate(f, [2, fE], [0, 1], clamp)), k = f - fE, tira = interpolate(f, [fP - 4, fP + 6], [0, 1], clamp);
  const late = k > 0 ? 0.2 * Math.abs(Math.sin(k / 4.2)) * Math.exp(-Math.max(0, f - fP - 30) / 30) : 0, hinch = k > 0 ? Math.min(1, k / 5) : 0;
  const y = 760 + 150 * tira + (k > 0 && k < 8 ? Math.sin(k * 2) * 10 : 0), rojo = hinch > 0.5;
  return (
    <>
      <PP v={k > 0 ? 0 : 34} sh={golpe(f, fE, 22) + golpe(f, fP, 16)} tinte={rojo ? "#D8B49A" : "#C9B797"}>
        <g transform={`translate(0 ${150 * tira})`}>
          <ExpresGrande x={560} y={1180} s={1.25} abre={k > 0 ? 1 : 0} gira={-6 * baja + (k > 0 ? Math.sin(k / 3) * 2 : 0)} cuerda />
        </g>
        <Agarre x={560 + 6 * baja} y={y - 20 + 330 * baja} s={1.5 * (1 + 0.22 * hinch + late)} rot={-8} cierra={interpolate(f, [0, 5], [0.3, 1], clamp)} piel={rojo ? "#E8705C" : TU_PIEL} pielS={rojo ? "#B8402E" : "#94613E"} manga="#3F7F86" tiembla={k > 0 ? Math.sin(f * 2.3) * 5 : 0} />
        <Destello x={600} y={y + 330} k={k} r={190} />
        <Destello x={600} y={y + 330} k={k - 3} r={120} color="#E2533F" />
        {rojo && [0, 1, 2].map((i) => <path key={i} d={`M${330 - i * 26} ${y + 190 - i * 60} q-40 -16 -60 -60`} stroke="#E2533F" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f / 3 + i)} />)}
      </PP>
      <Toma n={1} k={f} />
      <Bocadillo x={300} y={560} texto="¡AY!" s={k > 2 && f < fP + 20 ? Math.min(1, (k - 2) / 4) : 0} />
      {void d}
    </>
  );
};
const TU_PIEL = "#B9825A";
