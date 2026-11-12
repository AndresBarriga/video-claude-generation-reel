// s3: «para pisarlos no puede quedar hueco dentro del gato». El mismo paso en dos ventanas: arriba un gato con hueco delante de los dedos
// (amarillo): al cargar, la punta vacía se dobla y el pie se va; abajo, sin hueco, aguanta.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Svg, clamp, golpe, G, Pildora, type P } from "./comun";
import { Puntera, Ventana } from "./Puntera";
import { garraPara } from "./Gato";

const GJ = garraPara(26);
export const Hueco: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fH = pal("hueco") ?? 52, fS = fH - 4;
  const e1 = spring({ frame: f, fps, config: { damping: 14, stiffness: 150 } }), e2 = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 150 } });
  const carga = interpolate(f, [16, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const dobla = interpolate(f, [fS, fS + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }), cae = interpolate(f, [fS + 5, fS + 22], [0, 1], clamp);
  const sh = golpe(f, fS + 5, 10), ok = spring({ frame: f - fS - 12, fps, config: { damping: 10, stiffness: 200 } });
  const tiembla = f > 24 && f < fS ? Math.sin(f * 1.7) * 0.03 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, 0)` }}>
      <Svg>
        <defs><linearGradient id="hc-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C1A2C" /><stop offset="1" stopColor="#1B3350" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#hc-f)" />
        <Ventana x={50} y={330} w={980} h={480} borde={G.hueco} dy={(1 - e1) * -80}>
          <Puntera k={74} x={730} y={335} L={28.4} g={0} hueco dobla={dobla + tiembla * 4} cae={cae} aplasta={carga * 0.5} />
        </Ventana>
        <Ventana x={50} y={850} w={980} h={480} borde={G.bien} dy={(1 - e2) * 80}>
          <Puntera k={74} x={730} y={335} L={26} g={GJ} aplasta={carga * 0.5} halo={G.bien} haloO={ok} />
          <g transform={`translate(520 150) scale(${ok})`}><circle r={58} fill={G.bien} stroke="#06101C" strokeWidth={8} /><path d="M-26 2 L-8 22 L28 -20" stroke="#06101C" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
        </Ventana>
      </Svg>
      <Pildora x={250} y={400} texto="CON HUECO" color={G.hueco} desde={6} />
      <Pildora x={245} y={920} texto="SIN HUECO" color={G.bien} desde={10} />
    </AbsoluteFill>
  );
};
