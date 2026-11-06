// Escena 2: la tira de apps (como al deslizar entre aplicaciones). Empieza en el chat, recorre las apps y vuelve al chat.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PantallaChat } from "./Chat";
import { Galeria, Musica } from "./Apps2";
import { Mapa, Rutas, Tiempo } from "./Apps1";
import { UI, type P } from "./comun";

const SEP = 1200;
// Orden de izquierda a derecha: galería, música, mapa, rutas, tiempo, chat.
const APPS = [
  { n: "Fotos", c: "#E0488A", C: Galeria }, { n: "Música", c: "#FF6A1F", C: Musica }, { n: "Mapas", c: "#3D8BFF", C: Mapa },
  { n: "Rutas", c: "#4CAF50", C: Rutas }, { n: "Tiempo", c: "#2C6DB5", C: Tiempo },
];
const K: [number, number][] = [[0, 5], [24, 5], [35, 4], [72, 4], [83, 3], [120, 3], [131, 2], [168, 2], [179, 1], [216, 1], [227, 0], [270, 0], [283, 5], [400, 5]];
const ES: [number, number][] = [[0, 1], [14, 0.6], [283, 0.6], [308, 1], [400, 1]];

export const Tira: React.FC<P> = () => {
  const f = useCurrentFrame();
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const idx = interpolate(f, K.map((k) => k[0]), K.map((k) => k[1]), opt);
  const S = interpolate(f, ES.map((k) => k[0]), ES.map((k) => k[1]), opt);
  const tx = -idx * SEP;
  const cab = Math.max(0, Math.min(1, (0.98 - S) / 0.3));
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#26354A" /><stop offset="0.5" stopColor="#1A2230" /><stop offset="1" stopColor="#2B2238" /></linearGradient>
        <clipPath id="pant"><rect width={1080} height={1920} rx={70} /></clipPath>
        <filter id="blur"><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      <rect width={1080} height={1920} fill="url(#fondo)" />
      <g filter="url(#blur)" opacity={0.8}><circle cx={200} cy={500} r={260} fill="#3D8BFF" opacity={0.5} /><circle cx={900} cy={1400} r={300} fill="#FF6A1F" opacity={0.4} /><circle cx={820} cy={300} r={200} fill="#5BD16F" opacity={0.35} /></g>
      <g transform={`translate(540 960) scale(${S}) translate(-540 -960) translate(${tx + 0} 0)`}>
        {APPS.map((a, i) => (
          <g key={a.n} transform={`translate(${i * SEP} 0)`}>
            <g opacity={cab}><rect x={0} y={-160} width={90} height={90} rx={22} fill={a.c} /><text x={116} y={-92} fontFamily={UI} fontWeight={700} fontSize={56} fill="#fff">{a.n}</text></g>
            <g clipPath="url(#pant)"><a.C /></g>
          </g>
        ))}
        <g transform={`translate(${5 * SEP} 0)`}>
          <g opacity={cab}><rect x={0} y={-160} width={90} height={90} rx={22} fill="#3A66D8" /><text x={116} y={-92} fontFamily={UI} fontWeight={700} fontSize={56} fill="#fff">Mensajes</text></g>
          <g clipPath="url(#pant)"><PantallaChat f={999} enviado /></g>
        </g>
      </g>
    </svg>
  );
};
