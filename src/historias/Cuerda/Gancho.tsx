// 1 · Gancho (plano del asegurador, de espaldas): tiembla, el pie derecho resbala, mira abajo; desde abajo «¡PIERNA!»; zoom de golpe a la cuerda cruzando la pantorrilla.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Bocadillo, Camara, Chapa, Etiqueta, Svg, Zoom, temblor, sube, FondoEspalda, PresaFrente, type P } from "./comun";
import { Espalda, CHAPA_L, CRUCE_L } from "./Espalda";
import { Garabato } from "./Garabato";
import { CaraAseg } from "./CaraAseg";

export const X = 540, Y = 1000, S = 3.4;
export const PresasEspalda: React.FC<{ fx?: number }> = ({ fx = 62 }) => (
  <g>
    <PresaFrente x={X - 50 * S} y={Y - 168 * S} w={120} /><PresaFrente x={X + 46 * S} y={Y - 180 * S} w={110} />
    <PresaFrente x={X + fx * S} y={Y + 122 * S} w={100} /><PresaFrente x={X + 84 * S} y={Y + 84 * S} w={96} /><PresaFrente x={X - 42 * S} y={Y + 132 * S} w={80} />
  </g>
);
export const CRUCE: [number, number] = [X + CRUCE_L[0] * S, Y + CRUCE_L[1] * S];

export const Gancho: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const CORTE = 22; // 0,7 s de la cara del asegurador gritando; luego, lo que ve: la pierna
  if (f < CORTE) return (
    <Camara d={CORTE} empuje={0.12} sacudida={4}>
      <CaraAseg f={f} grita />
      <Bocadillo texto="¡PIERNA!" x={330} y={620} ancho={520} desde={2} tam={120} />
    </Camara>
  );
  const g = f - CORTE;
  const slip = sube(g, 0, 5) - sube(g, 8, 16);
  const mira = sube(g, 6, 16);
  const tz = 14, z = spring({ frame: g - tz, fps: 30, config: { damping: 14, stiffness: 240 } });
  const s = 1.15 + 0.85 * z;
  return (
    <Camara d={d - CORTE} empuje={0.04} sacudida={g < 8 ? 6 : 0} entrada={false}>
      <Svg>
        <Zoom s={s} cx={CRUCE[0]} cy={CRUCE[1]} tx={540} ty={980}>
          <FondoEspalda id="g" />
          <PresasEspalda />
          <Chapa x={X + CHAPA_L[0] * S} y={Y + (CHAPA_L[1] - 30) * S - 106} s={1.6} t={temblor(f, 4)} />
          <Espalda x={X} y={Y} s={S} tr={temblor(f, 1.4)} pie={0} mira={mira} slip={slip} />
        </Zoom>
        {/* todo se apaga menos la pantorrilla y la cuerda */}
        <defs><radialGradient id="foco" cx={540 / 1080} cy={980 / 1920} r="0.42"><stop offset="0.28" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.62" /></radialGradient></defs>
        <rect width={1080} height={1920} fill="url(#foco)" opacity={z} />
        {g > tz && <Garabato x={540} y={980} r={70 * s} f={g - tz} />}
        <rect width={1080} height={1920} fill="#B01020" opacity={0.05 + 0.05 * Math.sin(f / 3)} />
      </Svg>
      <Etiqueta texto="ESTO TE DA LA VUELTA" top={230} tam={96} desde={tz + 4} />
    </Camara>
  );
};
