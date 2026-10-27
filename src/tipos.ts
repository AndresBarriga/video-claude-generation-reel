export type Palabra = { w: string; start: number; end: number };

export type Escena = {
  tipo: "gancho" | "cifra" | "lista" | "texto" | "cierre";
  /** Lo que se dice en voz en esta escena (se concatena para generar la voz) */
  texto: string;
  /** Texto grande en pantalla (si no se pone, se usa una versión corta del texto) */
  titulo?: string;
  /** Para tipo "cifra": el número grande y su etiqueta */
  cifra?: string;
  etiqueta?: string;
  /** Para tipo "lista": elementos que aparecen uno a uno */
  items?: string[];
  /** Fuente visible del dato (obligatoria si hay cifra) */
  fuente?: string;
  /** Emoji o personaje a mostrar (nombre de archivo en public/personajes o emoji) */
  icono?: string;
  /** Escena visual a medida (plantillas de historia) */
  visual?: string;
  /** Rellenado por tools/voz.mjs */
  inicio?: number;
  fin?: number;
};

export type Datos = {
  id: string;
  titulo: string;
  nicho: "escalada" | "mascotas" | "otro";
  plantilla?: string;
  fps: number;
  voz?: string; // ruta relativa en /public, ej: voz/E1.mp3
  duracion: number; // segundos
  palabras: Palabra[];
  escenas: Escena[];
};
