// «Y esto existe.» Corte a la foto real del Eiger 2008 (la aporta Andrés), a pantalla completa con zoom lento.
// En «saltador», destello rápido (0,6 s) de la foto con traje de alas, sin rótulo de lugar. Rótulos: nombre y «EIGER · 2008».
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, type P } from "./comun";

export const Foto: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fS = pal("saltador") ?? Math.round(d * 0.35), fE = pal("eiger") ?? Math.round(d * 0.8), fN = pal("potter") ?? Math.round(d * 0.25);
  const ala = f >= fS && f < fS + 18;
  const kb = interpolate(f, [0, d], [1.08, 1.22], clamp);
  const flash = Math.max(interpolate(f, [0, 3], [1, 0], clamp), interpolate(f, [fS - 1, fS + 2, fS + 5], [0, 0.9, 0], clamp), interpolate(f, [fS + 17, fS + 19, fS + 22], [0, 0.9, 0], clamp));
  const entra = interpolate(f, [0, 8], [1.12, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${kb * entra})`, transformOrigin: "62% 40%" }}>
        <Img src={staticFile(ala ? "fotos/E55/wingsuit-raetikon.webp" : "fotos/E55/eiger-vertical.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: ala ? "55% 30%" : "62% 45%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      {f >= fN && f < fE && !ala && <Etiqueta texto="DEAN POTTER" desde={fN} top={300} tam={100} />}
      {f >= fE && <Etiqueta texto="EIGER · 2008" desde={fE} top={300} tam={110} />}
    </AbsoluteFill>
  );
};
