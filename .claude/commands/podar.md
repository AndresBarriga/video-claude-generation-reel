---
description: Poda el guion línea por línea: fuera todo lo que no ayude a entender la idea; ritmo apretado
argument-hint: "<id>"
---
Poda `$ARGUMENTS` (lee `videos/*/<id>/guion.json`) con tres reglas de Andrés:

1. **Línea por línea, lo que no ayude a entender la idea, fuera.** Escribe primero el mensaje del vídeo en una línea. Después una tabla con **cada línea** de `texto` (y cada `titulo`): `nº | línea | qué entiende el espectador gracias a ella | queda / fuera / acortar`. Pregúntate por línea: si la quito, ¿se pierde la idea, la causa visible, el rehook o el bucle? Si no, fuera. Adornos, contexto repetido, doble explicación, transiciones vacías y datos que no cambian lo que el espectador piensa, fuera.
   - **No se poda:** el gancho (segundo 1), el rehook, la pregunta final/bucle, la fuente o el estado legal exigidos en `docs/proceso.md` y los avisos de salud o seguridad.
   - Si dos líneas dicen lo mismo, queda la más concreta. Si una línea se puede decir con la mitad de palabras, acórtala.
2. **Rótulos (`titulo`): nunca menos de 0,8 s en pantalla** y ≥0,3 s por palabra. Si una escena es tan corta que su rótulo no cabe, o se alarga la escena o se quita el rótulo (un rótulo que no se lee sobra).
3. **Ningún silencio de la voz de más de 0,26 s.** Solo se admiten las pausas declaradas con `"pausa"` en el guion (el silencio antes del clímax). `npm run voz` ya aprieta el audio al sincronizarlo; en `guion.json` usa `pausaFrase` ≤ 0,3 si quieres que ElevenLabs no las alargue.

Aplica los cortes en `guion.json`, comprueba que sigue cumpliendo `docs/viralidad.md` (≥12/14) y ejecuta `npm run texto -- <id>` y `npm run qa -- <id>`. Entrega en pocas líneas: palabras antes → después, duración estimada y la lista de lo que quitaste (una línea cada una, para que Andrés pueda recuperar algo). Si el vídeo ya tenía audio, avisa de que hay que regenerar la voz. Commit + push.
