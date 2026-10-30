// La visión del LSD (pieza de Claude Design) animada por capas: rayos que giran, anillos y sol que laten, flores en remolino,
// pupilas que se mueven, goteo, ondas de las montañas y chispas que parpadean.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Pieza } from "./comun";

export const VisionLsd: React.FC<{ op?: number; zoom?: number }> = ({ op = 1, zoom = 1 }) => {
  const f = useCurrentFrame(), l = (Math.sin(f / 6) + 1) / 2;
  if (op <= 0.01) return null;
  return (
    <g opacity={op} transform={`translate(540 960) scale(${zoom}) translate(-540 -960)`}>
      <Pieza nombre="vision_lsd" x={0} y={0} alto={1920}
        rot={{ rayos: f * 1.4, flores: Math.sin(f / 20) * 12, anillos: -f * 0.5 }}
        escala={{ anillos: 1 + 0.08 * l, sol: 1 + 0.05 * l }}
        mueve={{ sol: [0, Math.sin(f / 9) * 14], goteo: [0, (f * 2) % 40], ondas_montana: [Math.sin(f / 10) * 30, 0], pupilas: [Math.cos(f / 7) * 6, Math.sin(f / 7) * 4] }}
        origen={{ anillos: [540, 820], flores: [540, 960] }}
        opac={{ chispas: 0.3 + 0.7 * ((Math.sin(f / 3) + 1) / 2) }} />
    </g>
  );
};
