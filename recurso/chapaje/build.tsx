// Test «Vas de primero, vas petado. ¿Chapas bien?» · genera recurso/chapaje/index.html (una sola página, sin dependencias).
process.on("unhandledRejection", () => {}); // loadFont de Remotion intenta bajar fuentes al importar: aquí no hace falta
// Las escenas salen del kit de Remotion (mismos personajes, muro, cintas y cuerda que E59/E64/E72) renderizadas a SVG estático.
// Uso: npm run test-chapaje  ·  Textos y reglas: escenas.ts  ·  Respaldo y pendientes: ficha.md
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "fs";
import path from "path";
import { crearVia, PERFILES, Persona, Asegurador, Soga, porChapas, aparato, POSE, pAgarra, accChapar, sogaChapar, nudo, boca, mix, REPARTO, Diente, type Pt, type Angulos, type Via } from "../../src/piezas/kit";
import { MuroClaro } from "../../src/historias/Miedo/comun";
import { CintaF, ParedCerca, CuerdaM, abajoDe, type CintaP } from "../../src/historias/Cinta/Macro";
import { ESCENAS, CHULETA } from "./escenas";

const R = (el: React.ReactElement) => renderToStaticMarkup(el);
const ROJO = "#D8432F", VERDE = "#1F8A50";
const T = ({ x, y, c = "#0B1624", s = 46, a = "middle", children }: { x: number; y: number; c?: string; s?: number; a?: string; children: string }) =>
  <text x={x} y={y} fill={c} fontSize={s} textAnchor={a as "middle"} className="rot" stroke="#fff" strokeWidth={s * 0.22} paintOrder="stroke">{children}</text>;
const S = ({ vb, children }: { vb: string; children: React.ReactNode }) => <svg viewBox={vb} xmlns="http://www.w3.org/2000/svg" role="img">{children}</svg>;

/* ---------- vista lateral: rocódromo claro (E72), chapas como en E59: 3 m, 4,5 m, 6 m ---------- */
const V = crearVia({ perfil: PERFILES.panel, metros: [3, 4.5, 6, 7.5] });
const AX = 230, AP = aparato(V, AX), ELLA = REPARTO.ella;
const Lado = ({ vb, children, via = V, ase = true }: { vb: string; children: React.ReactNode; via?: Via; ase?: boolean }) => (
  <S vb={vb}><rect x={-1000} y={-1000} width={4000} height={6000} fill="#EAF1F6" /><MuroClaro via={via} />
    {ase && <Asegurador via={via} x={AX} cuerda={false} aspecto={REPARTO.el} quien="simon" alza={1} />}{children}</S>
);
const Escala = ({ p, ang, cara = "esfuerzo", pts }: { p: Pt; ang: Angulos; cara?: string; pts: Pt[] }) =>
  <g><Persona p={p} ang={ang} aspecto={ELLA} cara={cara as "esfuerzo"} /><Soga pts={pts} /></g>;
const Fantasma = ({ p, dy }: { p: Pt; dy: number }) => (
  <g><path d={`M${p.x - 60} ${p.y} V${p.y + dy}`} stroke={ROJO} strokeWidth={10} strokeDasharray="26 18" /><path d={`M${p.x - 84} ${p.y + dy - 40} L${p.x - 60} ${p.y + dy} L${p.x - 36} ${p.y + dy - 40}`} stroke={ROJO} strokeWidth={10} fill="none" />
    <Persona p={{ x: p.x - 20, y: p.y + dy }} ang={POSE.cae} aspecto={REPARTO.fantasma} cara="miedo" o={0.55} /><T x={p.x - 140} y={p.y + dy / 2} c={ROJO} s={54}>3 m</T></g>
);
const chapando = (dy: number, i: number) => { const p = V.cadera(V.mos(i).y + dy), a = accChapar(V, p, i, 0.5); return { p, a, pts: sogaChapar(V, AP, i, p, a) }; };
const estirada = chapando(215, 1), cintura = chapando(50, 1);
const conComba = { p: cintura.p, pts: porChapas(V, AP, 1, cintura.p, { floja: 420 }) };
const vb1 = `110 ${V.mos(1).y - 260} 800 ${V.suelo + 50 - (V.mos(1).y - 260)}`;
const enBoca = (() => { const { p, a } = estirada, b = boca(a.ang), pts = porChapas(V, AP, 1, p); return [...pts.slice(0, -1), { x: p.x + b.x, y: p.y + b.y, sx: -20 }, { ...nudo(p), sag: 14 }]; })();

