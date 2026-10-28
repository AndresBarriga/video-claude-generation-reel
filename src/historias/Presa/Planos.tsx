// E31: planos con el personaje. La presa de pie sucia (PieSucio) aparece en sopla, yemas y mochila sin subrayarla.
import React from "react";
import { Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Polvo } from "../../piezas/Mano";
import { Rocodromo, MAT } from "../../piezas/Rocodromo";
import { AGARRE, Camara, DE_PIE, PieSucio, PresaRosa, S, Svg, Yo, Zoom, clamp, golpe, type P } from "./comun";
import { SuelaMacro } from "./Macro";

const Gimnasio: React.FC<{ brillo?: number; hundido?: number }> = ({ brillo = 0, hundido = 0 }) => (
  <g><Rocodromo reloj={false} hundido={hundido} /><PieSucio /><PresaRosa brillo={brillo} /></g>
);

/** Sopla la presa: mejillas infladas, el polvo sale hacia cámara. */
export const Sopla: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.06}>
      <Svg><Zoom s={3} cx={330} cy={1000} tx={500} ty={820}>
        <Gimnasio />
        <Yo x={DE_PIE.x} y={DE_PIE.y} cara="sopla" angulos={{ cabeza: -24, brazoA: [40, 20] }} />
      </Zoom>
      {Array.from({ length: 14 }).map((_, i) => {
        const k = f - i * 1.5; if (k < 0) return null;
        return <circle key={i} cx={760 + (i % 5 - 2) * 40 + k * (6 + (i % 3) * 3)} cy={420 - (i % 4) * 30 + k * 5} r={10 + k * 2.2} fill="#F4F6F8" opacity={Math.max(0, 0.7 - k / 30)} />;
      })}</Svg>
    </Camara>
  );
};

/** Se sopla las yemas y palmada de magnesio. */
export const Yemas: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), tp = Math.round(d * 0.55);
  const k = interpolate(f, [tp - 5, tp], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const pose = f < tp - 5 ? { cara: "sopla" as const } : { cara: "serio" as const };
  const brazos = { brazoA: [100 - 25 * k, 190 - 95 * k] as [number, number], brazoB: [96 - 18 * k, 196 - 98 * k] as [number, number] };
  return (
    <Camara d={d} empuje={0.05} sacudida={golpe(f, tp, 8) ? 5 : 0}>
      <Svg><Zoom s={2.6} cx={330} cy={1060} tx={520} ty={900}>
        <Gimnasio />
        <Yo x={DE_PIE.x} y={DE_PIE.y} pose="soplando" angulos={{ ...brazos, cabeza: 8 }} {...pose} />
        <Polvo x={DE_PIE.x + 118} y={DE_PIE.y - 100} k={f - tp} n={20} seed="palmada" escala={1.1} />
      </Zoom></Svg>
    </Camara>
  );
};

/** Mano a la mochila: saca un cepillo de dientes. Mirada seria. */
export const Mochila: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), t1 = d * 0.35, t2 = d * 0.6;
  const atras = interpolate(f, [0, t1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const saca = interpolate(f, [t1 + 3, t2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const brazoA: [number, number] = saca > 0 ? [-40 + saca * 160, -120 + saca * 290] : [12 - atras * 52, 4 - atras * 124];
  return (
    <Camara d={d} empuje={0.07}>
      <Svg><Zoom s={2} cx={330} cy={1080} tx={540} ty={960}>
        <Gimnasio />
        <Yo x={DE_PIE.x} y={DE_PIE.y} mochila cara={saca > 0.6 ? "serio" : "normal"} objeto={saca > 0.1 ? "cepilloDientes" : undefined}
          angulos={{ brazoA, cabeza: saca > 0.6 ? 6 : -4 }} />
      </Zoom></Svg>
    </Camara>
  );
};

/** Mira la presa reluciente, satisfecho (silencio). */
export const Mira: React.FC<P> = ({ d }) => (
  <Camara d={d} empuje={0.05}>
    <Svg><Zoom s={3.4} cx={330} cy={950} tx={500} ty={980}>
      <Gimnasio brillo={1} />
      <Yo x={DE_PIE.x} y={DE_PIE.y} cara="alivio" angulos={{ cabeza: -28, brazoA: [30, 60] }} />
    </Zoom></Svg>
  </Camara>
);

/** Sale despedido, estirado (squash and stretch). */
export const Sale: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), k = f / d;
  const x = AGARRE.x - 60 - k * 200, y = AGARRE.y + 190 + k * 260;
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <Svg><Zoom s={1.6} cx={360} cy={1060} tx={540} ty={960}>
        <Gimnasio brillo={1} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${x + 30 + i * 22} ${y - 260 - i * 30} l${40} ${-120}`} stroke="#F4F6F8" strokeWidth={6} strokeLinecap="round" opacity={0.5} />)}
        <g transform={`translate(${x} ${y}) scale(0.82 1.3) translate(${-x} ${-y})`}>
          <Yo x={x} y={y} pose="cayendo" cara="miedo" rot={-20} />
        </g>
      </Zoom></Svg>
    </Camara>
  );
};

/** Plano general: boca arriba en la colchoneta, que rebota; la presa sigue brillando arriba. */
export const Suelo: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), bote = Math.abs(Math.sin(f / 4)) * 30 * Math.exp(-f / 9);
  const aplasta = f < 4 ? 0.8 : 1;
  const yC = MAT - 14 * S - bote;
  return (
    <Camara d={d} empuje={0.03} entrada={false} sacudida={golpe(f, 0, 12) ? 8 : 0}>
      <Svg><Zoom s={1.6} cx={200} cy={1200} tx={540} ty={1150}>
        <Gimnasio brillo={1} hundido={Math.exp(-f / 8) * Math.cos(f / 2.5)} />
        <g transform={`translate(180 ${MAT}) scale(1 ${aplasta}) translate(-180 ${-MAT})`}>
          <Yo x={200} y={yC} pose="tumbado" cara={f < 20 ? "dolor" : "cerrados"} />
        </g>
        <Polvo x={200} y={MAT - 20} k={f} n={22} seed="suelo" escala={1.5} />
      </Zoom></Svg>
    </Camara>
  );
};

/** Desde la colchoneta mira la suela… y se la cepilla. Acaba en la misma pasada que el fotograma 0. */
export const SuelaEsc: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), c = Math.round(d * 0.4);
  if (f >= c) return <Sequence from={c}><SuelaMacro d={d - c} /></Sequence>;
  return (
    <Camara d={c} empuje={0.08}>
      <Svg><Zoom s={2.6} cx={240} cy={1260} tx={540} ty={1060}>
        <Gimnasio brillo={1} />
        <Yo x={180} y={MAT - 14 * S} pose="tumbado" cara="serio" angulos={{ piernaA: [150, 175], cabeza: -10 }} />
      </Zoom></Svg>
    </Camara>
  );
};
