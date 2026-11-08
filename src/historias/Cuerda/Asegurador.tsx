// Asegurador de perfil, de pie, mirando hacia arriba; sujeta la cuerda con el aparato y la mano de freno. Alto ≈ 400.
import React from "react";

const trazo = (d: string, w: number, c: string) => <path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
export const Asegurador: React.FC<{ grita?: boolean; f?: number }> = ({ grita = false, f = 0 }) => {
  const b = Math.sin(f / 3) * (grita ? 3 : 0);
  return (
    <g transform={`translate(0 ${b})`}>
      {/* piernas */}
      {trazo("M790 1480 L770 1620", 56, "#2B3442")}{trazo("M822 1480 L842 1620", 56, "#2B3442")}
      <ellipse cx={760} cy={1626} rx={44} ry={18} fill="#1B2230" /><ellipse cx={856} cy={1626} rx={44} ry={18} fill="#1B2230" />
      {/* torso inclinado atrás, arnés */}
      <path d="M752 1344 Q820 1330 862 1360 L852 1490 L770 1490 Z" fill="#7A4FA3" />
      {trazo("M768 1486 L856 1486", 30, "#E0B020")}
      {/* brazo adelante sujetando el aparato y la mano de freno abajo */}
      {trazo("M780 1372 L730 1424 L690 1444", 36, "#563578")}
      {trazo("M800 1384 L770 1470 L730 1500", 34, "#563578")}
      <rect x={668} y={1424} width={46} height={42} rx={9} fill="#9AA3AE" /><rect x={676} y={1432} width={30} height={12} rx={4} fill="#5C6672" />
      <circle cx={688} cy={1448} r={20} fill="#E9B990" /><circle cx={730} cy={1500} r={19} fill="#E9B990" />
      {/* cuerda: del aparato hacia la chapa, y cola de freno hacia abajo */}
      {trazo("M690 1424 Q610 1400 520 1396", 14, "#FF6A1F")}
      {trazo("M730 1500 Q716 1560 700 1620", 14, "#FF6A1F")}
      {/* cabeza mirando hacia arriba-izquierda: cuello, cara en perfil, boca abierta */}
      <rect x={786} y={1316} width={36} height={40} fill="#C9926A" />
      <circle cx={798} cy={1278} r={56} fill="#E9B990" />
      <path d="M742 1270 Q742 1212 800 1210 Q860 1214 856 1274 Q820 1240 770 1250 Q748 1256 742 1270 Z" fill="#2B1D14" />
      <ellipse cx={778} cy={1268} rx={7} ry={9} fill="#141B26" /><path d="M758 1250 L788 1254" stroke="#141B26" strokeWidth={5} strokeLinecap="round" />
      <path d="M742 1284 L732 1296 L746 1298" stroke="#C9926A" strokeWidth={5} fill="none" strokeLinecap="round" />
      {grita ? <ellipse cx={764} cy={1312} rx={13} ry={17} fill="#5A1D1D" /> : <path d="M754 1310 Q768 1322 782 1310" stroke="#141B26" strokeWidth={5} fill="none" strokeLinecap="round" />}
    </g>
  );
};
