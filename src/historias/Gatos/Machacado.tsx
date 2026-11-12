// s4: «Pero ajustado no es machacado.» El mismo gato en corte: ajustado (verde, dedos un poco doblados) → se encoge de golpe:
// dedos en garra, nudillo contra la goma, rojo palpitando.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Svg, clamp, golpe, G, Pildora, type P } from "./comun";
import { Gato, Pie, garraPara } from "./Gato";
import { Tienda } from "./Tienda";

export const Corte: React.FC<{ L: number; dolor?: number; pulso?: number; halo: string; aplasta?: number; z?: number }> = ({ L, dolor = 0, pulso = 1, halo, aplasta = 0, z = 1 }) => {
  const g = garraPara(L);
  return (
    <Svg>
      <defs><filter id="mc-blur"><feGaussianBlur stdDeviation="9" /></filter></defs>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <g transform="translate(-1500 -1500) scale(2.4)" filter="url(#mc-blur)"><Tienda caja={false} /></g>
        <rect x={-200} y={-200} width={1500} height={2400} fill="#06101C" opacity={0.45} />
        <ellipse cx={540} cy={1150} rx={500} ry={30} fill="#000" opacity={0.35} />
        <g transform={`translate(${96 + (26 - L) * 17} 1110) scale(34)`}><Gato L={L} g={g} halo={halo} haloO={1} aplasta={aplasta}><Pie g={g} dolor={dolor} pulso={pulso} /></Gato></g>
      </g>
    </Svg>
  );
};

export const Machacado: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fM = (pal("machacado") ?? 42) + 2;
  const s = spring({ frame: f - fM, fps, config: { damping: 8, stiffness: 220 } });
  const L = 26 - 1.6 * s, sh = golpe(f, fM, 14);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
      <Corte L={L} dolor={interpolate(f, [fM, fM + 4], [0, 1], clamp)} pulso={0.5 + 0.5 * Math.sin((f - fM) * 0.7)} halo={f >= fM ? G.dolor : G.bien} aplasta={f >= fM ? Math.exp(-(f - fM) / 4) * 1.4 : 0} z={interpolate(f, [0, d], [1, 1.07], clamp)} />
      {f < fM ? <Pildora x={540} y={560} texto="AJUSTADO" color={G.bien} desde={4} tam={84} /> : <Pildora x={540} y={560} texto="MACHACADO" color={G.dolor} desde={fM} tam={84} tinta="#fff" />}
    </AbsoluteFill>
  );
};
