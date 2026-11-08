// Escalador visto DE ESPALDAS (la cámara es el asegurador mirando la pared). Proporciones de dibujo: cabeza ≈ 1/5 del alto.
// Coordenadas de pantalla (1080×1920). detras=true: la cuerda pasa por detrás de la pierna izquierda.
import React from "react";
import { GYM } from "./comun";

const T = "#2FB8A8", TS = "#1F7F73", PA = "#2B3442", PL = "#3C4A5E", PIEL = "#E9B990", PIELS = "#C9926A";
const trazo = (d: string, w: number, c: string, o = 1) => <path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={o} />;

export const Trepador: React.FC<{ f: number; slip?: number; detras?: boolean }> = ({ f, slip = 0, detras = true }) => {
  const tr = Math.sin(f * 2.3) * 3, tr2 = Math.cos(f * 2.9) * 3;
  const tobR = 1138 + slip;
  const cuerda = detras ? "M520 1396 Q506 1300 482 1200 Q464 1080 522 950" : "M520 1396 Q380 1300 382 1130 Q384 1020 450 930";
  return (
    <g>
      {/* presas */}
      <ellipse cx={372} cy={392} rx={60} ry={48} fill="#F2C230" /><ellipse cx={708} cy={392} rx={60} ry={48} fill="#E04F8A" />
      <ellipse cx={452} cy={1200} rx={50} ry={22} fill="#6B7CE0" /><ellipse cx={676} cy={1186} rx={48} ry={22} fill="#F28A30" />
      {/* chapa: tornillo, cinta exprés y mosquetón de abajo por donde pasa la cuerda */}
      <circle cx={520} cy={1262} r={13} fill="#9AA3AE" />
      <ellipse cx={520} cy={1298} rx={18} ry={28} fill="none" stroke="#C8D0D8" strokeWidth={8} />
      <rect x={507} y={1322} width={26} height={44} rx={12} fill="#F2C230" />
      <ellipse cx={520} cy={1392} rx={18} ry={28} fill="none" stroke="#C8D0D8" strokeWidth={8} />
      {trazo(cuerda, 16, GYM.cuerda)}
      {/* piernas */}
      {trazo("M482 940 L462 1040", 98, PA)}{trazo("M462 1040 L452 1130", 76, PA)}
      {trazo("M598 940 L640 1040", 98, PA)}{trazo(`M640 1040 L672 ${tobR - 10}`, 76, PA)}
      {trazo("M512 952 L492 1030", 20, PL, 0.6)}{trazo("M620 952 L644 1030", 20, PL, 0.6)}
      <ellipse cx={452} cy={1146} rx={48} ry={32} fill="#1B2230" /><ellipse cx={452} cy={1162} rx={42} ry={14} fill="#E04F8A" />
      <ellipse cx={672} cy={tobR + 8} rx={48} ry={32} fill="#1B2230" /><ellipse cx={672} cy={tobR + 24} rx={42} ry={14} fill="#E04F8A" />
      {/* torso corto, costura y bolsa de magnesio */}
      <path d="M412 692 Q540 650 668 692 L650 918 L430 918 Z" fill={T} />
      <path d="M412 692 Q434 800 430 918 L452 918 Q446 800 454 690 Z" fill={TS} opacity={0.8} />
      <path d="M668 692 Q646 800 650 918 L628 918 Q634 800 626 690 Z" fill={TS} opacity={0.8} />
      {trazo("M540 664 L540 916", 5, TS, 0.9)}
      <ellipse cx={540} cy={968} rx={58} ry={48} fill="#7A4FA3" /><ellipse cx={540} cy={928} rx={48} ry={13} fill="#F4EFE6" opacity={0.9} />
      {trazo("M428 912 L652 912", 38, "#E0B020")}
      {trazo("M436 972 L506 964", 18, "#E0B020")}{trazo("M580 964 L654 974", 18, "#E0B020")}
      {/* brazos */}
      {trazo(`M434 706 L${350 + tr} 560`, 78, T)}{trazo(`M${350 + tr} 560 L${372 + tr} 428`, 66, TS)}
      {trazo(`M646 706 L${730 + tr2} 560`, 78, T)}{trazo(`M${730 + tr2} 560 L${708 + tr2} 428`, 66, TS)}
      <circle cx={372 + tr} cy={408} r={42} fill={PIEL} /><circle cx={372 + tr} cy={402} r={31} fill="#F4EFE6" opacity={0.75} />
      <circle cx={708 + tr2} cy={408} r={42} fill={PIEL} /><circle cx={708 + tr2} cy={402} r={31} fill="#F4EFE6" opacity={0.75} />
      {/* cabeza grande de dibujo: cuello, nuca, orejas, casco */}
      <rect x={508} y={628} width={64} height={52} fill={PIELS} />
      <ellipse cx={470} cy={590} rx={12} ry={20} fill={PIEL} /><ellipse cx={610} cy={590} rx={12} ry={20} fill={PIEL} />
      <ellipse cx={540} cy={582} rx={68} ry={74} fill="#3B2A20" />
      <path d="M466 572 Q466 470 540 466 Q614 470 614 572 Q540 544 466 572 Z" fill="#F2C230" />
      <path d="M470 574 Q540 548 610 574 L610 590 Q540 564 470 590 Z" fill="#C79A1B" />
      {trazo("M540 468 L540 548", 5, "#C79A1B", 0.9)}
      {trazo("M478 596 L482 650 M602 596 L598 650", 4, "#141B26", 0.7)}
    </g>
  );
};
