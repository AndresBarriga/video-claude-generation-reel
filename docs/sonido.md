# Capa de sonido

Cada vídeo puede tener `videos/<nicho>/<id>/sonido.json`. La voz va siempre por encima: mientras se habla, los efectos bajan (`bajoVoz`).

```
npm run sonido -- E15   # genera los efectos en public/sonido/E15/ (también lo hace npm run render)
npm run voz -- E15 ...  # copia sonido.json a los datos del vídeo (hay que volver a ejecutarlo si cambias sonido.json)
```

## Sustituir un efecto por uno propio
Deja un archivo con el **mismo nombre** en `videos/<nicho>/<id>/sonido/` (wav, mp3, m4a u ogg), p. ej. `videos/escalada/E15/sonido/viento.mp3`, y ejecuta `npm run sonido -- E15`. Se usa el tuyo en vez del generado.

## Efectos generados por código (`tools/sonido.mjs`)
`viento` (bucle) · `crujido` (cuerda en tensión, bucle) · `chasquido` (corte) · `golpe` (impacto + nieve) · `latido` (bucle) · `campamento` (fuego + viento suave, bucle) · `nieve` (nieve que cede, bucle). Para uno nuevo, añade una receta en `RECETAS`.

## Formato de `sonido.json`
```json
{
  "bajoVoz": 0.45,
  "efectos": [
    { "nombre": "viento", "inicio": { "escena": 0 }, "fin": { "escena": "corte" }, "volumen": 0.35, "bucle": true, "fundido": [0.3, 0.1] },
    { "nombre": "chasquido", "inicio": { "escena": "corte", "palabra": "Cortó", "mas": 0.3 }, "duracion": 1.5, "volumen": 1, "ignoraSilencio": true },
    { "silencio": true, "inicio": { "escena": "corte", "mas": 0.45 }, "duracion": 1.1 }
  ]
}
```
- **Anclas** (`inicio`, `fin`): `escena` = índice (0 = primera) o id de `visual` (`"navaja#2"` = segunda vez que aparece); `palabra` = la primera vez que se dice dentro de esa escena; `fraccion` = 0–1 dentro de la escena; `final: true` = final de la escena; `mas` = segundos a sumar (puede ser negativo).
- Sin `fin` ni `duracion`, el efecto dura hasta el final del vídeo.
- `fundido`: [entrada, salida] en segundos. `bajoVoz`: cuánto baja mientras hay voz (0 = nada, 1 = se apaga).
- `silencio: true` apaga los demás efectos durante `duracion` (y vuelven con un fundido de 0,5 s), salvo los que tengan `ignoraSilencio`.
