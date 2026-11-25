// E83 «La puerta» · común: pared clara de rocódromo, la vía (presas que cuadran con las poses de Fermín),
// la LÍNEA DE LA BISAGRA (hilo visual: roja abre, verde cierra), la barra GIRO (HUD) y rótulos.
import React from "react";
import { Easing, interpolate } from "remotion";
import { POSES_FERMIN, enEscena } from "../../piezas/Fermin";
import type { Pt } from "../../piezas/Novato";
import { fuenteTitulo, fuenteTexto } from "../../tema";
export { Svg, golpe, type P } from "../Pegue/comun";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const c01 = (v: number) => Math.max(0, Math.min(1, v));
export const sale = (k: number) => 1 - Math.pow(1 - c01(k), 3);
export const suave = (k: number) => { const t = c01(k); return t * t * (3 - 2 * t); };
/** Aparición con rebote (k en fotogramas). */
export const pop = (k: number) => (k <= 0 ? 0 : k >= 12 ? 1 : interpolate(k, [0, 7, 12], [0, 1.12, 1], { ...cl, easing: Easing.out(Easing.quad) }));
export const COL = { pared: "#ECE6DC", junta: "#D8D0C3", tornillo: "#C9C0B2", tinta: "#141B26", rojo: "#E2533F", verde: "#2FA866", ambar: "#E3A33B", amarillo: "#F2C230", gris: "#7E8AA0", cuerda: "#FF6A1F" };
export const T = COL.tinta;

/** Cadera de Fermín en la pose «puerta» y escala. La bandera sube y se desplaza: H2. */
export const S = 1.15;
export const H: Pt = { x: 610, y: 1240 };
export const H2: Pt = { x: H.x - 50 * S, y: H.y - 45 * S };
const W1 = enEscena(POSES_FERMIN.puerta, H.x, H.y, S);
/** Presas: MD mano derecha y PD pie derecho (la bisagra), OBJ la presa amarilla a la que no llega. */
export const MD = W1.manoD, PD = W1.pieD, OBJ = W1.manoI;
/** Extremos de la línea de la bisagra (prolongada un poco por arriba y por abajo). */
export const L1: Pt = { x: MD.x + (MD.x - PD.x) * 0.22, y: MD.y + (MD.y - PD.y) * 0.22 };
export const L2: Pt = { x: PD.x - (MD.x - PD.x) * 0.12, y: PD.y - (MD.y - PD.y) * 0.12 };
/** x de la línea a una altura y. */
export const xLinea = (y: number) => MD.x + (PD.x - MD.x) * ((y - MD.y) / (PD.y - MD.y));

export const PRESAS_VIA = [
  { p: MD, r: 34, c: COL.verde }, { p: { x: PD.x + 4, y: PD.y + 30 }, r: 30, c: COL.verde }, { p: { x: 470, y: 860 }, r: 28, c: COL.verde },
  { p: { x: 930, y: 1130 }, r: 24, c: COL.gris }, { p: { x: 160, y: 1330 }, r: 26, c: COL.gris }, { p: { x: 860, y: 1650 }, r: 22, c: COL.gris },
  { p: { x: 220, y: 560 }, r: 22, c: COL.gris }, { p: { x: 820, y: 520 }, r: 26, c: COL.verde }, { p: { x: 420, y: 1640 }, r: 24, c: COL.gris },
];
type Presa = { p: Pt; r: number; c: string; brillo?: number };

