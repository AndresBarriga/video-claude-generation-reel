// 3 · Rehook visual: la misma caída a cámara lenta con dos medidores a la vez (cuánto subes tú / cuánto le queda a él hasta el suelo).
// Al decir «suelo»: plano a sus pies a un palmo del suelo y alguien del público se tapa los ojos. Silencio.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Caida, Camara, Chip, Encuadre, Fondo, Publico, Svg, aPantalla, ei, estado, SUELO, EL, type P } from "./comun";

export const Barra: React.FC<{ x: number; v: number; col: string; arriba: boolean; ref0?: number }> = ({ x, v, col, arriba, ref0 }) => (
  <g>
    <rect x={x - 26} y={360} width={52} height={640} rx={26} fill="#0B1624" opacity={0.85} stroke="#F4F7FA" strokeWidth={4} />
    <rect x={x - 18} y={368 + 624 * (1 - v)} width={36} height={624 * v} rx={18} fill={col} />
    {ref0 !== undefined && <path d={`M${x - 40} ${368 + 624 * (1 - ref0)} L${x + 40} ${368 + 624 * (1 - ref0)}`} stroke="#F4F7FA" strokeWidth={6} strokeDasharray="10 8" />}
    <path d={arriba ? `M${x - 22} 330 L${x} 300 L${x + 22} 330 Z` : `M${x - 22} 1030 L${x} 1060 L${x + 22} 1030 Z`} fill={col} />
  </g>
);

export const Medidores: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSube = pal("subir") ?? 6, fSuelo = pal("suelo") ?? 80;
  const k = ei(f, fSube, fSuelo - 4, 0, 1, Easing.inOut(Easing.quad));
  const st = estado(k), lejos = Math.max(0, (SUELO - 30 - st.hy) / (SUELO - 30 - 430));
  const pies = f >= fSuelo; // corte a sus pies
  const z = pies ? ei(f, fSuelo, fSuelo + 10, 1.3, 1.8, Easing.out(Easing.cubic)) : 1;
  const [cx, cy] = aPantalla(st.hx, SUELO - 40);
  return (
    <Camara d={d} empuje={0.02} entrada={false}>
      <AbsoluteFill style={{ transform: `translateY(${pies ? -330 : 0}px) scale(${z})`, transformOrigin: `${(cx / 1080) * 100}% ${(cy / 1920) * 100}%` }}>
        <Svg>
          <Encuadre><Fondo />
          <Caida k={k} publico={<Publico r="miedo" />} />
          {pies && <path d={`M${st.hx - 120} ${SUELO + 2} L${st.hx + 120} ${SUELO + 2}`} stroke="#FF5A4A" strokeWidth={6} strokeDasharray="14 10" />}{pies && <text x={st.hx - 250} y={SUELO - 14} fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={30} fill="#FF5A4A" stroke="#050B14" strokeWidth={6} paintOrder="stroke">SUELO</text>}</Encuadre>
          {!pies && <>
            <Barra x={110} v={st.u} col="#5FD1C5" arriba />
            <Barra x={985} v={lejos} col="#FF6A1F" arriba={false} />
            <Chip x={130} y={1090} t="TÚ" col="#5FD1C5" />
            <Chip x={920} y={1110} t="AL SUELO" col="#FF6A1F" />
          </>}
        </Svg>
      </AbsoluteFill>
      {pies && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(200,30,20,0.45) 100%)" }} />}
    </Camara>
  );
};
export { EL };
