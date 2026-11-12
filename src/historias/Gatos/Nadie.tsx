// s6: «Y no hace falta: nadie ha demostrado que sufrir más pise mejor.» Mismo canto, dos gatos: el ajustado (verde) aguanta;
// el machacado (rojo, palpitando) también… y sobre él cae el sello «SIN DEMOSTRAR».
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fuenteTexto, fuenteTitulo } from "../../tema";
import { Svg, clamp, golpe, G, Pildora, type P } from "./comun";
import { Puntera, Ventana } from "./Puntera";
import { garraPara } from "./Gato";

const GJ = garraPara(26), GM = garraPara(24.4);
export const Nadie: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fN = pal("nadie") ?? 30, fD = (pal("demostrado") ?? 46) + 9, fS = pal("sufrir") ?? 70;
  const e1 = spring({ frame: f, fps, config: { damping: 14, stiffness: 150 } }), e2 = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 150 } });
  const pulso = 0.5 + 0.5 * Math.sin(f * 0.6), sello = spring({ frame: f - fD, fps, config: { damping: 9, stiffness: 260 } }), sh = golpe(f, fD + 2, 12);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.5}px)` }}>
      <Svg>
        <defs><linearGradient id="nd-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C1A2C" /><stop offset="1" stopColor="#1B3350" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#nd-f)" />
        <Ventana x={50} y={330} w={980} h={480} borde={G.bien} dy={(1 - e1) * -80}><Puntera k={74} x={730} y={335} L={26} g={GJ} halo={G.bien} haloO={1} aplasta={0.25} /></Ventana>
        <Ventana x={50} y={850} w={980} h={480} borde={G.dolor} dy={(1 - e2) * 80}><Puntera k={74} x={730} y={335} L={24.4} g={GM} dolor={1} pulso={pulso} halo={G.dolor} haloO={0.6 + 0.4 * pulso} aplasta={0.25 + (f > fS ? 0.5 * pulso : 0)} /></Ventana>
      </Svg>
      <Pildora x={235} y={400} texto="AJUSTADO" color={G.bien} desde={6} />
      <Pildora x={250} y={920} texto="MACHACADO" color={G.dolor} desde={10} tinta="#fff" />
      <Pildora x={330} y={1040} texto="¿PISA MEJOR?" color="#fff" desde={fN} tam={58} />
      {f >= fD && <div style={{ position: "absolute", left: 540, top: 1150, transform: `translate(-50%,-50%) rotate(-7deg) scale(${interpolate(sello, [0, 1], [2.4, 1])})`, opacity: Math.min(1, sello * 2), fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 104, color: "#fff", background: G.dolor, border: "10px solid #06101C", borderRadius: 26, padding: "4px 36px", whiteSpace: "nowrap", letterSpacing: 2, boxShadow: "0 14px 0 rgba(0,0,0,.35)" }}>SIN DEMOSTRAR</div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1340, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 30, color: "#fff", opacity: interpolate(f, [fD, fD + 8], [0, 0.92], clamp), textShadow: "0 2px 6px #000" }}>Fuente: British Mountaineering Council (BMC)</div>
    </AbsoluteFill>
  );
};
