# E46 «¿Llega tu cuerda?» (rapel)

**Estado:** v7 (5-nov, 18:30): rehecho tras feedback de Andrés (reunión en vez de suelo, puño en vez de dispositivo, gancho en primera persona, «¿Cuántos metros tiene tu cuerda?» por doble sentido, pausa tras cada frase para sincronía). Pendiente: regrabar voz con `texto-voz.txt` y renderizar. Antes de publicar, comprobar si el Servicio de Parques ya ha publicado informe del caso Balin Miller (a 5-nov no hay informe final).
**Escenario (v8):** pilar de roca visto de frente sobre un mar de nubes, hora azul; gancho = plano general de escala + inserto en primera persona (puño, extremo, reunión) + vuelta al escalador. Silueta del caso real en la misma pared.
**Formato:** consejo de seguridad con caso real, fórmula A (tú + situación + mecanismo visible). Plantilla `Rapel` (`src/historias/Rapel/`).
**Mensaje:** antes de bajar un rapel, comprueba que la cuerda llega a la siguiente reunión (no al suelo): cuerda doblada = más del doble de esa distancia, y nudo en los dos extremos. Problema del espectador: bajar cansado sin saber si la cuerda llega. Identificación: «último rapel del día, reventado».
**Las 4 preguntas:** 1) Gancho: tú en el último rapel con el extremo de la cuerda lejos del suelo y «todavía no lo sabes». 2) Rehook: el caso real (23 años, testigo, emitido por TikTok) y Gobright 2019 (no es de novatos). 3) Hasta el final: el consejo con cifras (60 m > 2 × 25 m) y la pregunta «¿cuánto mide la tuya?». 4) Lo que busca la gente: «Balin Miller», «El Capitán», «rapel»; se usa el nombre y el hecho de la emisión, sin mostrar vídeo ni cuerpo.
**Revisión del crítico:** v4 5,5/10 (viralidad 9/14); v5/v6 revisión de errores aplicada (atribución, «se emitió», Gobright). El crítico ya no es corte (5-nov). Autopuntuación v6 ≈10/14.
**Hechos y fuentes (en la descripción, no en pantalla):** AP / Fox / Daily Beast / Daily Dot (Balin Miller, 1-oct-2025; testigo Tom Evans: la cuerda no llegaba al saco atascado y se fue por el extremo; NPS investiga); AAC, *Accidents in North American Mountaineering* (Gobright, 27-nov-2019, extremos desiguales sin nudos; el análisis dice «strongly suggests»); Petzl (nudo en el extremo con fatiga/rapel largo); regla de la cuerda doblada.
**Cuidado:** no se afirma que Miller no hiciera nudo ni que estuviera cansado; la emisión: hay discrepancia sobre si era suya o de otra cuenta, por eso «se emitió». Sin cuerpo, cara ni impacto: silueta que sale de plano.

## Publicación
**Descripción:**
Antes de bajar en rapel: comprueba que la cuerda llega a la siguiente reunión (la próxima parada con anclajes), no al suelo. Con la cuerda doblada, tiene que medir más del doble de esa distancia. Y un nudo en cada extremo, siempre: te para antes de irte por la punta.

Nunca te olvides del nudo. Mándaselo a quien baja contigo 👇

Caso: Balin Miller, El Capitán (1-oct-2025). Según un testigo, bajaba en rapel con una cuerda que se quedó corta y se fue por el extremo; el Servicio de Parques investiga. Brad Gobright (2019): análisis del American Alpine Club sobre extremos desiguales y rapel sin nudos. Fuentes: AP, Fox News, Daily Beast, Daily Dot, American Alpine Club (ANAM), Petzl.

**Comentario fijado:** ¿Haces siempre el nudo en los dos extremos? Etiqueta a quien baja contigo y no lo hace.
**Hashtags:** #escalada #rapel #seguridadenescalada #nudo #escaladaespañola


## v9 (5-nov)
Gancho nuevo: cuenta atrás «QUEDAN 12→4 m» + latido + viñeta roja; «la siguiente parada está a quince» con línea discontinua. Cierre: el nudo frena a la figurita («EL NUDO TE PARA»). Directo de TikTok dentro del caso. Voz regrabada y alineada (18 tramos manuales: guion.json `frases` + `frasesManual` + `minSilencio` 0,22). Críticas: crítico 5,5 (gancho adivinable, 2 casos); se descartó su gancho POV (rechazado por Andrés).

## v10 (5-nov)
Apertura con zoom al extremo de la cuerda; caída de 15 m grande con cámara que baja; cierre «NUNCA OLVIDES EL NUDO» sobre la figurita parada. Audio de Andrés recortado tras «…por la punta.» (+2 s de silencio) para no regrabar; si regraba con «Nunca te olvides del nudo.», restaurar esa frase en guion.json y `frases` (+5 palabras).
