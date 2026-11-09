// 0 · Gancho: primerísimo plano de los ojos de Tomek, velados por la ceguera de la nieve, con escarcha; la frontal de ella le da de lleno y no parpadea.
import React from "react";
import { random, spring, useCurrentFrame } from "remotion";
import { Bocadillo, Camara, INV, Svg, Ventisca, type P } from "./comun";

const PIEL = "#E2A27E", PIELS = "#B97A5A", BARBA = "#4A3426";
export const Ojos: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tV = (pal("dice") ?? 40) + 4;
  const k = spring({ frame: f, fps: 30, config: { damping: 20, stiffness: 60 } });
  const luzX = 260 + 30 * Math.sin(f / 9);
  return (
    <Camara d={d} empuje={0.06} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill={INV.cielo0} />
        <g transform={`translate(540 980) scale(${1.25 - 0.1 * k}) translate(-540 -980)`}>
          {/* cara */}
          <ellipse cx={540} cy={1060} rx={470} ry={560} fill={PIEL} />
          <path d="M70 1060 Q90 1500 540 1640 Q300 1500 250 1100 Z" fill={PIELS} opacity={0.5} />
          {/* gorro */}
          <path d="M40 760 Q60 330 540 300 Q1020 330 1040 760 Q540 640 40 760 Z" fill="#2E5E8C" />
          <path d="M40 760 Q540 640 1040 760 L1040 840 Q540 720 40 840 Z" fill="#244C73" />
          {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={80 + random(`gs${i}`) * 920} cy={760 + random(`gy${i}`) * 60} r={4 + random(`gr${i}`) * 6} fill="#fff" opacity={0.8} />)}
          {/* cejas tensas */}
          <path d="M210 900 Q320 850 430 880" stroke={BARBA} strokeWidth={30} strokeLinecap="round" fill="none" />
          <path d="M650 880 Q760 850 870 900" stroke={BARBA} strokeWidth={30} strokeLinecap="round" fill="none" />
          {/* ojos velados: blancos, sin pupila, borde enrojecido */}
          {[320, 760].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={1000} rx={128} ry={92} fill="#C23A43" opacity={0.75} />
              <ellipse cx={x} cy={1000} rx={110} ry={78} fill="#F3F6F8" />
              <ellipse cx={x + 4} cy={1002} rx={60} ry={52} fill="#E3E9EE" opacity={0.9} />
              <ellipse cx={x - 30} cy={985} rx={26} ry={14} fill="#fff" opacity={0.9} />
              <path d={`M${x + 70} 1070 q10 60 -6 120`} stroke="#DDEFFC" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.8} />
              <path d={`M${x - 104} 994 Q${x} 930 ${x + 104} 994`} stroke={BARBA} strokeWidth={12} fill="none" />
              {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${x - 88 + i * 22} ${975 - Math.sin(i / 2.6) * 30} l${-4 + i} -26`} stroke="#F4FAFF" strokeWidth={6} strokeLinecap="round" />)}
            </g>
          ))}
          {/* nariz y barba escarchada */}
          <path d="M540 1010 Q500 1180 470 1230 Q540 1260 600 1230" stroke={PIELS} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M120 1220 Q170 1600 540 1680 Q910 1600 960 1220 Q860 1330 540 1330 Q220 1330 120 1220 Z" fill={BARBA} />
          <path d="M440 1390 Q540 1430 640 1390" stroke="#2A1C14" strokeWidth={22} fill="none" strokeLinecap="round" />
          {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={160 + random(`b${i}`) * 760} cy={1300 + random(`by${i}`) * 330} r={3 + random(`bz${i}`) * 5} fill="#F4FAFF" opacity={0.85} />)}
        </g>
        {/* la frontal de ella: haz de luz desde la izquierda */}
        <defs><radialGradient id="ojLuz" cx={luzX} cy={980} r={700} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFF3C4" stopOpacity={0.45} /><stop offset="1" stopColor="#FFF3C4" stopOpacity={0} /></radialGradient></defs>
        <rect width={1080} height={1920} fill="url(#ojLuz)" />
        <Ventisca f={f} n={50} />
      </Svg>
      <Bocadillo texto="No te veo." x={640} y={560} ancho={480} desde={0} tam={84} />
    </Camara>
  );
};
