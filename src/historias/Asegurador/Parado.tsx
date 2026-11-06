// 1 · Gancho: el rocódromo congelado (ella arriba, él a un palmo del suelo), con cortes cada ~0,7 s:
// plano general (empuje) → caras del público → cara de ella → él (el que pesa más) → se descongela y vemos la caída.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C, Caida, Camara, Encuadre, Fondo, Publico, Rotulo, Svg, aPantalla, ei, estado, golpe, ELLA, EL, SUELO, type P } from "./comun";

/** Magnesio suspendido en el aire (se mueve muy despacio aunque todo esté congelado). */
const Polvo: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => (
  <g>{Array.from({ length: 14 }).map((_, i) => {
    const a = i * 2.39, r = 30 + (i % 5) * 22;
    return <circle key={i} cx={x + Math.cos(a) * r + Math.sin(f * 0.05 + i) * 6} cy={y + Math.sin(a) * r * 0.6 - f * 0.25} r={3 + (i % 4) * 1.5} fill={C.magnesio} opacity={0.5} />;
  })}</g>
);

export const Plano: React.FC<{ k: number; congelado?: boolean; f: number }> = ({ k, congelado, f }) => {
  const st = estado(1);
  return (
    <>
      <Svg><Encuadre><Fondo apagado={congelado ? 1 : 0} /><Caida k={k} publico={<Publico r={congelado || k > 0.55 ? "miedo" : "nada"} giro={congelado || k > 0.4 ? 1 : 0} />} />
        {congelado && <Polvo f={f} x={st.mx} y={st.my + 120} />}</Encuadre></Svg>
      {congelado && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 50%, rgba(140,200,230,0) 40%, rgba(10,30,50,0.55) 100%)", mixBlendMode: "multiply" }} />}
    </>
  );
};

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAl = pal("alguien") ?? 20, fVein = pal("veinticuatro") ?? 48, fKil = pal("kilos") ?? 69, fSe = pal("se") ?? 90, fVol = pal("volando") ?? 103;
  const congelado = f < fSe;
  const k = congelado ? 1 : ei(f, fSe, fVol + 8, 0, 1, Easing.linear);
  const st = estado(1);
  // planos: [centro en pantalla, zoom inicial, zoom final]
  const publico = aPantalla(390, SUELO - 175), cara = aPantalla(st.mx + 20, st.my - 130 * ELLA.s), el = aPantalla(st.hx + 20, st.hy - 120 * EL.s);
  const plano = f < fAl ? 0 : f < fVein ? 1 : f < fKil ? 2 : 3;
  const [ini, fin] = [[0, fAl], [fAl, fVein], [fVein, fKil], [fKil, fSe]][plano];
  const [c, z0, z1] = ([[[600, 820], 1.12, 1.0], [publico, 1.9, 2.05], [cara, 2.1, 2.35], [el, 1.9, 2.1]] as const)[plano];
  const z = congelado ? ei(f, ini, fin, z0, z1, Easing.out(Easing.cubic)) : 1;
  const sac = golpe(f, 0, 12) + golpe(f, fAl, 8) + golpe(f, fVein, 8) + golpe(f, fKil, 8) + (!congelado && k > 0.62 && k < 0.7 ? Math.sin(f * 2.6) * 8 : 0);
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <AbsoluteFill style={{ transform: `translate(${sac}px, 0) scale(${z})`, transformOrigin: `${(c[0] / 1080) * 100}% ${(c[1] / 1920) * 100}%` }}>
        <Plano k={k} congelado={congelado} f={f} />
      </AbsoluteFill>
      <Svg><Rotulo f={f} ini={4} fin={congelado ? fSe : 1e9} t="+24 KG" y={300} tam={plano === 1 || plano === 3 ? 170 : 150} col="#FF6A1F" /></Svg>
    </Camara>
  );
};
