// Calcos de las dos referencias de @sima.k202 (composición, postura y perspectiva), con nuestros personajes y estilo plano.
// Coordenadas = las de la captura (739 de ancho; el dibujo va de y≈237 a y≈1205).
import React from "react";
import { random } from "remotion";
import { COL, cr, Cuerda, Forma, Linea, tubo, type Pt } from "../comun";

const T = COL.tinta, PIEL = "#EDBE97", PIELS = "#CC9A74", ZAP = "#2F6FD0", ARNES = "#FFC93C";
const Mosq: React.FC<{ d: string }> = ({ d }) => <g><path d={d} fill="none" stroke={T} strokeWidth={11} strokeLinejoin="round" /><path d={d} fill="none" stroke="#C9D0D8" strokeWidth={5} strokeLinejoin="round" /></g>;
const Moteado: React.FC<{ n: number; c: string; seed: string; x0?: number; x1?: number; y0?: number; y1?: number }> = ({ n, c, seed, x0 = -300, x1 = 1050, y0 = 0, y1 = 1500 }) => (
  <g>{Array.from({ length: n }, (_, i) => <ellipse key={i} cx={x0 + random(`${seed}x${i}`) * (x1 - x0)} cy={y0 + random(`${seed}y${i}`) * (y1 - y0)} rx={4 + random(`${seed}r${i}`) * 10} ry={3 + random(`${seed}s${i}`) * 6} fill={c} opacity={0.55} />)}</g>
);

// ——— Referencia 1: placa, de espaldas y desde arriba. La pierna izquierda estirada; la cuerda POR FUERA del gemelo ✗ ———
export const PLACA_DETALLE: Pt = [270, 930];
export const Placa: React.FC<{ mal?: boolean }> = ({ mal = true }) => {
  const LOLA_PELO = "#E2B04A", JERSEY = "#FF6B5B", JERSEY_S = "#D04A3E", SHORT = "#24324F";
  // eje de la pierna izquierda (cadera → rodilla → tobillo) como en la referencia
  const muslo: Pt[] = [[486, 690], [400, 742], [322, 790]];
  const gemelo: Pt[] = [[322, 790], [292, 842], [266, 892], [248, 934]];
  // cuerda: sale del nudo bajo el short, baja por la corva, cruza el gemelo, rodea el tobillo y baja a la cinta
  const sobre: Pt[] = [[404, 772], [352, 820], [302, 866], [266, 902], [242, 936], [244, 968]];
  const bajo: Pt[] = [[244, 968], [256, 1020], [276, 1074], [298, 1122]];
  const detras: Pt[] = [[430, 740], [404, 790], [330, 900], [300, 960], [286, 1030], [298, 1122]];
  return (
    <g>
      {/* roca: placa de granito clara, fisura arriba a la izquierda */}
      <rect x={-400} y={0} width={1600} height={1600} fill="#E8D6BA" />
      <Moteado n={420} c="#C9AE88" seed="pl" />
      <Moteado n={160} c="#F5EADA" seed="pl2" />
      <path d="M-60 300 L40 330 L150 430 L210 500 L190 520 L120 470 L20 380 L-60 360 Z" fill="#6E5B45" />
      {/* cinta: chapa arriba a la derecha, cuelga hacia abajo-izquierda */}
      <Forma p={[[350, 990], [382, 984], [388, 1018], [356, 1024]]} c="#B8C0CA" w={6} />
      <Mosq d="M362 1006 Q344 1026 352 1050 Q362 1064 374 1052 Q384 1026 370 1006 Z" />
      <Forma p={tubo([[356, 1050], [318, 1098]], [22, 22])} c={COL.lila} w={5} />
      <Cuerda p={[[298, 1122], [300, 1180], [302, 1320]]} g={13} />
      {!mal && <Cuerda p={detras} g={13} />}
      {mal && <Cuerda p={bajo} g={13} />}
      <Mosq d="M296 1092 Q278 1112 288 1140 Q300 1156 314 1140 Q322 1110 306 1092 Z" />
      {/* sombra del cuerpo sobre la placa */}
      <g opacity={0.14} transform="translate(26 22)">
        <path d={cr([[200, 340], [330, 340], [510, 450], [690, 600], [680, 880], [600, 880], [560, 720], [330, 800], [240, 960], [120, 960], [240, 560]])} fill="#000" />
      </g>
      {/* pierna derecha, recogida (detrás) */}
      <Forma p={tubo([[630, 680], [614, 740], [602, 790]], [96, 80, 62])} c={PIEL} w={7} />
      <Forma p={[[572, 770], [622, 776], [664, 836], [652, 880], [606, 872], [576, 822]]} c={ZAP} w={7} />
      <path d="M612 872 L658 842" stroke={T} strokeWidth={10} strokeLinecap="round" />
      {/* pierna izquierda estirada */}
      <Forma p={tubo(muslo, [110, 96, 78])} c={PIEL} w={7} />
      <Forma p={tubo(gemelo, [74, 82, 62, 44])} c={PIEL} w={7} />
      <Linea p={[[310, 812], [284, 862], [262, 910]]} c={PIELS} w={6} o={0.8} />
      <Forma p={[[236, 912], [282, 930], [280, 986], [216, 998], [150, 960], [118, 908], [158, 884], [218, 902]]} c={ZAP} w={8} />
      <path d="M128 916 Q170 980 268 990" stroke={T} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M232 926 q14 10 32 4" stroke={ARNES} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* short, arnés y pernera */}
      <Forma p={[[380, 596], [540, 540], [640, 556], [684, 608], [680, 688], [606, 712], [526, 702], [452, 722], [382, 690]]} c={SHORT} />
      <Linea p={[[540, 560], [600, 690]]} c="#33456B" w={8} />
      <Forma p={[[500, 602], [540, 594], [570, 702], [532, 712]]} c={ARNES} w={6} />
      <Forma p={[[398, 584], [540, 520], [556, 548], [414, 616]]} c={ARNES} w={6} />
      {/* camiseta, brazo y bolsa */}
      <Forma p={tubo([[258, 470], [240, 552], [232, 622]], [54, 42, 34])} c={PIEL} w={7} />
      <circle cx={232} cy={628} r={22} fill={PIEL} stroke={T} strokeWidth={7} />
      <Forma p={[[240, 428], [330, 410], [452, 440], [508, 472], [514, 538], [480, 600], [420, 626], [330, 590], [256, 534]]} c={JERSEY} />
      <Linea p={[[300, 440], [420, 600]]} c={JERSEY_S} w={7} o={0.6} />
      <Forma p={[[492, 474], [592, 470], [612, 520], [596, 560], [530, 560], [496, 520]]} c={COL.menta} w={7} />
      {/* cabeza de espaldas, coleta */}
      <Forma p={[[186, 360], [250, 322], [322, 344], [338, 404], [304, 454], [240, 470], [190, 448], [172, 402]]} c={LOLA_PELO} />
      <Forma p={[[204, 440], [236, 452], [224, 520], [196, 540], [184, 500]]} c={LOLA_PELO} w={7} />
      <Linea p={[[250, 330], [262, 400], [250, 450]]} c="#C38F2E" w={6} />
      {mal && <Cuerda p={sobre} g={13} />}
    </g>
  );
};

