// El giro: no es magia. Ensayos CON cuerda (se dice en pantalla) hasta saberse cada paso; en «patada», la patada de kárate del Boulder Problem.
import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Granito, PH, Svg, type P } from "./comun";
import { Cuerda } from "../Pegue/comun";
import { fuenteTexto } from "../../tema";

export const Ensayo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t = pal("patada") ?? Math.round(d * 0.6);
  const k = spring({ frame: f - t, fps: 30, config: { damping: 10, stiffness: 200 } });
  const ensayo = f < t - 6;
  return (
    <Camara d={d} empuje={0.06} foco="50% 45%" sacudida={f > t && f < t + 6 ? 4 : 0}>
      <Svg>
        <Cielo />
        <Granito x0={700} sem="e" />
        {/* diedro del Boulder Problem: arista a la izquierda adonde va la patada */}
        <path d="M200 520 L330 600 L330 1400 L200 1400 Z" fill={PH.granitoS} />
        {ensayo && <Cuerda d="M555 820 Q560 400 600 -100" />}
        <Escalador x={560} y={900} quien="joe" s={2.3} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="esfuerzo"
          angulos={{ torso: 6, cabeza: -6, brazoA: [118, 140], brazoB: [150, 168], piernaA: [62 - 140 * k, -4 - 150 * k], piernaB: [24, 6] }} mira={1} />
      </Svg>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 50, letterSpacing: 3, color: "#fff", textShadow: "0 3px 8px #000a" }}>
        {ensayo ? "ENSAYO · CON CUERDA" : "LA PATADA DE KÁRATE"}
      </div>
    </Camara>
  );
};
