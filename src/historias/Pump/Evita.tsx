// 4 · Cómo se evita (29,7–37,8 s): pies más bajos y cadera pegada (los brazos se estiran), chapa rápido y sacudir un brazo y luego el otro (la barra PUMP baja un poco con cada sacudida).
import React from "react";
import { useCurrentFrame } from "remotion";
import { BLOQUES, Camara, Chip, P, Svg, ei } from "./comun";
import { Cuerda, Esc, FondoGym, MANOS, Vig, Zoom, cyDoblado, cyEstirado, lerp, lerpV, ESC, type V } from "./Gym";

export const Evita: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fPies = pal("pies") ?? 53, fCad = pal("cadera") ?? 80, fChapa = pal("chapa") ?? 116, fSac = pal("sacude") ?? 178, fLuego = pal("luego") ?? 207;
  const baja = ei(f, fPies, fPies + 22, 0, 1);
  const cy = lerp(cyDoblado, cyEstirado, baja), dy = 80 * baja;
  const verde = baja, rojo: string = baja > 0.5 ? "#5FD1C5" : "#FF4A3A";
  // chapar: la mano derecha va al mosquetón y vuelve
  const q: V = [800, 600], tC = f - fChapa, ida = ei(f, fChapa, fChapa + 9, 0, 1) * (1 - ei(f, fChapa + 20, fChapa + 30, 0, 1));
  const manoR0 = lerpV(MANOS.R, q, ida);
  // sacudir: izquierda y luego derecha, colgando de la otra
  const hang = (lado: 1 | -1): V => [540 + lado * 58 * ESC, cy - 132 * ESC + 112 * ESC + 10];
  const shake = (t0: number) => { const k = f - t0; const on = ei(f, t0, t0 + 6, 0, 1) * (1 - ei(f, t0 + 42, t0 + 52, 0, 1)); return { on, sw: Math.sin(k * 0.55) * 26 * on }; };
  const sL = shake(fSac), sR = shake(fLuego);
  const mL: V = lerpV(MANOS.L, [hang(-1)[0] + sL.sw, hang(-1)[1] + 20 * Math.abs(Math.sin((f - fSac) * 0.55))], sL.on);
  const mR: V = f < fLuego - 2 ? manoR0 : lerpV(MANOS.R, [hang(1)[0] + sR.sw, hang(1)[1] + 20 * Math.abs(Math.sin((f - fLuego) * 0.55))], sR.on);
  const alivio = f > fLuego + 40;
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  const lazo = ei(f, fChapa + 8, fChapa + 14, 0, 1) * (1 - ei(f, fChapa + 60, fChapa + 80, 0, 1));
  return (
    <Camara d={d} empuje={0.03} foco="50% 52%">
      <Svg>
        <Zoom z={1.25} oy={1050}>
        <FondoGym fuerte={0.2} />
        <g>
          <circle cx={q[0]} cy={q[1]} r={14} fill="#AEB8C4" stroke="#141B26" strokeWidth={5} />
          <path d={`M${q[0]} ${q[1]} L${q[0]} ${q[1] + 70}`} stroke="#F4F7FA" strokeWidth={14} strokeLinecap="round" /><rect x={q[0] - 15} y={q[1] + 62} width={30} height={46} rx={14} fill="none" stroke="#AEB8C4" strokeWidth={9} />
        </g>
        <Cuerda perno={[540, 430]} arnes={[540, cy + 14]} flojo={0.5} />
        {lazo > 0.05 && <path d={`M540 ${cy + 14} Q${700} ${cy - 160} ${q[0]} ${q[1] + 86}`} stroke="#FF6A1F" strokeWidth={9} fill="none" strokeLinecap="round" opacity={lazo} />}
        <Esc cx={540} cy={cy} manoL={mL} manoR={mR} pieL={[470, 1236 + dy]} pieR={[610, 1250 + dy]} cara={alivio ? "alivio" : baja > 0.5 ? "normal" : "esfuerzo"} f={f} halo={1 - verde} codos={{ col: rojo, o: 1 - 0.4 * baja }} />
        </Zoom>
        <Vig />
        <Chip x={215} y={1330} t="PIES MÁS BAJOS" col={BLOQUES[0]} o={o(fPies - 4, fChapa - 8)} />
        <Chip x={215} y={1100} t="CADERA CERCA" col={BLOQUES[0]} o={o(fCad - 4, fChapa - 8)} />
        <Chip x={760} y={330} t="CHAPA RÁPIDO" col="#FF8A4A" o={o(fChapa - 4, fSac - 10)} />
        <Chip x={215} y={560} t="SACUDE" col="#9ED8F2" o={o(fSac - 2, fLuego - 4)} />
        <Chip x={860} y={720} t="Y EL OTRO" col="#9ED8F2" o={o(fLuego - 2, d)} />
      </Svg>
    </Camara>
  );
};
