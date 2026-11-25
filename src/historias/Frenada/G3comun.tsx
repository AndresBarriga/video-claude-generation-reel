// E81 «Dar cuerda rápido con el grigri» (Caer y asegurar 3/3). Piezas comunes. Hilo visual: el MISMO puesto de Dani
// (grigri de lado dibujado sobre la foto de Andrés, plantilla E62) con la MANO DE FRENO SIEMPRE EN LA CUERDA, y la chapa de Irene arriba.
// Rocódromo CLARO (fondo y muro de E72): nada de fondo oscuro en el arranque (formato §7).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Plano, crearVia, PERFILES, aparato, Asegurador, Lupa } from "../../piezas/kit";
import { grigriSVG, PULGAR, DEDOS, type ModoG } from "../Freno/grigri";
import { FondoClaro, MuroClaro } from "../Miedo/comun";
import { Svg, COL, F, pop, DANI } from "./comun";
export { IRENE, DANI, COL, F, pop, cl, c01, Grande, golpe, type P } from "./comun";

export const VS = crearVia({ perfil: PERFILES.panel, metros: [2.2, 3.6, 5, 6.4, 7.8, 9.2] });
/** Irene va a chapar la 3.ª chapa (i = 2); Dani asegura en x = XA. */
export const XA = 250, I = 2, P0 = VS.cadera(VS.mos(I).y + 150);
export const VERDE = "#2FB36B", ROJO = "#E5483B", NAR = "#C2603A";
export const Gym: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = (p) => (
  <Plano via={VS} cx={p.cx} cy={p.cy} z={p.z} sh={p.sh} cintas={false} fondo={<FondoClaro />} mundo={<MuroClaro via={VS} />}>{p.children}</Plano>
);

