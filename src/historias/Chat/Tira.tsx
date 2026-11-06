// Escena 2: la tira de apps (como al deslizar entre aplicaciones). Empieza en el chat, recorre cada app, la cierra de un tirón hacia arriba y vuelve al chat, que se apaga.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PantallaChat } from "./Chat";
import { Galeria, Mapa, Musica } from "./Apps2";
import { Rutas, Tiempo } from "./Apps1";
import { Topo } from "./Topo";
import { UI, type P } from "./comun";

const SEP = 1200;
// Orden de izquierda a derecha (el chat es el 6).
const APPS = [
  { n: "Fotos", c: "#E0488A", C: Galeria }, { n: "Música", c: "#1ED760", C: Musica }, { n: "Mapas", c: "#3D8BFF", C: Mapa },
  { n: "Topos", c: "#FF6A1F", C: Topo }, { n: "Rutas", c: "#4CAF50", C: Rutas }, { n: "Tiempo", c: "#2C6DB5", C: Tiempo },
];
/** Cada tarjeta: llega en MOV f, se queda HOLD f, se cierra en CIERRE f; la siguiente arranca CIERRE_SOL f después de empezar el cierre. */
export const T = { ini: 16, mov: 10, hold: 24, cierre: 12, per: 38 };
const ini = (k: number) => T.ini + k * T.per; // k = orden de visita (0 = Tiempo)
const finVis = ini(5) + T.per; // llegada a chat empieza aquí
const KK: [number, number][] = [[0, 6], [T.ini, 6]];
for (let k = 0; k < 6; k++) { KK.push([ini(k) + T.mov, 5 - k]); KK.push([ini(k) + T.per, 5 - k]); }
KK.pop();
KK.push([finVis + 4, 5 - 5], [finVis + 30, 6], [999, 6]);
const ES: [number, number][] = [[0, 1], [14, 0.6], [finVis + 22, 0.6], [finVis + 46, 1], [999, 1]];
export const TIRA_FIN = finVis + 46;

export const Tira: React.FC<P> = () => {
  const f = useCurrentFrame();
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const idx = interpolate(f, KK.map((k) => k[0]), KK.map((k) => k[1]), opt);
  const S = interpolate(f, ES.map((k) => k[0]), ES.map((k) => k[1]), opt);
  const cab = Math.max(0, Math.min(1, (0.98 - S) / 0.3));
  const apaga = interpolate(f, [TIRA_FIN + 6, TIRA_FIN + 40], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#26354A" /><stop offset="0.5" stopColor="#1A2230" /><stop offset="1" stopColor="#2B2238" /></linearGradient>
        <clipPath id="pant"><rect width={1080} height={1920} rx={70} /></clipPath>
        <filter id="blur"><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      <rect width={1080} height={1920} fill="url(#fondo)" />
      <g filter="url(#blur)" opacity={0.8}><circle cx={200} cy={500} r={260} fill="#3D8BFF" opacity={0.5} /><circle cx={900} cy={1400} r={300} fill="#FF6A1F" opacity={0.4} /><circle cx={820} cy={300} r={200} fill="#5BD16F" opacity={0.35} /></g>
      <g transform={`translate(540 960) scale(${S}) translate(-540 -960) translate(${-idx * SEP} 0)`}>
        {APPS.map((a, i) => {
          const k = 5 - i, c0 = ini(k) + T.hold + T.mov - 6;
          const t = interpolate(f, [c0, c0 + T.cierre], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
          if (t >= 1) return null;
          return (
            <g key={a.n} transform={`translate(${i * SEP} ${-2300 * t}) rotate(${t * -4} 540 960)`}>
              <g opacity={cab}><rect x={0} y={-160} width={90} height={90} rx={22} fill={a.c} /><text x={116} y={-92} fontFamily={UI} fontWeight={700} fontSize={56} fill="#fff">{a.n}</text></g>
              <g clipPath="url(#pant)"><a.C /></g>
            </g>
          );
        })}
        <g transform={`translate(${6 * SEP} 0)`}>
          <g opacity={cab}><rect x={0} y={-160} width={90} height={90} rx={22} fill="#3A66D8" /><text x={116} y={-92} fontFamily={UI} fontWeight={700} fontSize={56} fill="#fff">Mensajes</text></g>
          <g clipPath="url(#pant)"><PantallaChat f={999} enviado /></g>
        </g>
      </g>
      <rect width={1080} height={1920} fill="#05080D" opacity={apaga} />
    </svg>
  );
};
