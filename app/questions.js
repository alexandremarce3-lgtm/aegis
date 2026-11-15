/* Questions du module « Se former » (12 ans et plus).
   - « q » : la question, rédigée pour l'appli.
   - « bon » : la bonne réponse. C'est toujours un extrait exact de la fiche officielle indiquée dans « fiche »
     (texte ou note de bas de page). Contrôle : node outils/verifier-questions.mjs
   - « faux » : les mauvaises réponses, rédigées pour l'appli. Elles ne viennent pas des textes officiels.
   À l'affichage, la bonne réponse prend une majuscule et perd sa ponctuation finale. */
(() => {
  const H = 'hemorragies', O = 'obstruction-des-voies-aeriennes', A = 'arret-cardiaque', P = 'perte-de-connaissance', M = 'malaises', L = 'plaies', B = 'brulures', T = 'traumatismes';
  const q = (theme, fiche, question, bon, faux) => ({ theme, fiche, q: question, bon, faux });
  window.QUESTIONS = [
    // Hémorragies
    q(H, H, 'Une personne saigne abondamment. Quel est le premier geste pour arrêter le saignement ?', 'comprimer immédiatement l’endroit qui saigne', ['Poser un garrot tout de suite', 'Rincer la plaie à l’eau froide', 'Lever le bras ou la jambe et attendre']),
    q(H, H, 'Dans quelle position installer une personne qui saigne abondamment ?', 'allonger confortablement la victime', ['L’asseoir, tête penchée en avant', 'La laisser debout', 'La mettre sur le ventre']),
    q(H, H, 'Dans quel cas pose-t-on un garrot ?', 'si la compression d’une hémorragie d’un membre est inefficace ou impossible', ['Dès que l’on voit du sang', 'Pour une plaie au cou ou au thorax', 'Uniquement quand les secours sont arrivés']),
    q(H, 'garrot', 'Où place-t-on le garrot ?', 'entre la plaie et la racine du membre', ['Directement sur la plaie', 'Sur l’articulation la plus proche', 'Entre la plaie et l’extrémité du membre']),
    q(H, 'compression', 'Comment doit être la compression sur une plaie qui saigne ?', 'permanente', ['Relâchée chaque minute pour vérifier', 'Légère, pour ne pas faire mal', 'Arrêtée dès que le sang ralentit']),
    q(H, H, 'Une personne saigne du nez. Comment l’installer ?', 'l’asseoir, tête penchée en avant', ['L’allonger sur le dos', 'L’asseoir, tête penchée en arrière', 'La coucher sur le côté']),
    q(H, H, 'Saignement de nez : combien de temps comprimer les deux narines ?', 'durant 10 minutes sans relâcher', ['Pendant 30 secondes', 'Pendant 2 minutes, en relâchant pour vérifier', 'Pendant 1 heure']),

    // Obstruction des voies aériennes
    q(O, O, 'Une personne s’étouffe, mais elle tousse et peut parler. Que faire ?', 'continuer d’encourager la victime à tousser', ['Lui donner des claques dans le dos', 'Faire des compressions abdominales', 'Lui donner un verre d’eau']),
    q(O, O, 'Quel signe montre que l’obstruction est totale ?', 'la victime ne peut plus parler, crier, tousser ou émettre un son', ['Elle tousse très fort', 'Elle se plaint d’avoir mal à la gorge', 'Elle parle d’une voix rauque']),
    q(O, O, 'Obstruction totale : quel est le premier geste ?', 'donner de 1 à 5 « claques dans le dos »', ['Faire tout de suite des compressions abdominales', 'Allonger la victime sur le dos', 'Chercher l’objet avec les doigts']),
    q(O, 'desobstruction-par-des-claques-dans-le-dos', 'À quel endroit donne-t-on les claques dans le dos ?', 'entre les omoplates', ['En bas du dos', 'Sur la nuque', 'Sur une épaule']),
    q(O, O, 'Les claques n’ont pas suffi chez un adulte. Où réaliser les compressions ?', 'au niveau abdominal', ['Dans le dos', 'Sur la gorge', 'Sur le côté du thorax']),
    q(O, 'desobstruction-par-des-compressions-abdominales', 'Pour les compressions abdominales, où placer le poing ?', 'juste au-dessus du nombril', ['Sur le sternum', 'Sous le nombril', 'Sur les côtes']),
    q(O, O, 'La personne qui s’étouffait perd connaissance. Que faire après l’avoir accompagnée au sol ?', 'réaliser une réanimation cardio-pulmonaire', ['La mettre sur le côté et attendre', 'Continuer les claques dans le dos', 'Lui relever les jambes']),

    // Arrêt cardiaque
    q(A, A, 'La victime ne répond pas. Quel signe indique un arrêt cardiaque ?', 'aucun mouvement de la poitrine n’est visible et aucun bruit ou souffle n’est perçu', ['Elle est pâle et transpire', 'Elle se plaint d’une douleur dans la poitrine', 'Elle respire calmement']),
    q(A, A, 'Combien de temps prend-on pour rechercher la respiration ?', '10 secondes au plus', ['30 secondes', '1 minute', '2 minutes']),
    q(A, A, 'Chez l’adulte, quel cycle répète-t-on pendant la réanimation ?', '30 compressions thoraciques / 2 insufflations', ['15 compressions thoraciques / 2 insufflations', '5 compressions thoraciques / 1 insufflation', '100 compressions thoraciques / 10 insufflations']),
    q(A, A, 'Chez l’enfant et le nourrisson, quel cycle répète-t-on ?', '15 compressions thoraciques / 2 insufflations', ['30 compressions thoraciques / 2 insufflations', '5 compressions thoraciques / 5 insufflations', '50 compressions thoraciques / 2 insufflations']),
    q(A, 'compressions-thoraciques', 'À quelle fréquence réalise-t-on les compressions thoraciques ?', 'entre 100 et 120 compressions par minute', ['Entre 40 et 60 compressions par minute', 'Entre 60 et 80 compressions par minute', 'Entre 160 et 180 compressions par minute']),
    q(A, 'compressions-thoraciques', 'Chez l’adulte, de quelle profondeur comprime-t-on la poitrine ?', 'environ 5 cm, sans dépasser 6 cm', ['Environ 1 cm', 'Environ 2 cm', 'Environ 10 cm']),
    q(A, 'compressions-thoraciques', 'Chez l’adulte, où place-t-on le talon de la main pour masser ?', 'au centre de la poitrine, sur la moitié inférieure du sternum', ['Sur le côté gauche de la poitrine', 'Sur le haut du ventre', 'En haut du sternum, près du cou']),
    q(A, A, 'Vous êtes seul avec un téléphone portable. Comment alerter sans perdre de temps ?', 'si vous disposez du mode haut-parleur, l’activer et débuter immédiatement la RCP en même temps que vous alertez', ['Terminer l’appel, puis commencer le massage', 'Masser dix minutes avant d’appeler', 'Envoyer un message et attendre la réponse']),
    q(A, 'defibrillation', 'Le défibrillateur vient de délivrer un choc. Que faire ?', 'reprendre immédiatement les compressions thoraciques après la délivrance du choc', ['Attendre que la victime se réveille', 'Retirer les électrodes', 'Éteindre le défibrillateur']),
    q(A, A, 'Vous ne pouvez pas faire les insufflations. Que faire ?', 'réaliser uniquement les compressions thoraciques en continu', ['Arrêter la réanimation', 'Attendre le défibrillateur sans masser', 'Mettre la victime sur le côté']),

    // Perte de connaissance
    q(P, P, 'Comment reconnaît-on une perte de connaissance ?', 'elle ne répond et ne réagit à aucune sollicitation verbale ou physique, mais respire', ['Elle ne répond pas et ne respire pas', 'Elle répond, mais se sent très mal', 'Elle se réveille dès qu’on lui parle']),
    q(P, P, 'La victime a perdu connaissance et respire, sans traumatisme. Que faire ?', 'la placer en position stable sur le côté', ['La laisser sur le dos', 'L’asseoir contre un mur', 'Commencer un massage cardiaque']),
    q(P, P, 'La victime a perdu connaissance et respire, après une chute. Que faire ?', 'laisser la victime sur le dos', ['La tourner tout de suite sur le côté', 'L’asseoir', 'La relever doucement']),
    q(P, P, 'Sur le dos, qu’est-ce qui peut gêner la respiration d’une personne qui a perdu connaissance ?', 'la chute de la langue en arrière', ['Le poids de ses bras', 'Le froid du sol', 'La position de ses jambes']),
    q(P, P, 'Que surveille-t-on en permanence jusqu’à l’arrivée des secours ?', 'la respiration de la victime', ['La couleur de ses yeux', 'La température de ses mains', 'L’heure qu’il est']),
    q(P, P, 'La respiration de la victime s’arrête. Que faire ?', 'adopter la conduite à tenir face à un arrêt cardiaque', ['La laisser en position latérale de sécurité', 'Lui relever les jambes', 'Attendre une minute pour voir si elle reprend']),
    q(P, P, 'Une femme enceinte a perdu connaissance et respire. De quel côté la tourner ?', 'sur le côté gauche', ['Sur le côté droit', 'Sur le ventre', 'Peu importe le côté']),
    q(P, 'position-laterale-de-securite-pls', 'Avant de tourner la victime sur le côté, que lui retire-t-on si elle en porte ?', 'les lunettes', ['Les chaussures', 'La montre', 'La ceinture']),

    // Malaises
    q(M, M, 'Lequel de ces signes doit alerter lors d’un malaise ?', 'faiblesse ou paralysie d\'un bras', ['Une envie de bâiller', 'Une faim soudaine', 'Un éternuement']),
    q(M, M, 'Quelle est la première chose à faire devant une personne qui fait un malaise ?', 'installer la victime en position d\'attente, confortablement et sans délai', ['La faire marcher pour qu’elle récupère', 'Lui donner un repas', 'La laisser seule au calme']),
    q(M, M, 'La personne a du mal à respirer. Dans quelle position l’installer ?', 'assise en cas de difficultés à respirer', ['Allongée à plat sur le dos', 'Allongée sur le ventre', 'Debout, appuyée contre un mur']),
    q(M, M, 'Que demande-t-on à la victime ou à son entourage ?', 'les traitements médicamenteux qu\'elle prend', ['Son adresse', 'Son métier', 'Ses projets pour la journée']),
    q(M, M, 'Que peut-on aider la victime à prendre, à sa demande ou à celle des secours ?', 'du sucre en morceaux', ['Un café très fort', 'Un médicament pris au hasard', 'Un verre d’alcool']),
    q(M, M, 'En présence de signes qui doivent alerter, ou en cas de doute, que faire ?', 'demander un avis médical', ['Attendre que cela passe', 'Raccompagner la personne chez elle', 'Lui conseiller de dormir']),
    q(M, M, 'Malaise provoqué par la chaleur : où installer la victime ?', 'dans un endroit frais et bien aéré', ['Au soleil, pour éviter un choc de température', 'Dans une voiture fermée', 'Sous une couverture']),

    // Plaies
    q(L, L, 'Un morceau de verre est resté planté dans la plaie. Que faire ?', 'ne jamais retirer le corps étranger pénétrant', ['Le retirer doucement', 'Le bouger pour voir s’il tient', 'L’enfoncer pour arrêter le saignement']),
    q(L, L, 'Plaie au thorax : dans quelle position installer la victime ?', 'assise en laissant la plaie à l’air libre', ['Allongée sur le ventre', 'Debout', 'Allongée, jambes surélevées']),
    q(L, L, 'Plaie de l’abdomen : dans quelle position installer la victime ?', 'allongée, jambes fléchies', ['Assise sur une chaise', 'Debout, penchée en avant', 'Allongée sur le ventre']),
    q(L, L, 'Avec quoi nettoie-t-on une plaie simple ?', 'avec de l’eau courante (propre) ou en bouteille', ['Avec du coton sec', 'Avec de l’eau de Javel', 'Avec de l’alcool à brûler']),
    q(L, L, 'Quelle maladie très grave peut suivre une plaie si l’on n’est pas vacciné ?', 'Le tétanos', ['La grippe', 'La varicelle', 'La rougeole']),
    q(L, L, 'Un doigt a été sectionné. Comment conserver la partie amputée ?', 'au frais, sans la congeler', ['Directement sur des glaçons', 'Dans de l’eau chaude', 'Dans de l’alcool']),

    // Brûlures
    q(B, B, 'Quel est le premier geste face à une brûlure par la chaleur ?', 'refroidir immédiatement la surface brûlée', ['Appliquer du beurre ou une pommade', 'Percer les cloques', 'Couvrir avec un pansement serré']),
    q(B, B, 'Pendant combien de temps refroidit-on une brûlure ?', 'Pendant au moins 10 minutes, idéalement 20 minutes', ['Pendant 30 secondes', 'Pendant 1 minute', 'Pendant 2 heures']),
    q(B, B, 'Avec quoi refroidit-on une brûlure ?', 'Avec de l\'eau courante tempérée et à faible pression', ['Avec des glaçons', 'Avec de l’eau glacée à forte pression', 'Avec de l’eau très chaude']),
    q(B, B, 'Que fait-on des cloques d’une brûlure simple ?', 'ne jamais percer les cloques', ['Les percer avec une aiguille propre', 'Les frotter pour les faire partir', 'Les couper aux ciseaux']),
    q(B, B, 'À partir de quelle surface de cloques une brûlure est-elle grave ?', 'supérieure à celle de la moitié de la paume de la main de la victime', ['Plus grande qu’une tête d’épingle', 'Plus grande que le dos entier', 'Plus grande que les deux bras']),
    q(B, B, 'Brûlure électrique : quelle précaution avant tout ?', 'ne jamais toucher la victime avant la suppression du risque électrique', ['Tirer la victime par la main', 'Lui verser de l’eau dessus', 'Toucher l’appareil pour vérifier']),
    q(B, B, 'Une personne a avalé un produit chimique. Que faire ?', 'ne jamais faire vomir ou boire', ['La faire vomir', 'Lui donner du lait', 'Lui faire boire beaucoup d’eau']),

    // Traumatismes
    q(T, T, 'Quel est le principe face à une personne qui s’est fait mal en tombant ?', 'Le secouriste ne doit pas mobiliser la victime', ['L’aider à se relever et à marcher', 'Masser la zone douloureuse', 'Faire bouger le membre pour vérifier']),
    q(T, T, 'Le membre est visiblement cassé et déformé. Que faire ?', 'ne pas tenter de le réaligner', ['Le remettre droit', 'Tirer dessus doucement', 'Le plier pour le caler']),
    q(T, T, 'La personne a mal au cou après une chute. Que lui demander ?', 'demander de ne pas bouger la tête', ['De tourner la tête pour vérifier', 'De se lever lentement', 'De pencher la tête en arrière']),
    q(T, T, 'Après un choc à la tête, quels signes peuvent apparaître plus tard ?', 'maux de tête persistants, vomissements, agitation, somnolence', ['Faim et soif', 'Éternuements', 'Démangeaisons']),
    q(T, T, 'La victime d’une chute a perdu connaissance. Que faire ?', 'adopter la conduite à tenir face à une perte de connaissance dont l’origine est traumatique', ['La mettre debout', 'Lui donner à boire', 'La secouer fortement']),

    // Alerter
    q('alerte', 'alerte', 'Quel numéro appelle le SAMU ?', 'le 15', ['le 17', 'le 18', 'le 114']),
    q('alerte', 'alerte', 'Quel numéro appelle les sapeurs-pompiers ?', 'le 18', ['le 15', 'le 17', 'le 114']),
    q('alerte', 'alerte', 'Quel numéro d’urgence est valable dans toute l’Union européenne ?', 'le 112', ['le 15', 'le 18', 'le 114']),
    q('alerte', 'alerte', 'Quel numéro est réservé aux personnes sourdes, malentendantes ou qui ne peuvent pas parler ?', 'le 114', ['le 112', 'le 15', 'le 18']),
    q('alerte', 'alerte', 'Quand peut-on raccrocher ?', 'sur les instructions de l’opérateur', ['Dès que l’on a donné son nom', 'Dès que l’on entend la sirène', 'Au bout d’une minute']),
    q('alerte', 'alerte', 'Quelle information faut-il donner sur le lieu ?', 'la localisation la plus précise possible', ['Seulement le nom de la ville', 'Seulement le département', 'Aucune, les secours la trouvent seuls']),
  ];
})();
