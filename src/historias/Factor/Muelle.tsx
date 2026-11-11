// s3: «la cuerda es un muelle»: dos muelles naranjas (1 m y 20 m) con la misma persona colgada. En «estira» caen:
// el corto casi no se estira y para EN SECO (sacudida); el largo se estira mucho y rebota suave.
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Pildora, Dato, golpe, type P, TU_L, TU_CUEVA, CUELGA, CAE, C } from "./comun";

const Resorte: React.FC<{ x: number; y0: number; largo: number; vueltas: number }> = ({ x, y0, largo, vueltas }) => {
  const n = vueltas * 2, pts = [`${x} ${y0}`];
  for (let i = 1; i < n; i++) pts.push(`${x + (i % 2 ? -34 : 34)} ${y0 + (largo * i) / n}`);
  pts.push(`${x} ${y0 + largo}`);
  const d = `M${pts.join(" L")}`;
  return <g><path d={d} stroke={C.cuerdaS} strokeWidth={16} fill="none" strokeLinejoin="round" /><path d={d} stroke={C.cuerda} strokeWidth={11} fill="none" strokeLinejoin="round" /></g>;
};

export const Muelle: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fE = pal("estira") ?? 70, fSu = pal("suave") ?? 100;
  const k = f - fE;
  // corto: cae 0,6 de su altura y se para en 3 fotogramas
  const cortoL = 150 + (k <= 0 ? 0 : k < 6 ? 40 * (k / 6) ** 2 : 40 + 10 * Math.exp(-(k - 6) / 2.5) * Math.cos((k - 6) * 1.7));
  // largo: se estira mucho y despacio, rebote amplio
  const largoL = 520 + (k <= 0 ? 0 : 240 * (1 - Math.exp(-k / 12) * Math.cos(k / 7)));
  const sh = golpe(f, fE + 6, 18);
  const ap = spring({ frame: f, fps, config: { damping: 14 } });
  const persona = (x: number, y: number, a: typeof TU_L, cayendo: boolean) => <Escalador x={x - 6} y={y + 120} quien="joe" angulos={cayendo ? CAE : CUELGA} cara={cayendo ? "miedo" : "normal"} aspecto={a} mira={1} s={0.9} />;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0B1A2C,#13283F)" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 24 }).map((_, i) => <path key={i} d={`M0 ${i * 80} L1080 ${i * 80}`} stroke="#1E3550" strokeWidth={2} />)}
        <g transform={`translate(${sh} 0)`}>
          <rect x={160} y={500} width={220} height={22} rx={8} fill="#8E969F" stroke="#141B26" strokeWidth={5} />
          <g opacity={ap}><Resorte x={270} y0={522} largo={cortoL} vueltas={3} /></g>
          {persona(270, 522 + cortoL, TU_L, k > 0 && k < 5)}
        </g>
        <rect x={700} y={500} width={220} height={22} rx={8} fill="#8E969F" stroke="#141B26" strokeWidth={5} />
        <g opacity={ap}><Resorte x={810} y0={522} largo={largoL} vueltas={14} /></g>
        {persona(810, 522 + largoL, TU_CUEVA, k > 0 && k < 20)}
        <rect x={536} y={0} width={8} height={1920} fill="#050B14" />
      </svg>
      <Pildora x={270} texto="1 M DE CUERDA" /><Pildora x={810} texto="20 M DE CUERDA" />
      {k > 6 && <Dato x={270} y={1060} texto="SECO" color="#E2533F" s={spring({ frame: k - 6, fps, config: { damping: 10, stiffness: 220 } })} />}
      {f >= fSu && <Dato x={810} y={420} texto="SUAVE" color="#9FD6B0" s={spring({ frame: f - fSu, fps, config: { damping: 12 } })} />}
    </AbsoluteFill>
  );
};
