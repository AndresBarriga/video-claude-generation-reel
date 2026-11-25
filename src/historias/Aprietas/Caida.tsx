// E82 · «Y a mitad de vía, se te abren los dedos»: en la lupa los dedos se abren; Joe cae a la cuerda (kit: caída dinámica).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, Lupa, Barra, REPARTO } from "../../piezas/kit";
import { Gym, VIA, JOE, caer, COL, cl, type P , EtqAntebrazo } from "./comun";
import { ManoRegleta, cadera, HA, HB, CAM } from "./Gancho";
import { colgar } from "./comun";

export const Caida: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fA = (pal("abren") ?? Math.round(d * 0.5)) - 2, k = f - fA - 4;
  const p0 = cadera(0), a0 = colgar(p0, HA, HB), s = caer(k, p0, 2, 0.35);
  const cam0 = CAM(0), t = interpolate(k, [0, 22], [0, 1], { ...cl, easing: (x) => 1 - (1 - x) ** 3 });
  const cx = cam0.cx + (s.p.x + 160 - cam0.cx) * t, cy = cam0.cy + (s.p.y + 120 - cam0.cy) * t, z = cam0.z + (1.15 - cam0.z) * t;
  const abre = interpolate(f, [fA - 6, fA + 2], [1, 0.05], cl);
  return (
    <>
      <Gym cx={cx} cy={cy} z={z} sh={s.sh}>
        <Asegurador via={VIA} aspecto={REPARTO.ase} {...s.aseg} alza={1} />
        <Soga pts={s.pts} />
        <Persona p={k <= 0 ? p0 : s.p} ang={k <= 0 ? a0 : s.ang} aspecto={JOE} cara={k <= 0 ? "miedo" : s.cara} rot={k <= 0 ? 0 : s.rot} tiembla={k <= 0 ? Math.sin(f * 2.4) * 4 : 0} />
      </Gym>
      {k < 6 && <Lupa x={790} y={1320} r={230} k={1 - Math.max(0, k) / 6} fondo="#FFFDF8"><ManoRegleta cierra={abre} ap={1} f={f} /></Lupa>}
      <EtqAntebrazo /><Barra valor={1} x={140} y={790} alto={420} k={1} color={COL.rojo} />
    </>
  );
};
