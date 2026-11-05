// 3 · Gobright 2019 (AAC: extremos desiguales, sin nudos): esquema limpio, dos extremos de la cuerda, uno no llega a la repisa.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Anclaje, Chip, Cuerda, Extremo, Rotulo, Svg, ei, type P, Camara } from "./comun";

export const Gobright: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAno = pal("diecinueve") ?? 90, fNom = pal("Gobright,") ?? pal("Gobright") ?? 130, fParecido = pal("parecido.") ?? pal("parecido") ?? 200;
  const caen = ei(f, 6, 40, 0, 1, Easing.out(Easing.cubic));
  const pulso = f > fParecido ? 1 + 0.12 * Math.sin((f - fParecido) * 0.45) : 1;
  const Y0 = 560, YR = 1260, YC = 1060;
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg>
        <defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B1624" /><stop offset="1" stopColor="#1D3340" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#gb)" />
        <rect x={760} y={0} width={400} height={1920} fill="#2A3B4C" /><path d="M760 0 L760 1920" stroke="#0B1624" strokeWidth={8} />
        <g transform="translate(540 850) scale(1.3) translate(-540 -900)"><rect x={240} y={YR} width={560} height={46} rx={14} fill="#52667A" stroke="#0B1624" strokeWidth={6} /><Anclaje x={640} y={Y0} />
        <Cuerda d={`M628 ${Y0 + 22} L470 ${Y0 + 22 + (YR - Y0 - 22) * caen}`} w={12} />
        <Cuerda d={`M652 ${Y0 + 22} L610 ${Y0 + 22 + (YC - Y0 - 22) * caen}`} w={12} />
        {caen > 0.98 && <><Extremo x={470} y={YR - 4} /><Extremo x={610} y={YC} /></>}
        {f > fParecido && <circle cx={610} cy={YC + 30} r={46 * pulso} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="8 12" />}
        {f > fParecido && <line x1={610} y1={YC + 90} x2={610} y2={YR - 12} stroke="#fff" strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" opacity={ei(f, fParecido, fParecido + 14, 0, 1)} />}
        </g>
        <Rotulo f={f} ini={fAno - 2} t="2019" y={250} tam={150} />
        <Chip x={300} y={600} t="BRAD GOBRIGHT" o={ei(f, fNom - 4, fNom + 6, 0, 1)} />
      </Svg>
    </Camara>
  );
};
