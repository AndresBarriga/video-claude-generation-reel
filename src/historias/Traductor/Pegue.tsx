// 5 · «Lo tengo a un pegue.» (Nico jadeando, satisfecho) → REPETICIÓN: sit start, se despega cinco centímetros y culo al pad. 2.º gancho, físico.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Camara, Dato, Fondo, Nico, Partida, Svg, Zoom, clamp, golpe, sentado, type P } from "./comun";

export const Pegue: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => <Repe d={d} />} />;

const Dice: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), resp = Math.sin(f / 3) * 4;
  return (
    <Camara d={d} empuje={0.05}>
      <Svg><Zoom s={2} cx={330} cy={1150} tx={540} ty={1050}>
        <Fondo h={0.5} id="peg0" />
        <Nico x={330} y={sentado() + resp} pose="sentadoSuelo" cara="alivio" angulos={{ brazoA: [150, 165], cabeza: -10 }} />
      </Zoom></Svg>
    </Camara>
  );
};

const Repe: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), sube = 14, cae = 30;
  // despega muy despacio (cámara lenta), cuelga un instante y cae al pad
  const y = f < sube ? -interpolate(f, [0, sube], [0, 22], clamp) : f < cae ? -22 + interpolate(f, [cae - 4, cae], [0, 22], clamp) : interpolate(f, [cae, cae + 6], [6, 0], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const t = interpolate(f, [0, sube], [0, 0.5], clamp);
  return (
    <Camara d={d} empuje={0.05} entrada={false} sacudida={0}>
      <Svg><g transform={`translate(${golpe(f, cae)} 0)`}><Zoom s={2} cx={360} cy={1150} tx={540} ty={1050}>
        <Fondo h={0.5} id="peg1" hundido={f >= cae ? 0.8 : 0} />
        <Nico x={350} y={sentado() + y} pose="sitStart" poseB="escalando" t={f >= cae ? 0 : t} cara={f >= cae ? "dolor" : "esfuerzo"} />
      </Zoom></g></Svg>
      <Dato texto="REPETICIÓN" rojo />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 14px rgba(201,56,74,.55)" }} />
    </Camara>
  );
};
