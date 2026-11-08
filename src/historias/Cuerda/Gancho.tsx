// 1 · Gancho (plano del asegurador, de espaldas): tiembla, el pie derecho resbala, mira abajo; desde abajo «¡PIERNA!»; zoom de golpe a la cuerda cruzando la pantorrilla.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Camara, Chapa, Etiqueta, Svg, Zoom, temblor, sube, FondoEspalda, PresaFrente, type P } from "./comun";
import { Espalda, CHAPA_L, CRUCE_L } from "./Espalda";
import { Garabato } from "./Garabato";
import { PlanoPerfil, caida, CHX, CHY } from "./Perfil";
import { whip } from "./Whip";

export const X = 540, Y = 1000, S = 3.4;
export const PresasEspalda: React.FC<{ fx?: number }> = ({ fx = 62 }) => (
  <g>
    <PresaFrente x={X - 50 * S} y={Y - 168 * S} w={120} /><PresaFrente x={X + 46 * S} y={Y - 180 * S} w={110} />
    <PresaFrente x={X + fx * S} y={Y + 122 * S} w={100} /><PresaFrente x={X + 84 * S} y={Y + 84 * S} w={96} /><PresaFrente x={X - 42 * S} y={Y + 132 * S} w={80} />
  </g>
);
export const CRUCE: [number, number] = [X + CRUCE_L[0] * S, Y + CRUCE_L[1] * S];

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tB = (pal("al") ?? Math.round(d * 0.5)) - 2;
  if (f >= tB) { // repetición a cámara lenta: pasa la cinta y voltea por debajo
    const g = (f - tB) * 0.75 + 6, w = whip(g), c = caida(w.v, w.giro);
    return (
      <Camara d={d - tB} empuje={0.03} entrada={false}>
        <Svg>
          <PlanoPerfil f={f} v={w.v} giro={w.giro} cara="dolor" zoom={{ s: 1.25, cx: (CHX + c.hx) / 2 - 60, cy: Math.min(c.hy + 80, (CHY + c.hy) / 2 + 160), tx: 540, ty: 800 }} />
        </Svg>
        <Etiqueta texto="POR DEBAJO DE LA CINTA" top={230} tam={92} desde={tB + 4} />
      </Camara>
    );
  }
  const tP = (pal("pantorrilla") ?? Math.round(d * 0.3)) - 6;
  const z = spring({ frame: f - tP, fps: 30, config: { damping: 14, stiffness: 240 } });
  const s = 1.1 + 0.9 * z;
  const rebob = 1 - sube(f, 0, 10);
  return (
    <Camara d={tB} empuje={0.04} entrada={false}>
      <Svg>
        <Zoom s={s} cx={CRUCE[0]} cy={CRUCE[1]} tx={540} ty={980}>
          <FondoEspalda id="g" />
          <PresasEspalda />
          <Chapa x={X + CHAPA_L[0] * S} y={Y + (CHAPA_L[1] - 30) * S - 106} s={1.6} t={temblor(f, 4)} />
          <Espalda x={X} y={Y} s={S} tr={temblor(f, 1.4)} pie={0} mira={sube(f, 4, 14)} />
        </Zoom>
        <defs><radialGradient id="foco" cx={540 / 1080} cy={980 / 1920} r="0.42"><stop offset="0.28" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.62" /></radialGradient></defs>
        <rect width={1080} height={1920} fill="url(#foco)" opacity={z} />
        {f > tP && <Garabato x={540} y={980} r={70 * s} f={f - tP} />}
        {rebob > 0 && Array.from({ length: 14 }).map((_, i) => <rect key={i} x={0} y={(i * 151 + f * 90) % 1920} width={1080} height={6} fill="#fff" opacity={0.35 * rebob} />)}
      </Svg>
      <Etiqueta texto={f < tP ? "UN SEGUNDO ANTES" : "DETRÁS DE LA PANTORRILLA"} top={230} tam={92} desde={f < tP ? 0 : tP} />
    </Camara>
  );
};
