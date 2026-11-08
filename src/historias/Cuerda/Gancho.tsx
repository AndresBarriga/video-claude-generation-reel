// Escena 1 · Gancho: cara tensa arriba, pie temblando abajo con la cuerda por detrás de la pantorrilla; el asegurador grita «¡PIERNA!» desde el suelo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { GYM, Pared, Svg, Rotulo, ei, type P } from "./comun";

export const Gancho: React.FC<P> = () => {
  const f = useCurrentFrame();
  const zoom = ei(f, 0, 14, 1.0, 1.0) * (1 + ei(f, 8, 20, 0, 0.12)); // zoom de golpe al pie
  const temblor = Math.sin(f * 1.7) * 3;
  return (
    <AbsoluteFill style={{ background: GYM.paredA }}>
      <Svg>
        <Pared f={f} />
        <g transform={`translate(540 1200) scale(${zoom}) translate(-540 -1200)`}>
          {/* tramo de cuerda que pasa POR DETRÁS de la pantorrilla (debajo del personaje) */}
          <path d="M585 1190 Q540 1250 490 1290 Q420 1350 440 1460 Q460 1560 430 1620" stroke={GYM.cuerda} strokeWidth={16} fill="none" strokeLinecap="round" />
          <g transform={`translate(${temblor} 0)`}>
            <Escalador x={540} y={1050} quien="joe" pose="escalando" cara="esfuerzo" s={2.6} frontal
              aspecto={{ chaqueta: "#2FB8A8", chaquetaSombra: "#1F7F73", casco: "#F2C230", pantalon: "#2B3442", pelo: "#3B2A20" }} />
          </g>
          {/* tramo que baja del arnés por delante del muslo */}
          <path d="M600 950 Q630 1060 585 1190" stroke={GYM.cuerda} strokeWidth={16} fill="none" strokeLinecap="round" />
        </g>
        <Escalador x={600} y={1590} quien="simon" pose="pie" cara="miedo" s={1.2} frontal mira={-1}
          aspecto={{ chaqueta: "#7A4FA3", chaquetaSombra: "#563578", casco: null, peinado: "corto", pelo: "#2B1D14", pantalon: "#2B3442" }} />
        <g transform="translate(660 1370) scale(0.9)">
          <path d="M0 0 L240 0 Q270 0 270 30 L270 90 Q270 120 240 120 L90 120 L40 160 L56 120 L0 120 Q-30 120 -30 90 L-30 30 Q-30 0 0 0 Z" fill="#fff" stroke="#141B26" strokeWidth={6} />
          <text x={120} y={86} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={54} fill="#141B26">¡PIERNA!</text>
        </g>
        <Rotulo f={f} ini={4} t="ESTO TE DA LA VUELTA" y={300} tam={78} col="#fff" />
        <rect width={1080} height={1920} fill="none" />
      </Svg>
    </AbsoluteFill>
  );
};
