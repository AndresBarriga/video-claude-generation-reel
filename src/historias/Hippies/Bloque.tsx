// Lo útil: Midnight Lightning, el bloque del rayo de magnesio. En «colocado», un destello psicodélico. Luego «Camp 4 · 7B»: tú lo pruebas.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pieza, Pj, Svg, trepar, type P } from "./comun";
import { VisionLsd } from "./Vision";

const PlanoBloque: React.FC<{ d: number; titulo?: string; colocado?: number; prueba?: boolean; fuente?: string }> = ({ d, titulo, colocado, prueba, fuente }) => {
  const f = useCurrentFrame(), brillo = (Math.sin(f / 5) + 1) / 2;
  const psico = colocado !== undefined ? interpolate(f, [colocado - 2, colocado + 4, colocado + 26], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <Camara d={d} empuje={0.06} foco="50% 55%">
      <Svg>
        <Pieza nombre="fondo_yosemite" x={0} y={0} alto={1920} />
        <Pieza nombre="bloque" x={-120} y={500} alto={940} />
        <circle cx={330} cy={860} r={180 + 30 * brillo} fill="#FFFFFF" opacity={0.12 * brillo} />
        {prueba && <Pj q="tu" cx={420} suelo={1280 - f * 0.35} alto={700} cara="feliz" rot={trepar(f)} />}
        <VisionLsd op={psico} zoom={1.1} />
      </Svg>
      <Etiqueta texto={titulo} top={260} tam={82} desde={4} />
      {fuente && <div style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center", fontFamily: "Figtree", fontWeight: 700, fontSize: 30, color: "#fff", opacity: 0.85, textShadow: "0 2px 6px #000a" }}>{fuente}</div>}
    </Camara>
  );
};
export const Bloque: React.FC<P> = ({ d, e, pal }) => <PlanoBloque d={d} titulo={e.titulo} colocado={pal("colocado")} />;
export const Util: React.FC<P> = ({ d, e }) => <PlanoBloque d={d} titulo={e.titulo} prueba fuente="1.ª ascensión: Ron Kauk, 1978 · Wikipedia" />;
