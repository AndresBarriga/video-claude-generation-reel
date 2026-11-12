// s1: «Te los pones… y ya sabes que te has equivocado.» Sentado en el banco de la tienda se ajusta el velcro, se levanta y da tres pasos
// sobre los talones, con los brazos abiertos. La dependienta lo mira.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador, type Angulos } from "../../piezas/Escalador";
import { Svg, clamp, cam, mix, TU, DEP, G, type P } from "./comun";
import { Tienda, SUELO_T } from "./Tienda";

const AGACHADO: Angulos = { torso: 40, cabeza: 22, brazoA: [52, 30], brazoB: [44, 22], piernaA: [80, 0], piernaB: [72, -2] };
const SENTADO: Angulos = { torso: -4, cabeza: 4, brazoA: [24, 62], brazoB: [16, 56], piernaA: [80, 0], piernaB: [72, -2] };
const DE_PIE: Angulos = { torso: -3, cabeza: 14, brazoA: [64, 44], brazoB: [-64, -44], piernaA: [8, -10], piernaB: [-8, -10] };

export const Pone: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fP = pal("pones") ?? 11, fY = pal("y") ?? 27, fE = pal("equivocado") ?? 59;
  const sube = interpolate(f, [0, fP], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const alza = interpolate(f, [fP + 4, fY], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const anda = interpolate(f, [fY, fE + 8], [0, 1], clamp), fase = (f - fY) / 4.6, paso = anda > 0 && anda < 1 ? Math.sin(fase) : 0;
  let a = mix(mix(AGACHADO, SENTADO, sube), DE_PIE, alza);
  a = { ...a, torso: a.torso + paso * 5, brazoA: [a.brazoA[0] + paso * 16, a.brazoA[1] + paso * 10], brazoB: [a.brazoB[0] + paso * 16, a.brazoB[1] + paso * 10], piernaA: [a.piernaA[0] + paso * 13 * alza, a.piernaA[1]], piernaB: [a.piernaB[0] - paso * 13 * alza, a.piernaB[1]] };
  const x = 400 + alza * 40 + anda * 190, y = SUELO_T - 87 - alza * 49 - Math.abs(paso) * 5;
  const quieto = f > fE + 8, cara = alza < 0.5 ? (sube > 0.7 ? "serio" : "esfuerzo") : quieto ? "dolor" : "dolor";
  const cx = interpolate(f, [0, d], [455, 600], clamp), z = interpolate(f, [0, d], [1.72, 1.56], clamp);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={cam(cx, 1305, z)}>
          <Tienda />
          <Escalador x={775} y={SUELO_T - 136} quien="simon" angulos={{ torso: 0, cabeza: 6, brazoA: [22, 96], brazoB: [-14, 70], piernaA: [5, 0], piernaB: [-5, 0] }} cara={f > fE ? "alivio" : "normal"} aspecto={DEP} mira={-1} sombra={SUELO_T + 6} />
          <Escalador x={x} y={y} quien="joe" angulos={quieto ? { ...a, cabeza: 26, piernaA: [10, -10], piernaB: [-8, -10] } : a} cara={cara} aspecto={TU} pies={G.gato} sombra={alza > 0.5 ? SUELO_T + 6 : undefined} mira={1} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
