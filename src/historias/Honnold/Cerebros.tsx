// Comparación: el cerebro de otro escalador «como un árbol de Navidad» / el de Honnold, apagado.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Svg, type P } from "./comun";
import { Cerebro } from "./Cerebro";
import { fuenteTexto } from "../../tema";

const Rot: React.FC<{ t: string; y: number }> = ({ t, y }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 52, color: "#fff" }}>{t}</div>
);
export const Cerebros: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t2 = pal("él") ?? pal("el") ?? Math.round(d * 0.6);
  const luz = interpolate(f, [2, 14], [0, 1], { extrapolateRight: "clamp" });
  const o2 = interpolate(f, [t2 - 6, t2 + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.04}>
      <Svg>
        <rect width={1080} height={1920} fill="#0E1A2A" />
        <g transform="translate(150 360) scale(2.2)"><circle r={30} fill="#E9B990" /><g transform="translate(-8 6)"><ellipse cx={6} cy={-4} rx={7} ry={9} fill="#fff" /><ellipse cx={22} cy={-4} rx={7} ry={9} fill="#fff" /><circle cx={8} cy={-3} r={3.6} fill="#141B26" /><circle cx={24} cy={-3} r={3.6} fill="#141B26" /><ellipse cx={17} cy={14} rx={5} ry={6.5} fill="#141B26" /></g><path d="M-32 -2 A32 32 0 0 1 32 -6 Q8 -14 -6 -10 Q-18 -8 -24 6 Z" fill="#2B1D14" /></g>
        <Cerebro x={600} y={560} s={1.45} luz={luz} sem="o" />
        <g opacity={o2}>
          <g transform="translate(150 1110) scale(2.2)"><CabezaHonnold cara="normal" /></g>
          <Cerebro x={600} y={1240} s={1.45} luz={0} sem="h" />
        </g>
      </Svg>
      <Rot t="Otro escalador" y={240} />
      <div style={{ opacity: o2 }}><Rot t="Honnold" y={920} /></div>
    </Camara>
  );
};
