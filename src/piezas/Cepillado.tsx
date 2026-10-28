// Piezas de cepillado (E31 «La presa perfecta», E32 «ASMR cepillado»): presa en macro, pared de rocódromo en macro,
// cepillo de presas, cepillo de dientes, puño que los agarra, nube de magnesio periódica (para bucles perfectos).
// Mismo estilo que Mano.tsx: formas gruesas, contorno oscuro, color plano.
import React from "react";
import { random } from "remotion";
import { TINTA_MANO as T } from "./Mano";

const BLANCO = "#F4F6F8";
export const ROSA = { c: "#C8566B", s: "#94384C", l: "#E58599" };

/** Pared de rocódromo en macro: panel, juntas, agujeros de tuerca. */
export const PanelMacro: React.FC<{ tono?: string }> = ({ tono = "#5C6E86" }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2320} fill={tono} />
    {[-40, 700, 1440].map((y, i) => <path key={i} d={`M-200 ${y} L1300 ${y + 40}`} stroke="#3E4C60" strokeWidth={10} />)}
    {Array.from({ length: 24 }).map((_, i) => {
      const x = 90 + (i % 4) * 300 + (Math.floor(i / 4) % 2) * 150, y = 120 + Math.floor(i / 4) * 330;
      return <g key={i}><circle cx={x} cy={y} r={22} fill="#3E4C60" /><circle cx={x} cy={y} r={10} fill="#1E2733" /></g>;
    })}
    {Array.from({ length: 7 }).map((_, i) => <ellipse key={i} cx={random(`pm${i}`) * 1080} cy={random(`pn${i}`) * 1920} rx={60 + random(`po${i}`) * 80} ry={20} fill={BLANCO} opacity={0.06} />)}
  </g>
);

/** Presa grande en macro. (x, y) = centro; s = escala (radio base ≈ 260).
 *  sucia 0–1: magnesio apelmazado y marcas de goma; limpio 0–1: franja ya limpia de izquierda a derecha; brillo 0–1. */
export const Presa: React.FC<{ x: number; y: number; s?: number; col?: typeof ROSA; sucia?: number; limpio?: number; brillo?: number; seed?: string; tw?: number }> = ({ x, y, s = 1, col = ROSA, sucia = 0, limpio = 0, brillo = 0, seed = "pr", tw = 0 }) => {
  const forma = "M-260 60 C-272 -90 -120 -172 0 -172 C140 -172 272 -100 262 40 C252 142 120 172 0 166 C-140 172 -250 150 -260 60 Z";
  const vis = (u: number) => Math.max(0, Math.min(1, (u - limpio) * 8)); // u = posición 0–1 de izquierda a derecha
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={20} cy={170} rx={270} ry={40} fill="#000" opacity={0.28} />
      <path d={forma} fill={col.c} stroke={T} strokeWidth={10} strokeLinejoin="round" />
      <path d="M-240 80 C-200 150 120 175 250 60 C240 140 120 168 0 162 C-140 168 -236 140 -240 80 Z" fill={col.s} />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={-200 + random(`${seed}g${i}`) * 400} cy={-130 + random(`${seed}h${i}`) * 250} r={3 + random(`${seed}i${i}`) * 3} fill={col.s} opacity={0.5} />)}
      {/* tornillo */}
      <circle cx={0} cy={-6} r={36} fill={col.s} stroke={T} strokeWidth={7} />
      <path d="M-14 -20 L14 -20 L22 -6 L14 8 L-14 8 L-22 -6 Z" fill="#1E2733" />
      {/* película de polvo gris sobre toda la presa, por franjas (se va limpiando de izquierda a derecha) */}
      {sucia > 0 && <g><clipPath id={`${seed}cl`}><path d={forma} /></clipPath><g clipPath={`url(#${seed}cl)`}>
        {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-262 + i * 26.2 - 8} y={-180} width={42} height={360} fill="#D9DCE0" opacity={0.3 * sucia * vis(i / 19)} />)}
      </g></g>}
      {/* suciedad: magnesio apelmazado arriba (donde se agarra), marcas negras de goma abajo */}
      {sucia > 0 && Array.from({ length: 16 }).map((_, i) => {
        const u = i / 15, px = -220 + u * 440, py = -138 + Math.abs(px) * 0.12 + random(`${seed}m${i}`) * 26;
        return <ellipse key={i} cx={px} cy={py} rx={22 + random(`${seed}n${i}`) * 26} ry={12 + random(`${seed}o${i}`) * 10} fill={BLANCO} opacity={0.85 * sucia * vis(u)} />;
      })}
      {sucia > 0 && [[-170, 100, 0.15], [-60, 128, 0.4], [90, 120, 0.65], [190, 70, 0.9]].map(([px, py, u], i) => (
        <path key={i} d={`M${px - 40} ${py + 8} L${px + 34} ${py - 14} M${px - 26} ${py + 22} L${px + 20} ${py + 6}`} stroke="#141414" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.6 * sucia * vis(u)} />
      ))}
      {/* brillo: reflejos de barniz + destellos que parpadean (tw = fase; 3 parpadeos por unidad) */}
      {brillo > 0 && <g opacity={brillo}>
        <path d="M-210 -40 C-196 -120 -100 -162 -10 -160" stroke="#fff" strokeWidth={26} strokeLinecap="round" fill="none" opacity={0.9} />
        <path d="M50 -154 C130 -146 196 -112 226 -56" stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.7} />
        <ellipse cx={-130} cy={-50} rx={52} ry={22} fill="#fff" opacity={0.45} transform="rotate(-25 -130 -50)" />
        <path d="M-200 90 C-120 140 80 150 200 80" stroke={col.l} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.6} />
      </g>}
      {brillo > 0 && <Destellos k={brillo} tw={tw} />}
    </g>
  );
};

