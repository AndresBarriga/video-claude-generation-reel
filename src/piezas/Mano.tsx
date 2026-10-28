// Primeros planos del cuerpo, en el estilo de los personajes: formas gruesas, contorno oscuro, color plano, nada de manchas sueltas.
// Mano (palma a cámara, dedos arriba) · Yema (un solo dedo enorme: el estado de la piel se lee de un vistazo)
// Antebrazo (hinchado, con venas: «la bomba») · Regleta (canto en macro) · Polvo (nube de magnesio).
import React from "react";
import { random } from "remotion";

export type Yema = "normal" | "fina" | "esparadrapo" | "flapper" | "lijada";
export const TINTA_MANO = "#141B26";
const T = TINTA_MANO, ROSA = "#EE8E86", ROSA_C = "#F8C3BA", CARNE = "#C9384A", BLANCO = "#F4F6F8";

type Piel = { piel?: string; pielS?: string; manga?: string };
const P0 = { piel: "#B9825A", pielS: "#94613E", manga: "#3E7C59" };

export type PropsMano = Piel & {
  x: number; y: number; s?: number; rot?: number;
  /** Estado de cada yema: [índice, corazón, anular, meñique] */ yemas?: Yema[];
  /** 0–1: esparadrapo ya puesto */ cinta?: number;
  /** 0–1: cuánto se levanta el flapper */ abre?: number;
  /** 0–1: capa de magnesio (tinte blanco uniforme) */ magnesio?: number;
  /** 0–1: dedos flexionados (coger un canto) */ cierra?: number;
};

const DEDOS = [{ dx: -102, L: 214 }, { dx: -34, L: 244 }, { dx: 34, L: 228 }, { dx: 100, L: 184 }];
const W = 64; // grosor de dedo

