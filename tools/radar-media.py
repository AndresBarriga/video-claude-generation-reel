"""Radar: material para desmontar los outliers sin que Andrés pase vídeos.
Lee datos/radar.json; por cada reel ≥3× su mediana aún sin procesar (máx. 8 por ejecución) baja el MP4 a /tmp,
saca fotogramas (1/s los primeros 5 s, luego 1 cada 3 s; 360 px) y transcribe la voz con faster-whisper.
Guarda radar/<cuenta>-<id>/: f_XXs.jpg, transcripcion.txt (con tiempos), pie.txt, meta.json. El MP4 no se guarda.
Uso (lo corre la Action «Radar de virales»): pip install faster-whisper && python3 tools/radar-media.py
Si el dueño desactivó descargas, la API no da el vídeo: queda meta.json con "sin_video": true.
"""
import json, os, subprocess, sys, urllib.request

MAX, RATIO = 8, 3
radar = json.load(open("datos/radar.json"))
pendientes = []
for c in radar["cuentas"]:
    for t in c["top"]:
        d = f"radar/{c['user']}-{t['id']}"
        if t.get("ratio") and t["ratio"] >= RATIO and not os.path.exists(f"{d}/meta.json"):
            pendientes.append((d, c, t))
pendientes.sort(key=lambda x: -x[2]["ratio"])
pendientes = pendientes[:MAX]
if not pendientes:
    print("Radar media: nada nuevo"); sys.exit(0)

modelo = None
def transcribir(mp4):
    global modelo
    if modelo is None:
        from faster_whisper import WhisperModel
        modelo = WhisperModel("small", device="cpu", compute_type="int8")
    segs, info = modelo.transcribe(mp4, beam_size=5, vad_filter=True)
    return info.language, "\n".join(f"[{s.start:5.1f}–{s.end:5.1f}] {s.text.strip()}" for s in segs)

for d, c, t in pendientes:
    os.makedirs(d, exist_ok=True)
    meta = {k: t[k] for k in ("url", "fecha", "vistas", "likes", "comentarios", "ratio")}
    meta.update(cuenta=c["user"], seguidores=c["seguidores"], mediana_cuenta=c["mediana"])
    open(f"{d}/pie.txt", "w").write(t.get("pie_completo") or t.get("pie") or "")
    if not t.get("video"):
        meta["sin_video"] = True
    else:
        mp4 = "/tmp/radar.mp4"
        try:
            urllib.request.urlretrieve(t["video"], mp4)
            dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4],
                                       capture_output=True, text=True).stdout or 0)
            meta["duracion_s"] = round(dur, 1)
            momentos = [0.3, 1, 2, 3, 4, 5] + [x for x in range(8, int(dur), 3)] + ([round(dur - 0.5, 1)] if dur > 6 else [])
            for s in momentos[:24]:
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s), "-i", mp4, "-frames:v", "1", "-vf", "scale=360:-2",
                                "-q:v", "6", f"{d}/f_{s:05.1f}s.jpg"], check=False)
            lang, txt = transcribir(mp4)
            meta["idioma"] = lang
            open(f"{d}/transcripcion.txt", "w").write(txt)
        except Exception as e:  # URL caducada, vídeo sin audio…
            meta["error"] = str(e)[:200]
        finally:
            if os.path.exists(mp4): os.remove(mp4)
    json.dump(meta, open(f"{d}/meta.json", "w"), ensure_ascii=False, indent=1)
    print(f"{d}: {meta.get('duracion_s', '-')} s, {'sin vídeo' if meta.get('sin_video') else meta.get('error', 'ok')}")
