// «Y esto existe.» Montaje de 4 fotos reales de Dean Potter (las aporta Andrés), cada una en su palabra:
// arranque → techo en B/N · «escalador» → escalando en granito · «saltador» → traje de alas · «inventó» → Eiger en vertical · «Eiger» → fotograma del Eiger.
// Corte con destello blanco y zoom lento en cada una. Rótulos: «DEAN POTTER» y, al final, «EIGER · 2008».
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, type P } from "./comun";

const FOTOS = [
  { src: "fotos/E55/eiger-vertical.webp", pos: "62% 45%" },
  { src: "fotos/E55/wingsuit-raetikon.webp", pos: "55% 30%" },
  { src: "fotos/E55/techo-bn.png", pos: "97% 40%" },
  { src: "fotos/E55/eiger-vertical.webp", pos: "66% 30%" },
  { src: "fotos/E55/eiger-video.webp", pos: "68% 40%" },
];

export const Foto: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const cortes = [0, pal("dean") ?? Math.round(d * 0.25), pal("invento") ?? Math.round(d * 0.4), pal("hizo") ?? Math.round(d * 0.6), pal("eiger") ?? Math.round(d * 0.85)];
  let k = 0; cortes.forEach((c, i) => { if (f >= c) k = i; });
  const ini = cortes[k], fin = cortes[k + 1] ?? d, t = interpolate(f, [ini, fin], [0, 1], clamp);
  const flash = interpolate(f - ini, [0, 4], [k === 0 ? 1 : 0.85, 0], clamp);
  const zoom = 1.06 + t * 0.12 + interpolate(f - ini, [0, 6], [0.06, 0], clamp);
  const nombre = pal("dean") ?? Math.round(d * 0.12);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(0px)`, transformOrigin: FOTOS[k].pos }}>
        <Img src={staticFile(FOTOS[k].src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: FOTOS[k].pos }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      {f >= nombre && k < 4 && <Etiqueta texto="DEAN POTTER" desde={nombre} top={300} tam={104} />}
      {k === 4 && <Etiqueta texto="EIGER · 2008" desde={cortes[4]} top={300} tam={110} />}
    </AbsoluteFill>
  );
};