/** Pared clara de rocódromo (dentro de un <svg> de 1080×1920). Bordes ampliados para la cámara. */
export const Pared: React.FC<{ presas: Presa[] }> = ({ presas }) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill={COL.pared} />
    {[-1, 0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${i * 360 - 40} -300 L${i * 360 + 30} 2220`} stroke={COL.junta} strokeWidth={3} />)}
    {[-1, 0, 1, 2, 3, 4, 5, 6].map((i) => <path key={"h" + i} d={`M-300 ${i * 380 + 60} L1380 ${i * 380 + 14}`} stroke={COL.junta} strokeWidth={3} />)}
    {Array.from({ length: 17 * 26 }).map((_, i) => <circle key={"t" + i} cx={(i % 17) * 88 - 150 + ((Math.floor(i / 17) % 2) * 44)} cy={Math.floor(i / 17) * 92 - 200} r={4} fill={COL.tornillo} />)}
    {presas.map((h, i) => <g key={"p" + i}>
      {!!h.brillo && <circle cx={h.p.x} cy={h.p.y} r={h.r * 2.2} fill="#FFE3A0" opacity={0.65 * h.brillo} />}
      <ellipse cx={h.p.x + 6} cy={h.p.y + 8} rx={h.r} ry={h.r * 0.78} fill="#000" opacity={0.12} />
      <ellipse cx={h.p.x} cy={h.p.y} rx={h.r} ry={h.r * 0.78} fill={h.c} />
      <ellipse cx={h.p.x - h.r * 0.3} cy={h.p.y - h.r * 0.3} rx={h.r * 0.35} ry={h.r * 0.2} fill="#fff" opacity={0.3} />
    </g>)}
  </g>
);
/** Presa objetivo (amarilla, brilla). */
export const Objetivo: React.FC<{ f: number; brillo?: number }> = ({ f, brillo = 1 }) => (
  <g>
    <circle cx={OBJ.x} cy={OBJ.y} r={74 + 6 * Math.sin(f / 5)} fill="#FFE3A0" opacity={0.6 * brillo} />
    <ellipse cx={OBJ.x + 6} cy={OBJ.y + 8} rx={36} ry={28} fill="#000" opacity={0.12} />
    <ellipse cx={OBJ.x} cy={OBJ.y} rx={36} ry={28} fill={COL.amarillo} />
    <ellipse cx={OBJ.x - 11} cy={OBJ.y - 9} rx={12} ry={6} fill="#fff" opacity={0.4} />
  </g>
);

/** Línea de la bisagra: se dibuja con `k` 0–1; color de rojo a verde con `verde` 0–1. */
export const Linea: React.FC<{ k: number; verde?: number; pulso?: number }> = ({ k, verde = 0, pulso = 0 }) => {
  const e = sale(k);
  if (e <= 0) return null;
  const fin = { x: L1.x + (L2.x - L1.x) * e, y: L1.y + (L2.y - L1.y) * e };
  return <path d={`M${L1.x} ${L1.y} L${fin.x} ${fin.y}`} stroke={interpolateCol(verde)} strokeWidth={9 + 5 * pulso} strokeDasharray="26 16" strokeLinecap="round" opacity={0.95} />;
};
const interpolateCol = (v: number) => (v <= 0 ? COL.rojo : v >= 1 ? COL.verde : mezcla(COL.rojo, COL.verde, v));
const mezcla = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return "#" + A.map((x, i) => Math.round(x + (B[i] - x) * t).toString(16).padStart(2, "0")).join("");
};
export { mezcla };

/** Anillo que señala un apoyo (mano o pie). */
export const Anillo: React.FC<{ p: Pt; k: number; col?: string }> = ({ p, k, col = COL.rojo }) => {
  const e = pop(k);
  return e <= 0 ? null : <circle cx={p.x} cy={p.y} r={56 * e} fill="none" stroke={col} strokeWidth={9} />;
};
/** Flecha curva (giro). `sentido` 1 = abre hacia la izquierda y fuera; -1 = contragiro. */
export const FlechaGiro: React.FC<{ x: number; y: number; k: number; col?: string; s?: number; espejo?: boolean }> = ({ x, y, k, col = COL.rojo, s = 1, espejo }) => {
  const e = sale(k);
  if (e <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${(espejo ? -1 : 1) * s} ${s})`} opacity={e}>
      <path d="M60 -110 Q-90 -40 -40 110" stroke={col} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - e)} />
      {e > 0.85 && <path d="M-74 84 L-40 118 L-6 80" stroke={col} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
};

/** Barra GIRO vertical a la izquierda (HUD, sin cifra). */
export const BarraGiro: React.FC<{ v: number; o?: number }> = ({ v, o = 1 }) => {
  const col = v > 0.66 ? COL.rojo : v > 0.33 ? COL.ambar : COL.verde, alto = 430, y0 = 1180;
  return (
    <g opacity={o}>
      <text x={78} y={y0 - alto - 22} textAnchor="middle" fontFamily={fuenteTexto} fontWeight={700} fontSize={28} letterSpacing={3} fill={T}>GIRO</text>
      <rect x={58} y={y0 - alto} width={40} height={alto} rx={20} fill="#2A3140" />
      <rect x={58} y={y0 - alto * c01(v)} width={40} height={alto * c01(v)} rx={20} fill={col} />
    </g>
  );
};

/** Titular grande del gancho (HTML), bajo los subtítulos. */
export const Titular: React.FC<{ l1: string; l2: string; k2: number; top?: number }> = ({ l1, l2, k2, top = 450 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 86, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `14px ${T}`, paintOrder: "stroke" }}>
    <div>{l1}</div>
    <div style={{ display: "inline-block", marginTop: 10, padding: "0 22px", background: COL.rojo, borderRadius: 14, WebkitTextStroke: "0", color: "#fff", transform: `scale(${0.92 + 0.08 * pop(k2)})` }}>{l2}</div>
  </div>
);
/** Etiqueta en versalitas (HTML) con aparición. */
export const Etiqueta: React.FC<{ x: number; y: number; t: string; k: number; c?: string; tam?: number }> = ({ x, y, t, k, c = T, tam = 34 }) => {
  const e = pop(k);
  return e <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e})`, fontFamily: fuenteTexto, fontWeight: 700, fontSize: tam, letterSpacing: 3, color: "#fff", background: c, padding: "6px 18px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(0,0,0,.15)" }}>{t}</div>;
};
/** Polvo de magnesio al apoyar. k = fotogramas desde el contacto. */
export const Polvo: React.FC<{ p: Pt; k: number }> = ({ p, k }) => k < 0 || k > 22 ? null : (
  <g opacity={1 - k / 22}>{[-1, -0.4, 0.3, 1].map((a, i) => <circle key={i} cx={p.x + a * (16 + k * 3)} cy={p.y - 6 - k * 1.2 * (1 + (i % 2))} r={10 + k * 0.8} fill="#fff" />)}</g>
);
/** Cámara: empuje suave alrededor de (cx, cy). */
export const Cam: React.FC<{ z: number; cx?: number; cy?: number; children: React.ReactNode }> = ({ z, cx = 540, cy = 1100, children }) => (
  <g transform={`translate(${cx} ${cy}) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>
);
