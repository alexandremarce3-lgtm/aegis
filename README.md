# Aegis - premiers secours

Application web gratuite et open source (PWA) qui rappelle les gestes de premiers secours du citoyen, à partir des **références techniques nationales « Premiers Secours Citoyen » (RTN PSC) de la DGSCGC, édition juillet 2026**.

**Appelez le 15, le 18 ou le 112. Aegis ne remplace pas une formation.**

Application : https://alexandremarce3-lgtm.github.io/aegis/app/

---

## Ce que fait l'application

**Intervenir**
- Écran d'accueil avec les situations courantes (étouffement, saignement abondant, ne répond pas, malaise, plaie, brûlure, chute ou fracture, saignement de nez, alerter, protéger) et une recherche par mots ou à la voix (reconnaissance vocale du navigateur).
- Mode **pas à pas** pour 8 situations : une étape par écran, avec les choix à faire (par exemple « répond-il ? », « respire-t-il ? ») et le détail du geste au moment où il sert. Chaque étape est une phrase des fiches RTN, sans réécriture.
- **Rythme des compressions** : signal sonore et visuel à 110 par minute (la fiche demande entre 100 et 120). Pas de minuteur de relais : quand un DAE est posé, c'est lui qui rythme les analyses.
- **Bilan** : un écran « que vérifier, dans quel ordre ? » (danger, saignement, étouffement, répond-elle, puis malaise, plaie, brûlure, chute), dans l'ordre des fiches RTN, avec renvoi au pas à pas ou à la fiche.
- **Fiche relais pour les secours** : le témoin note l'alerte, l'identité de la victime (nom, prénom, âge ou allure nourrisson / enfant / adulte, sexe), ce qu'il a constaté, les zones blessées sur un schéma du corps, les gestes faits avec leur heure, et les observations. Les étapes validées en pas à pas et les appels passés depuis l'appli s'ajoutent seuls au déroulé. La fiche s'affiche en texte et en QR code lisible par l'appareil photo des secours, sans réseau. Elle reste sur le téléphone et s'efface automatiquement après 24 heures. Elle peut aussi être remplie à la main depuis l'accueil (bouton « Nouvelle fiche » pour repartir de zéro).
- **Minuteurs** : saignement de nez (10 minutes) ; brûlure (10 minutes, relançable une fois pour atteindre 20 minutes, comme le précise la fiche).
- Lecture à voix haute des consignes : voix enregistrée (Piper, fr_FR-siwis-medium), sinon voix de l'appareil.

**Fiches**
- Les 25 fiches des RTN PSC (chapitres 1 et 2) reproduites **sans modification**, avec leur numéro, leur date de mise à jour et leurs notes. Texte vérifié mot pour mot avec le PDF officiel le 25/11/2026.
- **Nouveautés 2026** : les passages modifiés dans l'édition de juillet 2026 (surlignés dans le document officiel) sont surlignés dans les fiches, signalés dans la liste et regroupés sur une page « Nouveautés 2026 ».

**Se former**
- Guide « Bien remplir la fiche relais » (rubrique par rubrique, erreurs fréquentes, exemple inventé) et fiche d'entraînement marquée « EXERCICE », rangée à part de la vraie fiche.
- Quiz de 63 questions sur 9 thèmes. La bonne réponse est toujours un extrait exact de la fiche citée ; les mauvaises réponses sont rédigées pour l'appli. Points, niveaux et étoiles enregistrés sur le téléphone.

**Mode moins de 10 ans**
- Une phrase par écran, avec un dessin et un gros bouton « Écouter ». Les phrases viennent du guide de l'Éducation nationale « Quelques repères pour apprendre à porter secours » (APS, 2022), écrit pour les enfants. Quiz adapté : reconnaître la situation, les gestes, les numéros d'urgence (15, 17, 18, 112).

**Défibrillateurs**
- Carte et liste des défibrillateurs proches (base nationale des défibrillateurs du ministère de la Santé, via data.gouv.fr ; fond de carte OpenStreetMap). Nécessite le réseau et la localisation.

**Toujours visible**
- Barre d'appel 15, 18, 112 et 114 (liens d'appel directs, sans envoi de position) et rappel « Appelez le 15, le 18 ou le 112 - Aegis ne remplace pas une formation ».

**Hors ligne et vie privée**
- Fiches, pas à pas et quiz fonctionnent sans réseau une fois l'appli ouverte une première fois.
- Pas de compte, pas de publicité, aucune donnée collectée par l'éditeur. Seules la carte des défibrillateurs (zone envoyée à data.gouv.fr) et la recherche à la voix (service du navigateur) font appel à un service extérieur.
- Pages légales dans l'appli, disponibles hors ligne : mentions légales, confidentialité (RGPD), conditions d'utilisation, accessibilité, licences et sources.

## Ce qui manque encore

- Test de la fiche relais par des secouristes professionnels (SDIS, SAMU).
- Relecture juridique des pages légales.
- Mode Révision (fiches mémo, études de cas) et mode Formateur (déroulé, scénarios, grille d'évaluation, débriefing).
- Audit complet d'accessibilité (contrastes, taille du texte, lecteur d'écran).
- Voix enregistrées hors ligne : elles ne sont gardées qu'après une première écoute ; sans réseau, la voix de l'appareil prend le relais.
- Relecture de l'ensemble du contenu par un formateur : le statut est « à valider par un formateur ».

Le détail est dans `docs/analyse-ecarts.md`.

## Sources

- Fiches, pas à pas, quiz : RTN PSC, DGSCGC, juillet 2026.
- Mode moins de 10 ans : guide APS de l'Éducation nationale (DGESCO, 2022), seule exception aux RTN, retenue car rédigée pour les enfants. Leur préface précise qu'elles peuvent produire des effets de droit ; Aegis suit toujours leur édition la plus récente (voir `CONTRADICTIONS.md`).
- Libellés de l'accueil, mots-clés de recherche, dessins et mauvaises réponses du quiz : ajoutés pour l'appli.

## Stack technique

- HTML, CSS et JavaScript sans framework ni étape de compilation (`app/`).
- Service worker pour le hors ligne (`app/sw.js`), manifeste PWA.
- Leaflet (chargé depuis unpkg) pour la carte ; QR code généré dans l'appli par qrcode-generator (MIT, `app/lib/`) ; page de présentation `index.html` avec Tailwind CSS (CDN).
- Outils : `outils/construire-donnees.mjs` (base `data/`), `outils/extraire-nouveautes.py` (passages surlignés des RTN, nécessite le PDF officiel et pdfplumber).
- Base de connaissances `data/` : une fiche JSON par conduite à tenir et par geste, générée depuis les fiches officielles (`node outils/construire-donnees.mjs`).

## Lancer en local et tester

```bash
git clone https://github.com/alexandremarce3-lgtm/aegis.git
```

```bash
cd aegis/app && python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000. Tests (Node 18 ou plus, aucune dépendance) :

```bash
npm test
```

Les tests vérifient notamment que chaque texte affiché vient mot pour mot des fiches officielles, que `data/` est à jour, et qu'aucun document privé n'est publié.

## Licence

MIT - voir `LICENSE`. Voix Piper : modèle fr_FR-siwis-medium, corpus SIWIS sous licence CC BY 4.0.
