// Garabato vivo: círculo a mano, naranja, que se dibuja y tiembla (marca la cuerda contra la pantorrilla).
import React from "react";
import { interpolate } from "remotion";

export const Garabato: React.FC<{ x: number; y: number; r: number; f: number; col?: string }> = ({ x, y, r, f, col = "#FF6A1F" }) => {
  const k = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const j = (i: number) => Math.sin(f * 1.9 + i * 2.1) * 3;
  const pts = Array.from({ length: 26 }).map((_, i) => {
    const a = (i / 22) * Math.PI * 2 - 0.6, rr = r * (1 + 0.08 * Math.sin(i * 1.7)) + j(i);
    return `${x + Math.cos(a) * rr * 1.15} ${y + Math.sin(a) * rr}`;
  });
  const L = 26 * r * 0.3;
  return <path d={"M" + pts.join(" L")} stroke={col} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round"
    strokeDasharray={L * 3} strokeDashoffset={L * 3 * (1 - k)} />;
};
