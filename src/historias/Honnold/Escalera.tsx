// Gancho, «tu escalera» y cierre: tú en lo alto de una escalera de mano cambiando una bombilla; la escalera se balancea y la pierna tiembla.
// Pies, mano en la escalera y mano con la bombilla se colocan con el esqueleto de Escalador (IK), no a ojo.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Contador, Etiqueta, Svg, Zoom } from "./comun";
import { temblor } from "../Pierna/comun";

const TU = { chaqueta: "#2F7F8A", chaquetaSombra: "#215C64", pantalon: "#39424F", casco: null, peinado: "rizado" as const, pelo: "#2B1D14", arnes: false, manos: "piel" as const };
const S = 2.2, SUELO = 1720, PELDANO = 1240;
const HX = 430, HY = PELDANO - 140.6 * S; // cadera: suela del pie (pose «pie») apoyada en el peldaño
const HOMBRO: [number, number] = [0, -88];
/** IK de dos segmentos (52, 50) en el convenio de Escalador (0 = abajo, 90 = +x). Objetivo relativo a la cadera, sin escalar. */
const alcanza = (t: [number, number]): [number, number] => {
  const dx = t[0] - HOMBRO[0], dy = t[1] - HOMBRO[1], d = Math.min(101, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), a = Math.acos((52 * 52 + d * d - 50 * 50) / (2 * 52 * d));
  const a1 = base + a, ex = HOMBRO[0] + Math.sin(a1) * 52, ey = HOMBRO[1] + Math.cos(a1) * 52;
  return [(a1 * 180) / Math.PI, (Math.atan2(t[0] - ex, t[1] - ey) * 180) / Math.PI];
};
const TAPA: [number, number] = [HX + 56 * S, HY - 20 * S]; // tapa de la escalera, donde agarra
const BOMBILLA: [number, number] = [HX + 12 * S, HY - 186 * S]; // portalámparas del techo

export const PlanoEscalera: React.FC<{ d: number; titulo?: string; m?: number; nota?: string }> = ({ d, titulo, m, nota }) => {
  const f = useCurrentFrame();
  const tr = temblor(f, 1), vaiven = Math.sin(f / 7) * 1.6;
  const manoB = alcanza([(TAPA[0] - HX) / S, (TAPA[1] - HY) / S]);
  const manoA = alcanza([(BOMBILLA[0] - HX) / S, (BOMBILLA[1] - HY) / S + 6]);
  const pata = (dx: number) => `M${TAPA[0]} ${TAPA[1]} L${TAPA[0] + dx} ${SUELO}`;
  const enPata = (y: number, dx: number) => TAPA[0] + dx * ((y - TAPA[1]) / (SUELO - TAPA[1]));
  return (
    <Camara d={d} empuje={0.05} foco="45% 45%">
      <Svg>
        <rect width={1080} height={1920} fill="#DDE3EA" />
        <Zoom s={1.3} cx={HX + 40} cy={HY - 80} tx={540} ty={880}>
        <rect y={0} width={1080} height={BOMBILLA[1] - 70} fill="#C9D2DC" />
        <rect x={700} y={760} width={220} height={160} rx={8} fill="#B7C3CF" stroke="#8C99A6" strokeWidth={8} />
        <rect y={SUELO} width={1080} height={300} fill="#B08A62" />
        {/* cable y portalámparas */}
        <path d={`M${BOMBILLA[0]} ${BOMBILLA[1] - 70} L${BOMBILLA[0]} ${BOMBILLA[1] - 24}`} stroke="#2A3442" strokeWidth={6} />
        <rect x={BOMBILLA[0] - 16} y={BOMBILLA[1] - 30} width={32} height={22} rx={5} fill="#2A3442" />
        <ellipse cx={(HX + TAPA[0]) / 2} cy={SUELO + 4} rx={260} ry={18} fill="#000" opacity={0.15} />
        <g transform={`rotate(${vaiven} ${TAPA[0]} ${SUELO})`}>
          {/* escalera de mano (tijera): patas traseras, delanteras y peldaños */}
          <path d={pata(150)} stroke="#9AA6B2" strokeWidth={18} strokeLinecap="round" />
          <path d={pata(-260)} stroke="#B9C2CC" strokeWidth={20} strokeLinecap="round" />
          <path d={pata(-200)} stroke="#B9C2CC" strokeWidth={20} strokeLinecap="round" />
          {[0.18, 0.42, 0.66].map((k, i) => { const y = TAPA[1] + k * (SUELO - TAPA[1]); return <path key={i} d={`M${enPata(y, -260)} ${y} L${enPata(y, -200)} ${y}`} stroke="#8C99A6" strokeWidth={14} />; })}
          <path d={`M${enPata(PELDANO, -275)} ${PELDANO + 6} L${enPata(PELDANO, -190)} ${PELDANO + 6}`} stroke="#7E8B98" strokeWidth={16} strokeLinecap="round" />
          <rect x={TAPA[0] - 50} y={TAPA[1] - 14} width={100} height={24} rx={8} fill="#7E8B98" />
          <Escalador x={HX} y={HY} quien="joe" s={S} aspecto={TU} cara="miedo"
            angulos={{ torso: 0, cabeza: 6, brazoA: manoA, brazoB: manoB, piernaA: [6 + 4 * tr, -3 * tr], piernaB: [-6, 0] }} />
          {/* bombilla en la mano de arriba */}
          <g transform={`translate(${BOMBILLA[0]} ${BOMBILLA[1] + 4})`}><ellipse cx={0} cy={6} rx={17} ry={21} fill="#FFF3C4" stroke="#C9B26A" strokeWidth={3} /></g>
          {/* gota de sudor */}
          <path d={`M${HX - 60} ${HY - 250 * S / 2.2 + (f % 20) * 3} q-10 18 0 26 q10 -8 0 -26 Z`} fill="#BFE3F7" opacity={1 - (f % 20) / 20} />
        </g>
        </Zoom>
      </Svg>
      {m !== undefined && <Contador m={m} nota={nota} />}
      <Etiqueta texto={titulo} top={1230} tam={110} desde={6} />
    </Camara>
  );
};
