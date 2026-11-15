// s5: con la cuerda en la boca y el bucle enorme colgando → la suelta (el bucle desaparece) → sube un paso hasta tener la chapa
// en la cintura y chapa con un gesto corto.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, type P, ALTO, CINT, B1, B2, AG, nudo, mano, boca, cabeza, hipX, mix, pCint, suave, type Angulos } from "./comun";
import { Plano, Soga, Aseg, Ella, Mordida, Chapa1, type Pt } from "./piezas";
import { P_BOCA } from "./Boca";

export const Cintura: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const fSac = pal("sacas") ?? 37, fSube = pal("sube") ?? 83, fChapa = Math.min(d - 14, (pal("cintura") ?? 119) + 2);
  const suelta = interpolate(f, [fSac, fSac + 18], [0, 1], clamp), t = interpolate(f, [fSube - 4, fChapa - 12], [0, 1], io), ch = interpolate(f, [fChapa - 10, fChapa], [0, 1], io);
  const y = ALTO.y + (CINT.y - ALTO.y) * t, p = { x: hipX(y), y }, paso = Math.sin(t * Math.PI);
  const trepa: Angulos = { ...AG, cabeza: -30 + 24 * t, brazoA: [160 - 16 * paso, 178 - 50 * paso], brazoB: [146 + 20 * paso, 168 + 8 * paso], piernaA: [86 + 16 * paso, 30 + 14 * paso], piernaB: [64 - 20 * paso, 10] };
  const ang = f < fSac + 4 ? mix(P_BOCA, AG, interpolate(f, [fSac - 2, fSac + 4], [0, 1], clamp)) : f < fChapa - 10 ? trepa : pCint(ch);
  const muerde = f < fSac, n = nudo(p), h = mano(ang), H = { x: p.x + h.x, y: p.y + h.y }, b = boca(ang), M = { x: p.x + b.x + 5, y: p.y + b.y + 3 };
  const pts: Pt[] = muerde ? [B1, { ...M, sx: 14 }, { ...n, sag: 160, sx: 110 }]
    : f < fChapa - 10 ? [B1, { ...n, sag: 150 * (1 - suelta) ** 2, sx: -70 * (1 - suelta) }]
    : f < fChapa ? [B1, H, { ...n, sag: 10 + 12 * ch, sx: -8 }] : [B1, B2, { ...n, sag: 10, sx: -6 }];
  const c = cabeza(ang), a = interpolate(f, [fSac + 6, fSube], [0, 1], io);
  const cx = p.x + 40 + (c.x - 20) * (1 - a), cy = p.y - 60 + (c.y + 110) * (1 - a), z = 2.3 - 0.6 * a - 0.1 * suave(t);
  const flash = interpolate(f, [fChapa, fChapa + 4, fChapa + 14], [0, 1, 0], clamp);
  return (
    <Plano cx={cx} cy={cy} z={z}>
      <Aseg x={470} comba={0.3 - 0.2 * suelta} feed={Math.sin(suelta * Math.PI)} />
      <Ella p={p} ang={ang} cara={muerde ? "esfuerzo" : f >= fChapa ? "alivio" : "normal"} tiembla={muerde ? Math.sin(f * 1.9) * 1.5 : 0} />
      <Chapa1 /><Soga pts={pts} brillo={muerde ? 0.7 + 0.3 * Math.sin(f / 4) : 0} desde={1} />
      {muerde && <Mordida p={p} ang={ang} />}
      {flash > 0 && <circle cx={B2.x} cy={B2.y - 6} r={30 + 26 * flash} fill="none" stroke="#fff" strokeWidth={6} opacity={flash} />}
    </Plano>
  );
};
