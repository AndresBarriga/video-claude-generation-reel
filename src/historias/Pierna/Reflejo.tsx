// El bucle del reflejo a cámara lenta: «se estira» (talón baja, el sensor se enciende) → «contrae» (sube de golpe) → «se pasa» → «y otra vez» (vuelve el temblor real).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Marca, Svg, temblor, type P } from "./comun";
import { Pantorrilla } from "./Pantorrilla";

export const Reflejo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const a = pal("estira") ?? 8, b = pal("contrae") ?? Math.round(d * 0.35), c = pal("pasa") ?? Math.round(d * 0.6), o = pal("otra") ?? Math.round(d * 0.8);
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  let th: number;
  if (f < o) th = interpolate(f, [0, a, b - 2, b + 4, c, c + 6, o], [0, -1, -9, 3, 12, 2, -6], cl); // negativo = talón abajo (se estira)
  else th = temblor(f, 1) * 6;
  const estira = Math.max(0, -th) / 9, contrae = Math.max(0, th) / 12;
  const sensor = f >= a && f < o ? interpolate(f, [a, b - 2, b + 6], [0, 1, 0.2], cl) : f >= o ? estira : 0;
  return (
    <Camara d={d} empuje={0.05} foco="50% 45%">
      <Svg>
        <rect width={1080} height={1920} fill="#0E1A2A" />
        <circle cx={540} cy={840} r={500} fill="#132438" />
        <g transform="translate(680 1190) scale(1.35)"><Pantorrilla th={th} c={contrae} e={estira} sensor={sensor} /></g>
        <Marca texto="sensor" x={680 - 214 * 1.35 + th * 2} y={1190 - 350 * 1.35} tx={110} ty={500} o={interpolate(f, [a + 4, a + 10], [0, 1], cl)} />
        {f < o && <text x={540} y={330} textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={42} fill="#fff" opacity={0.75}>CÁMARA LENTA</text>}
      </Svg>
    </Camara>
  );
};
