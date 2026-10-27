// Mano en primer plano (macro) con la palma hacia cámara y los dedos arriba: para enseñar las yemas.
// Estados de yema: normal · fina (rosa, brillante) · esparadrapo · flapper (piel levantada) · lijada.
// También: Regleta (canto de roca en macro) y Polvo (nube de magnesio).
import React from "react";
import { random } from "remotion";

export type Yema = "normal" | "fina" | "esparadrapo" | "flapper" | "lijada";
const ROSA = "#E9958A", ROSA_C = "#F6C1B6", CARNE = "#D9575A", BLANCO = "#F4F6F8", TINTA = "#141B26";

export type PropsMano = {
  x: number; y: number; s?: number; rot?: number;
  piel?: string; pielS?: string; manga?: string;
  /** Estado de cada yema: [índice, corazón, anular, meñique] */ yemas?: Yema[];
  /** 0–1: vueltas de esparadrapo ya puestas (para animar) */ cinta?: number;
  /** 0–1: cuánto se levanta el flapper */ abre?: number;
  /** 0–1: magnesio encima */ magnesio?: number;
  /** flexión de los dedos (0 = estirados, 1 = medio cerrados) */ cierra?: number;
};

const DEDOS = [{ dx: -111, L: 230 }, { dx: -37, L: 262 }, { dx: 37, L: 244 }, { dx: 111, L: 196 }];

/** (x, y) = centro de la base de los dedos. */
export const Mano: React.FC<PropsMano> = ({ x, y, s = 1, rot = 0, piel = "#B9825A", pielS = "#94613E", manga = "#3E7C59", yemas = [], cinta = 1, abre = 0, magnesio = 0, cierra = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* antebrazo y manga */}
    <rect x={-120} y={150} width={240} height={700} rx={60} fill={piel} />
    <rect x={-150} y={330} width={300} height={600} rx={50} fill={manga} />
    {/* palma */}
    <rect x={-160} y={-30} width={320} height={300} rx={90} fill={piel} />
    <path d="M-120 140 Q0 200 120 120" stroke={pielS} strokeWidth={8} fill="none" opacity={0.6} />
    {/* pulgar */}
    <g transform="translate(-150 150) rotate(-38)"><rect x={-40} y={-170} width={80} height={190} rx={40} fill={piel} /><ellipse cx={0} cy={-135} rx={30} ry={30} fill={ROSA_C} opacity={0.5} /></g>
    {DEDOS.map((d, i) => {
      const L = d.L * (1 - cierra * 0.35), est = yemas[i] ?? "normal", top = -L;
      return (
        <g key={i} transform={`translate(${d.dx} 0)`}>
          <rect x={-34} y={top} width={68} height={L + 30} rx={34} fill={piel} />
          {[0.38, 0.68].map((k) => <path key={k} d={`M-20 ${top + L * k} q20 8 40 0`} stroke={pielS} strokeWidth={5} fill="none" strokeLinecap="round" />)}
          {/* yema */}
          {est !== "normal" && <ellipse cx={0} cy={top + 38} rx={30} ry={36} fill={ROSA} />}
          {est !== "normal" && <ellipse cx={-8} cy={top + 26} rx={9} ry={13} fill="#fff" opacity={0.45} />}
          {est === "lijada" && [0, 1, 2, 3].map((k) => <path key={k} d={`M-20 ${top + 20 + k * 11} l40 -6`} stroke="#fff" strokeWidth={3} opacity={0.6} />)}
          {est === "flapper" && <g>
            <ellipse cx={0} cy={top + 42} rx={22} ry={22} fill={CARNE} />
            <g transform={`translate(-24 ${top + 60}) rotate(${-abre * 120})`}>
              <path d="M0 0 Q4 -44 30 -46 Q54 -44 48 -6 Z" fill={piel} stroke={pielS} strokeWidth={4} />
              <path d="M10 -10 Q24 -34 40 -12" stroke={ROSA_C} strokeWidth={4} fill="none" />
            </g>
          </g>}
          {est === "esparadrapo" && <g>
            <rect x={-38} y={top + 8} width={76} height={Math.max(0, 92 * cinta)} rx={16} fill={BLANCO} />
            {Array.from({ length: Math.floor(6 * cinta) }).map((_, k) => <path key={k} d={`M-36 ${top + 18 + k * 14} L36 ${top + 14 + k * 14}`} stroke="#C9CED6" strokeWidth={3} />)}
          </g>}
        </g>
      );
    })}
    {magnesio > 0 && <g opacity={magnesio}>
      {Array.from({ length: 22 }).map((_, i) => (
        <ellipse key={i} cx={(random(`mx${i}`) - 0.5) * 300} cy={-200 + random(`my${i}`) * 420} rx={14 + random(`mr${i}`) * 26} ry={10 + random(`mq${i}`) * 16} fill={BLANCO} opacity={0.35 + random(`mo${i}`) * 0.4} />
      ))}
    </g>}
  </g>
);

/** Canto de roca en macro, con magnesio. (y) = altura del canto. */
export const Regleta: React.FC<{ y: number; roca?: string; rocaS?: string; magnesio?: number }> = ({ y, roca = "#8B8A86", rocaS = "#5E5D5A", magnesio = 0.6 }) => (
  <g>
    <rect x={-100} y={-200} width={1300} height={y + 200} fill={roca} />
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={random(`rx${i}`) * 1080} cy={random(`ry${i}`) * y} r={20 + random(`rr${i}`) * 60} fill={rocaS} opacity={0.25} />)}
    <rect x={-100} y={y} width={1300} height={2200} fill={rocaS} />
    <path d={`M-100 ${y + 70} Q540 ${y + 110} 1200 ${y + 70} L1200 ${y + 2200} L-100 ${y + 2200} Z`} fill="#000" opacity={0.25} />
    <path d={`M-100 ${y} L1200 ${y}`} stroke={BLANCO} strokeWidth={14} opacity={magnesio} />
    <path d={`M180 ${y - 4} q160 -12 320 0 q120 6 300 -2`} stroke={BLANCO} strokeWidth={22} opacity={magnesio * 0.7} strokeLinecap="round" />
  </g>
);

/** Nube de magnesio que se abre desde (x, y). k = fotogramas desde que empieza. */
export const Polvo: React.FC<{ x: number; y: number; k: number; n?: number; seed?: string }> = ({ x, y, k, n = 16, seed = "p" }) => (
  <g>
    {k >= 0 && Array.from({ length: n }).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2, r = k * (3 + random(`${seed}r${i}`) * 5);
      return <circle key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r * 0.6 - k * 1.2} r={8 + random(`${seed}s${i}`) * 12 + k * 0.6} fill={BLANCO} opacity={Math.max(0, 0.75 - k / 26)} />;
    })}
  </g>
);

export const TINTA_MANO = TINTA;
