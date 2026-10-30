// Escena 8 («03:30»): el móvil vibra en tu mano temblorosa; detrás, el helicóptero zarandeado no consigue subir.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, Hora, Svg, Viento, type P, T } from "./comun";
import { Heli } from "./Helicoptero";

export const Movil: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const vx = interpolate(f, [0, d], [620, 1050]), vy = 380 + Math.sin(f / 3) * 40;
  const vib = Math.floor(f / 2) % 2 ? 4 : -4, pulso = (f % 24) / 24;
  return (
    <Camara d={d} empuje={0.07} foco="50% 60%" sacudida={2}>
      <Svg>
        <CieloNoche id="mo" />
        <Heli x={vx} y={vy} rot={Math.sin(f / 4) * 18} s={0.8} />
        <Viento n={100} fuerza={2.2} op={0.65} />
        <g transform={`translate(${470 + vib} 1060) rotate(${-8 + vib / 2})`}>
          <rect x={-150} y={-260} width={300} height={540} rx={40} fill="#0E1420" stroke="#0B1624" strokeWidth={8} />
          <rect x={-130} y={-230} width={260} height={470} rx={24} fill="#1C2A40" />
          <circle cx={0} cy={-60} r={56 + 40 * pulso} fill="#2FA84F" opacity={0.35 * (1 - pulso)} />
          <circle cx={0} cy={-60} r={56} fill="#2FA84F" />
          <path d="M-22 -80 q8 -10 18 0 l-6 10 q10 18 26 26 l10 -6 q10 10 0 18 q-40 14 -60 -30 z" fill="#fff" />
          <rect x={-200} y={60} width={150} height={190} rx={60} fill="#1B2230" />
          <rect x={60} y={40} width={140} height={190} rx={60} fill="#1B2230" />
        </g>
      </Svg>
      <div style={{ position: "absolute", top: 1100, left: 0, right: 0, textAlign: "center", fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 46, color: "#fff", transform: `rotate(-8deg) translateX(${-40 + vib}px)` }}>Llamando…</div>
      <Hora t={e.titulo} />
    </Camara>
  );
};
