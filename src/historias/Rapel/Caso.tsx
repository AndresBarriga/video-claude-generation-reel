// 2 · El caso real: silueta sin cara en una pared enorme; el saco atascado queda lejos del extremo; primer plano del reverso; la silueta sale de plano.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Cielo } from "../Pegue/comun";
import { Anclaje, Chip, Cuerda, Extremo, H_DIA, Roca, Rotulo, Silueta, Suelo, Svg, bordeX, ei, type P, Camara } from "./comun";
import { Macro } from "./Extremo";

const ENDY = 1400, BAGY = 1690, X0 = 560;

export const Caso: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fMacro = pal("descenso") ?? 200, fExt = pal("extremo") ?? 260, fSe = (pal("emitió") ?? 290) - 6, fLl = pal("llegaba") ?? 100, fSaco = pal("saco") ?? 120, fTik = pal("TikTok") ?? 330;
  if (f >= fMacro && f < fSe) return <Macro f={f - fMacro} fExtremo={fExt - fMacro} />;
  const cam = ei(f, 0, fMacro, 0, 500, Easing.inOut(Easing.cubic));
  const hip = f < fMacro ? ei(f, 30, fMacro, 560, 1330, Easing.linear) : 1330;
  const cae = f >= fSe ? ei(f, fSe, fSe + 18, 0, 1100, Easing.in(Easing.quad)) : 0;
  const sw = Math.sin(f * 0.05) * 5;
  const bx = bordeX(BAGY) - 80;
  const hueco = ei(f, fLl, fLl + 18, 0, 1);
  const noche = ei(f, fSe + 40, d, 0, 0.45, Easing.linear);
  return (
    <Camara d={d} empuje={0.015} entrada={false}>
      <Svg>
        <Cielo h={H_DIA} id="cieloC" />
        <g transform={`translate(0 ${-cam})`}>
          <Roca y0={-200} y1={2600} />
          <Suelo y={2450} />
          <Anclaje x={680} y={-60} />
          <Cuerda d={`M674 -40 L${X0 + 36} ${hip - 30}`} w={11} />
          <Cuerda d={`M${X0 + 36} ${hip - 30} C${X0 + 50} ${hip + 100} ${X0 + 20 + sw} ${ENDY - 160} ${X0 + 28 + sw} ${ENDY}`} w={11} />
          <Extremo x={X0 + 28 + sw} y={ENDY} />
          <g transform={`translate(${bx} ${BAGY})`}><rect x={-46} y={-40} width={92} height={84} rx={22} fill="#33525B" stroke="#0B1624" strokeWidth={6} /><path d="M-30 -40 Q0 -70 30 -40" stroke="#0B1624" strokeWidth={8} fill="none" /></g>
          <path d={`M${bordeX(BAGY) - 150} ${BAGY + 48} L${bordeX(BAGY) + 20} ${BAGY + 48}`} stroke="#0B1624" strokeWidth={14} strokeLinecap="round" />
          {hueco > 0 && <g opacity={hueco}><line x1={X0 + 28} y1={ENDY + 50} x2={X0 + 28} y2={BAGY - 60} stroke="#fff" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" /></g>}
          <Silueta x={X0} y={hip + cae} s={2.4} rot={cae ? 12 : 0} o={cae > 1050 ? 0 : 1} />
        </g>
        <rect width={1080} height={1920} fill="#050B14" opacity={noche} />
        <Chip x={540} y={400} t="EL CAPITÁN · YOSEMITE" o={ei(f, 0, 8, 0, 1) * ei(f, 80, 92, 1, 0)} />
        <Rotulo f={f} ini={(pal("veintitrés") ?? 40)} fin={(pal("años") ?? 70) + 50} t="23 AÑOS" y={250} tam={120} />
        {f > fSaco && f < fMacro && <Chip x={bx - 150} y={BAGY - cam - 90} t="SACO ATASCADO" o={ei(f, fSaco, fSaco + 8, 0, 1)} />}
        {f >= fSe + 8 && <g opacity={ei(f, fSe + 8, fSe + 18, 0, 1)}>
          <rect x={300} y={196} width={480} height={78} rx={39} fill="#0B1624" opacity={0.9} /><circle cx={352} cy={235} r={13} fill="#E04646" />
          <text x={380} y={252} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={44} fill="#fff">EN DIRECTO · TIKTOK</text>
        </g>}
      </Svg>
    </Camara>
  );
};
