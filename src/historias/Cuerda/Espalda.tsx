// La escaladora de E11 vista DE ESPALDAS. Mismas proporciones que Escalador.tsx (cabeza r30, torso 104, piernas 66+64, brazos 52+50).
// Origen = centro de la cadera; s = escala. pie: 0 = pie izquierdo cruzado (la cuerda le pasa POR DETRÁS de la pantorrilla), 1 = pie en su sitio.
import React from "react";
import { Cuerda, TU, lerp2, type P11 } from "./comun";

export const CHAPA_L: [number, number] = [36, 214];
export const CRUCE_L: [number, number] = [17, 88]; // donde la cuerda cruza la pantorrilla (pie = 0) // chapa (cinta) en coords locales
const PIEL = TU.piel!, PIELS = TU.pielSombra!, CH = TU.chaqueta!, CHS = TU.chaquetaSombra!, PA = TU.pantalon!, CASCO = TU.casco as string, PELO = TU.pelo!;
const st = (w: number, c: string) => ({ stroke: c, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" });
const lin = (p: [number, number][]) => "M" + p.map((q) => q.join(" ")).join(" L");

/** Rodilla y talón de cada pierna según `pie` (0 cruzado → 1 en su sitio) y `alza` (0–1, el pie se levanta por encima de la cuerda). */
export const piernas = (pie: number, alza = 0) => {
  const kL = lerp2([-58, 46], [-54, 56], pie), fL0 = lerp2([62, 110], [-42, 120], pie);
  const fL: [number, number] = [fL0[0], fL0[1] - 70 * alza];
  return { hL: [-14, 4] as [number, number], kL, fL, hR: [14, 4] as [number, number], kR: [62, 26] as [number, number], fR: [84, 72] as [number, number] };
};

export const Espalda: React.FC<{ x: number; y: number; s: number; tr?: number; pie?: number; alza?: number; mira?: number; cara?: "miedo" | "alivio"; slip?: number; paso?: number }> = ({ x, y, s, tr = 0, pie = 0, alza = 0, mira = 0, cara = "miedo", slip = 0, paso = 0 }) => {
  const g = piernas(pie, alza);
  g.kR = [62 - 4 * paso, 26 - 34 * paso]; g.fR = [84 - 6 * paso, 72 - 44 * paso];
  const fR: [number, number] = [g.fR[0] + slip * 6, g.fR[1] + slip * 22];
  const hR: [number, number] = [46 - tr - 4 * paso, -194 - 60 * paso], eR: [number, number] = [54 - tr, -138 - 24 * paso];
  const ropeTop = pie < 0.5 && alza < 0.55; // la cuerda va por encima (= por detrás de la pantorrilla)
  const cuerda = `M0 10 Q${8 + tr} 120 ${CHAPA_L[0]} ${CHAPA_L[1] - 30}`;
  const pierna = (h: [number, number], k: [number, number], f: [number, number], sombra: boolean) => (
    <g>
      <path d={lin([h, k, f])} {...st(30, sombra ? "#24303E" : PA)} />
      <path d={lin([[h[0] + 6, h[1] + 4], [k[0] + 5, k[1]]])} {...st(8, "#fff")} opacity={0.08} />
      <ellipse cx={f[0]} cy={f[1] + 8} rx={16} ry={11} fill="#1B2230" />
      <path d={`M${f[0] - 13} ${f[1] + 14} Q${f[0]} ${f[1] + 20} ${f[0] + 13} ${f[1] + 14}`} {...st(5, "#E04F8A")} />
    </g>
  );
  const ty = -1.5 * tr;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Cuerda d={`M${CHAPA_L[0]} ${CHAPA_L[1] - 30} Q${CHAPA_L[0] + 6} ${CHAPA_L[1] + 140} ${CHAPA_L[0] - 4} ${CHAPA_L[1] + 700}`} w={9} />
      {!ropeTop && <Cuerda d={cuerda} w={9} />}
      {pierna(g.hR, g.kR, fR, true)}
      {pierna(g.hL, g.kL, g.fL, false)}
      {ropeTop && <Cuerda d={cuerda} w={9} />}
      {/* brazos (detrás del torso solo los hombros) */}
      <path d={lin([[-22, -90], [-56 + tr, -128], [-50 + tr, -178]])} {...st(24, CHS)} />
      <path d={lin([[22, -90], eR, hR])} {...st(24, CH)} />
      <circle cx={-50 + tr} cy={-182} r={13} fill={PIEL} /><circle cx={-50 + tr} cy={-186} r={9} fill="#F4EFE6" opacity={0.6} />
      <circle cx={hR[0]} cy={hR[1]} r={13} fill={PIEL} /><circle cx={hR[0]} cy={hR[1] - 4} r={9} fill="#F4EFE6" opacity={0.6} />
      {/* torso (espalda de la chaqueta) */}
      <g transform={`translate(0 ${ty})`}>
        <rect x={-27} y={-108} width={54} height={118} rx={24} fill={CH} />
        <path d="M14 -100 Q26 -60 22 4" {...st(10, CHS)} opacity={0.7} />
        <path d="M-10 -96 Q-14 -60 -12 -36" {...st(6, "#fff")} opacity={0.12} />
        <rect x={-26} y={-28} width={52} height={40} rx={17} fill={PA} />
        <rect x={-28} y={-34} width={56} height={11} rx={4} fill="#F2C230" />
        <path d="M-24 -6 Q-14 6 -4 2 M24 -6 Q14 6 4 2" {...st(6, "#F2C230")} />
        <rect x={-13} y={-56} width={26} height={28} rx={9} fill="#7A4FA3" /><path d="M-13 -54 Q0 -62 13 -54" {...st(5, "#F4EFE6")} />
      </g>
      {/* cabeza: cuello, trenzas sobre la espalda, orejas, nuca, casco; con mira>0 gira y asoma la cara */}
      <g transform={`translate(${-6 * mira} ${-140 + ty}) rotate(${-14 * mira})`}>
        <rect x={-9} y={20} width={18} height={14} fill={PIELS} />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={10 - i * 1.5} cy={22 + i * 14} r={9 - i} fill={PELO} />)}
        <circle cx={-29} cy={4} r={6} fill={PIEL} /><circle cx={29} cy={4} r={6} fill={PIEL} />
        <circle r={30} fill={PELO} />
        {mira > 0 && <g>
          <path d={`M-30 -2 A30 30 0 0 0 ${-30 + 22 * mira} 26 L${-26 + 10 * mira} -2 Z`} fill={PIEL} />
          {cara === "miedo"
            ? <g><ellipse cx={-23} cy={4} rx={5} ry={7} fill="#fff" /><circle cx={-24} cy={8} r={3} fill="#141B26" /><path d="M-30 -6 L-18 -2" {...st(3.5, "#141B26")} /><ellipse cx={-25} cy={20} rx={3.5} ry={4.5} fill="#141B26" /></g>
            : <g><path d="M-29 4 Q-24 0 -19 4" {...st(3.5, "#141B26")} /><path d="M-29 18 Q-24 22 -19 18" {...st(3.5, "#141B26")} /></g>}
        </g>}
        <path d="M-35 -4 A35 36 0 0 1 35 -4 L38 2 L-38 2 Z" fill={CASCO} />
        <path d="M-26 -18 Q0 -38 22 -20" {...st(4, "#fff")} opacity={0.35} />
        <path d="M-30 2 L-24 22 M30 2 L24 22" {...st(3, "#141B26")} opacity={0.6} />
      </g>
    </g>
  );
};
