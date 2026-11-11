// Montaje de fotos reales de Dean Potter (las aporta Andrés). v7: sin repetidas y con cortes rápidos para presentarlo:
// «El de la foto» → highline (Taft Point) · «Dean» → escalando con su perro · «Potter» → traje de alas · «Inventó» → techo B/N ·
// «free» → granito · «hizo» → Eiger en vertical hasta el final (solo Eiger mientras se dice «dos mil ocho… Eiger»).
// Las apaisadas de baja resolución van a lo ancho sobre un fondo desenfocado de la misma foto (sin estirarlas).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, type P } from "./comun";

type F = { src: string; pos: string; ancho?: boolean };
const FOTOS: F[] = [
  { src: "fotos/E55/highline-taft.jpg", pos: "30% 40%", ancho: true },
  { src: "fotos/E55/perro-escalando.jpg", pos: "80% 40%", ancho: true },
  { src: "fotos/E55/wingsuit-raetikon.webp", pos: "55% 30%" },
  { src: "fotos/E55/techo-bn.png", pos: "97% 40%" },
  { src: "fotos/E55/granito-1.png", pos: "60% 45%" },
  { src: "fotos/E55/eiger-vertical.webp", pos: "62% 45%" },
];

const Ancha: React.FC<{ src: string; zoom: number; pos: string }> = ({ src, zoom, pos }) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.55)", transform: "scale(1.15)" }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Img src={staticFile(src)} style={{ width: "100%", transform: `scale(${zoom})`, transformOrigin: pos, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Foto: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const cortes = [0, pal("dean") ?? Math.round(d * 0.18), pal("potter") ?? Math.round(d * 0.24), pal("invento") ?? Math.round(d * 0.32), pal("free") ?? Math.round(d * 0.43), pal("hizo") ?? Math.round(d * 0.55)];
  let k = 0; cortes.forEach((c, i) => { if (f >= c) k = i; });
  const ini = cortes[k], fin = cortes[k + 1] ?? d, t = interpolate(f, [ini, fin], [0, 1], clamp);
  const flash = interpolate(f - ini, [0, 4], [k === 0 ? 1 : 0.85, 0], clamp);
  const zoom = 1.06 + t * (k === 5 ? 0.22 : 0.12) + interpolate(f - ini, [0, 6], [0.06, 0], clamp);
  const ft = FOTOS[k], nombre = pal("dean") ?? Math.round(d * 0.12), anio = pal("dos") ?? cortes[5] + 10;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {ft.ancho ? <Ancha src={ft.src} zoom={zoom} pos={ft.pos} /> : (
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: ft.pos }}>
          <Img src={staticFile(ft.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: ft.pos }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      {f >= nombre && f < anio && <Etiqueta texto="DEAN POTTER" desde={nombre} top={300} tam={104} />}
      {f >= anio && <Etiqueta texto="EIGER · 2008" desde={anio} top={300} tam={110} />}
    </AbsoluteFill>
  );
};
