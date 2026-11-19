// E62B: apertura «¿CUÁL FRENA?» — dos maneras de dar cuerda, una encima de otra, desde el fotograma 0.
// A = mano en la cuerda de freno (bien) · B = grigri agarrado entero (mal). No se dice cuál es: lo resuelve la caída.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Pregunta } from "../../piezas/kit";
import { Puesto } from "./comun";

const T = "#050B14";
// Recorte del primer plano (coordenadas de pantalla de Puesto): grigri + las dos manos, en media pantalla vertical.
const VB = "130 110 1060 1720";
const Mitad: React.FC<{ left: number; letra: string; pie: string; children: React.ReactNode }> = ({ left, letra, pie, children }) => (
  <div style={{ position: "absolute", left, top: 0, width: 540, height: 1920, overflow: "hidden", background: "radial-gradient(circle at 50% 42%, #3B4757 0%, #1C2430 80%)" }}>
    <svg style={{ position: "absolute", left: 0, top: 330 }} width={540} height={880} viewBox={VB} preserveAspectRatio="xMidYMid meet">{children}</svg>
    <div style={{ position: "absolute", left: 200, top: 250, width: 140, height: 140, borderRadius: 70, background: "#4A6FA5", border: `8px solid ${T}`, color: "#fff", fontFamily: "Figtree", fontWeight: 900, fontSize: 100, lineHeight: "124px", textAlign: "center" }}>{letra}</div>
    <div style={{ position: "absolute", left: 30, right: 30, top: 1215, padding: "10px 0", borderRadius: 24, background: "rgba(5,11,20,0.85)", color: "#fff", fontFamily: "Figtree", fontWeight: 800, fontSize: 40, textAlign: "center" }}>{pie}</div>
  </div>
);

export const AbreAB: React.FC = () => {
  const f = useCurrentFrame(), da = 0.5 - 0.5 * Math.cos(f / 5.5);
  return (
    <>
      <Mitad left={0} letra="A" pie="MANO EN LA CUERDA">
        <Puesto modo="normal" da={da} corre={f * 9 + 40 * Math.sin(f / 5.5)} f={f} />
      </Mitad>
      <Mitad left={540} letra="B" pie="MANO EN EL GRIGRI">
        <Puesto modo="mal" corre={f * 9} f={f} />
      </Mitad>
      <div style={{ position: "absolute", left: 532, top: 0, width: 16, height: 1920, background: T }} />
      <Pregunta texto="¿CUÁL FRENA?" top={110} tam={120} />
    </>
  );
};
