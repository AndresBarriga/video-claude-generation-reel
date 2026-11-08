// Escena 1 · Gancho: el asegurador mira la pared; el escalador, de espaldas, tiembla; el pie derecho resbala y la cuerda desaparece detrás de su pierna izquierda.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { GYM, Pared, Svg, Rotulo, ei, type P } from "./comun";
import { Trepador } from "./Trepador";

export const Gancho: React.FC<P> = () => {
  const f = useCurrentFrame();
  const slip = ei(f, 16, 30, 0, 44) - ei(f, 40, 54, 0, 34);
  const zoom = 1 + ei(f, 0, 85, 0, 0.1);
  const latido = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <AbsoluteFill style={{ background: GYM.paredA }}>
      <Svg>
        <Pared f={f} />
        <g transform={`translate(540 1100) scale(${zoom}) translate(-540 -1100)`}>
          <g transform="translate(54 70) scale(0.9)"><Trepador f={f} slip={slip} detras /></g>
        </g>
        {/* chalk del resbalón */}
        {slip > 4 && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={650 + i * 9} cy={1300 + (i % 3) * 14 + slip * 0.4} r={4 + (i % 3) * 2} fill="#F4EFE6" opacity={0.6 - i * 0.04} />)}
        {/* asegurador muy abajo, gritando */}
        <Escalador x={820} y={1580} quien="simon" pose="tirando" cara="miedo" s={1.1} mira={-1}
          aspecto={{ chaqueta: "#7A4FA3", chaquetaSombra: "#563578", casco: null, peinado: "corto", pelo: "#2B1D14", pantalon: "#2B3442" }} />
        {f > 30 && (
          <g transform="translate(690 1300) scale(0.9)">
            <path d="M0 0 L240 0 Q270 0 270 30 L270 90 Q270 120 240 120 L130 120 L150 168 L90 120 L0 120 Q-30 120 -30 90 L-30 30 Q-30 0 0 0 Z" fill="#fff" stroke="#141B26" strokeWidth={6} />
            <text x={120} y={86} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={54} fill="#141B26">¡PIERNA!</text>
          </g>
        )}
        <rect width={1080} height={1920} fill="#B01020" opacity={0.10 + latido * 0.14} />
        <Rotulo f={f} ini={4} t="ESTO TE DA LA VUELTA" y={280} tam={78} col="#fff" />
      </Svg>
    </AbsoluteFill>
  );
};
