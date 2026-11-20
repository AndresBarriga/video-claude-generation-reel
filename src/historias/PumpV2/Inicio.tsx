// Gancho (v4): el escalador colgado en la vía, su antebrazo en radiografía brillando en rojo encima del dibujo (persona + causa en el
// segundo 1); la mano de abajo se suelta. Reencuadre: la cámara entra en ese antebrazo y pasa al antebrazo en radiografía grande.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Pasos } from "../../piezas/kit";
import { CuerdaP, Colgado, MuroPerfil, Perfil, S0, agarre, geomPerfil, posColg, xw, type V } from "../Pump/Perfil";
import { Rx } from "./Rx";
import { ESC, Esc, FondoGym, MANOS, cyDoblado } from "../Pump/Gym";
import { Macro } from "./Macro";
import { Chip, Svg, Vig, Zoom, clamp, ei, type P } from "./comun";

// Escalador de frente (el de E43 en el rocódromo), colgado de dos presas con los codos doblados.
const S = ESC, CX = 540, CY = cyDoblado;
const codo = (sh: V, m: V, l1: number, l2: number, lado: number): V => {
  const dx = m[0] - sh[0], dy = m[1] - sh[1], d = Math.min(l1 + l2 - 0.5, Math.hypot(dx, dy)), b = Math.atan2(dy, dx);
  const an = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  return [sh[0] + Math.cos(b + lado * an) * l1, sh[1] + Math.sin(b + lado * an) * l1];
};
const HOMBRO_R: V = [CX + 40 * S, CY - 132 * S];
export const ANTEBRAZO = { a: codo(HOMBRO_R, MANOS.R, 62 * S, 58 * S, -1), b: MANOS.R as V };
const Escena: React.FC<{ manoL?: V; f: number }> = ({ manoL = MANOS.L, f }) => (
  <g><FondoGym fuerte={0.3} /><Esc cx={CX} cy={CY} hx={CX} manoL={manoL} manoR={MANOS.R} cara="esfuerzo" f={f} /></g>
);

/** Antebrazo en rayos X superpuesto al dibujo (coordenadas de pantalla antes del zoom). */
const RxBrazo: React.FC<{ a: V; b: V; pump: number; f: number }> = ({ a, b, pump, f }) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const lat = 1 + 0.06 * Math.sin(f * 0.7) * pump, col = pump > 0.5 ? "#FF5A5F" : "#FF9A3C";
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <rect x={-20} y={-34} width={L + 40} height={68} rx={34} fill="#0E1C2E" opacity={0.75} />
      <ellipse cx={L * 0.42} cy={0} rx={L * 0.36 * lat} ry={22 * lat} fill={col} opacity={0.35 + 0.4 * pump} />
      <ellipse cx={L * 0.42} cy={0} rx={L * 0.36 * lat + 16} ry={22 * lat + 12} fill={col} opacity={0.25 * pump} filter="url(#rxB)" />
      <path d={`M0 -10 L${L} -6`} stroke="#FF5A5F" strokeWidth={8} strokeLinecap="round" />
      <rect x={-20} y={-34} width={L + 40} height={68} rx={34} fill="none" stroke="#9EC5FF" strokeWidth={6} />
    </g>
  );
};

