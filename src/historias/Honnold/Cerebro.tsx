// Cerebro de perfil (dibujo propio) con la amígdala marcada. `luz` 0–1 = cuánto se enciende (árbol de Navidad).
import React from "react";
import { random, useCurrentFrame } from "remotion";

export const Cerebro: React.FC<{ x: number; y: number; s?: number; luz: number; sem?: string }> = ({ x, y, s = 1, luz, sem = "c" }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 0 C-162 -92 -62 -152 30 -142 C122 -134 172 -70 160 0 C154 48 112 70 64 70 L44 112 L14 112 L22 72 C-40 82 -140 72 -150 0 Z" fill="#E7C3C0" stroke="#9E6E6A" strokeWidth={6} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-130 + i * 30} ${-90 + (i % 3) * 30} q${18 + random(`${sem}a${i}`) * 20} ${30 + random(`${sem}b${i}`) * 30} ${-6} ${60 + random(`${sem}c${i}`) * 30}`} stroke="#B98884" strokeWidth={5} fill="none" strokeLinecap="round" />)}
      {/* luces repartidas (actividad) */}
      {luz > 0 && Array.from({ length: 22 }).map((_, i) => {
        const cx = -120 + random(`${sem}x${i}`) * 260, cy = -110 + random(`${sem}y${i}`) * 170, on = (Math.sin(f / 4 + i * 1.7) + 1) / 2;
        const col = ["#FF6A1F", "#FFD34D", "#5FD3FF", "#FF5E8A"][i % 4];
        return <circle key={i} cx={cx} cy={cy} r={7 + 5 * on} fill={col} opacity={luz * (0.45 + 0.55 * on)} />;
      })}
      {/* amígdala */}
      <ellipse cx={14} cy={36} rx={20} ry={13} fill={luz > 0 ? "#FF6A1F" : "#6F5E5C"} stroke="#141B26" strokeWidth={4} />
      {luz > 0 && <ellipse cx={14} cy={36} rx={44} ry={32} fill="#FF6A1F" opacity={0.3 * luz} />}
    </g>
  );
};
