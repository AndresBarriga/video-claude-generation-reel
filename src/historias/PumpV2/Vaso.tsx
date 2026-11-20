// Macro DENTRO de la arteria (E69 v3): glóbulos rojos que corren; el músculo pisa el vaso (pinch), los glóbulos se atascan y se
// acumula lo que quema. Estilo propio: plano con contorno, sobre fibras musculares oscuras. Coordenadas de pantalla (1080×1920).
// pinch 0–1 estrecha el centro · flujo 0–1 velocidad · residuos 0–1 · verde 0–1 tinte sano · cy centro vertical del vaso.
import React from "react";
import { random, useCurrentFrame } from "remotion";

const H = 400; // alto del vaso
export const Vaso: React.FC<{ pinch?: number; flujo?: number; residuos?: number; verde?: number; cy?: number }> = ({ pinch = 0, flujo = 1, residuos = 0, verde = 0, cy = 1040 }) => {
  const f = useCurrentFrame();
  const media = (x: number) => (H / 2) * (1 - 0.72 * pinch * Math.exp(-(((x - 640) / 170) ** 2)));
  const pared = (s: 1 | -1) => Array.from({ length: 41 }, (_, i) => { const x = -40 + i * 29; return `${x} ${cy + s * media(x)}`; }).join(" L");
  const atasco = Math.max(0, Math.min(1, (pinch - 0.35) / 0.4));
  const N = 22, v = 2 + 10 * flujo * (1 - 0.9 * atasco);
  const celulas = Array.from({ length: N }, (_, i) => {
    const libre = ((i * 151 + f * v) % 1300) - 110;
    const cola = 640 - 150 - (i % 11) * 62 - (i > 10 ? 30 : 0); // fila apelotonada antes del estrechamiento
    const x = libre * (1 - atasco) + Math.min(libre, cola) * atasco;
    const y = cy + (random(`y${i}`) - 0.5) * (media(x) * 1.4 - 60) + Math.sin(f * 0.1 + i) * 6;
    return { x, y, r: 0.9 + random(`r${i}`) * 0.25, g: random(`g${i}`) * 60 - 30 };
  });
  const res = Array.from({ length: Math.round(28 * residuos) }, (_, i) => ({ x: 120 + random(`rx${i}`) * 880, y: cy + (random(`ry${i}`) - 0.5) * 720, r: 10 + random(`rr${i}`) * 12 }));
  const rojo = verde > 0.5 ? "#E2564F" : "#E5484D";
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="vFondo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A0F18" /><stop offset="0.5" stopColor="#5A1E2A" /><stop offset="1" stopColor="#2A0F18" /></linearGradient>
        <filter id="vGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <rect width={1080} height={1920} fill="url(#vFondo)" />
      {/* fibras del músculo, que se aprietan con el pinch */}
      {Array.from({ length: 26 }, (_, i) => { const y0 = 200 + i * 62, dy = (y0 - cy) * -0.12 * pinch; return <path key={i} d={`M-20 ${y0 + dy} C300 ${y0 + dy + 14} 760 ${y0 + dy - 14} 1100 ${y0 + dy}`} stroke="#7A2A34" strokeWidth={10} opacity={0.5} fill="none" />; })}
      {verde > 0 && <rect width={1080} height={1920} fill="#3FB56B" opacity={0.12 * verde} />}
      {/* luz del vaso */}
      <path d={`M${pared(-1)} L${pared(1).split(" L").reverse().join(" L")} Z`} fill="#9E2F3A" />
      <path d={`M${pared(-1)}`} stroke="#F2B8B5" strokeWidth={22} fill="none" />
      <path d={`M${pared(1)}`} stroke="#F2B8B5" strokeWidth={22} fill="none" />
      {pinch > 0.2 && [-1, 1].map((s) => <path key={s} d={`M640 ${cy + s * (media(640) + 150)} L640 ${cy + s * (media(640) + 40)}`} stroke="#FF9A3C" strokeWidth={14} strokeLinecap="round" opacity={Math.min(1, (pinch - 0.2) * 3)} markerEnd="" />)}
      {pinch > 0.2 && [-1, 1].map((s) => <path key={`p${s}`} d={`M610 ${cy + s * (media(640) + 70)} L640 ${cy + s * (media(640) + 40)} L670 ${cy + s * (media(640) + 70)}`} stroke="#FF9A3C" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={Math.min(1, (pinch - 0.2) * 3)} />)}
      {celulas.map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.g}) scale(${c.r})`}>
          <ellipse rx={46} ry={38} fill={rojo} stroke="#7A1F24" strokeWidth={5} />
          <ellipse rx={22} ry={17} fill="#B8333B" />
          <path d="M-30 -20 Q-14 -32 6 -30" stroke="#FFC2C2" strokeWidth={6} strokeLinecap="round" fill="none" />
          <circle cx={38} cy={-24} r={8} fill="#fff" opacity={0.9 * (1 - atasco * 0.8)} />
        </g>
      ))}
      {res.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={p.r * 1.8} fill="#E6E35A" opacity={0.25} filter="url(#vGlow)" /><circle cx={p.x + Math.sin(f * 0.15 + i) * 4} cy={p.y} r={p.r} fill="#E6E35A" /></g>)}
    </svg>
  );
};

/** Analogía visual (sin voz): una pajita pellizcada; el líquido no sube. k = aparición, p = cuánto se pisa. */
export const Pajita: React.FC<{ k: number; p: number; x?: number; y?: number; tam?: number }> = ({ k, p, x = 40, y = 1250, tam = 420 }) => k <= 0 ? null : (
  <svg viewBox="0 0 400 400" width={tam} height={tam} style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, k), transform: `scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <circle cx={200} cy={200} r={190} fill="#0B1220" stroke="#fff" strokeWidth={8} />
    <path d="M130 170 L150 330 L250 330 L270 170 Z" fill="#9EC5FF" opacity={0.25} stroke="#DCE8F5" strokeWidth={5} />
    <path d="M136 220 L146 324 L254 324 L264 220 Z" fill="#F5A524" opacity={0.8} />
    <path d={`M215 300 L215 ${140 + 40 * p} M215 ${140 + 40 * p} L235 70`} stroke="#E5484D" strokeWidth={16 - 10 * p} strokeLinecap="round" fill="none" />
    <path d={`M${215 - 40} 200 L${215 - 8 - 6 * (1 - p)} 200 M${215 + 40} 200 L${215 + 8 + 6 * (1 - p)} 200`} stroke="#FF9A3C" strokeWidth={12} strokeLinecap="round" />
    <text x={200} y={130} textAnchor="middle" fontFamily="Figtree" fontWeight={800} fontSize={30} fill="#fff">PAJITA PELLIZCADA</text>
  </svg>
);
