// Las 9 escenas de E42: el mismo escalador de frente con la bisagra (línea mano-pie) y la vista desde arriba como segundo plano.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pared, PU, Svg, Txt, clamp, type P } from "./comun";
import { Frente, type V } from "./Frente";
import { Planta } from "./Planta";

const HX = 700, MR: V = [700, 640], PR: V = [680, 1230];
const TEAL = "#5FD1C5", NARANJA = "#FF6A1F";
const Linea: React.FC<{ a: V; b: V; col?: string; o?: number }> = ({ a, b, col = NARANJA, o = 1 }) => <path d={`M${a} L${b}`} stroke={col} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round" opacity={o} />;
const Base: React.FC<{ d: number; marcadas?: V[]; foco?: string; empuje?: number; children: React.ReactNode; top?: React.ReactNode }> = ({ d, marcadas = [], foco = "55% 55%", empuje = 0.04, children, top }) => (
  <Camara d={d} empuje={empuje} foco={foco}><Svg><Pared marcadas={marcadas.map((m) => m as [number, number])} />{children}</Svg>{top}</Camara>
);

/** Abre la puerta: 0 → th grados alrededor del fotograma f0. */
const abre = (f: number, f0: number, th: number) => interpolate(f, [f0, f0 + 14], [0, th], clamp);

