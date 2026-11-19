// Promesa («Tres errores al chapar que lo provocan»): plano general de la caída de la v1c, pero la cinta se queda en la chapa y lo que se
// sale es la CUERDA; le para la chapa de abajo. Barra CAÍDA 0 → 6,3 m con la marca de 2,7 m (donde le habría parado). Empieza ya cayendo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Plano, Persona, Asegurador, Soga, porChapas, aparato, saltoAseg, Destello, Expres, nudo } from "../../piezas/kit";
import { estadoGancho } from "../Cinta/Gancho";
import { Svg, clamp, golpe, type P, VIA, TU, ASE, TOP, B6, P0, XASE } from "./comun";

const Medidor: React.FC<{ m: number; k: number }> = ({ m, k }) => {
  if (k <= 0) return null;
  const X = 965, Y0 = 1320, H = 620, yM = (v: number) => Y0 - (v / 7) * H, y27 = yM(2.7), t = (s: string, y: number, z = 34) => <text x={X} y={y} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={900} fontSize={z} fill="#fff" stroke="#081120" strokeWidth={8} paintOrder="stroke">{s}</text>;
  return (
    <Svg><g opacity={k}>
      <rect x={X - 26} y={Y0 - H} width={52} height={H} rx={26} fill="rgba(5,11,20,.55)" stroke="#fff" strokeWidth={5} />
      <rect x={X - 18} y={yM(m)} width={36} height={Math.max(0, Y0 - yM(m) - 8)} rx={18} fill={m > 2.7 ? "#E2533F" : "#FFC24B"} />
      <path d={`M${X - 44} ${y27} H${X + 44}`} stroke="#3FA76A" strokeWidth={8} strokeLinecap="round" />
      <text x={X - 54} y={y27 + 12} textAnchor="end" fontFamily="Bricolage Grotesque" fontWeight={900} fontSize={34} fill="#8FE0AE" stroke="#081120" strokeWidth={8} paintOrder="stroke">2,7 m</text>
      {t("CAÍDA", Y0 - H - 24)}{t(`${m.toFixed(1).replace(".", ",")} m`, Y0 + 62, 46)}{t("EN ESTA VÍA", Y0 + 104, 26)}
    </g></Svg>
  );
};
export const Caida: React.FC<P> = ({ d }) => {
  const f0 = useCurrentFrame(), A = estadoGancho(0), ini = A.fPop - 30, f = ini + Math.round(f0 * ((A.fCatch + 24 - ini) / Math.max(1, d - 10)));
  const e = estadoGancho(f), { c, pop } = e, p = { x: c.x, y: c.y }, suelta = pop >= 0;
  const z = interpolate(f, [ini, e.fPop, e.fPop + 16, e.fCatch + 6], [1.3, 1.45, 0.75, 0.62], clamp);
  const cy = interpolate(f, [ini, e.fPop, e.fCatch + 6], [B6.y + 200, B6.y + 150, P0.y + 900], clamp);
  const dy = c.j >= 0 ? saltoAseg(c.est, c.j, 0.5) : 0, ap = aparato(VIA, XASE, dy);
  const pts = suelta ? porChapas(VIA, ap, TOP, p, { comba: 20, floja: c.j >= 0 ? 0 : 30 }) : [...porChapas(VIA, ap, TOP, p).slice(0, -1), { x: B6.x + 20, y: B6.y - 26 }, { ...nudo(p), sag: 0 }];
  const m = 6.3 * Math.max(0, Math.min(1, (f - (ini - 40)) / Math.max(1, e.fCatch - (ini - 40))));
  return (
    <>
      <Plano via={VIA} cx={540} cy={cy} z={z} decorado="roca" cintas={false} sh={golpe(f, e.fPop, 12) + golpe(f, Math.round(e.fCatch), 16)}>
        {VIA.chapas.map((y, i) => <Expres key={i} x={VIA.xF(y)} y={y} color="#D4533F" />)}
        <Asegurador via={VIA} x={XASE} aspecto={ASE} cuerda={false} dy={dy} alza={1} cara="miedo" comba={0.1} />
        <Soga pts={pts} />
        <Persona p={p} ang={c.ang} aspecto={TU} cara={c.j > 10 ? "dolor" : "miedo"} />
        <Destello x={B6.x + 6} y={B6.y + 30} k={pop} r={80} />
      </Plano>
      <Medidor m={m} k={1} />
    </>
  );
};
