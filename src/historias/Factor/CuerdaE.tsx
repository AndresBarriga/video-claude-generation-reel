// s2: «no es lo que caes» (2 M / 10 M tachados) · «es la cuerda» (las cuerdas se iluminan) · «Tú, un metro» · «Él, veinte».
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pildora, Dato, clamp, type P } from "./comun";
import { Dos } from "./Dos";

export const CuerdaE: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fCaes = pal("caes") ?? 40, fCu = pal("cuerda") ?? 66, fUn = pal("un") ?? 140, fVe = pal("veinte") ?? 177;
  const sp = (f0: number) => spring({ frame: f - f0, fps, config: { damping: 13, stiffness: 190 } });
  const brillo = interpolate(f, [fCu, fCu + 10], [0, 1], clamp);
  const io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const zR = interpolate(f, [fCu, fCu + 30], [0.62, 0.42], io), cyR = interpolate(f, [fCu, fCu + 30], [1500, 1650], io);
  const tacha = interpolate(f, [fCaes + 14, fCaes + 22], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      <Dos f={f} fL={0} fR={0} resetL resetR camL={{ cx: 410, cy: 1150, z: interpolate(f, [0, fCu + 20], [0.75, 1.25], io) }} camR={{ cx: 620, cy: cyR, z: zR }} brilloL={brillo} brilloR={brillo} />
      <Pildora x={270} texto="TÚ" /><Pildora x={810} texto="TU COMPAÑERO" />
      {f >= fCaes && f < fUn - 6 && <>
        <Dato x={270} y={470} texto="2 M" s={sp(fCaes)} /><Dato x={810} y={470} texto="10 M" s={sp(fCaes + 3)} />
        <div style={{ position: "absolute", top: 466, left: 160, width: 760 * tacha, height: 14, background: "#E2533F", borderRadius: 8, border: "4px solid #050B14" }} />
      </>}
      {f >= fUn && <Dato x={270} y={470} texto="1 M" color="#FFB27F" s={sp(fUn)} />}
      {f >= fUn && <Dato x={270} y={560} texto="DE CUERDA" tam={44} color="#FFB27F" s={sp(fUn + 3)} />}
      {f >= fVe && <Dato x={810} y={470} texto="20 M" color="#FFB27F" s={sp(fVe)} />}
      {f >= fVe && <Dato x={810} y={560} texto="DE CUERDA" tam={44} color="#FFB27F" s={sp(fVe + 3)} />}
    </AbsoluteFill>
  );
};
