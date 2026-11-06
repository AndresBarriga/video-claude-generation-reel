// 1 · Gancho: el rocódromo congelado mirando (ella arriba, él a un palmo del suelo) → zoom a su cara → se descongela y vemos la caída.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Caida, Camara, Encuadre, Fondo, Publico, Rotulo, Svg, aPantalla, ei, estado, ELLA, type P } from "./comun";

export const Plano: React.FC<{ k: number; congelado?: boolean; f: number }> = ({ k, congelado, f }) => {
  return (
    <>
      <Svg><Encuadre><Fondo apagado={congelado ? 1 : 0} /><Caida k={k} publico={<Publico r={congelado || k > 0.55 ? "miedo" : "nada"} giro={congelado || k > 0.4 ? 1 : 0} />} /></Encuadre></Svg>
      {congelado && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 50%, rgba(140,200,230,0) 40%, rgba(10,30,50,0.55) 100%)", mixBlendMode: "multiply" }} />}
    </>
  );
};

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSe = pal("se") ?? 80, fVol = pal("volando") ?? 130;
  const congelado = f < fSe;
  const k = congelado ? 1 : ei(f, fSe, fVol + 14, 0, 1, Easing.linear);
  const st = estado(1);
  const [cx, cy] = aPantalla(st.mx + 20, st.my - 130 * ELLA.s); // cara de ella
  const z = congelado ? ei(f, 34, 46, 1, 1.9, Easing.inOut(Easing.cubic)) : 1;
  const imp = !congelado && k > 0.62 && k < 0.72 ? Math.sin(f * 2.6) * 10 : 0;
  return (
    <Camara d={d} empuje={0.03} entrada={false} sacudida={imp ? 4 : 0}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${(cx / 1080) * 100}% ${(cy / 1920) * 100}%` }}>
        <Plano k={k} congelado={congelado} f={f} />
      </AbsoluteFill>
      <Svg><Rotulo f={f} ini={6} fin={congelado ? fSe : 1e9} t="+24 KG" y={300} tam={150} col="#FF6A1F" /></Svg>
    </Camara>
  );
};