export const Gancho: React.FC<P> = ({ d, pal }) => {
  // De perfil en el desplome (lo que mejor se lee): brazos rojos de pump, la mano se abre, cae y la cuerda le frena.
  const f = useCurrentFrame(), fF = pal("flojo") ?? 60, fCae = Math.max(16, (pal("mitad") ?? 30) - 2);
  const caida = interpolate(f, [fCae, fCae + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const k = f - (fCae + 18), rebote = k > 0 ? 34 * Math.sin(k * 0.4) * Math.exp(-k / 13) : 0;
  const q0 = posColg(0), hip: V = [q0.hip[0] - 40 * caida, q0.hip[1] + 440 * caida + rebote];
  const cuelga = ei(f, fCae + 12, fCae + 24, 0, 1), sac = k >= -2 && k < 10 ? Math.sin((k + 2) * 3) * 12 * (1 - (k + 2) / 12) : 0;
  const tiembla = f < fCae ? Math.sin(f * 2.2) * 4 * ei(f, 0, fCae, 0, 1) : 0;
  return (
    <AbsoluteFill style={{ background: "#0E1A27" }}>
      <Svg>
        <g transform={`translate(${sac + tiembla} ${Math.abs(sac) * 0.35})`}>
          <Zoom z={1.15 + 0.1 * ei(f, 0, d, 0, 1)} ox={560} oy={900}><g transform="translate(230 60)">
            <MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} />
            {f < fCae ? <Colgado est={0} cara="esfuerzo" halo={ei(f, 0, 20, 0.4, 1)} nud={0.6} codos={{ col: "#FF4A3A", o: 0.5 + 0.5 * Math.sin(f * 0.5) ** 2 }} /> : (
              <g>
                <CuerdaP arnes={[hip[0] - 14, hip[1] - 4]} flojo={0.55 * (1 - caida) + 0.05} />
                <Perfil hip={hip} torso={0} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="cayendo" libreB="colgado" t={cuelga} cara={f < fCae + 24 ? "miedo" : "serio"} rot={-8 * (1 - cuelga)} halo={1} />
              </g>
            )}
          </g></Zoom>
        </g>
        <Vig />
        <Chip x={540} y={620} t="✗ FLOJO" col="#FF8E7E" o={ei(f, fF - 2, fF + 6, 0, 1)} />
      </Svg>
    </AbsoluteFill>
  );
};

export const Reencuadre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), k = ei(f, 0, 12, 0, 1), c = ANTEBRAZO, cx = (c.a[0] + c.b[0]) / 2, cy = (c.a[1] + c.b[1]) / 2;
  return (
    <AbsoluteFill style={{ background: "#0E1A27" }}>
      {k < 1 && <Svg><g opacity={1 - k} transform={`translate(540 960) scale(${1 + 2 * k}) translate(-540 -960)`}>
        <Zoom z={1.25} ox={560} oy={900}><g transform="translate(230 60)"><MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} />
          <CuerdaP arnes={[posColg(0).hip[0] - 54, posColg(0).hip[1] + 436]} flojo={0.05} />
          <Perfil hip={[posColg(0).hip[0] - 40, posColg(0).hip[1] + 440]} torso={0} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="cayendo" libreB="colgado" t={1} cara="serio" halo={1} /></g></Zoom>
      </g></Svg>}
      <div style={{ position: "absolute", inset: 0, opacity: k, transform: `scale(${0.85 + 0.15 * k})` }}>
        <Macro bomba={1.5} aprieta={0.9} flujo={0.2} residuos={ei(f, 10, d, 0, 0.6)} z={1.1} tiembla={0.6}>
          <Chip x={540} y={1500} t="✓ SIN RIEGO" col="#8FE0AE" o={ei(f, 10, 18, 0, 1)} />
        </Macro>
      </div>
    </AbsoluteFill>
  );
};

export const Lista: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fT = pal("tres") ?? 40;
  return (
    <AbsoluteFill>
      <Macro bomba={1.0} aprieta={0.5} flujo={0.5} residuos={0.3} z={1.0} />
      <Pasos actual={0} y={430} k={(f - fT + 4) / 8} />
    </AbsoluteFill>
  );
};

// ───────── E69B (reel de prueba, 20-nov): mismo cuerpo, inicio nuevo ─────────
// E69 perdió dos tercios en 0–13 s (skip 36,6 %). Cambios: rocódromo iluminado en vez del fondo casi negro, el gancho
// «¿SE TE ABRE LA MANO?» grande desde el fotograma 0 y plano cerrado con los antebrazos rojos antes de soltarse.