// ——— Referencia 2: desplome con fisura, de lado. Pie en gancho junto a la cinta; la cuerda POR FUERA de la espinilla ✗ ———
export const DESPLOME_DETALLE: Pt = [330, 560];
export const Desplome: React.FC<{ mal?: boolean }> = ({ mal = true }) => {
  const LEO = "#3CC9B0", LEO_S = "#279483", SHORT = "#33302C", PIELL = "#B97F57", PIELLS = "#94613E";
  const mos1: Pt = [160, 636], mos2: Pt = [298, 576], nudo: Pt = [392, 650];
  const fuera: Pt[] = [mos2, [330, 560], [372, 586], [392, 620], nudo];
  const dentro: Pt[] = [mos2, [330, 590], [366, 612], nudo];
  return (
    <g>
      {/* pared desplomada: estratos que suben hacia la derecha (perspectiva) */}
      <rect x={-400} y={0} width={1600} height={1600} fill="#E9C9A2" />
      {/* arenisca: estratos suaves que suben a la derecha + chorreras oscuras verticales, como la referencia */}
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-200 ${300 + i * 120} Q300 ${270 + i * 120} 900 ${200 + i * 118}`} stroke="#D9B286" strokeWidth={5} fill="none" opacity={0.6} />)}
      <Moteado n={260} c="#D2A577" seed="ds" />
      {[[40, 560], [330, 640], [470, 900], [650, 300]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q-10 160 6 320 q10 120 -4 240`} stroke="#B58A62" strokeWidth={26} fill="none" opacity={0.35} strokeLinecap="round" />)}
      <rect x={-400} y={900} width={1600} height={700} fill="#8C6B4A" opacity={0.12} />
      <path d="M560 200 L640 200 L700 1300 L620 1300 Z" fill="#DDBA90" opacity={0.6} />
      {/* fisura horizontal y laja que sube a la derecha */}
      <path d="M-200 500 L120 488 L242 466 L330 336 L444 236 L470 250 L360 360 L262 486 L120 512 L-200 524 Z" fill="#F3E2CB" stroke={T} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-200 500 L120 488 L242 466" stroke={T} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d="M242 466 L330 336 L444 236" stroke="#8C6B4A" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* cinta 1 (izquierda) y cinta 2 (junto al pie) */}
      <Mosq d="M100 488 Q88 506 96 528 Q106 540 116 528 Q124 506 110 488 Z" />
      <Forma p={tubo([[106, 528], [140, 600]], [20, 20])} c={COL.lila} w={5} />
      <Mosq d="M148 600 Q136 620 144 644 Q156 658 168 644 Q176 620 160 600 Z" />
      {/* cuerda: del asegurador a la cinta 1, a la cinta 2 y al nudo */}
      <Cuerda p={[[96, 1300], [120, 900], [150, 700], mos1]} g={13} />
      <Cuerda p={[mos1, [220, 610], mos2]} g={13} />
      {!mal && <Cuerda p={dentro} g={13} />}
      {/* pierna de atrás (baja), apoyada en la pared */}
      <Forma p={tubo([[430, 760], [380, 712], [336, 664]], [96, 88, 76])} c={PIELL} w={7} />
      <Forma p={tubo([[336, 664], [318, 712], [298, 760], [288, 794]], [74, 80, 60, 46])} c={PIELL} w={7} />
      <Forma p={[[300, 780], [318, 800], [314, 846], [256, 856], [204, 822], [196, 798], [240, 790]]} c="#3A3F46" w={8} />
      {/* brazo de atrás */}
      <Forma p={tubo([[520, 528], [470, 444], [392, 356]], [60, 54, 44])} c={PIELL} w={7} />
      <circle cx={386} cy={350} r={24} fill={PIELL} stroke={T} strokeWidth={7} />
      {/* tronco, arnés, short */}
      <Forma p={[[494, 512], [560, 532], [612, 566], [618, 660], [594, 742], [534, 774], [480, 744], [468, 640]]} c={LEO} />
      <Linea p={[[540, 560], [560, 720]]} c={LEO_S} w={7} o={0.7} />
      <Forma p={[[366, 690], [470, 690], [546, 760], [524, 834], [420, 836], [350, 770]]} c={SHORT} />
      <Forma p={[[392, 716], [540, 744], [548, 790], [400, 762]]} c={ARNES} w={6} />
      {/* pierna de delante: muslo casi vertical, espinilla horizontal, pie en gancho en la fisura */}
      <Forma p={tubo([[476, 716], [480, 636], [474, 556]], [104, 96, 82])} c={PIELL} w={7} />
      <Forma p={tubo([[470, 556], [420, 576], [360, 576], [302, 562]], [80, 88, 66, 50])} c={PIELL} w={7} />
      <Linea p={[[440, 596], [380, 602], [330, 590]]} c={PIELLS} w={6} o={0.8} />
      <Forma p={[[252, 470], [276, 456], [300, 488], [312, 556], [294, 596], [262, 592], [244, 526]]} c="#3A3F46" w={8} />
      <path d="M254 476 Q246 540 266 590" stroke={T} strokeWidth={10} fill="none" strokeLinecap="round" />
      <Mosq d="M262 458 Q250 476 258 498 Q268 510 278 498 Q286 476 272 458 Z" />
      <Forma p={tubo([[268, 498], [290, 548]], [20, 20])} c={COL.rojo} w={5} />
      <Mosq d="M286 548 Q274 568 282 592 Q294 606 306 592 Q314 568 298 548 Z" />
      {/* brazo de delante */}
      <Forma p={tubo([[500, 530], [434, 470], [340, 378]], [66, 58, 46])} c={PIELL} w={7} />
      <Forma p={tubo([[500, 530], [470, 500]], [72, 66])} c={LEO} w={7} />
      <circle cx={336} cy={374} r={26} fill={PIELL} stroke={T} strokeWidth={7} />
      {/* cabeza de perfil mirando arriba a la izquierda: gorro amarillo y barba */}
      <circle cx={584} cy={506} r={54} fill={PIELL} stroke={T} strokeWidth={8} />
      <path d="M534 484 L524 500 L540 506" fill={PIELL} stroke={T} strokeWidth={6} strokeLinejoin="round" />
      <path d="M540 470 Q560 436 600 440 Q640 448 640 490 L600 470 Z" fill={ARNES} stroke={T} strokeWidth={7} strokeLinejoin="round" />
      <path d="M548 522 Q566 552 598 548 Q610 536 606 522 Q580 534 548 522 Z" fill="#5A4030" />
      <path d="M540 514 q8 4 16 0" stroke={T} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={552} cy={492} r={6} fill={T} />
      {/* nudo de ocho en el arnés */}
      <circle cx={nudo[0]} cy={nudo[1]} r={14} fill={COL.naranja} stroke={T} strokeWidth={6} />
      {mal && <Cuerda p={fuera} g={13} />}
      {!mal && <Cuerda p={[[372, 612], nudo]} g={13} />}
    </g>
  );
};
