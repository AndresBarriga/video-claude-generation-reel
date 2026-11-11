// s2: «la cuerda es una idea» → la cuerda se vuelve gris discontinua · «el vacío lo está viendo» → la cámara baja por el vacío.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, clamp, type P, Fondo, Cueva, CuerdaSL, Tu, Asegura, ARRIBA, ANG_AGARRE, SUELO, cam, PC } from "./comun";
import { fuenteTitulo } from "../../tema";

const Tag: React.FC<{ x: number; y: number; t: string; c: string; o: number; s: number }> = ({ x, y, t, c, o, s }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={58 / s} fill={c} stroke="#050B14" strokeWidth={12 / s} paintOrder="stroke" opacity={o}>{t}</text>
);

export const Idea: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fC = pal("cuerda") ?? 30, fV = pal("vacio") ?? 74;
  const io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const idea = interpolate(f, [fC, fC + 10], [0, 1], clamp);
  const cy = interpolate(f, [0, fV - 4, fV + 22], [820, 900, 1950], io), z = interpolate(f, [0, fV - 4, fV + 22, d], [1.3, 1.25, 0.72, 0.68], io);
  const cx = interpolate(f, [fV - 4, fV + 22], [ARRIBA.x + 60, 560], io);
  const oV = interpolate(f, [fV + 10, fV + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Svg>
        <Fondo cx={cx} cy={cy} z={z} />
        <g transform={cam(cx, cy, z)}>
          <Cueva />
          <CuerdaSL arnes={ARRIBA} idea={idea} />
          <Asegura />
          <Tu x={ARRIBA.x} y={ARRIBA.y} ang={ANG_AGARRE} tiembla={Math.sin(f * 1.9) * 3} />
          {oV > 0 && <path d={`M${ARRIBA.x - 40} ${ARRIBA.y + 200} L${ARRIBA.x - 40} ${SUELO - 10}`} stroke={PC.miedo} strokeWidth={10 / z} strokeDasharray={`${30 / z} ${22 / z}`} opacity={oV} />}
          <Tag x={ARRIBA.x + 230} y={1180} t="UNA IDEA" c="#C9D0D8" o={idea} s={z} />
          <Tag x={ARRIBA.x - 40} y={1900} t="LO VE" c={PC.miedo} o={oV} s={z} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
