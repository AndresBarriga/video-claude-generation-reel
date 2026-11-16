// s2: el mecanismo, de frente y a cámara lenta. Escalas a la derecha y las puertas miran a la derecha → al caer la cuerda tira, la cinta gira,
// la puerta del mosquetón de arriba choca con la chapa (chispas), se abre y la cinta entera se va con la cuerda.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Destello, Chip } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, type P, ROJO } from "./comun";
import { CintaF, ParedCerca, CuerdaM, abajoDe } from "./Macro";
import { Flecha, Rot } from "./Bien";

export const Gira: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fD1 = pal("derecha") ?? 29, fPu = pal("puerta") ?? 54, fC = pal("caer") ?? 103, fG = pal("gira") ?? 127, fCh = pal("choca") ?? 158, fA = pal("abre") ?? 203;
  const cae = suave((f - fC) / 16), g = suave((f - fG) / 22), corre = suave((f - (fG + 10)) / 20), abre = suave((f - fA + 4) / 8), ido = f - (fA + 6);
  const giro = -10 - 16 * cae * (1 - g) - 58 * g + (f > fCh && ido < 0 ? Math.sin(f * 1.6) * 2 : 0);
  const cinta = { x: 430, y: 430, puerta: "der" as const, giro, corre, abreArriba: abre, haloArriba: f >= fPu ? ROJO : undefined, haloAbajo: f >= fPu && f < fCh ? ROJO : undefined, suelta: ido > 0 ? { dx: ido * 20, dy: ido * ido * 3.2, rot: ido * 6 } : undefined };
  const ab = abajoDe(cinta), zc = interpolate(f, [fCh - 10, fCh + 8, fA + 6, fA + 16], [0, 1, 1, 0], clamp), z = 1.05 + 0.85 * zc, cx = 540 + (470 - 540) * zc, cy = 880 + (520 - 880) * zc;
  // extremo de la cuerda hacia él: sube a la derecha mientras escala; al caer baja a plomo por la derecha
  const ex = 1150, ey = (ab.y - 520) + (2100 - (ab.y - 520)) * cae, sh = golpe(f, fC + 14, 10) + golpe(f, fA + 6, 16);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
      <Svg><g transform={`translate(540 880) scale(${z}) translate(${-cx} ${-cy})`}>
        <ParedCerca seed="bn" />
        <CuerdaM d={`M330 2000 Q${360 + ido * (ido > 0 ? 6 : 0)} 1400 ${ab.x - 6} ${ab.y + 46}`} /><CintaF {...cinta} />
        <CuerdaM d={`M${ab.x - 6} ${ab.y + 46} Q${ab.x + 150 + 200 * cae} ${ab.y - 40 + 140 * cae} ${ex} ${ey}`} />
        <Flecha x1={640} y1={760} x2={930} y2={520} k={interpolate(f, [fD1 - 6, fD1 + 6, fC - 4, fC + 4], [0, 1, 1, 0], clamp)} />
        {[0, 5, 11].map((o) => <Destello key={o} x={452} y={452} k={f - fCh - o} r={46} color="#FFE3A0" />)}
        <Destello x={470} y={470} k={ido} r={120} />
      </g></Svg>
      <Rot x={800} y={430} texto="ESCALAS" k={interpolate(f, [fD1 - 6, fD1 + 2, fC - 4, fC + 2], [0, 1, 1, 0], clamp)} tam={66} />
      <Rot x={770} y={1180} texto="PUERTAS →" color="#FF8E7E" k={interpolate(f, [fPu - 2, fPu + 6, fC - 4, fC + 2], [0, 1, 1, 0], clamp)} tam={78} />
      <Chip texto="CÁMARA LENTA" top={1310} k={interpolate(f, [fC, fC + 8, d - 8, d], [0, 1, 1, 0], clamp)} tam={40} />
      <Rot x={540} y={1150} texto="¡FUERA!" color="#FF8E7E" k={ido > 0 ? Math.min(1, ido / 5) : 0} tam={120} />
    </AbsoluteFill>
  );
};
