// s0 (gancho) y cierre: primer plano de la mano agarrotada en la regleta (nudillos blancos, tiembla). `abre` 0–1 la suelta.
// Detrás, desenfocada, la cuerda naranja: está ahí, pero el cerebro no la «ve» (idea del vídeo).
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { ManoCerca, BORDE } from "./ManoCerca";
import { TU, PC } from "./comun";
import { C } from "../Pegue/comun";

const X0 = BORDE.x1; // canto de la pared en el primer plano

export const PrimerPlano: React.FC<{ f: number; tiembla: number; blancos: number; abre?: number; calido?: number; zoom?: number }> = ({ f, tiembla, blancos, abre = 0, calido = 0, zoom = 1 }) => {
  const t = Math.sin(f * 1.9) * tiembla * 6 + Math.sin(f * 4.1) * tiembla * 2;
  const caeY = abre > 0.6 ? (abre - 0.6) * 1400 : 0;
  const Z = 1.3 * zoom;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${PC.cieloA} 0%, ${PC.cieloB} 55%, ${calido ? "#C98F6E" : PC.cieloC} 100%)` }}>
      {/* fondo desenfocado: cañón, techo de la cueva y la cuerda naranja */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(14px)" }}>
        <path d="M-50 1250 L120 1150 L240 1200 L380 1110 L520 1190 L520 2000 L-50 2000 Z" fill={PC.lejos} opacity={0.9} />
        <path d="M-50 1500 Q200 1430 520 1520 L520 2000 L-50 2000 Z" fill={PC.medio} />
        <path d="M-80 -80 L1160 -80 L1160 180 Q600 320 -80 220 Z" fill={PC.techo} />
        <path d={`M${330 + Math.sin(f / 20) * 6} -100 Q${260} 700 ${180 + Math.sin(f / 17) * 8} 2100`} stroke={C.cuerda} strokeWidth={34} fill="none" opacity={0.85} />
        <circle cx={160} cy={1240} r={120} fill={PC.horizonte} opacity={0.15 + 0.5 * calido} />
      </svg>
      <AbsoluteFill style={{ transform: `translateY(${caeY}px)` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(560 860) scale(${Z}) translate(-640 -930)`}>
            <rect x={X0} y={-200} width={700} height={2400} fill={PC.roca} />
            {/* textura de caliza sobre la pared (a la derecha del canto, sin tocar la mano) */}
            <rect x={X0} y={-200} width={700} height={2400} fill="url(#sl-pp)" opacity={0.9} />
            <defs><linearGradient id="sl-pp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8E98A4" stopOpacity={0.5} /><stop offset="0.5" stopColor={PC.roca} stopOpacity={0} /><stop offset="1" stopColor="#3B414B" stopOpacity={0.7} /></linearGradient></defs>
            <path d={`M${X0 + 70} 600 C${X0 + 40} 800 ${X0 + 110} 1000 ${X0 + 150} 1300 L${X0 + 210} 1300 C${X0 + 190} 1000 ${X0 + 150} 780 ${X0 + 150} 600 Z`} fill={PC.ocre} opacity={0.55} />
            {Array.from({ length: 16 }).map((_, i) => { const x = X0 + 40 + random(`mx${i}`) * 300, y = 640 + random(`my${i}`) * 700, r = 8 + random(`mr${i}`) * 14;
              return <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#2B3039" opacity={0.8} /><path d={`M${x - r} ${y} Q${x} ${y - r} ${x + r} ${y}`} stroke="#A9B2BC" strokeWidth={3} fill="none" opacity={0.5} /></g>; })}
            <path d={`M${X0} 500 L${X0} 1400`} stroke="#A9C4D8" strokeWidth={8} opacity={0.5} />
            <ManoCerca abre={abre} tiembla={t} blancos={blancos} piel={TU.piel!} pielS={TU.pielSombra!} manga={TU.chaqueta!} f={f} />
            {/* magnesio que cae de la mano */}
            {Array.from({ length: 10 }).map((_, i) => { const y = (BORDE.y + 60 + ((f * (1.4 + random(`gy${i}`)) + random(`go${i}`) * 400) % 420)); const x = BORDE.x + 60 + random(`gx${i}`) * 60 + Math.sin(f / 9 + i) * 6;
              return <circle key={i} cx={x} cy={y} r={2.5 + random(`gr${i}`) * 3} fill="#F1F4F7" opacity={0.6 * (1 - (y - BORDE.y) / 480)} />; })}
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 30%, rgba(255,170,110,${0.3 * calido}) 0%, transparent 60%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, transparent 45%, rgba(4,9,18,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};
