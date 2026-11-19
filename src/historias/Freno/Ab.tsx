// E62B v2: apertura en UN plano que se entiende en 1 s: la aseguradora da cuerda, él chapa arriba,
// lupa grande sobre la mano agarrando el grigri entero y «¿DAS CUERDA ASÍ?» desde el fotograma 0. Al «cae», se cae.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, porChapas, aparato, accChapar, sogaChapar, POSE, mix, G, Lupa, Chip, Etiqueta, Pregunta } from "../../piezas/kit";
import { VIA, P0, XA, EL, ELLA, ROJO, Mundo, Puesto, golpe, type P } from "./comun";

export const AbreClaro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fS = pal("cae") ?? d - 12, k = f - fS;
  const t = Math.min(0.66, 0.25 + f / (fS * 1.6)), a = accChapar(VIA, P0, 5, t, { temblor: 0.6 });
  const cae = k > 0, p = cae ? { x: P0.x - 6 * Math.min(1, k / 6), y: P0.y + G * k * k } : P0;
  const ap = aparato(VIA, XA), Z = 0.76, CX = (ap.x + P0.x) / 2 + 40, CY = ap.y - 300 / 0.76;
  const hx = 540 + (ap.x - CX) * Z, hy = 960 + (ap.y - CY) * Z, LX = 790, LY = 780, LR = 220;
  return (
    <>
      <Mundo cx={CX} cy={CY} z={Z} sh={golpe(f, fS, 14)}>
        <Asegurador via={VIA} x={XA} cuerda={false} aspecto={ELLA} quien="joe" alza={1} comba={0.3} cara={cae ? "miedo" : undefined} />
        <Soga pts={cae ? porChapas(VIA, ap, 5, p, { floja: 60, sx: -50 }) : sogaChapar(VIA, ap, 5, P0, a)} />
        <Persona p={p} ang={cae ? mix(a.ang, POSE.cae, Math.min(1, k / 4)) : a.ang} aspecto={EL} cara={cae ? "miedo" : "esfuerzo"} />
      </Mundo>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M${LX - LR * 0.6} ${LY + LR * 0.8} L${hx} ${hy}`} stroke="#FFE3A0" strokeWidth={8} strokeDasharray="18 12" />
        <circle cx={hx} cy={hy} r={34} fill="none" stroke="#FFE3A0" strokeWidth={8} />
      </svg>
      <Lupa x={LX} y={LY} r={LR} fondo="#2E3948" k={Math.min(1, (f + 6) / 6)}>
        <g transform="scale(0.44) translate(-640 -880)"><Puesto modo="mal" corre={f * 9 + (cae ? k * k * 5 : 0)} leva={cae ? ROJO : undefined} f={f} /></g>
      </Lupa>
      <Chip texto="MANO EN EL GRIGRI" top={LY + LR + 30} tam={46} k={1} />
      {!cae && <Pregunta texto="¿DAS CUERDA ASÍ?" top={40} tam={100} hasta={fS - 18} />}
      <Etiqueta texto="¿FRENA?" top={40} tam={120} desde={fS - 12} />
    </>
  );
};