/* escena 2: chapas juntas (cada metro); la última cinta, a la altura de la cadera: los dos tramos quedan a mano */
const V2 = crearVia({ perfil: PERFILES.panel, metros: [2.2, 3.6, 4.6, 5.6] }), AP2 = aparato(V2, AX);
const p2 = V2.cadera(V2.mos(1).y - 20), n2 = nudo(p2), m0 = V2.mos(0), m1 = V2.mos(1);
const toque = (op: number, d: string) => <path data-op={op} className="hot" d={d} stroke="transparent" strokeWidth={110} strokeLinecap="round" fill="none" />;
/* escena 9: tres cintas chapadas, resbala justo encima de la tercera */
const p9 = V.cadera(V.mos(2).y - 20), p9b = { x: p9.x - 14, y: p9.y + 70 }, m2 = V.mos(2);

/* ---------- primer plano de frente (E64): pared, cintas y cuerda gruesa ---------- */
const Detras = ({ d }: { d: string }) => <g><CuerdaM d={d} /><path d={d} stroke="#050B14" strokeWidth={52} fill="none" strokeLinecap="round" opacity={0.32} /></g>;
const Frente = ({ vb, children }: { vb: string; children: React.ReactNode }) => <S vb={vb}><rect x={-2000} y={-2000} width={6000} height={6000} fill="#D9C9AE" /><ParedCerca seed="test" />{children}</S>;
// Recorrido de E64: al asegurador (abajo, por detrás) y a tu arnés (arriba a la derecha).
const tramos = (c: CintaP) => { const ab = abajoDe(c), th = (-58 * Math.PI) / 180; return {
  ab, ase: `M${ab.x - 170} ${ab.y + 1100} Q${ab.x - 120} ${ab.y + 420} ${ab.x - 4} ${ab.y + 44}`,
  arnes: `M${ab.x - 4} ${ab.y + 44} Q${ab.x + 60} ${ab.y - 40} ${ab.x + 30 + Math.cos(th) * 1150} ${ab.y + 30 + Math.sin(th) * 1150}` }; };
const cintaBien = (c: CintaP, back = false) => { const t = tramos(c); return <g>{back ? <Detras d={t.arnes} /> : <Detras d={t.ase} />}<CintaF {...c} />{back ? <CuerdaM d={t.ase} /> : <CuerdaM d={t.arnes} />}</g>; };