/* ---- primer plano del puesto (estilo lámina de manual: fondo claro) ---- */
const FS = 0.55, FX = 232, FY = 274;
const enP = (x: number, y: number) => ({ x: FX + x * FS, y: FY + y * FS });
/** Pantalla: dónde aprieta el pulgar (leva), dónde va el índice (bajo el borde) y la mano de freno. */
export const TAB = enP(PULGAR.x, PULGAR.y), PEST = enP(DEDOS.x, DEDOS.y), FRENO = { x: enP(1004, 0).x, y: 1500 };
const T = "#050B14", PIEL = "#E3B48E", PIELS = "#B9875F", MANGA = "#3CC9B0", MANGAS = "#279483";
/** Puño (mano por la palma, dedos cruzando la cuerda), copia del de E62 con la manga de Dani. */
const Puno: React.FC<{ x: number; y: number; lado?: 1 | -1; bx: number; by: number }> = ({ x, y, lado = 1, bx, by }) => (
  <g>
    <path d={`M${x + lado * 70} ${y} L${bx} ${by}`} stroke={T} strokeWidth={150} strokeLinecap="round" /><path d={`M${x + lado * 70} ${y} L${bx} ${by}`} stroke={MANGA} strokeWidth={134} strokeLinecap="round" />
    <path d={`M${x + lado * 80} ${y + 46} L${bx} ${by}`} stroke={MANGAS} strokeWidth={34} strokeLinecap="round" opacity={0.5} />
    <rect x={lado > 0 ? x + 6 : x - 112} y={y - 100} width={106} height={200} rx={48} fill={PIEL} stroke={T} strokeWidth={12} />
    {[-66, -22, 22, 66].map((d, i) => <g key={i}><path d={`M${x - lado * 44} ${y + d} L${x + lado * 52} ${y + d}`} stroke={T} strokeWidth={54} strokeLinecap="round" /><path d={`M${x - lado * 44} ${y + d} L${x + lado * 52} ${y + d}`} stroke={PIEL} strokeWidth={40} strokeLinecap="round" /><path d={`M${x - lado * 4} ${y + d - 12} v24`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" /></g>)}
  </g>
);
/** Rótulo con flecha a un punto (≥1,5 s en pantalla cuando señala un paso). */
export const Senal: React.FC<{ t: string; x: number; y: number; tx: number; ty: number; o: number; col: string; w?: number }> = ({ t, x, y, tx, ty, o, col, w = 300 }) => o <= 0 ? null : (
  <Svg><g opacity={Math.min(1, o)} transform={`translate(${x} ${y}) scale(${pop(o * 12)}) translate(${-x} ${-y})`}>
    <path d={`M${x} ${y} L${tx} ${ty}`} stroke={T} strokeWidth={14} strokeLinecap="round" /><path d={`M${x} ${y} L${tx} ${ty}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
    <circle cx={tx} cy={ty} r={14} fill="#fff" stroke={T} strokeWidth={5} />
    <rect x={x - w / 2} y={y - 46} width={w} height={92} rx={28} fill={col} stroke={T} strokeWidth={6} />
    <text x={x} y={y + 19} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={54} fill="#fff">{t}</text>
  </g></Svg>
);
/** Puesto de Dani de lado. `modo` "mal" = agarra el aparato entero (pero la mano de freno SIGUE en la cuerda, abajo);
 *  "rapido" = índice bajo el borde y pulgar en la leva (la mano de freno rodea la cuerda); "normal" = sin tocar la leva. */
export const PuestoG: React.FC<{ modo: ModoG; pisa?: number; corre?: number; leva?: string; brillo?: number; hiDedos?: boolean; hiPulgar?: boolean; da?: number; otra?: boolean }> = ({ modo, pisa = 0, corre = 0, leva, brillo = 0, hiDedos = false, hiPulgar = false, da = 0, otra = true }) => {
  const svg = grigriSVG({ modo, pisa, dedosHi: hiDedos, pulgarHi: hiPulgar, corre, cuelga: 0, brillo, leva }).split("#8E7CC3").join(MANGA); // manga de Dani
  const cuerdaBaja = "M1004 1300 L1012 2700";
  return (
    <g>
      {modo === "rapido" && <g transform={`translate(${FX} ${FY}) scale(${FS})`}>
        {brillo > 0 && <path d={cuerdaBaja} stroke="#FFD24A" strokeWidth={240} strokeLinecap="round" opacity={0.5 * brillo} />}
        <path d={cuerdaBaja} stroke={T} strokeWidth={159} strokeLinecap="round" /><path d={cuerdaBaja} stroke="#F07A2E" strokeWidth={135} strokeLinecap="round" />
        <path d={cuerdaBaja} stroke="#FFD0A8" strokeWidth={13} strokeDasharray="52 58" strokeDashoffset={-corre} opacity={0.85} />
      </g>}
      <g transform={`translate(${FX} ${FY}) scale(${FS})`} dangerouslySetInnerHTML={{ __html: svg }} />
      {modo !== "rapido" && <Puno x={FRENO.x} y={FRENO.y - 120 * da} bx={1110} by={1880 - 120 * da} />}
      {otra && modo !== "mal" && <Puno x={enP(498, 0).x - 4} y={190 - 80 * (modo === "rapido" ? pisa : da)} lado={-1} bx={-80} by={10 - 80 * (modo === "rapido" ? pisa : da)} />}
    </g>
  );
};
/** Fondo claro de lámina de manual. `mal` lo tiñe de rojo suave. */
export const PP: React.FC<{ sh?: number; mal?: number; children: React.ReactNode }> = ({ sh = 0, mal = 0, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FFFFFF 0%, ${mal > 0.5 ? "#F6D9D2" : "#DCE7F2"} 80%)`, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}>
    <Svg>{children}</Svg>
  </AbsoluteFill>
);
/** Recuadro de contexto: Dani de cuerpo entero, con la mano de freno marcada. `feed` 0–1 = da cuerda. */
export const Contexto: React.FC<{ feed?: number; k?: number; x?: number; y?: number }> = ({ feed = 0, k = 1, x: lx = 880, y: ly = 640 }) => {
  const via = VS, ap = aparato(via, 0);
  return (
    <Lupa x={lx} y={ly} r={150} fondo="#EAF1F8" k={k}>
      <g transform={`scale(1.35) translate(-40 ${-via.pie + 40})`}>
        <path d={`M-400 ${via.suelo} H600 V${via.suelo + 400} H-400 Z`} fill="#2F6FD6" />
        <Asegurador via={via} x={0} hacia={{ x: 190, y: via.pie - 330 }} aspecto={DANI} alza={1} feed={feed} comba={0.1 + 0.2 * feed} />
        <circle cx={ap.x + 10} cy={ap.y + 30} r={30} fill="none" stroke={VERDE} strokeWidth={8} strokeDasharray="12 8" />
      </g>
    </Lupa>
  );
};
/** Contador 1/3 → 3/3 con nombre del paso (dentro del 3:4, sobre los 350 px de abajo). */
export const Contador3: React.FC<{ n: number; k: number }> = ({ n, k }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 1440, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: COL.crema, border: `7px solid ${COL.tinta}`, borderRadius: 40, padding: "8px 26px" }}>
        {[1, 2, 3].map((i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 17, border: `5px solid ${COL.tinta}`, background: i < n ? COL.verde : i === n ? COL.amarillo : "#fff" }} />)}
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: COL.tinta, marginLeft: 8, whiteSpace: "nowrap" }}>{n}/3 · {["FRENO EN LA CUERDA", "PULGAR SOLO AL DAR", "PULGAR FUERA"][n - 1]}</div>
      </div>
    </div>
  );
};
/** Píldora ✗/✓ grande sobre la acción. */
export const Marca: React.FC<{ t: string; ok: boolean; top: number; k: number; tam?: number }> = ({ t, ok, top, k, tam = 64 }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: tam, color: "#fff", background: ok ? COL.verde : ROJO, border: `8px solid ${COL.tinta}`, borderRadius: 34, padding: "4px 32px 10px", whiteSpace: "nowrap", boxShadow: "0 12px 0 rgba(20,33,58,.25)" }}>{ok ? "✓ " : "✗ "}{t}</div>
    </div>
  );
};
