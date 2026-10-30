// Escena 2: «Rebobina». Efecto de cinta hacia atrás: la noche se aclara a mañana, el reloj gira de 22:00 a 08:00, rayas de VHS. «¿Te quedas?»
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Camara, CieloNoche, Etiqueta, PG, Svg, type P, T } from "./comun";

export const Rebobina: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [0, d * 0.7], [0, 1], { extrapolateRight: "clamp" });
  const min = Math.round(interpolate(k, [0, 1], [22 * 60, 8 * 60]));
  const hora = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <CieloNoche id="rb" />
        <rect x={-300} y={-500} width={1700} height={3000} fill={PG.dia} opacity={k} />
        <path d="M-100 1500 L200 900 L380 700 L560 470 L700 760 L1000 1250 L1180 1500 Z" fill={k > 0.5 ? "#9FB0C6" : "#1A2436"} />
        {Array.from({ length: 6 }).map((_, i) => { const y = (random(`rb${i}`) * 1920 + f * 90) % 1920; return <rect key={i} x={0} y={y} width={1080} height={10 + random(`rh${i}`) * 30} fill="#fff" opacity={0.18} />; })}
      </Svg>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontWeight: 800, fontSize: 130, color: "#fff", textShadow: "0 4px 18px #000c" }}>{hora}</div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 48, letterSpacing: 8, color: "#fff", opacity: Math.floor(f / 8) % 2 ? 1 : 0.4 }}>REBOBINANDO</div>
      <Etiqueta texto={e.titulo} top={900} tam={130} desde={Math.round(d * 0.5)} />
    </Camara>
  );
};
