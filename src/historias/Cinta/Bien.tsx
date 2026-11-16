// s1: «Estaba bien chapada» — plano general: cuelga muy abajo; cota de lo que ha caído (6 m) frente a donde le habría parado la cinta (silueta roja).
// «la puerta miraba hacia donde escalabas» — corte al primer plano de frente: la cinta, la flecha de por dónde escalaba y las puertas hacia ese lado, en rojo.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Plano, Persona, Asegurador, Soga, porChapas, aparato, Expres, Cota, POSE, Chip } from "../../piezas/kit";
import { Svg, clamp, type P, VIA, TU, ASE, FANTASMA, TOP, B6, P0, D_BIEN, D_MAL, XASE, ROJO } from "./comun";
import { estadoGancho } from "./Gancho";
import { CintaF, ParedCerca, CuerdaM, abajoDe } from "./Macro";

export const Flecha: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; color?: string; w?: number }> = ({ x1, y1, x2, y2, k, color = "#fff", w = 26 }) => {
  if (k <= 0) return null;
  const x = x1 + (x2 - x1) * k, y = y1 + (y2 - y1) * k, a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return <g><path d={`M${x1} ${y1} L${x} ${y}`} stroke="#050B14" strokeWidth={w + 16} strokeLinecap="round" /><path d={`M${x1} ${y1} L${x} ${y}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
    <g transform={`translate(${x} ${y}) rotate(${a})`}><path d="M-10 -52 L58 0 L-10 52 Z" fill={color} stroke="#050B14" strokeWidth={14} strokeLinejoin="round" /></g></g>;
};
export const Rot: React.FC<{ x: number; y: number; texto: string; color?: string; k: number; tam?: number }> = ({ x, y, texto, color = "#fff", k, tam = 72 }) => k <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1, k) * (1 + 0.15 * Math.sin(Math.min(1, k) * Math.PI))})`, fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: tam, color, WebkitTextStroke: "10px #050B14", paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 1 }}>{texto}</div>
);

export const Bien: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fS = pal("solo") ?? 46, fP = pal("puerta") ?? 97, fH = pal("hacia") ?? 120;
  if (f < fS) {
    const e = estadoGancho(127 + f), p = { x: e.c.x, y: e.c.y }, k = spring({ frame: f - 3, fps, config: { damping: 14 } });
    return (
      <>
        <Plano via={VIA} cx={470} cy={P0.y + 900 - 330 * k} z={0.62 + 0.26 * k} decorado="roca" cintas={false}>
          {VIA.chapas.map((y, i) => i === TOP ? null : <Expres key={i} x={VIA.xF(y)} y={y} color="#D4533F" />)}
          <circle cx={VIA.xF(VIA.chapas[TOP]) + 4} cy={VIA.chapas[TOP]} r={11} fill="#B8C0C8" stroke="#081120" strokeWidth={4} />
          <Asegurador via={VIA} x={XASE} aspecto={ASE} cuerda={false} alza={1} cara="miedo" comba={0.05} />
          <Soga pts={porChapas(VIA, aparato(VIA, XASE), TOP, p, { comba: 12 })} />
          <Persona p={{ x: P0.x - 30, y: P0.y + D_BIEN + 18 }} ang={POSE.colgado} aspecto={FANTASMA} cara="alivio" o={0.75 * k} />
          <Persona p={p} ang={e.c.ang} aspecto={TU} cara="dolor" />
          <Cota x={P0.x - 210} y={P0.y} largo={D_MAL * k} texto="6 m" suelo={VIA.suelo} />
          <g opacity={k}><path d={`M${P0.x - 150} ${P0.y + D_BIEN + 18} h90`} stroke={ROJO} strokeWidth={8} strokeDasharray="12 10" /></g>
        </Plano>
        <Chip texto="Aquí le habría parado" top={560} k={k} tam={46} color="rgba(178,58,42,.92)" />
      </>
    );
  }
  const g = f - fS, kP = spring({ frame: f - fP, fps, config: { damping: 11, stiffness: 180 } }), kH = interpolate(f, [fH, fH + 12], [0, 1], clamp);
  const z = interpolate(g, [0, d - fS], [1.0, 1.1], clamp), cinta = { x: 430, y: 430, puerta: "der" as const, giro: -10 + Math.sin(f / 9) * 3, haloArriba: kP > 0.1 ? ROJO : undefined, haloAbajo: kP > 0.1 ? ROJO : undefined };
  const ab = abajoDe(cinta);
  return (
    <AbsoluteFill>
      <Svg><g transform={`translate(540 880) scale(${z}) translate(-540 -880)`}>
        <ParedCerca seed="bn" />
        <CuerdaM d={`M330 2000 Q360 1400 ${ab.x - 6} ${ab.y + 46}`} /><CintaF {...cinta} />
        <CuerdaM d={`M${ab.x - 6} ${ab.y + 46} Q${ab.x + 150} ${ab.y - 40} 1150 ${ab.y - 520}`} />
        <Flecha x1={640} y1={760} x2={930} y2={520} k={kH} />
      </g></Svg>
      <Rot x={800} y={430} texto="ESCALABAS" k={kH} tam={66} />
      <Rot x={770} y={1180} texto="PUERTAS →" color="#FF8E7E" k={kP} tam={78} />
    </AbsoluteFill>
  );
};
