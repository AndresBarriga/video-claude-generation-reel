import React from "react";
import { AbsoluteFill } from "remotion";
import { Desplome, Placa } from "./Calcos";
/** Solo para comprobar el calco contra la referencia (739×1600). */
export const CalcoDebug: React.FC<{ k?: number; mal?: boolean }> = ({ k = 1, mal = true }) => (
  <AbsoluteFill style={{ background: "#fff" }}>
    <svg width={739} height={1600} viewBox="0 0 739 1600">{k === 1 ? <Placa mal={mal} /> : <Desplome mal={mal} />}</svg>
  </AbsoluteFill>
);
