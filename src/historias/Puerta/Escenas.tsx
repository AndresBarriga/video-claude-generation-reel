// Las 8 escenas de E42 (v4): gancho → causa → principio → 3 formas → recompensa (llegas a la presa).
// El mismo escalador de frente; el recuadro «vista desde arriba» enseña la puerta abrirse y, tras cada técnica, cerrarse.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Pared, PU, Svg, Txt, clamp, type P } from "./comun";
import { Frente, type V } from "./Frente";
import { Planta } from "./Planta";

const HX = 700, MR: V = [700, 640], PR: V = [680, 1230], META: V = [420, 560];
const TEAL = "#5FD1C5", NARANJA = "#FF6A1F";
const Linea: React.FC<{ a: V; b: V; col?: string; o?: number }> = ({ a, b, col = NARANJA, o = 1 }) => <path d={`M${a} L${b}`} stroke={col} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round" opacity={o} />;
const Base: React.FC<{ d: number; marcadas?: V[]; foco?: string; empuje?: number; children: React.ReactNode; top?: React.ReactNode }> = ({ d, marcadas = [], foco = "55% 55%", empuje = 0.04, children, top }) => (
  <Camara d={d} empuje={empuje} foco={foco}><Svg><Pared marcadas={marcadas.map((m) => m as [number, number])} />{children}</Svg>{top}</Camara>
);
const Anillo: React.FC<{ p: V; o?: number; col?: string }> = ({ p, o = 1, col = NARANJA }) => <circle cx={p[0]} cy={p[1]} r={52} fill="none" stroke={col} strokeWidth={8} opacity={o} />;

// 1 · Gancho: la mano estira y el cuerpo se abre. Aparece la vista desde arriba cuando se abre.
const Puerta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), f0 = (pal("abre") ?? 52) - 6, th = interpolate(f, [f0, f0 + 14], [0, 62], clamp);
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="¿TE PASA?" top={200} tam={120} desde={4} />}>
      <Frente cx={540} cy={1000} hx={HX} th={th} manoR={MR} pieR={PR} manoL={[420, 560]} cara={f < f0 ? "esfuerzo" : "miedo"} f={f} />
      <circle cx={420} cy={560} r={46 + 6 * Math.sin(f / 4)} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="12 10" opacity={f < f0 + 6 ? 0.85 : 0} />
      <g opacity={interpolate(th, [4, 14], [0, 1], clamp)}><Planta x={140} y={1060} th={th} largo={150} k={1.0} titulo={false} /></g>
    </Base>
  );
};

// 2 · Causa: un solo lado agarrado; la línea mano-pie; la vista desde arriba.
const Causa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fl = pal("lado") ?? 90, flin = pal("linea") ?? 250, th = 28 + 24 * Math.sin(f / 9);
  const lado = interpolate(f, [fl, fl + 10], [0, 1], clamp), lin = interpolate(f, [flin - 6, flin + 6], [0, 1], clamp);
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="UN SOLO LADO AGARRADO" top={170} tam={78} desde={fl} />}>
      <Anillo p={MR} o={lado} /><Anillo p={PR} o={lado} />
      <g opacity={lado}><Txt x={MR[0] + 120} y={MR[1] + 10} t="CARGA" tam={40} col="#FF8A4A" /><Txt x={PR[0] + 120} y={PR[1] + 14} t="CARGA" tam={40} col="#FF8A4A" /><Txt x={300} y={500} t="MANO LIBRE" tam={36} col="#C9D3DE" /><Txt x={560} y={1410} t="PIE LIBRE" tam={36} col="#C9D3DE" /></g>
      <Linea a={[MR[0], MR[1] - 60]} b={[PR[0], PR[1] + 40]} o={lin} />
      <Frente cx={540} cy={1000} hx={HX} th={th} manoR={MR} pieR={PR} manoL={[420, 560]} cara="miedo" f={f} />
      <Planta x={140} y={1040} th={th} largo={150} k={1.2} />
    </Base>
  );
};

