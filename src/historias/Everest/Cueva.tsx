// 5–6 · Corte en espejo: la misma arista, de noche; en la cueva de roca, otro hombre sentado igual. Sigue vivo (vaho).
// En «frontales», pasan escaladores: uno sin mirar, otro lo enfoca y sigue, otro se agacha a intentar ayudarle y se va. El vaho se apaga.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Etiqueta, Nieve, SHARP, Svg, Zoom, sube, type P } from "./comun";
import { Arista } from "./Arista";
import { CABEZA, CADERA, Hueco, Sentado, Vaho } from "./Piezas";

const suelo = (x: number) => CADERA.y - 0.16 * (x - CADERA.x);
const ROPA = [{ chaqueta: "#2F6FB0", chaquetaSombra: "#1F4E80" }, { chaqueta: "#3B8F5A", chaquetaSombra: "#28653F" }, { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F" }, { chaqueta: "#E6C030", chaquetaSombra: "#A88A1C" }];
export const EscenaSharp: React.FC<{ f: number; alza: number; vivo: number; oscuro?: number; children?: React.ReactNode }> = ({ f, alza, vivo, oscuro = 0, children }) => (
  <>
    <Zoom s={1.0} cx={CADERA.x + 20} cy={CADERA.y - 120} tx={540} ty={1000}>
      <Arista luz={0} f={f} cueva />
      {children}
      <Sentado aspecto={SHARP} cabeza={34 - 24 * alza} cara={alza > 0.5 ? "normal" : "cerrados"} />
      <Vaho f={f} x={CABEZA.x - 30} y={CABEZA.y + 30} on={vivo} />
      <Nieve f={f} n={40} op={0.6} />
    </Zoom>
    <Hueco x={430} y={880} r={1000 - 640 * oscuro} id={`sh${Math.round(oscuro * 10)}`} base={0.7 + 0.3 * oscuro} />
  </>
);

export const Cueva: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tV = (pal("vivo") ?? Math.round(d * 0.8)) - 4;
  return (
    <Camara d={d} empuje={0.06} entrada={false}>
      <Svg><EscenaSharp f={f} alza={sube(f, tV, tV + 12)} vivo={f >= tV ? 1 : 0.4} /></Svg>
      <Etiqueta texto={f < tV ? "11 DÍAS ANTES" : "SEGUÍA VIVO"} top={230} tam={110} desde={f < tV ? 2 : tV} />
    </Camara>
  );
};

/** Un escalador que pasa por la arista de derecha a izquierda entre t0 y t1; se detiene (para) o se agacha (ayuda). */
const Pasa: React.FC<{ f: number; t0: number; t1: number; i: number; para?: [number, number]; ayuda?: [number, number] }> = ({ f, t0, t1, i, para, ayuda }) => {
  if (f < t0 || f > t1) return null;
  const xs = interpolate(f, para ?? ayuda ? [t0, (para ?? ayuda)![0], (para ?? ayuda)![1], t1] : [t0, t1], para ?? ayuda ? [1250, CADERA.x + 280, CADERA.x + 280, CADERA.x + 40] : [1250, CADERA.x + 40]);
  const quieto = (para ?? ayuda) && f >= (para ?? ayuda)![0] && f <= (para ?? ayuda)![1];
  const agacha = ayuda && quieto;
  const x = xs, y = suelo(x) - (agacha ? 0 : 60);
  return <Escalador x={x} y={agacha ? y - 60 * 2.1 : y - 130 * 2.1} quien={i % 2 ? "simon" : "joe"} aspecto={{ ...ROPA[i % 4], pantalon: "#1E2633", casco: null, gorro: "#1E2633", manos: "guante" }} s={2.1}
    pose={agacha ? "agachado" : "pie"} cara="serio" frontal mira={-1} angulos={agacha ? { brazoA: [96, 108] } : { cabeza: para && quieto ? 26 : -4, piernaA: [Math.sin(f / 3) * 18, 0], piernaB: [-Math.sin(f / 3) * 18, 0] }} />;
};

export const Frontales: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t1 = (pal("unos") ?? Math.round(d * 0.2)) - 2, t2 = (pal("otros") ?? Math.round(d * 0.4)) - 2, t3 = (pal("algunos") ?? Math.round(d * 0.6)) - 2, t4 = (pal("sin") ?? Math.round(d * 0.85)) - 2;
  const lejos = Array.from({ length: 12 }).map((_, k) => { const x = ((k * 130 + f * 7) % 1600) - 250; const y = CADERA.y - 140 - 0.16 * (x - CADERA.x); return <g key={k}><circle cx={x} cy={y} r={30} fill="#FFF3C4" opacity={0.25} /><circle cx={x} cy={y} r={10} fill="#FFF8DD" /><rect x={x - 9} y={y + 8} width={18} height={60} rx={8} fill="#0B0F17" /></g>; });
  return (
    <Camara d={d} empuje={0.04} entrada={false}>
      <Svg>
        <EscenaSharp f={f} alza={0.3} vivo={1 - sube(f, t4, d)} oscuro={sube(f, t4, d) * 0.6}>
          <g opacity={f < t2 ? 1 : 0.45}>{lejos}</g>
          <Pasa f={f} t0={t1 - 6} t1={t2} i={0} />
          <Pasa f={f} t0={t2 - 6} t1={t3} i={1} para={[t2 + 6, t2 + 22]} />
          <Pasa f={f} t0={t3 - 8} t1={d} i={2} ayuda={[t3 + 4, t4 + 6]} />
        </EscenaSharp>
      </Svg>
      {f < t1 && <Etiqueta texto="PASARON DECENAS" top={230} tam={100} desde={2} />}
    </Camara>
  );
};
