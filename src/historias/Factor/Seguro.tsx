// s5: «al salir de una reunión, el primer seguro importa tanto»: a pantalla completa, en la vía larga, chapas el primer seguro nada más salir.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Panel, Larga, AseguraL, CuerdaL, Esc, Dato, ik, clamp, type P, xW, REU, TU_L, AG } from "./comun";

export const Seguro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fC = pal("primer") ?? 50;
  const hip = { x: xW(960) - 74, y: 960 }, chapa = { x: xW(1010) + 4, y: 1010 }, mos = { x: chapa.x - 6, y: chapa.y + 54 };
  const reach = interpolate(f, [fC - 14, fC], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sh: [number, number] = [Math.sin(((180 - AG.torso) * Math.PI) / 180) * 88, Math.cos(((180 - AG.torso) * Math.PI) / 180) * 88];
  const brazo = ik(sh, mos.x - 20 - hip.x, mos.y - 10 - hip.y, 1);
  const ang = { ...AG, brazoA: [AG.brazoA[0] + (brazo[0] - AG.brazoA[0]) * reach, AG.brazoA[1] + (brazo[1] - AG.brazoA[1]) * reach] as [number, number] };
  const chapada = f >= fC;
  const z = interpolate(f, [0, d], [1.25, 1.45], clamp);
  const s = spring({ frame: f - fC, fps, config: { damping: 11, stiffness: 200 } });
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      <Panel lado={0} ancho={1080} cx={REU.x - 40} cy={1080} z={z}>
        <Larga f={f} />
        <circle cx={chapa.x} cy={chapa.y} r={11} fill="#B8C0C8" stroke="#141B26" strokeWidth={4} />
        <path d={`M${chapa.x} ${chapa.y + 6} L${mos.x} ${mos.y - 8}`} stroke="#3D7FD0" strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={mos.x} cy={mos.y} rx={9} ry={15} fill="none" stroke="#C9D1D8" strokeWidth={5} />
        <CuerdaL arnes={hip} seguro={chapada ? mos : undefined} />
        <AseguraL al={chapada ? mos : hip} />
        <Esc p={{ x: hip.x, y: hip.y, ang }} a={TU_L} cara={chapada ? "alivio" : "esfuerzo"} />
        {chapada && <circle cx={chapa.x} cy={chapa.y + 30} r={95} fill="none" stroke="#F2C230" strokeWidth={9} opacity={Math.min(1, s)} />}
      </Panel>
      {chapada && <Dato x={540} y={470} texto="PRIMER SEGURO" tam={90} s={s} />}
    </AbsoluteFill>
  );
};
