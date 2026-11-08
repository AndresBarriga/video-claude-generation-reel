// Escalador visto DE ESPALDAS (la cámara es el asegurador mirando la pared). Proporciones reales: cabeza ≈ 1/7,8 del alto.
// Coordenadas locales ~1080×1600; se dibuja con transform desde la escena. detras=true: la cuerda pasa por detrás de la pierna izquierda.
import React from "react";
import { GYM } from "./comun";

const T = "#2FB8A8", TS = "#1F7F73", PA = "#2B3442", PL = "#3C4A5E", PIEL = "#E9B990", PIELS = "#C9926A";
const trazo = (d: string, w: number, c: string, o = 1) => <path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={o} />;

export const Trepador: React.FC<{ f: number; slip?: number; detras?: boolean }> = ({ f, slip = 0, detras = true }) => {
  const tr = Math.sin(f * 2.3) * 2.6, tr2 = Math.cos(f * 2.9) * 2.6;
  const rodR = 1160, tobR = 1290 + slip, tobL = 1330;
  const cuerda = detras
    ? "M500 1560 Q482 1430 462 1300 Q448 1150 520 1030"
    : "M500 1560 Q372 1450 374 1250 Q376 1110 462 1020";
  return (
    <g>
      {/* presas: manos y pies */}
      <ellipse cx={346} cy={392} rx={58} ry={46} fill="#F2C230" /><ellipse cx={734} cy={392} rx={58} ry={46} fill="#E04F8A" />
      <ellipse cx={440} cy={1388} rx={46} ry={22} fill="#6B7CE0" /><ellipse cx={700} cy={1368} rx={44} ry={22} fill="#F28A30" />
      {/* chapa (cinta exprés) por debajo de él y cuerda subiendo al arnés */}
      <circle cx={500} cy={1440} r={13} fill="#9AA3AE" />
      <ellipse cx={500} cy={1478} rx={17} ry={28} fill="none" stroke="#C8D0D8" strokeWidth={8} />
      <rect x={487} y={1500} width={26} height={48} rx={12} fill="#F2C230" />
      <ellipse cx={500} cy={1572} rx={17} ry={28} fill="none" stroke="#C8D0D8" strokeWidth={8} />
      {trazo(cuerda, 16, GYM.cuerda)}
      {/* piernas */}
      {trazo(`M478 1012 L452 1170`, 100, PA)}{trazo(`M452 1170 L440 ${tobL - 12}`, 76, PA)}
      {trazo(`M602 1012 L650 ${rodR}`, 100, PA)}{trazo(`M650 ${rodR} L${692} ${tobR - 12}`, 76, PA)}
      {trazo(`M520 1020 L492 1160`, 22, PL, 0.6)}{trazo(`M628 1020 L660 1150`, 22, PL, 0.6)}
      {/* zapatillas vistas desde el talón */}
      <ellipse cx={440} cy={tobL + 12} rx={46} ry={32} fill="#1B2230" /><ellipse cx={440} cy={tobL + 28} rx={40} ry={14} fill="#E04F8A" />
      <ellipse cx={692} cy={tobR + 12} rx={46} ry={32} fill="#1B2230" /><ellipse cx={692} cy={tobR + 28} rx={40} ry={14} fill="#E04F8A" />
      {/* torso con costura central y bolsa de magnesio */}
      <path d="M392 692 Q540 648 688 692 L664 1004 L416 1004 Z" fill={T} />
      <path d="M392 692 Q420 800 416 1004 L440 1004 Q430 800 440 690 Z" fill={TS} opacity={0.8} />
      <path d="M688 692 Q660 800 664 1004 L640 1004 Q650 800 640 690 Z" fill={TS} opacity={0.8} />
      {trazo("M540 664 L540 1000", 5, TS, 0.9)}
      {trazo("M440 760 Q540 790 640 760", 6, TS, 0.5)}
      <ellipse cx={540} cy={1050} rx={62} ry={50} fill="#7A4FA3" /><ellipse cx={540} cy={1008} rx={50} ry={14} fill="#F4EFE6" opacity={0.9} />
      {trazo("M420 996 L660 996", 40, "#E0B020")}
      {trazo("M428 1062 L508 1052", 20, "#E0B020")}{trazo("M586 1052 L670 1066", 20, "#E0B020")}
      {/* brazos arriba, temblando */}
      {trazo(`M414 706 L${330 + tr} 560`, 78, T)}{trazo(`M${330 + tr} 560 L${346 + tr} 436`, 66, TS)}
      {trazo(`M666 706 L${752 + tr2} 560`, 78, T)}{trazo(`M${752 + tr2} 560 L${734 + tr2} 436`, 66, TS)}
      <circle cx={346 + tr} cy={414} r={40} fill={PIEL} /><circle cx={346 + tr} cy={408} r={30} fill="#F4EFE6" opacity={0.75} />
      <circle cx={734 + tr2} cy={414} r={40} fill={PIEL} /><circle cx={734 + tr2} cy={408} r={30} fill="#F4EFE6" opacity={0.75} />
      {/* cabeza: cuello, nuca, orejas, casco */}
      <rect x={510} y={618} width={60} height={56} fill={PIELS} />
      <ellipse cx={486} cy={604} rx={10} ry={17} fill={PIEL} /><ellipse cx={594} cy={604} rx={10} ry={17} fill={PIEL} />
      <ellipse cx={540} cy={590} rx={54} ry={58} fill="#3B2A20" />
      <path d="M470 566 Q470 492 540 488 Q610 492 610 566 Q540 540 470 566 Z" fill="#F2C230" />
      <path d="M474 566 Q540 546 606 566 L606 580 Q540 560 474 580 Z" fill="#C79A1B" />
      {trazo("M540 490 L540 548", 5, "#C79A1B", 0.9)}
      {trazo("M486 590 L486 640 M594 590 L594 640", 4, "#141B26", 0.7)}
    </g>
  );
};
