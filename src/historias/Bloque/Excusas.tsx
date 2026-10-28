// La escalera de excusas (9 → 15): plano nuevo cada ~1,5 s; cada excusa con su reacción de los colegas.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Polvo, Regleta, Yema } from "../../piezas/Mano";
import { AG, Alta, Barba, Colgado, trepa, Camara, Colegas, Fondo, Hud, Planos, Svg, TU, Tu, Zoom, clamp, colgado, datosE, dePie, golpe, sentado, type P } from "./comun";
import { HORA } from "./Gancho";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pielTu = { piel: TU.piel, pielS: TU.pielSombra, manga: TU.chaqueta };
const corte = (pal: P["pal"], w: string, resp: number) => Math.max(18, (pal(w) ?? resp) - 3);

/** Plano general en el bloque, con los colegas en su momento. */
const General: React.FC<{ d: number; h: number; id: string; momento: "animan" | "sentados" | "recogen"; children?: React.ReactNode; zoom?: number }> = ({ d, h, id, momento, children, zoom = 1.3 }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.05} foco="45% 60%">
      <Svg><Zoom s={zoom} cx={440} cy={1150} tx={520} ty={1050}>
        <Fondo h={h} id={id} pads={momento === "recogen" ? 1 : 3} />
        <Colegas m={momento} f={f} />
        {children}
      </Zoom></Svg>
    </Camara>
  );
};

/** 9 · «El último»: sit start → soplas → cepillas (macro) → fuera en el mismo paso. */
export const Nueve: React.FC<P> = ({ e, d, pal }) => {
  const x = datosE(e), h = HORA[9];
  const c1 = corte(pal, "soplas,", d * 0.3), c2 = corte(pal, "cepillas...", d * 0.5), c3 = corte(pal, "fuera", d * 0.72);
  return (<>
    <Planos d={d} cortes={[c1, c2, c3]}>
      <General d={c1} h={h} id="n9" momento="animan"><Tu x={364} y={sentado()} pose="sitStart" cara="alivio" /></General>
      <Sopla d={c2 - c1} h={h} />
      <Cepilla />
      <Cae d={d - c3} h={h} />
    </Planos>
    <Hud {...x} desde={4} />
  </>);
};
const Sopla: React.FC<{ d: number; h: number }> = ({ d, h }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.1} foco="40% 45%">
      <Svg><Zoom s={2.6} cx={340} cy={1000} tx={540} ty={980}>
        <Fondo h={h} id="sop" />
        <Tu x={340} y={dePie()} pose="soplando" cara="cerrados" />
        <Polvo x={395} y={1000} k={f % 16} seed="so" n={10} />
      </Zoom></Svg>
    </Camara>
  );
};
const Cepilla: React.FC = () => {
  const f = useCurrentFrame(), x = 440 + Math.sin(f / 2.2) * 170;
  return (
    <Svg>
      <Regleta y={1150} magnesio={0.8} />
      <g transform={`translate(${x} 1070) rotate(-8) scale(5)`}><rect x={-60} y={-6} width={60} height={12} rx={6} fill="#C9A06A" stroke="#141B26" strokeWidth={1.5} /><rect x={0} y={-12} width={26} height={24} rx={4} fill="#2B3442" stroke="#141B26" strokeWidth={1.5} />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={2 + k * 5} y={12} width={3} height={8} fill="#1B2230" />)}</g>
      <Polvo x={x + 90} y={1140} k={f % 14} seed="ce" n={12} />
    </Svg>
  );
};
const Cae: React.FC<{ d: number; h: number }> = ({ d, h }) => {
  const f = useCurrentFrame();
  const c = colgado(AG.medio), k = interpolate(f, [2, 10], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <Camara d={d} empuje={0.03}>
      <Svg><Zoom s={1.5} cx={380} cy={1120} tx={520} ty={1020}><g transform={`translate(${golpe(f, 10, 10)} 0)`}>
        <Fondo h={h} id="cae" hundido={k >= 1 ? Math.max(0, 1 - (f - 10) / 10) : 0} />
        {k <= 0 ? <Colgado hx={c.x} hy={c.y} /> : <Tu x={interpolate(k, [0, 1], [c.x, 330])} y={interpolate(k, [0, 1], [c.y, sentado()])} pose={k >= 1 ? "sentadoSuelo" : "escalando"} poseB={k >= 1 ? undefined : "cayendo"} t={k} cara={k > 0.2 ? "dolor" : "esfuerzo"} angulos={k < 1 ? { piernaA: [lerp(trepa(c.x, c.y).angulos.piernaA[0], 40, k), lerp(trepa(c.x, c.y).angulos.piernaA[1], -20, k)] } : undefined} />}
        {k >= 1 && <Polvo x={330} y={1300} k={f - 10} seed="ca" />}
      </g></Zoom></Svg>
    </Camara>
  );
};

