// Escenario nuevo: gran placa de granito (pared a la derecha, tumbada: arriba queda más a la derecha) sobre un valle con lago y macizo ancho.
// La hora avanza con el vídeo: h 0 = mañana fría · 0.6 = tarde dorada · 1 = anochecer azul. Escala: 170 px = 1 m.
import React from "react";
import { interpolateColors, random } from "remotion";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { C, Cuerda, T, brazo, pierna } from "./comun";

export const SUELO_P = 2650, REP_Y = -700; // base de la pared · repisa de la reunión (vía larga)
export const xP = (y: number) => 430 + (SUELO_P - y) * 0.13 + 14 * Math.sin(y / 173) + 7 * Math.sin(y / 41);
export const CHAPAS_P = Array.from({ length: 15 }, (_, i) => 2330 - i * 330);
const HK = [0, 0.6, 1];
export const luz = (h: number) => {
  const c = (cs: string[]) => interpolateColors(h, HK, cs);
  return { cieloA: c(["#3B7AB6", "#4F86BC", "#132746"]), cieloB: c(["#D3E8F4", "#F7CB8C", "#D38C68"]), lejos: c(["#8FAAC4", "#B99C90", "#2E4464"]), nieve: c(["#F2F7FB", "#FBE3C4", "#8FA6C4"]),
    medio: c(["#5F8098", "#7C7168", "#1F3248"]), bosque: c(["#3A5A46", "#4D4C36", "#15232C"]), lago: c(["#A9D0E6", "#F2C58E", "#6D8FB4"]),
    roca: c(["#A3ACB7", "#C2AE9B", "#5A6680"]), rocaS: c(["#7F8995", "#9C8978", "#3C4660"]), rocaL: c(["#C9D1DA", "#EBD3B4", "#8493B0"]), suelo: c(["#55604C", "#5C5340", "#1C2630"]) };
};

