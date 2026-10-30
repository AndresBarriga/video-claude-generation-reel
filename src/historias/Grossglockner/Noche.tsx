// Escena 4: anochece a 50 m de la cumbre. Ella se sienta en una roca, agotada; tú, de pie a su lado. Vaho de los dos.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador, POSES } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, EL, ELLA, Pico, Roca, Svg, Vaho, Viento, cabezaElla, caderaApoyada, sueloY, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

export const PAREJA = { s: 1.6, xa: 360, xe: 640 };
export const rocaDe = (x: number) => sueloY(x) - 70;
export const Noche: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(), { s, xa, xe } = PAREJA;
  const luz = interpolate(f, [0, d * 0.7], [1, 0], { extrapolateRight: "clamp" });
  const sienta = interpolate(f, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pie = POSES.pie as { piernaA: [number, number]; piernaB: [number, number] };
  const he = caderaApoyada(xe, s, pie.piernaA, pie.piernaB, -1);
  const ha = rocaDe(xa) - 8 * s - (1 - sienta) * 100 * s;
  return (
    <Camara d={d} empuje={0.05} foco="50% 50%">
      <Svg>
        <CieloNoche id="no" />
        <rect x={-300} y={-500} width={1700} height={3000} fill="#E89A5A" opacity={0.4 * luz} />
        <Pico cx={860} cimaY={300} base={1300} ancho={1000} />
        <path d="M860 330 L860 980" stroke="#fff" strokeWidth={5} strokeDasharray="14 12" />
        <Arista base={1250} />
        <Roca x={xa} y={rocaDe(xa)} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} Cabeza={cabezaElla()} pose="pie" poseB="sentado" t={sienta} cara="cerrados" mira={1} frontal sombra={sueloY(xa)} />
        <Vaho x={xa + 30 * s} y={ha - 150 * s} fuerza={1} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="miedo" mira={-1} angulos={{ cabeza: 10 }} frontal sombra={sueloY(xe)} />
        <Vaho x={xe - 30 * s} y={he - 166 * s} fuerza={1} dir={-1} />
        <Viento n={60} fuerza={1.3} op={0.6} />
      </Svg>
      <div style={{ position: "absolute", left: 880, top: 600, whiteSpace: "nowrap", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 84, color: "#fff", WebkitTextStroke: "10px #050B14", paintOrder: "stroke fill" }}>{e.titulo}</div>
    </Camara>
  );
};
