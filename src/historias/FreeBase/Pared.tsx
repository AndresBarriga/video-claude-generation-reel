// Gancho y cierre. Gancho: primerísimo plano de las manos con magnesio en la caliza; la cámara se abre: sin cuerda,
// contenedor azul a la espalda, el valle muy abajo. Cierre: llega al borde del muro final y la cámara vuelve a las manos (bucle).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { manoA } from "../Ferrata/comun";
import { ESC, AZUL, PIES, Abismo, ParedEiger, Etiqueta, Svg, clamp, sPersona, CIELO, H, CALIZA, mix, type P } from "./comun";

const PM = 235, SP = sPersona(PM), BORDE = 640;

export const Pared: React.FC<P & { cierre?: boolean }> = ({ d, cierre }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, d], [0, 1], clamp);
  const respira = Math.sin(f / 14);
  const sube = cierre ? interpolate(f, [0, d * 0.5], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
  const hip: [number, number] = [BORDE + 70, cierre ? 1100 - sube * 120 : 1130 + respira * 3];
  const brazoA: [number, number] = cierre ? [interpolate(sube, [0, 1], [160, 120]), interpolate(sube, [0, 1], [176, 100])] : [162 + respira * 2, 176];
  const ang = { torso: cierre ? 10 + sube * 14 : 8, cabeza: cierre ? -20 + sube * 30 : -24, brazoA, brazoB: [128, 156] as [number, number], piernaA: [62, -8] as [number, number], piernaB: [18, -14] as [number, number] };
  const mano = manoA(hip[0], hip[1], SP, ang.torso, ang.brazoA);
  // cámara: gancho 2,6× en la mano → 1×; cierre al revés (vuelve a la mano: empalma con el primer plano)
  const zg = interpolate(f, [0, Math.min(d - 10, 75)], [2.6, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zc = interpolate(f, [d * 0.45, d], [1, 2.6], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = cierre ? zc : zg, k = (z - 1) / 1.6;
  const fx = 540 + (mano[0] - 540) * k, fy = 960 + (mano[1] - 960) * k;
  return (
    <>
      <Svg>
        <g transform={`translate(540 960) scale(${1 + (z - 1) * 0.08}) translate(-540 -960)`}><Abismo f={f} id={cierre ? "pc" : "pg"} hz={430 - t * 40} /></g>
        <g transform={`translate(540 960) scale(${z}) translate(${-fx} ${-fy})`}>
          <ParedEiger x={BORDE} pm={PM} id="peg" y0={cierre ? 640 : -800} y1={1500} />
          {/* la cara sigue hacia abajo y se aleja (vista en picado): se estrecha y se funde con la bruma */}
          <defs><linearGradient id="pbaja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={CALIZA} /><stop offset="1" stopColor={mix(CALIZA, CIELO[H].bruma, 0.85)} /></linearGradient></defs>
          <path d={`M${BORDE} 1490 L2400 1490 L2400 3200 L${BORDE + 520} 3200 Z`} fill="url(#pbaja)" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${BORDE + 200 + i * 260} 1490 L${BORDE + 560 + i * 200} 3200`} stroke="#7E8488" strokeWidth={4} opacity={0.35} />)}
          {cierre && <path d="M640 640 L2400 640" stroke="#C9CDCF" strokeWidth={10} />}
          <Escalador x={hip[0]} y={hip[1]} quien="joe" s={SP} cara={cierre && sube > 0.8 ? "alivio" : "esfuerzo"} aspecto={ESC} mochila={AZUL} pies={PIES} angulos={ang} />
          {[mano, manoA(hip[0], hip[1], SP, ang.torso, ang.brazoB)].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={SP * 9} fill="#F4F6F8" opacity={0.5} />)}
        </g>
      </Svg>
      {!cierre && <Etiqueta texto="SIN CUERDA" desde={15} top={300} tam={110} />}
    </>
  );
};
