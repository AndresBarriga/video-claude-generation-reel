// Primer plano del asegurador (el de E11), mirando arriba. grita = boca abierta y bocadillo «¡PIERNA!»; si no, tranquilo.
import React from "react";
import { Escalador } from "../../piezas/Escalador";
import { ASEG, Cielo, Cuerda, Montanas, Pared, Svg } from "./comun";

export const CaraAseg: React.FC<{ f: number; grita: boolean }> = ({ f, grita }) => (
  <Svg>
    <Cielo id="ca" />
    <Montanas y={1300} />
    <Pared x0={900} semilla="ca" />
    <Cuerda d={`M960 -100 Q900 600 700 1250`} w={14} />
    <Escalador x={430} y={1720} quien="joe" aspecto={ASEG} s={6.4} pose="pie" cara={grita ? "miedo" : "alivio"} mira={1}
      angulos={{ cabeza: -26 + (grita ? Math.sin(f * 1.3) * 2 : 0), torso: -4, brazoA: [70, 150], brazoB: [40, 120] }} />
  </Svg>
);