const SALA_CLARA = "#EEF1F4";
/** Ilumina la sala (a la izquierda del muro) y aclara un poco el muro. Coordenadas del muro. */
const Iluminado: React.FC = () => {
  const izq = `M-400 -500 L${xw(-500)} -500 L${xw(2600)} 2600 L-400 2600 Z`;
  const der = `M${xw(-500)} -500 L1600 -500 L1600 2600 L${xw(2600)} 2600 Z`;
  return (
    <g>
      <defs><linearGradient id="salaClara" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCE5EC" /></linearGradient></defs>
      <path d={izq} fill="url(#salaClara)" />
      {[60, 210, 360].map((x, i) => <rect key={i} x={x} y={-80} width={90} height={26} rx={13} fill="#FFF7D6" opacity={0.9} />)}
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={30 + ((i * 97) % 420)} cy={300 + ((i * 173) % 1400)} r={16 + (i % 3) * 8} fill={["#C8566B", "#4F7FC9", "#6FA34A", "#E8C547"][i % 4]} opacity={0.35} />)}
      <path d={der} fill="#FFFFFF" opacity={0.22} />
    </g>
  );
};
const Caja: React.FC<{ t1: string; t2?: string; k: number }> = ({ t1, t2, k }) => k <= 0 ? null : (
  <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", opacity: Math.min(1, k * 2), transform: `scale(${0.9 + 0.1 * Math.min(1, k)})` }}>
    <div style={{ position: "relative", background: "#FF6A1F", border: "6px solid #fff", borderRadius: 14, padding: "14px 40px 20px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,.35)" }}>
      {[[-14, -14], [-14, null], [null, -14], [null, null]].map(([l, tp], j) => <i key={j} style={{ position: "absolute", width: 22, height: 22, borderRadius: 11, background: "#fff", border: "4px solid #FF6A1F", left: l ?? undefined, right: l === null ? -14 : undefined, top: tp ?? undefined, bottom: tp === null ? -14 : undefined }} />)}
      <div style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 118, lineHeight: 1.0, color: "#fff", WebkitTextStroke: "6px #0B1220", paintOrder: "stroke fill" }}>{t1}</div>
      {t2 && <div style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 118, lineHeight: 1.0, color: "#fff", WebkitTextStroke: "6px #0B1220", paintOrder: "stroke fill" }}>{t2}</div>}
    </div>
  </div>
);
export const GanchoB: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fF = pal("flojo") ?? 60, fCae = Math.max(16, (pal("mitad") ?? 30) - 2);
  const caida = interpolate(f, [fCae, fCae + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const k = f - (fCae + 18), rebote = k > 0 ? 34 * Math.sin(k * 0.4) * Math.exp(-k / 13) : 0;
  const EB = 1, q0 = posColg(EB), hip: V = [q0.hip[0] - 40 * caida, q0.hip[1] + 440 * caida + rebote];
  const cuelga = ei(f, fCae + 12, fCae + 24, 0, 1), sac = k >= -2 && k < 10 ? Math.sin((k + 2) * 3) * 12 * (1 - (k + 2) / 12) : 0;
  const tiembla = f < fCae ? Math.sin(f * 2.2) * 5 * ei(f, 0, fCae, 0.4, 1) : 0;
  // plano cerrado sobre brazos y torso antes de soltarse; se abre al caer para que se lea la caída
  const z = interpolate(f, [0, fCae, fCae + 20], [1.6, 1.7, 1.3], clamp), oy = interpolate(f, [0, fCae, fCae + 20], [700, 700, 980], clamp);
  const MA = agarre(600), MB = agarre(668, -8), g = geomPerfil({ hip: q0.hip, torso: q0.torso, s: S0, manoA: MA, manoB: MB });
  const late = 0.6 + 0.4 * Math.sin(f * 0.55) ** 2, bajar = interpolate(f, [0, fCae, fCae + 20], [330, 330, 0], clamp); // antebrazos por debajo del rótulo
  return (
    <AbsoluteFill style={{ background: SALA_CLARA }}>
      <Svg>
        <defs><filter id="pumpB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter></defs>
        <g transform={`translate(${sac + tiembla} ${Math.abs(sac) * 0.35 + bajar})`}>
          <Zoom z={z} ox={540} oy={oy}><g transform="translate(230 60)">
            <MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} />
            <Iluminado />
            {f < fCae ? <g>
              <Colgado est={EB} cara="esfuerzo" halo={1} nud={1} codos={{ col: "#FF3B2E", o: late }} />
              {[[g.codoA, MA], [g.codoB, MB]].map(([e, m], i) => <g key={i}>
                <path d={`M${e[0]} ${e[1]} L${m[0]} ${m[1]}`} stroke="#FF2A1F" strokeWidth={70} strokeLinecap="round" opacity={0.45 * late} filter="url(#pumpB)" />
                <path d={`M${e[0]} ${e[1]} L${m[0]} ${m[1]}`} stroke="#FF5A4F" strokeWidth={30} strokeLinecap="round" opacity={0.55 * late} />
              </g>)}
            </g> : (
              <g>
                <CuerdaP arnes={[hip[0] - 14, hip[1] - 4]} flojo={0.55 * (1 - caida) + 0.05} />
                <Perfil hip={hip} torso={0} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="cayendo" libreB="colgado" t={cuelga} cara={f < fCae + 24 ? "miedo" : "serio"} rot={-8 * (1 - cuelga)} halo={1} />
              </g>
            )}
          </g></Zoom>
        </g>
      </Svg>
      <Caja t1={f < fF - 2 ? "¿SE TE ABRE" : "NO ESTÁS"} t2={f < fF - 2 ? "LA MANO?" : "FLOJO"} k={1} />
    </AbsoluteFill>
  );
};
export const ReencuadreB: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), k = ei(f, 0, 12, 0, 1), q0 = posColg(0);
  return (
    <AbsoluteFill style={{ background: SALA_CLARA }}>
      {k < 1 && <Svg><g opacity={1 - k} transform={`translate(540 960) scale(${1 + 2 * k}) translate(-540 -960)`}>
        <Zoom z={1.3} ox={540} oy={980}><g transform="translate(230 60)"><MuroPerfil presas={[600, 668]} otras={[380, 470, 790, 1180, 1280]} /><Iluminado />
          <CuerdaP arnes={[q0.hip[0] - 54, q0.hip[1] + 436]} flojo={0.05} />
          <Perfil hip={[q0.hip[0] - 40, q0.hip[1] + 440]} torso={0} s={S0} manoA={[0, 0]} manoB={[0, 0]} pieA={[0, 0]} pieB={[0, 0]} libre="cayendo" libreB="colgado" t={1} cara="serio" halo={1} /></g></Zoom>
      </g></Svg>}
      <div style={{ position: "absolute", inset: 0, opacity: k, transform: `scale(${0.85 + 0.15 * k})`, background: "linear-gradient(#F6F3EE, #DCE5EC)" }}>
        <Rx pump={1} aprieta={0.9} flujo={0.2} residuos={ei(f, 10, d, 0, 0.6)} z={1.1} tiembla={0.6} />
        <Svg><Chip x={540} y={1500} t="✓ SIN RIEGO" col="#2F8F55" o={ei(f, 10, 18, 0, 1)} /></Svg>
      </div>
    </AbsoluteFill>
  );
};
