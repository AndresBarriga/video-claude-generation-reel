// 4 · Rebobinado ◀◀ → primer plano del OHM II (reconocible) → la misma caída con el OHM II: muerde, chispa, ella apenas sube; el público respira.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C, CINTA1, Caida, Camara, Encuadre, Fondo, Ohm, Publico, Rotulo, Svg, ei, estado, type P } from "./comun";

const Rebobina: React.FC<{ o: number }> = ({ o }) => (
  <g opacity={o}>
    <rect x={390} y={820} width={300} height={170} rx={30} fill="#0B1624" opacity={0.85} />
    <path d="M520 845 L430 905 L520 965 Z M640 845 L550 905 L640 965 Z" fill="#F4F7FA" />
  </g>
);

export const Freno: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fOhm = pal("ohm") ?? 20, fFrena = pal("frena") ?? 80, fMenos = pal("menos") ?? 140;
  const rebob = f < fOhm - 2;
  const primer = f >= fOhm - 2 && f < fFrena - 6;
  const k = rebob ? ei(f, 0, fOhm - 4, 1, 0, Easing.inOut(Easing.cubic)) : primer ? 0 : ei(f, fFrena - 6, fMenos - 2, 0, 1, Easing.inOut(Easing.quad));
  const st = estado(k, !rebob);
  const muerde = !rebob && !primer && st.u > 0.05 ? Math.min(1, st.u * 2) : 0;
  const chispa = muerde > 0 && muerde < 1 ? 1 - muerde : 0;
  const entra = ei(f, fOhm - 2, fOhm + 10, 0.6, 1);
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg>
        <Encuadre><Fondo />
        <Caida k={k} ohm={!rebob} publico={<Publico r={f >= fMenos ? "alivio" : "miedo"} />} />
        {chispa > 0 && [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (i / 7) * Math.PI * 2; const r1 = 20 + (1 - chispa) * 30, r2 = r1 + 26; return <path key={i} d={`M${CINTA1.x + Math.cos(a) * r1} ${CINTA1.y + Math.sin(a) * r1} L${CINTA1.x + Math.cos(a) * r2} ${CINTA1.y + Math.sin(a) * r2}`} stroke="#FFF3C4" strokeWidth={6} strokeLinecap="round" opacity={chispa} />; })}</Encuadre>
        {rebob && <Rebobina o={ei(f, 0, 4, 0, 1)} />}
      </Svg>
      {primer && <AbsoluteFill style={{ background: "rgba(8,17,29,0.86)" }}>
        <Svg>
                    <g transform={`translate(520 1020) scale(${entra * 2.1})`}>
            <path d="M-300 260 Q-120 120 -10 10 L20 -20 Q120 -160 420 -520" stroke={C.cuerdaS} strokeWidth={30} fill="none" />
            <path d="M-300 260 Q-120 120 -10 10 L20 -20 Q120 -160 420 -520" stroke={C.cuerda} strokeWidth={24} fill="none" />
            <Ohm x={0} y={0} s={1} />
          </g>
          <Rotulo f={f} ini={fOhm} fin={fFrena - 6} t="OHM II" y={300} tam={150} col="#C7DC2E" />
        </Svg>
      </AbsoluteFill>}
    </Camara>
  );
};
