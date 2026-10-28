// E6 v2 «El último pegue» en bloque: piezas comunes de la plantilla Bloque.
// Plano general: bloque desplomado a la derecha, crash pads naranjas, tres personajes con el mismo dibujo y distinto aspecto.
import React from "react";
import { Sequence, random } from "remotion";
import { Bateria } from "../../piezas/Movil";
import { Etiqueta as Rot, Pegues as Peg } from "../Pegue/comun";
import { Escalador, type PropsEscalador } from "../../piezas/Escalador";
import { CrashPad, PadEspalda } from "../../piezas/CrashPad";
import type { Aspecto } from "../../piezas/Rasgos";
import { Cielo, tonos } from "../Pegue/comun";
export { C, Camara, Etiqueta, Pegues, Svg, Zoom, clamp, golpe, type P } from "../Pegue/comun";

export const SUELO = 1340, PAD = SUELO - 32;
export const AG = { salida: [398, 1110], medio: [378, 1000], crux: [376, 900], labio: [430, 790] } as const;
export const TOP = 760;
const S0 = 1.2;

export const TU: Aspecto = { chaqueta: "#3E7C59", chaquetaSombra: "#2B5A40", pantalon: "#3B3F4A", piel: "#B9825A", pielSombra: "#94613E", casco: null, gorro: "#E0A526", pelo: "#1E140E", peinado: "rizado", arnes: false, manos: "piel" };
export const BARBA: Aspecto = { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#2B3442", piel: "#F0C7A4", pielSombra: "#D9A27F", casco: null, pelo: "#4A3324", peinado: "corto", barba: "#4A3324", gafas: true, arnes: false, manos: "piel" };
export const ALTA: Aspecto = { chaqueta: "#1F6E7E", chaquetaSombra: "#144B57", pantalon: "#2B3442", piel: "#E9B990", pielSombra: "#C9926A", casco: null, pelo: "#C99A4E", peinado: "coleta", arnes: false, manos: "piel" };

type PP = Omit<PropsEscalador, "quien" | "aspecto"> & { pad?: boolean };
export const Tu: React.FC<PP> = (p) => <Escalador quien="joe" aspecto={TU} s={S0} {...p} />;
export const Barba: React.FC<PP> = ({ pad, ...p }) => <>{pad && <PadEspalda x={p.x} y={p.y} s={p.s ?? S0} mira={p.mira} />}<Escalador quien="simon" aspecto={BARBA} s={S0} {...p} /></>;
export const Alta: React.FC<PP> = ({ pad, ...p }) => <>{pad && <PadEspalda x={p.x} y={p.y} s={p.s ?? 1.3} mira={p.mira} />}<Escalador quien="simon" aspecto={ALTA} s={1.3} {...p} /></>;

/** Cadera de pie en el suelo y sentado en el pad. */
export const dePie = (s = S0) => SUELO - 136 * s;
/** Cadera sentado: el culo (≈12·s bajo la cadera) apoyado en la superficie del pad, sin flotar. */
export const sentado = (s = S0) => PAD + 8 - 12 * s;
/** Cadera para colgar de un agarre con la pose «escalando» (mano delantera en el agarre). */
export const colgado = (ag: readonly [number, number], s = S0) => ({ x: ag[0] - 36 * s, y: ag[1] + 182 * s });

/** x del canto izquierdo del bloque a la altura y (la cara donde se apoyan los pies). */
export const canto = (y: number) => (y >= 1060 ? 400 + ((y - 1060) * 80) / 280 : y >= 930 ? 372 + ((y - 930) * 28) / 130 : 372 + ((930 - y) * 30) / 140);
const L1 = 66, L2 = 64, deg = (r: number) => (r * 180) / Math.PI;
/** Ángulos de pierna (sistema de Escalador) para que el pie llegue a (tx, ty) desde la cadera (hx, hy), rodilla hacia la pared. */
export const ik = (hx: number, hy: number, tx: number, ty: number, s = S0): [number, number] => {
  const dx = (tx - hx) / s, dy = (ty - hy) / s, D = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.5);
  const th = Math.atan2(dx, dy), al = Math.acos(Math.min(1, (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D)));
  const a1 = th + al, kx = Math.sin(a1) * L1, ky = Math.cos(a1) * L1;
  return [deg(a1), deg(Math.atan2(dx - kx, dy - ky))];
};
/** Pies apoyados en la cara del bloque para alguien colgado con la cadera en (hx, hy): ángulos + dónde dibujar las presas de pie. */
export const trepa = (hx: number, hy: number, s = S0) => {
  const yA = hy + 92 * s, yB = hy + 122 * s;
  const A = { x: canto(yA) + 6, y: yA }, B = { x: canto(yB) + 6, y: yB };
  return { angulos: { piernaA: ik(hx, hy, A.x, A.y, s), piernaB: ik(hx, hy, B.x, B.y, s) }, pies: [A, B] };
};
/** Presa de pie pequeña en la cara del bloque. */
export const PresaPie: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g><path d={`M${x - 4} ${y + 10} q-18 -2 -22 -14 q8 -8 26 -6 Z`} fill="#6E6670" stroke="#141B26" strokeWidth={3} /><path d={`M${x - 20} ${y - 6} q10 -4 18 -2`} stroke="#F4F7FA" strokeWidth={4} strokeLinecap="round" opacity={0.8} /></g>
);
/** Escalador colgado de la presa con los pies en la pared (y sus presas de pie). Extra = props para Tu. */
export const Colgado: React.FC<{ hx: number; hy: number; cara?: import("../../piezas/Escalador").Cara; frontal?: boolean; tiembla?: number; cabeza?: number }> = ({ hx, hy, cara = "esfuerzo", frontal, tiembla = 0, cabeza = -26 }) => {
  const t = trepa(hx, hy);
  return <>{t.pies.map((p, i) => <PresaPie key={i} x={p.x} y={p.y + 8} />)}<Tu x={hx + tiembla} y={hy} pose="escalando" frontal={frontal} cara={cara} angulos={{ ...t.angulos, cabeza }} /></>;
};

