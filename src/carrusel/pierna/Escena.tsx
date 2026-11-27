// Escena genérica de espaldas (coordenadas ~1080×1350): Lola en la pared, piernas configurables, cinta y cuerda.
// Proporciones: cadera ≈ 2,4× el ancho del muslo; cintura más estrecha que la cadera; piernas largas y finas.
// Física de la cuerda: sale del nudo (delante) entre las piernas, cuelga con comba si va floja, pasa por DENTRO
// del mosquetón y del mosquetón cae vertical al asegurador. `delante` = tramo de la cuerda que va por encima del cuerpo.
import React from "react";
import { COL, cr, Cuerda, en, Forma, Linea, tubo, type Pt } from "../comun";

const PANT = "#24324F", PANT2 = "#33456B", PIEL = "#EDBE97", PIELS = "#CC9A74", ZAP = "#2F6FD0", JERSEY = "#FF6B5B", JERSEY_S = "#D04A3E", ARNES = "#FFC93C";
const ROCA = "#EBE1CF";
export const NUDO: Pt = [560, 548];
const HI: Pt = [500, 492], HD: Pt = [620, 492];

export type Pierna = { K: Pt; A: Pt; pie?: "puntilla" | "talon" };
export type Config = {
  izq: Pierna; der: Pierna;
  chapa: Pt;                 // placa de la chapa; la cinta cuelga hacia `cintaDir` (grados, 0 = abajo)
  cintaDir?: number;
  cuerda: Pt[];              // del nudo al mosquetón (último punto = dentro del mosquetón)
  delante?: [number, number]; // índices [desde, hasta] del tramo que pasa por encima del cuerpo
  presas: Pt[];              // centro de cada repisa/presa
  desplome?: boolean;        // sombra de techo arriba (talonamiento)
};

const rad = (a: number) => (a * Math.PI) / 180;
const desde = (p: Pt, ang: number, L: number): Pt => [p[0] + Math.sin(rad(ang)) * L, p[1] + Math.cos(rad(ang)) * L];
/** Posición del mosquetón de abajo (donde pasa la cuerda). */
export const mosqueton = (c: Config): Pt => desde(c.chapa, c.cintaDir ?? 0, 132);

const Roca: React.FC<{ c: Config }> = ({ c }) => (
  <g>
    <rect x={-500} y={-300} width={2200} height={2200} fill={ROCA} />
    <path d="M-100 160 L300 120 L380 420 L160 560 L-100 520 Z" fill="#E3D8C4" />
    <path d="M720 1000 L1300 900 L1300 1600 L800 1600 L760 1180 Z" fill="#E2D6C1" />
    <path d="M880 140 L1300 100 L1300 560 L960 520 Z" fill="#F1E9DA" />
    <path d="M360 1200 L640 1140 L700 1600 L420 1600 Z" fill="#F0E8D8" />
    <Linea p={[[1060, 160], [1010, 420], [1040, 660], [1000, 900], [1050, 1160], [1030, 1500]]} c="#8C7E68" w={14} />
    <Linea p={[[600, 980], [700, 1010], [760, 1090]]} c="#B3A58C" w={7} />
    <Linea p={[[20, 760], [130, 800], [190, 780]]} c="#B3A58C" w={7} />
    {c.desplome && <path d="M-200 -300 L1500 -300 L1500 230 Q900 300 560 250 Q200 210 -200 260 Z" fill="#CDBFA6" stroke={COL.tinta} strokeWidth={8} />}
    {c.presas.map(([x, y], i) => (
      <g key={i}>
        <Forma p={[[x - 92, y - 6], [x + 30, y - 14], [x + 96, y - 2], [x + 78, y + 26], [x - 78, y + 30]]} c="#D2C4AA" w={7} />
        <ellipse cx={x + 14} cy={y - 8} rx={36} ry={7} fill="#fff" opacity={0.7} />
      </g>
    ))}
  </g>
);