// 3 · Principio: cuanto más lejos el peso, más se abre; y las dos cosas que frenan.
const Principio: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), ola = (Math.sin(f / 8) + 1) / 2, ff = pal("frenarla") ?? Math.round(d * 0.5), k = interpolate(f, [ff - 4, ff + 8], [0, 1], clamp);
  return (
    <Base d={d} foco="50% 60%" empuje={0.05} top={<Etiqueta texto="2 FORMAS DE FRENARLA" top={170} tam={84} desde={ff} />}>
      <g opacity={1 - 0.7 * k}>
        <Linea a={[330, 700]} b={[330, 1190]} o={0.9} /><Linea a={[800, 700]} b={[790, 1180]} o={0.9} />
        <Frente cx={270} cy={1000} s={1.25} hx={330} th={8 + 6 * ola} manoR={[330, 730]} pieR={[330, 1160]} manoL={[190, 720]} cara="serio" f={f} />
        <Frente cx={640} cy={1000} s={1.25} hx={800} th={26 + 30 * ola} manoR={[800, 740]} pieR={[790, 1150]} manoL={[560, 700]} cara="miedo" f={f} chaqueta={PU.chaqueta2} chaquetaS={PU.chaqueta2S} gorro="#E0A526" trenza={false} />
        <Txt x={270} y={520} t="CERCA" tam={78} col={TEAL} /><Txt x={270} y={590} t="ABRE POCO" tam={46} /><Txt x={680} y={520} t="LEJOS" tam={78} col="#FF8A4A" /><Txt x={680} y={590} t="ABRE MUCHO" tam={46} />
      </g>
      <g opacity={k}>
        <rect x={70} y={760} width={460} height={260} rx={34} fill="#0B1624" opacity={0.9} stroke={TEAL} strokeWidth={8} /><Txt x={300} y={860} t="CAMBIAR" tam={64} col={TEAL} /><Txt x={300} y={940} t="LOS APOYOS" tam={64} col={TEAL} />
        <rect x={550} y={760} width={460} height={260} rx={34} fill="#0B1624" opacity={0.9} stroke={NARANJA} strokeWidth={8} /><Txt x={780} y={860} t="ACERCAR" tam={64} col="#FF8A4A" /><Txt x={780} y={940} t="EL PESO" tam={64} col="#FF8A4A" />
      </g>
    </Base>
  );
};

// Escalada estable con el recuadro de arriba cerrándose: la recompensa de cada técnica.
const Cierra: React.FC<{ th0?: number; th1?: number; f: number }> = ({ th0 = 44, th1 = 5, f }) => <Planta x={790} y={430} th={interpolate(f, [10, 36], [th0, th1], clamp)} largo={110} cerrada={f > 34} titulo={false} k={0.9} />;
const Mismo: React.FC<{ f: number }> = ({ f }) => (<><g opacity={interpolate(f, [0, 8, 34, 42], [0, 1, 1, 0], clamp)}><Txt x={540} y={1340} t="MISMAS PRESAS, MISMO PASO" tam={44} col="#C9D3DE" /></g><g opacity={interpolate(f, [34, 44], [0, 1], clamp)}><Txt x={880} y={790} t="MENOS GIRO" tam={40} col={TEAL} /></g></>);

