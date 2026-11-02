// 1 · Gancho (0–7 s): el escalador aprieta de más en el último tramo, se le abre la mano y cae; la cuerda naranja lo frena; lupa de rayos X sobre el antebrazo.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { Corte } from "./Corte";
import { Camara, Rotulo, Svg, clamp, ei, type P } from "./comun";
import { Cuerda, Esc, FondoGym, MANOS, cyDoblado, ESC, lerpV, Vig, Zoom, type V } from "./Gym";

export const Lupa: React.FC<{ x: number; y: number; r: number; k: number; f: number; aprieta?: number; flujo?: number }> = ({ x, y, r, k, f, aprieta = 1, flujo = 0.1 }) => {
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <clipPath id="lupaC"><circle r={r} /></clipPath>
      <circle r={r + 12} fill="#FF6A1F" />
      <circle r={r} fill="#101A22" />
      <g clipPath="url(#lupaC)"><Brazo x={-90} y={20} s={0.52} rot={-12} f={f} bomba={0.95} corte={1} presa={false} dentro={<Corte f={f} aprieta={aprieta} flujo={flujo} />} /></g>
    </g>
  );
};

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAbre = pal("abre") ?? 24, fMus = pal("músculo") ?? pal("musculo") ?? 130, fRiego = pal("riego") ?? 180;
  const fSuelta = fAbre + 2, fCae = fAbre + 12;
  const suelta = ei(f, fSuelta, fSuelta + 10, 0, 1);
  const caida = interpolate(f, [fCae, fCae + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const k = f - (fCae + 22), rebote = k > 0 ? 26 * Math.sin(k * 0.45) * Math.exp(-k / 14) : 0;
  const tiembla = f < fSuelta ? Math.sin(f * 2.3) * 2.4 : 0;
  const cx = 540 + tiembla, cy = cyDoblado + caida * 200 + rebote, z = 1.45 - 0.2 * caida, oy = 880 + 0.9 * caida * 200;
  const hang = (lado: 1 | -1): V => [cx + lado * 40 * ESC + lado * 18 * ESC, cy - 132 * ESC + 112 * ESC];
  const manoL = lerpV(MANOS.L, hang(-1), suelta), manoR = lerpV(MANOS.R, hang(1), suelta);
  const sacud = k >= -2 && k < 8 ? Math.sin((k + 2) * 3) * 12 * (1 - (k + 2) / 10) : 0;
  const cara = f < fCae + 24 ? "miedo" : "serio";
  const lupa = ei(f, fMus - 6, fMus + 8, 0, 1);
  return (
    <Camara d={d} empuje={0.04} foco="50% 52%">
      <Svg>
        <g transform={`translate(${sacud} ${Math.abs(sacud) * 0.35})`}>
          <Zoom z={z} oy={oy}>
          <FondoGym fuerte={0.35} />
          <Cuerda perno={[540, 430]} arnes={[cx, cy + 9 * ESC]} flojo={0.55 * (1 - caida) + 0.05} />
          <Esc cx={cx} cy={cy} manoL={manoL} manoR={manoR} pieL={f < fCae ? [470, 1236] : undefined} pieR={f < fCae ? [610, 1250] : undefined} cara={cara} f={f} nud={1 - suelta} halo={1 - suelta} />
          </Zoom>
        </g>
        <Vig />
        <Lupa x={540} y={600} r={240} k={lupa} f={f} />
        <Rotulo f={f} ini={15} fin={fRiego + 20} t="NO ERES DÉBIL" y={235} tam={104} col="#fff" />
      </Svg>
    </Camara>
  );
};