const Puerta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), f0 = (pal("abre") ?? 62) - 6, th = abre(f, f0, 62);
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="¿TE PASA?" top={200} tam={120} desde={4} />}>
      <Frente cx={540} cy={1000} hx={HX} th={th} manoR={MR} pieR={PR} manoL={[420, 560]} cara={f < f0 ? "esfuerzo" : "miedo"} f={f} />
      <circle cx={420} cy={560} r={46 + 6 * Math.sin(f / 4)} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="12 10" opacity={f < f0 + 6 ? 0.85 : 0} />
      <g opacity={interpolate(th, [4, 14], [0, 1], clamp)}><Planta x={140} y={1060} th={th} largo={150} k={1.0} titulo={false} /></g>
    </Base>
  );
};
const Bisagra: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), th = 30 + 22 * Math.sin(f / 9);
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="LA BISAGRA" top={150} tam={104} desde={3} />}>
      <Linea a={[MR[0], MR[1] - 60]} b={[PR[0], PR[1] + 40]} o={interpolate(f, [4, 14], [0, 1], clamp)} />
      <Frente cx={540} cy={1000} hx={HX} th={th} manoR={MR} pieR={PR} manoL={[380, 560]} cara="miedo" f={f} />
      <Planta x={140} y={1040} th={th} largo={150} k={1.2} />
    </Base>
  );
};
const Cadera: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), ola = (Math.sin(f / 8) + 1) / 2;
  return (
    <Base d={d} foco="50% 60%" empuje={0.05}>
      <Linea a={[330, 700]} b={[330, 1190]} o={0.9} /><Linea a={[800, 700]} b={[790, 1180]} o={0.9} />
      <Frente cx={270} cy={1000} s={1.25} hx={330} th={8 + 6 * ola} manoR={[330, 730]} pieR={[330, 1160]} manoL={[190, 720]} cara="serio" f={f} />
      <Frente cx={640} cy={1000} s={1.25} hx={800} th={26 + 30 * ola} manoR={[800, 740]} pieR={[790, 1150]} manoL={[560, 700]} cara="miedo" f={f} chaqueta={PU.chaqueta2} chaquetaS={PU.chaqueta2S} gorro="#E0A526" trenza={false} />
      <Txt x={270} y={520} t="CERCA" tam={78} col={TEAL} /><Txt x={270} y={590} t="ABRE POCO" tam={46} /><Txt x={680} y={520} t="LEJOS" tam={78} col="#FF8A4A" /><Txt x={680} y={590} t="ABRE MUCHO" tam={46} />
    </Base>
  );
};
const Cuatro: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), th = interpolate(f, [0, 40], [48, 0], clamp);
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="4 FORMAS DE FRENARLA" top={180} tam={100} desde={2} />}>
      <Frente cx={540} cy={1000} hx={HX} th={th} manoR={MR} pieR={PR} manoL={[380, 560]} cara={th > 20 ? "miedo" : "alivio"} f={f} />
    </Base>
  );
};
const Contrarios: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), ML: V = [440, 640];
  return (
    <Base d={d} marcadas={[ML, PR]} top={<Etiqueta texto="1 · MANO Y PIE CONTRARIOS" top={150} tam={80} desde={2} />}>
      <Linea a={ML} b={PR} col={TEAL} o={interpolate(f, [6, 18], [0, 1], clamp)} />
      <Frente cx={590} cy={1000} hx={HX} th={0} manoL={ML} pieR={PR} manoR={[760, 600]} cara="alivio" f={f} />
      <Planta x={790} y={430} th={4} largo={120} cerrada titulo={false} k={0.9} />
    </Base>
  );
};
const Triangulo: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), PL: V = [470, 1250], tri = interpolate(f, [26, 40], [0, 1], clamp), lin = interpolate(f, [0, 8, 24, 30], [0, 1, 1, 0], clamp);
  return (
    <Base d={d} marcadas={[MR, PR, PL]} top={<Etiqueta texto="2 · MUÉVETE EN TRIÁNGULO" top={150} tam={80} desde={2} />}>
      <path d={`M${MR} L${PR} L${PL} Z`} fill={TEAL} opacity={0.4 * tri} stroke={TEAL} strokeWidth={9} strokeOpacity={tri} />
      <Linea a={[MR[0], MR[1] - 40]} b={[PR[0], PR[1] + 40]} o={lin} />
      <g opacity={lin}><Txt x={820} y={520} t="EN LÍNEA: SE ABRE" tam={44} col="#FF8A4A" /></g><g opacity={tri}><Txt x={820} y={520} t="TRIÁNGULO: ESTABLE" tam={44} col={TEAL} /></g>
      <Frente cx={560} cy={1000} hx={HX} th={interpolate(f, [0, 22, 36], [28, 40, 0], clamp)} manoR={MR} pieR={PR} pieL={tri > 0.6 ? PL : undefined} manoL={[380, 560]} cara={tri > 0.6 ? "alivio" : "miedo"} f={f} />
    </Base>
  );
};
const Contrapeso: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), PL: V = [290, 1090 + 12 * Math.sin(f / 10)];
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="3 · PIERNA DE CONTRAPESO" top={150} tam={80} desde={2} />}>
      <path d="M470 1120 Q380 1030 330 1090" stroke={NARANJA} strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M330 1090 L362 1074 M330 1090 L350 1118" stroke={NARANJA} strokeWidth={9} strokeLinecap="round" />
      <Frente cx={560} cy={1000} hx={HX} th={7} manoR={MR} pieR={PR} pieL={PL} manoL={[380, 560]} cara="esfuerzo" f={f} />
    </Base>
  );
};
const Core: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), PL: V = [480, 1220], p = 1 + 0.03 * Math.sin(f / 5);
  return (
    <Base d={d} foco="55% 50%" empuje={0.06} marcadas={[MR, PR, PL]} top={<Etiqueta texto="4 · CORE TENSO" top={150} tam={86} desde={2} />}>
      <Frente cx={600} cy={1000} hx={HX} th={4} manoR={MR} pieR={PR} pieL={PL} manoL={[420, 600]} cara="serio" f={f} tension />
      <ellipse cx={600} cy={920} rx={90 * p} ry={96 * p} fill="none" stroke={TEAL} strokeWidth={8} strokeDasharray="14 10" opacity={0.9} />
      <Planta x={790} y={430} th={5} largo={80} cerrada titulo={false} k={0.9} /><Txt x={850} y={740} t="CADERA A LA PARED" tam={34} col={TEAL} />
    </Base>
  );
};
const Envio: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), th = 34 + 18 * Math.sin(f / 9);
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="MÁNDASELO AL QUE SIEMPRE SE ABRE" top={190} tam={76} desde={4} />}>
      <Frente cx={540} cy={1000} hx={HX} th={th} manoR={MR} pieR={PR} manoL={[380, 560]} cara="miedo" f={f} />
    </Base>
  );
};

export const ESCENAS: Record<string, React.FC<P>> = { puerta: Puerta, bisagra: Bisagra, cadera: Cadera, cuatro: Cuatro, contrarios: Contrarios, triangulo: Triangulo, contrapeso: Contrapeso, core: Core, envio: Envio };
