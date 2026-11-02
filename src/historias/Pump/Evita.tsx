// 4 · Cómo se evita (29,7–37,8 s): pies más bajos y cadera pegada (los brazos se estiran), chapa rápido y sacudir un brazo y luego el otro con magnesio (la barra PUMP baja un poco con cada sacudida).
import React from "react";
import { useCurrentFrame } from "remotion";
import { BLOQUES, Camara, Chip, P, Svg, ei } from "./comun";
import { Vig, Zoom, lerp, lerpV } from "./Gym";
import { CuerdaP, MuroPerfil, Nube, Perfil, S0, agarre, apoyo, geomPerfil, posColg, xw, type V } from "./Perfil";

export const Evita: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fPies = pal("pies") ?? 53, fCad = pal("cadera") ?? 80, fChapa = pal("chapa") ?? 116, fSac = pal("sacude") ?? 178, fLuego = pal("luego") ?? 207;
  const baja = ei(f, fPies, fPies + 24, 0, 1);
  // chapar: sube un poco y la mano de arriba va al mosquetón
  const clip = ei(f, fChapa, fChapa + 10, 0, 1) * (1 - ei(f, fChapa + 26, fChapa + 38, 0, 1));
  const est = lerp(baja, 0.3, clip);
  const q = posColg(est);
  const hip: V = q.hip;
  const MA0 = agarre(600), MB0 = agarre(668, -8), clipP = agarre(540, 6);
  const sh = geomPerfil({ hip, torso: q.torso, s: S0, manoA: MA0, manoB: MB0 }).hombro;
  const bolsa: V = [hip[0] + S0 * -31, hip[1] + S0 * -25];
  // sacudir: la mano libre va a la bolsa, se enharina y sacude colgada del hombro
  const libre = (t0: number) => { const k = f - t0, on = ei(f, t0, t0 + 6, 0, 1) * (1 - ei(f, t0 + 50, t0 + 60, 0, 1)); const dip = ei(f, t0, t0 + 8, 0, 1) * (1 - ei(f, t0 + 12, t0 + 18, 0, 1)); const rel: V = [sh[0] - 90 + Math.sin(k * 0.95) * 55, sh[1] + 165 + Math.abs(Math.sin(k * 0.95)) * 34]; return { on, pos: lerpV(rel, bolsa, dip), puff: ei(f, t0 + 9, t0 + 40, 0, 1) }; };
  const sB = libre(fSac), sA = libre(fLuego);
  const manoA: V = lerpV(lerpV(MA0, clipP, clip), sA.pos, sA.on), manoB: V = lerpV(MB0, sB.pos, sB.on);
  const alivio = f > fLuego + 40;
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  const lazo = ei(f, fChapa + 8, fChapa + 14, 0, 1) * (1 - ei(f, fChapa + 50, fChapa + 70, 0, 1));
  const rojo = baja > 0.5 ? "#5FD1C5" : "#FF4A3A";
  return (
    <Camara d={d} empuje={0.03} foco="50% 52%">
      <Svg>
        <Zoom z={1.2} ox={600} oy={1050}>
        <g transform="translate(230 250)">
          <MuroPerfil presas={[600, 668, 540, Math.round(posColg(0).pA[1]), Math.round(posColg(1).pA[1]), Math.round(posColg(1).pB[1])]} otras={[380, 470, 790, 1180, 1280]} />
          <CuerdaP arnes={[hip[0] - 14, hip[1] - 4]} flojo={0.6 - 0.2 * lazo} draws={f > fChapa + 14 ? [540, 1200, 1450, 1700] : [1200, 1450, 1700]} />
          <Perfil hip={hip} torso={q.torso} s={S0} manoA={manoA} manoB={manoB} pieA={lerpV(posColg(0).pA, posColg(1).pA, baja)} pieB={lerpV(posColg(0).pB, posColg(1).pB, baja)} cara={alivio ? "alivio" : baja > 0.5 ? "normal" : "esfuerzo"} halo={1 - baja} codos={{ col: rojo, o: 1 - 0.4 * baja }} />
          <Nube x={bolsa[0] - 20} y={bolsa[1] + 10} k={sB.puff} r={2} /><Nube x={bolsa[0] - 20} y={bolsa[1] + 10} k={sA.puff} r={2} />
        </g>
        </Zoom>
        <Vig />
        <Chip x={215} y={1290} t="PIES MÁS BAJOS" col={BLOQUES[0]} o={o(fPies - 4, fChapa - 8)} />
        <Chip x={215} y={1100} t="CADERA CERCA" col={BLOQUES[0]} o={o(fCad - 4, fChapa - 8)} />
        <Chip x={215} y={640} t="CHAPA RÁPIDO" col="#FF8A4A" o={o(fChapa - 4, fSac - 10)} />
        <Chip x={215} y={640} t="SACUDE" col="#9ED8F2" o={o(fSac - 2, fLuego - 4)} />
        <Chip x={215} y={640} t="Y EL OTRO" col="#9ED8F2" o={o(fLuego - 2, d)} />
      </Svg>
    </Camara>
  );
};
