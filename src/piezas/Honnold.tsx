// Caricatura de Alex Honnold para Escalador (prop `Cabeza`). Mismo sistema que la cabeza genérica: mira a +x.
// Rasgos exagerados para el parecido: cara larga y estrecha con pómulos marcados y mejillas hundidas, mandíbula larga,
// ojos grandes y muy abiertos (blanco alrededor de la pupila, sin contorno: no deben parecer gafas), cejas rectas y gruesas,
// orejas grandes y separadas, pelo castaño corto con flequillo hacia un lado, sonrisa ancha de muchos dientes, cuello largo.
import React from "react";
import type { Cara } from "./Escalador";

export const PIEL_H = "#EBBE98", SOMBRA_H = "#C8946D", PELO_H = "#4A2E1A", TINTA_H = "#141B26";
/** Ropa (no tiene por qué ser la del día): camiseta roja, pantalón caqui, sin arnés ni casco, manos sin guante. */
export const ASPECTO_H = { chaqueta: "#C0503E", chaquetaSombra: "#8E3A2D", pantalon: "#8C7B5E", casco: null, arnes: false, manos: "piel" as const, piel: PIEL_H, pielSombra: SOMBRA_H };

export const CabezaHonnold: React.FC<{ cara: Cara }> = ({ cara }) => {
  const st = { stroke: TINTA_H, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const cerrados = cara === "cerrados";
  const sonrisa = cara === "alivio";
  return (
    <g transform="translate(2 -18)">
      <rect x={-11} y={24} width={20} height={40} rx={8} fill={SOMBRA_H} />
      {/* oreja grande y separada */}
      <path d="M-14 -8 C-32 -14 -34 18 -16 20 Z" fill={PIEL_H} stroke={SOMBRA_H} strokeWidth={3} />
      <path d="M-18 -4 C-27 -4 -27 12 -18 13" stroke={SOMBRA_H} strokeWidth={3} fill="none" />
      {/* cara larga y estrecha, mandíbula larga */}
      <path d="M-18 -30 C-8 -46 22 -46 29 -28 C33 -16 33 -4 31 8 C30 24 26 38 14 44 C6 47 -4 44 -9 36 C-14 26 -16 14 -17 0 C-19 -12 -20 -22 -18 -30 Z" fill={PIEL_H} />
      {/* pómulo y mejilla hundida */}
      <path d="M2 10 C6 16 8 22 6 30" stroke={SOMBRA_H} strokeWidth={4} fill="none" opacity={0.7} />
      <path d="M-14 8 C-12 22 -8 32 0 38" stroke={SOMBRA_H} strokeWidth={5} fill="none" opacity={0.45} />
      {/* pelo corto con flequillo hacia delante */}
      <path d="M-21 -2 C-26 -28 -10 -50 12 -49 C27 -48 36 -38 33 -24 C27 -30 18 -31 10 -27 C4 -30 -2 -27 -6 -22 C-10 -18 -13 -12 -15 -2 Z" fill={PELO_H} />
      <path d="M8 -48 C18 -50 30 -44 34 -30 C30 -34 22 -36 16 -34 Z" fill={PELO_H} />
      {/* cejas rectas y gruesas */}
      {cara === "esfuerzo"
        ? <path d="M3 -15 L15 -12 M20 -12 L31 -15" {...st} strokeWidth={6.5} />
        : <path d="M2 -18 L15 -18 M20 -18 L31 -17" {...st} strokeWidth={6.5} />}
      {/* ojos grandes, muy abiertos, sin contorno */}
      {cerrados || sonrisa
        ? <path d="M3 -7 Q9 -12 14 -7 M20 -7 Q26 -12 31 -7" {...st} strokeWidth={3.5} />
        : <g>
            <ellipse cx={9} cy={-7} rx={6.5} ry={7.5} fill="#fff" />
            <ellipse cx={26} cy={-7} rx={5.8} ry={7} fill="#fff" />
            <circle cx={10.5} cy={-6.5} r={2.6} fill={TINTA_H} /><circle cx={27.5} cy={-6.5} r={2.4} fill={TINTA_H} />
            <path d="M3 -12 Q9 -16 15 -12 M21 -12 Q26 -15 31 -12" {...st} strokeWidth={2.5} />
          </g>}
      {/* nariz larga */}
      <path d="M19 -4 L25 10 Q22 13 17 11" {...st} strokeWidth={2.8} />
      {/* boca: sonrisa ancha de dientes (su sonrisa) o media sonrisa tranquila */}
      {sonrisa
        ? <g><path d="M5 19 Q19 36 33 17 Q19 23 5 19 Z" fill="#fff" stroke={TINTA_H} strokeWidth={2.6} strokeLinejoin="round" /><path d="M12 22 L13 27 M19 23 L19 29 M26 22 L25 27" stroke={TINTA_H} strokeWidth={1.4} /></g>
        : cara === "esfuerzo"
          ? <path d="M11 23 L29 21" {...st} strokeWidth={3.5} />
          : <path d="M8 21 Q20 27 32 18" {...st} strokeWidth={3.5} />}
    </g>
  );
};
