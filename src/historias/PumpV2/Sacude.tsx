// Paso 2: en el reposo, brazo abajo y sacude (no la mano relajada en la presa). Lupa: entra sangre nueva. +22 % (Baláš 2016). Sin prisa: ~47 s para la mitad.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Cifra, INFO } from "../../piezas/kit";
import { Vaso } from "./Vaso";
import { CuerdaP, MuroPerfil, Nube, Perfil, S0, agarre, geomPerfil, posColg, type V } from "../Pump/Perfil";
import { lerpV } from "../Pump/Gym";
import { Camara, Chip, Svg, Vig, Zoom, ei, type P } from "./comun";

export const Sacude: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fRe = pal("reposo") ?? 20, fAb = pal("abajo") ?? 40, fSa = pal("sangre") ?? 90, fV = pal("veintidós") ?? 160, fMa = pal("mano") ?? 210, fP = pal("prisa") ?? 290;
  const q = posColg(0.6), hip: V = q.hip, MA = agarre(600), MB0 = agarre(668, -8);
  const sh = geomPerfil({ hip, torso: q.torso, s: S0, manoA: MA, manoB: MB0 }).hombro;
  const bolsa: V = [hip[0] + S0 * -31, hip[1] + S0 * -25];
  // antes de «abajo»: mano B relajada sobre la presa (✗); después, baja, se enharina y sacude junto al cuerpo
  const k = f - fAb, on = ei(f, fAb - 2, fAb + 6, 0, 1), dip = ei(f, fAb + 30, fAb + 36, 0, 1) * (1 - ei(f, fAb + 40, fAb + 46, 0, 1));
  const rel: V = [sh[0] - 70 + Math.sin(k * 0.95) * 45, sh[1] + 170 + Math.abs(Math.sin(k * 0.95)) * 30];
  const manoB: V = lerpV(MB0, lerpV(rel, bolsa, dip), on);
  const lupa = ei(f, fSa - 8, fSa + 6, 0, 1) * (1 - ei(f, fV - 8, fV, 0, 1));
  const o = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  return (
    <Camara d={d} empuje={0.03} foco="50% 50%">
      <Svg>
        <Zoom z={1.15} ox={600} oy={1000}>
          <g transform="translate(230 230)">
            <MuroPerfil presas={[600, 668, Math.round(q.pA[1]), Math.round(q.pB[1])]} otras={[380, 470, 790, 1180, 1280]} />
            <CuerdaP arnes={[hip[0] - 14, hip[1] - 4]} flojo={0.6} />
            <Perfil hip={hip} torso={q.torso} s={S0} manoA={MA} manoB={manoB} pieA={q.pA} pieB={q.pB} cara={f > fV ? "alivio" : "esfuerzo"} halo={0} />
            <Nube x={bolsa[0] - 20} y={bolsa[1] + 10} k={ei(f, fAb + 38, fAb + 70, 0, 1)} r={2} />
          </g>
        </Zoom>
        <Vig />
        <Chip x={300} y={640} t="✗ MANO EN LA PRESA" col="#FF8E7E" o={o(fRe - 6, fAb - 2)} />
        <Chip x={300} y={640} t="✓ BRAZO ABAJO" col="#8FE0AE" o={o(fAb - 2, fV - 8)} />
        <Chip x={300} y={1500} t="ENTRA SANGRE NUEVA" col="#FF8A8A" o={o(fSa - 4, fV - 8)} />
      </Svg>
      {lupa > 0 && <div style={{ position: "absolute", left: 760 - 230, top: 760 - 230, width: 460, height: 460, borderRadius: 230, overflow: "hidden", border: "12px solid #3FB56B", background: "#0B1220", transform: `scale(${lupa})` }}>
        <div style={{ position: "absolute", left: -310, top: -810, width: 1080, height: 1920, transform: "scale(0.55)", transformOrigin: "540px 1040px" }}><Vaso pinch={0} flujo={1} verde={1} /></div>
      </div>}
      <div style={{ position: "absolute", inset: 0, background: "#050B14", opacity: 0.6 * Math.max(ei(f, fV - 6, fV + 2, 0, 1), 0) }} />
      {<Cifra texto="+22 %" etiqueta="DE TIEMPO · QUE CON LA MANO EN LA PRESA" y={760} k={(f - fV + 4) / 8} color={INFO.verde} tam={180} />}
    </Camara>
  );
};
