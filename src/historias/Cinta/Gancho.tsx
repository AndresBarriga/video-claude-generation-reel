// s0 GANCHO (rótulo-pregunta desde el fotograma 0): altísimo, se le va el pie y cae. Cuando la cuerda tensa en la última cinta, cámara lenta:
// la cinta gira sobre la chapa, la puerta se abre contra ella (lupa de frente) y se SALE. Sigue cayendo hasta que le para la chapa de abajo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Plano, Persona, Asegurador, Soga, porChapas, aparato, caeCuerda, resbala, saltoAseg, lento, Destello, Pregunta, Lupa, Chip, Expres, nudo, POSE } from "../../piezas/kit";
import { clamp, golpe, suave, lerp, type P, VIA, TU, ASE, TOP, B6, B5, P0, D_MAL, K1, K2, XASE, AG } from "./comun";
import { CintaF, ParedCerca, CuerdaM, abajoDe } from "./Macro";

const F0 = 5, LENTO = 62, FACTOR = 0.07;
/** Estado del gancho en el fotograma f (también lo usa el cierre para el bucle). */
export const estadoGancho = (f: number) => {
  const kS = K1 - 1.5, k = lento(f - F0, kS, LENTO, FACTOR), fPop = F0 + kS + LENTO - 8, pop = f - fPop;
  const pre = interpolate(f, [0, F0], [0.5, 1], clamp), a0 = resbala(AG, pre);
  const c = caeCuerda(Math.max(0, k), { x: P0.x - 6, y: P0.y }, a0, { d: D_MAL, ancla: B5, aire: POSE.cae });
  const fCatch = F0 + kS + LENTO + (K2 - kS - LENTO * FACTOR);
  return { c, k, pop, fPop, fCatch, enLento: f - F0 > kS && f < fPop + 8, tens: interpolate(f, [F0 + kS - 2, F0 + kS + 4], [0, 1], clamp) };
};
export const PlanoGancho: React.FC<{ f: number; pregunta?: boolean }> = ({ f, pregunta = true }) => {
  const e = estadoGancho(f), { c, pop } = e, p = { x: c.x, y: c.y }, suelta = pop >= 0;
  const z = interpolate(f, [0, 22, e.fPop, e.fPop + 16, e.fCatch + 6], [0.95, 1.25, 1.55, 0.7, 0.62], clamp);
  const cy = interpolate(f, [0, 22, e.fPop, e.fCatch + 6], [P0.y + 250, P0.y + 190, B6.y + 150, P0.y + 900], clamp), cx = interpolate(f, [0, 22, e.fPop + 16], [560, 500, 560], clamp);
  const giroW = suelta ? 0 : -70 * suave((f - (F0 + K1)) / 30) * e.tens;
  const dy = c.j >= 0 ? saltoAseg(c.est, c.j, 0.5) : 0, ap = aparato(VIA, XASE, dy);
  const pts = suelta ? porChapas(VIA, ap, TOP, p, { comba: 20, floja: c.j >= 0 ? 0 : 30 }) : [...porChapas(VIA, ap, TOP, p).slice(0, -1), { x: B6.x + 20 * e.tens, y: B6.y - 26 * e.tens }, { ...nudo(p), sag: (1 - e.tens) * 40 }];
  // la cinta suelta baja por la cuerda hacia él
  const t = suelta ? Math.min(1, pop / 14) : 0, n = nudo(p), cs = { x: lerp(B6.x, n.x - 30, t), y: lerp(B6.y - 54, n.y - 150, t) };
  const lupa = interpolate(f, [e.fPop + 10, e.fPop + 16], [1, 0], clamp), g = suave((f - (F0 + K1 + 6)) / (e.fPop - (F0 + K1 + 6)));
  const cinta = { x: -70, y: -235, s: 0.6, puerta: "der" as const, giro: -62 * Math.min(1, g * 1.5), corre: suave((g - 0.45) / 0.3), abreArriba: suave((g - 0.62) / 0.3), suelta: suelta ? { dx: pop * 14, dy: pop * pop * 2.2, rot: pop * 7 } : undefined };
  const ab = abajoDe(cinta);
  return (
    <>
      <Plano via={VIA} cx={cx} cy={cy} z={z} decorado="roca" cintas={false} sh={golpe(f, e.fPop, 12) + golpe(f, Math.round(e.fCatch), 16)}>
        {VIA.chapas.map((y, i) => i === TOP ? null : <Expres key={i} x={VIA.xF(y)} y={y} color="#D4533F" />)}
        <circle cx={VIA.xF(VIA.chapas[TOP]) + 4} cy={VIA.chapas[TOP]} r={11} fill="#B8C0C8" stroke="#081120" strokeWidth={4} />
        {!suelta && <g transform={`rotate(${giroW} ${VIA.xF(VIA.chapas[TOP])} ${VIA.chapas[TOP]})`}><Expres x={VIA.xF(VIA.chapas[TOP])} y={VIA.chapas[TOP]} color="#D4533F" /></g>}
        <Asegurador via={VIA} x={XASE} aspecto={ASE} cuerda={false} dy={dy} alza={1} cara={f > F0 + 8 ? "miedo" : "normal"} comba={0.1} />
        <Soga pts={pts} />
        {suelta && <g transform={`translate(${cs.x} ${cs.y}) rotate(${pop * 16})`}><path d="M0 0 L-4 40" stroke="#D4533F" strokeWidth={12} strokeLinecap="round" /><ellipse cx={0} cy={-8} rx={9} ry={15} fill="none" stroke="#C9D1D8" strokeWidth={5} /><ellipse cx={-6} cy={48} rx={9} ry={15} fill="none" stroke="#C9D1D8" strokeWidth={5} /></g>}
        <Persona p={p} ang={c.ang} aspecto={TU} cara={c.j > 10 ? "dolor" : "miedo"} tiembla={f < F0 ? Math.sin(f * 2.2) * 3 : 0} />
        <Destello x={B6.x + 6} y={B6.y - 50} k={pop} r={70} />
      </Plano>
      <Lupa x={300} y={1010} r={270} k={lupa} fondo="#CDBB9E">
        <g transform="scale(0.9)"><ParedCerca seed="lg" /><CuerdaM d={`M-330 420 Q-160 300 ${ab.x} ${ab.y + 40} Q${ab.x + 120} ${ab.y - 60} 380 ${ab.y + 380}`} w={30} /><CintaF {...cinta} /></g>
      </Lupa>
      {e.enLento && <Chip texto="CÁMARA LENTA" top={1330} k={lupa} tam={40} />}
      {pregunta && <Pregunta texto="¿SE SUELTA?" tam={112} />}
    </>
  );
};
export const Gancho: React.FC<P> = () => <PlanoGancho f={useCurrentFrame()} />;
