// 5 · Cómo se descansa (37,8–49,4 s) y cierre en bucle. Base de la pared: la sangre vuelve enseguida y la fuerza no; a los 5 min cae en el mismo paso; a los ~20 min lo pasa.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Resina } from "../../piezas/Rocodromo";
import { BLOQUES, Camara, Chip, Cronometro, P, Rotulo, Svg, clamp, ei } from "./comun";
import { Cuerda, ESC, Esc, FondoGym, GY, MANOS, Vig, Zoom, cyDoblado, cyEstirado, lerpV, type V } from "./Gym";

export const Descansa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fEns = pal("enseguida") ?? 103, fFue = pal("fuerza") ?? 140, fRep = pal("repitas") ?? 191, fMin = pal("minutos") ?? 216, fNiv = pal("nivel") ?? 293, fVei = pal("veinte") ?? 319;
  const suelo = f < fRep, quinto = f >= fRep && f < fMin + 62, final = f >= fMin + 62;
  const min = f < fRep ? 0.2 : f < fNiv ? ei(f, fRep, fRep + 14, 0.2, 5) : ei(f, fNiv, fVei, 5, 20);
  const cr = (c: boolean) => (c ? "#FF8A4A" : BLOQUES[0]);
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  // intento a los 5 min: igual que el gancho
  const fCae = fMin + 8, suelta = ei(f, fMin, fMin + 8, 0, 1), caida = interpolate(f, [fCae, fCae + 20], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const hang = (cx: number, cy: number, lado: 1 | -1): V => [cx + lado * 58 * ESC, cy - 132 * ESC + 112 * ESC];
  const cy5 = cyDoblado + caida * 200, z5 = 1.45 - 0.2 * caida, oy5 = 880 + 0.9 * caida * 200, cx5 = 540 + (f < fMin ? Math.sin(f * 2.3) * 2.4 : 0);
  const sube = ei(f, fVei - 6, fVei + 10, 0, 1);
  const arriba: V = [560, 520];
  return (
    <Camara d={d} empuje={0.03} foco="50% 55%">
      <Svg>
        <Zoom z={suelo ? 1 : quinto ? z5 : 1.25} oy={suelo ? 1000 : quinto ? oy5 : 1050}>
        <FondoGym fuerte={0.3} mat={suelo} />
        {final && <><Resina x={arriba[0]} y={arriba[1]} r={40} c={GY.ruta} seed="top" magnesio={0.9} /><circle cx={arriba[0]} cy={arriba[1]} r={70} fill="none" stroke="#6FE08A" strokeWidth={10} opacity={sube} /></>}
        {suelo && <Esc cx={540} cy={1326} cara={f < fEns ? "esfuerzo" : "alivio"} f={f} />}
        {quinto && <g><Cuerda perno={[540, 430]} arnes={[cx5, cy5 + 14]} flojo={0.5 * (1 - caida) + 0.05} /><Esc cx={cx5} cy={cy5} manoL={lerpV(MANOS.L, hang(cx5, cy5, -1), suelta)} manoR={lerpV(MANOS.R, hang(cx5, cy5, 1), suelta)} pieL={f < fCae ? [470, 1236] : undefined} pieR={f < fCae ? [610, 1250] : undefined} cara={f < fCae + 20 ? "miedo" : "serio"} f={f} nud={1 - suelta} halo={1 - suelta} /></g>}
        {final && <g><Cuerda perno={[540, 430]} arnes={[540, cyEstirado + 14 - 30 * sube]} flojo={0.5} /><Esc cx={540} cy={cyEstirado - 40 * sube} manoL={lerpV(MANOS.L, [470, 640], sube)} manoR={lerpV(MANOS.R, arriba, sube)} pieL={[470, 1316 - 40 * sube]} pieR={[610, 1330 - 40 * sube]} cara={sube > 0.6 ? "alivio" : "normal"} f={f} codos={{ col: "#5FD1C5", o: 0.9 }} /></g>}
        </Zoom>
        <Vig />
        <Chip x={800} y={560} t="SANGRE: VUELVE" col={BLOQUES[0]} o={o(fEns - 14, fFue - 6)} />
        <Chip x={290} y={600} t="FUERZA: LENTA" col="#9ED8F2" o={o(fFue - 4, fRep - 6)} />
        <g opacity={ei(f, fRep - 6, fRep + 4, 0, 1)}><Cronometro x={850} y={1090} r={78} min={min} col={cr(f < fNiv)} /><Chip x={850} y={1226} t={f < fNiv ? "5 MIN" : `${Math.round(min)} MIN`} col={cr(f < fNiv)} /></g>
        {f >= fVei - 12 && <Rotulo f={f} ini={fVei - 12} t="UNOS 20 MIN" y={235} tam={104} col={BLOQUES[0]} />}
        {f >= fRep && f < fMin + 70 && <Rotulo f={f} ini={fRep} fin={fMin + 70} t="A LOS 5 MIN" y={235} tam={104} col="#FF8A4A" />}
      </Svg>
    </Camara>
  );
};

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const cx = 540 + Math.sin(f * 2.3) * 2.4;
  return (
    <Camara d={d} empuje={0.04} foco="50% 52%">
      <Svg>
        <Zoom z={1.45} oy={880}>
        <FondoGym fuerte={0.35} />
        <Cuerda perno={[540, 430]} arnes={[cx, cyDoblado + 14]} flojo={0.55} />
        <Esc cx={cx} cy={cyDoblado} manoL={MANOS.L} manoR={MANOS.R} pieL={[470, 1236]} pieR={[610, 1250]} cara="miedo" f={f} nud={1} halo={1} />
        </Zoom>
        <Vig />
        <Rotulo f={f} ini={0} t="NO ERES DÉBIL" y={235} tam={104} />
        <Rotulo f={f} ini={6} t="MÁNDASELO AL QUE SE CUELGA" y={1226} tam={46} col="#FFB070" />
        <Rotulo f={f} ini={6} t="CON LOS CODOS DOBLADOS" y={1286} tam={46} col="#FFB070" />
      </Svg>
    </Camara>
  );
};
