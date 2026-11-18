// s0: estirada chapando la 2.ª con la cuerda sacada → el pie se va (cámara lenta) → cae de verdad y llega al SUELO en «suelo».
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, golpe, type P, ALTO, B1, HOOK, LEJOS, nudo, mano, pAlto, resbala, caeSuelo, kSuelo, suave } from "./comun";
import { Plano, Soga, Aseg, Ella, Polvo, Chapa1 } from "./piezas";
import { Rebobina, N_REB } from "../Agarra/comun";

/** E59B: abre con el final de la caída (ya en el suelo), «¿QUÉ HA PASADO?», y rebobina. Fotogramas de esa intro. */
const INTRO = 34;

const BT = 26, L = 440; // px que baja a cámara lenta · cuerda libre desde la 1.ª chapa
/** Cuerda desde la 1.ª chapa: por la mano (suelta = 0) o colgando en bucle (suelta = 1). */
export const tramo = (p: { x: number; y: number }, h: { x: number; y: number }, suelta: number, largo = L, tensa = false) => {
  const n = nudo(p), dist = Math.hypot(n.x - B1.x, n.y - B1.y), off = tensa ? 0 : Math.sqrt(Math.max(0, largo * largo - dist * dist)) / 2;
  const panza = { x: (B1.x + n.x) / 2 - 0.45 * off, y: (B1.y + n.y) / 2 + 0.85 * off };
  const m = { x: h.x + (panza.x - h.x) * suelta, y: h.y + (panza.y - h.y) * suelta };
  return [B1, { ...m, sx: -34 }, { ...n, sag: 30 * (1 - suelta) + 0.25 * off * suelta, sx: -84 * (1 - suelta) - 24 * suelta }];
};

export const Gancho: React.FC<P> = ({ e, d, pal }) => {
  const fr = useCurrentFrame(), abre = !!(e as { abre?: boolean }).abre, intro = abre && fr < INTRO;
  const fF = pal("fallas") ?? 60, fS = Math.min(d - 12, (pal("suelo") ?? 115) + 2);
  const f = intro ? fS - 16 + Math.min(fr, INTRO - N_REB) * 1.0 : fr;
  const p0 = { x: ALTO.x - 6, y: ALTO.y + BT }, f0 = fS - Math.round(kSuelo(p0.y));
  const bt = interpolate(f, [fF, f0], [0, 1], clamp), micro = interpolate(f, [4, 8, 14], [0, 1, 0], clamp);
  const aR = resbala(pAlto(f), Math.max(bt, micro * 0.3)), k = f - f0, c = caeSuelo(k, p0, aR, 700);
  const p = k > 0 ? c : { x: ALTO.x - 6 * bt, y: ALTO.y + BT * bt * bt, ang: aR, rot: -3 * bt, j: -1 };
  const h = mano(p.ang), H = { x: p.x + h.x, y: p.y + h.y }, j = p.j;
  const t = suave((f - fF) / (fS - fF)), z = HOOK.z + 0.1 * Math.min(1, f / fF) + (1.0 - HOOK.z - 0.1) * t;
  const cx = HOOK.cx + (600 - HOOK.cx) * t, cy = HOOK.cy + (2290 - HOOK.cy) * t;
  return (
    <>
      <Plano cx={cx} cy={cy} z={z} sh={golpe(f, fS, 18)}>
        <Aseg x={LEJOS + (j >= 0 ? 34 * (1 - Math.exp(-j / 4)) : 0)} comba={j >= 0 ? 0.03 : 0.85} cara={j >= 0 || k > 6 ? "miedo" : "normal"} alza={bt} paso={j >= 0 ? Math.min(Math.PI, j * 0.5) : 0} />
        <Ella p={p} ang={p.ang} rot={p.rot} cara={j >= 0 ? "dolor" : "miedo"} tiembla={k > 0 ? 0 : Math.sin(f * 1.9) * 2.5} sombra={k > 0} />
        <Chapa1 />
        <Soga pts={tramo(p, H, Math.max(bt, k > 0 ? 1 : 0), L, j >= 0)} brillo={0.8 * (1 - bt)} desde={1} />
        <Polvo x={700} k={j} />
      </Plano>
      {intro ? <Etiqueta texto="¿QUÉ HA PASADO?" desde={-15} top={300} tam={104} /> : <Etiqueta texto="¿TOCAS EL SUELO?" desde={abre ? INTRO : -15} top={300} tam={96} />}
      {intro && <Rebobina k={fr - (INTRO - N_REB)} />}
    </>
  );
};
