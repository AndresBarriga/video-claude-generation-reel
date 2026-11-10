// «No empezó desde abajo». Escena animada a escala real (1 m = 24 px), sin esquema:
// A) camina por la repisa de la arista hasta el pie del muro final y empieza a escalar (cámara cerca).
// B) «Si caía allí…»: un escalador fantasma (rojo, translúcido) en el tramo bajo resbala, el extractor empieza a salir y
//    choca contra la repisa de abajo (sobresale ~15 m; fuente UKC) a los ~2 s, antes de abrir. «SIN TIEMPO».
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ESC, AZUL, PIES, Valle, ParedEiger, Roca, CALIZA, Etiqueta, Svg, clamp, golpe, sPersona, type P } from "./comun";

const PM = 24, SP = sPersona(PM), CARA = 640, REP = 900, BAJA = REP + 60 * PM; // repisa de entrada · repisa de abajo (60 m más abajo)
const SOBRESALE = 15 * PM;

export const Repisa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fB = pal("si") ?? Math.round(d * 0.5); // empieza la caída fantasma
  const fade = interpolate(f, [0, 16], [1, 0], clamp);
  // A) camina y empieza a escalar
  const andar = interpolate(f, [8, fB - 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const sube = interpolate(f, [fB - 30, fB], [0, 1], clamp);
  const hx = interpolate(andar, [0, 1], [CARA - 16 * PM, CARA - 0.5 * PM]), hy = REP - 0.78 * PM - sube * 1.2 * PM;
  const paso = Math.sin(f / 5) * 22 * (1 - sube);
  // B) caída fantasma desde 20 m por encima de la repisa de abajo
  const tb = Math.max(0, (f - fB - 6) / fps), caidaM = Math.min(20, 0.5 * 9.8 * tb * tb), choque = caidaM >= 20;
  const fC = fB + 6 + Math.round(Math.sqrt(40 / 9.8) * fps);
  const gx = CARA - 0.5 * PM - Math.min(1, tb * 1.5) * 1.2 * PM, gy = BAJA - 20 * PM - 0.8 * PM + caidaM * PM;
  const pc = interpolate(tb, [1.3, 2.0], [0, 1.6], clamp) * PM;
  // cámara: A cerca del escalador; B se abre y baja con el fantasma; tras el choque vuelve arriba al de verdad
  const enB = interpolate(f, [fB - 4, fB + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const vuelve = interpolate(f, [fC + 12, fC + 36], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = interpolate(enB, [0, 1], [5.5, 2.6]) + vuelve * 1.0;
  const cx = interpolate(enB, [0, 1], [hx - 20, CARA - 140]) * (1 - vuelve) + vuelve * (hx - 60);
  const cy = interpolate(enB, [0, 1], [hy - 6, Math.min(BAJA - 60, gy - 40)]) * (1 - vuelve) + vuelve * (hy + 120);
  const sh = golpe(f, fC, 20), flash = interpolate(f, [fC, fC + 2, fC + 8], [0, 0.85, 0], clamp);
  return (
    <>
      <Svg>
        <Valle f={f} id="re" y0={1100} />
        <g transform={`translate(${540 + sh} 960) scale(${z}) translate(${-cx} ${-cy})`}>
          <ParedEiger x={CARA} pm={PM} id="rep" y0={-1200} y1={BAJA + 3000} />
          {/* repisa de entrada (viene de la arista, a la izquierda) */}
          <Roca id="reL" h="tarde" pm={PM} tono="#A9ADAF" d={`M-1400 ${REP - 300} L-300 ${REP - 20} L${CARA + 4} ${REP} L${CARA + 4} ${REP + 1.2 * PM} L${CARA - 8 * PM} ${REP + 3 * PM} L-200 ${REP + 700} L-1400 ${REP + 1800} Z`} />
          <path d={`M-900 ${REP} L${CARA} ${REP}`} stroke="#E3E6E8" strokeWidth={3} />
          {/* repisa de abajo que sobresale ~15 m */}
          <Roca id="reB" h="tarde" pm={PM} tono="#A9ADAF" d={`M${CARA + 4} ${BAJA} L${CARA - SOBRESALE} ${BAJA + 0.4 * PM} L${CARA - SOBRESALE + PM} ${BAJA + 3 * PM} L${CARA + 4} ${BAJA + 4 * PM} Z`} />
          <path d={`M${CARA} ${BAJA} L${CARA - SOBRESALE} ${BAJA + 0.4 * PM}`} stroke={choque ? "#E5432E" : "#E3E6E8"} strokeWidth={choque ? 6 : 3} />
          {/* fantasma */}
          {f >= fB && <g opacity={0.7}>
            {pc > 0 && <><path d={`M${gx} ${gy - 1.2 * PM} L${gx - 0.3 * PM} ${gy - 1.2 * PM - pc}`} stroke="#fff" strokeWidth={2} /><circle cx={gx - 0.3 * PM} cy={gy - 1.2 * PM - pc} r={0.25 * PM + pc * 0.12} fill="#F2C230" /></>}
            <Escalador x={gx} y={Math.min(gy, BAJA - 0.6 * PM)} quien="joe" s={SP} cara="miedo" aspecto={{ ...ESC, chaqueta: "#E5432E", chaquetaSombra: "#A83018", pantalon: "#C93E22" }} mochila="#E5432E" pies={PIES}
              pose={tb === 0 ? "escalando" : choque ? "tumbado" : "cayendo"} rot={choque ? 0 : tb * 70} />
            {choque && <path d={`M${gx - 40} ${BAJA - 50} l80 60 M${gx + 40} ${BAJA - 50} l-80 60`} stroke="#fff" strokeWidth={9} />}
          </g>}
          {/* el de verdad */}
          <Escalador x={hx} y={hy} quien="joe" s={SP} cara={sube > 0 ? "esfuerzo" : "normal"} aspecto={ESC} mochila={AZUL} pies={PIES}
            pose={sube > 0.3 ? "escalando" : "pie"} angulos={sube > 0.3 ? undefined : { piernaA: [paso, 0], piernaB: [-paso, 0], cabeza: -16 * andar }} />
        </g>
        <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={flash} />
      </Svg>
      {f < fB && f > 10 && <Etiqueta texto="POR LA REPISA" desde={12} top={300} tam={100} />}
      {f >= fC && <Etiqueta texto="SIN TIEMPO" desde={fC} top={300} tam={120} />}
      {fade > 0 && <AbsoluteFill style={{ opacity: fade }}><Img src={staticFile("fotos/E55/eiger-video.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "68% 40%", transform: `scale(${1.2 + (1 - fade) * 0.1})` }} /></AbsoluteFill>}
    </>
  );
};
