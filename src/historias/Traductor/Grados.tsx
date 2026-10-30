// 6 · «A mí los grados me dan igual.» (Paco, zen) → ya ha pedido que se lo suban (pantalla de la app: propuesta de grado 6C → 7A, enviada).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PantallaMovil } from "../../piezas/Movil";
import { fuenteTexto, fuenteTitulo } from "../../tema";
import { C, Camara, Cerca, Paco, Partida, Planos, Svg, Zoom, clamp, type P } from "./comun";
import { Rocodromo, dePieR } from "../../piezas/Rocodromo";

export const Grados: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => { const c = Math.round(d * 0.62); return <Planos d={d} cortes={[c]}><App d={c} /><CaraPaco d={d - c} /></Planos>; }} />;

const CaraPaco: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.1} entrada={false}><Svg><Cerca cx={656} cy={dePieR(1.25) - 175} s={3.4}>
    <Rocodromo />
    <Paco x={660} y={dePieR(1.25)} pose="grabando" objeto="movil" mira={-1} cara="alivio" angulos={{ cabeza: 14 }} />
  </Cerca></Svg></Camara>
);

const Dice: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.05}>
    <Svg><Zoom s={3.2} cx={656} cy={dePieR(1.25) - 175} tx={540} ty={860}>
      <Rocodromo />
      <Paco x={660} y={dePieR(1.25)} pose="pie" mira={-1} cara="cerrados" angulos={{ brazoA: [60, 110], brazoB: [50, 120], cabeza: -6 }} />
    </Zoom></Svg>
  </Camara>
);

const App: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 8], [0.7, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const env = f > d * 0.55; // «enviada» llega a mitad
  const tx = { fontFamily: fuenteTexto, fontWeight: 700 };
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#0B1624" />
        <PantallaMovil id="app" x={540} y={900} s={k * 1.18} pct={64} rec={false}>
          <rect width={560} height={1040} fill="#F4F2EE" />
          <rect width={560} height={150} fill="#2F4A7A" />
          <text x={40} y={115} fill="#fff" fontSize={34} {...tx}>Proponer grado</text>
          <text x={40} y={230} fill="#3B3F4A" fontSize={30} {...tx}>Tu valoración</text>
          <text x={280} y={470} textAnchor="middle" fill="#9AA0A8" fontSize={120} fontFamily={fuenteTitulo} fontWeight={800} textDecoration="line-through">6C</text>
          <text x={280} y={560} textAnchor="middle" fill="#3B3F4A" fontSize={64} {...tx}>↓</text>
          <text x={280} y={740} textAnchor="middle" fill={C.cuerda} fontSize={190} fontFamily={fuenteTitulo} fontWeight={800}>7A</text>
          <rect x={60} y={840} width={440} height={110} rx={24} fill={env ? "#3E9B63" : "#2F4A7A"} />
          <text x={280} y={910} textAnchor="middle" fill="#fff" fontSize={42} {...tx}>{env ? "ENVIADA ✓" : "ENVIAR"}</text>
        </PantallaMovil>
      </Svg>
    </Camara>
  );
};
