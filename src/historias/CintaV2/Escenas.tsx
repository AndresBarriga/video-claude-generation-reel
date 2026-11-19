// Escenas cortas que montan piezas ya hechas: gancho (la cuerda se sale), giro (bien pasada… y se sale igual), error 2 (regla + fallo) y CTA.
import React from "react";
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Plano, Persona, Asegurador, Soga, aparato, accChapar, sogaChapar, Lupa, Sello, Chip, Guardar, HojaEnviar } from "../../piezas/kit";
import { suave, type P, VIA, TU, ASE, TOP, B6, XASE, VERDE, CintaF, ParedCerca, clamp } from "./comun";
import { Salta } from "./Salta";
import { Regla } from "./Regla";

export const Gancho: React.FC<P> = ({ d, pal }) => <Salta fP={0} fS={(pal("sale") ?? 40) - 2} d={d} ok zoom={[1.35, 1.7]} />;

export const Giro: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fA = pal("aunque") ?? 6, fS = (pal("salir") ?? 60) - 2;
  return (
    <AbsoluteFill>
      <Salta fP={fA + 12} fS={fS} d={d} ok fuera="¡OTRA VEZ!" />
      <Chip texto="✓ SIN BACK-CLIP" top={700} tam={52} color="rgba(31,110,64,.92)" k={f < fS ? 1 : 0} />
    </AbsoluteFill>
  );
};

export const Puerta: React.FC<P> = (p) => {
  const fSi = p.pal("si") ?? Math.round(p.d * 0.62), fC = p.pal("caer") ?? fSi + 12, fA = p.pal("abrirla") ?? fSi + 40;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={fSi}><Regla {...p} d={fSi} /></Sequence>
      <Sequence from={fSi}><Salta fP={fC - fSi} fS={fA - fSi + 4} d={p.d - fSi} /></Sequence>
    </AbsoluteFill>
  );
};

export const Cta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  if (f >= d - 6) return <Salta fP={0} fS={40} d={d} ok zoom={[1.35, 1.7]} />;
  const fG = pal("guárdalo") ?? 2, fM = pal("mándaselo") ?? 30, p = VIA.cadera(B6.y + 96), t = 0.24 + 0.4 * suave(f / 30) + 0.36 * suave((f - 40) / 16);
  const a = accChapar(VIA, p, TOP, t), k = spring({ frame: f - 20, fps, config: { damping: 12, stiffness: 170 } });
  return (
    <>
      <Plano via={VIA} cx={520} cy={B6.y + 120} z={1.5 + f * 0.002} decorado="roca">
        <Asegurador via={VIA} x={XASE} aspecto={ASE} cuerda={false} alza={1} />
        <Soga pts={sogaChapar(VIA, aparato(VIA, XASE), TOP, p, a)} />
        <Persona p={p} ang={{ ...a.ang, cabeza: -34 }} aspecto={TU} cara={a.chapada ? "alivio" : "serio"} />
      </Plano>
      <Lupa x={300} y={1000} r={240} k={k} fondo="#CDBB9E">
        <g transform="scale(0.9)"><ParedCerca seed="ci" /><CintaF x={-30} y={-250} s={0.62} puerta="izq" haloArriba={VERDE} haloAbajo={VERDE} /></g>
      </Lupa>
      <Sello x={470} y={830} ok k={suave((f - 26) / 8)} s={0.8} />
      <div style={{ opacity: interpolate(f, [fM - 4, fM + 2], [1, 0], clamp) }}><Guardar k={(f - fG) / 8} y={430} /></div>
      <HojaEnviar k={(f - fM) / 40} para="Al que dice «si está chapada, está chapada»" />
    </>
  );
};
