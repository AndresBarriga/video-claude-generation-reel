// Escalera colgada en el cielo (gancho y cierre). Mundo a escala real: 1 m = PM px con zoom 1 (plano general épico).
// Gancho: empieza muy cerca de la cara de Dani mirando al vacío y se abre hasta el plano general (la escalera, 37 m,
// cruza entre dos agujas; Marta espera arriba). Al «resbalas», empuje a la funda del disipador. `final`: ocaso, Dani arriba.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { DANI, MARTA, Etiqueta, Svg, clamp, type P } from "./comun";
import { Cielo, Cordillera, Bosque, Bruma, NubeE, CIELO, type Hora } from "./paisaje";
import { Roca, CableE, MosqE, BrazoE, FundaE, pieMosq, sPersona, M } from "./roca";

const PM = 31, SP = sPersona(PM);
const A: [number, number] = [60, 1310], B: [number, number] = [962, 640];
const ux = (B[0] - A[0]) / Math.hypot(B[0] - A[0], B[1] - A[1]), uy = (B[1] - A[1]) / Math.hypot(B[0] - A[0], B[1] - A[1]);
const enRiel = (m: number): [number, number] => [A[0] + ux * m * PM, A[1] + uy * m * PM]; // m metros desde el inicio
const PASA = 1.0 * PM; // pasamanos 1 m por encima de los peldaños

const Fondo: React.FC<{ h: Hora }> = ({ h }) => (
  <g>
    <Cielo h={h} id={`es${h}`} sol={[230, 1120]} r={60} />
    {[[160, 420, 1.0], [880, 300, 0.7]].map(([x, y, s], i) => <NubeE key={i} x={x} y={y} s={s} h={h} o={0.85} />)}
    <Cordillera id="eA" y={1520} amp={820} color="#6C7BA6" h={h} lejos={0.55} nieve={0.32} picos={3} />
    <Cordillera id="eB" y={1690} amp={430} color="#45637A" h={h} lejos={0.3} nieve={0.22} picos={4} />
    <Bruma y={1600} alto={200} color={CIELO[h].bruma} id={`eb${h}`} o={0.55} />
    <Cordillera id="eC" y={1810} amp={190} color="#3E6B4E" h={h} lejos={0.15} picos={5} />
    <Bosque id="eD" x0={-200} x1={1300} y={1815} t={22} color="#2E5240" n={90} />
    <path d="M-400 1860 Q300 1830 700 1870 T1500 1855 L1500 3000 L-400 3000 Z" fill="#6E9A5A" />
    <path d="M90 1890 Q400 1868 640 1900 Q520 1930 230 1925 Z" fill="#5FC3CC" opacity={0.95} />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={690 + (i % 6) * 13 + (i % 3) * 3} y={1880 + Math.floor(i / 6) * 9} width={7} height={5} fill={i % 4 ? "#F2ECE2" : "#C8573C"} />)}
    <g>{[[-60, 1640, 1.3], [1020, 1600, 1.5]].map(([x, y, s], i) => <NubeE key={i} x={x} y={y} s={s} h={h} o={0.75} />)}</g>
  </g>
);

const Escalera: React.FC<{ z: number }> = ({ z }) => {
  const largo = Math.hypot(B[0] - A[0], B[1] - A[1]) / PM, n = Math.floor(largo / 0.3);
  const lejos = `M${A[0]} ${A[1] - 5} L${B[0]} ${B[1] - 5}`, cerca = `M${A[0]} ${A[1]} L${B[0]} ${B[1]}`;
  const pasa = `M${A[0]} ${A[1] - PASA} L${B[0] + 6} ${B[1] - PASA}`;
  return (
    <g>
      <CableE d={pasa} pm={PM} z={z} />
      <CableE d={lejos} pm={PM * 1.3} z={z} />
      {Array.from({ length: n }).map((_, i) => { const [x, y] = enRiel(0.15 + i * 0.3); return <path key={i} d={`M${x} ${y - 5} L${x + 1.2} ${y}`} stroke="#59636F" strokeWidth={Math.max(0.6, 0.025 * PM)} />; })}
      <CableE d={cerca} pm={PM * 1.3} z={z} />
    </g>
  );
};

