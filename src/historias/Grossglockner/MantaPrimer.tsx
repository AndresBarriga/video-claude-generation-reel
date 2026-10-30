// Inserto de la manta: primer plano de su mochila abierta con la manta térmica dorada (plegada, arrugada, brillante) y su etiqueta.
import React from "react";
import { random, spring, useCurrentFrame } from "remotion";
import { CieloNoche, PG, Svg, T } from "./comun";

export const MantaInserto: React.FC<{ f0: number }> = ({ f0 }) => {
  const f = useCurrentFrame(), k = spring({ frame: f - f0, fps: 30, config: { damping: 14, stiffness: 160 } }), b = (Math.sin(f / 5) + 1) / 2;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + 0.1 * k})`, opacity: k }}>
      <Svg>
        <CieloNoche id="mi" estrellas={false} />
        {/* mochila abierta */}
        <path d="M170 1460 Q160 760 280 640 L800 640 Q920 760 910 1460 Z" fill="#3A4656" stroke="#0B1624" strokeWidth={10} />
        <path d="M230 690 Q540 560 850 690 L850 760 Q540 650 230 760 Z" fill="#2A3442" stroke="#0B1624" strokeWidth={8} />
        {/* manta térmica dorada saliendo de la mochila: pliegues y arrugas */}
        <path d="M300 720 L420 520 L560 560 L700 480 L790 720 Z" fill={PG.oro} stroke="#7A5A10" strokeWidth={6} strokeLinejoin="round" />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${330 + i * 50} ${700} L${360 + i * 45 + random(`m${i}`) * 30} ${560 + random(`n${i}`) * 60}`} stroke="#B8891E" strokeWidth={4} />)}
        <path d="M430 540 L540 580 L660 510" stroke={PG.oroL} strokeWidth={14} strokeLinecap="round" opacity={0.5 + 0.5 * b} />
        <path d="M380 640 L470 600" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.4 * b} />
      </Svg>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 56, color: "#0B1624", background: PG.oro, borderRadius: 18, padding: "8px 26px" }}>Manta térmica</span>
      </div>
    </div>
  );
};
