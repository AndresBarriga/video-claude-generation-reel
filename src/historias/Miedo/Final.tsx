// E72 · roca (más expuesto, la cabeza juega malas pasadas, grados por debajo), «la cabeza también se entrena… cayendo» y CTA del «¡pilla!».
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Plano, Persona, Asegurador, Soga, POSE, porChapas, aparato, Bocadillo, Guardar, HojaEnviar } from "../../piezas/kit";
import { Gym, VIA, LOLA, LEO, XA, cl, pop, COL, F, Svg, type P } from "./comun";
import { Ficha, Grande } from "./Ui";
import { Cae } from "./Inicio";

export const Roca: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fE = pal("expuesto") ?? 20, fCab = pal("cabeza") ?? 60, fN = pal("escalas") ?? 120;
  const z = interpolate(f, [0, fE, fE + 30], [1.3, 1.2, 0.62], cl), p = VIA.cadera(VIA.mos(4).y - 30);
  const cy = interpolate(z, [0.62, 1.3], [1500, p.y + 60]);
  return (
    <>
      <Plano via={VIA} cx={p.x + 160} cy={cy} z={z} decorado="roca">
        <Asegurador via={VIA} x={XA} aspecto={LEO} />
        <Soga pts={porChapas(VIA, aparato(VIA, XA, 0), 4, p)} />
        <Persona p={p} ang={POSE.agarreMira} aspecto={LOLA} cara="miedo" tiembla={Math.sin(f * 2.4) * 3} />
      </Plano>
      <Svg>
        {[0, 1, 2].map((i) => { const k = pop(f - fCab - i * 6), y = 760 + i * 170 + Math.sin(f / 6 + i) * 10; return k > 0 && <g key={i} transform={`translate(${620 + (i % 2) * 140} ${y}) scale(${k})`}><circle r={52} fill="#fff" stroke={COL.tinta} strokeWidth={8} /><text y={26} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={76} fill={COL.rojo}>?</text></g>; })}
      </Svg>
      {f >= fN - 4 && <>
        <Grande t="ROCÓDROMO  6c" top={1300} k={f - fN + 4} tam={76} fondo={COL.crema} />
        <Grande t="ROCA  6a ↓" top={1440} k={f - fN - 4} tam={76} fondo={COL.rojo} color="#fff" />
      </>}
    </>
  );
};
export const Entrena: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fD = pal("dedos") ?? 10, fC = pal("cabeza") ?? 50, fY = pal("cayendo") ?? 100;
  const ya = f >= fY - 8;
  return (
    <>
      {ya ? <Cae k={f - fY + 8} cara="alivio" /> : <Cae k={130} claro={0.55} cara="alivio" />}
      {!ya && <><Ficha icono="dedos" texto="DEDOS" x={300} y={880} k={f - fD} ok s={1.05} /><Ficha icono="cabeza" texto="CABEZA" x={700} y={880} k={f - fC} ok s={1.05} /></>}
      {ya && <Grande t={"SE ENTRENA\nCAYENDO"} top={1330} k={f - fY + 8} tam={110} fondo={COL.verde} color="#fff" />}
    </>
  );
};
export const Cta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fG = pal("guardalo") ?? 40, fM = pal("mandaselo") ?? 60, fP = pal("pilla") ?? 90, fJ = pal("finde") ?? d - 50;
  const p = VIA.cadera(VIA.mos(2).y + 30), hoja = interpolate(f, [fM, fJ + 10], [0.02, 1], cl);
  return (
    <>
      <Gym cx={p.x + 120} cy={p.y + 200} z={1.35}>
        <Asegurador via={VIA} x={XA} aspecto={LEO} />
        <Soga pts={porChapas(VIA, aparato(VIA, XA, 0), 3, p)} />
        <Persona p={p} ang={POSE.agarreMira} aspecto={LOLA} cara={f >= fP ? "esfuerzo" : "normal"} />
      </Gym>
      {f < fG && <Grande t={"¿Y A TI, TE PARA\nLA CABEZA?"} top={1280} k={f + 12} tam={92} />}
      {f >= fG && f < fM && <Guardar k={(f - fG) / 20} y={1150} />}
      {f >= fP - 6 && <Bocadillo x={560} y={620} texto="¡PILLA!" s={pop(f - fP + 6) * (1 + 0.05 * Math.sin(f / 2))} />}
      <HojaEnviar k={f >= fM ? hoja : 0} para="Al que grita «¡pilla!» 😅" />
      {f >= fJ && <Grande t="ESTE FINDE: ¡A CAER!" top={820} k={f - fJ} tam={76} fondo={COL.amarillo} />}
    </>
  );
};
