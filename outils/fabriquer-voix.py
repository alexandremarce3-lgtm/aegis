"""Fabrique un fichier MP3 par phrase avec Piper (voix libre fr_FR-siwis-medium, CC BY 4.0).
Usage : sources/voix/env/Scripts/python.exe outils/fabriquer-voix.py
Ne refait que les phrases dont le fichier manque ; supprime les fichiers devenus inutiles."""
import json, os, sys, wave, io
import lameenc
from piper import PiperVoice

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, 'app', 'voix')
os.makedirs(SORTIE, exist_ok=True)
phrases = json.load(open(os.path.join(RACINE, 'sources', 'voix', 'phrases.json'), encoding='utf8'))
voix = PiperVoice.load(os.path.join(RACINE, 'sources', 'voix', 'fr_FR-siwis-medium.onnx'))
faits = 0
for n, p in enumerate(phrases, 1):
    cible = os.path.join(SORTIE, p['id'] + '.mp3')
    if os.path.exists(cible):
        continue
    pcm, freq = b'', 22050
    for morceau in voix.synthesize(p['texte']):
        pcm += morceau.audio_int16_bytes
        freq = morceau.sample_rate
    enc = lameenc.Encoder()
    enc.set_bit_rate(48); enc.set_in_sample_rate(freq); enc.set_channels(1); enc.set_quality(2); enc.silence()
    open(cible, 'wb').write(enc.encode(pcm) + enc.flush())
    faits += 1
    if faits % 50 == 0:
        print(f'{n}/{len(phrases)}', flush=True)
voulus = {p['id'] + '.mp3' for p in phrases}
for f in os.listdir(SORTIE):
    if f.endswith('.mp3') and f not in voulus:
        os.remove(os.path.join(SORTIE, f))
ids = sorted(f[:-4] for f in os.listdir(SORTIE) if f.endswith('.mp3'))
open(os.path.join(RACINE, 'app', 'voix.js'), 'w', encoding='utf8').write(
    "// Généré par outils/fabriquer-voix.py - ne pas modifier à la main.\n"
    "// Voix : Piper fr_FR-siwis-medium, entraînée sur le corpus SIWIS (CC BY 4.0).\n"
    "window.VOIX_IDS = new Set('" + ' '.join(ids) + "'.split(' '));\n")
taille = sum(os.path.getsize(os.path.join(SORTIE, f)) for f in os.listdir(SORTIE))
print(f'{faits} fichiers créés, {len(ids)} au total, {taille / 1e6:.1f} Mo')
