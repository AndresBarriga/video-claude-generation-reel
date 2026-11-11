// E41 «Factor de caída». Pantalla partida: a la IZQUIERDA (tú) una vía larga en granito por la mañana, sobre un mar de nubes,
// saliendo de la reunión sin seguro (factor 2); a la DERECHA (tu compañero) la cueva de E47, cinco metros por encima de su última chapa
// (diez metros de caída, veinte de cuerda: factor 0,5). Quien asegura lleva SIEMPRE la mano de freno en la cuerda.
import React from "react";
import { random } from "remotion";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { C } from "../Pegue/comun";
import { xF, CHAPAS, APARATO } from "../Suelta/comun";
export { C, Etiqueta, clamp, golpe, type P } from "../Pegue/comun";
export { Fondo, Cueva, Asegura, TU as TU_CUEVA, ASEG as ASEG_CUEVA, ANG_AGARRE, ANG_CAER, ANG_COLGADO, xF, CHAPAS, APARATO, SUELO, PC } from "../Suelta/comun";

export const PM = 170; // px por metro (Escalador ≈ 1,75 m)
export const T = "#141B26";

/* ---------------- panel (media pantalla) ---------------- */
export const Panel: React.FC<{ lado: 0 | 1; cx: number; cy: number; z: number; oscuro?: number; sh?: number; ancho?: number; fondo?: React.ReactNode; children: React.ReactNode }> = ({ lado, cx, cy, z, oscuro = 0, sh = 0, ancho = 540, fondo, children }) => (
  <div style={{ position: "absolute", top: 0, left: lado ? 1080 - ancho : 0, width: ancho, height: 1920, overflow: "hidden" }}>
    <svg viewBox={`0 0 ${ancho} 1920`} width={ancho} height={1920} style={{ position: "absolute", inset: 0, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
      {fondo}
      <g transform={`translate(${ancho / 2} 960) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>
    </svg>
    {oscuro > 0 && <div style={{ position: "absolute", inset: 0, background: "#050B14", opacity: oscuro }} />}
  </div>
);
export const Divisor: React.FC<{ o?: number }> = ({ o = 1 }) => <div style={{ position: "absolute", top: 0, bottom: 0, left: 536, width: 8, background: "#050B14", opacity: o }} />;
export const Pildora: React.FC<{ x: number; texto: string; color?: string; o?: number; top?: number }> = ({ x, texto, color = "#fff", o = 1, top = 222 }) => (
  <div style={{ position: "absolute", top, left: x, transform: "translateX(-50%)", opacity: o, fontFamily: "Figtree", fontWeight: 700, fontSize: 40, letterSpacing: 2, color, background: "rgba(5,11,20,.78)", borderRadius: 36, padding: "6px 24px", whiteSpace: "nowrap" }}>{texto}</div>
);
export const Dato: React.FC<{ x: number; y: number; texto: string; color?: string; s?: number; tam?: number }> = ({ x, y, texto, color = "#fff", s = 1, tam = 92 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, s * 1.4), fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: tam, color, WebkitTextStroke: "12px #050B14", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{texto}</div>
);

/* ---------------- reparto de la vía larga ---------------- */
export const TU_L: Aspecto = { chaqueta: "#5E7F3A", chaquetaSombra: "#425A28", pantalon: "#3A3530", casco: "#3E6FB0", pelo: "#2A1B12", peinado: "coleta", piel: "#D9A57C", pielSombra: "#B6835C", manos: "piel" };
export const ASEG_L: Aspecto = { chaqueta: "#B8452F", chaquetaSombra: "#86301F", pantalon: "#2E3440", casco: "#F2F0EA", pelo: "#3B2A20", barba: "#3B2A20", piel: "#C99068", pielSombra: "#A46F4C", manos: "piel" };

/* ---------------- mundo de la vía larga ---------------- */
export const PL = { cieloA: "#2F6CA8", cieloB: "#9CC4E4", nube: "#EEF3F8", nubeS: "#C6D6E6", roca: "#ADA699", rocaS: "#867F73", rocaL: "#CFC9BC", grieta: "#4D4840" };
export const xW = (y: number) => 470 + (y - 1200) * 0.05 + 9 * Math.sin(y / 90) + 5 * Math.sin(y / 27);
export const REU = { x: xW(1200) + 34, y: 1200 }; // anillo de la reunión
export const L_ARRIBA = { x: xW(1030) - 62, y: 1030 }; // tu cadera: un metro por encima de la reunión
export const ASE_L = { x: xW(1340) - 205, y: 1330 }; // cadera de quien asegura, colgado de la reunión

export const Larga: React.FC<{ f: number }> = ({ f }) => {
  const ys = Array.from({ length: 70 }, (_, i) => -600 + i * 60);
  const cara = ys.map((y) => `${xW(y)} ${y}`).join(" L");
  return (
    <g>
      <defs>
        <linearGradient id="fl-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PL.cieloA} /><stop offset="1" stopColor={PL.cieloB} /></linearGradient>
        <linearGradient id="fl-roca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={PL.rocaL} /><stop offset="0.25" stopColor={PL.roca} /><stop offset="1" stopColor="#8E887C" /></linearGradient>
      </defs>
      <rect x={-1200} y={-1500} width={3400} height={5200} fill="url(#fl-cielo)" />
      <circle cx={-80} cy={300} r={140} fill="#FFF6DC" opacity={0.35} />
      {/* picos lejanos y mar de nubes muy abajo */}
      <path d="M-1200 2050 L-700 1760 L-520 1880 L-300 1700 L-120 1900 L120 1820 L300 2050 Z" fill="#7F9CB8" />
      <path d="M-560 1790 L-520 1880 L-480 1800 Z M-330 1720 L-300 1700 L-260 1760 Z" fill="#F4F7FA" />
      {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={-1100 + i * 110 + Math.sin(f / 60 + i) * 10} cy={2060 + random(`mn${i}`) * 80} rx={150 + random(`mr${i}`) * 80} ry={60} fill={i % 2 ? PL.nube : PL.nubeS} />)}
      <rect x={-1200} y={2100} width={3400} height={1700} fill={PL.nube} />
      {/* la pared */}
      <path d={`M${cara} L2200 3600 L2200 -600 Z`} fill="url(#fl-roca)" />
      {/* diedro, grietas, lascas y repisas */}
      <path d={`M${xW(-400) + 260} -600 L${xW(2400) + 300} 3600 L2200 3600 L2200 -600 Z`} fill={PL.rocaS} opacity={0.35} />
      {Array.from({ length: 12 }).map((_, i) => { const x = xW(0) + 40 + random(`gx${i}`) * 600, y0 = -500 + random(`gy${i}`) * 2800, l = 250 + random(`gl${i}`) * 500;
        return <path key={i} d={`M${x} ${y0} q${-14 + random(`gq${i}`) * 28} ${l * 0.5} ${random(`gw${i}`) * 20 - 10} ${l}`} stroke={PL.grieta} strokeWidth={4 + random(`gs${i}`) * 4} fill="none" opacity={0.7} strokeLinecap="round" />; })}
      {Array.from({ length: 14 }).map((_, i) => { const y = -400 + i * 230 + random(`ry${i}`) * 80, x = xW(y) + 20 + random(`rx${i}`) * 480, w = 60 + random(`rw${i}`) * 90;
        return <g key={i}><path d={`M${x} ${y} l${w} -6 l-8 14 l${-w + 8} 4 Z`} fill={PL.rocaL} /><path d={`M${x} ${y + 12} l${w - 4} -2`} stroke={PL.grieta} strokeWidth={4} opacity={0.6} /></g>; })}
      <path d={`M${cara}`} stroke="#E8E2D4" strokeWidth={8} fill="none" opacity={0.6} />
      <path d={`M${cara}`} stroke={T} strokeWidth={4} fill="none" opacity={0.5} />
      {/* reunión: dos chapas unidas con cadena y anillo */}
      {[[REU.x - 4, REU.y - 34], [REU.x + 30, REU.y - 22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#B8C0C8" stroke={T} strokeWidth={4} />)}
      <path d={`M${REU.x - 4} ${REU.y - 30} L${REU.x} ${REU.y} L${REU.x + 30} ${REU.y - 18}`} stroke="#C9D1D8" strokeWidth={6} fill="none" strokeDasharray="7 4" />
      <circle cx={REU.x} cy={REU.y} r={11} fill="none" stroke="#C9D1D8" strokeWidth={6} />
    </g>
  );
};

/* ---------------- cinemática inversa de un brazo ---------------- */
export const ik = (sh: [number, number], tx: number, ty: number, codo: 1 | -1): [number, number] => {
  const L1 = 52, L2 = 50, dx = tx - sh[0], dy = ty - sh[1], d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const a1 = base + codo * al, e = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
  return [(a1 * 180) / Math.PI, (Math.atan2(tx - e[0], ty - e[1]) * 180) / Math.PI];
};
const hombro = (torso: number): [number, number] => [Math.sin(((180 - torso) * Math.PI) / 180) * 88, Math.cos(((180 - torso) * Math.PI) / 180) * 88];
const cuerdaD = (d: string, w = 10) => <><path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke="#FFB27F" strokeWidth={2.5} fill="none" strokeDasharray="9 11" opacity={0.7} /></>;

/** Quien asegura en la reunión: colgado de la reunión con su cabo, pies en la pared; mano guía en la cuerda que sube y mano de FRENO
 *  siempre en la cuerda bajo el aparato; la cuerda sobrante cuelga en bucles. `dy` = tirón hacia la reunión en la frenada. `al` = punto al que va la cuerda. */
export const AseguraL: React.FC<{ dy?: number; al: { x: number; y: number }; cara?: Cara; brillo?: number }> = ({ dy = 0, al, cara = "normal", brillo = 0 }) => {
  const TO = -18, hip = { x: ASE_L.x + dy * 0.3, y: ASE_L.y + dy }, sh = hombro(TO);
  const ap = { x: hip.x + 22, y: hip.y - 12 };
  const k = 64 / Math.max(1, Math.hypot(al.x - ap.x, al.y - ap.y)), guia = { x: ap.x + (al.x - ap.x) * k, y: ap.y + (al.y - ap.y) * k };
  const freno = { x: ap.x + 6, y: ap.y + 16 };
  const brazoB = ik(sh, guia.x - hip.x, guia.y - hip.y, -1), brazoA = ik(sh, freno.x - hip.x, freno.y - hip.y, 1);
  const bucles = [0, 1, 2].map((i) => `M${freno.x} ${freno.y} C${freno.x - 30 - i * 14} ${freno.y + 120 + i * 70} ${hip.x + 70 + i * 10} ${hip.y + 150 + i * 80} ${hip.x + 46} ${hip.y + 40}`);
  return (
    <g>
      {bucles.map((d, i) => <g key={i} opacity={0.95}>{cuerdaD(d, 8)}</g>)}
      <path d={`M${REU.x} ${REU.y} L${hip.x + 4} ${hip.y - 6}`} stroke="#3E6FB0" strokeWidth={9} strokeLinecap="round" />
      <Escalador x={hip.x} y={hip.y} quien="simon" angulos={{ torso: TO, cabeza: -30, brazoA, brazoB, piernaA: [62, 12], piernaB: [44, 2] }} cara={cara} aspecto={ASEG_L} mira={1} />
      {cuerdaD(`M${ap.x} ${ap.y} L${freno.x} ${freno.y}`, 8)}
      <rect x={ap.x - 12} y={ap.y - 10} width={22} height={26} rx={6} fill="#B8C0C8" stroke={T} strokeWidth={4} />
      <circle cx={freno.x} cy={freno.y} r={13} fill={ASEG_L.piel} stroke={T} strokeWidth={4} />
      <circle cx={guia.x} cy={guia.y} r={12} fill={ASEG_L.piel} stroke={T} strokeWidth={4} />
      {brillo > 0 && <circle cx={hip.x} cy={hip.y - 60} r={170} fill="none" stroke="#F2C230" strokeWidth={9} opacity={brillo} />}
    </g>
  );
};
export const apL = (dy = 0) => ({ x: ASE_L.x + dy * 0.3 + 22, y: ASE_L.y + dy - 12 });

/** Cuerda de la vía larga: del aparato a tu arnés, sin ningún seguro (o por el primer seguro si `seguro`). */
export const CuerdaL: React.FC<{ arnes: { x: number; y: number }; dy?: number; floja?: number; seguro?: { x: number; y: number }; brillo?: number }> = ({ arnes, dy = 0, floja = 0, seguro, brillo = 0 }) => {
  const a = apL(dy);
  const d = seguro ? `M${a.x} ${a.y} L${seguro.x} ${seguro.y} Q${(seguro.x + arnes.x) / 2 - floja * 60} ${(seguro.y + arnes.y) / 2 + floja * 80} ${arnes.x + 18} ${arnes.y - 6}`
    : `M${a.x} ${a.y} Q${(a.x + arnes.x) / 2 - 30 - floja * 90} ${(a.y + arnes.y) / 2 + floja * 120} ${arnes.x + 18} ${arnes.y - 6}`;
  return <g>{brillo > 0 && <path d={d} stroke="#FFE3A0" strokeWidth={30} opacity={0.45 * brillo} fill="none" strokeLinecap="round" />}{cuerdaD(d)}</g>;
};

/** Cuerda de la cueva (E41): por las cuatro primeras chapas; la quinta queda sin chapar. */
export const N_CHAPADAS = 4;
export const ULTIMA = { x: xF(CHAPAS[N_CHAPADAS - 1]) - 6, y: CHAPAS[N_CHAPADAS - 1] + 54 };
export const C_ARRIBA = { x: xF(ULTIMA.y - 5 * PM) - 80, y: ULTIMA.y - 5 * PM }; // su cadera: cinco metros por encima de la última chapa
export const CuerdaC: React.FC<{ arnes: { x: number; y: number }; dy?: number; floja?: number; brillo?: number }> = ({ arnes, dy = 0, floja = 0, brillo = 0 }) => {
  const pts = [APARATO(dy), ...CHAPAS.slice(0, N_CHAPADAS).map((y) => ({ x: xF(y) - 6, y: y + 54 }))];
  const sobre = arnes.y < ULTIMA.y; // por encima de la última chapa: la cuerda cuelga en comba
  const ctrl = sobre ? { x: (ULTIMA.x + arnes.x) / 2 - 40 - floja * 70, y: (ULTIMA.y + arnes.y) / 2 + 50 + floja * 130 } : { x: (ULTIMA.x + arnes.x) / 2 - floja * 80, y: (ULTIMA.y + arnes.y) / 2 + floja * 60 };
  const d = `M${pts.map((p) => `${p.x} ${p.y}`).join(" L")} Q${ctrl.x} ${ctrl.y} ${arnes.x + 18} ${arnes.y - 6}`;
  return <g>{brillo > 0 && <path d={d} stroke="#FFE3A0" strokeWidth={30} opacity={0.45 * brillo} fill="none" strokeLinecap="round" strokeLinejoin="round" />}{cuerdaD(d)}</g>;
};

/* ---------------- caídas ---------------- */
const mixA = (a: Angulos, b: Angulos, t: number): Angulos => { const l = (x: number, y: number) => x + (y - x) * t; return { torso: l(a.torso, b.torso), cabeza: l(a.cabeza, b.cabeza), brazoA: [l(a.brazoA[0], b.brazoA[0]), l(a.brazoA[1], b.brazoA[1])], brazoB: [l(a.brazoB[0], b.brazoB[0]), l(a.brazoB[1], b.brazoB[1])], piernaA: [l(a.piernaA[0], b.piernaA[0]), l(a.piernaA[1], b.piernaA[1])], piernaB: [l(a.piernaB[0], b.piernaB[0]), l(a.piernaB[1], b.piernaB[1])] }; };
export const AG: Angulos = { torso: 14, cabeza: -20, brazoA: [160, 178], brazoB: [140, 166], piernaA: [78, 24], piernaB: [56, 8] };
export const CAE: Angulos = { torso: -14, cabeza: -22, brazoA: [135, 110], brazoB: [-120, -100], piernaA: [46, -12], piernaB: [8, -30] };
export const CUELGA: Angulos = { torso: 6, cabeza: 8, brazoA: [30, 10], brazoB: [-24, -6], piernaA: [36, 4], piernaB: [14, -8] };

/** Caída CORTA (2 m, cuerda corta): caída libre ≈ 19 fotogramas y frenazo SECO en 2–3 fotogramas con rebote mínimo. fr = fotogramas desde que se suelta. */
export const caidaCorta = (fr: number, y0: number, x0: number) => {
  const tf = 19, D = 2 * PM;
  if (fr <= 0) return { x: x0, y: y0, ang: AG, floja: 0, frenada: false };
  if (fr < tf) { const g = fr / tf; return { x: x0 + 18 * g, y: y0 + D * g * g, ang: mixA(AG, CAE, Math.min(1, g * 2.5)), floja: 1 - g, frenada: false }; }
  const k = fr - tf; return { x: x0 + 18, y: y0 + D + 16 * Math.exp(-k / 2.5) * Math.cos(k * 1.6), ang: mixA(CAE, CUELGA, Math.min(1, k / 6)), floja: 0, frenada: true };
};
/** Caída LARGA (10 m, mucha cuerda): caída libre y la cuerda se estira despacio; rebote amplio y suave. */
export const caidaLarga = (fr: number, y0: number, x0: number) => {
  const tf = 40, tE = 18, D = 10 * PM, E = 0.9 * PM;
  if (fr <= 0) return { x: x0, y: y0, ang: AG, floja: 0, frenada: false };
  if (fr < tf) { const g = fr / tf; return { x: x0 - 60 * g, y: y0 + (D - 0.4 * PM) * g * g, ang: mixA(AG, CAE, Math.min(1, g * 2)), floja: 1 - g * 0.5, frenada: false }; }
  const k = fr - tf, base = y0 + D - 0.4 * PM;
  const est = k < tE ? Math.sin((k / tE) * (Math.PI / 2)) * (E + 0.4 * PM) : (E + 0.4 * PM) - (E * 0.6) * (1 - Math.exp(-(k - tE) / 12) * Math.cos((k - tE) / 6));
  return { x: x0 - 60, y: base + est, ang: mixA(CAE, CUELGA, Math.min(1, k / 20)), floja: 0, frenada: k > 4 };
};

/** Escalador genérico. */
export const Esc: React.FC<{ p: { x: number; y: number; ang: Angulos }; a: Aspecto; cara?: Cara; quien?: "joe" | "simon" }> = ({ p, a, cara = "miedo", quien = "joe" }) => (
  <Escalador x={p.x} y={p.y} quien={quien} angulos={p.ang} cara={cara} aspecto={a} mira={1} />
);
