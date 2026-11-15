// s6: quien asegura está lejos y con comba → se pega a la pared (CERCA) → recoge (CORTO) → mira arriba → cuando ella chapa
// a la cintura, da cuerda rápido (¡CUERDA!). Mano de freno siempre en la cuerda.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, type P, ALTO, CINT, B1, B2, AG, LEJOS, CERCA, nudo, mano, hipX, pCint, suave, type Angulos } from "./comun";
import { Plano, Soga, Aseg, Ella, Chapa1, type Pt } from "./piezas";

export const Asegura: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const fCer = pal("cerca") ?? 53, fCor = pal("corto") ?? 109, fPen = pal("pendiente") ?? 131, fDan = pal("dando") ?? 158, fCh = Math.min(d - 10, (pal("chapas") ?? 200) + 2);
  const anda = interpolate(f, [fCer - 4, fCer + 26], [0, 1], io), x = LEJOS + (CERCA - LEJOS) * anda;
  const recoge = interpolate(f, [fCor - 2, fCor + 14], [0, 1], io), da = f >= fDan && f < fCh + 6 ? Math.abs(Math.sin((f - fDan) * 0.42)) : 0;
  const t = interpolate(f, [fPen - 6, fDan - 2], [0, 1], io), ch = interpolate(f, [fDan + 4, fCh], [0, 1], io), paso = Math.sin(t * Math.PI);
  const y = ALTO.y + (CINT.y - ALTO.y) * t, p = { x: hipX(y), y };
  const trepa: Angulos = { ...AG, cabeza: -30 + 24 * t, brazoA: [160 - 16 * paso, 178 - 50 * paso], brazoB: [146 + 20 * paso, 168 + 8 * paso], piernaA: [86 + 16 * paso, 30 + 14 * paso], piernaB: [64 - 20 * paso, 10] };
  const ang = f < fDan + 4 ? trepa : pCint(ch), n = nudo(p), h = mano(ang), H = { x: p.x + h.x, y: p.y + h.y };
  const pts: Pt[] = f < fDan + 4 ? [B1, n] : f < fCh ? [B1, H, { ...n, sag: 10 + 12 * ch, sx: -8 }] : [B1, B2, { ...n, sag: 10, sx: -6 }];
  const abre = interpolate(f, [fPen - 8, fPen + 14], [0, 1], io);
  const cx = x + 100 + (680 - x - 100) * abre, cy = 2390 + (2200 - 2390) * abre, z = 1.5 - 0.45 * abre;
  const flash = interpolate(f, [fCh, fCh + 4, fCh + 14], [0, 1, 0], clamp);
  const rot = f >= fDan ? { k: "c", t: "¡CUERDA!", d: fDan } : f >= fCor ? { k: "b", t: "CORTO", d: fCor } : f >= fCer ? { k: "a", t: "CERCA", d: fCer } : null;
  return (
    <>
      <Plano cx={cx} cy={cy} z={z}>
        <Aseg x={x} paso={anda > 0 && anda < 1 ? anda * Math.PI * 4 : 0} comba={0.9 - 0.82 * recoge + 0.1 * da} feed={Math.max(da, Math.sin(recoge * Math.PI) * 0.8)} alza={suave((f - fPen + 4) / 8)} cara={f >= fPen - 4 ? "serio" : "normal"} />
        <Ella p={p} ang={ang} cara={f >= fCh ? "alivio" : "normal"} />
        <Chapa1 /><Soga pts={pts} />
        {flash > 0 && <circle cx={B2.x} cy={B2.y - 6} r={30 + 26 * flash} fill="none" stroke="#fff" strokeWidth={6} opacity={flash} />}
      </Plano>
      {rot && <Etiqueta key={rot.k} texto={rot.t} desde={rot.d} top={300} tam={120} />}
    </>
  );
};
