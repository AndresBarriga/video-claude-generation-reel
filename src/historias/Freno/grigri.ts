// Grigri DE LADO dibujado sobre la foto de Andrés (18-nov). Coordenadas de foto (1500 × 2000). Devuelve SVG en texto.
// Izquierda: pieza negra (no se toca). Centro: placas plateadas con el hueco de arriba (por ahí entra y sale la cuerda).
// Derecha: PESTAÑA plateada (índice y medio se enganchan por detrás). El pulgar apoya en el borde de la placa y aprieta un poco hacia delante.
const T = "#050B14", PIEL = "#E7B892", PIELS = "#BE8C64", PIELL = "#F3D2B5", NAR = "#FF7A45", MANGA = "#8E7CC3", PL = "#CDD4DB", PLS = "#8F99A6", PLL = "#EEF2F5", NE = "#23272E", CU = "#F07A2E";
const p = (d: string, fill: string, sw = 16, extra = "") => `<path d="${d}" fill="${fill}" stroke="${T}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const rope = (d: string, off = 0, w = 135) => `<path d="${d}" stroke="${T}" stroke-width="${w + 24}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${CU}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#FFD0A8" stroke-width="13" fill="none" stroke-dasharray="52 58" stroke-dashoffset="${off}" opacity=".85"/>`;
const tubo = (d: string, w: number, c: string) => `<path d="${d}" stroke="${T}" stroke-width="${w + 20}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Punto donde aprieta el pulgar (foto). */
export const PULGAR = { x: 470, y: 1180 };
/** Punto de los dedos en la pestaña (foto). */
export const DEDOS = { x: 1000, y: 600 };
export type ModoG = "mal" | "normal" | "rapido" | "solo";
export const grigriSVG = (o: { modo: ModoG; pisa?: number; dedosHi?: boolean; pulgarHi?: boolean; corre?: number; cuelga?: number; brillo?: number; leva?: string }) => {
  const { modo, pisa = 0, dedosHi = false, pulgarHi = false, corre = 0, cuelga = 0, brillo = 0, leva } = o;
  let s = "";
  s += tubo("M560 1660 Q520 1900 560 2150", 86, PLS) + tubo("M770 1600 L1120 2150", 92, PL);
  s += `<rect x="930" y="1800" width="120" height="200" rx="24" transform="rotate(-32 990 1900)" fill="#A9B1BA" stroke="${T}" stroke-width="14"/>`;
  const freno = modo === "mal" ? `M660 400 C708 170 1000 170 1000 440 Q${1040 + cuelga} 1300 ${980 + cuelga * 2} 2600` : "M660 400 C708 170 1000 170 1000 440 L1010 2600";
  if (brillo > 0) s += `<path d="${freno}" stroke="#FFD24A" stroke-width="240" fill="none" stroke-linecap="round" opacity="${0.5 * brillo}"/>`;
  s += rope("M540 470 L490 -700", corre);
  s += p("M470 372 L700 372 Q722 372 722 396 L722 1666 Q722 1692 698 1692 L494 1692 Q470 1692 470 1666 Z", PL);
  s += p("M482 384 L712 384 L712 492 L482 492 Z", "#2E343D", 12);
  s += rope("M540 380 L540 492", corre) + rope("M660 380 L660 492", -corre);
  s += p("M496 900 Q600 860 704 912 L704 1240 Q600 1196 496 1232 Z", PLS, 10, 'opacity=".75"');
  s += `<path d="M488 1300 L488 1640" stroke="${PLL}" stroke-width="16" stroke-linecap="round" opacity=".6"/>`;
  if (leva) s += `<path d="M470 400 Q260 440 262 1020 Q260 1600 470 1700" stroke="${leva}" stroke-width="80" fill="none" opacity=".55" stroke-linecap="round"/>`;
  s += p("M486 372 Q290 410 278 1020 Q270 1600 486 1700 L500 1640 Q392 1510 392 1020 Q396 520 506 432 Z", NE) + `<path d="M430 520 Q340 720 336 1020" stroke="#5A616C" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const pestana = tubo("M700 380 Q852 386 852 548 L852 1610 Q852 1694 770 1700", 92, PL) + `<path d="M722 398 Q830 408 832 548 L832 1560" stroke="${PLL}" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>`;
  if (modo === "rapido") {
    s += p("M900 440 Q1220 380 1640 520 L1700 1500 Q1600 1560 1520 1520 Q1240 1520 1060 1420 Q940 1330 890 1150 Q860 900 900 440 Z", PIEL);
    s += `<path d="M1160 470 Q1260 520 1300 640" stroke="${PIELL}" stroke-width="40" fill="none" stroke-linecap="round" opacity=".6"/>`;
    const dc = dedosHi ? NAR : PIEL;
    s += p("M760 492 Q980 452 1180 500 Q1240 540 1236 610 Q1230 690 1160 704 Q960 712 770 700 Z", dc);
    s += p("M770 712 Q960 704 1150 724 Q1214 760 1210 830 Q1204 906 1136 918 Q950 928 774 916 Z", dc);
    s += `<path d="M1020 520 Q1044 600 1020 690 M1010 728 Q1034 820 1012 906" stroke="${PIELS}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    s += pestana + rope("M660 400 C708 170 1000 170 1000 440", -corre);
    const tx = 430 + 110 * (1 - pisa), tc = pulgarHi ? NAR : PIEL;
    s += p(`M1760 930 Q1180 960 900 1000 Q620 1040 ${tx + 130} 1070 Q${tx - 10} 1080 ${tx} 1170 Q${tx + 10} 1272 ${tx + 150} 1280 Q620 1290 920 1320 Q1200 1370 1760 1460 Z`, tc);
    s += p(`M${tx + 40} 1100 Q${tx + 30} 1172 ${tx + 50} 1238 Q${tx + 130} 1250 ${tx + 170} 1220 Q${tx + 190} 1170 ${tx + 170} 1116 Q${tx + 120} 1088 ${tx + 40} 1100 Z`, pulgarHi ? "#FFB08A" : PIELL, 9);
    s += `<path d="M${tx + 380} 1090 Q${tx + 350} 1180 ${tx + 380} 1270" stroke="${PIELS}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M1080 1330 Q1260 1360 1420 1430" stroke="${PIELS}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M1620 1300 L2000 1900" stroke="${T}" stroke-width="640" stroke-linecap="round"/><path d="M1620 1300 L2000 1900" stroke="${MANGA}" stroke-width="610" stroke-linecap="round"/>`;
  } else {
    s += pestana + rope(freno, -corre);
  }
  if (modo === "mal") {
    // la mano agarra el grigri entero desde abajo: los dedos rodean todo (también la pieza negra) y la cuerda de freno queda suelta
    s += `<path d="M1300 1400 L1900 2100" stroke="${T}" stroke-width="640" stroke-linecap="round"/><path d="M1300 1400 L1900 2100" stroke="${MANGA}" stroke-width="610" stroke-linecap="round"/>`;
    s += p("M880 980 Q1300 940 1500 1160 L1520 1760 Q1160 1800 940 1640 Z", PIEL);
    [980, 1150, 1320, 1490].forEach((y, i) => { s += p(`M${980} ${y} L300 ${y + 10} Q220 ${y + 90} 300 ${y + 165} L${980} ${y + 160} Z`, i === 0 ? NAR : PIEL); s += `<path d="M560 ${y + 30} v110" stroke="${PIELS}" stroke-width="10" stroke-linecap="round"/>`; });
  }
  return s;
};
