// KIT · geometría de una vía a ESCALA REAL (170 px = 1 m). La pared queda a la derecha; quien escala, a su izquierda mirándola.
// Todo vídeo de «qué pasa si caes aquí» sale de cambiar estos números, no de redibujar.
import type { Pt } from "./base";

export const PM = 170; // px por metro
export const CADERA = 136; // altura de la cadera de pie (px)
export const CINTA = 54; // lo que cuelga el mosquetón de la cuerda bajo la chapa

export type Perfil = (y: number) => number;
/** x del canto de la pared a cada altura. */
export const PERFILES = {
  /** Cueva desplomada (E47, E59): arriba queda más a la izquierda. */
  desplome: ((y) => 300 + (y - 150) * 0.24 + 10 * Math.sin(y / 97) + 6 * Math.sin(y / 31)) as Perfil,
  /** Pared vertical (rocódromo, placa de iniciación). */
  vertical: ((y) => 640 + 5 * Math.sin(y / 97) + 3 * Math.sin(y / 31)) as Perfil,
  /** Placa tumbada: arriba queda más a la derecha. */
  placa: ((y) => 980 - (y - 150) * 0.13 + 8 * Math.sin(y / 97)) as Perfil,
  /** Panel liso de rocódromo, ligeramente desplomado. */
  panel: ((y) => 420 + (y - 150) * 0.1) as Perfil,
};

export type Via = {
  suelo: number; /** y de la cadera de alguien de pie en el suelo */ pie: number; xF: Perfil;
  /** y (px) de cada chapa en la pared */ chapas: number[]; presas: number[];
  /** Mosquetón de la cuerda de la chapa i (por donde pasa la cuerda). */ mos: (i: number) => Pt;
  /** x de la cadera de quien escala a la altura y. */ hipX: (y: number) => number;
  /** Cadera de quien escala a la altura y. */ cadera: (y: number) => Pt;
  /** y (px) a `m` metros del suelo. */ aM: (m: number) => number;
  /** Metros sobre el suelo de un punto y. */ metros: (y: number) => number;
};

/** `metros` = altura del MOSQUETÓN de cada chapa sobre el suelo (p. ej. [3, 4.5, 6.3]); o `chapas` = y en px de cada chapa. */
export const crearVia = (o: { perfil?: Perfil; suelo?: number; chapas?: number[]; metros?: number[]; presas?: number[] } = {}): Via => {
  const suelo = o.suelo ?? 2650, xF = o.perfil ?? PERFILES.desplome;
  const chapas = o.chapas ?? (o.metros ?? [3, 4.5, 6.3, 8, 9.8]).map((m) => suelo - m * PM - CINTA);
  const presas = o.presas ?? Array.from({ length: 12 }, (_, i) => suelo - 190 - i * 86 - (i % 3) * 9);
  return {
    suelo, pie: suelo - CADERA, xF, chapas, presas,
    mos: (i) => ({ x: xF(chapas[i]) - 6, y: chapas[i] + CINTA }),
    hipX: (y) => xF(y) - 78, cadera: (y) => ({ x: xF(y) - 78, y }),
    aM: (m) => suelo - m * PM, metros: (y) => (suelo - y) / PM,
  };
};
/** Nudo del arnés (donde entra la cuerda) para una cadera p. */
export const nudo = (p: Pt) => ({ x: p.x + 18, y: p.y - 6 });
/** Aparato de freno en el arnés de quien asegura (cadera en x). */
export const aparato = (via: Via, x: number, dy = 0) => ({ x: x + 22, y: via.pie - 14 + dy });