// Escena 3 · Z-clip: dos cintas en zigzag; la cuerda del asegurador sube a la de ARRIBA, baja a la de abajo y vuelve a subir.
const cA = { x: 760, y: 0, s: 0.55, puerta: "izq" as const }, cB = { x: 380, y: 760, s: 0.55, puerta: "izq" as const };
const a = abajoDe(cA), b = abajoDe(cB), w3 = 26, suelo3 = { x: 300, y: 2050 }, ti = { x: 940, y: -700 };
const Z = (zeta: boolean) => (
  <Frente vb="0 -700 1100 2750">
    {zeta ? <>
      <path d={`M${suelo3.x} ${suelo3.y} Q${b.x + 180} ${b.y + 400} ${a.x - 6} ${a.y + 30}`} stroke="#050B14" strokeWidth={w3 + 22} fill="none" opacity={0.25} />
      <CuerdaM w={w3} d={`M${suelo3.x} ${suelo3.y} Q${b.x + 180} ${b.y + 400} ${a.x - 6} ${a.y + 30}`} />
      <CintaF {...cB} /><CintaF {...cA} />
      <CuerdaM w={w3} d={`M${a.x - 6} ${a.y + 30} Q${(a.x + b.x) / 2 + 60} ${(a.y + b.y) / 2} ${b.x - 6} ${b.y + 30}`} />
      <CuerdaM w={w3} d={`M${b.x - 6} ${b.y + 30} Q${b.x + 120} ${b.y - 500} ${ti.x} ${ti.y}`} />
      <T x={560} y={1500} c={ROJO} s={110}>Z</T>
    </> : <>
      <Detras d={`M${suelo3.x} ${suelo3.y} Q${b.x - 60} ${b.y + 500} ${b.x - 6} ${b.y + 30}`} />
      <CintaF {...cB} />
      <CuerdaM w={w3} d={`M${b.x - 6} ${b.y + 30} Q${b.x + 140} ${b.y - 200} ${a.x - 6} ${a.y + 30}`} />
      <CintaF {...cA} />
      <CuerdaM w={w3} d={`M${a.x - 6} ${a.y + 30} Q${a.x + 120} ${a.y - 200} ${ti.x} ${ti.y}`} />
    </>}
    <T x={ti.x - 130} y={ti.y + 120} s={64}>A TU ARNÉS ↑</T><T x={b.x - 40} y={b.y + 300} s={52}>CINTA ANTERIOR</T><T x={a.x - 170} y={a.y - 470} s={52}>LA QUE ACABAS DE CHAPAR</T><T x={suelo3.x + 40} y={suelo3.y - 60} s={64}>AL ASEGURADOR ↓</T>
  </Frente>
);

// Escena 4 · back-clip (geometría de E64). Dos paneles; el de la derecha es el back-clip.
// La cuerda sale hacia arriba a la derecha → puerta a la izquierda (misma regla que la escena 5).
const c4 = { x: 470, y: -150, puerta: "izq" as const, giro: -6 }, t4 = tramos(c4);
const panel4 = (back: boolean, op: number, dx: number) => (
  <g transform={`translate(${dx} 0)`}><g>{cintaBien(c4, back)}</g>
    <rect data-op={op} className="hot box" x={t4.ab.x - 330} y={t4.ab.y - 680} width={760} height={1160} rx={40} fill="transparent" stroke="transparent" strokeWidth={24} /></g>
);
const S4 = <Frente vb={`${t4.ab.x - 350} ${t4.ab.y - 700} 1640 1200`}><defs><clipPath id="c4"><rect x={t4.ab.x - 350} y={t4.ab.y - 700} width={800} height={1200} /></clipPath></defs>
  <g clipPath="url(#c4)">{panel4(false, 0, 0)}</g><g transform="translate(840 0)"><g clipPath="url(#c4)">{panel4(true, 1, 0)}</g></g>
  <rect x={t4.ab.x + 450} y={t4.ab.y - 700} width={40} height={1200} fill="#FFFDF8" />
  <T x={t4.ab.x - 260} y={t4.ab.y + 440} s={96}>A</T><T x={t4.ab.x + 580} y={t4.ab.y + 440} s={96}>B</T></Frente>;

// Escena 5 · puerta: la vía sigue a la derecha (siguiente chapa arriba a la derecha).
const c5 = (puerta: "izq" | "der") => ({ x: 470, y: -150, puerta, giro: -6 });
const t5 = tramos(c5("izq"));
const S5 = (puerta: "izq" | "der") => (
  <Frente vb={`${t5.ab.x - 520} ${t5.ab.y - 1060} 1160 1500`}>
    <path d={`M${t5.ab.x + 120} ${t5.ab.y - 760} L${t5.ab.x + 520} ${t5.ab.y - 980}`} stroke="#0B1624" strokeWidth={16} strokeDasharray="34 26" />
    <path d={`M${t5.ab.x + 470} ${t5.ab.y - 1010} L${t5.ab.x + 530} ${t5.ab.y - 982} L${t5.ab.x + 478} ${t5.ab.y - 940}`} stroke="#0B1624" strokeWidth={16} fill="none" />
    <T x={t5.ab.x - 170} y={t5.ab.y - 930} s={58}>LA VÍA SIGUE ↗</T>
    <g className="gira">{cintaBien(c5(puerta))}</g>
  </Frente>
);

