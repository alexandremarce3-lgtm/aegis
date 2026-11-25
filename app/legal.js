/* Pages légales : mentions légales, confidentialité (RGPD), conditions d'utilisation, accessibilité, licences.
   Disponibles hors ligne dans l'appli (#/legal/...). Texte rédigé pour Aegis, à faire relire par un juriste. */
(() => {
  const MAJ = '25 novembre 2026';
  const CONTACT = 'contact@lenspicture.com';
  const mail = `<a href="mailto:${CONTACT}">${CONTACT}</a>`;

  const PAGES = {
    mentions: { titre: 'Mentions légales', html: `
      <h2>Éditeur</h2>
      <p>Aegis est un projet personnel, bénévole et non commercial, édité par Alexandre Marcé, formateur en premiers secours, à titre de particulier.</p>
      <p>Directeur de la publication : Alexandre Marcé. Contact : ${mail}.</p>
      <h2>Hébergeur</h2>
      <p>GitHub, Inc. (service GitHub Pages), 88 Colin P Kelly Jr Street, San Francisco, CA 94107, États-Unis - <a href="https://github.com">github.com</a>.</p>
      <h2>Nature du service</h2>
      <p>Aegis est un aide-mémoire gratuit des gestes de premiers secours. <b>Il ne remplace ni une formation ni l’appel aux secours : en urgence, appelez le 15, le 18 ou le 112.</b> Voir les <a href="#/legal/cgu">conditions d’utilisation</a>.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Voir la page <a href="#/legal/licences">Licences et sources</a>.</p>` },

    confidentialite: { titre: 'Confidentialité', html: `
      <p><b>En bref : Aegis ne collecte aucune donnée.</b> Pas de compte, pas de publicité, pas de mesure d’audience, pas de cookie. L’éditeur ne reçoit aucune information sur vous ni sur les personnes que vous secourez.</p>
      <h2>Ce qui est enregistré sur votre téléphone</h2>
      <p>Ces informations restent dans la mémoire de votre navigateur (stockage local). Elles ne sont jamais envoyées à l’éditeur.</p>
      <ul>
        <li><b>Profil</b> (moins de 10 ans, ou 10 ans et plus) : jusqu’à ce que vous le changiez ou effaciez les données du site.</li>
        <li><b>Progression du quiz</b> (points, meilleurs scores) : même durée.</li>
        <li><b>Fiche relais</b> (voir ci-dessous) : <b>24 heures au plus</b>, puis effacement automatique ; bouton « Effacer la fiche » à tout moment.</li>
        <li><b>Dernière position</b> utilisée pour la carte des défibrillateurs : le temps de l’onglet ouvert seulement (effacée à la fermeture).</li>
      </ul>
      <p>Ce stockage est strictement nécessaire aux fonctions que vous utilisez ; il ne sert à aucun suivi.</p>
      <h2>Fiche relais : données d’une autre personne</h2>
      <p>La fiche relais peut contenir l’identité de la victime (nom, prénom, âge, sexe) et des informations sur son état de santé. Ce sont des données personnelles sensibles. Aegis les garde uniquement sur votre téléphone, ne les envoie nulle part et les efface automatiquement 24 heures après la création de la fiche. Elles ne sortent de votre téléphone que si vous montrez l’écran ou le QR code aux secours.</p>
      <p>Bonnes pratiques : ne notez que ce qui est utile aux secours ; si la victime peut répondre, dites-lui ce que vous notez et pourquoi ; ne photographiez pas et ne partagez pas la fiche en dehors des secours ; effacez-la après la prise en charge.</p>
      <h2>Services extérieurs, seulement si vous les utilisez</h2>
      <ul>
        <li><b>Carte des défibrillateurs</b> : avec votre accord, le navigateur donne votre position à l’appli, qui envoie une zone d’environ quelques centaines de mètres à data.gouv.fr pour obtenir la liste des appareils. Le fond de carte vient d’OpenStreetMap et la bibliothèque de carte (Leaflet) de unpkg.com. Le lien « itinéraire » ouvre Google Maps avec la position du défibrillateur choisi.</li>
        <li><b>Recherche à la voix</b> : la reconnaissance vocale de votre navigateur peut envoyer votre voix à son éditeur (Google, Apple) pour la transcrire.</li>
        <li><b>Hébergement</b> : comme tout site, GitHub Pages reçoit l’adresse IP des visiteurs pour livrer les pages et assurer la sécurité (voir la politique de confidentialité de GitHub).</li>
      </ul>
      <p>Ces services reçoivent votre adresse IP lorsqu’ils sont appelés. Sans la carte ni le micro, l’appli fonctionne sans rien envoyer d’autre que le chargement des pages.</p>
      <h2>Vos droits</h2>
      <p>L’éditeur ne détient aucune donnée vous concernant : vous gardez la main en effaçant la fiche relais, en changeant de profil ou en supprimant les données du site dans votre navigateur. Pour toute question : ${mail}. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).</p>
      <p class="meta">Mise à jour : ${MAJ}.</p>` },

    cgu: { titre: 'Conditions d’utilisation', html: `
      <h2>1. Objet</h2>
      <p>Ces conditions encadrent l’utilisation d’Aegis, application web gratuite d’aide-mémoire des gestes de premiers secours. Utiliser Aegis vaut acceptation de ces conditions.</p>
      <h2>2. Accès</h2>
      <p>Aegis est gratuit, sans compte et sans publicité. Il fonctionne dans un navigateur et peut être installé sur l’écran d’accueil du téléphone. Une grande partie fonctionne sans réseau après une première ouverture.</p>
      <h2>3. Un aide-mémoire, pas une formation</h2>
      <p><b>En cas d’urgence, appelez le 15, le 18 ou le 112</b> (114 par SMS, tchat ou visio). Aegis rappelle les gestes enseignés en formation « Premiers Secours Citoyen » ; il ne remplace ni cette formation, ni l’appel aux secours, ni l’avis d’un professionnel de santé. Suivez toujours les consignes des secours.</p>
      <h2>4. Contenu</h2>
      <p>Les fiches reproduisent sans modification les références techniques nationales PSC de la DGSCGC (édition juillet 2026) ; le mode moins de 10 ans reprend le guide « Apprendre à porter secours » de l’Éducation nationale. Les libellés, dessins, questions de quiz et outils (bilan, minuteurs, fiche relais) sont des ajouts de l’appli. L’ensemble est en cours de relecture par un formateur. L’éditeur veille à suivre la dernière édition des références, sans pouvoir garantir l’absence d’erreur ou de retard de mise à jour.</p>
      <h2>5. Responsabilité</h2>
      <p>Vous restez seul juge des gestes à réaliser selon la situation. Aegis est fourni gratuitement, en l’état ; dans les limites permises par la loi, l’éditeur ne peut être tenu responsable d’un dommage lié à son utilisation, à une indisponibilité ou à une erreur de contenu. La carte des défibrillateurs repose sur des données publiques : un appareil peut être absent, déplacé ou hors service.</p>
      <h2>6. Fiche relais</h2>
      <p>Vous êtes responsable des informations que vous saisissez. Elles sont notées par un témoin, ne sont pas vérifiées et ne constituent pas un document médical. Voir la page <a href="#/legal/confidentialite">Confidentialité</a>.</p>
      <h2>7. Propriété intellectuelle</h2>
      <p>Voir la page <a href="#/legal/licences">Licences et sources</a>.</p>
      <h2>8. Évolution</h2>
      <p>Ces conditions peuvent évoluer avec l’appli ; la date de mise à jour figure ci-dessous.</p>
      <h2>9. Droit applicable et contact</h2>
      <p>Ces conditions sont soumises au droit français. Contact : ${mail}.</p>
      <p class="meta">Mise à jour : ${MAJ}.</p>` },

    accessibilite: { titre: 'Accessibilité', html: `
      <p>Aegis vise le niveau AA des règles d’accessibilité (WCAG 2.1, RGAA) : textes agrandissables, contrastes renforcés, libellés pour les lecteurs d’écran, gros boutons, lecture à voix haute des consignes, mode sombre automatique.</p>
      <p><b>État :</b> aucun audit complet n’a encore été réalisé ; l’appli n’est donc pas déclarée conforme. Si un écran vous pose problème, écrivez à ${mail} : nous chercherons une solution.</p>
      <p class="meta">Mise à jour : ${MAJ}.</p>` },

    licences: { titre: 'Licences et sources', html: `
      <ul>
        <li><b>Code et dessins d’Aegis</b> : licence MIT (voir le dépôt GitHub du projet).</li>
        <li><b>Fiches</b> : références techniques nationales « Premiers Secours Citoyen », DGSCGC, ministère de l’Intérieur, édition juillet 2026, reproduites sans modification.</li>
        <li><b>Mode moins de 10 ans</b> : « Quelques repères pour apprendre à porter secours », ministère de l’Éducation nationale (DGESCO), 2022.</li>
        <li><b>Défibrillateurs</b> : base nationale des défibrillateurs (ministère de la Santé), Licence Ouverte 2.0, via data.gouv.fr.</li>
        <li><b>Fond de carte</b> : © les contributeurs d’OpenStreetMap, licence ODbL ; bibliothèque Leaflet (licence BSD-2).</li>
        <li><b>Voix</b> : Piper, modèle fr_FR-siwis-medium, corpus SIWIS, licence CC BY 4.0.</li>
        <li><b>QR code</b> : bibliothèque qrcode-generator de Kazuhiko Arase, licence MIT. « QR Code » est une marque déposée de DENSO WAVE INCORPORATED.</li>
      </ul>` },
  };
  window.PAGES_LEGALES = PAGES;

  window.vueLegal = function vueLegal(id) {
    const p = PAGES[id] || PAGES.mentions;
    titre(p.titre, true);
    vue.innerHTML = `<article class="fiche legal">${p.html}
      <nav class="legal-liens" aria-label="Pages légales">${Object.entries(PAGES).map(([k, x]) => (k === id ? `<b>${x.titre}</b>` : `<a href="#/legal/${k}">${x.titre}</a>`)).join(' · ')}</nav>
    </article>`;
    scrollTo(0, 0);
  };
})();
