// E80 «Lo que NO es una frenada blanda» (Caer y asegurar 2/3). Hilo: DANI ES LA CREENCIA (cada error abre con su bocadillo)
// y un MEDIDOR DE TIRÓN dice cómo de dura es cada frenada (sin cifras). Escenario propio: acantilado sobre el mar.
import React from "react";
import { Plano, crearVia, PERFILES, sistemaCaida, POSE, CADERA } from "../../piezas/kit";
import { FondoMar, Acantilado } from "./G2Decorado";
import { COL, F, pop } from "./comun";
export { IRENE, DANI, COL, F, pop, cl, c01, Grande, golpe, type P } from "./comun";

export const VA = crearVia({ perfil: PERFILES.vertical, metros: [2.4, 3.9, 5.4, 7, 8.6] });
export const XA = 330;
/** Irene se suelta 110 px por encima de la chapa I (3.ª). */
export const I = 2, P0 = VA.cadera(VA.mos(I).y - 110);
/** Plano general: Irene arriba y Dani abajo, ambos grandes y dentro del 3:4. */
export const CAMW = { cx: XA + 330, cy: (P0.y - 210 + VA.pie + 140) / 2 + 20, z: 0.98 };
/** Caída: dina 1 = acompañada (blanda), 0 = seca. comba = cuerda fuera (m). */
export const caerA = (k: number, dina: number, comba: number, xa = XA, p0 = P0, i = I) =>
  sistemaCaida(VA, k, p0, POSE.agarre, { i, xAseg: xa, dina, comba, aire: POSE.caeBien });
/** Primer fotograma (k) en que la cuerda se tensa. */
export const kTensa = (dina: number, comba: number) => Array.from({ length: 90 }, (_, k) => k).find((k) => caerA(k, dina, comba).j >= 0) ?? 20;
export const Mar: React.FC<{ cx: number; cy: number; z: number; sh?: number; f?: number; repisa?: number; aviso?: number; children: React.ReactNode }> = (p) => (
  <Plano via={VA} cx={p.cx} cy={p.cy} z={p.z} sh={p.sh} cintas={false} fondo={<FondoMar cx={p.cx} cy={p.cy} z={p.z} f={p.f} />} mundo={<Acantilado via={VA} repisa={p.repisa} aviso={p.aviso} f={p.f} />}>{p.children}</Plano>
);
/** Mundo → pantalla con la cámara (cx, cy, z). */
export const aPantalla = (x: number, y: number, c: { cx: number; cy: number; z: number }) => ({ x: 540 + (x - c.cx) * c.z, y: 960 + (y - c.cy) * c.z });
/** Cabeza de quien asegura (mundo). */
export const cabezaAseg = (x: number, dy = 0) => ({ x: x + 10, y: VA.pie + dy - CADERA - 150 });

/** Bocadillo de Dani con la CREENCIA (texto entre comillas, dos líneas). s 0–1 = aparición; cola hacia (cx, cy) de pantalla. */
export const Creencia: React.FC<{ t: string; x: number; y: number; s: number; tam?: number }> = ({ t, x, y, s, tam = 60 }) => s <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${pop(s * 12)})`, transformOrigin: "50% 100%", opacity: Math.min(1, s * 2) }}>
    <div style={{ position: "relative", background: "#FFFDF6", border: `8px solid ${COL.tinta}`, borderRadius: 44, padding: "18px 34px 22px", width: "max-content", maxWidth: 820, fontFamily: F, fontWeight: 800, fontSize: tam, lineHeight: 1.05, color: COL.tinta, textAlign: "center", whiteSpace: "pre-line", boxShadow: "0 14px 0 rgba(20,33,58,.22)" }}>
      «{t}»
      <div style={{ position: "absolute", left: 90, bottom: -40, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `40px solid ${COL.tinta}` }} />
    </div>
  </div>
);
/** Contador de creencias ✗ 1/3 → 3/3 (rojo), con su nombre. */
export const ContadorX: React.FC<{ n: number; k: number }> = ({ n, k }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 1460, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: COL.crema, border: `7px solid ${COL.tinta}`, borderRadius: 40, padding: "6px 24px" }}>
        {[1, 2, 3].map((i) => <div key={i} style={{ width: 40, height: 40, borderRadius: 20, border: `5px solid ${COL.tinta}`, background: i <= n ? COL.rojo : "#fff", color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{i <= n ? "✗" : ""}</div>)}
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 48, color: COL.tinta, marginLeft: 8, whiteSpace: "nowrap" }}>{n}/3 · {["MÁS CUERDA", "SALTAR ANTES", "BLANDA SIEMPRE"][n - 1]}</div>
      </div>
    </div>
  );
};
/** Medidor vertical de TIRÓN (sin cifras): v 0–1. `seca` marca dónde llegaría una frenada seca. */
export const Tiron: React.FC<{ v: number; o?: number; seca?: boolean }> = ({ v, o = 1, seca = true }) => {
  const H = 520, top = 640, vv = Math.max(0, Math.min(1, v)), col = vv > 0.66 ? COL.rojo : vv > 0.4 ? COL.amarillo : COL.verde;
  return o <= 0 ? null : (
    <div style={{ position: "absolute", right: 46, top, width: 120, opacity: Math.min(1, o) }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: COL.tinta, textAlign: "center", background: COL.crema, border: `5px solid ${COL.tinta}`, borderRadius: 18, marginBottom: 10 }}>TIRÓN</div>
      <div style={{ position: "relative", margin: "0 auto", width: 64, height: H, borderRadius: 32, background: "rgba(20,33,58,.18)", border: `6px solid ${COL.tinta}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${vv * 100}%`, background: col }} />
      </div>
      {seca && <div style={{ position: "absolute", left: -8, right: -8, top: 62 + H * 0.12, borderTop: `6px dashed ${COL.tinta}` }}><span style={{ position: "absolute", right: 0, top: -48, fontFamily: F, fontWeight: 900, fontSize: 26, color: COL.tinta, background: COL.crema, borderRadius: 10, padding: "0 6px" }}>SECA</span></div>}
    </div>
  );
};
/** Píldora con ✓/✗ (pantalla). */
export const Pildora: React.FC<{ t: string; ok?: boolean; top: number; k: number; tam?: number; neutro?: boolean }> = ({ t, ok, top, k, tam = 56, neutro }) => {
  const e = pop(k);
  if (e <= 0) return null;
  const bg = neutro ? COL.amarillo : ok ? COL.verde : COL.rojo, fg = neutro ? COL.tinta : "#fff";
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: tam, color: fg, background: bg, border: `8px solid ${COL.tinta}`, borderRadius: 34, padding: "4px 30px 10px", whiteSpace: "nowrap", boxShadow: "0 12px 0 rgba(20,33,58,.25)" }}>{neutro ? "" : ok ? "✓ " : "✗ "}{t}</div>
    </div>
  );
};
