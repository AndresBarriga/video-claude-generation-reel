// Personajes de escalada reutilizables (Joe = rojo cálido, Simon = azul petróleo).
// Esqueleto por ángulos: cada pose es un conjunto de ángulos; se pueden mezclar dos poses (animación).
// Ángulo de extremidad: 0 = hacia abajo, 90 = hacia delante (+x), -90 = hacia atrás, 180 = hacia arriba.
// Torso: 0 = vertical, positivo = inclinado hacia delante.
import React from "react";
import { Gafas, ObjetoMano, Tocado, type Aspecto, type Objeto } from "./Rasgos";

export type Quien = "joe" | "simon";
export type Cara = "normal" | "miedo" | "dolor" | "esfuerzo" | "alivio" | "cerrados";

export const PERSONAJES: Record<Quien, { chaqueta: string; chaquetaSombra: string; pantalon: string; casco: string; pelo: string }> = {
  joe: { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#2B3442", casco: "#F2C230", pelo: "#3B2A20" },
  simon: { chaqueta: "#1F6E7E", chaquetaSombra: "#144B57", pantalon: "#2B3442", casco: "#EDEFF2", pelo: "#6B4A2E" },
};
const PIEL = "#E9B990", PIEL_SOMBRA = "#C9926A", GUANTE = "#1B2230", BOTA = "#1B2230", ARNES = "#F2C230", TINTA = "#141B26";

export type Angulos = {
  torso: number; cabeza: number;
  brazoA: [number, number]; brazoB: [number, number]; // A = delante, B = detrás: [hombro→codo, codo→mano]
  piernaA: [number, number]; piernaB: [number, number]; // [cadera→rodilla, rodilla→pie]
};

export const POSES = {
  pie: { torso: 0, cabeza: 0, brazoA: [12, 4], brazoB: [-10, -4], piernaA: [6, 0], piernaB: [-6, 0] },
  sentado: { torso: -18, cabeza: 10, brazoA: [70, 110], brazoB: [55, 95], piernaA: [80, 20], piernaB: [72, 8] }, // asegurando, pies delante
  tirando: { torso: -42, cabeza: 30, brazoA: [95, 100], brazoB: [85, 92], piernaA: [86, 40], piernaB: [80, 30] }, // aguantando la cuerda, echado atrás
  colgado: { torso: 6, cabeza: -8, brazoA: [135, 165], brazoB: [-30, -10], piernaA: [12, -4], piernaB: [-6, -12] }, // de la cuerda, manos arriba
  colgadoRota: { torso: 8, cabeza: -10, brazoA: [130, 168], brazoB: [-50, -20], piernaA: [24, 70], piernaB: [-4, -10] },
  cayendo: { torso: -20, cabeza: -20, brazoA: [150, 120], brazoB: [-150, -120], piernaA: [40, -20], piernaB: [-30, 20] },
  tumbado: { torso: -90, cabeza: -36, brazoA: [40, 80], brazoB: [100, 90], piernaA: [88, 92], piernaB: [92, 90] }, // boca arriba, cabeza a la izquierda, pies a la derecha
  tumbadoRota: { torso: -88, cabeza: -30, brazoA: [20, 100], brazoB: [110, 90], piernaA: [70, 150], piernaB: [92, 90] },
  arrastre: { torso: 96, cabeza: -70, brazoA: [70, 120], brazoB: [30, 80], piernaA: [-96, -90], piernaB: [-80, -40] }, // boca abajo, avanza a la derecha arrastrando la pierna
  escalando: { torso: 4, cabeza: -20, brazoA: [150, 175], brazoB: [120, 160], piernaA: [60, -10], piernaB: [10, -20] },
  senalando: { torso: 0, cabeza: 0, brazoA: [90, 92], brazoB: [-8, -2], piernaA: [6, 0], piernaB: [-6, 0] },
  celebrando: { torso: 0, cabeza: -12, brazoA: [160, 175], brazoB: [-160, -175], piernaA: [10, 0], piernaB: [-10, 0] },
  abrazo: { torso: 6, cabeza: 10, brazoA: [70, 160], brazoB: [100, 150], piernaA: [8, 0], piernaB: [-6, 0] },
  sentadoSuelo: { torso: -6, cabeza: 14, brazoA: [28, 52], brazoB: [38, 64], piernaA: [90, 90], piernaB: [84, 20] }, // en el suelo, agarrándose la rodilla
  aterriza: { torso: 4, cabeza: 10, brazoA: [125, 150], brazoB: [-125, -150], piernaA: [4, 0], piernaB: [-4, 0] }, // brazos abiertos, piernas rectas
  // bloque / sesión
  sitStart: { torso: -12, cabeza: -24, brazoA: [140, 165], brazoB: [128, 156], piernaA: [82, 40], piernaB: [74, 28] }, // sentado en el crash pad, manos en las presas de salida
  soplando: { torso: 4, cabeza: 8, brazoA: [100, 190], brazoB: [96, 196], piernaA: [6, 0], piernaB: [-6, 0] }, // se sopla los dedos
  lijando: { torso: 14, cabeza: 34, brazoA: [70, 118], brazoB: [58, 128], piernaA: [92, 30], piernaB: [86, 14] }, // sentado, mira las yemas
  cargando: { torso: 6, cabeza: 0, brazoA: [34, 172], brazoB: [-24, 170], piernaA: [6, 0], piernaB: [-6, 0] }, // crash pad a la espalda, manos en las asas
  grabando: { torso: 0, cabeza: -4, brazoA: [118, 168], brazoB: [-8, -2], piernaA: [6, 0], piernaB: [-6, 0] }, // móvil delante de la cara
  agachado: { torso: 50, cabeza: 0, brazoA: [80, 100], brazoB: [60, 80], piernaA: [100, -30], piernaB: [80, -20] }, // de rodillas, mira abajo
} satisfies Record<string, Angulos>;
export type NombrePose = keyof typeof POSES;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mezcla = (a: Angulos, b: Angulos, t: number): Angulos => ({
  torso: lerp(a.torso, b.torso, t), cabeza: lerp(a.cabeza, b.cabeza, t),
  brazoA: [lerp(a.brazoA[0], b.brazoA[0], t), lerp(a.brazoA[1], b.brazoA[1], t)],
  brazoB: [lerp(a.brazoB[0], b.brazoB[0], t), lerp(a.brazoB[1], b.brazoB[1], t)],
  piernaA: [lerp(a.piernaA[0], b.piernaA[0], t), lerp(a.piernaA[1], b.piernaA[1], t)],
  piernaB: [lerp(a.piernaB[0], b.piernaB[0], t), lerp(a.piernaB[1], b.piernaB[1], t)],
});

const rad = (g: number) => (g * Math.PI) / 180;
const ext = (x: number, y: number, ang: number, L: number): [number, number] => [x + Math.sin(rad(ang)) * L, y + Math.cos(rad(ang)) * L];

const L = { torso: 104, brazo1: 52, brazo2: 50, pierna1: 66, pierna2: 64, cabeza: 30 };

const Ojos: React.FC<{ cara: Cara }> = ({ cara }) => {
  const st = { stroke: TINTA, strokeWidth: 4, strokeLinecap: "round" as const, fill: "none" };
  switch (cara) {
    case "miedo":
      return (<g>
        <ellipse cx={6} cy={-4} rx={7} ry={9} fill="#fff" /><ellipse cx={22} cy={-4} rx={7} ry={9} fill="#fff" />
        <circle cx={8} cy={-3} r={3.6} fill={TINTA} /><circle cx={24} cy={-3} r={3.6} fill={TINTA} />
        <path d="M0 -18 L12 -15 M18 -15 L30 -18" {...st} />
        <ellipse cx={17} cy={14} rx={5} ry={6.5} fill={TINTA} />
      </g>);
    case "dolor":
      return (<g>
        <path d="M1 -8 L11 -3 L1 2 M29 -8 L19 -3 L29 2" {...st} />
        <path d="M5 13 Q16 6 28 13 L26 16 Q16 11 7 16 Z" fill={TINTA} />
      </g>);
    case "esfuerzo":
      return (<g>
        <path d="M0 -14 L12 -9 M30 -14 L18 -9" {...st} />
        <circle cx={7} cy={-3} r={3.6} fill={TINTA} /><circle cx={23} cy={-3} r={3.6} fill={TINTA} />
        <rect x={6} y={9} width={20} height={7} rx={2} fill="#fff" stroke={TINTA} strokeWidth={3} />
      </g>);
    case "alivio":
      return (<g>
        <path d="M2 -2 Q7 -8 12 -2 M19 -2 Q24 -8 29 -2" {...st} />
        <path d="M7 10 Q17 19 27 10" {...st} />
      </g>);
    case "cerrados":
      return (<g><path d="M2 -3 L12 -3 M19 -3 L29 -3" {...st} /><path d="M10 12 L24 12" {...st} /></g>);
    default:
      return (<g>
        <circle cx={7} cy={-3} r={3.8} fill={TINTA} /><circle cx={23} cy={-3} r={3.8} fill={TINTA} />
        <path d="M10 12 Q17 15 24 12" {...st} />
      </g>);
  }
};

export type PropsEscalador = {
  x: number; y: number; quien: Quien; pose?: NombrePose; poseB?: NombrePose; t?: number; angulos?: Partial<Angulos>;
  cara?: Cara; s?: number; rot?: number; mira?: 1 | -1; sombra?: number; mochila?: boolean; navaja?: boolean;
  /** Frontal encendido en el casco (luz hacia donde mira) */ frontal?: boolean;
  /** Reparto variado: colores, pelo, gorro, gafas, barba, sin casco/arnés (ver Rasgos.tsx) */ aspecto?: Aspecto;
  /** Objeto en la mano delantera */ objeto?: Objeto;
  /** Complexión: ancho del torso (px), largo de brazos (factor), radio de manos, grosor de brazos/piernas. */ cuerpo?: { torso?: number; brazos?: number; manos?: number; grosor?: number };
  /** Pies de gato (zapatilla ajustada en punta, color) en vez de bota. */ pies?: string;
  /** Bolsa de magnesio a la cintura (color). */ bolsa?: string;
  /** Cabeza propia (caricatura de una persona concreta); sustituye a la cabeza genérica. Mismo sistema: radio 30, mira a +x. */ Cabeza?: React.FC<{ cara: Cara }>;
};

/** Escalador. (x, y) = cadera. `sombra` = y del suelo donde proyectar sombra. */
export const Escalador: React.FC<PropsEscalador> = ({ x, y, quien, pose = "pie", poseB, t = 0, angulos, cara = "normal", s = 1, rot = 0, mira = 1, sombra, mochila, navaja, frontal, aspecto = {}, objeto, Cabeza, cuerpo = {}, pies, bolsa }) => {
  const TW = cuerpo.torso ?? 52, KB = cuerpo.brazos ?? 1, RM = cuerpo.manos ?? 13, GR = cuerpo.grosor ?? 1;
  const c = { ...PERSONAJES[quien], ...aspecto } as typeof PERSONAJES.joe & Aspecto;
  const piel = aspecto.piel ?? PIEL, pielS = aspecto.pielSombra ?? PIEL_SOMBRA, mano = aspecto.manos === "piel" ? piel : GUANTE;
  let a: Angulos = POSES[pose] as Angulos;
  if (poseB) a = mezcla(a, POSES[poseB] as Angulos, t);
  if (angulos) a = { ...a, ...angulos };
  const cuello = ext(0, 0, 180 - a.torso, L.torso);
  const hombro = ext(0, 0, 180 - a.torso, L.torso - 16);
  const cab = ext(cuello[0], cuello[1], 180 - a.torso, L.cabeza + 2);
  const brazo = (ang: [number, number]) => { const e = ext(hombro[0], hombro[1], ang[0], L.brazo1 * KB); const m = ext(e[0], e[1], ang[1], L.brazo2 * KB); return { e, m }; };
  const pierna = (ang: [number, number]) => { const r = ext(0, 0, ang[0], L.pierna1); const p = ext(r[0], r[1], ang[1], L.pierna2); const punta = ext(p[0], p[1], ang[1] + 90, 22); return { r, p, punta }; };
  const bA = brazo(a.brazoA), bB = brazo(a.brazoB), pA = pierna(a.piernaA), pB = pierna(a.piernaB);
  const lin = (pts: [number, number][]) => "M" + pts.map((p) => p.join(" ")).join(" L");
  const st = (w: number, col: string) => ({ stroke: col, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" });
  const bota = (p: { r: [number, number]; p: [number, number]; punta: [number, number] }, col: string) => pies
    ? <g><path d={lin([p.p, p.punta])} {...st(16, pies)} /><path d={lin([[p.p[0], p.p[1] + 7], [p.punta[0] + 4, p.punta[1] + 6]])} {...st(5, "#141B26")} /></g>
    : <path d={lin([p.p, p.punta])} {...st(22, col)} />;
  return (
    <g>
      {sombra !== undefined && <ellipse cx={x} cy={sombra} rx={90 * s} ry={14 * s} fill="#000" opacity={0.18} />}
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * mira} ${s})`}>
        {/* detrás */}
        <path d={lin([[0, 0], pB.r, pB.p])} {...st(30 * GR, "#1D2532")} />
        {bota(pB, "#0F141C")}
        <path d={lin([hombro, bB.e, bB.m])} {...st(24 * GR, c.chaquetaSombra)} />
        <circle cx={bB.m[0]} cy={bB.m[1]} r={RM - 1} fill={aspecto.manos === "piel" ? pielS : "#0F141C"} />
        {mochila && <rect x={-50} y={-100} width={36} height={74} rx={12} fill="#3A4656" transform={`rotate(${a.torso})`} />}
        {/* torso: chaqueta, pantalón y arnés en un mismo bloque girado */}
        <g transform={`rotate(${a.torso})`}>
          <rect x={-TW / 2} y={-L.torso - 6} width={TW} height={L.torso + 16} rx={TW / 2 - 2} fill={c.chaqueta} />
          <rect x={6} y={-L.torso + 4} width={10} height={L.torso - 34} rx={5} fill="#fff" opacity={0.14} />
          <rect x={-TW / 2 + 1} y={-30} width={TW - 2} height={42} rx={18} fill={c.pantalon} />
          {bolsa && <g><rect x={-TW / 2 - 18} y={-40} width={26} height={30} rx={9} fill={bolsa} /><path d={`M${-TW / 2 - 18} -38 Q${-TW / 2 - 5} -46 ${-TW / 2 + 8} -38`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.8} /><circle cx={-TW / 2 - 8} cy={-30} r={3} fill="#fff" opacity={0.6} /></g>}
          {aspecto.arnes !== false && <><rect x={-27} y={-36} width={54} height={10} rx={4} fill={ARNES} />
          <circle cx={20} cy={-22} r={7} fill="none" stroke="#9AA6B2" strokeWidth={4} /></>}
        </g>
        {/* delante */}
        <path d={lin([[0, 0], pA.r, pA.p])} {...st(30 * GR, c.pantalon)} />
        {bota(pA, BOTA)}
        {/* cabeza */}
        <g transform={`translate(${cab[0]} ${cab[1]}) rotate(${a.torso * 0.6 + a.cabeza})`}>
          {Cabeza ? <Cabeza cara={cara} /> : <>
          <circle r={L.cabeza} fill={piel} />
          <path d={`M${-L.cabeza} 2 A${L.cabeza} ${L.cabeza} 0 0 0 ${-L.cabeza * 0.2} ${L.cabeza}`} fill={pielS} opacity={0.6} />
          {c.casco === null ? <Tocado a={aspecto} /> : <><path d={`M${-L.cabeza - 5} -2 A${L.cabeza + 5} ${L.cabeza + 5} 0 0 1 ${L.cabeza + 5} -2 L${L.cabeza + 12} 2 L${-L.cabeza - 5} 4 Z`} transform="translate(0 -6)" fill={c.casco} />
          <path d={`M${-L.cabeza + 2} -12 Q0 -36 ${L.cabeza - 4} -12`} stroke="#fff" strokeWidth={4} opacity={0.35} fill="none" /></>}
          <g transform="translate(-8 6)"><Ojos cara={cara} /></g>
          {aspecto.gafas && <g transform="translate(-8 6)"><Gafas /></g>}
          </>}
          {frontal && (<g>
            <path d="M30 -18 L420 -120 L420 90 Z" fill="#FFF3C4" opacity={0.16} />
            <rect x={20} y={-26} width={14} height={14} rx={4} fill="#2A3442" />
            <circle cx={32} cy={-19} r={6} fill="#FFF7D6" />
          </g>)}
        </g>
        <path d={lin([hombro, bA.e, bA.m])} {...st(24 * GR, c.chaqueta)} />
        <circle cx={bA.m[0]} cy={bA.m[1]} r={RM} fill={mano} />
        {objeto && <g transform={`translate(${bA.m[0]} ${bA.m[1]}) rotate(0)`}><ObjetoMano o={objeto} /></g>}
        {navaja && (
          <g transform={`translate(${bA.m[0]} ${bA.m[1]}) rotate(${a.brazoA[1] - 90})`}>
            <rect x={-6} y={-8} width={34} height={16} rx={6} fill="#2A3442" />
            <path d="M26 -6 L80 -2 L84 4 L26 6 Z" fill="#E8EDF2" />
          </g>
        )}
      </g>
    </g>
  );
};