// Escena 6 · goma: A bien (goma abajo, en el de la cuerda) · B del revés (goma arriba, en el de la chapa).
const c6 = { x: 300, y: 0, s: 1, puerta: "izq" as const }, b6 = abajoDe(c6);
// Goma igual de visible en las dos: abajo (en el de la cuerda) o arriba (en el de la chapa).
const goma = (x: number, y: number, arriba: boolean) => { const gy = y + (arriba ? 580 - 418 : 580 - 128); return <g><rect x={x - 18 - 40} y={gy} width={80} height={52} rx={12} fill="#15181E" stroke="#0B1624" strokeWidth={6} /><rect x={x - 18 - 30} y={gy + 8} width={60} height={8} rx={4} fill="#3A3F48" /></g>; };
const S6 = <Frente vb={`-40 -160 1340 ${b6.y + 420}`}>
  <g><CintaF {...c6} />{goma(c6.x, c6.y, false)}<rect data-op={0} className="hot box" x={20} y={-140} width={560} height={b6.y + 300} rx={36} fill="transparent" stroke="transparent" strokeWidth={20} /></g>
  <g transform="translate(680 0)"><CintaF {...c6} alReves />{goma(c6.x, c6.y, true)}<rect data-op={1} className="hot box" x={20} y={-140} width={560} height={b6.y + 300} rx={36} fill="transparent" stroke="transparent" strokeWidth={20} /></g>
  <T x={300} y={b6.y + 200} s={96}>A</T><T x={980} y={b6.y + 200} s={96}>B</T></Frente>;

// Escena 8 · la puerta abierta mientras entra la cuerda; la zona de atrapamiento.
const c8 = { x: 470, y: -150, puerta: "izq" as const, giro: -6, abreAbajo: 0.7 }, t8 = tramos(c8);
// Una sola cuerda: sube de quien asegura (por la cinta de abajo), entra en bucle por la puerta abierta y baja a tu arnés.
const S8 = <Frente vb={`${t8.ab.x - 560} ${t8.ab.y - 700} 1200 1500`}>
  <CintaF {...c8} />
  <CuerdaM d={`M${t8.ab.x - 300} ${t8.ab.y + 820} Q${t8.ab.x - 260} ${t8.ab.y + 300} ${t8.ab.x - 70} ${t8.ab.y + 40} Q${t8.ab.x + 40} ${t8.ab.y - 40} ${t8.ab.x + 110} ${t8.ab.y + 120} Q${t8.ab.x + 200} ${t8.ab.y + 420} ${t8.ab.x + 330} ${t8.ab.y + 820}`} />
  <T x={t8.ab.x - 300} y={t8.ab.y + 760} s={50}>A QUIEN ASEGURA ↓</T><T x={t8.ab.x + 320} y={t8.ab.y + 700} s={50}>A TU ARNÉS ↓</T>
</Frente>;

