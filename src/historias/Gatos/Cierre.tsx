// s9 CIERRE: «Y tú, con tus ciento ochenta euros… quitándotelos nada más bajar.» Anochece al pie de la placa: le bajan, toca suelo, se sienta en
// una roca todavía encordado y se arranca los gatos (vuelan con su etiqueta de 180 €); suspiro. Ella asegura con la mano de freno en la cuerda.
// Los últimos fotogramas vuelven al primer plano del vídeo (bucle).
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador, type Angulos } from "../../piezas/Escalador";
import { Svg, clamp, cam, mix, golpe, brazo, Cuerda, C, TU_ROCA, ELLA, G, T, Pildora, Rotulo, type P } from "./comun";
import { FondoP, Placa, SUELO_P, xP, luz } from "./Placa";
import { Macro } from "./Compra";

const ROCA = { x1: 262, x2: 420, y: SUELO_P - 80 };
const COLGADO: Angulos = { torso: -8, cabeza: 10, brazoA: [150, 172], brazoB: [140, 168], piernaA: [50, 10], piernaB: [36, 4] };
const SENT: Angulos = { torso: -2, cabeza: 8, brazoA: [24, 62], brazoB: [16, 56], piernaA: [80, 0], piernaB: [72, -2] };
const TIRA: Angulos = { torso: 30, cabeza: 26, brazoA: [70, 52], brazoB: [62, 44], piernaA: [98, 26], piernaB: [72, -2] };
const ALIVIO: Angulos = { torso: -16, cabeza: -22, brazoA: [-30, -60], brazoB: [-44, -70], piernaA: [74, 30], piernaB: [66, 22] };
const rad = (g: number) => (g * Math.PI) / 180, ext = (x: number, y: number, a: number, l: number): [number, number] => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];
const pieDe = (hip: { x: number; y: number }, p: [number, number], mira: number) => { const r = ext(0, 0, p[0], 66), t = ext(r[0], r[1], p[1], 64), u = ext(t[0], t[1], p[1] + 90, 22); return { t: { x: hip.x + mira * t[0], y: hip.y + t[1] }, u: { x: hip.x + mira * u[0], y: hip.y + u[1] } }; };

