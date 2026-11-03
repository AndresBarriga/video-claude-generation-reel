// Hoja de las 4 poses clave de E44 (cazo, repisa, empotre de rodilla, bat hang), de perfil sobre el desplome.
import React from "react";
import { MuroPerfil, Perfil, PerfilInv, agarre, apoyo, geomPerfil, hipDesdeHombro, xw, type V } from "../Pump/Perfil";

const S = 1.7;
const Panel: React.FC<{ x: number; y: number; t: string; children: React.ReactNode }> = ({ x, y, t, children }) => (
  <g>
    <clipPath id={`pn${x}${y}`}><rect x={x} y={y} width={540} height={960} /></clipPath>
    <g clipPath={`url(#pn${x}${y})`}><g transform={`translate(${x + 30} ${y + 60}) scale(0.9)`}>{children}</g></g>
    <text x={x + 270} y={y + 930} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={40} fill="#fff" stroke="#050B14" strokeWidth={9} paintOrder="stroke">{t}</text>
  </g>
);

/** Volumen (bulto del muro) para el empotre: sale del muro a la altura y. */
const Volumen: React.FC<{ y: number; w?: number; h?: number }> = ({ y, w = 120, h = 70 }) => (
  <g transform={`translate(${xw(y)} ${y})`}>
    <path d={`M0 0 L${-w} 0 Q${-w - 14} ${h / 2} ${-w + 10} ${h} L${0.3 * h} ${h} Z`} fill="#36565D" stroke="#10222A" strokeWidth={5} />
    <path d={`M${-w + 6} 6 L-6 6`} stroke="#6FA9AE" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
  </g>
);

export const Poses4: React.FC = () => {
  // 1 · cazo + sacudir
  const mA = agarre(520), mB = agarre(590, -6);
  const hip1 = hipDesdeHombro([mA[0] - 14, mA[1] + 0.99 * 102 * S], 6, S);
  const sh = geomPerfil({ hip: hip1, torso: 6, s: S, manoA: mA, manoB: mB }).hombro;
  const libre: V = [sh[0] - 70, sh[1] + 150];
  // 2 · repisa: de pie sobre un cambio de pendiente
  const repY = 900, pie: V = [xw(repY) - 70, repY];
  const hip2: V = [pie[0] - 10, repY - 130 * S + 6];
  // 3 · empotre de rodilla bajo un volumen
  const vy = 560, K: V = [xw(vy) - 42, vy + 74], F: V = [xw(vy + 190) - 14, vy + 190];
  const hip3: V = [K[0] - 70 * S * 0.55, K[1] + 66 * S * 0.8];
  // 4 · bat hang
  const hy = 520, hold: V = [xw(hy) - 14, hy];
  const hip4: V = [hold[0] - 45 * S, hold[1] + 120 * S];
  return (
    <g>
      <rect width={1080} height={1920} fill="#0B1624" />
      <Panel x={0} y={0} t="CAZO">
        <MuroPerfil presas={[520, 590]} otras={[300, 380]} />
        <Perfil hip={hip1} torso={6} s={S} manoA={mA} manoB={libre} pieA={apoyo(Math.round(hip1[1] + 70))} pieB={apoyo(Math.round(hip1[1] + 120))} cara="alivio" />
      </Panel>
      <Panel x={540} y={0} t="REPISA">
        <MuroPerfil presas={[]} otras={[300, 380, 440]} />
        <path d={`M${xw(repY) - 130} ${repY} L${xw(repY) + 20} ${repY} L${xw(repY) + 20} ${repY + 26} L${xw(repY) - 130} ${repY + 26} Z`} fill="#6FA9AE" stroke="#10222A" strokeWidth={5} />
        <Perfil hip={hip2} torso={4} s={S} manoA={[hip2[0] + 60, hip2[1] + 30]} manoB={[hip2[0] + 30, hip2[1] + 60]} pieA={[pie[0], pie[1] - 2]} pieB={[pie[0] - 30, pie[1] - 2]} cara="alivio" />
      </Panel>
      <Panel x={0} y={960} t="EMPOTRE DE RODILLA">
        <MuroPerfil presas={[vy + 190]} otras={[300, 420]} />
        <Volumen y={vy} />
        <Perfil hip={hip3} torso={-6} s={S} manoA={[hip3[0] - 30, hip3[1] - 60]} manoB={[hip3[0] - 60, hip3[1] - 30]} pieA={F} pieB={[K[0] + 6, K[1] + 4]} cara="alivio" />
      </Panel>
      <Panel x={540} y={960} t="BAT HANG">
        <MuroPerfil presas={[hy]} otras={[300, 380, 760]} />
        <PerfilInv hip={hip4} s={S} pieA={hold} pieB={[hold[0] + 4, hold[1] - 4]} cara="alivio" />
      </Panel>
    </g>
  );
};
