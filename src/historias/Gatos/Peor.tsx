// s7: «Si te duelen tanto que no quieres pisar, escalas peor.» En la placa: acerca el pie al canto, le duele y lo retira (dos veces);
// sin cargar los pies se va el otro y resbala placa abajo hasta que la cuerda le para.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, clamp, cam, golpe, TU_ROCA, G, type P } from "./comun";
import { FondoP, Placa, EnPlaca, CuerdaP, enPlaca, xP } from "./Placa";

const Y = 900, CAIDA = 370;
export const Peor: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fE = pal("escalas") ?? 66, DUR = 15;
  const toca = (a: number) => interpolate(f, [a - 6, a, a + 3, a + 8], [1, 0, 0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const lev = Math.min(toca(13), toca(34)) * (f > 42 ? 1 : 1), tiembla = f > 40 && f < fE ? Math.sin(f * 2.1) * 3 : 0;
  const t = interpolate(f, [fE, fE + DUR], [0, 1], clamp), frena = f - (fE + DUR);
  const y = Y + (t < 1 ? CAIDA * t * t : CAIDA + 34 * Math.exp(-frena / 6) * Math.cos(frena * 0.75) - 34 * Math.exp(-frena / 6));
  const cae = f >= fE, duele = lev < 0.25 && !cae, hip = { x: enPlaca(y).x - (cae ? 14 * Math.min(1, t * 2) : 0), y };
  const sh = golpe(f, fE + DUR, 12), cy = interpolate(f, [fE, fE + DUR + 6], [Y + 20, Y + CAIDA - 60], { ...clamp, easing: Easing.inOut(Easing.cubic) }), z = interpolate(f, [0, fE, fE + DUR + 6, d], [1.75, 1.95, 1.5, 1.56], clamp);
  const pie = { x: xP(Y + 105) - 6, y: Y + 110 };
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh)}px)` }}>
      <Svg>
        <defs><radialGradient id="pr-d"><stop offset="0" stopColor={G.dolor} stopOpacity="0.9" /><stop offset="1" stopColor={G.dolor} stopOpacity="0" /></radialGradient></defs>
        <FondoP h={0.38} cx={hip.x + 40} cy={cy} z={z} />
        <g transform={cam(enPlaca(Y).x + 50, cy, z)}>
          <Placa h={0.38} cintas={Y + 30} suelo={false} />
          {/* el canto que no se atreve a pisar */}
          <path d={`M${xP(Y + 112) - 2} ${Y + 122} h26`} stroke="#F2F6FA" strokeWidth={6} strokeLinecap="round" /><path d={`M${xP(Y + 112) - 2} ${Y + 128} h26`} stroke="#2A323D" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
          <CuerdaP arnes={hip} tope={Y + 30} floja={cae ? 0.6 * (1 - t) : 0.15} />
          {duele && <circle cx={pie.x} cy={pie.y} r={46 + Math.sin(f * 1.3) * 6} fill="url(#pr-d)" />}
          <EnPlaca y={y} dx={hip.x - enPlaca(y).x} aspecto={TU_ROCA} pies={G.gato} cara={cae ? (frena > 8 ? "serio" : "miedo") : duele ? "dolor" : "esfuerzo"}
            pieA={cae ? [-8, 14] : [-30 * lev + tiembla, -34 * lev]} pieB={cae ? [0, 8] : [0, 0]} manoA={cae ? [4, -18] : [0, 0]} torso={cae ? 10 : 16 + (1 - lev) * 3} cabeza={cae ? -30 : duele ? 14 : 8 * lev} />
          {cae && t < 1 && [0, 1, 2, 3].map((i) => <circle key={i} cx={xP(y - 60 - i * 34) - 6} cy={y - 40 - i * 34} r={9 - i} fill="#E8EDF2" opacity={0.6 - i * 0.12} />)}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
