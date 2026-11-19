// E63 v5 — bloques 5-7: cómo pisar (punta del dedo gordo + mirar el pie), cifras (55 de 56 · 91 %), giro (con dolor no confías: la placa de Peor + medidor).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FondoInfo, Cifra, Personitas, Manometro, Nota, Sello, INFO } from "../../piezas/kit";
import { Puntera } from "../Gatos/Puntera";
import { garraPara } from "../Gatos/Gato";
import { Peor } from "../Gatos/Peor";
import { Svg, G, type P } from "../Gatos/comun";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GJ = garraPara(26);

export const Pisar: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fP = pal("punta") ?? 40, fM = pal("mirando") ?? 90;
  const baja = interpolate(f, [fP - 18, fP + 2], [0, 1], cl), apoya = interpolate(f, [fP + 2, fP + 10], [0, 1], cl);
  return (
    <AbsoluteFill>
      <FondoInfo tinte="#1F3350" />
      <Svg>
        <g transform={`translate(0 ${(1 - baja) * -260})`}><Puntera k={34} x={900} y={1060} L={26} g={GJ} aplasta={apoya * 0.5} halo={G.bien} haloO={apoya} /></g>
      </Svg>
      <Nota texto="PUNTA DEL DEDO GORDO" x={420} y={760} x2={880} y2={1030} k={(f - fP) / 8} color={INFO.verde} />
      {apoya > 0.9 && <Sello x={860} y={820} ok k={(f - fP - 10) / 8} />}
      {f >= fM && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", opacity: interpolate(f, [fM, fM + 5], [0, 1], cl) }}>
          <div style={{ fontFamily: "Figtree", fontWeight: 800, fontSize: 48, color: "#fff", background: "rgba(5,11,20,.85)", border: `4px solid ${INFO.azul}`, borderRadius: 40, padding: "14px 34px" }}>👁  MÍRALO HASTA QUE ESTÉ PUESTO</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Cifras: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fE = pal("estudio") ?? 20, fN = pal("nueve") ?? 180;
  const parte2 = f >= fN - 4;
  return (
    <AbsoluteFill>
      <FondoInfo />
      {!parte2 && <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: "Figtree", fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#C9D1DC", opacity: interpolate(f, [fE, fE + 6], [0, 1], cl) }}>ESTUDIO · 56 ESCALADORES</div>
        <Personitas total={56} marcados={55} cols={8} y={500} ancho={640} k={(f - fE - 10) / 40} etiqueta="55 de 56: demasiado apretados" />
      </>}
      {parte2 && <Cifra valor={91} despues=" %" etiqueta="con dolor de pies al escalar" y={640} k={(f - fN + 4) / 14} color={INFO.rojo} tam={230} />}
    </AbsoluteFill>
  );
};

export const Giro: React.FC<P> = (p) => {
  const f = useCurrentFrame(), fA = p.pal("apoyas") ?? 40;
  return (
    <AbsoluteFill>
      <Peor {...p} pal={(w) => (w === "escalas" ? (p.pal("mal") ?? fA + 20) : p.pal(w))} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, opacity: interpolate(f, [0, 6, fA + 10, fA + 18], [0, 1, 1, 0], cl) }}>
        <Manometro valor={0.92} etiqueta="dolor" y={0} r={170} k={f / 26} />
        <Nota texto="AJUSTADO" x={300} y={260} x2={420} y2={160} k={f / 10} color={INFO.verde} />
        <Nota texto="MACHACADO" x={790} y={260} x2={660} y2={150} k={(f - 14) / 10} color={INFO.rojo} />
      </div>
    </AbsoluteFill>
  );
};
