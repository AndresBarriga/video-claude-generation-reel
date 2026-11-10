// Viaje 4 · bosque de otoño, al pie de la vía. La cámara va del puesto de alquiler (kits colgados: casco, arnés,
// disipador) al grupo: la guía le ajusta el casco a Dani y señala las primeras grapas. Escala 1 m = 150 px.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { DANI, MARTA, Svg, clamp, type P } from "./comun";
import { Cielo, Cordillera, Bruma, CIELO, mix } from "./paisaje";
import { Roca, CableE, Grapa, Anclaje, sPersona } from "./roca";

const PM = 150, SP = sPersona(PM), h = "dia" as const, SUELO = 1500, HIP = SUELO - 130 * SP;
const GUIA = { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#3A3A3A", casco: "#D93A2B", barba: "#9A9A9A", pelo: "#9A9A9A", manos: "guante" as const };
const TENDERO = { chaqueta: "#5B7A3A", chaquetaSombra: "#3F5728", pantalon: "#2B3442", casco: null, gorro: "#C8573C", manos: "piel" as const, arnes: false };
const OTONO = ["#D9822B", "#E8B03A", "#C2482E", "#A8562A", "#E59A3B", "#8E9A3A"];

const Arbol: React.FC<{ x: number; y: number; t: number; i: number }> = ({ x, y, t, i }) => {
  const c = OTONO[i % OTONO.length];
  return (
    <g>
      <path d={`M${x} ${y} L${x} ${y - t * 0.9}`} stroke="#4A3426" strokeWidth={t * 0.08} />
      {[[0, -1, 0.42], [-0.3, -0.8, 0.32], [0.32, -0.78, 0.34], [0.05, -1.25, 0.3]].map(([dx, dy, r], k) => <circle key={k} cx={x + dx * t} cy={y + dy * t} r={r * t} fill={k === 3 ? mix(c, "#FFF2C8", 0.25) : k === 1 ? mix(c, "#2A1E1A", 0.18) : c} />)}
    </g>
  );
};

const Kit: React.FC<{ x: number; y: number; casco: string }> = ({ x, y, casco }) => (
  <g>
    <path d={`M${x - 14} ${y + 4} A16 14 0 0 1 ${x + 18} ${y + 4} Z`} fill={casco} />
    <ellipse cx={x + 2} cy={y + 46} rx={16} ry={10} fill="none" stroke="#F2C230" strokeWidth={4} />
    <path d={`M${x + 2} ${y + 56} q-14 30 -10 54 M${x + 2} ${y + 56} q14 30 10 54`} stroke="#FF6A1F" strokeWidth={4} fill="none" />
    <rect x={x - 4} y={y + 58} width={12} height={22} rx={4} fill="#262B33" />
  </g>
);

export const Plan: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fP = pal("primera") ?? Math.round(d * 0.55);
  const pan = interpolate(f, [0, fP - 6, fP + 14], [0, 120, 470], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ajusta = interpolate(f, [fP, fP + 30], [0, 1], clamp), senala = interpolate(f, [fP + 30, fP + 44], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const capa = (k: number) => `translate(${-pan * k} 0)`;
  return (
    <Svg>
      <g transform={capa(0.15)}>
        <Cielo h={h} id="pla" sol={[200, 360]} r={44} />
        <Cordillera id="plA" y={1040} amp={420} color="#7E8FB2" h={h} lejos={0.55} nieve={0.25} picos={4} x1={2000} />
        <Bruma y={960} alto={200} color={CIELO[h].bruma} id="pl1" o={0.5} />
      </g>
      <g transform={capa(0.45)}>
        <Roca id="plC" h={h} pm={60} tono="#D6A777" d="M-200 1250 L120 1150 L380 1180 L560 1080 L820 1120 L1100 1060 L1400 1110 L1800 1080 L2000 1250 Z" />
        {Array.from({ length: 34 }).map((_, i) => <Arbol key={i} x={-200 + random(`fa${i}`) * 2200} y={1260 + random(`fb${i}`) * 60} t={90 + random(`fc${i}`) * 40} i={i} />)}
      </g>
      <g transform={`translate(540 1250) scale(${interpolate(f, [0, d], [1.45, 1.6], clamp)}) translate(${-(240 + pan * 1.75)} -1360)`}>
        <path d={`M-300 ${SUELO} Q500 ${SUELO - 20} 1000 ${SUELO + 6} T2000 ${SUELO} L2000 2400 L-300 2400 Z`} fill="#7A8A3A" />
        {Array.from({ length: 60 }).map((_, i) => <ellipse key={i} cx={-200 + random(`hx${i}`) * 2200} cy={SUELO + 30 + random(`hy${i}`) * 500} rx={8} ry={4} fill={OTONO[i % OTONO.length]} opacity={0.85} />)}
        <Roca id="plR" h={h} pm={PM} luzIzq tono="#D2B48C" d="M1240 -300 L1290 600 L1250 1100 L1300 1520 L2000 1520 L2000 -300 Z" />
        <CableE d={`M1262 ${SUELO - 60} L1262 600`} pm={PM} /><Anclaje x={1262} y={SUELO - 60} pm={PM} />
        {Array.from({ length: 8 }).map((_, i) => <Grapa key={i} x={1290} y={SUELO - 140 - i * 0.34 * PM} pm={PM} />)}
        {/* puesto de alquiler */}
        <rect x={40} y={1150} width={380} height={350} fill="#8A5A36" /><rect x={40} y={1150} width={380} height={350} fill="none" stroke="#5C3A22" strokeWidth={6} />
        <path d="M10 1160 L230 1050 L450 1160 Z" fill="#6E3F24" />
        <rect x={60} y={1170} width={340} height={170} fill="#3A2A20" />
        {[["#F2F3F5", 100], ["#E0A526", 190], ["#1F5E44", 280], ["#3A7BD5", 360]].map(([c, x], i) => <Kit key={i} x={x as number} y={1190} casco={c as string} />)}
        <rect x={30} y={1340} width={400} height={30} fill="#A8754A" />
        <Escalador x={250} y={1300} quien="joe" s={SP} cara="alivio" aspecto={TENDERO} pose="senalando" mira={1} />
        {/* grupo */}
        <Escalador x={820} y={HIP} quien="simon" s={SP} cara="alivio" aspecto={MARTA} mochila mira={1} />
        <Escalador x={1000} y={HIP} quien="joe" s={SP} cara={ajusta > 0.6 ? "alivio" : "normal"} aspecto={DANI} mochila mira={1} angulos={{ cabeza: -10 * ajusta }} />
        <Escalador x={1130} y={HIP} quien="joe" s={SP} cara="alivio" aspecto={GUIA} mira={-1}
          angulos={senala > 0 ? { brazoA: [interpolate(senala, [0, 1], [120, 160]), interpolate(senala, [0, 1], [120, 170])], cabeza: -20 * senala } : { brazoA: [110, 130 + Math.sin(f / 4) * 8 * ajusta] }} />
      </g>
    </Svg>
  );
};
