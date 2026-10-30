// Escena 7 («03:30»): su móvil llamando; detrás, el helicóptero zarandeado por el viento se retira.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, Hora, Svg, Viento, type P, T } from "./comun";
import { Heli } from "./Helicoptero";

export const Movil: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const vx = interpolate(f, [0, d], [620, 1000]), vy = 360 + Math.sin(f / 3) * 30;
  return (
    <Camara d={d} empuje={0.06} foco="50% 60%" sacudida={1.5}>
      <Svg>
        <CieloNoche id="mo" />
        <Heli x={vx} y={vy} rot={Math.sin(f / 4) * 14} />
        <Viento n={90} fuerza={2} op={0.65} />
        {/* mano con guante y móvil */}
        <g transform="translate(470 1060) rotate(-8)">
          <rect x={-150} y={-260} width={300} height={540} rx={40} fill="#0E1420" stroke="#0B1624" strokeWidth={8} />
          <rect x={-130} y={-230} width={260} height={470} rx={24} fill="#1C2A40" />
          <circle cx={0} cy={-60} r={56} fill="#2FA84F" />
          <path d="M-22 -80 q8 -10 18 0 l-6 10 q10 18 26 26 l10 -6 q10 10 0 18 q-40 14 -60 -30 z" fill="#fff" />
          <rect x={-200} y={60} width={150} height={190} rx={60} fill="#1B2230" />
          <rect x={60} y={40} width={140} height={190} rx={60} fill="#1B2230" />
        </g>
      </Svg>
      <div style={{ position: "absolute", top: 1100, left: 0, right: 0, textAlign: "center", fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 46, color: "#fff", transform: "rotate(-8deg) translateX(-40px)" }}>Llamando…</div>
      <Hora t={e.titulo} />
    </Camara>
  );
};
