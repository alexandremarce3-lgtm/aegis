"""Repère les passages modifiés en 2026 : ceux que le PDF officiel des RTN PSC surligne en jaune.
Les RTN précisent que les passages modifiés sont surlignés et que les suppressions ne sont pas signalées.
Chaque ligne surlignée est rattachée au bloc de app/fiches.js qui la contient (fiche déduite de la page).
Usage : python3 -I outils/extraire-nouveautes.py chemin/vers/RTN_PSC_juillet-2026.pdf
Écrit app/nouveautes.js. Nécessite pdfplumber."""
import json, os, re, sys, unicodedata
import pdfplumber

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JAUNE = (1.0, 1.0, 0.0)


def norm(s):
    s = s.replace('’', "'").replace(' ', ' ')
    s = re.sub(r'(?<=[^\W\d_])\d+\b', '', s)          # appels de note collés aux mots : « noter1 »
    s = re.sub(r'^[\s•o§-]+', '', s)  # puces
    s = re.sub(r'^\d \s*(?=\D)', '', s)               # numéro d'une note de bas de page
    return re.sub(r'\s+', ' ', s).strip().lower()


def charger_fiches():
    txt = open(os.path.join(RACINE, 'app', 'fiches.js'), encoding='utf8').read()
    return json.loads(txt[txt.index('['):txt.rindex(']') + 1])


def pages_de_debut(pdf):
    """Page de début de chaque fiche, lue dans le sommaire (lignes « ... PSC Titre ____ 15 »)."""
    debuts = []
    for p in pdf.pages[2:5]:
        for ligne in (p.extract_text() or '').split('\n'):
            m = re.search(r'\] PSC\s*(.+?)\s*_{3,}\s*(\d+)$', ligne)
            if m:
                debuts.append(int(m.group(2)))
    return debuts


def lignes_surlignees(page):
    zones = [r for r in page.rects if r.get('fill') and tuple(r.get('non_stroking_color') or ()) == JAUNE]
    if not zones:
        return []
    lignes = {}
    for w in page.extract_words(use_text_flow=True):
        cx, cy = (w['x0'] + w['x1']) / 2, (w['top'] + w['bottom']) / 2
        if any(z['x0'] - 1 <= cx <= z['x1'] + 1 and z['top'] - 1 <= cy <= z['bottom'] + 1 for z in zones):
            lignes.setdefault(round(w['top']), []).append(w['text'])
    return [' '.join(v) for _, v in sorted(lignes.items())]


def main(chemin):
    fiches = charger_fiches()
    pdf = pdfplumber.open(chemin)
    debuts = pages_de_debut(pdf)
    if len(debuts) != len(fiches) + 1:  # + la fiche du chapitre 03, non reprise dans l'appli
        sys.exit(f'Sommaire inattendu : {len(debuts)} fiches lues pour {len(fiches)} dans fiches.js')
    resultat, orphelines = {}, []
    for k, f in enumerate(fiches):
        if f['maj'] != '07-2026':
            continue  # surlignages d'une mise à jour antérieure (la date de la fiche fait foi)
        textes = [(b['t'], norm(' '.join([b['t']] + b.get('n', []) + ([b['d']] if b.get('d') else [])))) for b in f['blocks']]
        for num in range(debuts[k], debuts[k + 1]):
            for ligne in lignes_surlignees(pdf.pages[num - 1]):
                n = norm(ligne)
                if len(n.split()) < 3 or re.fullmatch(r'[\d\-\]\s]+', n):
                    continue  # fragments trop courts pour être rattachés sans ambiguïté
                blocs = [t for t, nt in textes if n in nt]
                if not blocs:
                    # Le PDF déplace parfois un mot (appel de note, exposant) : on accepte le bloc qui contient
                    # au moins 80 % des mots de la ligne, s'il est le seul dans ce cas.
                    mots = re.findall(r'[^\W\d_]{3,}', n)
                    bons = [t for t, nt in textes if mots and sum(m in nt for m in mots) / len(mots) >= 0.8]
                    blocs = bons if len(bons) == 1 else []
                if not blocs:
                    orphelines.append(f"{f['id']} p.{num} : {ligne}")
                    continue
                liste = resultat.setdefault(f['id'], [])
                if blocs[0] not in liste:
                    liste.append(blocs[0])
    sortie = os.path.join(RACINE, 'app', 'nouveautes.js')
    with open(sortie, 'w', encoding='utf8') as o:
        o.write('// Généré par outils/extraire-nouveautes.py - ne pas modifier à la main.\n'
                '// Blocs des fiches contenant un passage surligné (modifié) dans les RTN PSC de juillet 2026.\n'
                'window.NOUVEAUTES = ' + json.dumps(resultat, ensure_ascii=False, indent=1) + ';\n')
    print(sum(len(v) for v in resultat.values()), 'blocs marqués dans', len(resultat), 'fiches')
    if orphelines:
        print(len(orphelines), 'lignes surlignées non rattachées :')
        print('\n'.join(orphelines))


if __name__ == '__main__':
    main(sys.argv[1])
