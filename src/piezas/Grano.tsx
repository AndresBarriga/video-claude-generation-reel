// Grano de película (4 %) + viñeta suave: evita el "vector plano de plantilla". Va encima de todo salvo subtítulos.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
export const Grano: React.FC<{ opacidad?: number; vineta?: number }> = ({ opacidad = 0.05, vineta = 0.35 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: opacidad * 4 }}>
        <filter id={`grano${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter={`url(#grano${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vineta}) 100%)` }} />
    </AbsoluteFill>
  );
};
