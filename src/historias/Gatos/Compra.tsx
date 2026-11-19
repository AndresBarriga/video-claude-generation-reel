// s0 GANCHO: macro del pie entrando a pisotones en un gato tres números más pequeño. Desde el fotograma 0 hay movimiento:
// cada pisotón baja una talla (43 → 40), los dedos se doblan en garra y, al decir «daño», el nudillo late en rojo. La etiqueta de 180 € se balancea.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, clamp, golpe, lerp, Rotulo, type P } from "./comun";
import { Gato, Pie, garraPara } from "./Gato";
import { Tienda, SUELO_T } from "./Tienda";

export const K = 33, X0 = 118, Y0 = 1236; // px por cm · talón · suela
const G40 = garraPara(25);
/** Estado del pisotón n (0–1 de avance) con anticipación (sube) y golpe (baja). */
export const estado = (f: number, golpes: number[]) => {
  let av = 0.3, alza = 0, ult = -99;
  golpes.forEach((g, i) => {
    const a = interpolate(f, [g - 9, g - 3, g], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
    alza = Math.max(alza, a);
    if (f >= g) { av = 0.3 + (0.7 * (i + 1)) / golpes.length; ult = g; }
    else if (f > g - 3) av = lerp(av, 0.3 + (0.7 * (i + 1)) / golpes.length, (f - (g - 3)) / 3);
  });
  return { av, alza, ult };
};

export const Macro: React.FC<{ f: number; golpes: number[]; fDolor: number }> = ({ f, golpes, fDolor }) => {
  const { av, alza, ult } = estado(f, golpes);
  const g = G40 * interpolate(av, [0.3, 1], [0.12, 1], clamp);
  const menea = (1 - av) * (0.6 + 0.4 * Math.sin(f * 0.31));
  const dx = (1 - av) * -3.4 + Math.sin(f * 0.8) * 0.35 * menea, dy = (1 - av) * -1.2 - alza * 0.9, rot = (1 - av) * 30 + alza * 5 + Math.sin(f * 0.8 + 1) * 3.2 * menea;
  const bote = f >= ult ? Math.exp(-(f - ult) / 3.2) : 0;
  const dolor = interpolate(f, [fDolor - 2, fDolor + 5], [0, 1], clamp), pulso = 0.5 + 0.5 * Math.sin((f - fDolor) * 0.55);
  const colg = Math.sin(f * 0.22) * 5 + bote * 16 * Math.cos((f - ult) * 0.9);
  const sh = golpe(f, ult, 9) + golpe(f, fDolor, 12);
  const z = interpolate(f, [0, 140], [1, 1.1], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh * 0.4}px, ${Math.abs(sh)}px)` }}>
      <Svg>
        <defs><filter id="cp-blur"><feGaussianBlur stdDeviation="7" /></filter></defs>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <g transform="translate(-900 -1190) scale(1.9)" filter="url(#cp-blur)"><Tienda caja={false} /></g>
          <rect x={-200} y={0} width={1500} height={1920} fill="#06101C" opacity={0.2} />
          {/* tarima en primer plano */}
          <rect x={-200} y={Y0 + 20} width={1500} height={800} fill="#4E4038" /><rect x={-200} y={Y0 + 20} width={1500} height={14} fill="#2A2022" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M-200 ${Y0 + 110 + i * 120} H1300`} stroke="#2A2022" strokeWidth={5} opacity={0.6} />)}
          <ellipse cx={540} cy={Y0 + 34} rx={500 + bote * 30} ry={26} fill="#000" opacity={0.35} />
          {bote > 0.15 && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={300 + i * 150 + (i % 2) * 40} cy={Y0 + 26 - (1 - bote) * 46} r={10 * bote + 4} fill="#D9CDBD" opacity={bote * 0.5} />)}
          <g transform={`translate(${X0} ${Y0}) scale(${K})`}>
            <Gato L={25} g={g} aplasta={bote} precio={colg}>
              <g transform={`translate(${dx} ${dy}) rotate(${rot} 25 -1)`}><Pie g={g} dolor={dolor} pulso={pulso} /></g>
            </Gato>
          </g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

export const Compra: React.FC<P> = ({ e, pal }) => {
  const v2 = (e as { v2?: boolean })?.v2;
  const f = useCurrentFrame();
  const golpes = [5, 21, (pal("euros") ?? 38) + 1, (pal("zapatos") ?? 63) + 4], fDolor = (pal("daño") ?? 123) + 2;
  const talla = [43, 42, 42, 41, 40][golpes.filter((g) => f >= g).length];
  return (
    <AbsoluteFill>
      <Macro f={f} golpes={golpes} fDolor={fDolor} />
      <Rotulo texto="180 €" desde={14} top={v2 ? 430 : 236} tam={170} sub={<>TU PIE <b style={{ color: "#fff" }}>43</b> · EL GATO <b style={{ color: talla === 40 ? "#FF6A1F" : "#fff" }}>{talla}</b></>} />
    </AbsoluteFill>
  );
};
