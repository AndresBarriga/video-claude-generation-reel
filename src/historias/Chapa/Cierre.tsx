// s7: vuelve al primer plano del gancho (mismo encuadre, pose y rótulo que el fotograma 0) para empalmar en bucle.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Etiqueta, type P, ALTO, B1, HOOK, LEJOS, nudo, mano, pAlto } from "./comun";
import { Plano, Soga, Aseg, Ella, Chapa1 } from "./piezas";

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), ff = f - d;
  const e = 1 - (1 - Math.min(1, f / (d - 1))) ** 3;
  const ang = pAlto(ff), h = mano(ang), H = { x: ALTO.x + h.x, y: ALTO.y + h.y };
  const s = spring({ frame: f - 8, fps, config: { damping: 13, stiffness: 170 } });
  return (
    <>
      <Plano cx={600 + (HOOK.cx - 600) * e} cy={2290 + (HOOK.cy - 2290) * e} z={1.0 + (HOOK.z - 1.0) * e}>
        <Aseg x={LEJOS} comba={0.85} />
        <Ella p={ALTO} ang={ang} cara="miedo" tiembla={Math.sin(ff * 1.9) * 2.5} />
        <Chapa1 /><Soga brillo={0.8} desde={1} pts={[B1, { ...H, sx: -34 }, { ...nudo(ALTO), sag: 30, sx: -84 }]} />
      </Plano>
      <Etiqueta texto="¿TOCAS EL SUELO?" desde={-15} top={300} tam={96} />
      <div style={{ position: "absolute", top: 1245, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.9 + 0.1 * s})` }}>
        <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 50, color: "#fff", background: "rgba(5,11,20,.82)", borderRadius: 44, padding: "14px 36px", whiteSpace: "nowrap" }}>Mándaselo a quien te asegura</div>
      </div>
    </>
  );
};
