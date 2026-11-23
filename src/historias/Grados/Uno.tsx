// E77 · razón 1: en el rocódromo la vía te la dan hecha (colores → te lanzas); en roca no sabes por dónde ni si la presa es buena → dudas → te cansas.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Partida } from "../../piezas/kit";
import { cl, c01, pop, COL, F, T, Razones, Etiq, type P } from "./comun";
import { EnGym, EnRoca } from "./Inicio";

export const Uno: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fC = pal("color") ?? 50, fL = pal("lanzas") ?? 120, fR = pal("roca") ?? 140, fA = pal("agarre") ?? 200, fD = pal("dudas") ?? 260, fK = pal("cansas") ?? 320;
  const luz = c01((f - fC) / 12), roca = f >= fR - 3, fuerza = interpolate(f, [fD, fK + 10], [1, 0.12], cl);
  const vel = f < fL ? f / 55 : fL / 55 + (f - fL) / 28;
  return (
    <>
      <Partida izq={<EnGym t={vel} luz={luz} />} der={<EnRoca cara={f >= fD ? "esfuerzo" : "miedo"} tiembla={f >= fD ? 5 : 2} />} corte={1} sellos={false} />
      <div style={{ position: "absolute", left: roca ? 0 : 540, top: 0, width: 540, height: 1920, background: "rgba(255,248,238,.5)" }} />
      <Etiq t="ROCÓDROMO" x={270} y={500} k={99} />
      <Etiq t="ROCA" x={810} y={500} k={99} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
                {roca && [[700, 700, -30], [815, 610, 0], [930, 700, 30]].map(([x, y, r], i) => { const k = pop(f - fR - i * 5); return k > 0 && <g key={i}><path d={`M810 840 Q${(810 + x) / 2 + r} ${(860 + y) / 2} ${x} ${y + 50}`} stroke={T} strokeWidth={7} strokeDasharray="14 14" fill="none" opacity={k} /><g transform={`translate(${x} ${y}) scale(${k})`}><circle r={46} fill="#fff" stroke={T} strokeWidth={7} /><text y={24} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill={COL.rojo}>?</text></g></g>; })}
        {f >= fD - 4 && <g opacity={c01((f - fD + 4) / 8)}>
          <rect x={590} y={1420} width={440} height={64} rx={32} fill={COL.crema} stroke={T} strokeWidth={7} />
          <rect x={602} y={1432} width={416 * fuerza} height={40} rx={20} fill={fuerza > 0.5 ? COL.verde : fuerza > 0.3 ? COL.naranja : COL.rojo} />
          <text x={810} y={1550} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill={T} stroke={COL.crema} strokeWidth={10} paintOrder="stroke">FUERZA</text>
        </g>}
      </svg>
      {f < fL ? <Etiq t="VES EL COLOR" x={270} y={1470} k={f - fC} fondo={COL.rosa} color="#fff" /> : <Etiq t="✓ TE LANZAS" x={270} y={1470} k={f - fL} fondo={COL.verde} color="#fff" />}
      {f < fA && <Etiq t="¿POR DÓNDE?" x={810} y={1470} k={f - fR - 6} fondo={COL.amarillo} />}
      {f >= fA && f < fD - 4 && <Etiq t="¿ES BUENA?" x={810} y={1470} k={f - fA} fondo={COL.amarillo} />}
      <Etiq t="TE CANSAS" x={810} y={1630} k={f - fK} fondo={COL.rojo} color="#fff" tam={54} />
      <Razones actual={1} top={1730} />
    </>
  );
};
