// 2b · Primer plano del puño de freno: el extremo de la cuerda sube por dentro del puño y se escapa por arriba. Sin cara ni cuerpo.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Cuerda, Puno, Svg, ei, clamp } from "./comun";

export const Macro: React.FC<{ f: number; fExtremo: number }> = ({ f, fExtremo }) => {
  const pasa = f >= fExtremo;
  const capY = pasa ? 760 - ei(f, fExtremo, fExtremo + 8, 0, 1000, Easing.in(Easing.quad)) : ei(f, 0, fExtremo, 2200, 760, Easing.in(Easing.quad));
  const sacud = pasa && f < fExtremo + 9 ? Math.sin((f - fExtremo) * 2.6) * 10 * (1 - (f - fExtremo) / 9) : 0;
  const desp = f * 24 * interpolate(f, [0, fExtremo], [0.35, 1], clamp);
  return (
    <Svg>
      <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C1622" /><stop offset="1" stopColor="#1D3340" /></linearGradient></defs>
      <rect width={1080} height={1920} fill="url(#mg)" />
      <g transform={`translate(${sacud} 0)`}>
        {capY > -150 && <>
          <Cuerda d={`M540 -200 L540 ${capY + 10}`} w={46} />
          <path d={`M540 -200 L540 ${capY + 10}`} stroke="#8A3A10" strokeWidth={6} strokeDasharray="14 46" strokeDashoffset={-desp} fill="none" />
          <g transform={`translate(540 ${capY})`}><rect x={-27} y={-10} width={54} height={62} rx={12} fill="#3A1A0A" />{[-14, 0, 14].map((dx) => <path key={dx} d={`M${dx} 48 q${dx * 0.6} 22 ${dx * 1.4} 40`} stroke="#FF8A4A" strokeWidth={7} strokeLinecap="round" fill="none" />)}</g>
        </>}
        <Puno x={540} y={920} s={1.9} manga={[330, 520]} />
      </g>
    </Svg>
  );
};
