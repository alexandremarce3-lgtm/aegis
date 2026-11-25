# Analyse des écarts - Aegis face aux RTN PSC 2026

Date : 25/11/2026. Référence unique : RTN PSC, DGSCGC, juillet 2026 (voir `CONTRADICTIONS.md`, décision du 25/11/2026).
Statut : à valider par un formateur.

## 1. Contenu médical

| Point | Constat | Gravité |
|---|---|---|
| Texte des 25 fiches | identique mot pour mot au PDF des RTN 2026 (contrôle du 25/11/2026) | conforme |
| Nouveautés 2026 (RCP enfant et nourrisson sans insufflations initiales, deux pouces, heure du garrot, reprise RCP sans attendre le DAE) | présentes | conforme |
| Fiches datées 12-2022, 07-2023, 12-2023 (Informations générales, DAE, Manœuvres physiques, Protection, Défibrillation) | dates portées par les RTN elles-mêmes : à jour | conforme |
| Mode pas à pas | chaque étape est une phrase des fiches (test) | conforme |
| Quiz « Se former » | bonnes réponses = extraits exacts des fiches (test) ; mauvaises réponses rédigées pour l'appli | conforme |
| Minuteur brûlure | 10 min ; les RTN disent « au moins 10 minutes, idéalement 20 » | incomplet |
| Métronome RCP | 110 par minute, dans la plage 100 à 120 des RTN | conforme |
| Relais du massage toutes les 2 minutes (02FT07, 02PR03) | pas de minuteur | manquant |
| Chapitre 03 des RTN (obligations pour les formations) | non repris | manquant (utile au mode Formateur) |
| Préface des RTN (portée juridique des références) | non mentionnée | manquant (page À propos) |
| Mode moins de 12 ans | repose sur le guide APS de l'Éducation nationale (2022), pas sur les RTN | à décider |

## 2. Sources et versions

| Point | Constat |
|---|---|
| Fiches | source, code et date de mise à jour affichés sous chaque fiche |
| Statut « à valider par un formateur » | affiché nulle part dans l'appli |
| Libellés et mots-clés de l'accueil (`situations.js`), dessins (`dessins.js`) | ajouts de l'appli, sans source - signalés dans la page À propos |
| Mauvaises réponses du quiz | rédigées pour l'appli, non sourcées (par nature) |
| Suivi des versions | aucun bandeau « fiche modifiée en 2026 » ; les passages surlignés des RTN permettent de le construire |

## 3. Messages obligatoires

| Message | Constat |
|---|---|
| « Appelez le 15, le 18 ou le 112 » | barre d'appel 15 / 18 / 112 / 114 toujours visible ; phrase complète seulement en tête des procédures |
| « Aegis ne remplace pas une formation » | seulement dans la page À propos | 

## 4. Site et documentation

| Point | Constat |
|---|---|
| README | annonce un « partage de géolocalisation » avec l'appel : l'appli ne le fait pas (lien `tel:` simple) ; section « Stack technique » vide ; « Quizz » mal orthographié |
| Page d'accueil `index.html` | pas de contenu médical chiffré ; titre « Quizz de Rappel » |

## 5. Hors ligne et accessibilité (premier relevé, audit complet à faire)

| Point | Constat |
|---|---|
| Fiches, pas à pas, quiz | en cache dès l'installation |
| Voix enregistrées (354 fichiers, 8,6 Mo) | mises en cache seulement après une première écoute : sans réseau, lecture par la voix de l'appareil |
| Carte des défibrillateurs | réseau nécessaire (data.gouv.fr, OpenStreetMap) - normal |
| Accessibilité | `lang="fr"`, libellés ARIA sur les boutons d'en-tête et de recherche ; contrastes, taille du texte et lecteur d'écran non audités |

## 6. À faire valider par le formateur

- [x] Statut « à valider par un formateur » affiché sous chaque fiche (fait le 25/11/2026).

## 7. Décisions du 25/11/2026 et suites

- Minuteur brûlure : 10 minutes, relançable une fois pour atteindre 20 minutes - fait.
- Massage : rythme sonore seul, pas de minuteur de relais (le DAE rythme les analyses toutes les 2 minutes) - inchangé.
- Portée juridique des RTN : ajoutée dans la page À propos - fait.
- « Aegis ne remplace pas une formation » : rappel permanent au-dessus de la barre d'appel, sous chaque fiche et dans le mode moins de 10 ans - fait.
- README : réécrit pour décrire exactement l'appli, ses ajouts et ses manques - fait.
- Voix : la voix de l'appareil suffit sans réseau - pas de téléchargement des voix.
- Mode jeune : seuil à 10 ans - fait. Les phrases restent celles du guide APS de l'Éducation nationale, écrit pour les enfants (décision du formateur, 25/11/2026) : seule exception aux RTN. Avis de la DGSCGC à demander par le formateur une fois l'appli aboutie. Le seuil de 10 ans n'est pas écrit dans les RTN : source publique à confirmer.
- Fiche relais : le QR code ouvre la fiche mise en forme sur le téléphone des secours (Copier, PDF, Partager), QR code texte sans réseau en secours - fait.
- Fiche relais : bouton « Ajouter ma position » (GPS) après explication et accord - fait.
