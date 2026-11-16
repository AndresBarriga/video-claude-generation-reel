// E60 «Tu mano quiere salvarte». Misma caída en 4 tomas: cinta, presa, cuerda y «no agarres nada». Todo sobre el KIT (src/piezas/kit).
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { crearVia, PERFILES, REPARTO, POSE, G, mix, Plano, Svg, Chip, aparato, type Angulos, type Pt } from "../../piezas/kit";
export { C, clamp, golpe, type P } from "../../piezas/kit";

export const VIA = crearVia({ perfil: PERFILES.vertical, metros: [2.8, 4.3, 6, 7.6, 9.2] });
export const I = 3, M = VIA.mos(I), P0 = VIA.cadera(M.y - 85), XA = 250, AP = aparato(VIA, XA);
export const K0 = Math.sqrt(150 / G); // fotogramas de caída hasta que la cinta pasa a la altura del hombro
export const CINTA = { x: M.x + 5, y: M.y - 30 }; // centro de la cinta (donde va la mano)
export const TU = REPARTO.tu, ASE = REPARTO.ase;
export const BASE: Angulos = { ...POSE.cae, cabeza: -24, brazoB: [150, 165], piernaA: [40, 4], piernaB: [10, -12] };
/** Caída libre antes de agarrar nada. k = fotogramas desde que se suelta. */
export const libre = (k: number): { p: Pt; ang: Angulos } => ({ p: { x: P0.x - 8 * Math.min(1, Math.max(0, k) / 10), y: P0.y + G * Math.max(0, k) ** 2 }, ang: mix(POSE.agarre, BASE, Math.min(1, Math.max(0, k) / 5)) });

export const Mundo: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = (p) => <Plano via={VIA} decorado="roca" {...p} />;
/** Primer plano: fondo de roca con rayas de velocidad (v = px/fotograma; 0 = quieto). */
export const PP: React.FC<{ v?: number; sh?: number; tinte?: string; children: React.ReactNode }> = ({ v = 0, sh = 0, tinte = "#C9B797", children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: tinte, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
      <Svg>
        {Array.from({ length: 16 }).map((_, i) => { const x = random(`pl${i}`) * 1080, l = 160 + random(`pq${i}`) * 300, y = ((random(`py${i}`) * 2400 - f * v * (0.6 + random(`pv${i}`))) % 2400 + 2400) % 2400 - 240; return <path key={i} d={`M${x} ${y} v${l}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={v ? 0.28 : 0.1} />; })}
        {children}
      </Svg>
    </AbsoluteFill>
  );
};
/** Humo de dibujos (quemadura). k = fotogramas desde que empieza; `n` bocanadas. */
export const Humo: React.FC<{ x: number; y: number; k: number; n?: number }> = ({ x, y, k, n = 7 }) => k < 0 ? null : (
  <g>{Array.from({ length: n }).map((_, i) => { const t = ((k + i * 7) % 34) / 34, dx = (random(`hx${i}`) - 0.5) * 160; return <ellipse key={i} cx={x + dx + Math.sin(t * 5 + i) * 26} cy={y - t * 330} rx={34 + t * 50} ry={28 + t * 40} fill="#F3F1EC" stroke="#050B14" strokeWidth={7} opacity={Math.min(1, k / 6) * (1 - t) * 0.95} />; })}</g>
);
/** Rebobinado entre tomas: bandas de cinta de vídeo + «◀◀». k = fotogramas (dura N). */
export const N_REB = 10;
export const Rebobina: React.FC<{ k: number }> = ({ k }) => k < 0 || k >= N_REB ? null : (
  <AbsoluteFill>
    {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: ((random(`rb${i}`) * 1920 + k * 173 * (i % 2 ? 1 : -1)) % 1920 + 1920) % 1920, height: 10 + random(`rh${i}`) * 34, background: "#fff", opacity: 0.35 }} />)}
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 200, color: "#fff", WebkitTextStroke: "12px #050B14", paintOrder: "stroke fill" }}>◀◀</div>
  </AbsoluteFill>
);
/** Contador de toma (arriba). k = fotogramas desde que aparece. */
export const Toma: React.FC<{ n: number | string; k?: number }> = ({ n, k = 99 }) => <Chip texto={typeof n === "number" ? `TOMA ${n}` : n} top={170} tam={54} k={Math.min(1, Math.max(0, k) / 5)} color={typeof n === "number" ? "rgba(5,11,20,.82)" : "#2E8B57"} />;
