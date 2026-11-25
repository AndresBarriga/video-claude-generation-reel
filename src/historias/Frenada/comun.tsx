// E79 «Frenada según la pared» (Caer y asegurar 1/3). Hilo visual: LA MISMA CAÍDA de Irene en cuatro paredes de roca clara;
// lo único que cambia es cómo se mueve Dani (pasito, cuerda justa, pasos atrás) y dónde acaba ella. Contador 1/4 → 4/4.
import React from "react";
import { interpolate } from "remotion";
import { crearVia, PERFILES, Plano, sistemaCaida, POSE, type Via } from "../../piezas/kit";
import type { Aspecto } from "../../piezas/Rasgos";
export { Svg, golpe, type P } from "../Pegue/comun";
export { COL, F, pop, cl, c01, sale } from "../Miedo/comun";
export { Grande } from "../Miedo/Ui";
import { COL, F, pop, cl } from "../Miedo/comun";

/** Irene (escala): nueva en E79. Chaqueta azul, casco amarillo, melena oscura. Dani (asegura): menta, gorro mostaza, barba. */
export const IRENE: Aspecto = { chaqueta: "#3D7BE0", chaquetaSombra: "#2A5BAE", pantalon: "#2B2F3A", casco: "#FFC93C", pelo: "#24170F", peinado: "melena", piel: "#C98E66", pielSombra: "#A26C48", manos: "piel" } as Aspecto;
export const DANI: Aspecto = { chaqueta: "#3CC9B0", chaquetaSombra: "#279483", pantalon: "#33302C", casco: null, gorro: "#E8A33C", pelo: "#2A1E16", peinado: "corto", barba: "#2A1E16", piel: "#B97F57", pielSombra: "#94613E", manos: "piel" } as Aspecto;

const M = [2.4, 3.9, 5.4, 7, 8.6];
export const VD: Via = crearVia({ perfil: PERFILES.desplome, metros: M });
export const VV: Via = crearVia({ perfil: PERFILES.vertical, metros: M });
export const VP: Via = crearVia({ perfil: PERFILES.placa, metros: M });

/** Caída desde la cadera p0 con la chapa i. dina 1 = blanda (acompaña el tirón), 0 = seca. comba = cuerda fuera (m): NUNCA de más. */
export const caer = (via: Via, xa: number, k: number, p0: { x: number; y: number }, i: number, dina: number, comba: number) =>
  sistemaCaida(via, k, p0, POSE.agarre, { i, xAseg: xa, dina, comba, aire: POSE.caeBien });

export const Pared: React.FC<{ via: Via; cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = ({ via, cx, cy, z, sh = 0, children }) => (
  <Plano via={via} cx={cx} cy={cy} z={z} sh={sh} decorado="roca">{children}</Plano>
);

/** Repisa (mundo): bloque de roca que sale de la pared a la altura y. */
export const Repisa: React.FC<{ via: Via; y: number; aviso?: number }> = ({ via, y, aviso = 0 }) => {
  const x = via.xF(y) + 6;
  return (
    <g>
      <path d={`M${x} ${y - 4} L${x - 175} ${y + 6} Q${x - 196} ${y + 18} ${x - 180} ${y + 40} L${x - 120} ${y + 120} L${x} ${y + 150} Z`} fill="#B9AFA2" stroke={COL.tinta} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M${x - 172} ${y + 8} L${x} ${y + 2}`} stroke="#E4DCD0" strokeWidth={8} strokeLinecap="round" />
      {aviso > 0 && <path d={`M${x - 186} ${y - 6} L${x + 4} ${y - 14}`} stroke={COL.rojo} strokeWidth={14} strokeLinecap="round" opacity={0.35 + 0.65 * aviso} />}
    </g>
  );
};

/** Contador de paredes 1/4 → 4/4 (dentro del 3:4, sobre la zona de botones). */
export const Contador: React.FC<{ n: number; k: number }> = ({ n, k }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 1470, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: COL.crema, border: `7px solid ${COL.tinta}`, borderRadius: 40, padding: "8px 26px" }}>
        {[1, 2, 3, 4].map((i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 17, border: `5px solid ${COL.tinta}`, background: i < n ? COL.verde : i === n ? COL.amarillo : "#fff" }} />)}
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 56, color: COL.tinta, marginLeft: 8 }}>{n}/4</div>
      </div>
    </div>
  );
};
/** Polvo de magnesio que cae de las manos (mundo). */
export const Tiza: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>{Array.from({ length: 10 }).map((_, i) => { const t = ((f * 1.3 + i * 7) % 40) / 40; return <circle key={i} cx={x + Math.sin(i * 2.3 + t * 3) * 14 + (i % 3) * 6} cy={y + t * 170} r={7 - t * 4} fill="#fff" stroke="#D9D2C7" strokeWidth={1.5} opacity={1 - t} />; })}</g>
);
/** Paso de quien asegura: x0 → x1 entre los fotogramas a y b (con balanceo de pierna). */
export const pasoAseg = (f: number, a: number, b: number, x0: number, x1: number, pasos = 1) => {
  const t = interpolate(f, [a, b], [0, 1], cl);
  return { x: x0 + (x1 - x0) * (t * t * (3 - 2 * t)), paso: t * Math.PI * pasos };
};
