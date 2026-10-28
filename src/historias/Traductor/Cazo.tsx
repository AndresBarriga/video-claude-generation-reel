// 2 · «Es un cazo.» (Paco, desde abajo, señalando seguro) → y tú, colgado de una lenteja (macro de yemas en un canto diminuto).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Mano } from "../../piezas/Mano";
import { AG, Camara, Cerca, Fondo, LuciaColgada, Paco, Partida, Planos, Svg, Zoom, clamp, colgado, dePie, type P } from "./comun";
import { LUCIA } from "./comun";

const H = colgado(AG.medio);

export const Cazo: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => { const c = Math.round(d * 0.62); return <Planos d={d} cortes={[c]}><Lenteja d={c} /><CaraCazo d={d - c} /></Planos>; }} />;

const CaraCazo: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.1} entrada={false}><Svg><Cerca cx={H.x + 10} cy={H.y - 160} s={3.6}>
    <Fondo h={0.35} id="cazc" />
    <LuciaColgada hx={H.x} hy={H.y} cara="miedo" cabeza={-8} tiembla={Math.sin(f * 2.8) * 3} />
  </Cerca></Svg></Camara>);
};

const Dice: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.05}>
    <Svg><Zoom s={1.5} cx={420} cy={1100} tx={540} ty={1000}>
      <Fondo h={0.35} id="caz" />
      <LuciaColgada hx={H.x} hy={H.y} cara="esfuerzo" cabeza={-40} />
      <Paco x={720} y={dePie(1.25)} pose="senalando" mira={-1} cara="alivio" angulos={{ brazoA: [150, 160], cabeza: -14 }} />
    </Zoom></Svg>
  </Camara>
);

const Lenteja: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), t = Math.sin(f * 2.6) * 4;
  const k = interpolate(f, [0, 8], [1.9, 1.6], clamp);
  return (
    <Camara d={d} empuje={0.1} entrada={false} foco="50% 40%">
      <Svg>
        <rect width={1080} height={1920} fill="#7C838F" />
        {[[120, 300], [700, 420], [300, 1300], [820, 1500], [500, 160]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q70 30 160 8`} stroke="#5F6673" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.6} />)}
        <g transform={`translate(540 720) scale(${k}) translate(-540 -720)`}>
          <g transform={`translate(${t} 0)`}>
            <Mano piel={LUCIA.piel} pielS={LUCIA.pielSombra} manga={LUCIA.chaqueta} x={548} y={915} s={1.05} rot={0} cierra={0.62} magnesio={0.7} yemas={["fina", "fina", "lijada", "normal"]} />
          </g>
          {/* la «lenteja»: un grano de roca del tamaño de una yema */}
          <ellipse cx={540} cy={732} rx={70} ry={16} fill="#000" opacity={0.3} />
          <path d="M478 722 q8 -26 62 -26 q56 0 64 24 q-60 14 -126 2 Z" fill="#9A8466" stroke="#141B26" strokeWidth={6} />
          <path d="M500 708 q40 -10 80 0" stroke="#F4F7FA" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
        </g>
      </Svg>
    </Camara>
  );
};
