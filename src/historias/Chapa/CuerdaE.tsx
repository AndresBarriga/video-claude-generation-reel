// s1: «la primera está chapada» (primer plano de la 1.ª cinta con la cuerda pasada) → sube la cámara: saca cuerda del nudo hasta
// por encima de la cabeza; contador de la cuerda que tiene fuera.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, type P, ALTO, B1, HOOK, LEJOS, AG, nudo, mano, mix, pAlto, pNudo } from "./comun";
import { Plano, Soga, Aseg, Ella, Chapa1 } from "./piezas";

export const CuerdaE: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const fPero = pal("pero") ?? 56, fEnc = pal("encima") ?? 90, fSac = pal("sacas") ?? 122, fCoge = fEnc - 8;
  const baja = interpolate(f, [fPero, fCoge], [0, 1], io), sube = interpolate(f, [fCoge + 2, fSac + 10], [0, 1], io);
  const ang = f < fCoge ? mix(AG, pNudo(), baja) : mix(pNudo(), pAlto(f), sube);
  const h = mano(ang), H = { x: ALTO.x + h.x, y: ALTO.y + h.y }, n = nudo(ALTO);
  const c = interpolate(f, [fPero - 4, fPero + 14], [0, 1], io);
  const cx = B1.x - 30 + (HOOK.cx - B1.x + 30) * c, cy = B1.y - 60 + (HOOK.cy - B1.y + 60) * c, z = interpolate(f, [0, fPero], [2.5, 2.8], clamp) + (HOOK.z - 2.8) * c;
  const anillo = interpolate(f, [6, 14], [0, 1], clamp) * (1 - c);
  return (
    <>
      <Plano cx={cx} cy={cy} z={z}>
        <Aseg x={LEJOS} comba={0.85 - 0.3 * Math.sin(sube * Math.PI)} feed={Math.sin(sube * Math.PI)} />
        <Ella p={ALTO} ang={ang} cara={sube > 0.8 ? "esfuerzo" : "normal"} tiembla={Math.sin(f * 1.9) * (1 + sube * 1.5)} />
        <Chapa1 />
        <Soga pts={f < fCoge ? [B1, n] : [B1, { ...H, sx: -34 * sube }, { ...n, sag: 20 + 10 * sube, sx: -20 - 64 * sube }]} brillo={f < fCoge ? 0 : sube} desde={1} />
        {anillo > 0 && <circle cx={B1.x} cy={B1.y - 6} r={34 + 5 * Math.sin(f / 3)} fill="none" stroke="#fff" strokeWidth={5} opacity={0.9 * anillo} />}
      </Plano>
      {f < fPero + 6 ? <Etiqueta key="a" texto="1.ª CHAPADA" desde={6} top={300} tam={104} />
        : f >= fCoge && <Etiqueta key="b" texto={`+${(1.5 * sube).toFixed(1).replace(".", ",")} m DE CUERDA`} desde={fCoge} top={300} tam={88} />}
    </>
  );
};