/** Chapa + cinta + mosquetón. `frente`: solo el lomo del mosquetón (va por delante de la cuerda). */
const Cinta: React.FC<{ c: Config; frente?: boolean }> = ({ c, frente }) => {
  const [x, y] = c.chapa, r = -(c.cintaDir ?? 0);
  const lomo = `M${x - 8} ${y + 112} Q${x - 22} ${y + 142} ${x - 8} ${y + 178}`;
  const mosq = `M${x - 8} ${y + 112} Q${x - 22} ${y + 142} ${x - 8} ${y + 178} Q${x + 10} ${y + 194} ${x + 26} ${y + 172} Q${x + 36} ${y + 138} ${x + 8} ${y + 112} Z`;
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      {frente ? (
        <g><path d={lomo} stroke={COL.tinta} strokeWidth={17} fill="none" strokeLinecap="round" /><path d={lomo} stroke="#C9D0D8" strokeWidth={9} fill="none" strokeLinecap="round" /></g>
      ) : (
        <g>
          <Forma p={[[x - 22, y - 20], [x + 20, y - 26], [x + 26, y + 20], [x - 16, y + 26]]} c="#B8C0CA" w={6} />
          <circle cx={x + 2} cy={y} r={9} fill="#6E7782" />
          <path d={`M${x + 2} ${y + 14} q-22 24 2 48`} stroke={COL.tinta} strokeWidth={15} fill="none" strokeLinecap="round" />
          <path d={`M${x + 2} ${y + 14} q-22 24 2 48`} stroke="#C9D0D8" strokeWidth={7} fill="none" strokeLinecap="round" />
          <rect x={x - 6} y={y + 52} width={30} height={58} rx={11} fill={COL.lila} stroke={COL.tinta} strokeWidth={6} />
          <path d={mosq} fill="none" stroke={COL.tinta} strokeWidth={17} strokeLinejoin="round" />
          <path d={mosq} fill="none" stroke="#C9D0D8" strokeWidth={9} strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

const PiernaD: React.FC<{ H: Pt; p: Pierna }> = ({ H, p }) => {
  const { K, A } = p, cuff = en(K, A, 0.4);
  const dx = A[0] - K[0], dy = A[1] - K[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return (
    <g>
      <Forma p={tubo([H, en(H, K, 0.5), K, cuff], [100, 88, 70, 66])} c={PANT} />
      <Linea p={[en(H, K, 0.25), en(H, K, 0.75), en(K, cuff, 0.6)]} c={PANT2} w={12} />
      <Forma p={tubo([en(H, K, 0.08), en(H, K, 0.16)], [116, 112])} c={ARNES} w={6} />
      <Forma p={tubo([en(K, A, 0.37), en(K, A, 0.49)], [80, 78])} c={PANT2} w={7} />
      <Forma p={tubo([en(K, A, 0.47), en(K, A, 0.6), en(K, A, 0.8), en(K, A, 0.97)], [58, 62, 48, 38])} c={PIEL} w={7} />
      <Linea p={[en(K, A, 0.56), en(K, A, 0.72), en(K, A, 0.9)]} c={PIELS} w={6} o={0.8} />
      {p.pie === "talon" ? (
        // talón enganchado: el pie sigue la espinilla y la suela mira a la pared
        <g>
          <Forma p={tubo([[A[0] - ux * 6, A[1] - uy * 6], [A[0] + ux * 40, A[1] + uy * 40], [A[0] + ux * 78 - uy * 18, A[1] + uy * 78 + ux * 18]], [54, 58, 40])} c={ZAP} w={8} />
          <circle cx={A[0] + ux * 4} cy={A[1] + uy * 4} r={10} fill={ARNES} stroke={COL.tinta} strokeWidth={5} />
        </g>
      ) : (
        <g>
          <Forma p={[[A[0] - 30, A[1] - 8], [A[0] + 30, A[1] - 6], [A[0] + 38, A[1] + 42], [A[0] + 4, A[1] + 58], [A[0] - 42, A[1] + 54], [A[0] - 40, A[1] + 18]]} c={ZAP} w={8} />
          <path d={`M${A[0] - 40} ${A[1] + 52} L${A[0] + 36} ${A[1] + 46}`} stroke={COL.tinta} strokeWidth={12} strokeLinecap="round" />
          <path d={`M${A[0] - 20} ${A[1] + 6} q20 8 40 0`} stroke={ARNES} strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

/** Torso y cadera con proporciones: espalda que se estrecha en la cintura, glúteos redondeados, arnés ajustado. */
const Tronco: React.FC = () => (
  <g>
    {/* espalda (se ve desde las costillas) y brazos que suben fuera de cuadro */}
    <Forma p={[[420, -40], [700, -40], [690, 170], [664, 318], [560, 332], [456, 318], [430, 170]]} c={JERSEY} />
    <Linea p={[[560, 20], [560, 300]]} c={JERSEY_S} w={8} o={0.6} />
    <Forma p={[[456, 300], [664, 300], [690, 380], [686, 470], [640, 528], [560, 536], [480, 528], [434, 470], [430, 380]]} c={PANT} />
    <Linea p={[[560, 400], [560, 520]]} c={PANT2} w={8} />
    <Forma p={[[444, 300], [676, 300], [682, 344], [560, 356], [438, 344]]} c={ARNES} w={7} />
    <Forma p={[[542, 282], [580, 282], [592, 384], [560, 398], [530, 384]]} c={COL.menta} w={7} />
    <path d="M534 282 L588 282" stroke={COL.tinta} strokeWidth={8} />
  </g>
);

export const Escena: React.FC<{ c: Config }> = ({ c }) => {
  const m = mosqueton(c);
  const abajo: Pt[] = [m, [m[0] + 2, m[1] + 60], [m[0] + 6, m[1] + 600]];
  const cuerda: Pt[] = [...c.cuerda.slice(0, -1), m];
  const [d0, d1] = c.delante ?? [-1, -1];
  return (
    <g>
      <Roca c={c} />
      {/* sombra del cuerpo: la escaladora está separada de la pared */}
      <g opacity={0.13} transform="translate(34 26)">
        <path d={cr(tubo([HI, c.izq.K, c.izq.A], [100, 66, 44]))} fill="#000" />
        <path d={cr(tubo([HD, c.der.K, c.der.A], [100, 66, 44]))} fill="#000" />
        <path d="M420 -40 L700 -40 L690 470 L640 528 L480 528 L430 470 Z" fill="#000" />
      </g>
      <Cinta c={c} />
      <Cuerda p={abajo} sombra={6} />
      <Cuerda p={cuerda} sombra={10} />
      <Tronco />
      <PiernaD H={HI} p={c.izq} />
      <PiernaD H={HD} p={c.der} />
      {d0 >= 0 && <Cuerda p={cuerda.slice(d0, d1 + 1)} sombra={14} />}
      <Cinta c={c} frente />
    </g>
  );
};

// ——— Las 4 situaciones ———
/** 1 · travesía ✗: la cinta quedó abajo a la izquierda; la cuerda cruza por fuera del gemelo izquierdo. */
export const TRAVESIA: Config = {
  izq: { K: [384, 800], A: [312, 1030] }, der: { K: [806, 640], A: [828, 870] },
  chapa: [150, 1120], cintaDir: 6,
  cuerda: [NUDO, [540, 680], [470, 812], [394, 900], [352, 944], [318, 980], [270, 1060], [222, 1150], [180, 1220], [154, 1252]],
  delante: [3, 6], presas: [[312, 1096], [850, 936]],
};
/** 2 · recto por encima de la chapa ✓: la cuerda baja entre las piernas a la cinta de abajo. */
export const ENTRE: Config = {
  izq: { K: [400, 790], A: [380, 1020] }, der: { K: [736, 770], A: [742, 990] },
  chapa: [570, 1100],
  cuerda: [NUDO, [562, 680], [566, 820], [568, 960], [567, 1100], [562, 1232]],
  presas: [[372, 1086], [752, 1056]],
};
/** 3 · paso alto ✓: el pie derecho sube por encima de la cuerda, que queda entre la espinilla y la roca. */
export const PASOALTO: Config = {
  izq: { K: [420, 800], A: [372, 1034] }, der: { K: [812, 620], A: [774, 846] },
  chapa: [1010, 990], cintaDir: -8,
  cuerda: [NUDO, [600, 640], [680, 720], [760, 780], [840, 846], [930, 960], [1022, 1120]],
  presas: [[372, 1100], [786, 912]],
};
/** 4 · talón en desplome ✗: talón enganchado a la derecha, la cuerda pasa por fuera del talón hacia la cinta. */
export const TALON: Config = {
  izq: { K: [430, 790], A: [392, 1024] }, der: { K: [830, 470], A: [1010, 404], pie: "talon" },
  chapa: [1180, 300], cintaDir: 10,
  cuerda: [NUDO, [660, 560], [800, 510], [920, 450], [1000, 414], [1060, 410], [1150, 428]],
  delante: [3, 5], presas: [[392, 1090], [1060, 400]], desplome: true,
};