/** 12 · «Solo para mirar los pies»: yema enorme, el esparadrapo se enrolla → vuelves a probar, te animan. */
export const Doce: React.FC<P> = ({ e, d }) => {
  const x = datosE(e), c1 = Math.round(d * 0.55);
  return (<>
    <Planos d={d} cortes={[c1]}>
      <YemaPlano d={c1} estado="esparadrapo" fondo="#3A4656" anim />
      <General d={d - c1} h={HORA[12]} id="n12" momento="animan"><Tu x={364} y={sentado()} pose="sitStart" cara="esfuerzo" angulos={{ cabeza: 40 }} /></General>
    </Planos>
    <Hud {...x} />
  </>);
};

/** Una yema gigante (pieza Yema). `anim` anima el estado (cinta que se enrolla, flapper que se abre). */
export const YemaPlano: React.FC<{ d: number; estado: "esparadrapo" | "flapper" | "lijada" | "fina"; fondo: string; anim?: boolean }> = ({ d, estado, fondo, anim }) => {
  const f = useCurrentFrame();
  const k = anim ? interpolate(f, [3, Math.min(d - 4, 26)], [0, 1], { ...clamp, easing: Easing.out(estado === "flapper" ? Easing.back(2) : Easing.quad) }) : 1;
  return (
    <Camara d={d} empuje={0.1} sacudida={estado === "flapper" && f < 12 ? 3 : 0} foco="50% 40%">
      <Svg>
        <rect width={1080} height={1920} fill={fondo} />
        <Yema {...pielTu} x={540} y={760} s={1.25} rot={-4} estado={estado} cinta={estado === "esparadrapo" ? k : 1} abre={estado === "flapper" ? k : 0} magnesio={0.35} />
      </Svg>
    </Camara>
  );
};

/** 14 · plátano y nueces: la colega te los da → te comes el plátano con cara de «ahora sí». */
export const Platano: React.FC<P> = ({ e, d }) => {
  const x = datosE(e), c1 = Math.round(d * 0.5), h = HORA[14];
  return (<>
    <Planos d={d} cortes={[c1]}>
      <Camara d={c1} empuje={0.06} foco="40% 55%">
        <Svg><Zoom s={2} cx={380} cy={1080} tx={540} ty={1000}>
          <Fondo h={h} id="pl1" />
          <Alta x={230} y={dePie(1.3)} pose="senalando" objeto="nueces" cara="alivio" />
          <Tu x={500} y={dePie()} mira={-1} pose="senalando" objeto="platano" cara="alivio" angulos={{ brazoA: [100, 120] }} />
        </Zoom></Svg>
      </Camara>
      <Camara d={d - c1} empuje={0.1} foco="45% 45%">
        <Svg><Zoom s={3} cx={360} cy={1000} tx={540} ty={1000}>
          <Fondo h={h} id="pl2" />
          <Tu x={360} y={dePie()} pose="soplando" objeto="platano" cara="esfuerzo" angulos={{ brazoB: [-10, -4] }} />
        </Zoom></Svg>
      </Camara>
    </Planos>
    <Hud {...x} />
  </>);
};

/** 15 · «Desde el paso, que no cuenta»: sale desde el paso clave, se corta al llegar al labio; los colegas, ya sentados, aplauden. */
export const Quince: React.FC<P> = ({ e, d, pal }) => {
  const x = datosE(e), tS = pal("sale.") ?? Math.round(d * 0.5), c1 = Math.max(20, tS - 18), c2 = tS + 10, h = HORA[15];
  return (<>
    <Planos d={d} cortes={[c1, c2]}>
      <Paso d={c1} h={h} k0={0} k1={0.35} />
      <Paso d={c2 - c1} h={h} k0={0.35} k1={1} cerca />
      <General d={d - c2} h={h} id="q15" momento="sentados" zoom={1.6} />
    </Planos>
    <Hud {...x} />
  </>);
};
const Paso: React.FC<{ d: number; h: number; k0: number; k1: number; cerca?: boolean }> = ({ d, h, k0, k1, cerca }) => {
  const f = useCurrentFrame(), k = interpolate(f, [0, d], [k0, k1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const a = colgado(AG.crux), b = colgado(AG.labio);
  const px = a.x + (b.x - a.x) * k, py = a.y + (b.y - a.y) * k;
  return (
    <Camara d={d} empuje={0.06}>
      <Svg><Zoom s={cerca ? 2.3 : 1.6} cx={px + 30} cy={py - 140} tx={540} ty={cerca ? 1000 : 1050}>
        <Fondo h={h} id={cerca ? "pa2" : "pa1"} />
        {!cerca && <Barba x={720} y={sentado()} pose="sentadoSuelo" mira={-1} cara="normal" />}
        <Colgado hx={px} hy={py} cara={k > 0.9 ? "alivio" : "esfuerzo"} />
      </Zoom></Svg>
    </Camara>
  );
};