/** Cielo, macizo ancho con varias cimas, cresta de bosque y lago. Paralaje: se mueve menos que la pared. */
export const FondoP: React.FC<{ h: number; cx: number; cy: number; z: number }> = ({ h, cx, cy, z }) => {
  const L = luz(h), px = (cx - 500) * 0.12, py = (cy - 900) * 0.07, s = 1 + (z - 1) * 0.15, sol = 520 + h * 760;
  return (
    <g>
      <defs><linearGradient id="pl-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={L.cieloA} /><stop offset="0.75" stopColor={L.cieloB} /></linearGradient>
        <radialGradient id="pl-sol"><stop offset="0" stopColor="#FFE9B8" stopOpacity="0.9" /><stop offset="1" stopColor="#FFE9B8" stopOpacity="0" /></radialGradient></defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#pl-cielo)" />
      <g transform={`translate(540 960) scale(${s}) translate(${-540 - px} ${-960 - py})`}>
        <circle cx={230} cy={sol} r={330} fill="url(#pl-sol)" opacity={h > 0.9 ? 0.25 : 0.7} />{h < 0.9 && <circle cx={230} cy={sol} r={62} fill={h > 0.4 ? "#FFC27A" : "#FFF6DC"} />}
        {[[150, 420, 150], [640, 330, 190], [420, 560, 120]].map(([x, y, w], i) => <g key={i} opacity={0.5 - h * 0.2}><ellipse cx={x} cy={y} rx={w} ry={26} fill="#fff" /><ellipse cx={x + w * 0.4} cy={y - 18} rx={w * 0.5} ry={24} fill="#fff" /></g>)}
        <path d="M-300 1260 L-120 1040 L-40 1110 L90 900 L170 990 L260 840 L350 960 L440 880 L560 1050 L680 960 L800 1100 L1000 1000 L1300 1200 L1300 2300 L-300 2300 Z" fill={L.lejos} />
        <path d="M90 900 L122 950 L96 968 L70 944 Z M260 840 L300 900 L262 930 L236 892 Z M440 880 L470 930 L436 944 L418 916 Z" fill={L.nieve} opacity={0.85} />
        <path d="M-300 1380 Q-60 1270 160 1340 T560 1330 T1300 1400 L1300 2300 L-300 2300 Z" fill={L.medio} />
        <path d="M-300 1520 Q60 1460 330 1510 T1300 1520 L1300 2300 L-300 2300 Z" fill={L.bosque} />
        {Array.from({ length: 46 }).map((_, i) => { const x = -280 + i * 34 + random(`pb${i}`) * 20, y = 1492 + Math.sin(i * 1.7) * 14 + random(`py${i}`) * 16, t = 30 + random(`pt${i}`) * 30; return <path key={i} d={`M${x} ${y - t} L${x + 13} ${y + 6} L${x - 13} ${y + 6} Z`} fill={L.bosque} />; })}
        <path d="M-200 1640 Q120 1600 420 1650 Q500 1690 300 1720 Q0 1740 -200 1700 Z" fill={L.lago} opacity={0.9} /><path d="M-80 1668 H180 M40 1694 H300" stroke="#fff" strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
};

const Chapa: React.FC<{ y: number; cinta?: boolean }> = ({ y, cinta }) => { const x = xP(y); return (
  <g><circle cx={x + 5} cy={y} r={11} fill="#C3CBD3" stroke={T} strokeWidth={4} /><circle cx={x + 6} cy={y - 2} r={3.5} fill={T} />
    {cinta && <><path d={`M${x + 1} ${y + 7} L${x - 5} ${y + 40}`} stroke="#3D7FD0" strokeWidth={11} strokeLinecap="round" /><ellipse cx={x - 7} cy={y + 47} rx={9} ry={15} fill="none" stroke="#D3DAE0" strokeWidth={5} /></>}</g>); };

/** La pared. `cintas` = hasta qué y hay cintas exprés puestas (las chapas por encima están vacías). `repisa` = dibuja la reunión. */
export const Placa: React.FC<{ h: number; cintas?: number; repisa?: boolean; suelo?: boolean }> = ({ h, cintas = 99999, repisa, suelo = true }) => {
  const L = luz(h), ys = Array.from({ length: 104 }, (_, i) => -3400 + i * 60), cara = ys.map((y) => `${xP(y)} ${y}`).join(" L");
  return (
    <g>
      <defs><linearGradient id="pl-roca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={L.rocaL} /><stop offset="0.12" stopColor={L.roca} /><stop offset="1" stopColor={L.rocaS} /></linearGradient></defs>
      <path d={`M${cara} L2600 ${SUELO_P + 500} L2600 -3400 Z`} fill="url(#pl-roca)" />
      {/* chorreras negras de agua, diques y fisuras */}
      {Array.from({ length: 22 }).map((_, i) => { const y = -3000 + i * 270 + random(`ch${i}`) * 120, x = xP(y) + 60 + random(`cx${i}`) * 520, l = 300 + random(`cl${i}`) * 500, w = 14 + random(`cw${i}`) * 30; return <path key={i} d={`M${x} ${y} q${-10 - w * 0.4} ${l * 0.5} ${-l * 0.13} ${l}`} stroke="#1E252E" strokeWidth={w} strokeLinecap="round" fill="none" opacity={0.16} />; })}
      {Array.from({ length: 12 }).map((_, i) => { const y = -3100 + i * 500 + random(`dq${i}`) * 200; return <path key={i} d={`M${xP(y) + 4} ${y} q300 ${-50 - random(`dw${i}`) * 60} 700 ${10 + random(`de${i}`) * 80} t700 -30`} stroke={L.rocaL} strokeWidth={8 + random(`ds${i}`) * 8} fill="none" opacity={0.5} />; })}
      {Array.from({ length: 26 }).map((_, i) => { const y = -3200 + i * 230 + random(`fy${i}`) * 100, x = xP(y) + 30 + random(`fx${i}`) * 600; return <path key={i} d={`M${x} ${y} l${20 + random(`fa${i}`) * 50} ${50 + random(`fb${i}`) * 90} l${-16} ${40 + random(`fc${i}`) * 60}`} stroke="#2A323D" strokeWidth={4} fill="none" opacity={0.45} strokeLinejoin="round" />; })}
      {/* cantos pequeños y cristales */}
      {Array.from({ length: 120 }).map((_, i) => { const y = -3300 + random(`ky${i}`) * 6000, x = xP(y) + 14 + random(`kx${i}`) * 420, w = 10 + random(`kw${i}`) * 22; return <g key={i}><path d={`M${x} ${y} h${w}`} stroke={L.rocaL} strokeWidth={4} strokeLinecap="round" opacity={0.8} /><path d={`M${x} ${y + 5} h${w}`} stroke="#2A323D" strokeWidth={4} strokeLinecap="round" opacity={0.3} /></g>; })}
      {Array.from({ length: 8 }).map((_, i) => { const y = -2600 + i * 640 + random(`ly${i}`) * 200, x = xP(y) + 120 + random(`lx${i}`) * 380; return <ellipse key={i} cx={x} cy={y} rx={50 + random(`lr${i}`) * 40} ry={26} fill="#B8B36A" opacity={0.13} />; })}
      <path d={`M${cara}`} stroke={L.rocaL} strokeWidth={12} fill="none" opacity={0.8} /><path d={`M${cara}`} stroke={T} strokeWidth={4} fill="none" opacity={0.65} />
      {CHAPAS_P.map((y, i) => <Chapa key={i} y={y} cinta={y >= cintas} />)}
      {repisa && <g>
        <path d={`M${xP(REP_Y) - 380} ${REP_Y + 4} Q${xP(REP_Y) - 200} ${REP_Y - 14} ${xP(REP_Y) + 30} ${REP_Y - 4} L${xP(REP_Y + 150) + 30} ${REP_Y + 150} Q${xP(REP_Y) - 150} ${REP_Y + 120} ${xP(REP_Y) - 350} ${REP_Y + 52} Z`} fill={L.rocaS} stroke={T} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${xP(REP_Y) - 380} ${REP_Y + 4} Q${xP(REP_Y) - 200} ${REP_Y - 14} ${xP(REP_Y) + 30} ${REP_Y - 4} L${xP(REP_Y) + 30} ${REP_Y + 30} Q${xP(REP_Y) - 200} ${REP_Y + 22} ${xP(REP_Y) - 368} ${REP_Y + 34} Z`} fill={L.roca} />
        <path d={`M${xP(REP_Y) - 374} ${REP_Y + 6} Q${xP(REP_Y) - 200} ${REP_Y - 12} ${xP(REP_Y) + 20} ${REP_Y - 2}`} stroke={L.rocaL} strokeWidth={9} fill="none" strokeLinecap="round" />
        {[0, 1].map((i) => <g key={i}><circle cx={xP(REP_Y - 250) + 14 + i * 46} cy={REP_Y - 250 - i * 8} r={12} fill="#C3CBD3" stroke={T} strokeWidth={4} /></g>)}
        <path d={`M${xP(REP_Y - 250) + 14} ${REP_Y - 240} L${xP(REP_Y - 250) + 34} ${REP_Y - 196} L${xP(REP_Y - 250) + 60} ${REP_Y - 248}`} stroke="#9AA6B2" strokeWidth={6} fill="none" strokeLinejoin="round" />
        <circle cx={xP(REP_Y - 250) + 34} cy={REP_Y - 188} r={11} fill="none" stroke="#D3DAE0" strokeWidth={6} />
      </g>}
      {suelo && <g>
        <path d={`M-900 ${SUELO_P + 10} Q0 ${SUELO_P - 26} ${xP(SUELO_P) + 40} ${SUELO_P} L2600 ${SUELO_P} L2600 3600 L-900 3600 Z`} fill={L.suelo} />
        {[[-260, 30, 150], [820, 4, 130], [1010, 20, 90]].map(([x, dy, r], i) => <path key={i} d={`M${x - r} ${SUELO_P + dy} Q${x - r * 0.7} ${SUELO_P + dy - r * 0.9} ${x} ${SUELO_P + dy - r * 0.8} Q${x + r * 0.9} ${SUELO_P + dy - r * 0.7} ${x + r} ${SUELO_P + dy} Z`} fill={L.rocaS} stroke={T} strokeWidth={4} />)}
        {[-420, -330, -150, 40].map((x, i) => <g key={i}><rect x={x - 7} y={SUELO_P - 150 - i * 12} width={14} height={160} fill="#2A2420" /><path d={`M${x} ${SUELO_P - 420 - i * 30} L${x + 80} ${SUELO_P - 110} L${x - 80} ${SUELO_P - 110} Z`} fill={L.bosque} stroke={T} strokeOpacity={0.4} strokeWidth={4} /><path d={`M${x} ${SUELO_P - 330 - i * 30} L${x + 60} ${SUELO_P - 190} L${x - 60} ${SUELO_P - 190} Z`} fill={L.bosque} opacity={0.6} /></g>)}
        {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${-600 + i * 40 + random(`gx${i}`) * 20} ${SUELO_P + 6} l-5 -22 l9 18 l5 -26 l3 30`} stroke={L.bosque} strokeWidth={4} fill="none" opacity={0.8} />)}
      </g>}
    </g>
  );
};

