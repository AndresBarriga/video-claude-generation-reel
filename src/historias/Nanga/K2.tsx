// 5 · Rehook: en el campo base del K2, cuatro alpinistas dejan su expedición; una línea naranja vuela con un helicóptero hasta el Nanga Parbat.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, Etiqueta, INV, Svg, type P } from "./comun";

const Pico: React.FC<{ x: number; y: number; w: number; h: number; nombre: string; col: string }> = ({ x, y, w, h, nombre, col }) => (
  <g>
    <path d={`M${x - w / 2} ${y} L${x - w * 0.12} ${y - h * 0.7} L${x} ${y - h} L${x + w * 0.18} ${y - h * 0.75} L${x + w / 2} ${y} Z`} fill={INV.nieveSS} />
    <path d={`M${x} ${y - h} L${x + w * 0.18} ${y - h * 0.75} L${x + w / 2} ${y} L${x + w * 0.1} ${y} Z`} fill="#3A3F68" />
    <path d={`M${x - w * 0.12} ${y - h * 0.7} L${x} ${y - h} L${x + w * 0.08} ${y - h * 0.82} Z`} fill={INV.nieve} />
    <text x={x} y={y + 70} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={58} fill={col} stroke="#05040C" strokeWidth={10} paintOrder="stroke">{nombre}</text>
  </g>
);
const Heli: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y}) rotate(-8)`}>
    <rect x={-40 * Math.abs(Math.cos(f * 1.7))} y={-34} width={80 * Math.abs(Math.cos(f * 1.7)) + 1} height={5} fill="#1B2230" />
    <ellipse cx={0} cy={0} rx={46} ry={24} fill="#4C5A3A" /><path d="M40 -4 L110 -10 L112 2 L44 8 Z" fill="#4C5A3A" />
    <ellipse cx={-22} cy={-4} rx={16} ry={11} fill="#9FD3EE" /><path d="M0 -24 L0 -32" stroke="#1B2230" strokeWidth={5} />
  </g>
);

export const K2: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, d - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ax = 820, ay = 760, bx = 560, by = 1180;
  const hx = ax + (bx - ax) * t, hy = ay + (by - ay) * t - Math.sin(Math.PI * t) * 160;
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <CieloNoche id="k2" alba={0.6} />
        <path d="M-200 1700 Q540 1560 1280 1700 L1280 2400 L-200 2400 Z" fill="#2B2A4A" />
        <Pico x={ax} y={ay + 40} w={360} h={420} nombre="K2" col="#fff" />
        <Pico x={bx} y={by + 40} w={420} h={380} nombre="NANGA PARBAT" col="#FF6A1F" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={ax - 60 + i * 40} cy={ay + 10} r={10} fill="#FF8A3D" opacity={f < 14 ? 1 : 0.3} />)}
        <path d={`M${ax} ${ay} Q${(ax + bx) / 2} ${(ay + by) / 2 - 320} ${hx} ${hy}`} stroke="#FF6A1F" strokeWidth={8} strokeDasharray="22 14" fill="none" />
        <Heli x={hx} y={hy - 30} f={f} />
      </Svg>
      <Etiqueta texto="DEJAN EL K2" top={230} tam={130} desde={3} />
    </Camara>
  );
};
