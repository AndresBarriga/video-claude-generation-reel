// E31: planos macro. El cepillo ya está rascando en el fotograma 0; el último plano (suela) acaba en la misma
// dirección de pasada para que el corte al fotograma 0 empalme (match cut).
import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { Mano, Polvo } from "../../piezas/Mano";
import { Cepillo, CepilloDientes, PanelMacro, PieGato, Presa, Suela } from "../../piezas/Cepillado";
import { Camara, MANO, PIE, Svg, clamp, golpe, type P } from "./comun";

const HX = 540, HY = 1060, HS = 1.5; // presa en macro
/** Altura de la superficie de la presa en x (para que las cerdas la rocen). */
const sup = (x: number) => HY + HS * (-168 + 0.0024 * ((x - HX) / HS) ** 2);

/** Pasada de cepillo: posición, inclinación y doblez de cerdas. rate = pasadas completas por segundo; fase en vueltas. */
export const pasada = (fase: number, amp: number) => {
  const a = 2 * Math.PI * fase, x = HX + amp * Math.sin(a), v = Math.cos(a);
  return { x, y: sup(x), rot: 32 - v * 10, doblado: -v };
};

/** Polvo que sale en cada cambio de sentido (dos por vuelta). */
const Rafagas: React.FC<{ f: number; rate: number; amp: number; desde?: number; escala?: number }> = ({ f, rate, amp, desde = 0, escala = 1 }) => {
  const tk = (k: number) => ((0.25 + k / 2) * 30) / rate, k0 = Math.floor(((f + desde) * rate / 30 - 0.25) * 2);
  return <>{[k0, k0 - 1, k0 - 2].map((k) => {
    const p = pasada(0.25 + k / 2, amp);
    return <Polvo key={k} x={p.x} y={p.y - 10} k={f + desde - tk(k)} n={10} seed={`r${k}`} escala={escala} />;
  })}</>;
};

const MacroCepillo: React.FC<{ d: number; rate: number; amp: number; dientes?: boolean; brillo?: [number, number]; sacude?: number; empuje?: number }> = ({ d, rate, amp, dientes, brillo = [0, 0], sacude = 0, empuje = 0.06 }) => {
  const f = useCurrentFrame(), p = pasada((f / 30) * rate, amp);
  const b = interpolate(f, [0, d], brillo, clamp);
  const C = dientes ? CepilloDientes : Cepillo;
  return (
    <Camara d={d} empuje={empuje} entrada={false} sacudida={sacude} foco="50% 55%">
      <Svg>
        <PanelMacro />
        <Presa x={HX} y={HY} s={HS} sucia={dientes ? 0.4 * (1 - b) : 0.6} brillo={b} tw={f / 90} />
        <Rafagas f={f} rate={rate} amp={amp} desde={8} escala={dientes ? 0.8 : 1.3} />
        <C x={p.x} y={p.y} rot={p.rot} s={dientes ? 0.95 : 0.8} doblado={p.doblado} {...MANO} />
      </Svg>
    </Camara>
  );
};

export const CepilloEsc: React.FC<P> = ({ d }) => <MacroCepillo d={d} rate={3} amp={170} />;
export const Furia: React.FC<P> = ({ d }) => <MacroCepillo d={d} rate={5} amp={190} sacude={4} empuje={0.12} />;
export const Dientes: React.FC<P> = ({ d }) => <MacroCepillo d={d} rate={8} amp={120} dientes brillo={[0, 1]} empuje={0.18} />;

/** La mano agarra la presa reluciente: aguanta perfecta. */
export const Agarra: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [0, d * 0.55], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <PanelMacro />
        <Presa x={HX} y={HY} s={HS} brillo={1} tw={f / 90} />
        <Mano {...MANO} x={HX - 20} y={interpolate(k, [0, 1], [1700, 1010])} rot={-6} s={1.25} cierra={k > 0.9 ? 0.55 : 0.1} magnesio={0.7} />
      </Svg>
    </Camara>
  );
};

/** El pie de gato, sobre la presa de pie gris de polvo, patina. */
export const Pie: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), t0 = Math.round(d * 0.4);
  const k = interpolate(f, [t0, d], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const tiembla = f < t0 ? Math.sin(f * 3) * 3 : 0;
  return (
    <Camara d={d} empuje={0} entrada={false} sacudida={f >= t0 && f < t0 + 6 ? 6 : 0}>
      <Svg>
        <PanelMacro />
        <Presa x={560} y={1150} s={0.9} col={{ c: "#8E949C", s: "#6B7078", l: "#B5BAC0" }} sucia={1} seed="pg" />
        <PieGato x={700 + tiembla + k * 260} y={1040 + k * 520} rot={-4 + k * 40} s={1.1} color={PIE} />
        <Polvo x={600} y={1010} k={f - t0} n={16} seed="pie" escala={1.6} />
      </Svg>
    </Camara>
  );
};

/** Macro final: se cepilla la suela con el cepillo de dientes; acaba en una pasada hacia la derecha, como el fotograma 0. */
export const SuelaMacro: React.FC<{ d: number }> = ({ d }) => {
  // El cepillo para 0,6 s antes del final (18 fotogramas) y el plano queda quieto: el corte no es seco.
  const f = Math.min(useCurrentFrame(), d - 18), fase = (3 * (f - d)) / 30;
  const a = 2 * Math.PI * fase, x = 540 + 120 * Math.sin(a), v = Math.cos(a);
  return (
    <Camara d={d} empuje={0.08} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#2E4B7A" />
        <Suela x={540} y={1000} s={1.6} color={PIE} sucia={interpolate(f, [0, d - 18], [1, 0.3], clamp)} />
        <Polvo x={x} y={760} k={(f % 5) + 2} n={6} seed={`s${Math.floor(f / 5)}`} escala={0.7} />
        <CepilloDientes x={x} y={760} rot={32 - v * 10} s={0.85} doblado={-v} {...MANO} />
      </Svg>
    </Camara>
  );
};
export { golpe };
