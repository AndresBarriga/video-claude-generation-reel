// Caricatura de Alex Honnold para Escalador (prop `Cabeza`). Mismo sistema que la cabeza genérica: mira a +x.
// Pocos rasgos, muy marcados (notas de Andrés, 28-oct):
// cabeza ALARGADA y estrecha, mandíbula larga y cuadrada, pómulos marcados; ojos GRANDES y redondos con mucho blanco y mirada fija;
// expresión de calma inexpresiva (boca recta o sonrisa mínima y torpe); cejas rectas, oscuras y separadas; nariz larga y recta;
// pelo oscuro, corto y revuelto, sin raya. Cuerpo fibroso (torso estrecho, brazos largos, manos grandes), camiseta roja,
// bolsa de magnesio y pies de gato: ver ASPECTO_H y CUERPO_H.
import React from "react";
import type { Cara } from "./Escalador";

export const PIEL_H = "#EBBE98", SOMBRA_H = "#C38D66", PELO_H = "#24170E", TINTA_H = "#141B26";
export const ASPECTO_H = { chaqueta: "#C43D2F", chaquetaSombra: "#8E2C22", pantalon: "#8C7B5E", casco: null, arnes: false, manos: "piel" as const, piel: PIEL_H, pielSombra: SOMBRA_H };
/** Props de cuerpo para Escalador: fibroso, brazos largos, manos grandes, pies de gato, bolsa de magnesio. */
export const CUERPO_H = { cuerpo: { torso: 38, brazos: 1.22, manos: 17, grosor: 0.8 }, pies: "#E0B23A", bolsa: "#3A4A63" };

export const CabezaHonnold: React.FC<{ cara: Cara }> = ({ cara }) => {
  const st = { stroke: TINTA_H, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const cerrados = cara === "cerrados";
  return (
    <g transform="translate(0 -26)">
      <rect x={-9} y={30} width={18} height={46} rx={7} fill={SOMBRA_H} />
      {/* oreja */}
      <path d="M-12 -12 C-28 -16 -29 12 -13 14 Z" fill={PIEL_H} stroke={SOMBRA_H} strokeWidth={3} />
      {/* cabeza alargada y estrecha: frente, pómulo, mejilla hundida, mandíbula larga y cuadrada */}
      <path d="M-16 -40 C-10 -56 20 -58 28 -42 C32 -32 33 -20 33 -10 L35 0 C33 6 30 10 29 16 L30 38 L24 48 L0 49 L-12 40 C-16 26 -18 10 -18 -6 C-19 -22 -19 -32 -16 -40 Z" fill={PIEL_H} />
      <path d="M29 16 C25 20 22 24 22 32" stroke={SOMBRA_H} strokeWidth={4} fill="none" opacity={0.75} />
      <path d="M-12 40 L0 49 L24 48" stroke={SOMBRA_H} strokeWidth={3} fill="none" opacity={0.6} />
      {/* pelo oscuro, corto, revuelto, sin raya */}
      <path d="M-19 -14 C-24 -38 -12 -60 10 -60 C26 -60 36 -48 33 -34 C30 -36 27 -34 25 -37 C22 -33 18 -36 15 -33 C12 -37 8 -33 5 -36 C2 -32 -2 -35 -5 -31 C-8 -33 -11 -28 -12 -22 C-14 -20 -16 -17 -19 -14 Z" fill={PELO_H} />
      {[[-8, -55], [2, -60], [13, -61], [24, -56], [31, -46]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.5} fill={PELO_H} />)}
      {/* cejas rectas, oscuras, separadas */}
      <path d={cara === "esfuerzo" ? "M-4 -28 L10 -25 M17 -25 L31 -28" : "M-5 -28 L10 -28 M17 -28 L31 -27"} {...st} strokeWidth={6} />
      {/* ojos grandes y redondos, mucho blanco, pupila pequeña: mirada fija */}
      {cerrados
        ? <path d="M-3 -16 L10 -16 M17 -16 L30 -16" {...st} strokeWidth={3.5} />
        : <g>
            <circle cx={3} cy={-16} r={9.5} fill="#fff" stroke={TINTA_H} strokeOpacity={0.25} strokeWidth={1.5} />
            <circle cx={24} cy={-16} r={9} fill="#fff" stroke={TINTA_H} strokeOpacity={0.25} strokeWidth={1.5} />
            <circle cx={4} cy={-16} r={2.6} fill={TINTA_H} /><circle cx={25} cy={-16} r={2.6} fill={TINTA_H} />
          </g>}
      {/* nariz larga y recta */}
      <path d="M14 -12 L17 12 L12 14" {...st} strokeWidth={3} />
      {/* boca: recta, o sonrisa mínima y torpe; «alivio» = su sonrisa de dientes en la cumbre */}
      {cara === "alivio"
        ? <path d="M3 26 Q15 38 28 24 Q15 29 3 26 Z" fill="#fff" stroke={TINTA_H} strokeWidth={2.6} strokeLinejoin="round" />
        : cara === "esfuerzo"
          ? <path d="M5 28 L26 28" {...st} strokeWidth={3.5} />
          : <path d="M5 28 L21 28 Q25 28 27 25" {...st} strokeWidth={3.5} />}
    </g>
  );
};
