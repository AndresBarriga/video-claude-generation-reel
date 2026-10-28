// 4 · Rocódromo. «Está regalado.» (Paco, que ya lo ha encadenado, señala la pared) → llevas cuarenta minutos (el reloj da la vuelta → Lucía hundida en la colchoneta).
// 4b · Explicación (2.º gancho): él lo encadenó ayer en el pegue treinta; cuando ya te lo sabes, no recuerdas que costaba (maldición del conocimiento).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Mano } from "../../piezas/Mano";
import { Rocodromo, dePieR, sentadoR } from "../../piezas/Rocodromo";
import { AG, Camara, Cerca, Dato, LUCIA, Lucia, Paco, Partida, Planos, Svg, Zoom, clamp, colgado, trepa, type P } from "./comun";
import { Escalador } from "../../piezas/Escalador";
import { PACO } from "./comun";

export const Regalado: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => {
  const c1 = Math.round(d * 0.4), c2 = Math.round(d * 0.75);
  return <Planos d={d} cortes={[c1, c2]}><RelojCerca d={c1} /><LuciaPad d={c2 - c1} /><Yemas d={d - c2} /></Planos>;
}} />;

const Dice: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.05}>
    <Svg><Zoom s={1.6} cx={560} cy={1120} tx={540} ty={1040}>
      <Rocodromo min={0} />
      <Lucia x={250} y={sentadoR()} pose="sentadoSuelo" cara="normal" />
      <Paco x={700} y={dePieR(1.25)} pose="senalando" mira={-1} cara="alivio" angulos={{ brazoA: [140, 150], cabeza: -10 }} />
    </Zoom></Svg>
  </Camara>
);

const RelojCerca: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), min = interpolate(f, [0, d - 2], [0, 40], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (<Camara d={d} empuje={0.1} entrada={false}><Svg><Cerca cx={170} cy={520} s={3.4}><Rocodromo min={min} /></Cerca></Svg>
    <Dato texto={`+${Math.round(min)} MIN`} top={1180} /></Camara>);
};

const LuciaPad: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.08} entrada={false}><Svg><Zoom s={2.4} cx={260} cy={1180} tx={540} ty={1000}>
    <Rocodromo min={40} hundido={0.6} />
    <Lucia x={260} y={sentadoR() + 6} pose="lijando" cara="cerrados" angulos={{ cabeza: 40, torso: 24 }} />
  </Zoom></Svg></Camara>
);

const Yemas: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.1} entrada={false}><Svg><rect width={1080} height={1920} fill="#2C3748" />
    <Mano piel={LUCIA.piel} pielS={LUCIA.pielSombra} manga={LUCIA.chaqueta} x={540} y={1240} s={1.5} yemas={["flapper", "fina", "esparadrapo", "fina"]} abre={0.6} magnesio={0.4} />
  </Svg></Camara>
);

/** 4b · Pantalla partida: arriba AYER (pegue 30, cae, sufre, desaturado) · abajo HOY («regalado», sonriendo). */
export const Olvido: React.FC<{ d: number; hoy?: string }> = ({ d, hoy = "HOY: «REGALADO»" }) => {
  const f = useCurrentFrame();
  const peg = Math.round(interpolate(f, [0, d * 0.5], [1, 30], { ...clamp, easing: Easing.out(Easing.quad) }));
  return (<Camara d={d} empuje={0.04}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960, overflow: "hidden", filter: "grayscale(.85) sepia(.35)" }}><Ayer f={f} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, height: 960, overflow: "hidden" }}><Hoy f={f} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 954, height: 12, background: "#0B1624" }} />
    <Dato texto={`AYER · PEGUE ${peg}`} top={310} />
    <Dato texto={hoy} top={990} />
    {f > d * 0.55 && <Dato texto="Maldición del conocimiento" top={1080} />}
  </Camara>);
};
const Ayer: React.FC<{ f: number }> = ({ f }) => {
  const H = colgado(AG.crux, 1.25), t = trepa(H.x, H.y, 1.25), ciclo = f % 22, cae = ciclo > 12;
  const k = cae ? interpolate(ciclo, [12, 20], [0, 1], clamp) : 0;
  return (<Svg><Zoom s={1.5} cx={H.x + 40} cy={H.y + 40} tx={540} ty={560}>
    <Rocodromo reloj={false} hundido={k > 0.9 ? 0.8 : 0} />
    <Escalador quien="joe" aspecto={PACO} s={1.25} x={H.x + Math.sin(f * 2.5) * 4 + k * 40} y={H.y + k * 200} pose="escalando" poseB={cae ? "cayendo" : undefined} t={k} cara={cae ? "miedo" : "dolor"} angulos={cae ? undefined : { ...t.angulos, cabeza: -30 }} />
  </Zoom></Svg>);
};
const Hoy: React.FC<{ f: number }> = ({ f }) => (
  <Svg><Zoom s={2.6} cx={704} cy={dePieR(1.25) - 175} tx={540} ty={400}>
    <Rocodromo />
    <Paco x={700} y={dePieR(1.25) - Math.abs(Math.sin(f / 5)) * 3} pose="senalando" mira={-1} cara="alivio" angulos={{ brazoA: [140, 150], cabeza: -10 }} />
  </Zoom></Svg>
);

/** v3 · «Está blando. Como mucho, un seis B.» (Paco, chulo, en el roco) → lo sacó en el pegue treinta (pantalla partida) + maldición del conocimiento. */
export const Blando: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => <Olvido d={d} hoy="HOY: «ESTÁ BLANDO»" />} />;
