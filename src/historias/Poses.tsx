// Hoja de poses para revisar personajes (no es un vídeo publicable).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Escalador, POSES, type NombrePose, type Cara } from "../piezas/Escalador";
const caras: Cara[] = ["normal", "miedo", "dolor", "esfuerzo", "alivio", "cerrados"];
export const Poses: React.FC = () => {
  const nombres = Object.keys(POSES) as NombrePose[];
  return (
    <AbsoluteFill style={{ background: "#DCE5EE" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        {nombres.map((n, i) => {
          const cx = 140 + (i % 4) * 270, cy = 260 + Math.floor(i / 4) * 380;
          return <g key={n}><Escalador x={cx} y={cy} quien={i % 2 ? "simon" : "joe"} pose={n} cara={caras[i % caras.length]} s={1} sombra={cy + 140} />
            <text x={cx} y={cy + 180} textAnchor="middle" fontSize={30} fontFamily="sans-serif">{n}</text></g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