/** Mano en primer plano. (x, y) = centro de la base de los dedos. */
export const Mano: React.FC<PropsMano> = ({ x, y, s = 1, rot = 0, piel = P0.piel, pielS = P0.pielS, manga = P0.manga, yemas = [], cinta = 1, abre = 0, magnesio = 0, cierra = 0 }) => {
  const dedos = DEDOS.map((d) => ({ ...d, L: d.L * (1 - cierra * 0.4) }));
  const formas = (fill: string, stroke?: string) => {
    const st = stroke ? { stroke, strokeWidth: 7, strokeLinejoin: "round" as const } : {};
    return (
      <>
        <rect x={-110} y={150} width={220} height={760} rx={60} fill={fill} {...st} />
        <g transform="translate(-140 150) rotate(-40)"><rect x={-W / 2 - 4} y={-170} width={W + 8} height={200} rx={(W + 8) / 2} fill={fill} {...st} /></g>
        {dedos.map((d, i) => <rect key={i} x={d.dx - W / 2} y={-d.L} width={W} height={d.L + 40} rx={W / 2} fill={fill} {...st} />)}
        <rect x={-150} y={-20} width={300} height={290} rx={86} fill={fill} {...st} />
      </>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {formas(piel, T)}
      {/* tapa las costuras entre dedos y palma: silueta limpia */}
      <rect x={-146} y={-14} width={292} height={60} rx={20} fill={piel} />
      <rect x={-106} y={160} width={212} height={60} fill={piel} />
      <path d="M-100 150 Q0 190 96 120" stroke={pielS} strokeWidth={8} fill="none" strokeLinecap="round" />
      {dedos.map((d, i) => <path key={i} d={`M${d.dx - 16} ${-d.L * 0.45} q16 7 32 0`} stroke={pielS} strokeWidth={6} fill="none" strokeLinecap="round" />)}
      {magnesio > 0 && <g opacity={magnesio * 0.42}>{formas(BLANCO)}</g>}
      {dedos.map((d, i) => <g key={i} transform={`translate(${d.dx} ${-d.L + W / 2})`}><Punta estado={yemas[i] ?? "normal"} w={W} cinta={cinta} abre={abre} piel={piel} pielS={pielS} /></g>)}
      <rect x={-150} y={480} width={300} height={500} rx={46} fill={manga} stroke={T} strokeWidth={7} />
    </g>
  );
};

/** Punta de un dedo de ancho w, centrada en (0,0) = centro de la yema. */
const Punta: React.FC<{ estado: Yema; w: number; cinta?: number; abre?: number; lija?: number; piel: string; pielS: string }> = ({ estado, w, cinta = 1, abre = 0, lija = 0, piel, pielS }) => {
  const r = w * 0.42, sw = Math.max(3, w * 0.06);
  if (estado === "normal") return null;
  return (
    <g>
      <ellipse cx={0} cy={0} rx={r} ry={r * 1.15} fill={ROSA} stroke={T} strokeWidth={sw * 0.6} />
      <ellipse cx={-r * 0.3} cy={-r * 0.35} rx={r * 0.28} ry={r * 0.4} fill={ROSA_C} />
      {estado === "lijada" && [-0.4, -0.1, 0.2, 0.5].map((k, i) => <path key={i} d={`M${-r * 0.7} ${k * r * 1.6} l${r * 1.4} ${-r * 0.2}`} stroke={ROSA_C} strokeWidth={sw * 0.7} strokeLinecap="round" opacity={lija || 1} />)}
      {estado === "flapper" && <g>
        <ellipse cx={0} cy={r * 0.15} rx={r * 0.62} ry={r * 0.66} fill={CARNE} stroke={T} strokeWidth={sw * 0.5} />
        <g transform={`translate(${-r * 0.75} ${r * 0.75}) rotate(${-abre * 125})`}>
          <path d={`M0 0 Q${r * 0.1} ${-r * 1.3} ${r * 0.85} ${-r * 1.35} Q${r * 1.6} ${-r * 1.2} ${r * 1.4} ${-r * 0.1} Z`} fill={piel} stroke={T} strokeWidth={sw * 0.6} strokeLinejoin="round" />
          <path d={`M${r * 0.3} ${-r * 0.3} Q${r * 0.7} ${-r * 0.95} ${r * 1.15} ${-r * 0.35}`} stroke={pielS} strokeWidth={sw * 0.5} fill="none" />
        </g>
      </g>}
      {estado === "esparadrapo" && cinta > 0 && <g>
        <rect x={-w / 2 - sw} y={-r * 1.3} width={w + sw * 2} height={r * 2.6 * cinta} rx={w * 0.22} fill={BLANCO} stroke={T} strokeWidth={sw * 0.6} />
        {Array.from({ length: Math.floor(4 * cinta) }).map((_, k) => <path key={k} d={`M${-w / 2} ${-r * 0.9 + k * r * 0.6} L${w / 2} ${-r * 1.05 + k * r * 0.6}`} stroke="#C9CED6" strokeWidth={sw * 0.5} />)}
      </g>}
    </g>
  );
};

/** Un solo dedo enorme, de abajo arriba, yema hacia cámara. (x, y) = centro de la yema. */
export const Yema: React.FC<Piel & { x: number; y: number; s?: number; rot?: number; estado: Yema; cinta?: number; abre?: number; magnesio?: number; latido?: number }> = ({ x, y, s = 1, rot = 0, estado, cinta = 1, abre = 0, magnesio = 0, latido = 0, piel = P0.piel, pielS = P0.pielS }) => {
  const w = 300, r = w / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * (1 + latido * 0.03)})`}>
      <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0 L${r + 20} 1400 L${-r - 20} 1400 Z`} fill={piel} stroke={T} strokeWidth={12} strokeLinejoin="round" />
      {/* huella: arcos concéntricos suaves */}
      {[0.35, 0.55, 0.75].map((k, i) => <path key={i} d={`M${-r * k} ${r * 0.3} A${r * k} ${r * k * 1.1} 0 0 1 ${r * k} ${r * 0.3}`} stroke={pielS} strokeWidth={6} fill="none" opacity={0.6} />)}
      <path d={`M${-r * 0.55} ${r * 1.5} q${r * 0.55} ${r * 0.2} ${r * 1.1} 0`} stroke={pielS} strokeWidth={10} fill="none" strokeLinecap="round" />
      {magnesio > 0 && <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0 L${r + 20} 1400 L${-r - 20} 1400 Z`} fill={BLANCO} opacity={magnesio * 0.4} />}
      <g transform={`translate(0 ${r * 0.15})`}><Punta estado={estado} w={w * 0.9} cinta={cinta} abre={abre} piel={piel} pielS={pielS} /></g>
    </g>
  );
};

/** Antebrazo de lado, mano a la derecha. `bomba` 0–1 hincha el músculo y saca las venas; `latido` las hace palpitar. */
export const Antebrazo: React.FC<Piel & { x: number; y: number; s?: number; bomba?: number; latido?: number }> = ({ x, y, s = 1, bomba = 0, latido = 0, piel = P0.piel, pielS = P0.pielS, manga = P0.manga }) => {
  const b = bomba * (1 + latido * 0.04), h = 120 + b * 70;
  const vena = "#4C5F8E";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-560 ${-110} Q-150 ${-h - 30} 260 -86 L380 -96 Q470 -100 480 -10 Q470 90 380 90 L260 84 Q-150 ${h + 10} -560 110 Z`} fill={piel} stroke={T} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M-500 ${h * 0.55} Q-150 ${h + 4} 240 70`} stroke={pielS} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.7} />
      {/* puño */}
      <rect x={330} y={-110} width={190} height={210} rx={70} fill={piel} stroke={T} strokeWidth={10} />
      {[0, 1, 2].map((k) => <path key={k} d={`M${470} ${-60 + k * 55} q30 10 0 30`} stroke={T} strokeWidth={7} fill="none" strokeLinecap="round" />)}
      {/* venas: aparecen con la bomba */}
      <g opacity={Math.min(1, b * 1.4)} stroke={vena} strokeLinecap="round" fill="none">
        <path d="M-470 -20 C-330 -70 -200 -10 -60 -60 S140 -40 250 -30" strokeWidth={10 + b * 8} />
        <path d="M-300 -40 C-250 10 -150 30 -40 10" strokeWidth={8 + b * 6} />
        <path d="M-120 -55 C-60 -100 40 -100 130 -70" strokeWidth={7 + b * 5} />
      </g>
      <rect x={-760} y={-150} width={260} height={300} rx={40} fill={manga} stroke={T} strokeWidth={10} />
    </g>
  );
};

/** Canto de roca en macro: roca arriba, el canto en y, sombra debajo. */
export const Regleta: React.FC<{ y: number; roca?: string; rocaS?: string; magnesio?: number }> = ({ y, roca = "#8B8A86", rocaS = "#5E5D5A", magnesio = 0.6 }) => (
  <g>
    <rect x={-100} y={-200} width={1300} height={y + 200} fill={roca} />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${random(`rx${i}`) * 1080} ${random(`ry${i}`) * y * 0.9} q60 30 140 10`} stroke={rocaS} strokeWidth={8} fill="none" opacity={0.5} strokeLinecap="round" />)}
    <rect x={-100} y={y} width={1300} height={2200} fill={rocaS} />
    <path d={`M-100 ${y + 60} Q540 ${y + 100} 1200 ${y + 60} L1200 ${y + 2200} L-100 ${y + 2200} Z`} fill="#000" opacity={0.25} />
    <path d={`M-100 ${y} L1200 ${y}`} stroke={T} strokeWidth={8} />
    <path d={`M180 ${y - 10} q160 -10 320 0 q120 6 300 -2`} stroke={BLANCO} strokeWidth={18} opacity={magnesio * 0.8} strokeLinecap="round" />
  </g>
);

/** Nube de magnesio que se abre desde (x, y). k = fotogramas desde que empieza. */
export const Polvo: React.FC<{ x: number; y: number; k: number; n?: number; seed?: string; escala?: number }> = ({ x, y, k, n = 16, seed = "p", escala = 1 }) => (
  <g>
    {k >= 0 && Array.from({ length: n }).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2, r = k * (3 + random(`${seed}r${i}`) * 5) * escala;
      return <circle key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r * 0.6 - k * 1.2} r={(8 + random(`${seed}s${i}`) * 12 + k * 0.6) * escala} fill={BLANCO} opacity={Math.max(0, 0.75 - k / 26)} />;
    })}
  </g>
);
