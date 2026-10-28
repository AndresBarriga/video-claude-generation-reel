// Las 12 escenas de E30, todas sobre el mismo plano de vía (Via.tsx) con distinta cámara, estado y globos.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Globo, REPARTO, type P } from "./comun";
import { GRUPO, HX, HY, Via, cabezaDe, type Quien } from "./Via";

type Z = { s: number; cx: number; cy: number; tx: number; ty: number };
const pant = (z: Z | undefined, q: Quien) => { const c = cabezaDe(q); return z ? { x: z.tx + (c.x - z.cx) * z.s, y: z.ty + (c.y - z.cy) * z.s } : c; };
const zq = (q: Quien, s = 2.2): Z => ({ s, cx: GRUPO[q], cy: 1150, tx: 470, ty: 1080 });
const BETAS: [Quien, string][] = [["veterano", "Talón dentro"], ["nuevo", "Talón fuera"], ["animador", "¡No pienses en los pies!"]];
const ALTO: Record<string, number> = { veterano: 560, nuevo: 400, animador: 240 };
const yoMismo = { angulos: { brazoA: [40, -150] as [number, number] }, cara: "alivio" as const };

// Globos alrededor de ti (plano general con zoom ZG); el color dice quién lo dice.
const ZG: Z = { s: 1.25, cx: 480, cy: 900, tx: 540, ty: 900 };
const SITIO: [number, number][] = [[330, 470], [300, 720], [470, 270]];
const Tres: React.FC<{ extra?: number; o?: number }> = ({ extra = 0, o = 1 }) => (
  <>
    {BETAS.map(([q, t], i) => <Globo key={q} texto={t} x={SITIO[i][0]} y={SITIO[i][1]} col={REPARTO[q].col} dy={36} ancho={360} tam={52} o={o} />)}
    {Array.from({ length: extra }).map((_, i) => { const [q, t] = BETAS[i % 3]; return <Globo key={i} texto={t} x={200 + ((i * 230) % 640)} y={330 + ((i * 170) % 620)} col={REPARTO[q].col} dy={30} ancho={330} tam={46} desde={i * 3} />; })}
  </>
);

const General: React.FC<{ d: number; children?: React.ReactNode; cara?: "esfuerzo" | "miedo" }> = ({ d, children, cara = "esfuerzo" }) => (
  <Camara d={d} empuje={0.04} foco="60% 40%"><Via estado="paso" cara={cara} zoom={ZG} grupo={{ veterano: { angulos: { brazoA: [150, 160] } }, nuevo: { angulos: { brazoA: [110, 150] } }, animador: { pose: "celebrando", cara: "alivio" } }} />{children}</Camara>
);

const Primer: React.FC<{ d: number; q: Quien; texto: string; grupo?: object }> = ({ d, q, texto, grupo }) => {
  const z = zq(q), p = pant(z, q);
  return (
    <Camara d={d} empuje={0.06} foco="45% 55%">
      <Via estado="paso" zoom={z} grupo={grupo as never} />
      <Globo texto={texto} x={p.x} y={p.y} col={REPARTO[q].col} dy={60} ancho={520} tam={70} desde={2} />
    </Camara>
  );
};

export const ESCENAS: Record<string, React.FC<P>> = {
  globos: ({ d }) => <General d={d}><Tres /></General>,
  veterano: ({ d }) => <Primer d={d} q="veterano" texto="Talón dentro." grupo={{ veterano: { angulos: { brazoA: [150, 160] } } }} />,
  nuevo: ({ d }) => <Primer d={d} q="nuevo" texto="Talón fuera." grupo={{ nuevo: { angulos: { brazoA: [110, 150] } } }} />,
  animador: ({ d }) => <Primer d={d} q="animador" texto="¡No pienses en los pies!" grupo={{ animador: { pose: "celebrando", cara: "alivio" } }} />,
  monton: ({ d }) => <General d={d} cara="miedo"><Tres extra={6} /></General>,
  caida: ({ d }) => {
    const f = useCurrentFrame();
    return <Camara d={d} empuje={0.05} sacudida={f > 4 && f < 12 ? 7 : 0}><Via estado="cae" t={f / 10} cara="miedo" zoom={{ s: 1.9, cx: HX + 20, cy: HY + 20, tx: 540, ty: 700 }} /></Camara>;
  },
  yatelodije: ({ d, pal }) => {
    const z: Z = { s: 1.7, cx: 320, cy: 1150, tx: 540, ty: 1110 };
    const ts = [0, pal("Ya") ?? 0, 0]; const ya = [2, Math.round(d * 0.33), Math.round(d * 0.66)];
    const txt = ["Ya te lo dije: talón dentro", "Ya te lo dije: talón fuera", "Ya te lo dije: ¡los pies!"];
    return (
      <Camara d={d} empuje={0.04}>
        <Via estado="colgado" cara="dolor" zoom={z} grupo={{ veterano: { cara: "alivio" }, nuevo: { cara: "alivio" }, animador: { cara: "alivio" } }} />
        {BETAS.map(([q], i) => { const p = pant(z, q); return <Globo key={q} texto={txt[i]} x={p.x} y={p.y} col={REPARTO[q].col} dy={60 + 150 * (i % 2)} ancho={330} tam={44} desde={ya[i] + ts[0]} />; })}
      </Camara>
    );
  },
  segundo: ({ d }) => {
    const f = useCurrentFrame(), o = interpolate(f, [0, d * 0.6], [0.5, 0], { extrapolateRight: "clamp" });
    return <Camara d={d} empuje={0.05}><Via estado="sube" cara={f < d * 0.4 ? "cerrados" : "esfuerzo"} zoom={{ s: 1.3, cx: HX + 40, cy: HY - 40, tx: 540, ty: 900 }} /><div style={{ opacity: o }}><Tres /></div></Camara>;
  },
  encadena: ({ d }) => <Camara d={d} empuje={0.06}><Via estado="arriba" cara="alivio" zoom={{ s: 1.4, cx: HX + 60, cy: HY - 420, tx: 540, ty: 860 }} /></Camara>,
  mibeta: ({ d }) => {
    const z: Z = { s: 1.7, cx: 320, cy: 1150, tx: 540, ty: 1110 };
    return (
      <Camara d={d} empuje={0.04}>
        <Via estado="arriba" zoom={z} grupo={{ veterano: yoMismo, nuevo: yoMismo, animador: yoMismo }} />
        {BETAS.map(([q], i) => { const p = pant(z, q); return <Globo key={q} texto="¿Ves? Mi beta." x={p.x} y={p.y} col={REPARTO[q].col} dy={60 + 150 * (i % 2)} ancho={300} tam={50} desde={2} />; })}
      </Camara>
    );
  },
  pareja: ({ d, pal }) => {
    const f = useCurrentFrame(), corte = (pal("yo") ?? Math.round(d * 0.55)) - 3;
    const mirando = { cara: "normal" as const, angulos: { cabeza: 10 } };
    if (f < corte) return <General d={corte}>{null}</General>;
    const z = zq("pareja", 2.4), p = pant(z, "pareja");
    return (
      <Camara d={d - corte} empuje={0.06}>
        <Via estado="arriba" zoom={z} grupo={{ pareja: { cara: "alivio" }, animador: mirando }} />
        <Globo texto="Yo no he dicho nada." x={p.x} y={p.y} col={REPARTO.pareja.col} dy={60} ancho={520} tam={66} desde={2} />
      </Camara>
    );
  },
  envio: ({ d }) => <General d={d}><Tres /></General>,
};
