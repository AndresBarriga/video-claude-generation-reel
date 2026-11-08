// Plano de perfil (el de E11): la escaladora en el canto, la chapa debajo y la cuerda pasando por detrás de su pantorrilla.
// v = 0 en la pared; v > 0 cae y se voltea (rot), colgando de la cuerda que le engancha la pierna.
import React from "react";
import { Escalador, type Cara } from "../../piezas/Escalador";
import { Chapa, Cielo, Cuerda, Montanas, Pared, TU, Valle, Zoom, borde, ext, lerp } from "./comun";
import { Tu, POSE_PARED, caderaDe } from "../Pierna/Tu";
import { X0, PY, PX } from "../Pierna/Plano";

const rot2 = (p: [number, number], g: number): [number, number] => { const a = (g * Math.PI) / 180; return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)]; };
export const S3 = 3;
export const H0 = caderaDe(PX, PY, S3);
export const CHY = H0.y + 330, CHX = borde(CHY, X0) + 4;

/** Geometría de la caída: cadera, giro y punto de la pantorrilla donde engancha la cuerda. */
export const caida = (v: number, giro: number, dx = 0) => {
  const hx = H0.x - 70 * v + dx, hy = H0.y + 250 * v;
  const sc = (q: [number, number]) => [q[0] * S3, q[1] * S3] as [number, number];
  const rod = ext(0, 0, POSE_PARED.piernaA[0], 66), tob = ext(rod[0], rod[1], POSE_PARED.piernaA[1], 64);
  const pant = rot2(sc([(rod[0] + tob[0]) / 2 - 12, (rod[1] + tob[1]) / 2]), giro);
  const arnes = rot2(sc([14, -16]), giro);
  return { hx, hy, pant: [hx + pant[0], hy + pant[1]] as [number, number], arnes: [hx + arnes[0], hy + arnes[1]] as [number, number] };
};

export const PlanoPerfil: React.FC<{ f: number; v: number; giro: number; cara: Cara; casco?: boolean; zoom?: { s: number; cx: number; cy: number; tx?: number; ty?: number }; tr?: number; quemadura?: number; dx?: number }> = ({ f, v, giro, cara, casco = true, zoom, tr = 0, quemadura = 0, dx = 0 }) => {
  const g = caida(v, giro, dx);
  const ch: [number, number] = [CHX, CHY + 66 * 1.4];
  const cuerda = `M${ch[0]} ${ch[1]} L${g.pant[0]} ${g.pant[1]} Q${lerp(g.pant[0], g.arnes[0], 0.5) - 20} ${lerp(g.pant[1], g.arnes[1], 0.5)} ${g.arnes[0]} ${g.arnes[1]}`;
  const ang = { ...POSE_PARED, ...(v > 0 ? { brazoA: [lerp(112, 160, Math.min(1, v)), lerp(150, 120, Math.min(1, v))] as [number, number], brazoB: [lerp(160, -140, Math.min(1, v)), lerp(176, -110, Math.min(1, v))] as [number, number], cabeza: lerp(34, -20, Math.min(1, v)) } : { piernaA: [64 - 8 * tr, -6 - 20 * tr] as [number, number] }) };
  const aspecto = casco ? TU : { ...TU, casco: null };
  const escena = (
    <>
      <Pared x0={X0} />
      <Tu px={PX} py={PY} s={S3} x0={X0} soloRoca />
      <Chapa x={CHX} y={CHY} s={1.4} t={v > 0 ? 0 : tr * 10} />
      <Cuerda d={`M${ch[0]} ${ch[1]} Q${ch[0] - 40} ${ch[1] + 400} ${ch[0] - 20} 2400`} w={10} />
      <Escalador x={g.hx} y={g.hy} quien="joe" aspecto={aspecto} s={S3} angulos={ang} cara={cara} rot={giro} />
      {quemadura > 0 && <path d={`M${g.pant[0] - 30} ${g.pant[1] - 18} Q${g.pant[0]} ${g.pant[1] + 4} ${g.pant[0] + 30} ${g.pant[1] - 14}`} stroke="#E0442E" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.85 * quemadura} />}
      <Cuerda d={cuerda} w={10} />
    </>
  );
  return (
    <g>
      <Cielo id="pf" />
      <Montanas y={1240} />
      <Valle y={1640} />
      {zoom ? <Zoom {...zoom}>{escena}</Zoom> : escena}
    </g>
  );
};
