// s4 (rehook): regla de metros, MISMA escala para los dos. Izquierda: reunión = 0; caes de +1 a −1 con 1 m de cuerda.
// Derecha: última chapa = 0; cae de +5 a −5 con 20 m de cuerda. «Tú: dos» → 2 ÷ 1 = 2 · «Él: medio» → 10 ÷ 20 = 0,5 · «lo peor» → escala 0–2.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Etiqueta, Dato, clamp, type P, C, PC, TU_L, TU_CUEVA, CAE, CUELGA } from "./comun";
import { fuenteTitulo, fuenteTexto } from "../../tema";

const M = 82, Y0 = 920;
const txt = (x: number, y: number, t: string, tam: number, fill: string, anchor: "start" | "end" | "middle" = "middle") => <text x={x} y={y} textAnchor={anchor} fontFamily={fuenteTitulo} fontWeight={800} fontSize={tam} fill={fill} stroke="#050B14" strokeWidth={tam / 5} paintOrder="stroke">{t}</text>;

const Columna: React.FC<{ x: number; cae: number; cuerda: string; cero: string; prog: number; a: typeof TU_L }> = ({ x, cae, cuerda, cero, prog, a }) => {
  const arriba = Y0 - (cae / 2) * M, abajo = Y0 + (cae / 2) * M, yP = arriba + (abajo - arriba) * prog;
  const bx = x + 80;
  return (
    <g>
      {Array.from({ length: cae + 1 }).map((_, i) => <path key={i} d={`M${x - 150} ${arriba + i * M} L${x - 120} ${arriba + i * M}`} stroke="#8FB4D6" strokeWidth={4} />)}
      <path d={`M${x - 230} ${Y0} L${x + 230} ${Y0}`} stroke="#8FB4D6" strokeWidth={4} strokeDasharray="16 12" />
      <text x={x + 230} y={Y0 + 40} textAnchor="end" fontFamily={fuenteTexto} fontWeight={700} fontSize={30} fill="#8FB4D6">{cero}</text>
      <circle cx={bx} cy={Y0} r={14} fill="#B8C0C8" stroke="#141B26" strokeWidth={5} />
      <path d={`M${bx} ${Y0} Q${bx - 10} ${(Y0 + yP) / 2 + (prog < 1 ? 30 : 0)} ${x + 20} ${yP - 30}`} stroke={C.cuerda} strokeWidth={9} fill="none" />
      <Escalador x={x + 10} y={yP} quien="joe" angulos={prog < 1 ? CAE : CUELGA} cara={prog < 1 ? "miedo" : "dolor"} aspecto={a} mira={1} s={0.55} />
      <path d={`M${x - 135} ${arriba} L${x - 135} ${abajo - 26}`} stroke="#E8EEF4" strokeWidth={10} strokeDasharray="22 14" opacity={prog > 0 ? 1 : 0.3} />
      <path d={`M${x - 157} ${abajo - 32} L${x - 135} ${abajo} L${x - 113} ${abajo - 32} Z`} fill="#E8EEF4" />
      {txt(x - 112, (arriba + abajo) / 2 - 20, `${cae} M`, 50, "#E8EEF4", "start")}
      {txt(bx + 20, Y0 - 34, cuerda, 40, C.cuerda, "start")}
    </g>
  );
};

export const Regla: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fT = pal("tu") ?? 62, fM = pal("medio") ?? 110, fP = pal("peor") ?? 140;
  const caer = interpolate(f, [10, 34], [0, 1], { ...clamp, easing: (t) => t * t });
  const sp = (f0: number) => spring({ frame: f - f0, fps, config: { damping: 12, stiffness: 200 } });
  const g = interpolate(f, [fP - 4, fP + 10], [0, 1], clamp), pulso = f > fP + 10 ? 1 + 0.08 * Math.sin((f - fP) / 3) : 1;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0B1A2C,#13283F)" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M0 ${Y0 + (i - 13) * M} L1080 ${Y0 + (i - 13) * M}`} stroke="#1A3048" strokeWidth={2} />)}
        <rect x={536} y={440} width={8} height={920} fill="#050B14" />
        <Columna x={270} cae={2} cuerda="1 M" cero="REUNIÓN" prog={caer} a={TU_L} />
        <Columna x={810} cae={10} cuerda="20 M" cero="ÚLTIMA CHAPA" prog={caer} a={TU_CUEVA} />
      </svg>
      <Etiqueta texto="FACTOR DE CAÍDA" desde={0} top={226} tam={80} />
      {f >= fT && <Dato x={270} y={390} texto="2 ÷ 1 = 2" color={PC.miedo} tam={72} s={sp(fT)} />}
      {f >= fM && <Dato x={810} y={390} texto="10 ÷ 20 = 0,5" color="#9FD6B0" tam={64} s={sp(fM)} />}
      {g > 0 && (
        <div style={{ position: "absolute", top: 1356, left: 110, right: 110, height: 80, opacity: g }}>
          <div style={{ position: "absolute", top: 34, left: 0, right: 0, height: 24, borderRadius: 14, background: "linear-gradient(90deg,#9FD6B0,#F2C230,#E2533F)", border: "5px solid #050B14" }} />
          {[["0", 0], ["1", 0.5], ["2", 1]].map(([t, p]) => <div key={t as string} style={{ position: "absolute", top: -4, left: `${(p as number) * 100}%`, transform: "translateX(-50%)", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 30, color: "#CFE3F2" }}>{t}</div>)}
          <div style={{ position: "absolute", top: 20, left: "25%", width: 30, height: 52, marginLeft: -15, borderRadius: 10, background: "#9FD6B0", border: "5px solid #050B14" }} />
          <div style={{ position: "absolute", top: 12, left: "100%", width: 40, height: 66, marginLeft: -20, borderRadius: 12, background: PC.miedo, border: "5px solid #050B14", transform: `scale(${pulso})` }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