/* ---------- escenas: base (pregunta), bien y mal (consecuencia) ---------- */
const svgs: Record<number, { base: string; bien?: string; mal?: string; mal1?: string; base2?: string }> = {
  1: { base: R(<Lado vb={vb1}><Escala p={estirada.p} ang={estirada.a.ang} pts={estirada.pts} /></Lado>),
    mal: R(<Lado vb={vb1}><Escala p={estirada.p} ang={estirada.a.ang} pts={estirada.pts} /><Fantasma p={estirada.p} dy={510} /></Lado>),
    mal1: R(<Lado vb={vb1}><Escala p={conComba.p} ang={POSE.agarreMira} pts={conComba.pts} /><T x={conComba.p.x - 150} y={conComba.p.y + 290} c={ROJO} s={46}>CUERDA FUERA</T></Lado>),
    bien: R(<Lado vb={vb1}><Escala p={cintura.p} ang={cintura.a.ang} pts={cintura.pts} /><Fantasma p={cintura.p} dy={510} /></Lado>) },
  2: { base: R(<Lado via={V2} ase={false} vb={`200 ${V2.mos(2).y - 260} 700 ${m0.y + 200 - (V2.mos(2).y - 260)}`}><Escala p={p2} ang={POSE.agarreMira} pts={porChapas(V2, AP2, 2, p2)} />
    {toque(0, `M${m1.x} ${m1.y + 30} L${n2.x} ${n2.y}`)}{toque(1, `M${m0.x} ${m0.y + 60} L${m1.x} ${m1.y + 40}`)}</Lado>) },
  3: { base: R(Z(true)), mal: R(Z(true)), bien: R(Z(false)) },
  4: { base: R(S4) },
  5: { base: R(S5("der")), base2: R(S5("izq")) },
  6: { base: R(S6) },
  7: { base: R(<Lado vb={vb1}><Escala p={estirada.p} ang={estirada.a.ang} pts={estirada.pts} /></Lado>),
    mal: R(<Lado vb={vb1}><Escala p={estirada.p} ang={estirada.a.ang} cara="dolor" pts={enBoca} /><circle cx={estirada.p.x + boca(estirada.a.ang).x} cy={estirada.p.y + boca(estirada.a.ang).y} r={44} fill="none" stroke={ROJO} strokeWidth={10} /><g className="diente"><Diente x={estirada.p.x + boca(estirada.a.ang).x} y={estirada.p.y + boca(estirada.a.ang).y} k={7} /></g></Lado>),
    bien: R(<Lado vb={vb1}><Escala p={cintura.p} ang={cintura.a.ang} pts={cintura.pts} /></Lado>) },
  8: { base: R(S8) },
  9: { base: R(<Lado vb={`200 ${m2.y - 420} 720 900`}><Escala p={p9} ang={mix(POSE.agarreMira, POSE.cae, 0.6)} cara="miedo" pts={porChapas(V, AP, 3, p9)} /></Lado>),
    mal: R(<Lado vb={`200 ${m2.y - 420} 720 900`}><Escala p={p9b} ang={pAgarra(p9b, m2)} cara="miedo" pts={porChapas(V, AP, 3, p9b)} /><circle cx={m2.x} cy={m2.y} r={58} fill="none" stroke={ROJO} strokeWidth={10} /></Lado>),
    bien: R(<Lado vb={`200 ${m2.y - 420} 720 900`}><Escala p={p9b} ang={POSE.caeBien} cara="miedo" pts={porChapas(V, AP, 3, p9b)} /></Lado>) },
};

const dir = path.dirname(new URL(import.meta.url).pathname);
const raiz = path.resolve(dir, "../..");
const fuente = (f: string) => fs.readFileSync(path.join(raiz, "public/fuentes", f)).toString("base64");
const ff = `@font-face{font-family:B;font-weight:800;src:url(data:font/woff2;base64,${fuente("bricolage-grotesque-latin-800-normal.woff2")}) format("woff2")}
@font-face{font-family:F;font-weight:500;src:url(data:font/woff2;base64,${fuente("figtree-latin-500-normal.woff2")}) format("woff2")}
@font-face{font-family:F;font-weight:700;src:url(data:font/woff2;base64,${fuente("figtree-latin-700-normal.woff2")}) format("woff2")}`;
const datos = ESCENAS.map((e) => ({ ...e, svg: svgs[e.n] }));
const html = fs.readFileSync(path.join(dir, "plantilla.html"), "utf8")
  .replace("/*FUENTES*/", ff)
  .replace("/*DATOS*/", `const ESCENAS=${JSON.stringify(datos)};const CHULETA=${JSON.stringify(CHULETA)};const FF=${JSON.stringify(ff)};`);
fs.writeFileSync(path.join(dir, "index.html"), html);
console.log(`index.html · ${(html.length / 1024).toFixed(0)} KB`);