/** Destellos de cuatro puntas sobre la presa. */
export const Destellos: React.FC<{ k: number; tw: number; pts?: number[][]; tam?: number }> = ({ k, tw, pts = [[-160, -150, 1.2], [170, -100, 0.9], [-40, -185, 0.7], [230, 10, 0.6], [-240, 20, 0.7], [80, 120, 0.5]], tam = 44 }) => (
  <g>{pts.map(([gx, gy, m], i) => {
    const sc = k * m * (0.45 + 0.55 * Math.abs(Math.sin(2 * Math.PI * (3 * tw + i / 6))));
    const r = tam * sc, w = r * 0.18;
    return <g key={i}>
      <circle cx={gx} cy={gy} r={r * 0.9} fill="#FFF7D6" opacity={0.25} />
      <path d={`M${gx} ${gy - r} L${gx + w} ${gy - w} L${gx + r} ${gy} L${gx + w} ${gy + w} L${gx} ${gy + r} L${gx - w} ${gy + w} L${gx - r} ${gy} L${gx - w} ${gy - w} Z`} fill="#fff" />
    </g>;
  })}</g>
);

/** Mano cerrada sobre un mango vertical (0,0), vista por la palma: cuatro dedos cruzan el mango por delante, pulgar encima.
 *  La muñeca y la manga salen hacia −y (lejos de las cerdas). */
