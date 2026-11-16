// TOMA 3 · cuerda: general breve → primer plano: la cuerda corre por el puño y QUEMA (humo); se tensa; después el lazo en un dedo… y corte.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, porChapas, conMano, Agarre, CuerdaGrande, C } from "../../piezas/kit";
import { VIA, I, P0, AP, TU, libre, Mundo, PP, Humo, Rebobina, Toma, N_REB, clamp, golpe, type P } from "./comun";

const X = 520, Y = 900, S = 1.5;
export const Cuerda: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fC = pal("cuerda") ?? 30, fQ = (pal("quema") ?? 56) - 4, fT = pal("tensa") ?? 120, fE = (pal("enrolla") ?? d - 40) - 12, f0 = fC - 6;
  if (f < fQ) {
    const l = f < N_REB ? { p: { x: P0.x - 30 * (1 - f / N_REB), y: P0.y + 300 * (1 - f / N_REB) }, ang: libre(0).ang } : libre(f - f0), p = l.p;
    return (
      <>
        <Mundo cx={p.x + 40} cy={p.y - 60} z={1.9}>
          <Soga pts={porChapas(VIA, AP, I + 1, p, { floja: 46, sx: -44 })} brillo={f > f0 ? 0.8 : 0} desde={I + 1} />
          <Persona p={p} ang={f > f0 + 2 ? conMano(l.ang, 4, -74) : l.ang} aspecto={TU} cara={f > f0 ? "miedo" : "normal"} />
        </Mundo>
        <Rebobina k={f} /><Toma n={3} k={f - N_REB} />
      </>
    );
  }
  if (f < fE) {
    const corre = f < fT, k = f - fQ, abre = interpolate(f, [fT + 8, fT + 16], [1, 0.12], clamp), off = Math.min(f, fT) * 46, roja = Math.min(1, k / 14);
    const piel = `rgb(${185 + 50 * roja}, ${130 - 30 * roja}, ${90 - 10 * roja})`, sopla = f > fT + 16;
    return (
      <>
        <PP v={corre ? 40 : 0} sh={golpe(f, fT, 24) + (corre ? Math.sin(f * 2.1) * 4 : 0)} tinte={roja > 0.6 ? "#D8B49A" : "#C9B797"}>
          <Agarre x={X} y={Y + (sopla ? Math.sin(f / 3) * 10 : 0)} s={S} rot={-6} cierra={abre} piel={piel} pielS="#B8402E" manga="#3F7F86" tiembla={corre ? Math.sin(f * 2.7) * 7 : 0}>
            <CuerdaGrande d="M0 -1000 V1100" w={46} tensa={corre ? 0 : 1} />
            <path d="M0 -1000 V1100" stroke="#FFD9B0" strokeWidth={9} strokeDasharray="50 46" strokeDashoffset={-off} opacity={0.9} />
            {!corre && abre < 0.5 && <path d="M-30 -84 V84" stroke="#E2533F" strokeWidth={26} strokeLinecap="round" opacity={0.85} />}
          </Agarre>
          <Humo x={X + 20} y={Y - 110} k={k - 4} n={corre ? 9 : 5} />
          {sopla && [0, 1, 2].map((i) => <path key={i} d={`M${X - 250 - i * 40} ${Y - 190 + i * 60} h-70`} stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.4 + 0.5 * Math.sin(f / 2 + i)} />)}
        </PP>
        <Toma n={3} />
      </>
    );
  }
  const k = f - fE, n = Math.max(1, d - fE), t = Math.min(1, k / n), llega = Math.min(1, k / 12), aprieta = Math.max(0, (t - 0.55) / 0.45), dx = X + 142, dy = Y - 81;
  const lazo = `M${760 - 60 * aprieta} -40 C${800 - 200 * aprieta} ${300 + 100 * aprieta} ${dx + 190 * (1 - llega) + 30} ${dy - 260 + 120 * aprieta} ${dx + 190 * (1 - llega)} ${dy - 44 + 14 * aprieta}`;
  const sale = `M${dx + 190 * (1 - llega)} ${dy + 44 - 14 * aprieta} C${dx + 40} ${dy + 300 - 100 * aprieta} ${880 - 200 * aprieta} ${1300} ${900 - 120 * aprieta} 2000`;
  return (
    <>
      <PP v={aprieta > 0 ? 50 : 8} sh={aprieta * Math.sin(f * 2.4) * 16} tinte={aprieta > 0.5 ? "#D9A590" : "#C9B797"}>
        <CuerdaGrande d={lazo} w={40} tensa={aprieta} />
        <Agarre x={X} y={Y} s={S} rot={-6} cierra={0.05} piel="#D2835E" pielS="#B8402E" manga="#3F7F86" tiembla={aprieta * Math.sin(f * 3) * 6} />
        <ellipse cx={dx + 190 * (1 - llega)} cy={dy} rx={32 - 6 * aprieta} ry={46 - 14 * aprieta} fill="none" stroke={C.cuerdaS} strokeWidth={52} />
        <ellipse cx={dx + 190 * (1 - llega)} cy={dy} rx={32 - 6 * aprieta} ry={46 - 14 * aprieta} fill="none" stroke={C.cuerda} strokeWidth={40} />
        <CuerdaGrande d={sale} w={40} tensa={aprieta} />
        {aprieta > 0.85 && <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={(aprieta - 0.85) / 0.15} />}
      </PP>
      <Toma n={3} />
    </>
  );
};
