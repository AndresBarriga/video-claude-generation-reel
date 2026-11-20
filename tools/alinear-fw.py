#!/usr/bin/env python3
"""Sincronía palabra a palabra con faster-whisper (sin whisper.cpp): transcribe la voz ya apretada (public/voz/<id>.mp3),
alinea las palabras reconocidas con las del guion y escribe start/end en public/datos/<id>.json (y el inicio de cada escena).

Uso: python3 tools/alinear-fw.py <id>   (después de `npm run voz`; sustituye a `frases` + ajustar-tiempos.py)
Modelo: carpeta CTranslate2 en $WHISPER_CT2 (por defecto /tmp/wmodel). En la nube de Claude Hugging Face está bloqueado:
el modelo «small» int8 se baja de npm (@skillninja/shortmovie-telop-model-p0..p3, se concatenan model.bin.part0..3 y se
comprueba model.sha256). Necesita `pip install faster-whisper`.
"""
import difflib, json, os, re, sys, unicodedata

vid = sys.argv[1]
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
datos = os.path.join(raiz, "public", "datos", f"{vid}.json")
d = json.load(open(datos))
P = d["palabras"]

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-zñ0-9]", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))

from faster_whisper import WhisperModel
modelo = WhisperModel(os.environ.get("WHISPER_CT2", "/tmp/wmodel"), device="cpu", compute_type="int8")
guion_txt = " ".join(x["w"] for x in P)
import subprocess, numpy as np
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(raiz, "public", d["voz"]), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
audio = np.frombuffer(raw, np.float32)
segs, _ = modelo.transcribe(audio, language="es", word_timestamps=True, beam_size=5)  # sin initial_prompt: con el guion como prompt Whisper se salta el principio
R = [w for s in segs for w in s.words]
rn = [norm(w.word) for w in R]
gn = [norm(x["w"]) for x in P]
# Las cifras dichas pueden salir escritas en dígitos: se comparan por texto normalizado y lo que no casa se interpola.
sm = difflib.SequenceMatcher(a=gn, b=rn, autojunk=False)
t = [None] * len(P)
for a, b, n in sm.get_matching_blocks():
    for k in range(n): t[a + k] = (R[b + k].start, R[b + k].end)
casadas = sum(x is not None for x in t)
# Interpolar las que no casan entre vecinas conocidas (por número de letras)
i = 0
while i < len(P):
    if t[i] is not None: i += 1; continue
    j = i
    while j < len(P) and t[j] is None: j += 1
    t0 = t[i - 1][1] if i > 0 else 0.0
    t1 = t[j][0] if j < len(P) else d["duracion"]
    L = [len(gn[k]) + 1 for k in range(i, j)]; tot = sum(L); c = t0
    for k, l in zip(range(i, j), L):
        dur = (t1 - t0) * l / tot; t[k] = (c, c + dur); c += dur
    i = j
for x, (s, e) in zip(P, t):
    x["start"], x["end"] = round(float(s), 3), round(float(e), 3)
idx = 0
for e in d["escenas"]:
    e["inicio"] = P[idx]["start"] if idx else 0; idx += len(e["texto"].split())
json.dump(d, open(datos, "w"), ensure_ascii=False, indent=2)
print(f"OK {vid}: {casadas}/{len(P)} palabras casadas con Whisper; escenas en", [round(e["inicio"], 2) for e in d["escenas"]])
