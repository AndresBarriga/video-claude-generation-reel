// 4 · Fase 4 (16,2–28,9 s): «ya no puedes cerrar la mano. Porque dentro…» Corte del antebrazo: el músculo aprieta los vasos, la sangre casi no entra, el oxígeno no llega y se acumulan residuos.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { Corte } from "./Corte";
import { BLOQUES, BR, Cabeza, Camara, Chip, Fondo, P, PM, Rotulo, Svg, ei, mundo } from "./comun";

const Guia: React.FC<{ a: [number, number]; b: [number, number]; o: number; col?: string }> = ({ a, b, o, col = "#fff" }) => (
  <path d={`M${a} L${b}`} stroke={col} strokeWidth={5} strokeDasharray="10 8" strokeLinecap="round" opacity={o * 0.9} />
);

export const Fase4: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fCerrar = pal("cerrar") ?? 40, fPorque = pal("Porque") ?? 95, fMus = pal("músculo") ?? pal("musculo") ?? 125, fVasos = pal("vasos") ?? 150;
  const fSangre = pal("sangre") ?? 188, fEntrar = pal("entrar") ?? 214, fOx = pal("oxígeno") ?? pal("oxigeno") ?? 252, fRes = pal("residuos") ?? 286, fFuerza = pal("fuerza") ?? 336;
  const corte = ei(f, fPorque, fPorque + 18, 0, 1) - ei(f, fFuerza - 4, fFuerza + 16, 0, 1);
  const aprieta = ei(f, fMus, fVasos + 12, 0, 1);
  const flujo = 1 - 0.93 * ei(f, fSangre, fEntrar + 12, 0, 1);
  const o2 = ei(f, fOx, fOx + 14, 0, 1);
  const res = ei(f, fRes, fRes + 60, 0, 1);
  const bomba = ei(f, 0, fCerrar, 0.78, 0.96);
  const abre = ei(f, fFuerza, fFuerza + 24, 0.1, 0.55);
  const OFF = 230, zoom = 1 + 0.12 * corte, [zx0, zy] = mundo(-120, 0), zx = zx0 + OFF;
  const scan = ei(f, fPorque, fPorque + 20, -520, 330);
  const [sa, sb] = [mundo(scan, -210), mundo(scan, 210)].map((q) => [q[0] + OFF, q[1]]);
  const t = (p: [number, number], dy = 0): [number, number] => [p[0] + OFF, p[1] + dy];
  const objetivo = { vaso: mundo(-110, -52), vena: mundo(-380, 52), mus: mundo(-60, 40), ox: mundo(-330, 52), res: mundo(-250, 10) };
  const chipO = (a: number, b: number) => ei(f, a, a + 8, 0, 1) * (1 - ei(f, b, b + 8, 0, 1));
  return (
    <Camara d={d} empuje={0.03} foco="52% 55%">
      <Svg>
        <g transform={`translate(${zx} ${zy}) scale(${zoom}) translate(${-zx} ${-zy})`}>
          <Fondo />
          <g transform={`translate(${OFF} 0)`}>
          <Brazo {...BR} f={f} bomba={bomba} calor={0.8} corte={corte} abre={abre} cierra={f < fFuerza ? 1 : 0} latido={Math.max(0, Math.sin(f * 0.5)) * (1 - corte)} polvo={0.4}
            dentro={<Corte f={f} aprieta={aprieta} flujo={flujo} o2={o2} residuos={res} />} />
          </g>
          {corte > 0.05 && corte < 0.999 && f < fPorque + 24 && <path d={`M${sa} L${sb}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.85} />}
        </g>
        {corte > 0.9 && <>
          <Guia a={[330, 650]} b={objetivo.vaso} o={chipO(fVasos - 10, fEntrar)} />
          <Chip x={330} y={620} t="VASOS" o={chipO(fVasos - 10, fEntrar)} />
          <Guia a={[470, 1160]} b={t(objetivo.mus, 30)} o={chipO(fMus - 10, fVasos + 40)} />
          <Chip x={470} y={1190} t="MÚSCULO" o={chipO(fMus - 10, fVasos + 40)} />
          <Guia a={[170, 1160]} b={t(objetivo.vena, 20)} o={chipO(fSangre - 6, fOx)} />
          <Chip x={170} y={1190} t="SANGRE" o={chipO(fSangre - 6, fOx)} col={PM.arteria} />
          <Guia a={[760, 1160]} b={t(objetivo.ox, 30)} o={chipO(fOx - 6, fRes)} col={PM.hielo} />
          <Chip x={760} y={1190} t="OXÍGENO" o={chipO(fOx - 6, fRes)} col={PM.hielo} />
          <Guia a={[330, 650]} b={t(objetivo.res, -30)} o={chipO(fRes - 6, fFuerza)} col={PM.residuo} />
          <Chip x={330} y={620} t="RESIDUOS" o={chipO(fRes - 6, fFuerza)} col={PM.residuo} />
        </>}
        <Cabeza x={170} y={470} cara="dolor" aro={BLOQUES[3]} o={1 - 0.7 * corte} />
        <Rotulo f={f} ini={0} t="FASE 4" y={250} tam={128} col={BLOQUES[3]} />
      </Svg>
    </Camara>
  );
};
