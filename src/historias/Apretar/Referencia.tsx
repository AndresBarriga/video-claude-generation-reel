// 7 · «Para que te hagas una idea… un hombre aprieta unos 51 kilos y una mujer unos 31»: TARJETA de referencia (para captura):
//     Dani y Nora con su dinamómetro; las agujas suben a 51 y 31. Se mantiene ~2 s.
// 8 · «Y a partir de la mediana edad, empieza a bajar»: la tarjeta sube y se encoge; curva por edades que sube, se queda y baja.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { COL, DANI, Dinamometro, F, NORA, Papel, Svg, T, cl, pop, sale, type P } from "./comun";

const BUSTO = { torso: 0, cabeza: 0, brazoA: [8, 4] as [number, number], brazoB: [-8, -4] as [number, number], piernaA: [6, 0] as [number, number], piernaB: [-6, 0] as [number, number] };
/** Tarjeta: arriba la pregunta; dos columnas (Dani ♂ / Nora ♀) con busto, esfera y cifra. `ka`, `kb` = 0–1 subida de cada aguja. */
const Tarjeta: React.FC<{ k: number; ka: number; kb: number; t30: number; f: number }> = ({ k, ka, kb, t30, f }) => {
  const col = (x: number, asp: object, kg: number, kk: number, lado: string, color: string) => (
    <g transform={`translate(${x} 0)`}>
      <clipPath id={`ap-bu${lado}`}><rect x={-190} y={150} width={380} height={330} rx={30} /></clipPath>
      <rect x={-190} y={150} width={380} height={330} rx={30} fill={color} opacity={0.25} />
      <g clipPath={`url(#ap-bu${lado})`}><Escalador x={0} y={760} quien="joe" s={2.6} angulos={BUSTO} aspecto={asp} cara={kk > 0.9 ? "esfuerzo" : "normal"} mira={1} /></g>
      <Dinamometro x={0} y={680} s={0.62} kg={kg * sale(kk)} mango={false} texto={kk > 0 ? undefined : "¿?"} />
      <text x={0} y={950} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={120} fill={T} opacity={kk > 0 ? 1 : 0.25}>{kk > 0 ? <>~{Math.round(kg * sale(kk))}<tspan fontSize={60}> kg</tspan></> : "¿?"}</text>
      <text x={0} y={1010} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={46} fill={color}>{lado === "h" ? "HOMBRES" : "MUJERES"}</text>
    </g>
  );
  return (
    <g transform={`translate(540 0) scale(${pop(k)}) translate(-540 0)`}>
      <rect x={60} y={0} width={960} height={1080} rx={50} fill={COL.crema} stroke={T} strokeWidth={12} />
      <text x={540} y={92} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={60} fill={T}>¿CUÁNTO APRIETA LA GENTE?</text>
      <g opacity={sale((f - t30) / 6)}>
        <rect x={160} y={112} width={760} height={60} rx={30} fill={COL.amarillo} stroke={T} strokeWidth={6} />
        <text x={540} y={155} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={36} fill={T}>EN SU MEJOR MOMENTO · ~30 AÑOS</text>
      </g>
      {col(305, DANI, 51, ka, "h", "#1F8C7A")}
      {col(775, NORA, 31, kb, "m", COL.azul)}
      <text x={540} y={1058} textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={28} fill={COL.gris}>Mediana · dinamómetro de mano · Reino Unido (~50.000 personas)</text>
    </g>
  );
};

export const Referencia: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t30 = (pal("30,") ?? pal("30") ?? Math.round(d * 0.35)) - 2, t51 = (pal("51") ?? Math.round(d * 0.6)) - 3, t31 = (pal("31.") ?? pal("31") ?? Math.round(d * 0.9)) - 3;
  return (
    <Svg>
      <Papel />
      <g transform="translate(0 470)"><Tarjeta k={f + 2} ka={(f - t51) / 10} kb={(f - t31 + 2) / 7} t30={t30} f={f} /></g>
    </Svg>
  );
};

// Curva de agarre por edad (aprox. mediana, Reino Unido): sube hasta los ~30, meseta y baja desde la mediana edad.
const EDADES = [20, 30, 40, 50, 60, 70, 80], HOM = [46, 51, 50, 47, 43, 37, 31], MUJ = [29, 31, 31, 29, 26, 22, 19];
const X = (e: number) => 170 + ((e - 20) / 60) * 640, Y = (kg: number) => 1530 - (kg - 15) * 7.2;
const linea = (v: number[]) => EDADES.map((e, i) => `${i ? "L" : "M"}${X(e)} ${Y(v[i])}`).join(" ");
export const Curva: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tB = (pal("bajar.") ?? pal("bajar") ?? Math.round(d * 0.8)) - 3, tM = (pal("mediana") ?? Math.round(d * 0.35)) - 2;
  const sube = sale(f / 10), dib = interpolate(f, [4, tB + 6], [0, 1], cl);
  const punto = Math.min(80, 20 + 60 * dib), iP = Math.min(5, Math.floor((punto - 20) / 10)), fr = (punto - EDADES[iP]) / 10;
  const kgP = HOM[iP] + (HOM[iP + 1] - HOM[iP]) * fr;
  return (
    <Svg>
      <Papel />
      <g transform={`translate(540 ${interpolate(sube, [0, 1], [470, 460])}) scale(${interpolate(sube, [0, 1], [1, 0.62])}) translate(-540 0)`}><Tarjeta k={20} ka={1} kb={1} t30={-99} f={f} /></g>
      <g opacity={sale((f - 2) / 8)}>
        <rect x={90} y={1160} width={900} height={440} rx={40} fill={COL.crema} stroke={T} strokeWidth={10} />
        <path d={`M${X(20)} 1540 H${X(80) + 20}`} stroke={T} strokeWidth={6} />
        {EDADES.map((e) => <text key={e} x={X(e)} y={1582} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={30} fill={T}>{e}</text>)}
        <text x={540} y={1212} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={36} fill={T}>Y CON LA EDAD…</text>
        <rect x={X(45)} y={1230} width={X(80) - X(45) + 10} height={305} fill={COL.rojo} opacity={0.1 * sale((f - tM) / 8)} />
        {f >= tM && <text x={X(45) + 14} y={1525} fontFamily={F} fontWeight={800} fontSize={30} fill={COL.rojo} opacity={sale((f - tM) / 8)}>MEDIANA EDAD →</text>}
        {[[HOM, "#1F8C7A"], [MUJ, COL.azul]].map(([v, c], i) => <path key={i} d={linea(v as number[])} stroke={c as string} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${dib} 1`} />)}
        {dib > 0.95 && <><text x={X(80) + 24} y={Y(31) + 10} fontFamily={F} fontWeight={800} fontSize={28} fill="#1F8C7A">HOMBRES</text><text x={X(80) + 24} y={Y(19) + 10} fontFamily={F} fontWeight={800} fontSize={28} fill={COL.azul}>MUJERES</text></>}
        <circle cx={X(punto)} cy={Y(kgP)} r={20} fill={COL.naranja} stroke={T} strokeWidth={6} />
        {f >= tB && <path d={`M${X(62)} ${Y(48)} l50 70 m-40 -4 l40 4 l4 -40`} stroke={COL.rojo} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pop(f - tB)} />}
      </g>
    </Svg>
  );
};
