// Rocódromo de perfil con desplome y escalador de perfil (rig de piezas/Escalador) con manos y pies apoyados en presas (IK).
// El muro se inclina hacia el escalador: la superficie pasa por (X0, Y0) y se desplaza -INC px en x por cada px que sube.
import React from "react";
import { random } from "remotion";
import { Escalador, POSES, type Cara, type NombrePose } from "../../piezas/Escalador";
import { ik as ikPierna } from "../Bloque/comun";

export type V = [number, number];
const deg = (r: number) => (r * 180) / Math.PI, rad = (g: number) => (g * Math.PI) / 180;
export const INC = 0.3, X0 = 740, Y0 = 1700;
/** x de la superficie del muro a la altura y. */
export const xw = (y: number) => X0 - INC * (Y0 - y);
/** Punto donde la mano agarra la presa a la altura y / donde apoya el pie. */
export const agarre = (y: number, dx = 0): V => [xw(y) - 24 + dx, y];
export const apoyo = (y: number): V => [xw(y) - 12, y];
const ANG = deg(Math.atan(INC));

export const PAL = { pared: "#27434A", canto: "#6FA9AE", cantoS: "#3E6B72", ruta: "#E8C547", otras: ["#C8566B", "#4F7FC9", "#E8E4DA", "#6FA34A"], fondoA: "#0E1A27", fondoB: "#22394C", mat: "#2C5D86" };

