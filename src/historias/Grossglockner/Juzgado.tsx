// Escena 9: el juicio. Él sentado ante el estrado; rótulo «5 meses (suspendidos) + 9.600 €».
import React from "react";
import { Escalador } from "../../piezas/Escalador";
import { Camara, EL, Etiqueta, Manta, Svg, type P } from "./comun";
import { Fuente } from "../Pierna/comun";

const TOGA = { chaqueta: "#1B2230", chaquetaSombra: "#0E141E", pantalon: "#1B2230", casco: null, pelo: "#C9CDD2", gafas: true, arnes: false };
export const Juzgado: React.FC<P> = ({ e, d }) => (
  <Camara d={d} empuje={0.04} foco="50% 55%">
    <Svg>
      <rect width={1080} height={1920} fill="#E6DCCB" />
      <rect y={0} width={1080} height={300} fill="#CDBFA8" />
      <Escalador x={540} y={760} quien="joe" s={1.5} aspecto={TOGA} cara="normal" />
      <rect x={150} y={780} width={780} height={300} fill="#7A5638" stroke="#4A3220" strokeWidth={8} />
      <rect x={150} y={760} width={780} height={60} fill="#5A3F28" />
      <Manta x={760} y={740} s={1.8} />
      <rect y={1180} width={1080} height={800} fill="#B9A88E" />
      <Escalador x={420} y={1250} quien="joe" s={1.8} aspecto={{ ...EL, casco: null }} pose="sentado" cara="normal" mira={1} angulos={{ cabeza: -12 }} />
    </Svg>
    <Etiqueta texto={e.titulo} top={250} tam={80} desde={4} />
    <Fuente texto={e.fuente ?? ""} />
  </Camara>
);