/** Cadera de quien escala la placa con la cadera a la altura `y`. */
export const enPlaca = (y: number) => ({ x: xP(y + 105) - 78, y });
/** Escalando la placa: manos y pies sobre la roca por cinemática inversa. `pieA` = [dx, dy] para separar el pie delantero de la roca (duda antes de pisar). */
export const EnPlaca: React.FC<{ y: number; dx?: number; cara?: Cara; aspecto: Aspecto; pies?: string; pieA?: [number, number]; pieB?: [number, number]; manoA?: [number, number]; torso?: number; cabeza?: number; angulos?: Partial<Angulos> }> = ({ y, dx = 0, cara = "esfuerzo", aspecto, pies, pieA = [0, 0], pieB = [0, 0], manoA = [0, 0], torso = 16, cabeza = -20, angulos }) => {
  const hip = { x: enPlaca(y).x + dx, y }, rel = (yy: number, off: number) => xP(yy) - off - hip.x;
  const a: Angulos = { torso, cabeza, brazoA: brazo(torso, rel(y - 122, 6) + manoA[0], -122 + manoA[1], -1), brazoB: brazo(torso, rel(y - 66, 6), -66, -1), piernaA: pierna(rel(y + 105, 24) + pieA[0], 105 + pieA[1]), piernaB: pierna(rel(y + 118, 24) + pieB[0], 118 + pieB[1]), ...angulos };
  return <Escalador x={hip.x} y={hip.y} quien="joe" angulos={a} cara={cara} aspecto={aspecto} pies={pies} bolsa="#D9614A" mira={1} />;
};
/** Cuerda de primero: sube por las cintas desde abajo hasta la última chapa por debajo de `tope` y de ahí al arnés. */
export const CuerdaP: React.FC<{ arnes: { x: number; y: number }; tope: number; floja?: number }> = ({ arnes, tope, floja = 0.15 }) => {
  const pts = CHAPAS_P.filter((y) => y >= tope).map((y) => ({ x: xP(y) - 7, y: y + 54 })), u = pts[pts.length - 1];
  const d = `M${xP(3000) - 60} 3000 L${pts.map((p) => `${p.x} ${p.y}`).join(" L")} Q${(u.x + arnes.x) / 2 - floja * 90} ${(u.y + arnes.y) / 2 + floja * 120} ${arnes.x + 18} ${arnes.y - 8}`;
  return <Cuerda d={d} />;
};
export { C };
