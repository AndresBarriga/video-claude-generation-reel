# E83 — La puerta (serie Fermín 1/2; parte 2 = E84 rock over)
- **Estado:** borrador renderizado con tiempos SIMULADOS (25-nov). Falta la voz de Andrés (`texto-voz.txt`) → `npm run voz -- E83 --audio …` + `python3 tools/alinear-fw.py E83` → render → `qa-final`.
- **Origen:** réplica del reel en inglés de @boldr.climbing «Carl is a door» (90K, 7,9× su mediana; `radar/boldr.climbing-17966751636208046/`). Guion casi tal cual (decisión 25-nov); quitado: «175 → 88 Nm» y «palanca a la mitad» (sin respaldo).
- **Formato:** información con una sola técnica (bandera) y su porqué; cierre con parte 2 anunciada (objetivo: seguidores). Hilo visual: la línea de la bisagra (roja abre, verde cierra) + barra GIRO (HUD sin cifra). Sonido de firma: chirrido de bisagra (`bisagra`, receta nueva en `tools/sonido.mjs`).
- **Reparto:** **Fermín**, personaje fijo nuevo de la serie de técnica (`src/piezas/Fermin.tsx` sobre el rig `src/piezas/Novato.tsx`): de espaldas, gira la cara por encima del hombro; poses `colgado`, `agarre`, `puerta`, `bandera`, `rockOver`, `rockOverArriba`; `abre` 0–1 = la puerta; `apoyos()` da dónde quedan de verdad manos y pies. Hoja de poses: `npm run fotograma -- _E83bocetos 3.5`.
- **Plantilla:** `LaPuerta` (`src/historias/LaPuerta/`, una escena por archivo: Abre, Bisagra, Gira, Bandera, Contragiro, Llega, Parte2). Fondo claro de rocódromo desde el fotograma 0.
- **Física dibujada:** la bisagra es la línea mano derecha–pie derecho, **inclinada** (la mano más afuera que el pie): con una línea vertical la gravedad no giraría el cuerpo. La palanca se mide en horizontal, del peso a la línea.
- **Seguridad:** el riesgo de torsión está en la rodilla de la pierna de apoyo: rótulo «RODILLA DE APOYO HACIA DONDE APUNTA EL PIE» (≥1,5 s) y en el pie. Bandera estirada y sin carga. Nada de «suelta».
- **QA (simulado):** solo avisos esperados: gancho sin «tú» (identidad «¿eres un Fermín?»), sin bloque «cifras» a propósito, 35,6 s < 45 del formato fijo, datos simulados.
- **Crítico (propuesta v1):** 6, envío 6 (7 con cambios) → aplicado en v2.

## Respaldo
| Afirmación | Fuente / límite |
|---|---|
| Mano y pie del mismo lado = bisagra (efecto puerta) | Técnica estándar: Philarockgym, Movement Gyms, Nicros, Climbing House |
| La bandera acorta la palanca | Pierna ≈16–17 % de la masa (Dempster/Winter): al cruzarla, el centro de masas se acerca a la línea. «Casi la mitad» depende de la postura: no se dice |
| El pie apoyado empuja en contra del giro | Fuerza de contacto del pie de la bandera contra la pared (contragiro) |

## Descripción para publicar
Fermín no es débil. Fermín es una puerta 🚪
Mano y pie del mismo lado = bisagra: la gravedad te gira y te saca de la pared (el efecto puerta). La bandera: pierna libre al otro lado de la línea. Rodilla de apoyo siempre hacia donde apunta el pie.
Parte 2: el rock over. Sígueme para ver si Fermín lo consigue ↓
#escalada #rocodromo #tecnicadeescalada #boulder #ultimopegue

**Comentario fijado:** ¿En qué paso te abres tú como una puerta?

## Resultado
—
