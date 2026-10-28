// 7 · «Te porteo yo.» (Nico, brazos arriba bajo Lucía) → y está viendo este vídeo (mira el móvil; en su pantalla, este vídeo).
// 8 · Cierre: «Mándaselo a quien te portea…» La pantalla del móvil crece hasta llenar el plano = primer fotograma (bucle).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PantallaMovil } from "../../piezas/Movil";
import { AG, Camara, Cerca, Etiqueta, Fondo, LuciaColgada, Nico, Partida, Planos, Svg, Zoom, clamp, colgado, dePie, type P } from "./comun";
import { PlanoDesplome } from "./Roco";
import { Idioma } from "./comun";

const H = colgado(AG.labio);

export const Porteo: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Escena d={d} />} significa={(d) => {
  const c1 = Math.round(d * 0.35), c2 = Math.round(d * 0.6);
  return <Planos d={d} cortes={[c1, c2]}><Escena d={c1} real /><CaraLucia d={c2 - c1} /><SuMovil d={d - c2} /></Planos>;
}} />;

const CaraLucia: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.12} entrada={false}><Svg><Cerca cx={H.x + 10} cy={H.y - 160} s={3.6}>
    <Fondo h={0.6} id="porc" />
    <LuciaColgada hx={H.x} hy={H.y} cara="miedo" cabeza={34} tiembla={Math.sin(f * 2.8) * 4} />
  </Cerca></Svg></Camara>);
};
/** Lo que mira el porteador: este vídeo (el primer plano, el desplome). */
const SuMovil: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.08} entrada={false}><Svg>
    <rect width={1080} height={1920} fill="#0B1624" />
    <PantallaMovil id="sum" x={540} y={960} s={1.25} pct={23} rec={false}>
      <g transform={`scale(${560 / 1080})`}><PlanoDesplome /></g>
    </PantallaMovil>
  </Svg></Camara>);
};

const Escena: React.FC<{ d: number; real?: boolean }> = ({ d, real }) => {
  const f = useCurrentFrame();
  const z = real ? interpolate(f, [0, d], [1, 1.25], clamp) : 1;
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
  const f = useCurrentFrame(), c0 = Math.round(d * 0.45), crece = Math.round(d * 0.7);
  if (f < c0) return <SeRie d={c0} />;
  const k = interpolate(f, [crece, d - 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const s = 1.1 + k * (1080 / 560 - 1.1); // al final, el cristal ocupa exactamente los 1080 px
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#0B1624" />
        <PantallaMovil id="cie" x={540} y={960 + k * (520 * 1080 / 560 - 960)} s={s} pct={12} rec={false} hud={k === 0}>
          <g transform={`scale(${560 / 1080})`}><PlanoDesplome /></g>
        </PantallaMovil>
      </Svg>
      {k === 0 && <Etiqueta texto={e.titulo} top={300} tam={78} />}
      {k > 0.97 && <Idioma real={false} />}
    </Camara>
  );
};

/** Primer plano del porteador riéndose con el móvil; detrás, Lucía a punto de caer. */
const SeRie: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), risa = Math.abs(Math.sin(f / 2.2)) * 6;
  return (<Camara d={d} empuje={0.1} entrada={false}><Svg><Cerca cx={262} cy={dePie() - 150} s={2.8}>
    <Fondo h={0.6} id="serie" />
    <LuciaColgada hx={H.x} hy={H.y} cara="miedo" cabeza={34} tiembla={Math.sin(f * 2.8) * 5} />
    <Nico x={250} y={dePie() - risa} pose="grabando" objeto="movilLuz" cara="alivio" angulos={{ cabeza: 24, brazoA: [70, 150] }} />
  </Cerca></Svg></Camara>);
};
