// 5 · el músculo se adapta en semanas, la polea en meses: el antebrazo se hincha, las cuerdas y las anillas no.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chip, Svg, ei, type P } from "../Pump/comun";
import { Lamina, alrededor } from "./Lamina";
import { PA } from "./laminas";

export const Adapta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSem = pal("semanas") ?? 40, fPol = pal("despacio") ?? 90, fLes = pal("lesión") ?? pal("lesion") ?? 140;
  const hincha = ei(f, 0, fSem, 0, 1) * (1 + 0.08 * Math.sin(f * 0.4));
  const les = ei(f, fLes - 4, fLes + 10, 0, 1);
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  return (
    <Camara d={d} empuje={0.02} foco="50% 45%">
      <Svg>
        <Lamina html={PA} tf={alrededor(540, 700, 1.02)} />
        <ellipse cx={590} cy={480} rx={300 + 40 * hincha} ry={190 + 30 * hincha} fill="#FF5A4A" opacity={0.28 * hincha} />
        <ellipse cx={600} cy={1020} rx={110} ry={70} fill="none" stroke="#fff" strokeWidth={8} opacity={ei(f, fPol - 6, fPol + 4, 0, 0.9)} />
        <ellipse cx={600} cy={1020} rx={150} ry={100} fill="#FF2A1F" opacity={0.35 * les} />
        <Chip x={830} y={420} t="SEMANAS" col="#FF8A4A" o={o(fSem - 14, fPol - 6)} />
        <Chip x={830} y={1180} t="MESES" col="#fff" o={o(fPol - 6, d + 20)} />
      </Svg>
    </Camara>
  );
};
