# Fiche relais - cahier de conception

Statut : **à valider par un formateur** - document de conception, aucune ligne de code.
Référence unique : Références techniques nationales PSC (RTN), DGSCGC, juillet 2026, telles qu'intégrées dans `app/fiches.js`.
Règle : on suit l'ordre des RTN, on ne sort pas du protocole. La fiche ne donne aucune consigne nouvelle : elle rappelle les étapes des fiches et note ce qui a été fait.

## 1. But

Pendant l'attente des secours, le témoin note ce qu'il a vu et fait. À l'arrivée des pompiers ou du SAMU, il montre la fiche à l'écran ou fait scanner un QR code.

Base RTN :
- Alerte : informations minimales à transmettre (numéro d'appel, nature du problème, nombre de victimes, localisation).
- Garrot (02FT02) : noter l'heure de pose pour la transmettre au relais.
- Malaises (02PR05) : se renseigner sur l'âge, la durée du malaise, les antécédents, l'état de santé et les traitements, puis transmettre fidèlement.

## 2. Moment d'utilisation

Jamais avant d'avoir protégé, alerté et fait les gestes. La fiche s'ouvre :
- depuis le mode « Je porte secours » : chaque étape validée enregistre son heure ;
- depuis un onglet « Fiche relais », pendant l'attente, pour compléter.

Message permanent en haut de la fiche : « Appelez le 15, le 18 ou le 112 » et « Aegis ne remplace pas une formation ».

## 3. Contenu de la fiche

| Bloc | Champs | Saisie | Fiche RTN |
|---|---|---|---|
| Alerte | heure de l'appel, numéro appelé (15, 18, 112, 114), nature du problème, nombre de victimes, lieu | boutons + texte court | Alerte (07-2026) |
| Victime | nom et prénom (si la victime ou l'entourage peut les donner, sinon « inconnu ») ; âge, ou à défaut catégorie selon la morphologie (nourrisson, enfant, adulte) ; sexe : homme, femme, autre, non renseigné | texte + boutons | Malaises 02PR05 (âge), Informations générales (morphologie) |
| Constat | répond ou réagit : oui / non ; respire : oui / non / respiration anormale ; saigne abondamment : oui / non ; s'étouffe : oui / non | oui / non | 02PR04, 02PR03, 02PR01, 02PR02 |
| Zones atteintes | schéma du corps face et dos, zones à toucher (tête, cou, thorax, abdomen, dos, bras gauche, bras droit, jambe gauche, jambe droite) | toucher | Plaies 02PR06, Brûlures 02PR07, Traumatismes 02PR08 |
| Gestes faits | chacun avec son heure : compression, garrot (heure de pose), claques dans le dos, compressions abdominales ou thoraciques, PLS, laissée sur le dos (traumatisme), début de RCP, DAE posé, nombre de chocs, arrosage d'une brûlure (heure de début) | case + heure automatique, modifiable | fiches PR et FT correspondantes |
| Malaise | durée, malaise déjà connu, traitements, prise du traitement ou de sucre à la demande | texte court | Malaises 02PR05 |
| Observations | texte libre court | texte | - |

Ne figure pas sur la fiche : diagnostic, interprétation, élément propre à une formation interne.

## 4. Liste de rappel « Avez-vous pensé à… ? »

Questions oui / non posées **dans l'ordre des fiches RTN**, reprises du mode pas à pas (`app/parcours.js`). Chaque question renvoie à l'étape de la fiche ; aucune n'est une consigne nouvelle.

1. Protection : danger écarté ou zone balisée ? (Protection)
2. Saignement abondant ? Si oui : compression faite ? alerte donnée ? garrot seulement si la compression est inefficace ou impossible, avec l'heure notée ? (02PR01, 02FT01, 02FT02)
3. Étouffement ? Si oui : suivi de la fiche obstruction (claques, puis compressions) ? (02PR02)
4. La victime répond ou réagit ? Si non : aide demandée, allongée sur le dos, voies aériennes libérées, respiration recherchée 10 secondes ? (02PR04, 02PR03)
5. Elle respire : PLS (événement non traumatique) ou laissée sur le dos (traumatisme ou origine inconnue), alerte, surveillance ? (02PR04, 02FT10)
6. Elle ne respire pas ou respiration anormale : alerte, RCP, DAE ? (02PR03, 02FT07, 02FT08, 02FT09)
7. Elle répond : malaise, plaie, brûlure ou traumatisme - conduite de la fiche correspondante ? (02PR05 à 02PR08)
8. Dans tous les cas : protégée du froid, de la chaleur ou des intempéries, surveillée, secours rappelés en cas d'aggravation ?

Les libellés exacts seront tirés des phrases des fiches, comme pour le mode pas à pas, et contrôlés par un test.

## 5. QR code et vie privée

- Contenu du QR code : texte brut en français, lisible par l'appareil photo de n'importe quel téléphone, sans application, sans serveur, sans réseau.
- En tête du texte : « Informations notées par un témoin - non vérifiées - Aegis ».
- Même contenu affiché en gros caractères à l'écran (lecture directe ou à voix haute).
- Données stockées uniquement sur le téléphone. Bouton « Effacer » toujours visible. Effacement automatique 24 heures après la création de la fiche.
- Rien n'est envoyé. Mise à jour de la page Vie privée. Avis juridique conseillé avant mise en ligne (données de santé d'un tiers).

## 6. Accessibilité

Zones du schéma avec un nom lisible par un lecteur d'écran, grandes cibles tactiles, contrastes AA, aucune information portée par la couleur seule.

## 7. Décisions

- 25/11/2026 - Ordre des RTN, sans sortir du protocole.
- 25/11/2026 - Informations d'alerte : les 4 informations minimales des RTN, sans formule mnémotechnique hors RTN.
- 25/11/2026 - Schéma du corps à zones, dessin original (pas de reprise d'un document interne).
- 25/11/2026 - Identité : nom, prénom, âge (ou âge approximatif / morphologie si la victime ne peut pas répondre) ; sexe avec les choix homme, femme, autre, non renseigné (le choix « autre » n'est pas dans les RTN, ajouté par décision du formateur).
- 25/11/2026 - Effacement automatique après 24 heures, bouton « Effacer » toujours visible.

## 8. À valider

- [ ] Liste des gestes du bloc « Gestes faits » complète et conforme aux RTN.
- [ ] Test d'une maquette par un contact SDIS ou SAMU.
