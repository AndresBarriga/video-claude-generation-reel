// 1 · Gancho (0–6,7 s): el antebrazo al límite se abre y cae («fase cinco»); luego «rebobina» cuatro fases.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Polvo } from "../../piezas/Mano";
import { Brazo } from "./Brazo";
import { BR, Camara, Fondo, P, Rotulo, Svg, clamp, ei, mundo, suave } from "./comun";

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAbre = pal("abre") ?? 52, fCaes = pal("caes") ?? 85, fPero = pal("Pero") ?? 118, fAntes = pal("antes") ?? 175;
  const fin = fPero + 4, back = f < fin ? 1 : ei(f, fin, fin + 24, 1, 0);
  const tremor = f < fAbre ? (2.5 + 1.5 * Math.sin(f * 0.4)) * Math.sin(f * 2.4) : 0;
  const empuja = ei(f, fAbre - 8, fAbre - 1, 0, 14) - ei(f, fAbre - 1, fAbre + 3, 0, 14);
  const desliza = ei(f, fAbre, fAbre + 14, 0, -120);
  const cae = interpolate(f, [fCaes, fCaes + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const abre = ei(f, fAbre, fAbre + 9, 0, 1) * back;
  const bomba = f < fin ? 1 : ei(f, fPero + 8, fAntes + 6, 1, 0, suave);
  const k = f - fCaes, sacud = k >= 0 && k < 9 ? Math.sin(k * 3) * 14 * (1 - k / 9) : 0;
  const [px, py] = mundo(790, 40);
  return (
    <Camara d={d} empuje={0.05} foco="62% 45%">
      <Svg>
        <g transform={`translate(${sacud} ${Math.abs(sacud) * 0.4})`}>
          <Fondo />
          <Brazo {...BR} f={f} bomba={bomba} latido={0} abre={abre} cierra={f < fAbre ? 1 : 0} calor={bomba * 0.6}
            dx={(tremor + empuja + desliza) * back} dy={cae * 1000 * back} giro={cae * 16 * back} polvo={0.6} />
          {k >= 0 && k < 30 && <Polvo x={px - 30} y={py} k={k} n={14} seed="g" escala={1.2} />}
          {f > fPero && f < fAntes + 12 && [0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${120 + i * 150} ${1180 - i * 60} l${260} ${-120}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.28 * interpolate(f, [fPero, fPero + 8, fAntes - 4, fAntes + 12], [0, 1, 1, 0], clamp)} />
          ))}
        </g>
        <Rotulo f={f} ini={15} fin={fCaes + 14} t="TU ANTEBRAZO" y={225} tam={84} />
        <Rotulo f={f} ini={21} fin={fCaes + 14} t="NO FALLA DE GOLPE" y={320} tam={84} />
        <Rotulo f={f} ini={(pal("cinco") ?? 3) + 2} fin={fCaes + 30} t="FASE 5" y={470} tam={120} col="#FF8A4A" />
      </Svg>
    </Camara>
  );
};
