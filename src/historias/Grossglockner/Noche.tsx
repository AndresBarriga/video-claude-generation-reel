// Escena 4: anochece; atascados a 50 m de la cumbre. Ella sentada, agotada; él de pie con la mochila (y la manta).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, CruzCumbre, EL, ELLA, Frontal, Manta, Svg, Viento, sueloY, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

export const Noche: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const oscuro = interpolate(f, [0, d * 0.6], [0.0, 1], { extrapolateRight: "clamp" });
  const s = 1.6, xa = 380, xe = 650;
  const ha = sueloY(xa) - 30 * s, he = sueloY(xe) - 140.6 * s;
  return (
    <Camara d={d} empuje={0.05} foco="55% 45%">
      <Svg>
        <CieloNoche id="no" />
        <rect x={-300} y={-500} width={1700} height={3000} fill="#E89A5A" opacity={0.35 * (1 - oscuro)} />
        <path d="M760 520 L900 260 L1040 540 Z" fill="#9FB0C6" /><CruzCumbre x={900} y={262} s={0.7} color="#C9D6E6" />
        <g stroke="#fff" strokeWidth={5} strokeDasharray="14 12"><path d="M860 270 L860 520" /></g>
        <Arista base={1250} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} pose="sentado" cara="cerrados" mira={1} angulos={{ cabeza: 18 }} frontal sombra={sueloY(xa)} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="miedo" mira={-1} angulos={{ cabeza: -10 }} frontal sombra={sueloY(xe)} />
        <Manta x={xe + 34 * s} y={he - 112 * s} s={1.3} />
        <Viento n={60} fuerza={1.3} op={0.6} />
      </Svg>
      <div style={{ position: "absolute", left: 640, top: 340, whiteSpace: "nowrap", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 84, color: "#fff", WebkitTextStroke: "10px #050B14", paintOrder: "stroke fill" }}>{e.titulo}</div>
    </Camara>
  );
};
