---
description: Radar de repos de GitHub (guiones, ganchos, animación, voz) con triaje de licencia, máx. 30 min
argument-hint: "[necesidad concreta]"
---
Busca repos útiles para una necesidad concreta (`$ARGUMENTS`; si está vacío, usa los huecos de `docs/estrategia.md`).
1. `npm run radar -- "<consulta estrecha>"` (2–4 consultas distintas, en inglés). Sin argumentos usa `datos/radar.json` y marca los repos como vistos.
2. De la tabla, abre solo los de nota ≥3/5 o muy ajustados a la necesidad. No juzgues por el README: lee el árbol de ficheros y un ejemplo de salida real.
3. Licencia: MIT/Apache se pueden copiar (deja el aviso); AGPL, NC u «other» son solo ideas, reescritas con nuestras palabras.
4. Copia lo útil como mejora concreta (herramienta, regla en `docs/viralidad.md`, comando). Añade a `docs/referencias.md` una línea por repo: qué se adoptó, qué se descartó y por qué.
5. Máx. 30 min. Si no hay nada ≥3/5, dilo en una línea y para. Commit + push.
