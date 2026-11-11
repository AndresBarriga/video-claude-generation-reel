// s4: «no lo convences pensando» (pensamientos que rebotan; el MIEDO no baja) · «cayendo»: se suelta, cae al aire y la cuerda le frena blando.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Svg, clamp, golpe, type P, Fondo, Cueva, CuerdaSL, Tu, Asegura, Medidor, ARRIBA, ANG_AGARRE, posCaida, cam } from "./comun";
import { fuenteTitulo } from "../../tema";

const PENS = [{ t: "ES SEGURO", dx: -230, dy: -330 }, { t: "LA CUERDA AGUANTA", dx: 120, dy: -420 }, { t: "TRANQUILO…", dx: 200, dy: -250 }];

export const Cae: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fC = Math.min(d - 24, pal("cayendo") ?? 80), DUR = 26;
  const t = interpolate(f, [fC, fC + DUR], [0, 1], clamp);
  const cayendo = f >= fC;
  const p = cayendo ? posCaida(t) : { x: ARRIBA.x, y: ARRIBA.y, floja: 0, ang: ANG_AGARRE };
  const fFreno = fC + Math.round(DUR * 0.55);
  const sh = golpe(f, fFreno, 12);
  const cx = cayendo ? p.x + 40 : ARRIBA.x + 40, cy = cayendo ? interpolate(f, [fC, fFreno + 6], [700, 1200], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 700;
  const z = cayendo ? interpolate(f, [fC, fFreno + 6], [1.45, 1.05], { ...clamp, easing: Easing.out(Easing.cubic) }) : interpolate(f, [0, fC], [1.35, 1.5], clamp);
  const dyA = f >= fFreno ? -24 * Math.exp(-(f - fFreno) / 8) : 0;
  const miedo = interpolate(f, [fFreno, fFreno + 12], [0.95, 0.8], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh)}px)` }}>
      <Svg>
        <Fondo cx={cx} cy={cy} z={z} />
        <g transform={cam(cx, cy, z)}>
          <Cueva />
          <CuerdaSL arnes={p} floja={p.floja} tension={f >= fFreno ? 1 : 0} dy={dyA} />
          <Asegura dy={dyA} cara={f >= fFreno ? "esfuerzo" : "normal"} />
          <Tu x={p.x} y={p.y} ang={p.ang} cara={cayendo ? (f >= fFreno + 8 ? "alivio" : "miedo") : "miedo"} tiembla={cayendo ? 0 : Math.sin(f * 1.9) * 3} />
        </g>
      </Svg>
      {!cayendo && PENS.map((pn, i) => {
        const a = spring({ frame: f - 4 - i * 12, fps, config: { damping: 11, stiffness: 180 } });
        const fuera = interpolate(f, [fC - 14, fC - 4], [1, 0], clamp);
        if (a <= 0.01) return null;
        return <div key={i} style={{ position: "absolute", left: 540 + pn.dx, top: 900 + pn.dy, transform: `translate(-50%,-50%) scale(${a})`, opacity: fuera, fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 46, color: "#081120", background: "#E8EEF4", border: "5px solid #081120", borderRadius: 36, padding: "10px 24px", whiteSpace: "nowrap" }}>{pn.t}</div>;
      })}
      <Medidor v={miedo + (cayendo ? 0 : 0.01 * Math.sin(f / 2))} o={interpolate(f, [0, 8], [0, 1], clamp)} />
    </AbsoluteFill>
  );
};
