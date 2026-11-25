// 7 · «Parte dos: el rock over. Sígueme para ver si Fermín lo consigue.» Otro tramo: Fermín con el pie derecho
// en una presa a la altura de la cadera, la mira con miedo. Chip PARTE 2 · ROCK OVER, botón «Seguir» y «Mándaselo a tu Fermín».
import React from "react";
import { useCurrentFrame } from "remotion";
import { Fermin, POSES_FERMIN, enEscena } from "../../piezas/Fermin";
import { fuenteTexto } from "../../tema";
import { COL, Cam, Etiqueta, Pared, Svg, T, pop, type P } from "./comun";

const C = { x: 560, y: 1170 }, S7 = 1.15;
const W = enEscena(POSES_FERMIN.rockOver, C.x, C.y, S7);
const PRESAS = [
  { p: W.manoI, r: 30, c: COL.verde }, { p: W.manoD, r: 30, c: COL.verde }, { p: W.pieI, r: 24, c: COL.verde },
  { p: { x: 860, y: 640 }, r: 26, c: COL.gris }, { p: { x: 200, y: 1500 }, r: 24, c: COL.gris }, { p: { x: 140, y: 820 }, r: 22, c: COL.gris }, { p: { x: 930, y: 1420 }, r: 22, c: COL.gris },
];

export const Parte2: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tS = pal("Sígueme") ?? Math.round(d * 0.45);
  const toque = f - tS - 10, pulsa = toque > 0 && toque < 10 ? 0.9 : 1;
  const seguido = toque >= 6;
  return (
    <>
      <Svg>
        <Cam z={1.06 - 0.06 * Math.min(1, f / 14) + 0.03 * (f / d)} cy={1100}>
          <Pared presas={PRESAS} />
          <circle cx={W.pieD.x} cy={W.pieD.y} r={70 + 6 * Math.sin(f / 4)} fill="#FFE3A0" opacity={0.6} />
          <ellipse cx={W.pieD.x} cy={W.pieD.y + 20} rx={34} ry={26} fill={COL.amarillo} />
          <Fermin x={C.x} y={C.y + Math.sin(f / 6) * 4} s={S7} pose="rockOver" cara="miedo" mira={1} cuerdaX={C.x + 4} />
        </Cam>
      </Svg>
      <Etiqueta x={540} y={480} t="PARTE 2 · ROCK OVER" k={f + 1} c={T} tam={44} />
      {f >= tS - 2 && <div style={{ position: "absolute", left: 540, top: 590, transform: `translate(-50%,-50%) scale(${pop(f - tS + 2) * pulsa})`, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 40, color: seguido ? T : "#fff", background: seguido ? "#EFEFEF" : "#3B82F6", border: seguido ? `3px solid ${T}` : "none", padding: "12px 56px", borderRadius: 18 }}>{seguido ? "Siguiendo ✓" : "Seguir"}</div>}
      <Etiqueta x={540} y={1560} t="Mándaselo a tu Fermín" k={f - tS - 18} c="rgba(5,11,20,.82)" tam={36} />
    </>
  );
};
