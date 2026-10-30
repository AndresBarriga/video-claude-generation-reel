// Escenas 1, 2 y cierre: la webcam granulada. Dos frontales a 50 m de la cumbre; uno se separa y baja por la arista.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CieloNoche, Etiqueta, PG, SelloWebcam, Svg, Viento, Webcamizar, Camara, T } from "./comun";

// Arista (Stüdlgrat) en la webcam: de la cumbre hacia abajo a la derecha
const ARISTA: [number, number][] = [[560, 470], [600, 560], [650, 640], [700, 760], [760, 880], [840, 1020], [930, 1180]];
const enArista = (u: number): [number, number] => {
  const k = Math.min(ARISTA.length - 1.001, Math.max(0, u)) , i = Math.floor(k), r = k - i;
  return [ARISTA[i][0] + (ARISTA[i + 1][0] - ARISTA[i][0]) * r, ARISTA[i][1] + (ARISTA[i + 1][1] - ARISTA[i][1]) * r];
};

export const PlanoWebcam: React.FC<{ d: number; baja: [number, number]; hora: (f: number) => string; titulo?: string; serie?: boolean; zoom?: number; final?: string; tFinal?: number }> = ({ d, baja, hora, titulo, serie, zoom = 1, final, tFinal }) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [0, d], baja, { extrapolateRight: "clamp" });
  const ella = enArista(0.55), el = enArista(0.55 + u);
  const z = 1.55 * zoom + 0.06 * (f / d);
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <Svg>
        <g transform={`translate(540 820) scale(${z}) translate(-610 -640)`}>
          <CieloNoche id="wc" />
          <path d="M-100 1500 L200 900 L380 700 L560 470 L700 760 L1000 1250 L1180 1500 Z" fill="#1A2436" />
          <path d="M560 470 L600 560 L650 640 L700 760 L760 880 L840 1020 L930 1180" stroke={PG.nieveS} strokeWidth={6} fill="none" opacity={0.7} />
          <path d="M560 470 L520 560 L470 620 L420 700" stroke={PG.nieveS} strokeWidth={5} fill="none" opacity={0.5} />
          <path d="M-100 1500 L-100 1260 L160 1150 L400 1260 L620 1200 L900 1320 L1180 1260 L1180 1500 Z" fill="#101827" />
          {[ella, el].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={34} fill="#FFF6D0" opacity={0.22} /><circle cx={x} cy={y} r={12} fill="#FFF6D0" /></g>)}
        </g>
        <Viento n={50} fuerza={1.2} op={0.5} />
      </Svg>
      <Webcamizar />
      <SelloWebcam hora={hora(f)} />
      {serie && <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: "#fff", opacity: f >= 15 ? 0.9 : 0, textShadow: "0 2px 8px #000" }}>DECISIONES LÍMITE #2</div>}
      <Etiqueta texto={titulo} top={300} tam={130} desde={15} />
      {final && tFinal !== undefined && f >= tFinal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,11,20,.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center", fontFamily: T.fuenteTitulo, fontWeight: 800, fontSize: 84, lineHeight: 1.1, color: "#fff" }}>{final}</div>
      )}
    </Camara>
  );
};

const reloj = (m0: number, s0: number) => (f: number) => { const t = s0 + Math.floor(f / 30); return `02:${String(m0 + Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
export const Webcam: React.FC<{ e: { titulo?: string }; d: number }> = ({ e, d }) => <PlanoWebcam d={d} baja={[0, 0.9]} hora={reloj(4, 0)} titulo={e.titulo} serie />;
export const Webcam2: React.FC<{ d: number }> = ({ d }) => <PlanoWebcam d={d} baja={[0.9, 2.6]} hora={reloj(4, 9)} zoom={0.92} />;
export const Mensaje: React.FC<{ d: number }> = ({ d }) => <PlanoWebcam d={d} baja={[0, 0]} hora={reloj(3, 30)} zoom={1.15} />;
export const Cierre: React.FC<{ e: { titulo?: string }; d: number }> = ({ e, d }) => (
  <PlanoWebcam d={d} baja={[0, 0]} hora={reloj(4, 0)} titulo={e.titulo} final="#3: el que empujó a su secuestrador" tFinal={d - 27} />
);
