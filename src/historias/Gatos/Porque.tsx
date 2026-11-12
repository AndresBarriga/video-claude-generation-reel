// s2: «¿Por qué lo hacemos?» plano general de la placa (él, pequeño, la cámara se lanza hacia su pie) · «cantos minúsculos»: corte al macro de la
// puntera sobre un canto de 2,3 mm, con una moneda de 1 € de canto debajo para medirlo (escala real).
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Svg, clamp, cam, golpe, TU_ROCA, G, Pildora, type P } from "./comun";
import { FondoP, Placa, EnPlaca, CuerdaP, enPlaca } from "./Placa";
import { Puntera, Moneda } from "./Puntera";
import { garraPara } from "./Gato";

const Y = 900, G40 = garraPara(25);
export const Porque: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fC = pal("cantos") ?? 65, fM = pal("minúsculos") ?? 75;
  if (f < fC) {
    const t = interpolate(f, [0, fC], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    const hip = enPlaca(Y), z = 0.62 + t * 1.9, cx = 520 + t * (hip.x + 70 - 520), cy = 760 + t * (Y + 100 - 760);
    const sube = Math.sin(f / 5) * 3;
    return (
      <AbsoluteFill><Svg>
        <FondoP h={0.05} cx={cx} cy={cy} z={z} />
        <g transform={cam(cx, cy, z)}>
          <Placa h={0.05} cintas={Y + 30} suelo={false} />
          <CuerdaP arnes={hip} tope={Y + 30} />
          <EnPlaca y={Y} aspecto={TU_ROCA} pies={G.gato} cara="esfuerzo" manoA={[0, sube]} cabeza={-24 + sube} />
        </g>
      </Svg></AbsoluteFill>
    );
  }
  const g = f - fC, carga = spring({ frame: g - 2, fps, config: { damping: 9, stiffness: 170 } });
  const o = spring({ frame: f - fM - 2, fps, config: { damping: 13, stiffness: 160 } });
  const k = interpolate(g, [0, d - fC], [80, 88], clamp), sh = golpe(f, fC + 2, 8);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh)}px)` }}>
      <Svg>
        <defs><linearGradient id="pq-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B7AB6" /><stop offset="1" stopColor="#CFE6F3" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#pq-cielo)" /><path d="M-50 1500 L160 1240 L300 1380 L470 1150 L640 1420 L640 1920 L-50 1920 Z" fill="#8FAAC4" opacity={0.7} />
        <Puntera k={k} x={770} y={860} L={25} g={G40} aplasta={(1 - carga) * 1.2 + 0.25}><Moneda L={25} o={o} /></Puntera>
      </Svg>
      <Pildora x={300} y={1262} texto="2,3 mm" color="#fff" desde={fM + 6} tam={64} />
    </AbsoluteFill>
  );
};
