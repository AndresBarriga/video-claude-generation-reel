// Hoja de poses para revisar personajes (no es un vídeo publicable).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Escalador, POSES, type NombrePose, type Cara } from "../piezas/Escalador";
import type { Aspecto } from "../piezas/Rasgos";
// Reparto de prueba: comprueba que ojos, gafas, pelo y gorro no se pisen al girar la cabeza.
const REPARTO: (Aspecto | undefined)[] = [undefined,
  { casco: null, gorro: "#E0A526", peinado: "rizado", piel: "#B9825A", pielSombra: "#94613E", chaqueta: "#3E7C59", arnes: false, manos: "piel" },
  { casco: null, peinado: "corto", barba: "#4A3324", gafas: true, piel: "#F0C7A4", pielSombra: "#D9A27F", arnes: false },
  { casco: null, peinado: "coleta", pelo: "#C99A4E" }, { casco: null, peinado: "trenzas" }, { casco: null, peinado: "rapado", gafas: true }];
const caras: Cara[] = ["normal", "miedo", "dolor", "esfuerzo", "alivio", "cerrados"];
export const Poses: React.FC = () => {
  const nombres = Object.keys(POSES) as NombrePose[];
  return (
    <AbsoluteFill style={{ background: "#DCE5EE" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        {nombres.map((n, i) => {
          const cx = 140 + (i % 4) * 270, cy = 260 + Math.floor(i / 4) * 380;
          return <g key={n}><Escalador x={cx} y={cy} quien={i % 2 ? "simon" : "joe"} pose={n} cara={caras[i % caras.length]} aspecto={REPARTO[i % REPARTO.length]} angulos={{ cabeza: ((i * 37) % 80) - 40 }} mira={i % 3 ? 1 : -1} s={1} sombra={cy + 140} />
            <text x={cx} y={cy + 180} textAnchor="middle" fontSize={30} fontFamily="sans-serif">{n}</text></g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
