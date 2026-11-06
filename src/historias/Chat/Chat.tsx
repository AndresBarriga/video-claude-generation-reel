// Pantalla de chat (escena 1) y su versión final dentro de la tira de apps.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Foto, Smiley, UI, ei, type P } from "./comun";

const TEXTO = "No pasa nada", T0 = 1.0, CPS = 7, T_SMILE = 2.9, T_ENVIO = 3.3;
const FILAS = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];
const ANCHO = (t: string) => t.length * 25 + 76;

const Burbuja: React.FC<{ x: number; y: number; t: string; yo?: boolean; smiley?: boolean; esc?: number }> = ({ x, y, t, yo, smiley, esc = 1 }) => {
  const w = ANCHO(t) + (smiley ? 50 : 0), bx = yo ? 1030 - w : x;
  return (
    <g transform={`translate(${bx + w / 2} ${y + 40}) scale(${esc}) translate(${-(bx + w / 2)} ${-(y + 40)})`} opacity={Math.min(1, esc * 1.4)}>
      <rect x={bx} y={y} width={w} height={80} rx={34} fill={yo ? "#3A66D8" : "#232F3D"} />
      <text x={bx + 38} y={y + 54} fontFamily={UI} fontWeight={500} fontSize={44} fill="#fff">{t}</text>
      {smiley && <Smiley x={bx + 38 + t.length * 25 + 18} y={y + 40} r={21} />}
    </g>
  );
};

export const PantallaChat: React.FC<{ f: number; enviado?: boolean }> = ({ f, enviado }) => {
  const t = enviado ? 99 : f / 30;
  const n = Math.max(0, Math.min(TEXTO.length, Math.floor((t - T0) * CPS) + (t >= T0 ? 1 : 0)));
  const enviadoYa = t >= T_ENVIO, escribe = !enviadoYa && t >= T0;
  const texto = TEXTO.slice(0, n), ultima = texto[texto.length - 1];
  const pulsa = escribe && t < T0 + TEXTO.length / CPS + 0.1 && f % Math.round(30 / CPS) < 4;
  const esc = enviado ? 1 : ei(f, T_ENVIO * 30, T_ENVIO * 30 + 7, 0.6, 1);
  const cursor = Math.floor(f / 15) % 2 === 0;
  return (
    <g>
      <rect width={1080} height={1920} fill="#0F1620" />
      <rect width={1080} height={235} fill="#151E2A" />
      <text x={70} y={92} fontFamily={UI} fontWeight={700} fontSize={42} fill="#fff">21:07</text>
      <rect x={940} y={58} width={74} height={36} rx={11} fill="none" stroke="#fff" strokeWidth={3} /><rect x={946} y={64} width={56} height={24} rx={6} fill="#fff" />
      <path d="M60 170 L100 130 M60 170 L100 210" stroke="#fff" strokeWidth={7} strokeLinecap="round" />
      <circle cx={190} cy={170} r={46} fill="#5B6B80" /><text x={190} y={186} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={48} fill="#fff">D</text>
      <text x={262} y={166} fontFamily={UI} fontWeight={700} fontSize={46} fill="#fff">Dani</text>
      <text x={262} y={208} fontFamily={UI} fontWeight={500} fontSize={30} fill="#8DA0B5">en línea</text>
      <g transform="translate(556 290)"><rect width={474} height={372} rx={34} fill="#3A66D8" /><g transform="translate(9 9)"><clipPath id="cf"><rect width={456} height={354} rx={27} /></clipPath><g clipPath="url(#cf)"><Foto w={456} h={354} id="chat" /></g></g></g>
      <Burbuja x={0} y={700} yo t="¿Escalamos mañana?" />
      <Burbuja x={44} y={806} t="Uf, no puedo, tengo planes." />
      {enviadoYa && <Burbuja x={0} y={912} yo t="No pasa nada" smiley esc={esc} />}
      <rect x={40} y={1215} width={850} height={86} rx={43} fill="#1E2936" />
      {!enviadoYa && <text x={86} y={1272} fontFamily={UI} fontWeight={500} fontSize={44} fill="#fff">{texto}</text>}
      {!enviadoYa && t >= T_SMILE && <Smiley x={86 + texto.length * 25 + 16} y={1258} r={21} />}
      {!enviadoYa && cursor && <rect x={86 + texto.length * 25 + (t >= T_SMILE ? 50 : 4)} y={1234} width={4} height={50} fill="#5C8DFF" />}
      {!enviadoYa && t >= T_SMILE && <g><circle cx={970} cy={1258} r={46} fill="#3A66D8" /><path d="M948 1258 L992 1258 M974 1236 L996 1258 L974 1280" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
      <rect y={1345} width={1080} height={575} fill="#1A222C" />
      {FILAS.map((fila, r) => fila.split("").map((c, i) => {
        const x0 = (1080 - fila.length * 104) / 2 + (r === 2 ? 0 : 0) + (r === 1 ? 0 : 0), on = pulsa && c === ultima?.toLowerCase();
        return <g key={r + c}><rect x={x0 + i * 104 + 4} y={1375 + r * 140} width={94} height={122} rx={16} fill={on ? "#556579" : "#334154"} /><text x={x0 + i * 104 + 51} y={1455 + r * 140} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={52} fill="#fff">{c}</text></g>;
      }))}
      <rect x={116} y={1795} width={560} height={110} rx={16} fill={pulsa && ultima === " " ? "#556579" : "#334154"} /><rect x={700} y={1795} width={260} height={110} rx={16} fill="#2A5BC4" />
      <text x={830} y={1865} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={40} fill="#fff">intro</text>
    </g>
  );
};

export const Chat: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}><PantallaChat f={f} /></svg>;
};
