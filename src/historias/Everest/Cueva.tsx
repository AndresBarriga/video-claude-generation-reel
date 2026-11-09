// 5–6 · Corte en espejo: la misma arista, de noche; en la cueva de roca, otro hombre sentado igual. Sigue vivo (vaho).
// En «frontales», pasan escaladores: uno sin mirar, otro lo enfoca y sigue, otro se agacha a intentar ayudarle y se va. El vaho se apaga.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Etiqueta, Nieve, SHARP, Svg, Zoom, sube, type P } from "./comun";
import { Arista, ruta } from "./Arista";
import { CABEZA, CADERA, Hueco, Sentado, Vaho } from "./Piezas";

const suelo = (x: number) => CADERA.y - 0.16 * (x - CADERA.x);
const ROPA = [{ chaqueta: "#2F6FB0", chaquetaSombra: "#1F4E80" }, { chaqueta: "#3B8F5A", chaquetaSombra: "#28653F" }, { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F" }, { chaqueta: "#E6C030", chaquetaSombra: "#A88A1C" }];
export const EscenaSharp: React.FC<{ f: number; alza: number; vivo: number; oscuro?: number; children?: React.ReactNode }> = ({ f, alza, vivo, oscuro = 0, children }) => (
  <>
    <Zoom s={1.0} cx={CADERA.x + 20} cy={CADERA.y - 120} tx={540} ty={1000}>
      <Arista luz={0} f={f} cueva />
      {children}
      <Sentado aspecto={SHARP} cabeza={34 - 24 * alza} cara={alza > 0.5 ? "normal" : "cerrados"} />
      <Vaho f={f} x={CABEZA.x - 30} y={CABEZA.y + 30} on={vivo} />
      <Nieve f={f} n={40} op={0.6} />
    </Zoom>
    <Hueco x={430} y={880} r={1000 - 640 * oscuro} id={`sh${Math.round(oscuro * 10)}`} base={0.7 + 0.3 * oscuro} />
  </>
);

export const Cueva: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tV = (pal("vivo") ?? Math.round(d * 0.8)) - 4;
  return (
    <Camara d={d} empuje={0.06} entrada={false}>
      <Svg><EscenaSharp f={f} alza={sube(f, tV, tV + 12)} vivo={f >= tV ? 1 : 0.4} /></Svg>
      <Etiqueta texto={f < tV ? "11 DÍAS ANTES" : "SEGUÍA VIVO"} top={230} tam={110} desde={f < tV ? 2 : tV} />
    </Camara>
  );
};

const pasos = (f: number, k = 0) => ({ piernaA: [Math.sin(f / 3 + k) * 20, Math.max(0, Math.sin(f / 3 + k)) * 18] as [number, number], piernaB: [-Math.sin(f / 3 + k) * 20, Math.max(0, -Math.sin(f / 3 + k)) * 18] as [number, number], brazoA: [-Math.sin(f / 3 + k) * 18, 10] as [number, number], brazoB: [Math.sin(f / 3 + k) * 18, 10] as [number, number] });
const ASP = (i: number) => ({ ...ROPA[i % 4], pantalon: "#1E2633", casco: null, gorro: "#1E2633", manos: "guante" as const });
const S = 1.7; // por la ruta, un poco más lejos que Sharp

/** Escalador que pasa por la ruta (encima de la cueva) de derecha a izquierda. «para»: se detiene y le enfoca con el frontal. */
const Pasa: React.FC<{ f: number; t0: number; t1: number; i: number; para?: [number, number] }> = ({ f, t0, t1, i, para }) => {
  if (f < t0 || f > t1) return null;
  const x = para ? interpolate(f, [t0, para[0], para[1], t1], [1250, CADERA.x + 120, CADERA.x + 120, -200], { extrapolateRight: "clamp" }) : interpolate(f, [t0, t1], [1250, -200]);
  const quieto = !!para && f >= para[0] && f <= para[1];
  const mira = quieto ? sube(f, para![0], para![0] + 8) * 46 : -4;
  return <Escalador x={x} y={ruta(x) - 130 * S} quien={i % 2 ? "simon" : "joe"} aspecto={ASP(i)} s={S} pose="pie" cara="serio" frontal mira={-1}
    angulos={quieto ? { cabeza: mira, torso: mira * 0.3 } : { cabeza: -4, ...pasos(f, i) }} />;
};

/** El que baja a su repisa, se arrodilla a su lado e intenta ayudarle; al final se levanta y se va. */
const Ayuda: React.FC<{ f: number; t0: number; tK: number; tF: number; d: number }> = ({ f, t0, tK, tF, d }) => {
  if (f < t0) return null;
  const X = CADERA.x + 330;
  const x = f < tK ? interpolate(f, [t0, tK], [1260, X]) : f < tF ? X : interpolate(f, [tF, d], [X, X + 500]);
  const agacha = f >= tK && f < tF, vuelve = f >= tF;
  const yS = suelo(x);
  return <Escalador x={x} y={agacha ? yS - 62 * 2.4 : yS - 130 * 2.4} quien="joe" aspecto={{ ...ASP(0), chaqueta: "#E9892A", chaquetaSombra: "#A85E17", gorro: "#E8EEF4" }} s={2.4} pose={agacha ? "agachado" : "pie"} cara="serio" frontal mira={vuelve ? 1 : -1}
    angulos={agacha ? { torso: 30, cabeza: 20, brazoA: [84, 70] } : { cabeza: vuelve ? 8 : 4, ...pasos(f, 2) }} />;
};

export const Frontales: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t1 = (pal("unos") ?? Math.round(d * 0.2)) - 2, t2 = (pal("otros") ?? Math.round(d * 0.4)) - 2, t3 = (pal("algunos") ?? Math.round(d * 0.6)) - 2, t4 = (pal("sin") ?? Math.round(d * 0.85)) - 2;
  // «decenas»: una fila de frontales que sube por la ruta hacia la cumbre
  const fila = Array.from({ length: 16 }).map((_, k) => { const u = ((k / 16 + f / 400) % 1), x = 1300 - u * 520, y = ruta(Math.min(x, 1300)) - u * 560 - 20; const r = 1 - u * 0.5;
    return <g key={k} opacity={0.4 + 0.6 * (1 - u)}><circle cx={x} cy={y} r={34 * r} fill="#FFF3C4" opacity={0.22} /><circle cx={x} cy={y} r={9 * r} fill="#FFF8DD" /><rect x={x - 7 * r} y={y + 8 * r} width={14 * r} height={44 * r} rx={6} fill="#0B0F17" /></g>; });
  return (
    <Camara d={d} empuje={0.04} entrada={false}>
      <Svg>
        <EscenaSharp f={f} alza={0.3} vivo={1 - sube(f, t4 + 10, d)} oscuro={sube(f, t4, d) * 0.6}>
          <g opacity={f < t2 ? 1 : 0.5}>{fila}</g>
          <Pasa f={f} t0={t1 - 8} t1={t1 + 70} i={0} />
          <Pasa f={f} t0={t1 + 14} t1={t2 + 70} i={3} />
          <Pasa f={f} t0={t2 - 14} t1={t3 + 30} i={1} para={[t2 + 4, t2 + 30]} />
          <Ayuda f={f} t0={t3 - 14} tK={t3 + 6} tF={t4 + 22} d={d} />
        </EscenaSharp>
      </Svg>
      {f < t1 && <Etiqueta texto="PASARON DECENAS" top={230} tam={100} desde={2} />}
    </Camara>
  );
};
