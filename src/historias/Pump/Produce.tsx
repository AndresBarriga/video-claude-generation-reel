// 2 · Cómo se produce (7–23 s): sección transversal (las fibras aplastan el capilar), corte longitudinal (la sangre se amontona), antebrazo hinchado y la pista de los codos.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { Corte } from "./Corte";
import { BLOQUES, BRC, Cabeza, Camara, Chip, P, PM, Rotulo, Svg, ei, mundoC } from "./comun";
import { Cuerda, Esc, FondoGym, MANOS, Vig, Zoom, cyDoblado } from "./Gym";

const Seccion: React.FC<{ k: number; f: number; o: number }> = ({ k, f, o }) => {
  if (o <= 0) return null;
  const rin = 172 - 62 * k, rout = 286 - 70 * k, ri = 62 + 12 * k, ro = 60 + 10 * k;
  const celulas = Array.from({ length: 7 }).map((_, i) => ({ x: -60 + ((i * 37 + f * (2.4 * (1 - k))) % 120), y: ((i * 53) % 40) - 20 }));
  return (
    <g transform={`translate(540 830) scale(${0.85 + 0.15 * o})`} opacity={o}>
      <clipPath id="secC"><circle r={330} /></clipPath>
      <circle r={342} fill="#fff" /><circle r={330} fill="#8A2E34" />
      <g clipPath="url(#secC)">
        {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2 + 0.2; return <circle key={`o${i}`} cx={Math.cos(a) * rout} cy={Math.sin(a) * rout} r={ro} fill={PM.musculo} stroke="#7A2A2E" strokeWidth={7} />; })}
        {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <circle key={`i${i}`} cx={Math.cos(a) * rin} cy={Math.sin(a) * rin} r={ri} fill="#CF5E59" stroke="#7A2A2E" strokeWidth={7} />; })}
        {k > 0.15 && [0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + 0.5, L = 90 * k; return <path key={i} d={`M${Math.cos(a) * 250} ${Math.sin(a) * 250} L${Math.cos(a) * (250 - L)} ${Math.sin(a) * (250 - L)}`} stroke="#FF6A1F" strokeWidth={12} strokeLinecap="round" opacity={0.9} />; })}
        <ellipse rx={64} ry={64 * (1 - 0.84 * k)} fill="#E0575A" stroke="#7A1F24" strokeWidth={8} />
        {celulas.map((c, i) => <circle key={i} cx={c.x * (1 - k * 0.7) - 40 * k} cy={c.y * (1 - 0.84 * k)} r={9} fill="#FF9A9A" />)}
      </g>
    </g>
  );
};

const Dial: React.FC<{ p: number; o: number }> = ({ p, o }) => {
  const R = 150, a = (v: number) => ((-180 + 180 * v) * Math.PI) / 180, pt = (v: number, r: number) => `${540 + Math.cos(a(v)) * r} ${1290 + Math.sin(a(v)) * r}`;
  return (
    <g opacity={o}>
      <path d={`M${pt(0, R)} A${R} ${R} 0 0 1 ${pt(1, R)}`} stroke="#0B1624" strokeWidth={40} fill="none" strokeLinecap="round" />
      <path d={`M${pt(0, R)} A${R} ${R} 0 0 1 ${pt(Math.max(0.01, p), R)}`} stroke={p > 0.45 ? "#E04646" : "#FF9A3C"} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={`M540 1290 L${pt(p, R - 24)}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" /><circle cx={540} cy={1290} r={13} fill="#fff" />
      <text x={540} y={1350} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={44} fill="#fff" stroke="#050B14" strokeWidth={9} paintOrder="stroke">FUERZA</text>
    </g>
  );
};

export const Produce: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fVasos = pal("vasos") ?? 130, fMit = pal("mitad") ?? 175, fSang = pal("sangre") ?? 225, fRes = pal("Resultado") ?? 290;
  const fHin = pal("hinchado") ?? 300, fQue = pal("quemando") ?? 335, fSin = pal("sin") ?? 380, fAyuda = pal("ayuda") ?? 420;
  const k = ei(f, 0, fVasos, 0.1, 0.62) + ei(f, fMit, fSang - 8, 0, 0.38);
  const sec = ei(f, 0, 8, 0, 1) * (1 - ei(f, fSang - 6, fSang + 10, 0, 1));
  const dial = 0.2 + 0.3 * ei(f, fMit - 10, fSang - 10, 0, 1) + 0.05 * ei(f, 0, fMit, 0, 1);
  const largo = ei(f, fSang - 6, fSang + 10, 0, 1) * (1 - ei(f, fAyuda - 4, fAyuda + 4, 0, 1));
  const flujo = 1 - 0.93 * ei(f, fSang, fRes - 10, 0, 1);
  const res = ei(f, fHin, fSin + 20, 0, 1);
  const bomba = 0.55 + 0.45 * ei(f, fRes, fSin + 20, 0, 1);
  const codo = ei(f, fAyuda - 4, fAyuda + 6, 0, 1);
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  const [vx, vy] = mundoC(-110, -52), [mx, my] = mundoC(-250, 20);
  return (
    <Camara d={d} empuje={0.03} foco="50% 52%">
      <Svg>
        <FondoGym fuerte={0.35} />
        <Vig />
        <Seccion k={k} f={f} o={sec} />
        <Dial p={dial} o={sec} />
        {sec > 0.5 && <Chip x={540} y={470} t="CAPILAR" o={o(fVasos - 20, fMit)} col={PM.arteria} />}
        <Rotulo f={f} ini={fMit - 4} fin={fSang + 4} t="HACIA EL 50 %" y={230} tam={104} col="#FF9A3C" />
        {largo > 0.01 && (
          <g opacity={largo}>
            <Brazo {...BRC} f={f} bomba={bomba} corte={1} presa={false} abre={0.2} calor={0.8} dentro={<Corte f={f} aprieta={1} flujo={flujo} residuos={res} brilla={0.2 * res} />} />
            <Chip x={300} y={640} t="VASOS" o={o(fSang, fRes)} />
            <path d={`M300 670 L${vx} ${vy - 10}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" opacity={o(fSang, fRes)} />
            <Chip x={520} y={1270} t="HINCHADO" o={o(fHin - 4, fQue)} col="#FF9A3C" />
            <Chip x={520} y={1270} t="QUEMA" o={o(fQue - 4, fSin)} col="#FF6A1F" />
            <Chip x={520} y={1270} t="SIN FUERZA" o={o(fSin - 4, fAyuda + 20)} col={PM.hielo} />
            <path d={`M520 1236 L${mx} ${my + 30}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" opacity={o(fHin - 4, fAyuda)} />
          </g>
        )}
        {codo > 0.01 && (
          <g opacity={codo}>
            <Zoom z={1.45} oy={880}>
            <FondoGym fuerte={0.35} />
            <Cuerda perno={[540, 430]} arnes={[540, cyDoblado + 14]} flojo={0.6} />
            <Esc cx={540} cy={cyDoblado} manoL={MANOS.L} manoR={MANOS.R} pieL={[470, 1236]} pieR={[610, 1250]} cara="esfuerzo" f={f} halo={1} codos={{ col: "#FF4A3A", o: 1 }} />
            </Zoom>
            <Chip x={850} y={960} t="CODOS" col="#FF4A3A" />
          </g>
        )}
        <Cabeza x={170} y={470} cara={f < fRes ? "esfuerzo" : "dolor"} aro={BLOQUES[f < fRes ? 3 : 4]} o={1 - codo} />
      </Svg>
    </Camara>
  );
};
