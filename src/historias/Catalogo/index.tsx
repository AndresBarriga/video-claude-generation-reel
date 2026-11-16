// Catálogo visual del KIT de cuerda (src/piezas/kit): una página por segundo. `npm run catalogo` → out/catalogo.png.
// Sirve para ver qué hay antes de empezar un vídeo y para revisar una pose nueva sin montar una escena.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Svg, PC, crearVia, PERFILES, POSE, REPARTO, pNudo, pChapa, pAgarra, Persona, Asegurador, Soga, porChapas, aparato, nudo, Plano, ExpresGrande, Cota, Diente, Destello, Polvo, caida, distCaida, saltoAseg, PM, type Angulos, type Aspecto } from "../../piezas/kit";

const T: React.FC<{ x: number; y: number; t: string; s?: number; a?: "middle" | "start" }> = ({ x, y, t, s = 34, a = "middle" }) => (
  <text x={x} y={y} textAnchor={a} fontFamily="Figtree" fontWeight={700} fontSize={s} fill="#fff" stroke="#050B14" strokeWidth={8} paintOrder="stroke" strokeLinejoin="round">{t}</text>
);
const Hoja: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <AbsoluteFill style={{ background: "#1B2533" }}><Svg><T x={540} y={90} t={titulo} s={56} />{children}</Svg></AbsoluteFill>
);
const CUEVA = crearVia({ metros: [3, 4.5, 6.3, 8] });
const SALA = crearVia({ perfil: PERFILES.panel, metros: [2.6, 3.9, 5.2, 6.5, 7.8] });