/** Gato que sale volando con su etiqueta. t 0–1. */
const Vuela: React.FC<{ de: { x: number; y: number }; a: { x: number; y: number }; t: number; alto: number; giro: number }> = ({ de, a, t, alto, giro }) => {
  const x = de.x + (a.x - de.x) * t, y = de.y + (a.y - de.y) * t - alto * 4 * t * (1 - t), bote = t >= 1 ? 0 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro * t * bote + (t >= 1 ? 8 : 0)}) scale(0.4)`}>
      <path d="M-60 16 L44 16 Q68 14 64 0 Q56 -18 32 -20 L-8 -48 Q-30 -56 -50 -46 Q-66 -24 -64 2 Z" fill={G.gato} stroke={T} strokeWidth={9} strokeLinejoin="round" />
      <path d="M-62 16 L44 16 Q68 14 64 0" stroke={G.goma} strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M-2 -42 L12 -14 M14 -32 L26 -10" stroke={G.goma} strokeWidth={12} strokeLinecap="round" />
      <g transform={`translate(-52 -44) rotate(${-30 + Math.sin(t * 14) * 30 * bote})`}><path d="M0 0 V-34" stroke="#E9E2D0" strokeWidth={4} /><rect x={-58} y={-98} width={116} height={64} rx={8} fill="#F3ECDA" stroke={T} strokeWidth={7} /><text x={0} y={-52} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={40} fill={T}>180 €</text></g>
    </g>
  );
};

export const Cierre: React.FC<P> = ({ e, d, pal }) => {
  const v2 = (e as { v2?: boolean })?.v2; // E63 v5: sin rótulos propios (los pone GatosV2)
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fC = pal("ciento") ?? 32, fQ = pal("quitándotelos") ?? 77, fB = pal("bajar") ?? 118;
  const f1 = fQ + 10, f2 = fB - 2, lazo = d - 9, L = luz(1);
  if (f >= lazo) return <Macro f={0} golpes={[5, 21, 39, 67]} fDolor={125} />;
  const baja = interpolate(f, [0, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) }), sienta = interpolate(f, [13, 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const agarra = interpolate(f, [fQ - 26, fQ - 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }), suelta = spring({ frame: f - f1, fps, config: { damping: 9, stiffness: 150 } });
  const tira2 = interpolate(f, [f2 - 9, f2 - 2, f2, f2 + 8], [0, 1, 1, 0], clamp);
  const mira = f < 16 ? 1 : -1, hip = { x: 404 - sienta * 62, y: SUELO_P - 196 + baja * 60 + sienta * 49 };
  let a = mix(COLGADO, { ...SENT, piernaA: [8, 0], piernaB: [-8, 0], brazoA: [20, 30], brazoB: [-16, -20] }, baja);
  a = mix(a, SENT, sienta); a = mix(a, TIRA, agarra * (1 - suelta)); a = mix(a, ALIVIO, suelta * (1 - tira2 * 0.7));
  if (f > f1 - 9 && f < f1) a = { ...a, torso: a.torso + Math.sin(f * 2.4) * 2.5, piernaA: [a.piernaA[0] + Math.sin(f * 2.4) * 3, a.piernaA[1]] };
  if (tira2 > 0) a = { ...a, piernaB: [72 + tira2 * 22, -2 + tira2 * 26] };
  const pA = pieDe(hip, a.piernaA, mira), pB = pieDe(hip, a.piernaB, mira), sinA = f >= f1, sinB = f >= f2;
  const descalzo = (p: typeof pA) => <g><path d={`M${p.t.x} ${p.t.y + 2} L${p.u.x} ${p.u.y + 2}`} stroke={G.piel} strokeWidth={23} strokeLinecap="round" />{[0, 1, 2].map((i) => <circle key={i} cx={p.u.x + mira * (4 + Math.sin(f / 3 + i) * 2)} cy={p.u.y - 7 + i * 7 + Math.sin(f / 2.5 + i * 2) * 2.5} r={5.5} fill={G.piel} stroke={G.pielS} strokeWidth={2} />)}</g>;
  // quien asegura: mano de freno (delante) siempre en la cuerda bajo el aparato; guía arriba; madeja en el suelo
  const eh = { x: 96, y: SUELO_P - 136 }, ap = { x: eh.x + 22, y: eh.y - 14 }, anc = { x: xP(-900) - 10, y: -900 };
  const k = 72 / Math.hypot(anc.x - ap.x, anc.y - ap.y), guia = { x: ap.x + (anc.x - ap.x) * k, y: ap.y + (anc.y - ap.y) * k }, freno = { x: ap.x + 10, y: ap.y + 16 }, pila = { x: 196, y: SUELO_P - 6 };
  const t1 = interpolate(f, [f1, f1 + 16], [0, 1], clamp), t2 = interpolate(f, [f2, f2 + 15], [0, 1], clamp);
  const sh = golpe(f, f1, 10) + golpe(f, f2, 8), z = interpolate(f, [0, 40, lazo], [1.6, 1.85, 1.95], clamp);
  const arnes = { x: hip.x + mira * 18, y: hip.y - 8 }, floja = sienta * 0.9;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.5}px)` }}>
      <Svg>
        <FondoP h={1} cx={300} cy={2500} z={z} />
        <g transform={cam(interpolate(f, [0, 40], [320, 262], clamp), 2480, z)}>
          <Placa h={1} cintas={99999} />
          <path d={`M${ROCA.x1 - 16} ${SUELO_P + 14} Q${ROCA.x1 - 6} ${ROCA.y - 6} ${ROCA.x1 + 40} ${ROCA.y} L${ROCA.x2 - 20} ${ROCA.y - 2} Q${ROCA.x2 + 16} ${ROCA.y + 20} ${ROCA.x2 + 20} ${SUELO_P + 14} Z`} fill={L.roca} stroke={T} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M${ROCA.x1 + 30} ${ROCA.y + 4} L${ROCA.x2 - 24} ${ROCA.y + 2}`} stroke={L.rocaL} strokeWidth={8} strokeLinecap="round" />
          {/* mochila y cuerda */}
          <g transform={`translate(-40 ${SUELO_P})`}><rect x={-44} y={-110} width={88} height={112} rx={26} fill="#33475E" stroke={T} strokeWidth={5} /><rect x={-30} y={-64} width={60} height={40} rx={10} fill="#22303F" /><path d="M-20 -110 q20 -30 40 0" stroke={T} strokeWidth={7} fill="none" /></g>
          <Cuerda d={`M${anc.x} ${anc.y} L${guia.x} ${guia.y} L${ap.x} ${ap.y}`} />
          <Cuerda d={`M${anc.x + 14} ${anc.y} Q${(anc.x + arnes.x) / 2 + floja * 70} ${(anc.y + arnes.y) / 2 + floja * 260} ${arnes.x} ${arnes.y}`} />
          <ellipse cx={pila.x} cy={pila.y + 8} rx={74} ry={14} fill="#000" opacity={0.3} />
          {Array.from({ length: 7 }).map((_, i) => { const cx = pila.x + (random(`cz${i}`) - 0.5) * 44, cy = pila.y - i * 5, rx = 58 - i * 3 + random(`cw${i}`) * 8, ry = 15 + random(`ch${i}`) * 4; return <g key={i} transform={`rotate(${(random(`cr${i}`) - 0.5) * 16} ${cx} ${cy})`}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.cuerdaS} strokeWidth={13} /><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.cuerda} strokeWidth={9} /></g>; })}
          <Escalador x={eh.x} y={eh.y} quien="simon" angulos={{ torso: -5, cabeza: f < 14 ? -30 : 2, brazoA: brazo(-5, freno.x - eh.x, freno.y - eh.y, 1), brazoB: brazo(-5, guia.x - eh.x, guia.y - eh.y, -1), piernaA: [12, 0], piernaB: [-10, 0] }} cara={f >= f1 ? "alivio" : "normal"} aspecto={ELLA} pies="#8FB05A" mira={1} sombra={SUELO_P + 6} />
          <Cuerda d={`M${ap.x} ${ap.y} L${freno.x} ${freno.y} C${freno.x + 26} ${freno.y + 60} ${pila.x - 40} ${pila.y - 80} ${pila.x - 8} ${pila.y - 14}`} w={9} />
          <rect x={ap.x - 12} y={ap.y - 10} width={22} height={26} rx={6} fill="#B8C0C8" stroke={T} strokeWidth={4} />
          <circle cx={freno.x} cy={freno.y} r={13} fill={ELLA.piel} stroke={T} strokeWidth={4} /><circle cx={guia.x} cy={guia.y} r={12} fill={ELLA.piel} stroke={T} strokeWidth={4} />
          <Escalador x={hip.x} y={hip.y} quien="joe" angulos={a} cara={f < 13 ? "dolor" : f >= f1 ? "alivio" : agarra > 0.5 ? "esfuerzo" : "dolor"} aspecto={TU_ROCA} pies={sinA && sinB ? G.piel : G.gato} bolsa="#D9614A" mira={mira as 1 | -1} sombra={sienta > 0.5 ? undefined : SUELO_P + 6} />
          {sinA && !(sinA && sinB) && descalzo(pA)}{sinA && sinB && <>{descalzo(pA)}{descalzo(pB)}</>}
          {sinA && [0, 1, 2].map((i) => { const tt = ((f - f1) / 26 + i * 0.33) % 1; return <circle key={i} cx={pA.u.x - 6 + Math.sin(tt * 6 + i) * 10} cy={pA.u.y - 20 - tt * 90} r={10 + tt * 16} fill="#E8EEF4" opacity={0.35 * (1 - tt)} />; })}
          {sinA && <Vuela de={{ x: pA.u.x, y: pA.u.y }} a={{ x: 250, y: SUELO_P + 52 }} t={t1} alto={130} giro={-320} />}
          {sinB && <Vuela de={{ x: pB.u.x, y: pB.u.y }} a={{ x: 120, y: SUELO_P + 84 }} t={t2} alto={110} giro={-250} />}
        </g>
        {/* primer plano que enmarca: rocas y pino a contraluz */}
        <path d="M-60 1920 L-60 1560 Q40 1500 150 1560 Q260 1600 300 1740 L330 1920 Z" fill="#0A121C" /><path d="M-40 1570 Q40 1512 146 1566" stroke="#5A6C8A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d="M1140 1920 L1140 1620 Q1040 1560 930 1640 Q840 1700 800 1920 Z" fill="#0A121C" /><path d="M1130 1626 Q1040 1570 936 1644" stroke="#5A6C8A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${330 + i * 62} 1920 l-8 -${70 + (i % 3) * 30} l14 ${60 + (i % 2) * 20} l8 -${80 + (i % 4) * 16} l6 90`} stroke="#0A121C" strokeWidth={9} fill="none" strokeLinejoin="round" />)}
      </Svg>
      {!v2 && <Rotulo texto="180 €" desde={fC} top={236} tam={170} />}
      {!v2 && <Pildora x={540} y={452} texto="MÁNDASELO AL DE LOS GATOS PEQUEÑOS" color="#fff" desde={f1 + 14} tam={40} />}
    </AbsoluteFill>
  );
};
