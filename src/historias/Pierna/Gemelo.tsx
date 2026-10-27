// Explicación con el cuerpo: plano medio, todo apagado salvo la pierna; el gemelo se ve por dentro y se enciende en cada sacudida.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Cielo, P11, Pared, Svg, Valle, temblor, type P } from "./comun";
import { Tu, caderaDe, POSE_PARED } from "./Tu";

const rad = (g: number) => (g * Math.PI) / 180;
export const PlanoGemelo: React.FC<{ d: number; lento?: number; k?: number }> = ({ d, lento = 1, k = 1 }) => {
  const f = useCurrentFrame();
  const tr = temblor(f / lento, k);
  const s = 3, px = 780, py = 1240;
  const h = caderaDe(px, py, s);
  // rodilla y tobillo con el temblor aplicado (mismo cálculo que en Tu)
  const aR = 64 - 7 * tr, aT = -6 - 16 * tr;
  const rod: [number, number] = [h.x + Math.sin(rad(aR)) * 66 * s, h.y + Math.cos(rad(aR)) * 66 * s];
  const tob: [number, number] = [rod[0] + Math.sin(rad(aT)) * 64 * s, rod[1] + Math.cos(rad(aT)) * 64 * s];
  const ang = (Math.atan2(tob[1] - rod[1], tob[0] - rod[0]) * 180) / Math.PI;
  const contrae = Math.max(0, -tr); // se enciende cuando el talón sube
  const mx = (rod[0] * 0.6 + tob[0] * 0.4), my = (rod[1] * 0.6 + tob[1] * 0.4);
  return (
    <Camara d={d} empuje={0.08} foco={`${(mx / 1080) * 100}% ${(my / 1920) * 100}%`}>
      <Svg>
        <Cielo id="gcielo" />
        <Valle y={1700} />
        <Pared x0={px + 2} semilla="g" />
        <Tu px={px} py={py} s={s} tr={tr} cara="esfuerzo" cabeza={POSE_PARED.cabeza} />
        <rect x={-100} y={-100} width={1300} height={2200} fill="#06101C" opacity={0.5} />
        <defs><clipPath id="gclip"><circle cx={mx} cy={my} r={170} /></clipPath></defs>
        <g clipPath="url(#gclip)"><Pared x0={px + 2} semilla="g" /><Tu px={px} py={py} s={s} tr={tr} cara="esfuerzo" /></g>
        <circle cx={mx} cy={my} r={170} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} />
        {/* gemelo por dentro: detrás de la tibia, hacia el talón */}
        <g transform={`translate(${mx} ${my}) rotate(${ang})`}>
          <ellipse cx={0} cy={11 * s} rx={46 * s} ry={14 * s * (1 + 0.25 * contrae)} fill={P11.musculo} opacity={0.75 + 0.25 * contrae} />
          <path d={`M${36 * s} ${16 * s} L${74 * s} ${14 * s}`} stroke="#F4D9C8" strokeWidth={5 * s} strokeLinecap="round" />
          <ellipse cx={0} cy={11 * s} rx={46 * s + 18} ry={14 * s + 18} fill="none" stroke={P11.musculo} strokeWidth={6} opacity={0.5 * contrae} />
        </g>
      </Svg>
    </Camara>
  );
};

export const Gemelo: React.FC<P> = ({ d }) => <PlanoGemelo d={d} lento={interpolate(0, [0, 1], [1, 1])} />;
