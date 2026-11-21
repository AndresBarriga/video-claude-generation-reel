// E72 «¿Miedo a caer? Se quita cayendo». Estilo propio (no el de E59/E64/E69): rocódromo CLARO y de colores, personaje nuevo (Lola, coral),
// un MEDIDOR DE MIEDO que recorre el vídeo y una capa de iconos/✓ encima de la animación que cambia cada ~1 s.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { crearVia, PERFILES, Plano, Expres, sistemaCaida, POSE, type Via } from "../../piezas/kit";
import type { Aspecto } from "../../piezas/Rasgos";
export { Svg, golpe, type P } from "../Pegue/comun";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const c01 = (v: number) => Math.max(0, Math.min(1, v));
export const sale = (k: number) => 1 - Math.pow(1 - c01(k), 3);
/** Aparición con rebote (0 → 1, pasa de 1 un poco). */
export const pop = (k: number) => (k <= 0 ? 0 : k >= 12 ? 1 : interpolate(k, [0, 7, 12], [0, 1.12, 1], { ...cl, easing: Easing.out(Easing.quad) }));
export const F = "Bricolage Grotesque";
export const COL = { rojo: "#F04E4E", verde: "#2FB36B", naranja: "#FF9F2E", azul: "#3D7BE0", tinta: "#14213A", crema: "#FFF8EE", amarillo: "#FFC93C", rosa: "#FF6F91", menta: "#3CC9B0", lila: "#9B7BEA" };

export const VIA: Via = crearVia({ perfil: PERFILES.panel, metros: [2.2, 3.6, 5, 6.4, 7.8, 9.2] });
export const XA = 250;
/** Lola: personaje nuevo de este vídeo (coral, coleta rubia, sin casco: rocódromo). */
export const LOLA: Aspecto = { chaqueta: "#FF6B5B", chaquetaSombra: "#D04A3E", pantalon: "#24324F", casco: null, pelo: "#E2B04A", peinado: "coleta", piel: "#EDBE97", pielSombra: "#CC9A74", manos: "piel" } as Aspecto;
export const LEO: Aspecto = { chaqueta: "#3CC9B0", chaquetaSombra: "#279483", pantalon: "#33302C", casco: null, gorro: "#FFC93C", pelo: "#2A1E16", peinado: "corto", barba: "#2A1E16", piel: "#B97F57", pielSombra: "#94613E", manos: "piel" } as Aspecto;

const HOLDS = [COL.rosa, COL.amarillo, COL.menta, COL.lila, COL.azul, COL.naranja];
/** Fondo claro: nave luminosa con ventanales y banderines. */
export const FondoClaro: React.FC = () => (
  <g>
    <defs><linearGradient id="mi-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE6FF" /><stop offset="1" stopColor="#FDF3E3" /></linearGradient></defs>
    <rect x={-400} y={-600} width={1900} height={3600} fill="url(#mi-cielo)" />
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={-260 + i * 260} y={-200} width={200} height={900} rx={12} fill="#FFFFFF" opacity={0.75} /><path d={`M${-160 + i * 260} -200 v900 M${-260 + i * 260} 250 h200`} stroke="#BFD6EE" strokeWidth={10} /></g>)}
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-300 + i * 120} 820 l60 0 l-30 60 Z`} fill={HOLDS[i % 6]} />)}
    <path d="M-300 820 H800" stroke="#9AB0C8" strokeWidth={5} />
    <path d="M-400 1150 L700 1100 L700 3000 L-400 3000 Z" fill="#E9E2D6" />
    {Array.from({ length: 36 }).map((_, i) => <circle key={i} cx={-380 + random(`fc${i}`) * 1080} cy={1180 + random(`fd${i}`) * 1100} r={10 + random(`fe${i}`) * 10} fill={HOLDS[i % 6]} opacity={0.55} />)}
  </g>
);
/** Muro principal claro con volúmenes y presas de colores; colchoneta azul. */
export const MuroClaro: React.FC<{ via: Via; cintas?: boolean; libre?: number }> = ({ via, cintas = true, libre = 0 }) => {
  const xF = via.xF, ys = Array.from({ length: 70 }, (_, i) => -600 + i * 52), cara = ys.map((y) => `${xF(y)} ${y}`).join(" L");
  return (
    <g>
      <path d={`M${cara} L1700 3300 L1700 -600 Z`} fill="#FFFDF8" />
      {[[-200, 520, COL.menta], [300, 380, COL.amarillo], [900, 600, COL.lila], [1500, 420, COL.rosa], [2100, 520, COL.azul]].map(([y, w, c], i) => <path key={i} d={`M${xF(+y) + 60} ${y} l${w} -140 l60 ${(w as number) * 0.6} Z`} fill={c as string} opacity={0.85} />)}
      {Array.from({ length: 14 }).map((_, i) => { const y = -500 + i * 244; return <path key={i} d={`M${xF(y)} ${y} H1700`} stroke="#E7DFD2" strokeWidth={5} />; })}
      {Array.from({ length: 60 }).map((_, i) => { const y = -500 + random(`my${i}`) * 3000, x = xF(y) + 160 + random(`mx${i}`) * 700, r = 18 + random(`mr${i}`) * 26; return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.62} fill={HOLDS[i % 6]} stroke={COL.tinta} strokeWidth={4} transform={`rotate(${random(`mt${i}`) * 180} ${x} ${y})`} opacity={0.85} />; })}
      {Array.from({ length: 34 }).map((_, i) => { const y = via.suelo - 150 - i * 84 - (i % 3) * 10, x = xF(y) + 36 + (i % 2) * 14; return <ellipse key={i} cx={x} cy={y} rx={24} ry={13} fill={COL.rosa} stroke={COL.tinta} strokeWidth={4} />; })}
      <path d={`M${cara}`} stroke={COL.tinta} strokeWidth={5} fill="none" opacity={0.5} />
      <path d={`M-500 ${via.suelo} H1700 V3600 H-500 Z`} fill="#2F6FD6" />
      <path d={`M-500 ${via.suelo} H1700`} stroke="#6FA0F0" strokeWidth={14} />
      {libre > 0 && <g opacity={libre}><rect x={-60} y={via.suelo - 20} width={xF(via.suelo) + 40} height={120} rx={20} fill={COL.verde} opacity={0.35} /><text x={xF(via.suelo) / 2} y={via.suelo + 80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={64} fill="#fff" stroke={COL.tinta} strokeWidth={10} paintOrder="stroke">✓ LIBRE</text></g>}
      {cintas && via.chapas.map((y, i) => <Expres key={i} x={xF(y)} y={y} color={COL.tinta} />)}
    </g>
  );
};
export const Gym: React.FC<{ cx: number; cy: number; z: number; sh?: number; libre?: number; children: React.ReactNode }> = ({ cx, cy, z, sh = 0, libre = 0, children }) => (
  <Plano via={VIA} cx={cx} cy={cy} z={z} sh={sh} cintas={false} fondo={<FondoClaro />} mundo={<MuroClaro via={VIA} libre={libre} />}>{children}</Plano>
);
/** Caída buena (dinámica) desde la cadera p0 con la chapa i: estado del sistema a k fotogramas. */
export const caer = (k: number, p0: { x: number; y: number }, i: number, comba = 0.4) => sistemaCaida(VIA, k, p0, POSE.agarre, { i, xAseg: XA, dina: 1, aire: POSE.caeBien, comba });
