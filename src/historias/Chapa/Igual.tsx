// s2: pantalla partida. Izquierda: chapando alto. Derecha: con la chapa en la cintura. Misma flecha de caída (3 m);
// la de la izquierda empieza 1 m más abajo y acaba bajo el suelo. Cámara lenta hasta «segunda»; después caen de verdad.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Panel, Divisor, Pildora, Dato } from "../Factor/comun";
import { Fondo } from "../Suelta/comun";
import { clamp, golpe, type P, ALTO, CINT, SUELO, PC, D_CAIDA, mano, pAlto, pCint, resbala, caeSuelo, caeCuerda } from "./comun";
import { Mundo, Soga, Aseg, Ella, Polvo, Chapa1 } from "./piezas";
import { tramo } from "./Gancho";

const CAM = { cx: 657, cy: 2231, z: 1.05 }, BT = 20, XS = 690;
const scr = (lado: 0 | 1, wx: number, wy: number) => ({ x: lado * 540 + 270 + (wx - CAM.cx) * CAM.z, y: 960 + (wy - CAM.cy) * CAM.z });
const estado = (alto: boolean, f: number, fFa: number, f0: number) => {
  const ini = alto ? ALTO : CINT, bt = interpolate(f, [fFa, f0], [0, 1], clamp), aR = resbala(alto ? pAlto(f) : pCint(1), bt), k = f - f0, p0 = { x: ini.x - 5, y: ini.y + BT };
  if (k <= 0) return { p: { x: ini.x - 5 * bt, y: ini.y + BT * bt * bt }, ang: aR, rot: -3 * bt, j: -1, est: 0, bt, k };
  if (alto) { const c = caeSuelo(k, p0, aR, XS); return { p: c, ang: c.ang, rot: c.rot, j: c.j, est: 0, bt, k }; }
  const c = caeCuerda(k, p0, aR, BT); return { p: c, ang: c.ang, rot: 0, j: c.j, est: c.est, bt, k };
};
const Flecha: React.FC<{ x: number; y: number; g: number }> = ({ x, y, g }) => {
  if (g <= 0) return null;
  const fin = y + D_CAIDA * g, corte = Math.min(fin, SUELO), linea = (a: number, b: number, col: string, dash?: string) => <><path d={`M${x} ${a} V${b}`} stroke="#050B14" strokeWidth={22} strokeLinecap="round" /><path d={`M${x} ${a} V${b}`} stroke={col} strokeWidth={11} strokeLinecap="round" strokeDasharray={dash} /></>;
  return <g>{linea(y, corte, "#fff")}{fin > SUELO && linea(SUELO + 8, fin, PC.miedo, "4 16")}
    <path d={`M${x - 26} ${fin - 22} L${x} ${fin + 14} L${x + 26} ${fin - 22}`} stroke="#050B14" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${x - 26} ${fin - 22} L${x} ${fin + 14} L${x + 26} ${fin - 22}`} stroke={fin > SUELO ? PC.miedo : "#fff"} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
};

export const Igual: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame();
  const fFa = pal("fallas") ?? 5, fLo = pal("lo") ?? 31, fEmp = pal("empiezas") ?? 99, fSu = pal("suelo") ?? 195, f0 = fSu - 28;
  const g = interpolate(f, [fLo - 4, fLo + 14], [0, 1], clamp), nivel = interpolate(f, [fEmp - 2, fEmp + 10], [0, 1], clamp);
  const lados = ([true, false] as const).map((alto, i) => {
    const e = estado(alto, f, fFa, f0), ini = alto ? ALTO : CINT, h = mano(e.ang), H = { x: e.p.x + h.x, y: e.p.y + h.y }, pies = ini.y + 136, ax = ini.x - 100;
    const fImp = alto ? f0 + 22 : -99;
    return (
      <Panel key={i} lado={i as 0 | 1} cx={CAM.cx} cy={CAM.cy} z={CAM.z} sh={alto ? golpe(f, fImp, 14) : 0} fondo={<Fondo cx={CAM.cx} cy={CAM.cy} z={CAM.z} />}>
        <Mundo>
          {nivel > 0 && <path d={`M${ax - 120} ${pies} H${ax - 120 + 560 * nivel}`} stroke="#fff" strokeWidth={5} strokeDasharray="14 12" opacity={0.85} />}
          {alto && nivel > 0 && <g opacity={nivel}><path d={`M400 ${CINT.y + 136} H640`} stroke="#fff" strokeWidth={4} strokeDasharray="6 12" opacity={0.5} />
            <path d={`M452 ${CINT.y + 144} V${pies - 10} m-14 -18 l14 20 l14 -20`} stroke={PC.miedo} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
          <Flecha x={ax} y={pies} g={g} />
          <Aseg x={470} pilaDx={92} pilaR={0.55} comba={0.12} dy={e.j >= 0 ? (alto ? -14 * Math.exp(-e.j / 5) : -e.est * 0.55) : 0} cara={e.k > 4 ? "miedo" : "normal"} alza={1} />
          <Ella p={e.p} ang={e.ang} rot={e.rot} cara={e.j >= 0 ? (alto ? "dolor" : e.j > 10 ? "alivio" : "miedo") : "miedo"} sombra={e.k > 0} />
          <Chapa1 /><Soga pts={tramo(e.p, H, Math.min(1, Math.max(0, e.k) / 6), alto ? 440 : 300, e.j >= 0)} />
          {alto && <Polvo x={XS} k={e.j} />}
          {alto && e.j >= 0 && <rect x={300} y={SUELO - 3} width={700} height={9} fill={PC.miedo} opacity={0.9 * Math.exp(-e.j / 14)} />}
        </Mundo>
      </Panel>
    );
  });
  const eA = scr(0, ALTO.x - 100, ALTO.y + 136 + 230), eB = scr(1, CINT.x - 100, CINT.y + 136 + 250), m1 = scr(0, 452, 2118);
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      {lados}
      <Divisor />
      <Pildora x={270} texto="CHAPANDO ALTO" /><Pildora x={810} texto="A LA CINTURA" />
      <Dato x={eA.x - 82} y={eA.y} texto="3 m" s={interpolate(f, [fLo + 8, fLo + 14], [0, 1], clamp) * interpolate(f, [f0 + 4, f0 + 10], [1, 0], clamp)} tam={76} />
      <Dato x={eB.x - 82} y={eB.y} texto="3 m" s={interpolate(f, [fLo + 10, fLo + 16], [0, 1], clamp) * interpolate(f, [f0 + 4, f0 + 10], [1, 0], clamp)} tam={76} />
      <Dato x={m1.x + 62} y={m1.y} texto="–1 m" color={PC.miedo} s={interpolate(f, [fEmp + 6, fEmp + 12], [0, 1], clamp) * interpolate(f, [f0 + 4, f0 + 10], [1, 0], clamp)} tam={62} />
    </AbsoluteFill>
  );
};
