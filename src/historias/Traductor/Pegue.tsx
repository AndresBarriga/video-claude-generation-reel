// 5 · Rocódromo. «Lo tengo a un pegue.» (Nico jadeando, satisfecho) → REPETICIÓN: sit start, se despega cinco centímetros y culo a la colchoneta → su cara.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Rocodromo, sentadoR } from "../../piezas/Rocodromo";
import { Camara, Cerca, Dato, Nico, Partida, Planos, Svg, Zoom, clamp, golpe, type P } from "./comun";

export const Pegue: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => {
  const c = Math.round(d * 0.66);
  return <Planos d={d} cortes={[c]}><Repe d={c} /><Cara d={d - c} /></Planos>;
}} />;

const X = 330;
const Dice: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), resp = Math.sin(f / 3) * 4;
  return (
    <Camara d={d} empuje={0.05}>
      <Svg><Zoom s={2} cx={X} cy={1150} tx={540} ty={1050}>
        <Rocodromo />
        <Nico x={X} y={sentadoR() + resp} pose="sentadoSuelo" cara="alivio" angulos={{ brazoA: [150, 165], cabeza: -10 }} />
      </Zoom></Svg>
    </Camara>
  );
};

const Repe: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), sube = 14, cae = Math.min(d - 8, 30);
  const y = f < sube ? -interpolate(f, [0, sube], [0, 22], clamp) : f < cae ? -22 + interpolate(f, [cae - 4, cae], [0, 22], clamp) : interpolate(f, [cae, cae + 6], [6, 0], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const t = interpolate(f, [0, sube], [0, 0.5], clamp);
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg><g transform={`translate(${golpe(f, cae)} 0)`}><Zoom s={2} cx={X + 30} cy={1150} tx={540} ty={1050}>
        <Rocodromo hundido={f >= cae ? 0.8 : 0} />
        <Nico x={X + 20} y={sentadoR() + y} pose="sitStart" poseB="escalando" t={f >= cae ? 0 : t} cara={f >= cae ? "dolor" : "esfuerzo"} />
      </Zoom></g>
        {/* rayas de rebobinado (vídeo de móvil) */}
        {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={0} y={(random(`rr${i}${Math.floor(f / 3)}`) * 1920) | 0} width={1080} height={6} fill="#fff" opacity={0.12} />)}
      </Svg>
      <Dato texto="◀◀ REPETICIÓN" rojo />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 14px rgba(201,56,74,.55)" }} />
    </Camara>
  );
};

const Cara: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.1} entrada={false}><Svg><Cerca cx={X + 24} cy={sentadoR() - 160} s={3.6}>
    <Rocodromo hundido={0.8} />
    <Nico x={X + 20} y={sentadoR()} pose="sitStart" cara="dolor" angulos={{ cabeza: 10 }} />
  </Cerca></Svg></Camara>
);
