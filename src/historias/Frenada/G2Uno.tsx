// E80 · escenas 1-3. Comba: Dani suelta un bucle enorme («TE DOY CUERDA PARA QUE CAIGAS BLANDO») e Irene cae y cae.
// CaeMas: pantalla partida MÁS CUERDA / JUSTA con la cota de cada caída. Acompana: la buena en cámara lenta y el medidor de TIRÓN.
import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { Persona, Asegurador, Soga, POSE, Cota, Partida, porChapas, aparato } from "../../piezas/kit";
import { Mar, CAMW, VA, XA, I, P0, caerA, kTensa, aPantalla, cabezaAseg, Creencia, ContadorX, Tiron, Pildora, IRENE, DANI, type P } from "./G2comun";

export const CAM0 = CAMW;
const COMBA_MAS = 1.6, JUSTA = 0.3, F0 = 26;
/** Plano del gancho a f fotogramas (también cierra el bucle). Antes de F0: Dani suelta comba; después, la caída larga. */
export const PlanoComba: React.FC<{ f: number; globo?: boolean }> = ({ f, globo = true }) => {
  const k = f - F0, s = caerA(k, 1, COMBA_MAS), cab = aPantalla(cabezaAseg(XA).x, cabezaAseg(XA).y, CAM0);
  return (
    <>
      <Mar {...CAM0} sh={s.sh * 0.5} f={f}>
        <Asegurador via={VA} aspecto={DANI} {...(k > 0 ? s.aseg : {})} x={XA} alza={1} feed={k > 0 ? 0 : 0.5 + 0.5 * Math.sin(f / 3)} comba={k > 0 ? s.aseg.comba : 0.85} cara={k > 8 ? "miedo" : "normal"} />
        <Soga pts={k > 0 ? s.pts : porChapas(VA, aparato(VA, XA), I + 1, P0, { comba: 200 })} />
        <Persona p={k > 0 ? s.p : P0} ang={k > 0 ? s.ang : POSE.agarreMira} aspecto={IRENE} cara={k > 0 ? "miedo" : "esfuerzo"} rot={k > 0 ? s.rot : 0} tiembla={k > 0 ? 0 : Math.sin(f * 2) * 3} />
      </Mar>
      {globo && <Creencia t={"¡TE DOY CUERDA PARA\nQUE CAIGAS BLANDO!"} x={Math.min(700, cab.x + 260)} y={cab.y - 40} s={Math.min((f + 12) / 12, (F0 + 14 - f) / 6)} />}
    </>
  );
};
export const BComba: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <PlanoComba f={f} />;
};
/** Estado final de una caída (para la comparación), compuesto para que Irene quede en x = 540. */
const Final: React.FC<{ comba: number; ok: boolean; f: number }> = ({ comba, ok, f }) => {
  const s = caerA(60, 1, comba), c = { cx: P0.x + 40, cy: P0.y + 470, z: 0.62 }, largo = s.p.y - P0.y;
  return (
    <Mar {...c} f={f}>
      <Asegurador via={VA} aspecto={DANI} {...s.aseg} x={XA} alza={1} />
      <Soga pts={s.pts} />
      <g opacity={0.35}><Persona p={P0} ang={POSE.agarreMira} aspecto={IRENE} cara="normal" /></g>
      <Persona p={s.p} ang={s.ang} aspecto={IRENE} cara={ok ? "alivio" : "miedo"} rot={s.rot} />
      <Cota x={P0.x + 150} y={P0.y - 40} largo={Math.max(1, largo * Math.min(1, f / 10))} color={ok ? "#8FE0AE" : "#FF8E7E"} />
    </Mar>
  );
};
export const BCaeMas: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Partida izq={<Final comba={COMBA_MAS} ok={false} f={f} />} der={<Final comba={JUSTA} ok f={f} />} rotulos={["MÁS CUERDA", "JUSTA"]} corte={Math.min(1, f / 6)} top={430} />
      <ContadorX n={1} k={f - 4} />
    </>
  );
};
export const BAcompana: React.FC<P> = ({ pal, d }) => {
  // cámara lenta (½): la cuerda se tensa justo en «acompaña»; Dani se deja llevar hacia la pared. Medidor de TIRÓN en verde.
  const f = useCurrentFrame(), fAc = pal("acompaña") ?? Math.round(d * 0.5), fJ = pal("justa.") ?? d - 30, kT = kTensa(1, JUSTA);
  const k = (f - (fAc - 2 * kT)) * 0.5, s = caerA(k, 1, JUSTA), tir = s.j >= 0 ? 0.32 * Math.min(1, s.j / 4) + 0.04 : 0.04;
  const c = CAMW;
  return (
    <>
      <Mar {...c} sh={s.sh * 0.3} f={f}>
        <Asegurador via={VA} aspecto={DANI} {...s.aseg} alza={1} cara={s.j >= 0 ? "esfuerzo" : "serio"} />
        <Soga pts={k > 0 ? s.pts : porChapas(VA, aparato(VA, XA), I + 1, P0, { comba: 40 })} brillo={s.j >= 0 ? 0.5 : 0} />
        <Persona p={k > 0 ? s.p : P0} ang={k > 0 ? s.ang : POSE.agarreMira} aspecto={IRENE} cara={s.j >= 2 ? "alivio" : k > 0 ? "miedo" : "esfuerzo"} rot={k > 0 ? s.rot : 0} />
      </Mar>
      <div style={{ position: "absolute", left: 40, top: 440, fontFamily: "Figtree", fontWeight: 700, fontSize: 34, color: "#fff", background: "rgba(20,33,58,.75)", borderRadius: 20, padding: "6px 18px" }}>CÁMARA LENTA</div>
      <Tiron v={tir} o={f / 6} />
      {f < fAc - 6 && <Pildora t="BLANDA = QUE NO TE PARE EN SECO" neutro top={1365} k={f - 2} tam={46} />}
      {f >= fAc - 6 && <Pildora t="ACOMPAÑA EL TIRÓN" ok top={1365} k={f - fAc + 8} />}
      <Pildora t="CUERDA JUSTA" ok top={1170} k={f - fJ + 3} tam={50} />
      {void AbsoluteFill}
    </>
  );
};
