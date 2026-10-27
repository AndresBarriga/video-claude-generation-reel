// «En tu defensa»: plano medio y una lupa sale de tu pantorrilla con el corte por dentro; «gemelo» se señala al decirlo.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Camara, Marca, Svg, temblor, type P } from "./comun";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";
import { Pantorrilla } from "./Pantorrilla";

export const Lupa: React.FC<{ k: number; de: [number, number]; cx: number; cy: number; r: number; children: React.ReactNode }> = ({ k, de, cx, cy, r, children }) => {
  const rr = r * k, ang = Math.atan2(cy - de[1], cx - de[0]), perp = ang + Math.PI / 2;
  return (
    <g>
      <defs><clipPath id="lupa"><circle cx={cx} cy={cy} r={rr} /></clipPath></defs>
      <path d={`M${de[0] + Math.cos(perp) * 40} ${de[1] + Math.sin(perp) * 40} L${cx + Math.cos(perp) * rr} ${cy + Math.sin(perp) * rr} L${cx - Math.cos(perp) * rr} ${cy - Math.sin(perp) * rr} L${de[0] - Math.cos(perp) * 40} ${de[1] - Math.sin(perp) * 40} Z`} fill="#fff" opacity={0.18 * k} />
      <circle cx={de[0]} cy={de[1]} r={44} fill="none" stroke="#fff" strokeWidth={6} opacity={k} />
      <circle cx={cx} cy={cy} r={rr} fill="#0E1A2A" />
      <g clipPath="url(#lupa)">{children}</g>
      <circle cx={cx} cy={cy} r={rr} fill="none" stroke="#fff" strokeWidth={10} />
    </g>
  );
};

export const Gemelo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tr = temblor(f, 1);
  const k = spring({ frame: f - 4, fps: 30, config: { damping: 14, stiffness: 160 } });
  const h = caderaDe(PX, PY, 3);
  const pant: [number, number] = [h.x + (h.p.rodilla[0] + h.p.tobillo[0]) / 2 - 10, h.y + (h.p.rodilla[1] + h.p.tobillo[1]) / 2];
  const g = pal("gemelo") ?? Math.round(d * 0.8);
  return (
    <Camara d={d} empuje={0.04} foco="50% 45%">
      <PlanoPared f={f} tr={tr} amp={0.8} cara="esfuerzo" />
      <Svg>
        <rect width={1080} height={1920} fill="#06101C" opacity={0.35 * k} />
        <Lupa k={k} de={pant} cx={470} cy={640} r={330}>
          <g transform="translate(600 925) scale(0.98)"><Pantorrilla th={tr * 5} c={Math.max(0, tr)} e={Math.max(0, -tr)} /></g>
        </Lupa>
        <Marca texto="gemelo" x={385} y={600} tx={560} ty={360} o={Math.min(1, Math.max(0, (f - g) / 5))} />
      </Svg>
    </Camara>
  );
};