/** Fondo de rocódromo visto de perfil: sala difusa a la izquierda y corte del muro desplomado a la derecha. `suelo` = y de la colchoneta. */
export const MuroPerfil: React.FC<{ presas?: number[]; otras?: number[]; suelo?: number; ruta?: boolean }> = ({ presas = [], otras = [], suelo }) => {
  const sup = (y: number): V => [xw(y), y];
  const A = sup(-300), B = sup(2300);
  return (
    <g>
      <defs>
        <linearGradient id="salaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={PAL.fondoA} /><stop offset="1" stopColor={PAL.fondoB} /></linearGradient>
        <linearGradient id="tecG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.5" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
      </defs>
      <rect x={-300} y={-400} width={1800} height={2900} fill="url(#salaG)" />
      {/* luces y siluetas difusas de la sala */}
      {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={random(`lx${i}`) * 520} cy={160 + random(`ly${i}`) * 1300} r={14 + random(`lr${i}`) * 26} fill="#9FD0E0" opacity={0.05 + random(`lo${i}`) * 0.07} />)}
      {[90, 250, 400].map((x, i) => <rect key={i} x={x - 6} y={-60} width={12} height={420 + i * 120} fill="#FFF3C4" opacity={0.05} />)}
      {/* cuerpo del muro y su canto (la cara de abajo del desplome) */}
      <path d={`M${A} L1500 -300 L1500 2300 L${B} Z`} fill={PAL.pared} />
      <path d={`M${A} L${A[0] + 40} ${A[1]} L${B[0] + 40} ${B[1]} L${B} Z`} fill={PAL.canto} />
      <path d={`M${A[0] + 40} ${A[1]} L${B[0] + 40} ${B[1]}`} stroke={PAL.cantoS} strokeWidth={6} fill="none" />
      <path d={`M${A} L${B}`} stroke="#10222A" strokeWidth={7} fill="none" />
      {Array.from({ length: 24 }).map((_, i) => { const y = -200 + i * 105; return <circle key={i} cx={xw(y) + 20} cy={y} r={4} fill={PAL.cantoS} />; })}
      {/* paneles detrás del canto */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${A[0] + 120 + i * 190} -300 L${B[0] + 120 + i * 190} 2300`} stroke="#1D343A" strokeWidth={5} opacity={0.55} />)}
      {/* presas de otras vías */}
      {otras.map((y, i) => <Presa key={`o${i}`} y={y} c={PAL.otras[i % 4]} seed={`po${i}`} op={0.5} />)}
      {presas.map((y, i) => <Presa key={`r${i}`} y={y} c={PAL.ruta} seed={`pr${i}`} mg={0.85} />)}
      {suelo !== undefined && <g>
        <rect x={-300} y={suelo} width={1800} height={900} fill={PAL.mat} />
        <path d={`M-300 ${suelo} L1500 ${suelo}`} stroke="#1B3E5C" strokeWidth={10} />
        {[60, 380, 700].map((x) => <path key={x} d={`M${x} ${suelo} L${x - 30} ${suelo + 900}`} stroke="#1B3E5C" strokeWidth={5} />)}
        <ellipse cx={xw(suelo) - 20} cy={suelo + 14} rx={260} ry={22} fill="#000" opacity={0.28} />
      </g>}
      <rect x={-300} y={-400} width={1800} height={340} fill="url(#tecG)" opacity={0.0} />
    </g>
  );
};

/** Presa vista de perfil: bulto que sale del muro hacia el escalador. */
export const Presa: React.FC<{ y: number; c: string; seed: string; mg?: number; op?: number }> = ({ y, c, seed, mg = 0.4, op = 1 }) => {
  const k = 0.85 + random(seed) * 0.4;
  return (
    <g transform={`translate(${xw(y)} ${y}) rotate(${-ANG}) scale(${k})`} opacity={op}>
      <path d="M2 -30 Q-34 -30 -46 -6 Q-48 24 2 32 Z" fill={c} stroke="#10222A" strokeOpacity={0.45} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-8 -22 Q-30 -22 -38 -6" stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.35} />
      {mg > 0 && <path d="M-14 -24 Q-34 -22 -42 -4" stroke="#F4F7FA" strokeWidth={9} strokeLinecap="round" fill="none" opacity={mg} />}
    </g>
  );
};

/** Cuerda: sube desde el suelo por las chapas (cintas exprés clavadas en el muro) hasta el arnés; `flojo` la comba hacia la sala. Tira hacia abajo (asegurador). */
export const DRAWS = [1200, 1450, 1700];
export const CuerdaP: React.FC<{ arnes: V; flojo?: number; draws?: number[]; yb?: number }> = ({ arnes, flojo = 0.4, draws = DRAWS }) => {
  const ds = [...draws].sort((x, y) => y - x); // de abajo arriba
  const pts: V[] = ds.map((y) => [xw(y) - 14, y]);
  const fin: V = [xw(2300) - 30, 2300];
  const top = pts[pts.length - 1];
  const mx = (top[0] + arnes[0]) / 2 - 130 * flojo, my = (top[1] + arnes[1]) / 2 + 40 * flojo;
  const d = `M${fin} L${pts.map((q) => q.join(" ")).join(" L")} Q${mx} ${my} ${arnes}`;
  return (
    <g>
      <path d={d} stroke="#B8460E" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#FF6A1F" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {ds.map((y, i) => (
        <g key={i} transform={`translate(${xw(y) - 4} ${y}) rotate(${-ANG})`}>
          <rect x={-30} y={-6} width={26} height={11} rx={5} fill="#E8EDF2" stroke="#141B26" strokeWidth={3} />
          <rect x={-40} y={-16} width={16} height={32} rx={8} fill="none" stroke="#AEB8C4" strokeWidth={6} />
        </g>
      ))}
    </g>
  );
};

/** Nube de magnesio: k 0 → 1. */
export const Nube: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 1 }) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <g>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = random(`na${i}`) * Math.PI * 2, d = (20 + random(`nd${i}`) * 80) * k * r;
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.8 - 40 * k * r} r={(12 + random(`nr${i}`) * 22) * (0.5 + k) * r} fill="#F4F7FA" opacity={(1 - k) * 0.75} />;
      })}
    </g>
  );
};

const LB = [52, 50], LT = 88;
const ikBrazo = (sx: number, sy: number, tx: number, ty: number, s: number): [number, number] => {
  const dx = (tx - sx) / s, dy = (ty - sy) / s, D = Math.max(10, Math.min(Math.hypot(dx, dy), LB[0] + LB[1] - 0.5));
  const th = Math.atan2(dx, dy), al = Math.acos(Math.min(1, (LB[0] * LB[0] + D * D - LB[1] * LB[1]) / (2 * LB[0] * D)));
  const a1 = th + al, kx = Math.sin(a1) * LB[0], ky = Math.cos(a1) * LB[0];
  return [deg(a1), deg(Math.atan2(dx - kx, dy - ky))];
};

export const ASP = { chaqueta: "#46556B", chaquetaSombra: "#2F3B4E", pantalon: "#2B3442", piel: "#E9B990", pielSombra: "#C9926A", casco: null as null, gorro: "#D9A21B", pelo: "#3B2A20", peinado: "corto" as const, arnes: true, manos: "piel" as const };

export type PropsPerfil = {
  hip: V; torso?: number; cabeza?: number; s?: number;
  manoA: V; manoB: V; pieA: V; pieB: V;
  cara?: Cara; /** anillos en los codos */ codos?: { col: string; o: number }; /** 0–1 nudillos blancos */ nud?: number; /** 0–1 aura roja en los brazos */ halo?: number;
  /** pose libre (caída): ignora IK */ libre?: NombrePose; libreB?: NombrePose; t?: number; rot?: number;
};

/** Posición de hombro, codos y manos (para anclar anillos y rótulos). */
export const geomPerfil = (p: Pick<PropsPerfil, "hip" | "torso" | "s" | "manoA" | "manoB">) => {
  const s = p.s ?? 1.7, t = p.torso ?? 10;
  const hombro: V = [p.hip[0] + s * Math.sin(rad(180 - t)) * LT, p.hip[1] + s * Math.cos(rad(180 - t)) * LT];
  const cod = (m: V): V => { const [a1] = ikBrazo(hombro[0], hombro[1], m[0], m[1], s); return [hombro[0] + s * Math.sin(rad(a1)) * LB[0], hombro[1] + s * Math.cos(rad(a1)) * LB[0]]; };
  return { hombro, codoA: cod(p.manoA), codoB: cod(p.manoB) };
};

/** Cadera que deja el hombro en `sh` con ese ángulo de torso. */
export const hipDesdeHombro = (sh: V, torso: number, s: number): V => [sh[0] - s * Math.sin(rad(180 - torso)) * LT, sh[1] - s * Math.cos(rad(180 - torso)) * LT];

export const Perfil: React.FC<PropsPerfil> = ({ hip, torso = 10, cabeza = -22, s = 1.7, manoA, manoB, pieA, pieB, cara = "esfuerzo", codos, nud = 0, halo = 0, libre, libreB, t = 0, rot = 0 }) => {
  const g = geomPerfil({ hip, torso, s, manoA, manoB });
  const [hx, hy] = g.hombro;
  const angulos = libre ? undefined : {
    torso, cabeza,
    brazoA: ikBrazo(hx, hy, manoA[0], manoA[1], s), brazoB: ikBrazo(hx, hy, manoB[0], manoB[1], s),
    piernaA: ikPierna(hip[0], hip[1], pieA[0], pieA[1], s), piernaB: ikPierna(hip[0], hip[1], pieB[0], pieB[1], s),
  };
  return (
    <g>
      <Escalador x={hip[0]} y={hip[1]} quien="simon" aspecto={ASP} pose={libre ?? "escalando"} poseB={libre ? libreB : undefined} t={t} angulos={angulos} cara={cara} s={s} rot={rot} bolsa="#E8E4DA" />
      {!libre && halo > 0 && [[g.hombro, g.codoA, manoA], [g.hombro, g.codoB, manoB]].map(([h, e, m], i) => (
        <path key={i} d={`M${h} L${e} L${m}`} stroke="#FF3B2E" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.28 * halo} />
      ))}
      {!libre && nud > 0 && [manoA, manoB].map((m, i) => <circle key={i} cx={m[0]} cy={m[1]} r={9 * s} fill="#fff" opacity={0.55 * nud} />)}
      {!libre && codos && [g.codoA, g.codoB].map((e, i) => <circle key={i} cx={e[0]} cy={e[1]} r={34} fill="none" stroke={codos.col} strokeWidth={8} opacity={codos.o * (i ? 0.6 : 1)} />)}
    </g>
  );
};

/** Escalador boca abajo (bat hang): el cuerpo cuelga de los pies. Se calcula con la cadera en `hip` y los pies en la presa (espejo vertical). */
export const PerfilInv: React.FC<{ hip: V; s?: number; pieA: V; pieB: V; brazoA?: [number, number]; brazoB?: [number, number]; cara?: Cara; cabeza?: number; torso?: number }> = ({ hip, s = 2.3, pieA, pieB, brazoA = [174, 170], brazoB = [186, 192], cara = "esfuerzo", cabeza = 0, torso = 0 }) => {
  const m = (p: V): V => [p[0], 2 * hip[1] - p[1]];
  const a = m(pieA), b = m(pieB);
  const angulos = { torso, cabeza, brazoA, brazoB, piernaA: ikPierna(hip[0], hip[1], a[0], a[1], s), piernaB: ikPierna(hip[0], hip[1], b[0], b[1], s) };
  return <Escalador x={hip[0]} y={hip[1]} quien="simon" aspecto={ASP} pose="escalando" angulos={angulos} cara={cara} s={s} rot={180} mira={-1} bolsa="#E8E4DA" />;
};

export const S0 = 2.3;
export const MA = agarre(600), MB = agarre(668, -8);
/** Escalador colgado de las dos presas: est 0 = codos doblados (cadera arriba), 1 = brazos estirados y pies más bajos. Pies sobre la pared. */
export const posColg = (est: number, s = S0, dy = 0) => {
  const e = 0.72 + 0.27 * est, ox = -80 + 68 * est, torso = 14 - 6 * est, ma = agarre(600 + dy);
  const hip = hipDesdeHombro([ma[0] + ox, ma[1] + e * 102 * s], torso, s);
  return { hip, torso, pA: apoyo(Math.round(hip[1] + 60 + 45 * est)), pB: apoyo(Math.round(hip[1] + 125 + 45 * est)) };
};
/** Todo el escalador colgado listo para dibujar (con presas y cuerda) en coordenadas del muro. */
export const Colgado: React.FC<{ est?: number; cara?: Cara; halo?: number; nud?: number; codos?: { col: string; o: number }; manoA?: V; manoB?: V; dx?: number; dy?: number }> = ({ est = 0, cara = "esfuerzo", halo = 0, nud = 0, codos, dx = 0, dy = 0, manoA = agarre(600 + dy), manoB = agarre(668 + dy, -8) }) => {
  const q = posColg(est, S0, dy);
  const hip: V = [q.hip[0] + dx, q.hip[1]];
  return (
    <g>
      <CuerdaP yb={360} arnes={[hip[0] - 14, hip[1] - 4]} flojo={0.6} />
      <Perfil hip={hip} torso={q.torso} s={S0} manoA={manoA} manoB={manoB} pieA={q.pA} pieB={q.pB} cara={cara} halo={halo} nud={nud} codos={codos} />
    </g>
  );
};
export { POSES };