const Uno: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), ML: V = [440, 640], pc = (pal("core") ?? 130) - 4, oc = interpolate(f, [pc, pc + 8], [0, 1], clamp);
  return (
    <Base d={d} marcadas={[ML, PR]} top={<Etiqueta texto="1 · PIE CONTRARIO A LA MANO" top={196} tam={72} desde={2} />}>
      <Linea a={ML} b={PR} col={TEAL} o={interpolate(f, [6, 18], [0, 1], clamp)} />
      <Frente cx={590} cy={1000} hx={700} th={interpolate(f, [10, 36], [44, 0], clamp)} manoL={ML} pieR={PR} manoR={[760, 600]} cara="alivio" f={f} tension />
      <ellipse cx={590} cy={920} rx={86} ry={92} fill="none" stroke={TEAL} strokeWidth={8} strokeDasharray="14 10" opacity={0.9} />
      <g opacity={oc}><Txt x={790} y={990} t="CORE TENSO" tam={46} col={TEAL} /><Txt x={790} y={1044} t="= LA CADERA NO SE ABRE" tam={32} col="#E6EDF3" /></g><Cierra f={f} /><Mismo f={f} />
    </Base>
  );
};
const Dos: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), PL: V = [290, 1090 + 12 * Math.sin(f / 10)];
  return (
    <Base d={d} marcadas={[MR, PR]} top={<Etiqueta texto="2 · BANDERA: LA PIERNA LIBRE, DE CONTRAPESO" top={196} tam={60} desde={2} />}>
      <path d="M470 1120 Q380 1030 330 1090" stroke={NARANJA} strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M330 1090 L362 1074 M330 1090 L350 1118" stroke={NARANJA} strokeWidth={9} strokeLinecap="round" />
      <Frente cx={560} cy={1000} hx={700} th={interpolate(f, [10, 36], [44, 7], clamp)} manoR={MR} pieR={PR} pieL={PL} manoL={[380, 560]} cara="esfuerzo" f={f} /><Cierra f={f} th1={7} /><Mismo f={f} />
    </Base>
  );
};
const Tres: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), PL: V = [520, 1240], fr = pal("rodilla") ?? Math.round(d * 0.7);
  return (
    <Base d={d} marcadas={[MR, PR, PL]} top={<><Etiqueta texto="3 · CADERA A LA PARED" top={196} tam={72} desde={2} /><Etiqueta texto="LA QUE MÁS AYUDA EN DESPLOMES" top={370} tam={42} desde={30} /></>}>
      <path d="M470 980 L600 980" stroke={TEAL} strokeWidth={9} strokeLinecap="round" /><path d="M600 980 L574 956 M600 980 L574 1004" stroke={TEAL} strokeWidth={9} strokeLinecap="round" />
      <Frente cx={580} cy={1000} hx={700} th={interpolate(f, [10, 36], [44, 3], clamp)} manoR={MR} pieR={PR} pieL={PL} manoL={[400, 600]} cara="serio" f={f} /><Cierra f={f} th1={3} /><Mismo f={f} />
      <g opacity={interpolate(f, [fr - 4, fr + 6], [0, 1], clamp)}><Txt x={540} y={1400} t="¡CUIDADO CON LA RODILLA!" tam={50} col="#FF8A4A" /></g>
    </Base>
  );
};

// 7 · Recompensa: el mismo movimiento del principio, ahora sin abrirse; llegas a la presa.
const Llegas: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [0, 22], [0, 1], clamp), cy = 1000 - 100 * k, pie: V = [680, 1230 - 110 * k], pl: V = [500, 1260 - 110 * k], ml: V = [440 - 20 * k, 640 - 80 * k];
  return (
    <Base d={d} marcadas={[MR, [680, 1120], META]} empuje={0.06} top={<Etiqueta texto="¡LLEGAS!" top={200} tam={130} desde={14} />}>
      <Frente cx={560} cy={cy} hx={700} th={0} manoR={MR} manoL={k > 0.9 ? META : ml} pieR={pie} pieL={pl} cara={k > 0.9 ? "alivio" : "esfuerzo"} f={f} />
      <g opacity={interpolate(f, [22, 30, 50], [0, 1, 0], clamp)}>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={META[0] - 30 + i * 22} cy={META[1] - 40 - ((f - 22) * (1.2 + i * 0.3))} r={9 + i} fill="#F4F7FA" opacity={0.8} />)}</g>
      <Anillo p={META} o={interpolate(f, [24, 34], [0, 1], clamp)} col="#6FE08A" />
      <g opacity={interpolate(f, [30, 40], [0, 1], clamp)}><Txt x={540} y={1300} t="REGLA: APOYOS NUNCA EN LA MISMA LÍNEA" tam={38} col="#E6EDF3" /></g>
    </Base>
  );
};
const Envio: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Base d={d} marcadas={[MR, [680, 1120], META]} top={<Etiqueta texto="MÁNDASELO AL QUE SIEMPRE SE ABRE" top={190} tam={74} desde={3} />}>
      <Frente cx={560} cy={900} hx={700} th={0} manoR={MR} manoL={META} pieR={[680, 1120]} pieL={[500, 1150]} cara="alivio" f={f} />
    </Base>
  );
};

export const ESCENAS: Record<string, React.FC<P>> = { puerta: Puerta, causa: Causa, principio: Principio, uno: Uno, dos: Dos, tres: Tres, llegas: Llegas, envio: Envio };
