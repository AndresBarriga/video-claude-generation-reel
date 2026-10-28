// Gancho/portada: tú en el reglete, la pierna ya bailando, «Pierna de Elvis» y el marcador de fases vacío.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, temblor, type P } from "./comun";
import { PlanoPared } from "./Plano";
import { fuenteTitulo, fuenteTexto } from "../../tema";

export const Intro: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.06} foco="60% 55%">
      <PlanoPared f={f} tr={temblor(f, 1.1)} amp={1.1} cara="miedo" />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: fuenteTexto, fontWeight: 800, fontSize: 52, color: "#fff", letterSpacing: 6, textShadow: "0 3px 8px #000a" }}>LAS 5 FASES DE LA</div>
        <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 128, lineHeight: 1, color: "#fff", WebkitTextStroke: "14px #050B14", paintOrder: "stroke fill" }}>
          Pierna de <span style={{ color: "#FF6A1F" }}>Elvis</span>
        </div>
      </div>
    </Camara>
  );
};
