// El giro: no es magia. Ensayos CON cuerda (se dice en pantalla) hasta saberse cada paso; en «patada», la patada de kárate del Boulder Problem.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Granito, Svg, type P } from "./comun";
import { Cuerda } from "../Pegue/comun";
import { fuenteTexto } from "../../tema";

export const Ensayo: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const paso = (Math.sin(f / 10) + 1) / 2, ensayo = true;
  return (
    <Camara d={d} empuje={0.06} foco="50% 45%">
      <Svg>
        <Cielo />
        <Granito x0={700} sem="e" />
        {ensayo && <Cuerda d="M555 820 Q560 400 600 -100" />}
        <Escalador x={560} y={900} quien="joe" s={2.3} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="esfuerzo"
          angulos={{ torso: 6, cabeza: -6, brazoA: [110 + 12 * paso, 135 + 10 * paso], brazoB: [158 - 8 * paso, 172], piernaA: [64, -2], piernaB: [26, 8] }} mira={1} />
      </Svg>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 50, letterSpacing: 3, color: "#fff", textShadow: "0 3px 8px #000a" }}>
        ENSAYO · CON CUERDA
      </div>
    </Camara>
  );
};
