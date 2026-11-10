// Gancho (s1): se le escapa la mano en la cara norte, el cuerpo sale despedido de la pared y la imagen se CONGELA con el
// cronómetro a 0,0 s: «¿LE DA TIEMPO?». Con `lupa`: el mismo congelado, la cámara se acerca a la espalda y una lupa abre
// el contenedor (vela plegada + extractor). 1 m = 235 px.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { manoA } from "../Ferrata/comun";
import { ESC, AZUL, PIES, Abismo, ParedEiger, Etiqueta, Svg, clamp, golpe, sPersona, type P } from "./comun";
import { fuenteTitulo } from "../../tema";

const PM = 235, SP = sPersona(PM), BORDE = 640;
const AGARRE = { torso: 8, cabeza: -24, brazoA: [162, 176] as [number, number], brazoB: [128, 156] as [number, number], piernaA: [62, -8] as [number, number], piernaB: [18, -14] as [number, number] };
const SUELTA = { torso: -26, cabeza: 26, brazoA: [118, 150] as [number, number], brazoB: [70, 40] as [number, number], piernaA: [40, -16] as [number, number], piernaB: [-24, -30] as [number, number] };
const mezcla = (t: number) => Object.fromEntries(Object.entries(AGARRE).map(([k, v]) => [k, Array.isArray(v) ? (v as number[]).map((x, i) => x + ((SUELTA as any)[k][i] - x) * t) : (v as number) + ((SUELTA as any)[k] - v) * t])) as typeof AGARRE;

const Lupa: React.FC<{ x: number; y: number; o: number; f: number }> = ({ x, y, o, f }) => {
  const R = 230, W = 150, Hh = 190, t = (s: string, yy: number) => <text x={x} y={yy} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={50} fill="#fff" stroke="#0B1624" strokeWidth={10} paintOrder="stroke">{s}</text>;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * o}) translate(${-x} ${-y})`}>
      <circle cx={x} cy={y} r={R} fill="#16263C" stroke="#fff" strokeWidth={10} />
      <rect x={x - W / 2} y={y - Hh / 2} width={W} height={Hh} rx={28} fill={AZUL} opacity={0.35} stroke="#9CC0FF" strokeWidth={5} />
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={x - W / 2 + 16} y={y - Hh / 2 + 16 + i * 20} width={W - 32} height={15} rx={5} fill={i % 2 ? "#C93E22" : "#E04A2A"} />)}
      <rect x={x - 38} y={y + Hh / 2 - 34} width={76} height={34} rx={12} fill="#163A78" /><circle cx={x} cy={y + Hh / 2 - 17} r={20} fill="#F2C230" />
      {t("VELA PLEGADA", y - R - 26)}{t("EXTRACTOR", y + R + 62)}
      <path d={`M${x + 60} ${y + Hh / 2 - 17} l70 0`} stroke="#fff" strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(f / 5)} />
    </g>
  );
};

export const Resbala: React.FC<P & { lupa?: boolean }> = ({ d, pal, lupa }) => {
  const f = useCurrentFrame();
  const fS = lupa ? -99 : 8, fC = lupa ? -99 : 20; // se le escapa la mano · congelado
  const s = lupa ? 1 : interpolate(f, [fS, fC], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ang = mezcla(s), hip: [number, number] = [BORDE + 70 - s * 0.35 * PM, 1130 + s * 0.15 * PM], rot = -s * 16;
  const mano = manoA(BORDE + 70, 1130, SP, AGARRE.torso, AGARRE.brazoA), espalda = ((): [number, number] => { const a = ((ang.torso + rot) * Math.PI) / 180, vx = -34 * SP, vy = -66 * SP; return [hip[0] + vx * Math.cos(a) - vy * Math.sin(a), hip[1] + vx * Math.sin(a) + vy * Math.cos(a)]; })();
  const congel = f >= fC;
  const fL = pal("paracaidas") ?? Math.round(d * 0.45), oL = lupa ? interpolate(f, [fL - 12, fL + 2], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) }) : 0;
  const z = lupa ? interpolate(f, [0, 20], [1.15, 1.45], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : interpolate(f, [0, fC], [1.9, 1.5], clamp);
  const foco = lupa ? [espalda[0] - 140, espalda[1] - 60] : [interpolate(s, [0, 1], [mano[0] - 40, hip[0]]), interpolate(s, [0, 1], [mano[1] + 120, hip[1] - 180])];
  const sh = golpe(f, fS + 2, 18);
  return (
    <>
      <Svg>
        <g transform={`translate(0 ${-s * 30})`}><Abismo f={congel || lupa ? fC : f} id="rs" hz={410} /></g>
        <g transform={`translate(${540 + sh} 900) scale(${z}) translate(${-foco[0]} ${-foco[1]})`}>
          <ParedEiger x={BORDE} pm={PM} id="rsp" y1={2600} />
          {!lupa && f >= fS && Array.from({ length: 14 }).map((_, i) => { const a = Math.min(1, (f - fS) / 14), ang2 = random(`mg${i}`) * Math.PI * 2;
            return <circle key={i} cx={mano[0] + Math.cos(ang2) * a * 70} cy={mano[1] + Math.sin(ang2) * a * 50 + a * 30} r={6 + random(`mr${i}`) * 8} fill="#F4F6F8" opacity={(1 - a) * 0.8} />; })}
          <Escalador x={hip[0]} y={hip[1]} rot={rot} quien="joe" s={SP} cara={s > 0.3 ? "miedo" : "esfuerzo"} aspecto={ESC} mochila={AZUL} pies={PIES} angulos={ang} />
          {lupa && <Lupa x={espalda[0] - 300} y={espalda[1] - 120} o={oL} f={f} />}
          {lupa && oL > 0 && <path d={`M${espalda[0] - 40} ${espalda[1] - 100} L${espalda[0] - 180} ${espalda[1] - 200}`} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" opacity={oL} />}
        </g>
        {(congel || lupa) && <rect x={0} y={0} width={1080} height={1920} fill="#14233A" opacity={0.3} />}
      </Svg>
      {(congel || lupa) && <Etiqueta texto={lupa && f >= (pal("free") ?? d - 30) ? "FREE BASE" : "¿LE DA TIEMPO?"} desde={lupa ? (f >= (pal("free") ?? d - 30) ? (pal("free") ?? d - 30) : 0) : fC} top={300} tam={110} />}
      {congel && !lupa && <Etiqueta texto="0,0 s" desde={lupa ? 0 : fC + 4} top={440} tam={86} />}
    </>
  );
};
