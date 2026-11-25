// E80 · escenas 8-10. Tarjeta (fija ≥2,5 s): lo que SÍ es (3 ✓) y las tres creencias tachadas.
// Práctica: OTRO sitio (rocódromo claro): caída pequeña de Irene, Dani asegura y Marta (con experiencia) mira a su lado.
// Cierre: vuelta al acantilado, Dani pillado, «¿Cuál de las tres te han hecho?», envío, parte 3 y bucle al fotograma 0.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato, sistemaCaida, REPARTO, bucle } from "../../piezas/kit";
import { Envio } from "../../piezas/kit/Montaje";
import { Gym, VIA as VS, XA as XS } from "../Miedo/comun";
import { Mar, VA, XA, I, P0, Pildora, IRENE, DANI, COL, F, pop, Grande, type P } from "./G2comun";
import { PlanoComba } from "./G2Uno";

const SI: string[] = ["Cuerda justa", "Acompañar el tirón (sin adelantarse)", "Nada debajo: si no, corta"];
const NO: string[] = ["más cuerda", "saltar antes", "blanda siempre"];
export const BTarjeta: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#DDEFF5" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 430, bottom: 430, background: COL.crema, border: `9px solid ${COL.tinta}`, borderRadius: 48, boxShadow: "0 18px 0 rgba(20,33,58,.25)", transform: `scale(${pop(f)})`, padding: "40px 46px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 84, color: COL.tinta, textAlign: "center", lineHeight: 1 }}>FRENADA BLANDA</div>
        {SI.map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, borderTop: "4px dashed #D8CFC1", paddingTop: 22, opacity: pop(f - 3 - i * 3) > 0 ? 1 : 0 }}>
            <div style={{ flex: "0 0 auto", width: 88, height: 88, borderRadius: 44, background: COL.verde, border: `6px solid ${COL.tinta}`, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 54, color: COL.tinta, lineHeight: 1.05 }}>{t}</div>
          </div>
        ))}
        <div style={{ borderTop: "4px dashed #D8CFC1", paddingTop: 20, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", opacity: pop(f - 12) > 0 ? 1 : 0 }}>
          {NO.map((t) => <span key={t} style={{ fontFamily: F, fontWeight: 800, fontSize: 38, color: COL.rojo, textDecoration: "line-through", textDecorationThickness: 5, whiteSpace: "nowrap" }}>✗ {t}</span>)}
        </div>
      </div>
    </>
  );
};
const MARTA = REPARTO.ase;
export const BPractica: React.FC<P> = ({ pal, d }) => {
  // caída PEQUEÑA (cadera 60 px sobre la chapa 3.ª, poca cuerda) y alguien con experiencia al lado de Dani
  const f = useCurrentFrame(), fE = pal("experiencia.") ?? d - 30, i = 2, p0 = VS.cadera(VS.mos(i).y - 60);
  const s = sistemaCaida(VS, f - 18, p0, POSE.agarre, { i, xAseg: XS, dina: 1, comba: 0.2, aire: POSE.caeBien }), k = f - 18;
  return (
    <>
      <Gym cx={XS + 300} cy={VS.pie - 470} z={0.85}>
        <Asegurador via={VS} aspecto={DANI} {...s.aseg} x={XS} alza={1} cara={s.j >= 0 ? "esfuerzo" : "serio"} />
        <Persona p={{ x: XS + 190, y: VS.pie }} ang={POSE.pie} aspecto={MARTA} cara={s.j >= 4 ? "alivio" : "normal"} />
        <Soga pts={k > 0 ? s.pts : porChapas(VS, aparato(VS, XS), i + 1, p0, { comba: 30 })} />
        <Persona p={k > 0 ? s.p : p0} ang={k > 0 ? s.ang : POSE.agarreMira} aspecto={IRENE} cara={s.j >= 2 ? "alivio" : k > 0 ? "miedo" : "esfuerzo"} rot={k > 0 ? s.rot : 0} />
      </Gym>
      <Pildora t="CAÍDAS PEQUEÑAS" neutro top={1160} k={f - 6} tam={50} />
      <Pildora t="CON ALGUIEN CON EXPERIENCIA" ok top={1290} k={f - fE + 10} tam={48} />
    </>
  );
};
export const BCta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fM = pal("mándaselo") ?? d - 50, b = bucle(f, d, 12), c = { cx: XA + 300, cy: VA.pie - 560, z: 0.8 };
  return (
    <>
      <Mar {...c} f={f}>
        <Asegurador via={VA} x={XA} aspecto={DANI} alza={1} comba={0.12} cara="sopla" dy={Math.sin(f / 6) * 4} />
        <Soga pts={porChapas(VA, aparato(VA, XA), I + 1, P0, { comba: 30 })} />
        <Persona p={P0} ang={POSE.agarreMira} aspecto={IRENE} cara="normal" />
      </Mar>
      {b < 0.5 && <Grande t="¿CUÁL TE HAN HECHO?" top={1030} k={f - 2} tam={74} />}
      {b < 0.5 && <div style={{ position: "absolute", top: 1170, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>{NO.map((t, i) => <span key={t} style={{ fontFamily: F, fontWeight: 900, fontSize: 40, color: "#fff", background: COL.rojo, border: `6px solid ${COL.tinta}`, borderRadius: 26, padding: "2px 16px 6px", transform: `scale(${pop(f - 6 - i * 3)})`, whiteSpace: "nowrap" }}>✗ {t}</span>)}</div>}
      {b < 0.5 && <Envio a="quien te asegura" k={(f - fM + 4) / 8} top={1300} />}
      {b < 0.5 && <div style={{ position: "absolute", top: 1420, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(f - fM - 6)})` }}><span style={{ fontFamily: F, fontWeight: 900, fontSize: 44, color: COL.tinta, background: COL.amarillo, border: `6px solid ${COL.tinta}`, borderRadius: 26, padding: "4px 20px 8px" }}>PARTE 3 · DAR CUERDA RÁPIDO</span></div>}
      {b > 0 && <AbsoluteFill style={{ opacity: b }}><PlanoComba f={0} /></AbsoluteFill>}
    </>
  );
};
