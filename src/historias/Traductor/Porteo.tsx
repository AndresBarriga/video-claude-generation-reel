// 7 · «Te porteo yo.» (Nico, brazos arriba bajo Lucía) → y está viendo este vídeo (mira el móvil; en su pantalla, este vídeo).
// 8 · Cierre: «Mándaselo a quien te portea…» La pantalla del móvil crece hasta llenar el plano = primer fotograma (bucle).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PantallaMovil } from "../../piezas/Movil";
import { AG, Camara, Etiqueta, Fondo, LuciaColgada, Nico, Partida, Svg, Zoom, clamp, colgado, dePie, type P } from "./comun";
import { PlanoCalentar } from "./Calentar";

const H = colgado(AG.labio);

export const Porteo: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Escena d={d} />} significa={(d) => <Escena d={d} real />} />;

const Escena: React.FC<{ d: number; real?: boolean }> = ({ d, real }) => {
  const f = useCurrentFrame();
  const z = real ? interpolate(f, [d * 0.45, d], [1, 2.4], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 1;
  return (
    <Camara d={d} empuje={0.04} entrada={!real}>
      <Svg><g transform={`translate(540 1000) scale(${z}) translate(-540 -1000)`}><Zoom s={1.35} cx={380} cy={1060} tx={540} ty={1040}>
        <Fondo h={0.6} id={real ? "por1" : "por0"} />
        <LuciaColgada hx={H.x} hy={H.y} cara={real ? "miedo" : "esfuerzo"} cabeza={real ? 30 : -30} tiembla={real ? Math.sin(f * 2.4) * 4 : 0} />
        {real
          ? <Nico x={250} y={dePie()} pose="grabando" objeto="movil" cara="alivio" angulos={{ cabeza: 22, brazoA: [70, 150] }} />
          : <Nico x={250} y={dePie()} pose="celebrando" cara="alivio" angulos={{ brazoA: [140, 170], brazoB: [160, 175], cabeza: -24 }} />}
      </Zoom></g></Svg>
    </Camara>
  );
};

/** Móvil con este mismo vídeo dentro; `k` 0→1 lo hace crecer hasta que la pantalla ES el plano 1. */
export const Cierre: React.FC<P> = ({ d, e }) => {
  const f = useCurrentFrame(), crece = Math.round(d * 0.72);
  const k = interpolate(f, [crece, d - 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const s = 1.1 + k * (1080 / 560 - 1.1); // al final, el cristal ocupa exactamente los 1080 px
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#0B1624" />
        <PantallaMovil id="cie" x={540} y={960 + k * (520 * 1080 / 560 - 960)} s={s} pct={12} rec={false} hud={k === 0}>
          <g transform={`scale(${560 / 1080})`}><PlanoCalentar f={0} id="cie0" /></g>
        </PantallaMovil>
      </Svg>
      {k === 0 && <Etiqueta texto={e.titulo} top={300} tam={78} />}
    </Camara>
  );
};
