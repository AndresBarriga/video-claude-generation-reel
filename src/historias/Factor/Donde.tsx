// s1: dónde está cada uno. Izquierda: vía larga, recién salido de la reunión, sin seguro. Derecha: deportiva, cinco metros por encima de su última chapa.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pildora, Dato, clamp, type P, REU, L_ARRIBA, ULTIMA } from "./comun";
import { Dos } from "./Dos";

export const Donde: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fEl = pal("el") ?? 127, fSin = pal("sin") ?? 80, fDep = pal("deportiva") ?? 170;
  const io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const zL = interpolate(f, [0, 40], [1.05, 0.62], io), cyL = interpolate(f, [0, 40], [1150, 1350], io);
  const zR = interpolate(f, [fEl - 4, fEl + 30], [1.0, 0.62], io), cyR = interpolate(f, [fEl - 4, fEl + 30], [ULTIMA.y - 300, 1500], io);
  const scrL = (w: { x: number; y: number }) => ({ x: 270 + (w.x - 400) * zL, y: 960 + (w.y - cyL) * zL });
  const r = scrL(REU), c = scrL(L_ARRIBA);
  const sp = (f0: number) => spring({ frame: f - f0, fps, config: { damping: 13, stiffness: 190 } });
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      <Dos f={f} fL={0} fR={0} resetL resetR camL={{ cx: 400, cy: cyL, z: zL }} camR={{ cx: 600, cy: cyR, z: zR }} oscL={interpolate(f, [fEl - 4, fEl + 6], [0, 0.5], clamp)} oscR={interpolate(f, [fEl - 6, fEl + 4], [0.5, 0], clamp)} />
      <Pildora x={270} texto="TÚ" /><Pildora x={810} texto="TU COMPAÑERO" />
      {f >= 20 && f < fEl + 4 && <Dato x={Math.max(150, r.x - 40)} y={r.y + 80} texto="REUNIÓN" tam={52} s={sp(20)} />}
      {f >= fSin && f < fEl + 4 && <Dato x={Math.min(400, c.x + 40)} y={c.y - 120} texto="SIN SEGURO" tam={52} color="#FFB27F" s={sp(fSin)} />}
      {f >= 30 && <Dato x={270} y={470} texto="VÍA LARGA" tam={64} s={sp(30)} />}
      {f >= fDep && <Dato x={810} y={470} texto="DEPORTIVA" tam={64} s={sp(fDep)} />}
      {f >= fEl + 20 && <Dato x={810} y={1240} texto="ÚLTIMA CHAPA" tam={44} color="#CFE3F2" s={sp(fEl + 20)} />}
    </AbsoluteFill>
  );
};
