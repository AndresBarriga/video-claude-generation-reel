// Gancho v6: el s0 es la FOTO REAL (Potter en el Eiger, sin cuerda, con el contenedor a la espalda y el valle debajo).
// Empuje lento hacia la mochila. Rótulo «SIN CUERDA · CON PARACAÍDAS». Después, corte seco al escalador animado (otra ropa).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, type P } from "./comun";

export const Real: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fP = pal("paracaidas") ?? Math.round(d * 0.5);
  const z = interpolate(f, [0, d], [1.05, 1.32], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "60% 42%" }}>
        <Img src={staticFile("fotos/E55/eiger-vertical.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 45%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 58% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
      <Etiqueta texto="SIN CUERDA" desde={0} top={300} tam={112} />
      {f >= fP - 4 && <Etiqueta texto="CON PARACAÍDAS" desde={fP - 4} top={440} tam={96} />}
    </AbsoluteFill>
  );
};
