// s5 REHOOK: «tu cinta tiene un arriba y un abajo». De frente: etiquetas ARRIBA/ABAJO · la goma marca el de la cuerda · el de arriba roza la chapa
// (chispas) y coge rebabas · la cinta se da la vuelta: el de las rebabas queda abajo y la cuerda, al correr, se deshilacha.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Destello, Chip } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, type P, ROJO } from "./comun";
import { CintaF, ParedCerca, CuerdaM, Chapa, abajoDe } from "./Macro";
import { Rot } from "./Bien";

export const Rebabas: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAr = pal("arriba") ?? 45, fAb = pal("abajo") ?? 67, fGo = pal("goma") ?? 111, fOt = pal("otro") ?? 158, fRe = pal("rebabas") ?? 208, fSi = pal("si") ?? 232, fLi = pal("lija") ?? 269;
  const vuelta = suave((f - fSi) / 22), alReves = vuelta > 0.5, reb = interpolate(f, [fOt + 10, fRe + 14], [0, 1], clamp), roza = f > fOt && f < fSi;
  const cinta = { x: 540, y: 300, puerta: "izq" as const, giro: roza ? Math.sin((f - fOt) * 0.7) * 13 : Math.sin(f / 11) * 2, rebabas: reb, alReves, goma: f >= fGo - 4 && f < fOt ? 0.6 + 0.4 * Math.sin(f / 3) : 0 };
  const ab = abajoDe({ ...cinta, giro: 0 });
  // cámara: entera → abajo (goma) → arriba (roce) → entera (vuelta) → abajo (lija)
  const kA = interpolate(f, [fGo - 12, fGo, fOt - 8, fOt], [0, 1, 1, 0], clamp), kB = interpolate(f, [fOt - 8, fOt + 4, fSi - 8, fSi], [0, 1, 1, 0], clamp), kC = interpolate(f, [fLi - 14, fLi - 2], [0, 1], clamp);
  const k = Math.max(kA, kB, kC), ty = kB > 0 ? 400 : ab.y, z = 0.98 + (kB > 0 ? 1.0 : 0.85) * k, cx = 540, cy = 880 + (ty - 880) * k;
  const lija = Math.max(0, f - fLi), dano = Math.min(1, lija / 22), tira = f >= fSi + 22;
  const dSoga = `M240 2100 Q300 ${ab.y + 400} ${ab.x - 6} ${ab.y + 50} Q${ab.x + 130} ${ab.y - 10} 1000 ${ab.y + 900}`;
  return (
    <AbsoluteFill style={{ transform: `translate(${golpe(f, fLi + 2, 10) + (lija > 0 ? Math.sin(f * 2.3) * 3 : 0)}px, 0)` }}>
      <Svg><g transform={`translate(540 880) scale(${z}) translate(${-cx} ${-cy})`}>
        <ParedCerca seed="rb" /><Chapa x={540} y={300} />
        <g transform={`rotate(${vuelta * 180 * (alReves ? 0 : 1) + (alReves ? (1 - vuelta) * -180 : 0)} 540 ${(300 + ab.y) / 2})`} opacity={1}>
          <CuerdaM d={dSoga} corre={tira ? f * 14 : 0} />
          <CintaF {...cinta} chapa={false} />
        </g>
        
        {roza && [0, 9, 18, 27, 36].map((o) => <Destello key={o} x={548 + Math.sin(o) * 16} y={332} k={(f - fOt - o) % 45} r={40} color="#FFE3A0" />)}
        {dano > 0 && <g>
          <path d={`M${ab.x - 60} ${ab.y + 96} Q${ab.x - 6} ${ab.y + 50} ${ab.x + 70} ${ab.y + 34}`} stroke="#FBF1E2" strokeWidth={20 * dano} fill="none" strokeLinecap="round" opacity={0.95} />
          {Array.from({ length: 16 }).map((_, i) => { const a = -2.6 + random("fr" + i) * 3.2, l = (26 + random("fl" + i) * 60) * dano, x = ab.x - 40 + random("fx" + i) * 100, y = ab.y + 78 - (x - ab.x + 40) * 0.5; return <path key={i} d={`M${x} ${y} q${Math.cos(a) * l * 0.5 + 8} ${Math.sin(a) * l * 0.5} ${Math.cos(a) * l} ${Math.sin(a) * l}`} stroke={i % 3 ? "#FF8A45" : "#FBF1E2"} strokeWidth={5} fill="none" strokeLinecap="round" />; })}
          {Array.from({ length: 10 }).map((_, i) => { const t = ((lija + i * 4) % 30) / 30; return <circle key={i} cx={ab.x + 10 + (random("px" + i) - 0.3) * 200 * t} cy={ab.y + 60 + t * 260 * (0.4 + random("py" + i))} r={5 * (1 - t) + 2} fill="#FFB27F" opacity={1 - t} />; })}
        </g>}
      </g></Svg>
      <Chip texto="ARRIBA: a la chapa" top={470} k={interpolate(f, [fAr - 4, fAr + 4, fGo - 14, fGo - 8], [0, 1, 1, 0], clamp)} tam={46} />
      <Chip texto="ABAJO: a la cuerda" top={1240} k={interpolate(f, [fAb - 4, fAb + 4, fGo - 14, fGo - 8], [0, 1, 1, 0], clamp)} tam={46} />
      <Rot x={540} y={520} texto="LA GOMA" color="#FFE3A0" k={interpolate(f, [fGo - 4, fGo + 4, fOt - 8, fOt - 2], [0, 1, 1, 0], clamp)} tam={90} />
      <Rot x={540} y={1240} texto="REBABAS" color="#FF8E7E" k={interpolate(f, [fRe - 2, fRe + 6, fSi - 4, fSi + 2], [0, 1, 1, 0], clamp)} tam={96} />
      <Chip texto="DEL REVÉS" top={470} k={interpolate(f, [fSi + 10, fSi + 18, fLi - 12, fLi - 6], [0, 1, 1, 0], clamp)} tam={46} color="rgba(178,58,42,.92)" />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 220px ${ROJO}`, opacity: dano * 0.55 }} />
    </AbsoluteFill>
  );
};
