// Sincronía con la voz: que las cosas aparezcan JUSTO cuando se nombran.
// Uso en una escena: const f0 = framePalabra(datos.palabras, e, "navaja", fps); → frame (relativo a la escena) en que se dice "navaja".
import type { Escena, Palabra } from "../tipos";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");

/** Segundo absoluto en que empieza `palabra` dentro de la escena (o null). `n` = enésima aparición (0 = primera). */
export function segundoPalabra(palabras: Palabra[], e: Escena, palabra: string, n = 0): number | null {
  const ini = e.inicio ?? 0, fin = e.fin ?? Infinity, objetivo = norm(palabra);
  let k = 0;
  for (const p of palabras) {
    if (p.start < ini - 0.05 || p.start > fin + 0.05) continue;
    if (norm(p.w).startsWith(objetivo)) { if (k === n) return p.start; k++; }
  }
  return null;
}

/** Frame relativo al inicio de la escena en que se dice `palabra`; si no aparece, `respaldo` (fracción de la escena, por defecto 0.5). */
export function framePalabra(palabras: Palabra[], e: Escena, palabra: string, fps: number, respaldo = 0.5, n = 0): number {
  const s = segundoPalabra(palabras, e, palabra, n);
  const ini = e.inicio ?? 0;
  if (s !== null) return Math.max(0, Math.round((s - ini) * fps));
  const dur = ((e.fin ?? ini + 3) - ini) * fps;
  return Math.round(dur * respaldo);
}
