// s5: cuelga al aire bajo el desplome («sitio seguro») → quien asegura, atenta («alguien que sepa») → «Una. Y otra.»: dos caídas más; el MIEDO baja.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, clamp, golpe, type P, Fondo, Cueva, CuerdaSL, Tu, Asegura, Medidor, ARRIBA, ASE, COLGADO, ANG_COLGADO, posCaida, cam, PC } from "./comun";
import { fuenteTitulo } from "../../tema";

export const Otra: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSi = pal("sitio") ?? 36, fAl = pal("alguien") ?? 70, fU = pal("una") ?? 130, fO = pal("otra") ?? 146, DUR = 16;
  const io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const caidaN = f >= fO ? 2 : f >= fU ? 1 : 0;
  const t0 = caidaN === 2 ? fO - 4 : fU - 4;
  const p = caidaN ? posCaida(interpolate(f, [t0, t0 + DUR], [0, 1], clamp)) : { x: COLGADO.x + 6 * Math.sin(f / 14), y: COLGADO.y, floja: 0, ang: ANG_COLGADO };
  const fFreno = t0 + Math.round(DUR * 0.55);
  let cx: number, cy: number, z: number;
  if (caidaN) { cx = ARRIBA.x + 60; cy = interpolate(f, [t0, fFreno + 4], [900, 1150], io); z = 1.05; }
  else if (f < fAl) { cx = interpolate(f, [0, fSi + 10], [COLGADO.x + 60, 640], io); cy = interpolate(f, [0, fSi + 10], [1330, 1620], io); z = interpolate(f, [0, fSi + 10], [1.25, 0.62], io); }
  else { cx = interpolate(f, [fAl - 4, fAl + 14], [640, ASE.x - 40], io); cy = interpolate(f, [fAl - 4, fAl + 14], [1620, ASE.y - 220], io); z = interpolate(f, [fAl - 4, fAl + 14], [0.62, 1.4], io); }
  const dyA = caidaN && f >= fFreno ? -20 * Math.exp(-(f - fFreno) / 7) : 0;
  const miedo = caidaN === 0 ? 0.8 : interpolate(f, [fFreno, fFreno + 10], caidaN === 1 ? [0.8, 0.58] : [0.58, 0.36], clamp);
  const sh = caidaN ? golpe(f, fFreno, 9) : 0;
  const oA = interpolate(f, [fAl, fAl + 8], [0, 1], clamp) * (caidaN ? 0 : 1);
  const oS = interpolate(f, [fSi, fSi + 8], [0, 1], clamp) * (f < fAl ? 1 : 0);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh)}px)` }}>
      <Svg>
        <Fondo cx={cx} cy={cy} z={z} />
        <g transform={cam(cx, cy, z)}>
          <Cueva />
          <CuerdaSL arnes={p} floja={p.floja} tension={1} dy={dyA} />
          <Asegura dy={dyA} cara={oA > 0 ? "alivio" : "normal"} />
          <Tu x={p.x} y={p.y} ang={p.ang} cara={caidaN ? "esfuerzo" : "alivio"} />
          {oA > 0 && <circle cx={ASE.x} cy={ASE.y - 60} r={190} fill="none" stroke="#F2C230" strokeWidth={10} opacity={oA} />}
          {oS > 0 && <g opacity={oS}>
            <path d={`M${COLGADO.x - 260} ${COLGADO.y + 260} L${COLGADO.x - 260} ${COLGADO.y - 500}`} stroke="#CFE3F2" strokeWidth={8} strokeDasharray="26 20" />
            <text x={COLGADO.x - 260} y={COLGADO.y + 360} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={92} fill="#CFE3F2" stroke="#050B14" strokeWidth={18} paintOrder="stroke">AL AIRE</text>
          </g>}
        </g>
      </Svg>
      <Medidor v={miedo} />
      {caidaN > 0 && <div style={{ position: "absolute", top: 352, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 66, color: PC.cabeza, WebkitTextStroke: "9px #050B14", paintOrder: "stroke fill" }}>CAÍDA {caidaN + 1}</div>}
    </AbsoluteFill>
  );
};
