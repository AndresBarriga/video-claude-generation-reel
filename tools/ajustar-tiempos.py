#!/usr/bin/env python3
"""Ajusta los tiempos de palabra de public/datos/<id>.json a las pausas REALES del audio sincronizado (sin Whisper).
Uso: python3 tools/ajustar-tiempos.py E55   (usa guion.json → "frases": palabras por tramo entre pausas del audio final)
Detecta pausas en mono (< -45 dB durante ≥ 0,12 s), reparte las palabras de cada tramo por nº de letras y recalcula
el inicio de cada escena. Hay que volver a ejecutarlo después de cada `npm run voz`."""
import json, subprocess, sys, numpy as np, glob
vid = sys.argv[1]
datos = f"public/datos/{vid}.json"; d = json.load(open(datos))
guion = json.load(open(glob.glob(f"videos/*/{vid}/guion.json")[0]))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "public/" + d["voz"], "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(float) / 32768; w = 320
r = np.array([20 * np.log10(np.sqrt(np.mean(a[i:i + w] ** 2)) + 1e-9) for i in range(0, len(a) - w, w)])
q = r < -45; pausas = []; i = 0
while i < len(q):
    if q[i]:
        j = i
        while j < len(q) and q[j]: j += 1
        if (j - i) * 0.02 >= 0.12: pausas.append((i * 0.02, j * 0.02))
        i = j
    else: i += 1
fin = len(a) / 16000
if pausas and pausas[-1][1] >= fin - 0.1: fin = pausas.pop()[0]
tramos, ini = [], 0.0
for s, e in pausas: tramos.append((ini, s)); ini = e
tramos.append((ini, fin))
fr = guion["frases"]; P = d["palabras"]
assert len(fr) == len(tramos), f"{len(fr)} frases vs {len(tramos)} tramos de audio: {tramos}"
assert sum(fr) == len(P), f"frases suman {sum(fr)} y hay {len(P)} palabras"
k = 0
for n, (t0, t1) in zip(fr, tramos):
    ws = P[k:k + n]; L = [len(x["w"]) + 2 for x in ws]; tot = sum(L); t = t0
    for x, l in zip(ws, L):
        dur = (t1 - t0) * l / tot; x["start"] = round(t, 3); x["end"] = round(t + dur - 0.03, 3); t += dur
    k += n
# inicio de cada escena = primera palabra de esa escena
idx = 0
for e in d["escenas"]:
    e["inicio"] = P[idx]["start"] if idx else 0; idx += len(e["texto"].split())
json.dump(d, open(datos, "w"), ensure_ascii=False, indent=2)
print(f"OK {vid}: {len(tramos)} tramos, escenas en", [round(e["inicio"], 2) for e in d["escenas"]])
