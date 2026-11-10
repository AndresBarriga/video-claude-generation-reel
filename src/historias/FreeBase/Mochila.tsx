// «Se llama free BASE»: plano medio del escalador en la pared (1 m = 300 px; contenedor ≈ 40×50 cm a escala) y una lupa
// que abre el contenedor: vela plegada dentro y el extractor en su bolsillo de abajo. En «lo abre», el extractor sale y se infla.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ESC, AZUL, PIES, Abismo, ParedEiger, Etiqueta, Svg, clamp, sPersona, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

const PM = 300, SP = sPersona(PM), BORDE = 560, HIP: [number, number] = [640, 1250];
const LX = 330, LY = 820, LR = 250; // lupa
const T: React.FC<{ x: number; y: number; t: string; o: number; ancla?: "start" | "end" | "middle" }> = ({ x, y, t, o, ancla = "middle" }) => (
  <text x={x} y={y} opacity={o} textAnchor={ancla} fontFamily={fuenteTitulo} fontWeight={800} fontSize={50} fill="#fff" stroke="#0B1624" strokeWidth={10} paintOrder="stroke">{t}</text>
);

export const Mochila: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fL = pal("paracaidas") ?? Math.round(d * 0.4), fA = pal("abre") ?? Math.round(d * 0.8);
  const lupa = interpolate(f, [fL - 10, fL + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const sale = interpolate(f, [fA - 4, fA + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const z = interpolate(f, [0, d], [1, 1.06], clamp);
  // contenedor en la espalda (aprox. a la altura de los omóplatos)
  const cont: [number, number] = [HIP[0] - 0.16 * PM, HIP[1] - 0.48 * PM];
  const W = 0.4 * 1.9 * PM * 0.5, Hh = 0.5 * 1.9 * PM * 0.5; // dentro de la lupa, 1,9× de aumento
  const pc: [number, number] = [LX - sale * 120, LY + Hh / 2 - 20 - sale * 170];
  return (
    <>
      <Svg>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <Abismo f={f} id="mo" hz={380} />
          <ParedEiger x={BORDE} pm={PM} id="mop" y1={2600} />
          <Escalador x={HIP[0]} y={HIP[1]} quien="joe" s={SP} cara="esfuerzo" aspecto={ESC} mochila={AZUL} pies={PIES}
            angulos={{ torso: 6, cabeza: -30, brazoA: [160, 176], brazoB: [120, 150], piernaA: [60, -10], piernaB: [16, -14] }} />
          {lupa > 0 && <g opacity={lupa}>
            <path d={`M${cont[0] - 10} ${cont[1]} L${LX + LR * 0.7} ${LY + LR * 0.7}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" />
            <circle cx={cont[0]} cy={cont[1]} r={34} fill="none" stroke="#fff" strokeWidth={5} />
            <g transform={`translate(${LX} ${LY}) scale(${lupa}) translate(${-LX} ${-LY})`}>
              <circle cx={LX} cy={LY} r={LR} fill="#16263C" stroke="#fff" strokeWidth={10} />
              <clipPath id="lupaC"><circle cx={LX} cy={LY} r={LR - 6} /></clipPath>
              <g clipPath="url(#lupaC)">
                <rect x={LX - W / 2} y={LY - Hh / 2} width={W} height={Hh} rx={30} fill={AZUL} opacity={0.35} stroke="#9CC0FF" strokeWidth={5} />
                {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={LX - W / 2 + 16} y={LY - Hh / 2 + 16 + i * 20} width={W - 32} height={15} rx={5} fill={i % 2 ? "#C93E22" : "#E04A2A"} />)}
                <path d={`M${LX} ${LY + Hh / 2 - 26} Q${(LX + pc[0]) / 2 - 40} ${(LY + pc[1]) / 2 + 40} ${pc[0]} ${pc[1]}`} stroke="#F4F4F4" strokeWidth={5} fill="none" />
                <rect x={LX - 40} y={LY + Hh / 2 - 34} width={80} height={36} rx={12} fill="#163A78" />
                <g transform={`translate(${pc[0]} ${pc[1]}) scale(${1 + sale * 1.8})`}><circle r={22} fill="#F2C230" />{sale > 0.2 && [0, 60, 120].map((a) => <path key={a} d={`M${-22 * Math.cos((a * Math.PI) / 180)} ${-22 * Math.sin((a * Math.PI) / 180)} L${22 * Math.cos((a * Math.PI) / 180)} ${22 * Math.sin((a * Math.PI) / 180)}`} stroke="#B8860B" strokeWidth={3} />)}</g>
              </g>
              <T x={LX} y={LY - LR - 24} t="VELA PLEGADA" o={1} />
              <T x={LX} y={LY + LR + 60} t={sale > 0.3 ? "EXTRACTOR: TIRA DE LA VELA" : "EXTRACTOR"} o={1} />
            </g>
          </g>}
        </g>
      </Svg>
      <Etiqueta texto="FREE BASE" desde={4} top={300} tam={120} />
    </>
  );
};