const Poses: React.FC = () => {
  const m = { x: 70, y: -190 };
  const L: [string, Angulos][] = [["POSE.agarre", POSE.agarre], ["POSE.agarreMira", POSE.agarreMira], ["POSE.reposo", POSE.reposo], ["pNudo()", pNudo()], ["pChapa(p, m) alta", pChapa({ x: 0, y: 0 }, m)], ["pChapa(p, m) cintura", pChapa({ x: 0, y: 0 }, { x: 80, y: -20 })], ["POSE.cae", POSE.cae], ["POSE.caeRecogida", POSE.caeRecogida], ["POSE.caeBien", POSE.caeBien], ["pAgarra(p, m)", pAgarra({ x: 0, y: 0 }, { x: 60, y: -150 })], ["POSE.recibe", POSE.recibe], ["POSE.colgado", POSE.colgado], ["POSE.sentado", POSE.sentado], ["POSE.pie", POSE.pie]];
  return <Hoja titulo="Poses (rig.ts)">{L.map(([n, a], i) => { const x = 150 + (i % 4) * 260, y = 380 + Math.floor(i / 4) * 410; return <g key={n}><Persona p={{ x, y }} ang={a} cara={i > 5 && i < 10 ? "miedo" : "normal"} /><T x={x + 10} y={y + 200} t={n} s={26} /></g>; })}</Hoja>;
};
const Reparto: React.FC = () => (
  <Hoja titulo="Reparto (REPARTO.*)">{(Object.entries(REPARTO) as [string, Aspecto][]).map(([n, a], i) => { const x = 200 + (i % 3) * 340, y = 620 + Math.floor(i / 3) * 760; return <g key={n} transform={`translate(${x} ${y}) scale(1.7)`}><Persona p={{ x: 0, y: 0 }} ang={POSE.pie} aspecto={a} /><T x={0} y={190} t={n} s={30} /></g>; })}</Hoja>
);
const General: React.FC<{ sala?: boolean }> = ({ sala }) => {
  const via = sala ? SALA : CUEVA, p = via.cadera(via.mos(1).y + 150), xa = sala ? 60 : 400, ap = aparato(via, xa);
  return (
    <AbsoluteFill>
      <Plano via={via} cx={sala ? 420 : 560} cy={2030} z={1.3} decorado={sala ? "sala" : "cueva"}>
        <Asegurador via={via} x={xa} cuerda={false} alza={1} aspecto={sala ? REPARTO.ase : REPARTO.el} />
        <Persona p={p} ang={pChapa(p, via.mos(1))} aspecto={sala ? REPARTO.nueva : REPARTO.ella} cara="esfuerzo" />
        <Soga pts={[...porChapas(via, ap, 1, p).slice(0, 2), { ...nudo(p), sx: -30 }, { x: via.mos(1).x - 16, y: via.mos(1).y + 8, sx: -60 }]} />
      </Plano>
      <Svg><T x={540} y={90} t={sala ? 'Plano decorado="sala" · PERFILES.panel' : 'Plano decorado="cueva" · PERFILES.desplome'} s={44} /></Svg>
    </AbsoluteFill>
  );
};
const Caidas: React.FC<{ suelo?: boolean }> = ({ suelo }) => {
  const via = CUEVA, i = suelo ? 0 : 2, p0 = suelo ? via.cadera(via.mos(1).y + 130) : via.cadera(via.mos(2).y - 190), sacada = suelo ? 1.5 : 0;
  const d = distCaida(via, p0, i, 0.3, sacada), o = { i, sacada, aire: suelo ? POSE.cae : POSE.caeBien }, fin = caida(via, 70, p0, POSE.agarre, o), dy = suelo ? 0 : saltoAseg(40, 3);
  return (
    <AbsoluteFill>
      <Plano via={via} cx={520} cy={suelo ? 2150 : 1900} z={suelo ? 1.25 : 0.95}>
        <Asegurador via={via} x={330} cuerda={false} dy={dy} vuelo={suelo ? 0 : 0.8} cara={suelo ? "miedo" : "esfuerzo"} />
        <Soga pts={porChapas(via, aparato(via, 330, dy), i + 1, fin, { floja: suelo ? 60 : 0 })} />
        {(suelo ? [0, 6, 11, 70] : [0, 7, 13, 19, 70]).map((k, n, L) => { const c = caida(via, k, p0, POSE.agarre, o); return <Persona key={k} p={c} ang={c.ang} rot={c.rot} o={n === L.length - 1 ? 1 : 0.35 + n * 0.1} cara={suelo ? "dolor" : "miedo"} />; })}
        {suelo && <Polvo x={fin.x} k={6} suelo={via.suelo} />}
        <Cota x={p0.x - 150} y={p0.y} largo={d} suelo={via.suelo} texto={`${(d / PM).toFixed(1)} m`} />
      </Plano>
      <Svg><T x={540} y={90} t="caida(via, k, p0, pose, { i, sacada })" s={44} /><T x={540} y={170} t={suelo ? "2.ª chapa con 1,5 m de cuerda sacada → decide SUELO sola" : "sobre la 3.ª chapa → la para la CUERDA (aire: caeBien)"} s={30} /></Svg>
    </AbsoluteFill>
  );
};
const Material: React.FC = () => (
  <Hoja titulo="Material y efectos">
    <rect x={0} y={130} width={1080} height={900} fill="#5A626D" />
    <ExpresGrande x={190} y={860} s={0.9} /><T x={190} y={1090} t="ExpresGrande" s={28} />
    <ExpresGrande x={540} y={860} s={0.9} abre={1} gira={8} color="#D4533F" /><T x={540} y={1090} t="abre=1 gira=8" s={28} />
    <ExpresGrande x={890} y={860} s={0.9} cuerda gatillo="der" color="#4FA06F" /><T x={890} y={1090} t='cuerda gatillo="der"' s={28} />
    <Soga pts={[{ x: 60, y: 1240 }, { x: 420, y: 1240, sag: 90 }]} /><T x={240} y={1400} t="Soga (sag)" s={28} />
    <Soga pts={[{ x: 60, y: 1500 }, { x: 420, y: 1500 }]} brillo={1} /><T x={240} y={1580} t="brillo" s={28} />
    <Soga pts={[{ x: 60, y: 1680 }, { x: 420, y: 1680, sag: 40 }]} fantasma /><T x={240} y={1780} t="fantasma" s={28} />
    <Soga pts={[{ x: 60, y: 1830 }, { x: 420, y: 1830 }]} idea={1} /><T x={240} y={1890} t="idea=1" s={28} />
    <Cota x={560} y={1200} largo={420} suelo={1500} texto="3 m" /><T x={560} y={1720} t="Cota (pasa del suelo)" s={28} />
    <Diente x={720} y={1420} k={5} /><T x={800} y={1500} t="Diente" s={28} />
    <Destello x={930} y={1300} k={2} /><T x={930} y={1420} t="Destello" s={28} />
    <Polvo x={900} k={8} suelo={1760} /><T x={900} y={1840} t="Polvo" s={28} />
  </Hoja>
);
const Asegura: React.FC = () => {
  const via = crearVia({ suelo: 1500 }), E: [string, object][] = [["normal (comba 0.1)", {}], ["comba=0.8", { comba: 0.8 }], ["feed=1 (da cuerda)", { feed: 1, alza: 1 }], ["dy=-110 vuelo=1 (frenada)", { dy: -110, vuelo: 1, comba: 0, cara: "esfuerzo" }]];
  return (
    <Hoja titulo="Asegurador">
      {E.map(([n, o], i) => { const x = 170 + (i % 2) * 520, ty = Math.floor(i / 2) * 820; return <g key={n} transform={`translate(0 ${ty - 560})`}><path d={`M${x - 160} 1500 h440`} stroke={PC.suelo} strokeWidth={14} /><Asegurador via={via} x={x} hacia={{ x: x + 250, y: 1010 }} aspecto={i % 2 ? REPARTO.ase : REPARTO.el} {...o} /><T x={x + 60} y={1580} t={n} s={28} /></g>; })}
    </Hoja>
  );
};
import { Primeros, Acciones, Comparar, Montaje } from "./mas";
const PAGINAS = [Poses, Reparto, () => <General />, () => <General sala />, () => <Caidas />, () => <Caidas suelo />, Material, Asegura, Primeros, Acciones, Comparar, Montaje];
export const N_CATALOGO = PAGINAS.length;
export const Catalogo: React.FC = () => { const Pg = PAGINAS[Math.min(PAGINAS.length - 1, Math.floor(useCurrentFrame() / 30))]; return <Pg />; };
