// «Pasa pocas veces. Con una basta.» (negro + contador de dedos) · TOMA buena · «deja que la cuerda haga su trabajo» · cierre con bucle al fotograma 0.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, sistemaCaida, POSE, mix, Chip, Lupa, Agarre, Envio, Pregunta, Etiqueta, bucle, suave } from "../../piezas/kit";
import { VIA, I, P0, XA, TU, ASE, Mundo, Rebobina, Toma, N_REB, clamp, type P } from "./comun";
import { Lenta } from "./Gancho";

/** «Pasa pocas veces. Con una basta.»: marcador de videojuego. Mano de guante con sus 5 dedos; el índice salta (como el diente) y el contador baja a 4. */
export const Dedo: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), F = 16, k = f - F, fB = pal("basta") ?? 50, cuatro = k >= 0, punch = cuatro ? 1 + 0.6 * Math.exp(-k / 4) : 1;
  const D = [[-150, -40, -34, 150], [-70, -150, -10, 200], [10, -170, 0, 220], [90, -150, 10, 200], [165, -90, 22, 160]]; // x, y, giro, largo
  const dedo = (i: number, extra = "") => { const [x, y, r, l] = D[i]; return <g key={i + extra} transform={`translate(${x} ${y}) rotate(${r})`}><rect x={-34} y={-l} width={68} height={l + 40} rx={34} fill="#F4F1EA" stroke="#050B14" strokeWidth={12} /></g>; };
  const sh = cuatro && k < 8 ? Math.sin(k * 2.4) * 14 * (1 - k / 8) : 0;
  return (
    <AbsoluteFill style={{ background: "#0B1422" }}>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, transform: `translate(${sh}px, 0)` }}>
        <g transform={`translate(540 1010) scale(${1 + 0.04 * Math.sin(f / 5)})`}>
          {[0, 2, 3, 4].map((i) => dedo(i))}
          {!cuatro && dedo(1)}
          {cuatro && <g transform={`translate(${D[1][0]} ${D[1][1]}) rotate(${D[1][2]})`}><rect x={-34} y={-200} width={68} height={240} rx={34} fill="none" stroke="#E2533F" strokeWidth={8} strokeDasharray="16 14" opacity={0.9} /></g>}
          <rect x={-190} y={-150} width={380} height={330} rx={110} fill="#F4F1EA" stroke="#050B14" strokeWidth={12} />
          <rect x={-150} y={170} width={300} height={90} rx={30} fill="#3F7F86" stroke="#050B14" strokeWidth={12} />
          {cuatro && <g transform={`translate(${-70 - 16 * k} ${-260 - 30 * k + 1.5 * k * k}) rotate(${-10 - k * 31})`}><rect x={-34} y={-100} width={68} height={200} rx={34} fill="#F4F1EA" stroke="#050B14" strokeWidth={12} /></g>}
          {cuatro && k < 9 && <g transform={`translate(-70 -250) rotate(${k * 12}) scale(${1.4 + k * 0.45})`} opacity={1 - k / 9}><path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z" fill="#fff" /></g>}
        </g>
      </svg>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 130, color: "#fff" }}>
        DEDOS <span style={{ display: "inline-block", color: cuatro ? "#E2533F" : "#fff", transform: `scale(${punch}) rotate(${cuatro ? -6 * Math.exp(-k / 6) : 0}deg)` }}>× {cuatro ? 4 : 5}</span>
      </div>
      {f >= fB - 2 && <div style={{ position: "absolute", top: 500, left: 360, width: 360, height: 12, borderRadius: 6, background: "#E2533F", transform: `scaleX(${Math.min(1, (f - fB + 2) / 6)})` }} />}
    </AbsoluteFill>
  );
};
const estado = (k: number) => sistemaCaida(VIA, k, P0, POSE.agarre, { i: I, xAseg: XA, dina: 1, aire: POSE.caeBien, comba: 0.5 });
const OK: React.FC<{ t: string; top: number; k: number }> = ({ t, top, k }) => <Chip texto={`✓  ${t}`} top={top} tam={52} k={Math.min(1, Math.max(0, k) / 5)} color="#2E8B57" />;
export const Bien: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), f0 = pal("no") ?? 26, fP = (pal("pies") ?? d - 60) + 2, fL = fP + 30;
  const k = f < f0 ? 0 : f < fP ? (f - f0) * (11 / Math.max(1, fP - f0)) : 11 + (f - fP), s = estado(k), reb = f < N_REB ? 1 - f / N_REB : 0;
  // realista y con rebote: se separa de la pared al caer, la cuerda lo trae en péndulo, recibe con los pies, las rodillas ceden y rebota
  const j = s.j, osc = j < 0 ? 0 : -52 * Math.exp(-j / 15) * Math.cos(j / 4.4), fuera = j < 0 ? -52 * suave(k / 17) : osc - 74 * Math.min(1, j / 7) + 52 * Math.min(1, j / 7) * 0, cede = Math.max(0, osc) / 14, bote = j < 0 ? 0 : -20 * Math.exp(-j / 11) * Math.abs(Math.sin(j / 4.4));
  const pies = { ...POSE.recibe, torso: -16, brazoA: [56 + 6 * Math.sin(f / 3), 98] as [number, number], brazoB: [38, 86 + 6 * Math.sin(f / 3)] as [number, number] };
  const ang = j < 0 ? s.ang : mix(mix(POSE.caeBien, pies, Math.min(1, j / 7)), { ...pies, torso: -4, piernaA: [108, 18], piernaB: [92, 4] }, Math.min(1, cede));
  const p = reb ? { x: P0.x - 30 * reb, y: P0.y + 300 * reb } : { x: s.p.x + fuera, y: s.p.y + bote }, saluda = interpolate(f, [fL, fL + 6], [0, 1], clamp);
  return (
    <>
      <Mundo cx={500} cy={p.y - 70} z={1.6} sh={s.sh * 0.5}>
        <Asegurador via={VIA} aspecto={ASE} alza={1} {...s.aseg} />
        <Soga pts={reb ? s.pts : [...s.pts.slice(0, -1), { ...s.pts[s.pts.length - 1], x: s.pts[s.pts.length - 1].x + fuera, y: s.pts[s.pts.length - 1].y + bote }]} />
        <Persona p={p} ang={reb ? POSE.colgado : ang} aspecto={TU} cara={j >= 0 ? (cede > 0.3 ? "esfuerzo" : "alivio") : f > f0 ? "esfuerzo" : "normal"} rot={j < 0 ? -4 * suave(k / 17) : -4 - 6 * (1 - Math.exp(-j / 8))} />
        {j >= 0 && cede > 0.2 && [0, 1, 2].map((i) => <path key={i} d={`M${p.x + 96} ${p.y + 20 + i * 22} h${14 + i * 4}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />)}
      </Mundo>
      <Rebobina k={f} /><Toma n="LA BUENA" k={f - N_REB} />
      <Etiqueta texto="ASÍ SE CAE" top={262} tam={100} desde={N_REB + 2} />
      <OK t="MANOS DELANTE" top={452} k={f - (pal("manos") ?? 60)} /><OK t="BRAZOS BLANDOS" top={548} k={f - (pal("brazos") ?? 80)} /><OK t="PIES A LA PARED" top={644} k={f - (pal("pies") ?? 100)} />
      <Lupa x={290} y={1120} r={210} k={saluda} fondo="#7FB7D9">
        <Agarre x={-20} y={60} s={0.62} rot={-90 + Math.sin(f / 3) * 12} cierra={0} piel="#B9825A" pielS="#94613E" manga="#3F7F86" />
        <text x={120} y={-70} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={150} fill="#fff" stroke="#050B14" strokeWidth={16} paintOrder="stroke">5</text>
      </Lupa>
    </>
  );
};
export const Confia: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), s = estado(70 + f), z = 1.25 - 0.3 * suave(f / d);
  return (
    <Mundo cx={450} cy={s.p.y + 330 * suave(f / d)} z={z}>
      <Asegurador via={VIA} aspecto={ASE} alza={1} {...s.aseg} cara="alivio" />
      <Soga pts={s.pts} brillo={0.55 + 0.45 * Math.sin(f / 4)} />
      <Persona p={s.p} ang={{ ...s.ang, brazoA: [150, 170] }} aspecto={TU} cara="alivio" />
    </Mundo>
  );
};
export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fN = pal("no") ?? 44, va = interpolate(f, [0, fN], [0.35, 0.92], clamp), ret = suave((f - fN) / 9), b = bucle(f, d, 8);
  return (
    <>
      <Lenta f={f} va={va} retira={ret} />
      <Envio a="quien siempre agarra la cinta" top={300} k={Math.min(1, Math.max(0, f - (pal("salvarte") ?? 24)) / 6) * (1 - b)} />
      {b > 0 && <AbsoluteFill style={{ opacity: b }}><Lenta f={0} va={0.35} /><Pregunta texto="¿LA AGARRAS?" top={300} tam={104} /></AbsoluteFill>}
    </>
  );
};