export const Puno: React.FC<{ piel?: string; pielS?: string; manga?: string }> = ({ piel = "#C99266", pielS = "#A06F48", manga = "#D9A32B" }) => (
  <g>
    <rect x={-74} y={-820} width={148} height={660} rx={40} fill={manga} stroke={T} strokeWidth={8} />
    <rect x={-84} y={-210} width={168} height={250} rx={64} fill={pielS} stroke={T} strokeWidth={8} />
    {[[-158, 196], [-106, 200], [-54, 192], [-4, 168]].map(([y, w], i) => (
      <g key={i}>
        <rect x={-100} y={y} width={w} height={52} rx={26} fill={piel} stroke={T} strokeWidth={7} />
        <path d={`M${-100 + w * 0.55} ${y + 12} q8 14 0 28`} stroke={pielS} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <g transform="rotate(-14 -20 -190)"><rect x={-96} y={-214} width={170} height={50} rx={25} fill={piel} stroke={T} strokeWidth={7} /><ellipse cx={52} cy={-189} rx={14} ry={11} fill="#E9C3A6" /></g>
  </g>
);

type PropsCep = { x: number; y: number; rot?: number; s?: number; doblado?: number; puno?: boolean; piel?: string; pielS?: string; manga?: string };
/** Cepillo de presas. (x, y) = puntas de las cerdas; el mango sale hacia arriba (rot en grados). doblado −1…1 = cerdas que se doblan al arrastrar. */
export const Cepillo: React.FC<PropsCep> = ({ x, y, rot = 0, s = 1, doblado = 0, puno = true, ...p }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-34} y={-640} width={68} height={540} rx={34} fill="#C9A06A" stroke={T} strokeWidth={8} />
    <path d="M-12 -620 L-12 -130" stroke="#E2C08E" strokeWidth={10} strokeLinecap="round" />
    <rect x={-120} y={-150} width={240} height={74} rx={18} fill="#2B3442" stroke={T} strokeWidth={8} />
    {Array.from({ length: 13 }).map((_, i) => { const bx = -108 + i * 18; return <path key={i} d={`M${bx} -78 Q${bx + doblado * 8} -40 ${bx + doblado * 30} 0`} stroke="#E8DCC4" strokeWidth={13} strokeLinecap="round" fill="none" />; })}
    <path d="M-118 -78 L118 -78" stroke={T} strokeWidth={6} />
    {puno && <g transform="translate(0 -470)"><Puno {...p} /></g>}
  </g>
);

/** Cepillo de dientes (cerdas azules y blancas). Mismas convenciones que Cepillo. */
export const CepilloDientes: React.FC<PropsCep> = ({ x, y, rot = 0, s = 1, doblado = 0, puno = true, ...p }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-26 -700 Q-36 -400 -20 -110 L20 -110 Q36 -400 26 -700 Z" fill="#4F9FD9" stroke={T} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-6 -660 L-4 -150" stroke="#9CCBEE" strokeWidth={9} strokeLinecap="round" />
    <rect x={-70} y={-128} width={140} height={34} rx={14} fill="#4F9FD9" stroke={T} strokeWidth={8} />
    {Array.from({ length: 7 }).map((_, i) => { const bx = -58 + i * 19.3; return <path key={i} d={`M${bx} -94 Q${bx + doblado * 6} -50 ${bx + doblado * 22} 0`} stroke={i % 2 ? "#F4F6F8" : "#7FD1E8"} strokeWidth={15} strokeLinecap="round" fill="none" />; })}
    {puno && <g transform="translate(0 -500)"><Puno {...p} /></g>}
  </g>
);

/** Nube de magnesio periódica: con t en fotogramas y periodo P, el fotograma P es idéntico al 0 (bucle perfecto).
 *  densa 0–1 = nube espesa (soplido); siempre hay motas en suspensión. */
export const Suspension: React.FC<{ t: number; P: number; cx: number; cy: number; ancho?: number; alto?: number; n?: number; densa?: number; seed?: string; luz?: number }> = ({ t, P, cx, cy, ancho = 900, alto = 900, n = 60, densa = 0, seed = "su", luz = 1 }) => (
  <g>
    {densa > 0 && Array.from({ length: 22 }).map((_, i) => {
      const a = random(`${seed}A${i}`) * Math.PI * 2, r = 60 + random(`${seed}R${i}`) * 260;
      return <circle key={`d${i}`} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r * 0.6} r={(110 + random(`${seed}S${i}`) * 120) * (0.7 + 0.5 * densa)} fill={BLANCO} opacity={0.32 * densa} />;
    })}
    {Array.from({ length: n }).map((_, i) => {
      const k = 1 + Math.floor(random(`${seed}k${i}`) * 2), ph = random(`${seed}f${i}`);
      const u = (((t / P) * k + ph) % 1 + 1) % 1; // fase 0–1, periódica
      const x0 = cx + (random(`${seed}x${i}`) - 0.5) * ancho;
      const px = x0 + Math.sin(2 * Math.PI * (u + ph)) * 40;
      const py = cy + alto / 2 - u * alto;
      const r = 3 + random(`${seed}r${i}`) * 9;
      return <circle key={i} cx={px} cy={py} r={r} fill={BLANCO} opacity={Math.sin(Math.PI * u) * (0.35 + 0.45 * random(`${seed}o${i}`)) * luz} />;
    })}
  </g>
);

/** Pie de gato de perfil (puntera a +x). (x, y) = punta de la puntera. */
export const PieGato: React.FC<{ x: number; y: number; rot?: number; s?: number; color?: string }> = ({ x, y, rot = 0, s = 1, color = "#2FA39A" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-520} y={-760} width={190} height={620} rx={60} fill="#2F3A4C" stroke={T} strokeWidth={9} transform="rotate(-24 -425 -190)" />
    <path d="M0 0 Q-10 -70 -120 -120 L-380 -210 Q-470 -230 -480 -120 L-470 -10 Q-300 30 -20 20 Z" fill={color} stroke={T} strokeWidth={9} strokeLinejoin="round" />
    <path d="M10 6 Q-200 46 -480 -6 L-484 -50 Q-250 -6 -6 -24 Z" fill="#1B1F27" stroke={T} strokeWidth={7} />
    <path d="M-300 -160 L-200 -60 M-250 -180 L-150 -80" stroke="#1B1F27" strokeWidth={12} strokeLinecap="round" />
  </g>
);

/** Suela del pie de gato vista de frente (para cepillarla). (x, y) = centro. */
export const Suela: React.FC<{ x: number; y: number; s?: number; color?: string; sucia?: number }> = ({ x, y, s = 1, color = "#2FA39A", sucia = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -380 C150 -380 190 -200 170 0 C150 220 120 380 0 390 C-120 380 -150 220 -160 0 C-180 -200 -150 -380 0 -380 Z" fill={color} stroke={T} strokeWidth={10} />
    <path d="M0 -350 C130 -350 160 -200 145 0 C130 200 105 350 0 360 C-105 350 -130 200 -138 0 C-152 -200 -125 -350 0 -350 Z" fill="#1B1F27" />
    {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={-90 + random(`su${i}`) * 180} cy={-300 + random(`sv${i}`) * 600} rx={26} ry={12} fill="#9AA0A8" opacity={0.6 * sucia} />)}
  </g>
);
