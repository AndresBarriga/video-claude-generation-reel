// Antebrazo de lado agarrado a una presa (estilo de src/piezas/Mano.tsx). Coordenadas locales: manga a la izquierda, mano a la derecha.
// bomba 0–1 hincha el músculo y saca las venas · abre 0–1 abre los dedos · calor 0–1 enrojece · corte 0–1 vuelve la piel transparente y enseña `dentro`.
import React from "react";
import { PM } from "./comun";

const T = "#141B26";
export type PropsBrazo = {
  x: number; y: number; s?: number; rot?: number; f?: number;
  bomba?: number; latido?: number; abre?: number; cierra?: number; calor?: number; corte?: number;
  dx?: number; dy?: number; giro?: number; dentro?: React.ReactNode; presa?: boolean; polvo?: number;
};

export const formaBrazo = (b: number) => {
  const h = 120 + b * 70;
  return `M-560 -110 Q-150 ${-h - 30} 260 -86 L380 -96 L380 90 L260 84 Q-150 ${h + 10} -560 110 Z`;
};

export const Brazo: React.FC<PropsBrazo> = ({ x, y, s = 1, rot = 0, f = 0, bomba = 0, latido = 0, abre = 0, cierra = 0, calor = 0, corte = 0, dx = 0, dy = 0, giro = 0, dentro, presa = true, polvo = 0.6 }) => {
  const b = bomba * (1 + latido * 0.05), forma = formaBrazo(b), vena = "#4C5F8E";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {presa && (
        <g>
          <rect x={925} y={-140} width={90} height={400} rx={18} fill="#2C3A52" stroke={T} strokeWidth={10} />
          <path d="M640 -60 Q760 -108 940 -84 L945 214 Q780 236 668 196 Q604 80 640 -60 Z" fill={PM.presa} stroke={T} strokeWidth={10} strokeLinejoin="round" />
          <path d="M668 -38 Q640 70 676 176" stroke={PM.presaS} strokeWidth={24} fill="none" strokeLinecap="round" opacity={0.65} />
          <path d="M674 -54 Q664 40 688 150" stroke={PM.mg} strokeWidth={20} fill="none" strokeLinecap="round" opacity={polvo} />
          <path d="M730 -80 q100 -6 190 2" stroke={PM.mg} strokeWidth={14} fill="none" strokeLinecap="round" opacity={polvo * 0.7} />
          <circle cx={970} cy={60} r={22} fill="#556482" stroke={T} strokeWidth={7} /><path d="M958 60 h24" stroke={T} strokeWidth={7} strokeLinecap="round" />
        </g>
      )}
      <g transform={`translate(${dx} ${dy}) rotate(${giro} -400 0)`}>
        <clipPath id="clipBrazo"><path d={forma} /></clipPath>
        {corte > 0 && <g clipPath="url(#clipBrazo)" opacity={Math.min(1, corte * 1.6)}>{dentro}</g>}
        <path d={forma} fill={PM.piel} opacity={1 - 0.86 * corte} />
        <path d={forma} fill="#E04646" opacity={calor * 0.38 * (1 - corte)} />
        <path d={`M-500 ${(120 + b * 70) * 0.55} Q-150 ${120 + b * 70 + 4} 240 70`} stroke={PM.pielS} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.7 * (1 - corte)} />
        <path d={forma} fill="none" stroke={T} strokeWidth={10} strokeLinejoin="round" />
        <g opacity={Math.min(1, b * 1.4) * (1 - corte)} stroke={vena} strokeLinecap="round" fill="none">
          <path d="M-470 -20 C-330 -70 -200 -10 -60 -60 S140 -40 250 -30" strokeWidth={10 + b * 8} />
          <path d="M-300 -40 C-250 10 -150 30 -40 10" strokeWidth={8 + b * 6} />
          <path d="M-120 -55 C-60 -100 40 -100 130 -70" strokeWidth={7 + b * 5} />
        </g>
        {/* mano: dorso, pulgar y cuatro dedos que se levantan al abrir */}
        <rect x={350} y={-104} width={230} height={206} rx={70} fill={PM.piel} stroke={T} strokeWidth={10} />
        {[-102, -50, 2, 54].map((yy, i) => {
          const ang = -abre * (34 + i * 7) + Math.sin(f * 0.9 + i * 1.3) * cierra * 5;
          return (
            <g key={i} transform={`rotate(${ang} 530 ${yy + 25})`}>
              <rect x={510} y={yy} width={150 - i * 8} height={50} rx={25} fill={PM.piel} stroke={T} strokeWidth={8} />
              <rect x={622 - i * 8} y={yy + 10} width={26} height={30} rx={10} fill="#F4F6F8" opacity={0.55} />
            </g>
          );
        })}
        <g transform={`rotate(${-abre * 30} 440 -111)`}>
          <rect x={420} y={-136} width={190} height={50} rx={25} fill={PM.piel} stroke={T} strokeWidth={8} />
        </g>
        <path d="M540 -90 q20 8 40 0" stroke={PM.pielS} strokeWidth={6} fill="none" strokeLinecap="round" />
        <rect x={-760} y={-150} width={260} height={300} rx={40} fill={PM.manga} stroke={T} strokeWidth={10} />
        <path d="M-520 -150 L-520 150" stroke={PM.mangaS} strokeWidth={14} />
      </g>
    </g>
  );
};