export const EscaleraCielo: React.FC<P & { final?: boolean }> = ({ d, pal, final }) => {
  const f = useCurrentFrame(), h: Hora = final ? "ocaso" : "tarde";
  const fR = final ? 9999 : pal("resbalas") ?? Math.round(d * 0.62);
  const abre = interpolate(f, [4, Math.max(30, fR - 10)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const emp = interpolate(f, [fR, fR + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const resb = interpolate(f, [fR - 2, fR + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const pos = final ? 36.2 : 20.5, pie = enRiel(pos), hip: [number, number] = [pie[0] - 2, pie[1] - 21 + resb * 3];
  const giro = 18 + resb * 10, ring: [number, number] = [hip[0] + 4, hip[1] - 3];
  const m1 = enRiel(pos + 0.5), m2 = enRiel(pos + 0.85);
  const c1: [number, number] = [m1[0], m1[1] - PASA], c2: [number, number] = [m2[0], m2[1] - PASA];
  const zF = final ? interpolate(f, [0, d], [4.5, 10], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : interpolate(abre, [0, 1], [9, 1]) * (1 + emp * 1.6);
  const foco: [number, number] = final ? [1005, 530] : [interpolate(abre, [0, 1], [hip[0] + 6, 540]) + emp * (ring[0] - 540), interpolate(abre, [0, 1], [hip[1] - 22, 960]) + emp * (ring[1] - 960)];
  const zB = Math.pow(zF, 0.12), cam = (z: number) => `translate(540 ${final ? 980 : 960}) scale(${z}) translate(${-foco[0]} ${-foco[1]})`;
  return (
    <>
      <Svg>
        <g transform={final ? `translate(540 960) scale(${zB}) translate(-640 -1180)` : cam(zB)}><Fondo h={h} /></g>
        <g transform={cam(zF)}>
          <Roca id="agujaD" h={h} pm={PM} d="M930 628 L948 602 L985 590 L1020 598 L1046 584 L1080 600 L1110 640 L1150 900 L1190 1500 L1260 4200 L860 4200 L880 3000 L850 2200 L905 1500 L880 1050 Z" />
          <Roca id="agujaI" h={h} pm={PM} d="M-500 1330 L-200 1290 L-60 1270 L20 1296 L80 1316 L130 1420 L100 1760 L180 2400 L160 4200 L-500 4200 Z" />
          <Escalera z={zF} />
          {[[A[0], A[1] - PASA], [B[0] + 6, B[1] - PASA], A, B].map(([x, y], i) => <rect key={i} x={x - 3} y={y - 3} width={6} height={6} rx={1.5} fill="#4E5864" />)}
          <Escalador x={final ? 1030 : 1010} y={566} quien="simon" pose={final ? "pie" : "senalando"} mira={-1} s={SP} cara={emp > 0.3 ? "miedo" : "alivio"} aspecto={MARTA} angulos={final ? { brazoB: [-165, -178], cabeza: -6 } : undefined} />
          {!final && <g>
            <BrazoE a={[ring[0], ring[1] + 2]} b={pieMosq(c1[0], c1[1], PM)} pm={PM} tension={resb} />
            <BrazoE a={[ring[0], ring[1] + 2]} b={pieMosq(c2[0], c2[1], PM)} pm={PM} tension={resb} />
            <MosqE x={c1[0]} y={c1[1]} pm={PM} /><MosqE x={c2[0]} y={c2[1]} pm={PM} />
          </g>}
          <Escalador x={final ? 990 : hip[0]} y={final ? 566 : hip[1]} quien="joe" mochila s={SP} cara={final ? "alivio" : "miedo"} aspecto={DANI}
            pose={final ? "pie" : undefined} mira={final ? -1 : 1}
            angulos={final ? { brazoB: [-160, -176], cabeza: -8 } : { torso: giro, cabeza: 34 - resb * 14, brazoA: [96, 104], brazoB: [84, 96], piernaA: [70, -24], piernaB: [-8 - resb * 70, -14 - resb * 40] }} />
          {!final && <FundaE x={ring[0] - 1} y={ring[1]} pm={PM} />}
          {!final && emp > 0 && <circle cx={ring[0] - 1} cy={ring[1] + M.fundaL * PM * 0.5} r={M.fundaL * PM * 0.9} fill="none" stroke="#FFE7A8" strokeWidth={0.35} opacity={emp} />}
        </g>
      </Svg>
      {!final && <Etiqueta texto={f < fR ? "¿TE ATREVES?" : "¿Y SI RESBALAS?"} desde={f < fR ? 15 : fR} top={300} tam={104} />}
    </>
  );
};
