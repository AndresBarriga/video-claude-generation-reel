// E79 · promesa «en cada situación te tienen que frenar distinto»: cuatro viñetas (desplome · vertical · repisa · placa),
// cada una con su caída escalonada (~1 s), y la tarjeta para guardar del final (2,5 s fija, dentro del 3:4).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, type Via } from "../../piezas/kit";
import { Pared, VD, VV, VP, IRENE, DANI, caer, Repisa, Contador, Grande, COL, F, pop, type P } from "./comun";
import { PR, REP } from "./Vertical";

type V = { via: Via; xa: number; i: number; dy: number; rep?: boolean; t: string; cx: number; cy: number };
export const VIÑ: V[] = [
  { via: VD, xa: 1180, i: 3, dy: -110, t: "DESPLOME", cx: 600, cy: VD.mos(3).y + 280 },
  { via: VV, xa: 330, i: 3, dy: -110, t: "VERTICAL", cx: 560, cy: VV.mos(3).y + 280 },
  { via: VV, xa: 330, i: 2, dy: -110, rep: true, t: "REPISA", cx: 520, cy: 1950 },
  { via: VP, xa: 360, i: 3, dy: -90, t: "PLACA", cx: 620, cy: VP.mos(3).y + 300 },
];
export const Mini: React.FC<{ v: V; k: number }> = ({ v, k }) => {
  const p0 = v.rep ? PR : v.via.cadera(v.via.mos(v.i).y + v.dy), s = caer(v.via, v.xa, k, p0, v.i, 1, 0.3);
  const p = v.rep && s.p.y > REP - 114 ? { x: s.p.x, y: REP - 114 } : s.p, z = v.rep ? 1.25 : 1.7;
  return (
    <Pared via={v.via} cx={p0.x + 90} cy={p0.y + (v.rep ? 420 : 260)} z={z}>
      {v.rep && <Repisa via={v.via} y={REP} />}
      <Asegurador via={v.via} aspecto={DANI} {...s.aseg} alza={1} />
      <Soga pts={s.pts} />
      <Persona p={k <= 0 ? p0 : p} ang={k <= 0 ? POSE.agarreMira : s.ang} aspecto={IRENE} cara={s.j < 0 ? "miedo" : "alivio"} rot={s.rot} />
    </Pared>
  );
};
const W = 455, H = 560, S = W / 1080;
export const Cuatro: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#E8F2FC" }} />
      {VIÑ.map((v, i) => {
        const e = pop(f - i * 4), x = 65 + (i % 2) * (W + 40), y = 300 + Math.floor(i / 2) * (H + 40);
        return e > 0 && (
          <div key={v.t} style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: `scale(${e})`, borderRadius: 34, overflow: "hidden", border: `8px solid ${COL.tinta}`, boxShadow: "0 12px 0 rgba(20,33,58,.25)" }}>
            <div style={{ position: "absolute", left: 0, top: -(1920 * S - H) / 2, width: 1080, height: 1920, transform: `scale(${S})`, transformOrigin: "0 0" }}><Mini v={v} k={f - 10 - i * 18} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center" }}><span style={{ fontFamily: F, fontWeight: 900, fontSize: 46, color: COL.tinta, background: COL.crema, border: `5px solid ${COL.tinta}`, borderRadius: 22, padding: "2px 18px" }}>{v.t}</span></div>
          </div>
        );
      })}
      <Contador n={1} k={f - d + 22} />
    </>
  );
};
const FILAS: [string, string, string, string][] = [
  ["DESPLOME", "BLANDA", "", COL.verde],
  ["VERTICAL ALTO", "BLANDA", "", COL.verde],
  ["REPISA O 1.ªS CHAPAS", "CORTA", "poca cuerda, sin tirón", COL.menta],
  ["PLACA", "JUSTA", "", COL.azul],
];
export const Tarjeta: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#E8F2FC" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 330, bottom: 470, background: COL.crema, border: `9px solid ${COL.tinta}`, borderRadius: 48, boxShadow: "0 18px 0 rgba(20,33,58,.25)", transform: `scale(${pop(f)})`, padding: "44px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 92, color: COL.tinta, textAlign: "center", lineHeight: 1 }}>¿CÓMO TE FRENAN?<div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 40, color: "#5A6478", marginTop: 12 }}>Díselo antes de empezar la vía</div></div>
                {FILAS.map(([a, b, c, col], i) => (
          <div key={a} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: i ? "4px dashed #D8CFC1" : "none", paddingTop: i ? 30 : 0, opacity: pop(f - 3 - i * 3) > 0 ? 1 : 0 }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 58, color: COL.tinta, lineHeight: 1.05, maxWidth: 520 }}>{a}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F, fontWeight: 900, fontSize: 72, color: "#fff", background: col, border: `6px solid ${COL.tinta}`, borderRadius: 26, padding: "0 22px 4px", display: "inline-block" }}>{b}</div>
              {c && <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 36, color: COL.tinta, marginTop: 8 }}>{c}</div>}
            </div>
          </div>
        ))}
      </div>
      {void Grande}
    </>
  );
};
