// «…lo encadenas.» visto en la pantalla del móvil, que se apaga (negro y silencio). «¿Otro, para el vídeo?» y bucle al gancho.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PantallaMovil } from "../../piezas/Movil";
import { Barba, Camara, Etiqueta, Fondo, Planos, Svg, TOP, Tu, Zoom, clamp, dePie, type P } from "./comun";
import { Alcance } from "./Gancho";

export const Pantalla: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), tTop = 22, tOff = 34;
  const k = interpolate(f, [0, tTop], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const apaga = interpolate(f, [tOff, tOff + 3], [0, 1], clamp);
  if (f >= tOff + 3) return <div style={{ position: "absolute", inset: 0, background: "#000" }} />;
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#05080D" />
        <PantallaMovil id="pan" x={540} y={960} s={1.25} pct={1} apagado={apaga}>
          <g transform="scale(0.5185)">
            <Zoom s={2.3} cx={640} cy={640} tx={540} ty={1050}>
              <Fondo h={1} id="panf" pads={1} />
              <Tu x={640} y={TOP - 4 - 136 * 1.2 + (1 - k) * 90} pose="escalando" poseB="celebrando" t={k} frontal cara="alivio" sombra={TOP - 2} />
            </Zoom>
          </g>
        </PantallaMovil>
      </Svg>
    </Camara>
  );
};

/** «¿Otro, para el vídeo?»: a la luz de tu frontal, el colega mira el móvil muerto. Termina en el plano del gancho (bucle). */
export const Otro: React.FC<P> = ({ e, d }) => {
  const negro = 8, bucle = 12;
  return (<>
    <Planos d={d} cortes={[negro, d - bucle]}>
      <div style={{ position: "absolute", inset: 0, background: "#000" }} />
      <Mira d={d - negro - bucle} />
      <Alcance d={bucle} />
    </Planos>
    <Planos d={d} cortes={[negro + 6, d - bucle]}>
      <></>
      <Etiqueta texto={e.titulo} top={300} tam={80} />
      <></>
    </Planos>
  </>);
};
const Mira: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), luz = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <Camara d={d} empuje={0.07} foco="45% 50%">
      <Svg>
        <g opacity={luz}><Zoom s={2.1} cx={470} cy={1080} tx={540} ty={1050}>
          <Fondo h={1} id="otr" pads={1} />
          <Barba x={470} y={dePie()} pose="grabando" objeto="movilNegro" pad cara="miedo" angulos={{ cabeza: 18 }} />
        </Zoom></g>
        <rect width={1080} height={1920} fill="#000" opacity={0.35 * (1 - luz)} />
        <path d="M1150 300 L380 820 L560 1500 Z" fill="#FFF3C4" opacity={0.12 * luz} />
      </Svg>
    </Camara>
  );
};