/** Fondo completo: cielo (hora h), suelo, bloque, agarres con magnesio y pads. `pads` = cuántos quedan (1–3). */
export const Fondo: React.FC<{ h: number; id: string; pads?: number; hundido?: number }> = ({ h, id, pads = 3, hundido = 0 }) => {
  const t = tonos(h);
  return (
    <g>
      <Cielo h={h} id={id} />
      {h > 0.9 && Array.from({ length: 45 }).map((_, i) => <circle key={i} cx={random(`bx${i}`) * 1080} cy={random(`by${i}`) * 950} r={1.5 + random(`br${i}`) * 2.5} fill="#fff" opacity={0.3 + 0.5 * random(`bo${i}`)} />)}
      <path d={`M-300 ${SUELO} Q540 ${SUELO - 26} 1400 ${SUELO} L1400 2400 L-300 2400 Z`} fill={t.suelo} />
      {[40, 150, 980].map((x, i) => <path key={i} d={`M${x} ${SUELO + 2} q8 -40 16 0 q6 -30 14 0 q8 -34 16 0`} fill={h > 0.9 ? "#121A1F" : "#5F7253"} />)}
      <path d={`M480 ${SUELO} L400 1060 L372 930 Q378 800 470 ${TOP + 10} L880 ${TOP - 10} Q1030 ${TOP} 1080 900 L1120 ${SUELO} Z`} fill={t.roca} />
      <path d={`M470 ${TOP + 10} L880 ${TOP - 10} Q1030 ${TOP} 1080 900 L1040 930 Q980 ${TOP + 40} 860 ${TOP + 30} L520 ${TOP + 50} Z`} fill={t.cara} opacity={0.7} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${560 + i * 110} ${TOP + 80 + i * 70} q40 60 10 140`} stroke={t.caraS} strokeWidth={6} fill="none" opacity={0.6} />)}
      {Object.values(AG).map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 26} ${y + 4} q4 -16 26 -16 q24 0 26 14 q-26 8 -52 2 Z`} fill={t.caraS} stroke="#000" strokeOpacity={0.25} strokeWidth={3} />
          <path d={`M${x - 20} ${y - 6} q20 -10 40 0`} stroke="#F4F7FA" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.85} />
        </g>
      ))}
      {pads >= 3 && <CrashPad x={30} y={PAD + 6} w={250} grosor={28} />}
      {pads >= 2 && <CrashPad x={540} y={PAD + 4} w={300} />}
      <CrashPad x={240} y={PAD} w={320} hundido={hundido} />
    </g>
  );
};

/* ---- v3: montaje rápido y HUD ---- */

/** Planos dentro de una escena: `cortes` = fotogramas (relativos) donde cambia el plano. */
export const Planos: React.FC<{ d: number; cortes: number[]; children: React.ReactNode[] }> = ({ d, cortes, children }) => {
  const lim = [0, ...cortes, d];
  return <>{children.map((c, i) => (lim[i + 1] > lim[i] ? <Sequence key={i} from={lim[i]} durationInFrames={lim[i + 1] - lim[i]}>{c}</Sequence> : null))}</>;
};

/** Pegue + batería (+ rótulo de la excusa). `desde` = fotograma en que entra todo. */
export const Hud: React.FC<{ pegue?: number; bat?: number; titulo?: string; desde?: number; tam?: number }> = ({ pegue, bat, titulo, desde = 0, tam = 78 }) => (
  <Sequence from={desde}>
    {pegue !== undefined && <Peg n={pegue} />}
    {bat !== undefined && <Bateria pct={bat} />}
    <Rot texto={titulo} top={300} tam={tam} />
  </Sequence>
);

/** Datos de la escena (pegue, batería) que vienen del guion. */
export const datosE = (e: { [k: string]: unknown }) => ({ pegue: e.pegue as number | undefined, bat: e.bateria as number | undefined, titulo: e.titulo as string | undefined });

/** Los colegas en sus 3 momentos: animan → sentados → recogen. */
export type Momento = "animan" | "sentados" | "recogen" | "seVan";
export const Colegas: React.FC<{ m: Momento; f: number; movil?: "movil" | "movilLuz"; xB?: number; xA?: number }> = ({ m, f, movil, xB = 760, xA = 120 }) => {
  const bote = Math.abs(Math.sin(f / 4)) * 14;
  if (m === "animan") return <>
    <Alta x={xA} y={dePie(1.3) - bote} pose="celebrando" cara="alivio" />
    <Barba x={xB} y={dePie() - bote * 0.6} pose={movil ? "grabando" : "senalando"} objeto={movil} mira={-1} cara="alivio" angulos={movil ? undefined : { brazoA: [150, 160] }} />
  </>;
  if (m === "sentados") return <>
    <Alta x={xA + 40} y={sentado(1.3)} pose="sentadoSuelo" cara="cerrados" />
    <Barba x={xB} y={sentado()} pose="sentadoSuelo" objeto={movil} mira={-1} cara="normal" />
  </>;
  const paso = Math.sin(f / 4) * 14;
  return <>
    <Alta x={xA - (m === "seVan" ? f * 3 : 0)} y={dePie(1.3)} pose="cargando" pad mira={-1} cara="cerrados" angulos={{ piernaA: [paso, 0], piernaB: [-paso, 0] }} />
    <Barba x={xB} y={dePie()} pose={movil ? "grabando" : "cargando"} objeto={movil} pad mira={-1} cara="cerrados" />
  </>;
};
