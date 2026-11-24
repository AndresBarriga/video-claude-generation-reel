// 3 · «La fuerza con la que aprietas la mano»: el «?» se vuelve la esfera; la mano cierra el dinamómetro y la aguja sube (crujido).
// 4 · «Cada 5 kilos menos… un 16 % más de riesgo»: la aguja baja 5 kg y al lado sube un contador rojo +16 %.
// 13 · «¿Cuánto crees que aprietas tú?»: el mismo plano que la 3 con «¿??» parpadeando (empalma con el principio del dato).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Agarre } from "../../piezas/kit";
import { COL, Dato, Dinamometro, F, Papel, PIEL, Svg, T, cl, golpe, pop, sale, type P } from "./comun";

/** Mano + dinamómetro (pantalla). La mano rodea el mango: palma en la barra fija, dedos sobre la móvil. */
export const ManoDina: React.FC<{ x: number; y: number; s?: number; kg: number; cierra: number; texto?: string; rojo?: number; tiembla?: number; mano?: number }> = ({ x, y, s = 1, kg, cierra, texto, rojo, tiembla = 0, mano = 1 }) => (
  <g transform={`translate(${x + tiembla} ${y}) scale(${s})`}>
    <Dinamometro x={0} y={0} kg={kg} texto={texto} aprieta={cierra} rojo={rojo} />
    {mano > 0 && <g opacity={mano}><Agarre x={-6 + 14 * cierra} y={480} s={1.55} rot={14} cierra={0.15 + 0.85 * cierra} manga={COL.azul} {...PIEL} /></g>}
  </g>
);

export const Apretar: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tA = (pal("aprietas") ?? Math.round(d * 0.5)) - 3;
  const c = sale((f - tA) / 6), kg = interpolate(f, [tA, tA + 10, tA + 16], [0, 46, 42], cl);
  const llega = sale(f / 8);
  return (
    <>
      <Svg>
        <Papel />
        <g transform={`translate(0 ${golpe(f, tA + 5, 12)})`}>
          <ManoDina x={540} y={interpolate(llega, [0, 1], [900, 700])} s={interpolate(llega, [0, 1], [0.6, 1])} kg={kg} cierra={c} texto={f < tA ? "?" : undefined} mano={sale((f - 4) / 8)} />
        </g>
      </Svg>
      <Dato t="FUERZA DE AGARRE" x={540} y={1530} k={f - tA - 6} tam={52} fondo={COL.naranja} color="#fff" />
    </>
  );
};

export const Riesgo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t5 = (pal("5") ?? Math.round(d * 0.1)) - 2, t16 = (pal("16%") ?? Math.round(d * 0.55)) - 3, tR = (pal("riesgo") ?? Math.round(d * 0.8)) - 2;
  const kg = interpolate(f, [t5, t5 + 14], [42, 37], cl), v = Math.round(16 * sale((f - t16) / 16));
  const sube = sale((f - t16) / 16);
  return (
    <>
      <Svg>
        <Papel />
        <ManoDina x={300} y={720} s={0.62} kg={kg} cierra={1} />
        {/* barra de riesgo que sube */}
        <g transform="translate(790 1340)">
          <rect x={-110} y={-640} width={220} height={640} rx={30} fill="#F2E9DA" stroke={T} strokeWidth={10} />
          <rect x={-96} y={-320 - 300 * sube} width={192} height={306 + 300 * sube} rx={22} fill={COL.rojo} opacity={0.25 + 0.75 * sale((f - t16) / 4)} />
          <path d={`M-110 -320 H110`} stroke={T} strokeWidth={6} strokeDasharray="14 10" />
          {sube > 0.1 && <path d={`M0 ${-330 - 300 * sube + 120} v-100 m-40 40 l40 -40 l40 40`} stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </g>
        <text x={790} y={1410} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={44} fill={T}>RIESGO</text>
      </Svg>
      <Dato t="−5 kg" x={300} y={1160} k={f - t5 - 4} tam={86} fondo={COL.crema} color={COL.rojo} />
      {f >= t16 && <div style={{ position: "absolute", left: 790 - 260, width: 520, top: 520, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 170, color: COL.rojo, WebkitTextStroke: `14px ${T}`, paintOrder: "stroke fill", transform: `scale(${pop(f - t16)})` }}>+{v}%</div>}
      {f >= tR && <Dato t="MÁS RIESGO DE MUERTE" x={540} y={1530} k={f - tR} tam={46} fondo={COL.rojo} color="#fff" />}
    </>
  );
};

export const Cuanto: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const parpa = Math.floor(f / 7) % 2 === 0;
  const kg = 40 + 18 * Math.sin(f / 4) * Math.min(1, f / 10);
  return (
    <>
      <Svg>
        <Papel />
        <ManoDina x={540} y={700} kg={kg} cierra={1} texto={parpa ? "¿?? kg" : "     "} tiembla={Math.sin(f * 1.7) * 3} />
      </Svg>
      <Dato t="DIME TUS KG EN COMENTARIOS" x={540} y={1530} k={f - Math.round(d * 0.35)} tam={46} />
    </>
  );
};
