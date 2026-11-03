// 7 · el sofá: «semanas sin colgarte… y tú, en el sofá, dándole “me gusta” a los que sí escalan». Dibujado con la rig de Escalador.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chip, Rotulo, Svg, ei, type P } from "../Pump/comun";
import { Escalador } from "../../piezas/Escalador";
import { ASP } from "../Pump/Perfil";
import { Lamina, alrededor } from "./Lamina";
import { TA } from "./laminas";

const rad = (g: number) => (g * Math.PI) / 180;
const ext = (x: number, y: number, a: number, L: number): [number, number] => [x + Math.sin(rad(a)) * L, y + Math.cos(rad(a)) * L];
const HIP: [number, number] = [470, 1130], S = 2.1;
const POSE = { torso: -10, cabeza: 18, brazoA: [112, 160], brazoB: [28, 76], piernaA: [82, 24], piernaB: [78, 14] } as const;
/** Posición de la mano de un brazo en coordenadas de pantalla. */
const mano = (ang: readonly [number, number], torso: number): [number, number] => {
  const h = ext(0, 0, 180 - torso, 88), e = ext(h[0], h[1], ang[0], 52), m = ext(e[0], e[1], ang[1], 50);
  return [HIP[0] + S * m[0], HIP[1] + S * m[1]];
};

export const Sofa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSem = pal("semanas") ?? 10, fMes = pal("meses") ?? 70, fSofa = pal("pasa") ?? 200, fGus = pal("vídeos") ?? pal("videos") ?? 160, fArq = pal("¿Arqueas") ?? pal("Arqueas") ?? d - 50;
  const mB = mano(POSE.brazoB, POSE.torso), mA = mano(POSE.brazoA, POSE.torso);
  const luz = 0.5 + 0.08 * Math.sin(f * 0.2);
  const tg = f - fGus, pop = tg >= 0 ? Math.min(1, tg / 6) : 0, sube = tg >= 0 ? tg * 3 : 0;
  return (
    <Camara d={d} empuje={0.025} foco="50% 55%">
      <Svg>
        <defs><radialGradient id="lampara"><stop offset="0" stopColor="#FFC873" stopOpacity="0.55" /><stop offset="1" stopColor="#FFC873" stopOpacity="0" /></radialGradient></defs>
        <rect width={1080} height={1920} fill="#141E2C" />
        <rect y={1330} width={1080} height={600} fill="#0E1620" />
        <circle cx={150} cy={760} r={520} fill="url(#lampara)" opacity={luz} />
        {/* lámpara */}
        <rect x={142} y={760} width={16} height={560} fill="#2B3646" /><path d="M95 760 L205 760 L180 690 L120 690 Z" fill="#F2C76B" />
        {/* hangboard con polvo y zapatillas colgadas */}
        <rect x={600} y={520} width={300} height={90} rx={14} fill="#6B5A47" stroke="#2A2118" strokeWidth={5} />
        {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={650 + i * 55} cy={565} rx={20} ry={14} fill="#3A2F24" />)}
        <path d="M610 530 q100 -14 280 0" stroke="#EDEFF2" strokeWidth={8} opacity={0.5} strokeLinecap="round" fill="none" />
        <path d="M940 600 l0 40 q-4 26 -38 24 l-24 -6 q8 -30 26 -44 z" fill="#C8402E" stroke="#2A2118" strokeWidth={4} /><path d="M996 600 l0 40 q-4 26 -38 24 l-24 -6 q8 -30 26 -44 z" fill="#2FA39A" stroke="#2A2118" strokeWidth={4} /><circle cx={930} cy={588} r={7} fill="#AEB8C4" /><circle cx={986} cy={588} r={7} fill="#AEB8C4" />
        {/* sofá */}
        <rect x={280} y={900} width={140} height={430} rx={50} fill="#3B4A63" />
        <rect x={280} y={1160} width={560} height={170} rx={44} fill="#46587A" />
        <rect x={300} y={1120} width={520} height={80} rx={36} fill="#52668C" />
        <rect x={770} y={1090} width={90} height={240} rx={34} fill="#3B4A63" />
        {/* mesita con taza */}
        <rect x={900} y={1230} width={110} height={16} rx={6} fill="#6B5A47" /><rect x={940} y={1246} width={14} height={84} fill="#6B5A47" /><rect x={930} y={1190} width={50} height={40} rx={8} fill="#E8E4DA" />
        <Escalador x={HIP[0]} y={HIP[1]} quien="simon" aspecto={ASP} pose="sentado" angulos={POSE as any} cara="normal" s={S} objeto="movil" bolsa={undefined} />
        {/* mano vendada */}
        <g transform={`translate(${mB[0]} ${mB[1]})`}><rect x={-34} y={-26} width={68} height={22} rx={8} fill="#F4F1E8" stroke="#8A8272" strokeWidth={3} transform="rotate(-18)" /><rect x={-30} y={0} width={62} height={20} rx={8} fill="#F4F1E8" stroke="#8A8272" strokeWidth={3} transform="rotate(12)" /></g>
        {/* me gusta */}
        {tg >= 0 && <g transform={`translate(${mA[0] + 40} ${mA[1] - 120 - sube}) scale(${0.5 + 0.7 * pop})`} opacity={Math.max(0, 1 - tg / 75)}><path d="M0 18 C-40 -14 -26 -46 0 -26 C26 -46 40 -14 0 18 Z" fill="#E5484D" stroke="#050B14" strokeWidth={5} /></g>}
        {f > fArq && <g opacity={ei(f, fArq, fArq + 24, 0, 1)}><rect width={1080} height={1920} fill="#08111D" /><Lamina html={TA} tf={alrededor(430, 440, 1.1)} /></g>}
        <g transform="translate(540 1290) scale(1.3) translate(-540 -1290)"><Chip x={540} y={1290} t="SI DUELE: FISIO" col="#9ED8F2" o={ei(f, fSofa, fSofa + 8, 0, 1) * (1 - ei(f, fArq - 6, fArq, 0, 1))} /></g>
        <Rotulo f={f} ini={fSofa} fin={fArq - 4} t="INFORMACIÓN GENERAL" y={235} tam={44} col="#B9C6D3" />
        <Rotulo f={f} ini={fSem - 2} fin={fMes} t="SEMANAS SIN COLGARTE" y={235} tam={78} col="#fff" />
        <Rotulo f={f} ini={fMes - 2} fin={fSofa - 4} t="A VECES, MESES" y={235} tam={78} col="#FFB070" />
      </Svg>
    </Camara>
  );
};
