# E81 — encargo para producir («Caer y asegurar» 3/3) · 25-nov
**Estado:** guion APROBADO por Andrés (voz final abajo). Producir sin volver a proponer. Se publica DESPUÉS de E80.
Base: `propuesta.md` (guion v2, escenas y respaldo). Esta voz manda sobre la de la propuesta (revisión técnica 25-nov: «puede bloquearse», técnica atribuida a Petzl, sin tono de «truco»).

## Voz (texto para ElevenLabs; la genera Andrés)
**Cambio 25-nov:** «puede bloquearse» → «puede frenar como si cayera»; el gancho sigue con «se bloquea» (ver `ficha.md`). La voz vigente es la de `guion.json`.
¿Tu grigri se bloquea cuando van a chapar? Lo que haces para arreglarlo puede quitarle el freno. Si la cuerda sale de golpe, puede bloquearse. Y agarrarlo entero no lo arregla: si agarras el aparato o aprietas la leva, anulas el frenado. Uno: la mano de freno no suelta nunca la cuerda. Dos: para dar rápido, el pulgar en la leva solo un instante, mientras das. Tres: en cuanto chapa, pulgar fuera. La mano de freno, siempre en la cuerda. Es la técnica de Petzl para el grigri: si tu aparato es otro, mira su manual. Mándaselo a quien te asegura.

## Requisitos
- Kit de cuerda, decorado **sala (rocódromo)**; reparto Irene (escala) y Dani (asegura), aspectos en `src/historias/Frenada/comun.tsx`. **No usar a Lola.**
- Primer plano del grigri con `AparatoGrande` (kit) / `src/historias/Freno/` (E62, misma mecánica, reutilizable).
- **La mano de freno siempre dibujada en la cuerda.** Nunca mostrar el agarre que bloquea durante una caída completa: solo medio segundo de cuerda corriendo en la lupa, sin desenlace.
- Paso 2: rotular ÍNDICE (bajo el borde) y PULGAR (leva), cada rótulo ≥1,5 s.
- `docs/formato.md` §8–§9: titular «¡CUERDA!» desde el fotograma 0, zona segura 250/350, lo clave en el 3:4, tarjeta final 2,5 s fija, portada propia «CAER Y ASEGURAR · 3/3» (como `videos/escalada/E79/portada.jpg`, plantilla `src/historias/Frenada/Portada.tsx`).
- Antes de enseñar: `npm run qa`, `qa-final`, hoja de contacto. Ficha con pie, comentario fijado y tabla de respaldo.
