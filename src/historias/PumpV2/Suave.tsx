// Paso 3: escala suave. Misma travesía abajo y arriba (Pijpers 2003): arriba, cada presa se agarra más tiempo y se mueve más lento. Respira, agarra lo justo.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Colgado, MuroPerfil, Nube } from "../Pump/Perfil";
import { Camara, Chip, Svg, Vig, ei, type P } from "./comun";

const Lado: React.FC<{ alto: boolean; f: number; calma: number }> = ({ alto, f, calma }) => (
  <g transform={`translate(${alto ? 270 : -270} 0)`}>
    <g transform="translate(540 1000) scale(0.82) translate(-540 -1000)">
      <g transform="translate(230 170)">
        <MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} suelo={alto ? undefined : 1420} />
        <Colgado est={alto ? 0.2 * (1 - calma) : 0.5} cara={alto ? (calma > 0.5 ? "alivio" : "miedo") : "normal"} halo={alto ? 1 - calma : 0} dx={alto ? Math.sin(f * 1.9) * 3 * (1 - calma) : 0} />
      </g>
    </g>
  </g>
);
const Tiempo: React.FC<{ x: number; v: number; col: string; o: number }> = ({ x, v, col, o }) => (
  <g opacity={o}>
    <rect x={x - 180} y={1560} width={360} height={34} rx={17} fill="#0B1624" stroke="#fff" strokeWidth={4} />
    <rect x={x - 176} y={1564} width={352 * Math.min(1, v)} height={26} rx={13} fill={col} />
    <text x={x} y={1640} textAnchor="middle" fontFamily="Figtree" fontWeight={800} fontSize={30} fill="#fff" stroke="#050B14" strokeWidth={7} paintOrder="stroke">TIEMPO EN CADA PRESA</text>
  </g>
);
export const Suave: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fS = pal("suave") ?? 20, fM = pal("miedo") ?? 45, fMi = pal("midieron") ?? 150, fR = pal("respira") ?? 270, fJ = pal("justo") ?? 300;
  const sp = ei(f, fM - 6, fM + 8, 0, 1), calma = ei(f, fR, fJ + 10, 0, 1), barras = ei(f, fM, fMi + 20, 0, 1);
  return (
    <Camara d={d} empuje={0.02} foco="50% 50%">
      <Svg>
        <rect width={1080} height={1920} fill="#0E1A27" />
        <g opacity={1 - sp}><Lado alto f={f} calma={0} /></g>
        <g opacity={sp}>
          <clipPath id="sL"><rect x={0} y={0} width={540} height={1920} /></clipPath><clipPath id="sR"><rect x={540} y={0} width={540} height={1920} /></clipPath>
          <g clipPath="url(#sL)"><Lado alto={false} f={f} calma={0} /></g>
          <g clipPath="url(#sR)"><Lado alto f={f} calma={calma} /></g>
          <rect x={534} y={0} width={12} height={1920} fill="#fff" opacity={0.85} />
        </g>
        <Vig />
        <Nube x={790} y={760} k={ei(f, fR, fR + 30, 0, 1)} r={1.6} />
        <Chip x={540} y={1450} t="ESCALA SUAVE" col="#8FE0AE" o={ei(f, fS - 4, fS + 4, 0, 1) * (1 - sp)} />
        <Chip x={270} y={620} t="ABAJO" col="#fff" o={sp} />
        <Chip x={810} y={620} t="ARRIBA · CON MIEDO" col="#FF8E7E" o={sp * (1 - calma)} />
        <Chip x={810} y={620} t="✓ RESPIRA, LO JUSTO" col="#8FE0AE" o={sp * calma} />
        <Chip x={270} y={1490} t="CERCA DEL SUELO" col="#fff" o={sp} />
        <Chip x={810} y={1490} t="MISMA TRAVESÍA, ARRIBA" col="#FF8E7E" o={sp} />
        <Tiempo x={270} v={0.35 * barras} col="#3FB56B" o={sp} />
        <Tiempo x={810} v={(0.35 + 0.5 * barras) * (1 - 0.5 * calma)} col={calma > 0.5 ? "#3FB56B" : "#E5484D"} o={sp} />
      </Svg>
    </Camara>
  );
};
