// 5 · Cómo se descansa (37,8–49,4 s) y cierre en bucle. Base de la pared: la sangre vuelve enseguida y la fuerza no; a los 5 min cae en el mismo paso; a los ~20 min lo pasa.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BLOQUES, Camara, Chip, Cronometro, P, Rotulo, Svg, clamp, ei } from "./comun";
import { Vig, Zoom } from "./Gym";
import { Colgado, CuerdaP, MuroPerfil, Perfil, S0, agarre, posColg, xw, type V } from "./Perfil";

const SUELO = 1330;
const OTRAS = [380, 470, 790, 1180];

export const Descansa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fEns = pal("enseguida") ?? 103, fFue = pal("fuerza") ?? 140, fRep = pal("repitas") ?? 191, fMin = pal("minutos") ?? 216, fNiv = pal("nivel") ?? 293, fVei = pal("veinte") ?? 319;
  const suelo = f < fRep, quinto = f >= fRep && f < fMin + 62, final = f >= fMin + 62;
  const min = f < fRep ? 0.2 : f < fNiv ? ei(f, fRep, fRep + 14, 0.2, 5) : ei(f, fNiv, fVei, 5, 20);
  const cr = (c: boolean) => (c ? "#FF8A4A" : BLOQUES[0]);
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  // intento a los 5 min: igual que el gancho
  const fCae = fMin + 8, caida = interpolate(f, [fCae, fCae + 20], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const k = f - (fCae + 20), rebote = k > 0 ? 34 * Math.sin(k * 0.4) * Math.exp(-k / 13) : 0;
  const q0 = posColg(0);
  const hip5: V = [q0.hip[0] - 40 * caida, q0.hip[1] + 200 * caida + rebote], cuelga = ei(f, fCae + 14, fCae + 26, 0, 1);
  const tiembla = f < fMin ? Math.sin(f * 2.3) * 2.4 : 0;
  const sube = ei(f, fVei - 6, fVei + 16, 0, 1);
  const parado: V = [xw(SUELO) - 150, SUELO - 130 * S0 + 4];
  const zoomSuelo = suelo ? 1.1 : quinto ? 1.1 : 1.2;
  return (
    <Camara d={d} empuje={0.03} foco="50% 55%">
      <Svg>
        <Zoom z={zoomSuelo} ox={600} oy={suelo ? 1100 : quinto ? 900 : 1050}>
        {suelo && <g transform="translate(90 170)">
          <MuroPerfil presas={[900, 1000]} otras={OTRAS} suelo={SUELO} />
          <Perfil hip={parado} torso={4} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="pie" cara={f < fEns ? "esfuerzo" : "alivio"} />
        </g>}
        {quinto && <g transform="translate(230 60)">
          <MuroPerfil presas={[600, 668, q0.pA[1], q0.pB[1]]} otras={[380, 470, 790, 1180, 1280]} />
          {f < fCae ? <g transform={`translate(${tiembla} 0)`}><Colgado est={0} cara="esfuerzo" halo={1} nud={1 - ei(f, fMin, fMin + 8, 0, 1)} /></g> : (
            <g><CuerdaP yb={360} arnes={[hip5[0] - 14, hip5[1] - 4]} flojo={0.55 * (1 - caida) + 0.05} />
              <Perfil hip={hip5} torso={0} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="cayendo" libreB="colgado" t={cuelga} cara={f < fCae + 20 ? "miedo" : "serio"} rot={-8 * (1 - cuelga)} /></g>
          )}
        </g>}
        {final && <g transform="translate(230 170)">
          <MuroPerfil presas={[600, 668, 460, 528]} otras={[380, 790, 1180, 1280]} />
          <circle cx={agarre(460)[0]} cy={460} r={64} fill="none" stroke="#6FE08A" strokeWidth={9} opacity={sube} />
          <Colgado est={0.2} cara={sube > 0.6 ? "alivio" : "normal"} dy={-140 * sube} codos={{ col: "#5FD1C5", o: 0.8 }} />
        </g>}
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
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg>
        <Zoom z={1.25} ox={560} oy={1050}>
          <g transform={`translate(${230 + Math.sin(f * 2.3) * 2.4} 260)`}>
            <MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} />
            <Colgado est={0} cara="miedo" halo={1} nud={1} />
          </g>
        </Zoom>
        <Vig />
        <Rotulo f={f} ini={0} t="NO ERES DÉBIL" y={235} tam={104} />
        <Rotulo f={f} ini={6} t="MÁNDASELO AL QUE SE CUELGA" y={1226} tam={46} col="#FFB070" />
        <Rotulo f={f} ini={6} t="CON LOS CODOS DOBLADOS" y={1286} tam={46} col="#FFB070" />
      </Svg>
    </Camara>
  );
};
