// E3 «Escalador → Español»: cada chiste es el mismo plano dos veces. Lo que dice (versión que cuenta él) → corte seco en la palabra → lo que significa.
// La píldora de arriba cambia de ESCALADOR a ESPAÑOL en el corte: el formato se entiende sin audio.
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Escalador, type PropsEscalador } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { fuenteTexto } from "../../tema";
import { PresaPie, trepa } from "../Bloque/comun";
import { C, Zoom, clamp, type P } from "../Pegue/comun";
export { Cuerda } from "../Pegue/comun";
export { AG, Fondo, PAD, Planos, SUELO, TOP, colgado, dePie, sentado, trepa } from "../Bloque/comun";
export { C, Camara, Etiqueta, Svg, Zoom, clamp, golpe, type P } from "../Pegue/comun";

// Reparto nuevo (ni Joe/Simon ni el de E6)
export const LUCIA: Aspecto = { chaqueta: "#2F4A7A", chaquetaSombra: "#1F3355", pantalon: "#3B3F4A", piel: "#A86E4A", pielSombra: "#86543A", casco: null, pelo: "#17100C", peinado: "trenzas", arnes: false, manos: "piel" };
export const PACO: Aspecto = { chaqueta: "#C9962E", chaquetaSombra: "#8F6A1E", pantalon: "#2B3442", piel: "#EBC2A0", pielSombra: "#CF9F7C", casco: null, pelo: "#D6D3CE", peinado: "rapado", barba: "#C9C6C0", arnes: false, manos: "piel" };
export const NICO: Aspecto = { chaqueta: "#7A2E3A", chaquetaSombra: "#55202A", pantalon: "#3A4656", piel: "#F3D2B8", pielSombra: "#DDAE8E", casco: null, pelo: "#9A4A26", peinado: "corto", gafas: true, arnes: false, manos: "piel" };

type PP = Omit<PropsEscalador, "quien" | "aspecto">;
const S0 = 1.2;
export const Lucia: React.FC<PP> = (p) => <Escalador quien="joe" aspecto={LUCIA} s={S0} {...p} />;
export const Paco: React.FC<PP> = (p) => <Escalador quien="joe" aspecto={PACO} s={1.25} {...p} />;
export const Nico: React.FC<PP> = (p) => <Escalador quien="simon" aspecto={NICO} s={S0} {...p} />;

/** Lucía colgada con los pies en la pared (cadera en hx, hy). */
export const LuciaColgada: React.FC<{ hx: number; hy: number; cara?: PropsEscalador["cara"]; tiembla?: number; cabeza?: number }> = ({ hx, hy, cara = "normal", tiembla = 0, cabeza = -26 }) => {
  const t = trepa(hx, hy);
  return <>{t.pies.map((p, i) => <PresaPie key={i} x={p.x} y={p.y + 8} />)}<Lucia x={hx + tiembla} y={hy} pose="escalando" cara={cara} angulos={{ ...t.angulos, cabeza }} /></>;
};

/** Fotograma (relativo a la escena) del corte: la palabra `e.corte`, o el 45 % si no hay voz que la ancle. */
export const fCorte = ({ e, d, pal }: P) => pal(String((e as { corte?: string }).corte ?? "")) ?? Math.round(d * 0.45);

/** Píldora de idioma arriba. */
export const Idioma: React.FC<{ real: boolean }> = ({ real }) => (
  <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 42, letterSpacing: 4, color: real ? C.tinta : C.blanco,
      background: real ? C.cuerda : "rgba(5,11,20,.72)", borderRadius: 40, padding: "8px 32px" }}>{real ? "ESPAÑOL" : "ESCALADOR"}</div>
  </div>
);

/** Destello corto en el corte. */
const Destello: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 4], [0.55, 0], clamp) }} />;
};

/** Escena partida: `dice` hasta el corte, `significa` después (cada una recibe su duración). */
export const Partida: React.FC<{ p: P; dice: (d: number) => React.ReactNode; significa: (d: number) => React.ReactNode; pildora?: boolean }> = ({ p, dice, significa, pildora = false }) => {
  const c = Math.max(1, Math.min(p.d - 1, fCorte(p))), d2 = p.d - c;
  return (<>
    <Sequence durationInFrames={c}>{dice(c)}{pildora && <Idioma real={false} />}</Sequence>
    <Sequence from={c} durationInFrames={d2}>{significa(d2)}{pildora && <Idioma real />}<Destello /></Sequence>
  </>);
};

/** Píldora de dato (REPETICIÓN, 40 MIN…). */
export const Dato: React.FC<{ texto: string; top?: number; rojo?: boolean }> = ({ texto, top = 320, rojo }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: interpolate(f, [0, 4], [0, 1], clamp) }}>
      <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 52, color: "#fff", background: rojo ? "#C9384A" : "rgba(5,11,20,.78)", borderRadius: 14, padding: "6px 26px", letterSpacing: 3, fontVariantNumeric: "tabular-nums" }}>{texto}</div>
    </div>
  );
};

/** Primer plano de una cara: acerca (cx, cy) ×s y lo coloca un poco por encima del centro. */
export const Cerca: React.FC<{ cx: number; cy: number; s?: number; children: React.ReactNode }> = ({ cx, cy, s = 4, children }) => (
  <Zoom s={s} cx={cx} cy={cy} tx={540} ty={860}>{children}</Zoom>
);
/** Centro de la cabeza para la cadera (x, y) en poses erguidas. */
export const cabezaDe = (x: number, y: number, s = 1.2) => ({ cx: x + 4 * s, cy: y - 140 * s });
