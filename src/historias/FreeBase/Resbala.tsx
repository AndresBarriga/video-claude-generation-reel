// Gancho (s1): se le escapa la mano en la cara norte, el cuerpo sale despedido de la pared y la imagen se CONGELA con el
// cronómetro a 0,0 s: «¿LE DA TIEMPO?». Con `lupa`: el mismo congelado, la cámara se acerca a la espalda y una lupa abre
// el contenedor (vela plegada + extractor). 1 m = 235 px.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { manoA } from "../Ferrata/comun";
import { ESC, AZUL, PIES, Abismo, ParedEiger, Etiqueta, Svg, clamp, golpe, sPersona, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

const PM = 235, SP = sPersona(PM), BORDE = 640;
const AGARRE = { torso: 8, cabeza: -24, brazoA: [162, 176] as [number, number], brazoB: [128, 156] as [number, number], piernaA: [62, -8] as [number, number], piernaB: [18, -14] as [number, number] };
const SUELTA = { torso: -26, cabeza: 26, brazoA: [118, 150] as [number, number], brazoB: [70, 40] as [number, number], piernaA: [40, -16] as [number, number], piernaB: [-24, -30] as [number, number] };
const mezcla = (t: number) => Object.fromEntries(Object.entries(AGARRE).map(([k, v]) => [k, Array.isArray(v) ? (v as number[]).map((x, i) => x + ((SUELTA as any)[k][i] - x) * t) : (v as number) + ((SUELTA as any)[k] - v) * t])) as typeof AGARRE;

const Lupa: React.FC<{ x: number; y: number; o: number; f: number }> = ({ x, y, o, f }) => {
  const R = 175, W = 116, Hh = 148, t = (s: string, yy: number) => <text x={x} y={yy} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={50} fill="#fff" stroke="#0B1624" strokeWidth={10} paintOrder="stroke">{s}</text>;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * o}) translate(${-x} ${-y})`}>
      <circle cx={x} cy={y} r={R} fill="#16263C" stroke="#fff" strokeWidth={10} />
      <rect x={x - W / 2} y={y - Hh / 2} width={W} height={Hh} rx={28} fill={AZUL} opacity={0.35} stroke="#9CC0FF" strokeWidth={5} />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={x - W / 2 + 14} y={y - Hh / 2 + 14 + i * 17} width={W - 28} height={12} rx={5} fill={i % 2 ? "#C93E22" : "#E04A2A"} />)}
      <rect x={x - 38} y={y + Hh / 2 - 34} width={76} height={34} rx={12} fill="#163A78" /><circle cx={x} cy={y + Hh / 2 - 17} r={20} fill="#F2C230" />
      {t("VELA PLEGADA", y - R - 26)}{t("EXTRACTOR", y + R + 62)}
      <path d={`M${x + 60} ${y + Hh / 2 - 17} l70 0`} stroke="#fff" strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(f / 5)} />
    </g>
  );
};

export const Resbala: React.FC<P & { lupa?: boolean }> = ({ d, pal, lupa }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  // Tiempo bala: tras soltarse, la caída sigue a 1/10 de velocidad (sin congelar). tl = segundos reales de caída.
  const fS = lupa ? -99 : Math.max(4, (pal("escapa") ?? 8) - 2), fC = lupa ? -99 : fS + 12;
  const LENTO = 0.1, T0 = lupa ? 0.2 : 0; // la escena de la lupa sigue donde acabó el gancho (~4,5 s × 0,1)
  const tl = T0 + Math.max(0, (f - (lupa ? 0 : fC)) / fps) * LENTO;
  const s = lupa ? 1 : interpolate(f, [fS, fC], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ang = mezcla(s);
  const hip: [number, number] = [BORDE + 70 - s * 0.35 * PM - tl * 1.6 * PM, 1130 + s * 0.15 * PM + 0.5 * 9.8 * tl * tl * PM];
  const rot = -s * 16 - tl * 40;
  const mano = manoA(BORDE + 70, 1130, SP, AGARRE.torso, AGARRE.brazoA);
  const espalda = ((): [number, number] => { const a = ((ang.torso + rot) * Math.PI) / 180, vx = -34 * SP, vy = -66 * SP; return [hip[0] + vx * Math.cos(a) - vy * Math.sin(a), hip[1] + vx * Math.sin(a) + vy * Math.cos(a)]; })();
  const lenta = f >= fC || !!lupa;
  const fL = pal("escalar") ?? 4, oL = lupa ? interpolate(f, [fL - 6, fL + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) }) : 0;
  const fF = pal("free") ?? d - 30;
  const z = lupa ? 1.5 + f / d * 0.15 : interpolate(f, [0, fC, d], [1.9, 1.55, 1.75], clamp);
  const foco = lupa ? [espalda[0] - 160, espalda[1] - 40] : [interpolate(s, [0, 1], [mano[0] - 40, hip[0]]), interpolate(s, [0, 1], [mano[1] + 120, hip[1] - 160])];
  const sh = golpe(f, fS + 2, 18), giro = lenta ? Math.sin(f / 40) * 2 - (lupa ? 4 : f / d * 4) : 0;
  return (
    <>
      <Svg>
        <g transform={`translate(0 ${-s * 30 - tl * 60})`}><Abismo f={fC + f * LENTO} id="rs" hz={410} /></g>
        <g transform={`translate(${540 + sh} 900) rotate(${giro}) scale(${z}) translate(${-foco[0]} ${-foco[1]})`}>
          <ParedEiger x={BORDE} pm={PM} id="rsp" y1={2600} />
          {(f >= fS || lupa) && Array.from({ length: 14 }).map((_, i) => { const a = lupa ? 1 : Math.min(1, (f - fS) / 14) * 0.35 + tl * 1.5, ang2 = random(`mg${i}`) * Math.PI * 2;
            return <circle key={i} cx={mano[0] + Math.cos(ang2) * a * 90} cy={mano[1] + Math.sin(ang2) * a * 60 + a * 40} r={6 + random(`mr${i}`) * 8} fill="#F4F6F8" opacity={Math.max(0, 0.8 - a * 0.5)} />; })}
          <Escalador x={hip[0]} y={hip[1]} rot={rot} quien="joe" s={SP} cara={s > 0.3 ? "miedo" : "esfuerzo"} aspecto={ESC} mochila={AZUL} pies={PIES} angulos={ang} />
          {lupa && <Lupa x={espalda[0] - 300} y={espalda[1] - 120} o={oL} f={f} />}
          {lupa && oL > 0 && <path d={`M${espalda[0] - 40} ${espalda[1] - 100} L${espalda[0] - 180} ${espalda[1] - 200}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" opacity={oL} />}
        </g>
        {lenta && <rect x={0} y={0} width={1080} height={1920} fill="#14233A" opacity={0.16} />}
      </Svg>
      {!lenta && !lupa && <Etiqueta texto="¿Y SI SE TE ESCAPA?" desde={0} top={300} tam={100} />}
      {lenta && <Etiqueta texto={lupa && f >= fF ? "FREE BASE" : "¿TE DA TIEMPO?"} desde={lupa ? (f >= fF ? fF : 0) : fC} top={300} tam={110} />}
      {lenta && !(lupa && oL > 0.2) && <Etiqueta texto={`${tl.toFixed(1).replace(".", ",")} s`} desde={lupa ? 0 : fC + 4} top={440} tam={86} />}
    </>
  );
};
