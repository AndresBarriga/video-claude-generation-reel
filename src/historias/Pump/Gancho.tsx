// 1 · Gancho (0–7 s): el escalador aprieta de más en el último tramo, se le abre la mano y cae; la cuerda naranja lo frena; lupa de rayos X sobre el antebrazo.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { Corte } from "./Corte";
import { Camara, Rotulo, Svg, clamp, ei, type P } from "./comun";
import { Vig, Zoom } from "./Gym";
import { Colgado, CuerdaP, MuroPerfil, Nube, Perfil, posColg, S0, type V } from "./Perfil";

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
  const fCorte = fAbre + 7, fCae = fCorte + 2;
  const macro = f < fCorte;
  // macro del antebrazo: hinchado, latiendo, con la mano cediendo
  const abre = 0.4 + 0.6 * ei(f, 3, fAbre, 0, 1), push = 1 + 0.07 * ei(f, 0, fCorte, 0, 1);
  const lat = Math.sin(f * 0.62);
  // caída y frenada
  const caida = interpolate(f, [fCae, fCae + 20], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const k = f - (fCae + 20), rebote = k > 0 ? 34 * Math.sin(k * 0.4) * Math.exp(-k / 13) : 0;
  const q = posColg(0);
  const hip: V = [q.hip[0] - 40 * caida, q.hip[1] + 440 * caida + rebote];
  const cuelga = ei(f, fCae + 14, fCae + 26, 0, 1);
  const sacud = k >= -2 && k < 10 ? Math.sin((k + 2) * 3) * 12 * (1 - (k + 2) / 12) : 0;
  const lupa = ei(f, fMus - 6, fMus + 8, 0, 1);
  const cara = f < fCae + 24 ? "miedo" : "serio";
  return (
    <Camara d={d} empuje={0.03} foco="50% 52%">
      <Svg>
        {macro ? (
          <g>
            <defs><linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1A27" /><stop offset="1" stopColor="#27434A" /></linearGradient></defs>
            <rect width={1080} height={1920} fill="url(#gm)" />
            {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={140 + i * 150} cy={380 + (i % 3) * 180} r={30 + (i % 4) * 14} fill="#9FD0E0" opacity={0.07} />)}
            <g transform={`translate(560 960) scale(${push}) translate(-560 -960)`}>
              <Brazo x={170} y={960} s={0.85} rot={-4} f={f} bomba={1.5} latido={lat} calor={0.12} abre={abre} cierra={1 - abre} polvo={0.95} />
              <Nube x={560} y={760} k={ei(f, 0, 26, 0, 0.98)} r={1.6} />
            </g>
          </g>
        ) : (
          <g transform={`translate(${sacud} ${Math.abs(sacud) * 0.35})`}>
            <Zoom z={1.1} ox={560} oy={900}><g transform="translate(230 60)">
              <MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} />
              {f < fCae ? <Colgado est={0} cara="miedo" halo={1} nud={0.5} /> : (
                <g>
                  <CuerdaP arnes={[hip[0] - 14, hip[1] - 4]} flojo={0.55 * (1 - caida) + 0.05} />
                  <Perfil hip={hip} torso={0} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="cayendo" libreB="colgado" t={cuelga} cara={cara} rot={-8 * (1 - cuelga)} />
                </g>
              )}
            </g></Zoom>
          </g>
        )}
        <Vig />
        <Lupa x={540} y={640} r={240} k={lupa} f={f} />
        <Rotulo f={f} ini={15} fin={fRiego + 20} t="NO ERES DÉBIL" y={235} tam={104} col="#fff" />
      </Svg>
    </Camara>
  );
};
