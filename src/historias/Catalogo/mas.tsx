// Catálogo del kit, 2.ª parte: primeros planos, acciones, montaje y decorado de día.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Svg, crearVia, PERFILES, POSE, REPARTO, Persona, Asegurador, Soga, aparato, Plano, Reunion, Agarre, CuerdaGrande, AparatoGrande, OchoGrande, MosquetonGrande, ExpresGrande, accEscalar, accChapar, sogaChapar, sistemaCaida, accDescolgar, accAseg, porChapas, Pregunta, Envio, Chip, Partida, Foco, Lupa } from "../../piezas/kit";

const T: React.FC<{ x: number; y: number; t: string; s?: number }> = ({ x, y, t, s = 28 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={s} fill="#fff" stroke="#050B14" strokeWidth={8} paintOrder="stroke" strokeLinejoin="round">{t}</text>
);
const ROCA = crearVia({ perfil: PERFILES.vertical, metros: [2.8, 4.3, 6, 7.6] });
const SALA = crearVia({ perfil: PERFILES.panel, metros: [2.6, 3.9, 5.2, 6.5, 7.8] });

export const Primeros: React.FC = () => (
  <AbsoluteFill style={{ background: "#4A515C" }}><Svg>
    <T x={540} y={90} t="Primeros planos (Primeros.tsx)" s={52} />
    <Agarre x={230} y={380} s={0.8} cierra={0}><CuerdaGrande d="M0 -230 V230" /></Agarre><T x={230} y={640} t="Agarre cierra=0" />
    <Agarre x={760} y={380} s={0.8} cierra={1} manga="#8E7CC3"><CuerdaGrande d="M0 -230 V230" tensa={1} /></Agarre><T x={760} y={640} t="Agarre cierra=1 (hijo = cuerda)" />
    <AparatoGrande x={200} y={980} s={0.62} /><T x={200} y={1250} t="AparatoGrande" />
    <AparatoGrande x={540} y={980} s={0.62} bloquea={1} rosca={0} /><T x={540} y={1250} t="bloquea=1 rosca=0" />
    <g><Agarre x={850} y={1150} s={0.42} rot={-20} cierra={1}><g /></Agarre><AparatoGrande x={930} y={980} s={0.5} /></g><T x={880} y={1250} t="+ Agarre (mano de freno)" />
    <OchoGrande x={170} y={1560} s={0.55} repaso={0.45} /><T x={170} y={1850} t="OchoGrande repaso=0.45" />
    <OchoGrande x={470} y={1560} s={0.55} /><T x={470} y={1850} t="repaso=1" />
    <MosquetonGrande x={720} y={1560} s={1.1} rosca={0} abre={0.6} /><T x={720} y={1850} t="Mosquetón rosca=0" />
    <MosquetonGrande x={940} y={1560} s={1.1} rosca={1} /><T x={940} y={1850} t="rosca=1" />
  </Svg></AbsoluteFill>
);
export const Acciones: React.FC = () => {
  const via = ROCA, p = via.cadera(via.mos(2).y + 40), a = accChapar(via, p, 2, 0.55, { temblor: 1 }), xa = 250, g = accAseg("dar", 0.5);
  return (
    <AbsoluteFill>
      <Plano via={via} cx={520} cy={1800} z={0.93} decorado="roca">
        <Asegurador via={via} x={xa} cuerda={false} {...g} aspecto={REPARTO.ase} />
        {[0.15, 0.5, 0.85].map((t, i) => { const e = accEscalar(via, via.pie - 30, via.mos(1).y + 60, t); return <Persona key={i} p={e.p} ang={e.ang} aspecto={REPARTO.tu} o={0.45} />; })}
        <Persona p={p} ang={a.ang} aspecto={REPARTO.tu} cara="esfuerzo" />
        <Soga pts={sogaChapar(via, aparato(via, xa), 2, p, a)} />
        <Foco x={via.mos(2).x} y={via.mos(2).y} r={60} />
      </Plano>
      <Svg><T x={540} y={90} t='decorado="roca" · accEscalar · accChapar + sogaChapar' s={38} /><T x={540} y={160} t="accAseg(&quot;dar&quot;) · Foco" s={30} /></Svg>
    </AbsoluteFill>
  );
};
const Lado: React.FC<{ dina: number }> = ({ dina }) => {
  const via = SALA, p0 = via.cadera(via.mos(3).y - 120), s = sistemaCaida(via, 30, { x: p0.x, y: p0.y }, POSE.agarre, { i: 3, xAseg: 230, dina });
  return <Plano via={via} cx={380} cy={1900} z={0.8} decorado="sala" sh={0}><Asegurador via={via} {...s.aseg} aspecto={REPARTO.el} /><Persona p={s.p} ang={s.ang} aspecto={REPARTO.nueva} cara={s.cara} /><Soga pts={s.pts} /></Plano>;
};
export const Comparar: React.FC = () => (
  <AbsoluteFill>
    <Partida izq={<Lado dina={0} />} der={<Lado dina={1} />} rotulos={["SECA", "DINÁMICA"]} />
    <Svg><T x={540} y={90} t="Partida + Sello · sistemaCaida(dina 0 / 1)" s={40} /></Svg>
  </AbsoluteFill>
);
export const Montaje: React.FC = () => {
  const via = ROCA, top = via.aM(8.6), d = accDescolgar(via, top + 150, via.pie, 0.35), an = { x: via.xF(top) - 20, y: top };
  return (
    <AbsoluteFill>
      <Plano via={via} cx={500} cy={1750} z={0.9} decorado="roca">
        <Reunion x={an.x} y={an.y} />
        <Asegurador via={via} x={230} cuerda={false} alza={1} />
        <Soga pts={[aparato(via, 230), ...porChapas(via, aparato(via, 230), 4, d.p).slice(1, 5), an, { x: d.p.x + 18, y: d.p.y - 6 }]} />
        <Persona p={d.p} ang={d.ang} aspecto={REPARTO.ella} cara="alivio" />
      </Plano>
      <Pregunta texto="¿LO HAS MIRADO?" top={210} tam={90} />
      <Lupa x={300} y={900} r={230}><OchoGrande x={0} y={-10} s={0.6} repaso={0.5} /></Lupa>
      <Chip texto="CÁMARA LENTA" top={1340} tam={40} />
      <Envio />
      <Svg><T x={540} y={90} t="Pregunta · Lupa · Chip · Envio · Reunion · accDescolgar" s={34} /></Svg>
    </AbsoluteFill>
  );
};
void ExpresGrande;
