// 2b · Primer plano del reverso: el extremo de la cuerda llega al dispositivo y se escapa. Sin personas.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Cuerda, Svg, ei, clamp } from "./comun";

export const Macro: React.FC<{ f: number; fExtremo: number }> = ({ f, fExtremo }) => {
  const pasa = f >= fExtremo;
  const capY = pasa ? 960 - ei(f, fExtremo, fExtremo + 7, 0, 1400, Easing.in(Easing.quad)) : ei(f, 0, fExtremo, 2150, 960, Easing.in(Easing.quad));
  const sacud = f >= fExtremo && f < fExtremo + 9 ? Math.sin((f - fExtremo) * 2.6) * 10 * (1 - (f - fExtremo) / 9) : 0;
  const desp = f * 22 * interpolate(f, [0, fExtremo], [0.35, 1], clamp);
  return (
    <Svg>
      <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C1622" /><stop offset="1" stopColor="#1D3340" /></linearGradient></defs>
      <rect width={1080} height={1920} fill="url(#mg)" />
      <g transform={`translate(${sacud} 0)`}>
        {!pasa && <g>
          <Cuerda d={`M540 1060 L540 ${Math.min(capY + 10, 2000)}`} w={44} />
          <path d={`M540 1060 L540 ${Math.min(capY + 10, 2000)}`} stroke="#8A3A10" strokeWidth={6} strokeDasharray="14 46" strokeDashoffset={-desp} fill="none" />
          <g transform={`translate(540 ${capY})`}><rect x={-26} y={-10} width={52} height={60} rx={12} fill="#3A1A0A" />{[-14, 0, 14].map((dx) => <path key={dx} d={`M${dx} 46 q${dx * 0.6} 22 ${dx * 1.4} 40`} stroke="#FF8A4A" strokeWidth={7} strokeLinecap="round" fill="none" />)}</g>
        </g>}
        {pasa && f < fExtremo + 7 && <path d="M540 830 L540 -200" stroke="#FF6A1F" strokeWidth={44} opacity={0.9} strokeLinecap="round" />}
        <rect x={380} y={830} width={320} height={230} rx={56} fill="#8D98A8" stroke="#0B1624" strokeWidth={10} />
        <rect x={500} y={846} width={80} height={198} rx={40} fill="#0B1624" />
        <circle cx={420} cy={800} r={78} fill="none" stroke="#C9D2DC" strokeWidth={26} />
        {!pasa && capY < 1060 && <rect x={514} y={846} width={52} height={198} rx={26} fill="#FF6A1F" opacity={0.0} />}
      </g>
    </Svg>
  );
};
