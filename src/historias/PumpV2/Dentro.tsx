// Por dentro (corte grande del antebrazo): al apretar se hincha y estrecha sus vasos → entra menos sangre → se acumula lo que quema → la mano se abre.
import React from "react";
import { useCurrentFrame } from "remotion";
import { BRC, BarraBloques, Brazo, Camara, Chip, Corte, PM, Svg, Vig, ei, mundoC, type P } from "./comun";
import { MuroPerfil } from "../Pump/Perfil";

export const Dentro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fH = pal("hincha") ?? 30, fV = pal("vasos") ?? 70, fS = pal("sangre") ?? 110, fQ = pal("quema") ?? 150, fA = pal("abre") ?? 200;
  const aprieta = ei(f, 0, fV + 6, 0.2, 1), flujo = 1 - 0.9 * ei(f, fS - 6, fQ, 0, 1), res = ei(f, fQ - 6, fA, 0, 1);
  const bomba = 0.5 + 0.7 * ei(f, fH - 6, fV, 0, 1) + 0.3 * res, abre = ei(f, fA - 4, fA + 10, 0, 1);
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  const [vx, vy] = mundoC(-110, -52), [mx, my] = mundoC(-250, 20);
  return (
    <Camara d={d} empuje={0.04} foco="50% 52%">
      <Svg>
        <g transform="translate(230 170)"><MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} /></g>
        <rect width={1080} height={1920} fill="#050B14" opacity={0.55} />
        <Vig />
        <Brazo {...BRC} f={f} bomba={bomba} corte={1} presa abre={abre} cierra={1 - abre} calor={0.3 + 0.5 * res} dentro={<Corte f={f} aprieta={aprieta} flujo={flujo} residuos={res} brilla={0.3 * res} />} />
        <Chip x={330} y={660} t="SE HINCHA" col="#FF9A3C" o={o(fH - 4, fV - 4)} />
        <Chip x={330} y={660} t="APRIETA LOS VASOS" col={PM.arteria} o={o(fV - 4, fS - 4)} />
        <path d={`M330 690 L${vx} ${vy - 10}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" opacity={o(fV - 4, fQ)} />
        <Chip x={520} y={1330} t="QUEMA" col="#FF6A1F" o={o(fQ - 4, fA)} />
        <path d={`M520 1296 L${mx} ${my + 30}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" opacity={o(fQ - 4, fA)} />
        <Chip x={540} y={1330} t="SE ABRE" col={PM.hielo} o={o(fA - 2, d + 10)} />
        <BarraBloques x={990} y0={560} y1={1220} v={5 * flujo} n={5} ancho={50} cols={[PM.arteria]} etiqueta="SANGRE" o={ei(f, fS - 10, fS, 0, 1)} />
      </Svg>
    </Camara>
  );
};
