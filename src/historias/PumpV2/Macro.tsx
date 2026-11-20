// Primer plano del antebrazo en una regleta (gancho, reencuadre, lista y CTA comparten el plano: sin cortes a fondo oscuro).
// bomba = hinchado · abre = dedos que se despegan · rayos = piel transparente con el corte de vasos dentro (aprieta/flujo/residuos).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo, Corte, Svg, Vig } from "./comun";
import { Nube } from "../Pump/Perfil";

export const Macro: React.FC<{ bomba: number; abre: number; calor?: number; rayos?: number; aprieta?: number; flujo?: number; residuos?: number; z?: number; children?: React.ReactNode }> = ({ bomba, abre, calor = 0, rayos = 0, aprieta = 1, flujo = 0.2, residuos = 0, z = 1, children }) => {
  const f = useCurrentFrame(), lat = Math.sin(f * 0.62);
  return (
    <Svg>
      <defs><linearGradient id="gm2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1A27" /><stop offset="1" stopColor="#27434A" /></linearGradient></defs>
      <rect width={1080} height={1920} fill="url(#gm2)" />
      {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={140 + i * 150} cy={1380 + (i % 3) * 140} r={30 + (i % 4) * 14} fill="#9FD0E0" opacity={0.07} />)}
      <g transform={`translate(560 1020) scale(${z}) translate(-560 -1020)`}>
        <Brazo x={170} y={1020} s={0.85} rot={-4} f={f} bomba={bomba} latido={lat} calor={calor} abre={abre} cierra={1 - abre} polvo={0.95} corte={rayos}
          dentro={rayos > 0 ? <Corte f={f} aprieta={aprieta} flujo={flujo} residuos={residuos} brilla={0.3 * residuos} /> : undefined} />
        <Nube x={560} y={820} k={Math.min(1, f / 26) * 0.9} r={1.4} />
      </g>
      <Vig />
      {children}
    </Svg>
  );
};
