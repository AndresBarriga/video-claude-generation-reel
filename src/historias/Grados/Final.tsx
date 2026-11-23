// E77 · plan para tus primeros días en roca (2–3 escalones por debajo · lee la vía: el magnesio · repite vías) y cierre: el 5+ ya no te hace sudar + CTA.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, Asegurador, Foco, POSE, accEscalar, porChapas, aparato, Guardar, HojaEnviar } from "../../piezas/kit";
import { RocaP, VIA, LOLA, LEO, XA, cl, COL, Grande, Linea, GradoG, type P } from "./comun";

export const Plan: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), f1 = pal("debajo") ?? 90, fL = pal("lee") ?? 140, fM = pal("magnesio") ?? 180, fR = pal("repite") ?? 260;
  const sube = f < fR ? interpolate(f, [0, fR], [0, 0.45], cl) : ((f - fR) / 40) % 1;
  const y0 = VIA.pie - 40, a = accEscalar(VIA, y0, y0 - 420, sube, 5), mira = f >= fL && f < fR;
  const z = 1.15, cy = Math.min(a.p.y - 40, 2280);
  return (
    <>
      <RocaP cx={a.p.x + 260} cy={cy} z={z}>
        <Asegurador via={VIA} x={XA} aspecto={LEO} />
        <Soga pts={porChapas(VIA, aparato(VIA, XA, 0), 1, a.p)} />
        <Persona p={a.p} ang={mira ? POSE.agarreMira : a.ang} aspecto={LOLA} cara={f >= fR ? "alivio" : "normal"} />
        {f >= fM && f < fR && VIA.presas.filter((y) => y < a.p.y - 80 && y > a.p.y - 380).slice(0, 3).map((y, i) => <Foco key={i} x={VIA.xF(y) + 12} y={y} r={40} k={(f - fM - i * 6) / 8} />)}
      </RocaP>
      <Grande t="TUS PRIMEROS DÍAS EN ROCA" top={510} k={f + 8} tam={62} />
      <Linea t="2–3 ESCALONES MENOS" ok top={1400} k={f - f1 + 6} />
      <Linea t="LEE LA VÍA: EL MAGNESIO" ok top={1530} k={f - fL} />
      <Linea t="REPITE VÍAS ⟳" ok top={1660} k={f - fR} />
    </>
  );
};
export const Cta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fS = pal("sudar") ?? 40, fG = pal("guardalo") ?? 70, fM = pal("mandaselo") ?? 110, fQ = pal("cuantos") ?? d - 50;
  const a = accEscalar(VIA, VIA.mos(3).y + 160, VIA.mos(3).y - 80, (f / 60) % 1, 4), hoja = interpolate(f, [fM, fQ], [0.02, 1], cl);
  return (
    <>
      <RocaP cx={a.p.x + 40} cy={VIA.mos(3).y + 40} z={1.4}>
        <Soga pts={porChapas(VIA, aparato(VIA, XA, 0), 3, a.p)} />
        <Persona p={a.p} ang={a.ang} aspecto={LOLA} cara="alivio" />
      </RocaP>
      {f < fG && <><GradoG t="5+" x={540} y={1260} k={f + 10} color={COL.verde} /><Grande t="✓ SIN SUDAR" top={1420} k={f - fS + 4} tam={70} fondo={COL.verde} color="#fff" /></>}
      {f >= fG && f < fM && <Guardar k={(f - fG) / 20} y={1150} />}
      <HojaEnviar k={f >= fM ? hoja : 0} para="Al que en el roco es de 7.º 😅" />
      {f >= fQ && <Grande t="¿CUÁNTOS BAJAS TÚ?" top={780} k={f - fQ} tam={80} fondo={COL.amarillo} />}
    </>
  );
};

