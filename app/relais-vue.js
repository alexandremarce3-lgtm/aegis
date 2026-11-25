/* Écrans de la fiche relais (#/relais et #/relais/qr). Logique et libellés : relais.js. */
(() => {
  const R = window.RELAIS;
  // Deux fiches possibles : la vraie (« relais ») et une fiche d'entraînement (« relais-essai »), rangées à part.
  const VRAIE = 'relais', ESSAI = 'relais-essai';
  const maintenant = () => Date.now();

  // Lecture avec effacement automatique après 24 heures.
  R.lire = (cle = VRAIE) => { const d = memo.lire(cle, null); if (d && R.perimee(d, maintenant())) { R.effacer(cle); return null; } return d; };
  R.ecrire = (d, cle = d.essai ? ESSAI : VRAIE) => memo.ecrire(cle, d);
  R.effacer = (cle = VRAIE) => { try { localStorage.removeItem('aegis.' + cle); } catch {} };
  R.ouvrir = (cle = VRAIE) => R.lire(cle) || (() => { const d = R.nouvelle(maintenant()); if (cle === ESSAI) d.essai = true; R.ecrire(d, cle); return d; })();
  R.purger = () => { R.lire(VRAIE); R.lire(ESSAI); };
  // Utilisé par le pas à pas et la barre d'appel : note une étape dans le déroulé.
  R.journal = (t) => { const d = R.ouvrir(); R.noter(d, t, maintenant()); R.ecrire(d); };

  const champ = (id, lib, val, attrs = '') => `<label class="champ"><span>${lib}</span><input id="${id}" value="${esc(val || '')}" ${attrs}></label>`;
  const radios = (nom, lib, choix, val) => `<fieldset class="radios"><legend>${lib}</legend>${choix.map((c) => `<label><input type="radio" name="${nom}" value="${esc(c)}" ${val === c ? 'checked' : ''}> ${esc(c)}</label>`).join('')}</fieldset>`;
  const majuscule = (t) => { const r = t.trim().replace(/\s*[;:.,]+$/, ''); return r.charAt(0).toUpperCase() + r.slice(1); };

  // Silhouette de face, vue par le témoin : le côté droit de la victime est à gauche de l'écran.
  const SILHOUETTE = `<svg class="corps" viewBox="0 0 200 300" aria-hidden="true">
    <circle data-z="tete" cx="100" cy="30" r="22"/>
    <rect data-z="cou" x="90" y="52" width="20" height="14" rx="4"/>
    <rect data-z="thorax" x="66" y="66" width="68" height="62" rx="12"/>
    <rect data-z="abdomen" x="70" y="128" width="60" height="44" rx="10"/>
    <rect data-z="bras-d" x="38" y="70" width="24" height="104" rx="12"/>
    <rect data-z="bras-g" x="138" y="70" width="24" height="104" rx="12"/>
    <rect data-z="jambe-d" x="70" y="174" width="28" height="118" rx="12"/>
    <rect data-z="jambe-g" x="102" y="174" width="28" height="118" rx="12"/>
    <text x="50" y="190" text-anchor="middle">D</text><text x="150" y="190" text-anchor="middle">G</text>
  </svg>`;

  window.vueRelais = function vueRelais(sous) {
    if (sous === 'qr' || sous === 'essai-qr') return vueQr(sous === 'essai-qr' ? ESSAI : VRAIE);
    if (sous === 'guide') return vueGuide();
    if (sous === 'nouvelle') {
      const d0 = R.lire(VRAIE);
      if (!d0 || confirm('Une fiche relais est déjà en cours. L’effacer pour commencer une nouvelle fiche ?')) { R.effacer(VRAIE); R.ouvrir(VRAIE); }
      return void (location.hash = '#/relais');
    }
    const essai = sous === 'essai', cle = essai ? ESSAI : VRAIE, base = essai ? '#/relais/essai' : '#/relais';
    titre(essai ? 'Fiche d’entraînement' : 'Fiche relais', true);
    const d = R.ouvrir(cle), a = d.alerte, v = d.victime, m = d.malaise;
    vue.innerHTML = `<article class="fiche relais">
      ${essai ? '<p class="exercice">Exercice : cette fiche d’entraînement est rangée à part, elle ne touche pas à une vraie fiche relais. <a href="#/relais/guide">Revoir le guide</a></p>' : '<p class="avant">D’abord protéger, alerter et faire les gestes. Remplissez cette fiche pendant l’attente des secours, puis montrez-la leur. <a href="#/relais/guide">Comment bien la remplir</a></p>'}
      <p class="relais-actions"><a class="btn lien" href="${base}${essai ? '-qr' : '/qr'}">Montrer aux secours (QR code)</a> ${essai ? '' : '<a class="btn clair lien" href="#/relais/nouvelle">Nouvelle fiche</a> '}<button class="btn clair" id="effacer">Effacer la fiche</button></p>
      <p class="meta">Rien n’est envoyé : la fiche reste sur ce téléphone et s’efface automatiquement le ${R.finDeVie(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}.</p>

      <h2>Alerte</h2>
      ${champ('a-heure', 'Heure de l’appel', a.heure, 'type="time"')}
      ${radios('a-numero', 'Numéro appelé', R.NUMEROS, a.numero)}
      ${champ('a-nature', 'Nature du problème (maladie, accident...)', a.nature)}
      ${champ('a-victimes', 'Nombre de victimes', a.victimes, 'type="number" min="1" inputmode="numeric"')}
      ${champ('a-lieu', 'Lieu le plus précis possible', a.lieu)}
      <div class="gps">
        <p id="gps-valeur" class="gps-valeur" ${a.gps ? '' : 'hidden'}>📍 Position GPS : <b>${esc(R.gps(a.gps))}</b> <button type="button" class="lienbtn" id="gps-retirer">Retirer</button></p>
        <button type="button" class="btn clair" id="gps-ajouter">📍 ${a.gps ? 'Mettre à jour ma position' : 'Ajouter ma position'}</button>
        <div id="gps-accord" class="gps-accord" hidden>
          <p>Aegis va demander votre position à votre téléphone, qui vous demandera votre autorisation. Les coordonnées GPS seront ajoutées à la fiche : elles restent sur ce téléphone, et ne sont transmises aux secours que si vous leur montrez la fiche ou le QR code.</p>
          <p class="relais-actions"><button type="button" class="btn" id="gps-oui">Autoriser et ajouter</button> <button type="button" class="btn clair" id="gps-non">Annuler</button></p>
        </div>
        <p id="gps-etat" class="meta" role="status"></p>
      </div>

      <h2>Victime</h2>
      <p class="meta">Si la victime ne peut pas répondre, laissez vide ou indiquez ce que l’entourage sait.</p>
      ${champ('v-nom', 'Nom', v.nom, 'autocomplete="off"')}
      ${champ('v-prenom', 'Prénom', v.prenom, 'autocomplete="off"')}
      ${champ('v-age', 'Âge (en années)', v.age, 'type="number" min="0" max="120" inputmode="numeric"')}
      ${radios('v-morpho', 'Si l’âge est inconnu, elle ressemble à', R.MORPHOLOGIES, v.morpho)}
      ${radios('v-sexe', 'Sexe', R.SEXES, v.sexe)}

      <h2>Ce que j’ai constaté</h2>
      ${R.CONSTAT.map((c) => radios('c-' + c.id, c.q, c.choix, d.constat[c.id])).join('')}

      <h2>Zones atteintes</h2>
      <p class="meta">Touchez les zones blessées (droite et gauche de la victime).</p>
      <div class="zones">${SILHOUETTE}
        <div class="zones-boutons">${R.ZONES.map(([id, lib]) => `<button type="button" class="zone" data-z="${id}" aria-pressed="${d.zones.includes(id)}">${lib}</button>`).join('')}</div>
      </div>

      <h2>Gestes faits</h2>
      <ul class="gestes-faits">${R.GESTES.map(([id, lib, f]) => `<li><label><input type="checkbox" data-geste="${id}" ${d.gestes[id] ? 'checked' : ''}> ${esc(lib)}</label>
        <input type="time" data-heure="${id}" value="${esc(d.gestes[id] || '')}" aria-label="Heure : ${esc(lib)}" ${d.gestes[id] ? '' : 'hidden'}>
        <a class="meta" href="#/fiche/${f}">fiche</a></li>`).join('')}</ul>
      ${champ('dae-chocs', 'Chocs délivrés par le DAE (nombre)', d.dae.chocs, 'type="number" min="0" inputmode="numeric"')}

      <h2>En cas de malaise</h2>
      ${champ('m-duree', 'Durée du malaise', m.duree)}
      ${radios('m-connu', 'Malaise déjà connu', ['oui', 'non'], m.connu)}
      ${champ('m-traitements', 'Traitements pris', m.traitements)}

      <h2>Observations</h2>
      <label class="champ"><span>Ce que vous voulez ajouter</span><textarea id="obs" rows="3">${esc(d.observations)}</textarea></label>

      <h2>Déroulé noté automatiquement</h2>
      ${d.journal.length ? `<ol class="journal">${d.journal.map((e) => `<li><b>${R.hm(e.h)}</b> ${esc(e.t)}</li>`).join('')}</ol>` : '<p class="meta">Les étapes validées en mode pas à pas et les appels passés depuis l’appli s’affichent ici avec leur heure.</p>'}

      <h2>Avez-vous pensé à…</h2>
      <ul class="rappel-liste">${R.RAPPEL.map((r) => `<li>${esc(majuscule(r.t))} <a class="meta" href="#/fiche/${r.fiche}">fiche</a></li>`).join('')}</ul>

      <p class="source">Fiche remplie par un témoin, non vérifiée. Champs construits à partir des fiches des ${SOURCE}. Le choix « autre » pour le sexe est un ajout de l’appli. Contenu à valider par un formateur. Aegis ne remplace pas une formation.</p>
    </article>`;
    scrollTo(0, 0);

    const enregistrer = () => {
      const val = (id) => $('#' + id).value.trim();
      const coche = (n) => (vue.querySelector(`input[name="${n}"]:checked`) || {}).value || '';
      d.alerte = { heure: val('a-heure'), numero: coche('a-numero'), nature: val('a-nature'), victimes: val('a-victimes'), lieu: val('a-lieu'), gps: d.alerte.gps };
      d.victime = { nom: val('v-nom'), prenom: val('v-prenom'), age: val('v-age'), morpho: coche('v-morpho'), sexe: coche('v-sexe') };
      d.constat = Object.fromEntries(R.CONSTAT.map((c) => [c.id, coche('c-' + c.id)]));
      d.malaise = { duree: val('m-duree'), connu: coche('m-connu'), traitements: val('m-traitements') };
      d.dae = { chocs: val('dae-chocs') };
      d.observations = $('#obs').value;
      R.ecrire(d);
    };
    vue.querySelector('.relais').addEventListener('input', enregistrer);
    vue.querySelector('.relais').addEventListener('change', enregistrer);
    const majZones = () => vue.querySelectorAll('.corps [data-z]').forEach((s) => s.classList.toggle('choisie', d.zones.includes(s.dataset.z)));
    const basculer = (z) => { d.zones = d.zones.includes(z) ? d.zones.filter((x) => x !== z) : [...d.zones, z]; vue.querySelector(`.zone[data-z="${z}"]`).setAttribute('aria-pressed', d.zones.includes(z)); majZones(); R.ecrire(d); };
    vue.querySelectorAll('.zone').forEach((b) => b.addEventListener('click', () => basculer(b.dataset.z)));
    vue.querySelectorAll('.corps [data-z]').forEach((s) => s.addEventListener('click', () => basculer(s.dataset.z)));
    majZones();
    vue.querySelectorAll('[data-geste]').forEach((c) => c.addEventListener('change', () => {
      const id = c.dataset.geste, h = vue.querySelector(`[data-heure="${id}"]`);
      if (c.checked) { h.value ||= R.hm(maintenant()); h.hidden = false; d.gestes[id] = h.value; } else { h.hidden = true; delete d.gestes[id]; }
      R.ecrire(d);
    }));
    vue.querySelectorAll('[data-heure]').forEach((h) => h.addEventListener('change', () => { if (h.value) d.gestes[h.dataset.heure] = h.value; R.ecrire(d); }));
    // Position GPS : explication et accord dans l'appli, puis demande d'autorisation du téléphone.
    const gpsEtat = $('#gps-etat'), accord = $('#gps-accord');
    $('#gps-ajouter').addEventListener('click', () => {
      if (!navigator.geolocation) { gpsEtat.textContent = 'Ce téléphone ne permet pas de donner la position. Décrivez le lieu dans le champ ci-dessus.'; return; }
      accord.hidden = false; $('#gps-oui').focus();
    });
    $('#gps-non').addEventListener('click', () => { accord.hidden = true; gpsEtat.textContent = 'Aucune position ajoutée.'; });
    $('#gps-oui').addEventListener('click', () => {
      accord.hidden = true; gpsEtat.textContent = 'Recherche de la position…';
      navigator.geolocation.getCurrentPosition((p) => {
        d.alerte.gps = { lat: p.coords.latitude, lon: p.coords.longitude, precision: p.coords.accuracy, h: maintenant() };
        R.ecrire(d);
        $('#gps-valeur').hidden = false; $('#gps-valeur b').textContent = R.gps(d.alerte.gps);
        $('#gps-ajouter').textContent = '📍 Mettre à jour ma position';
        gpsEtat.textContent = d.alerte.gps.precision > 100 ? 'Position ajoutée, mais peu précise : complétez la description du lieu.' : 'Position ajoutée à la fiche.';
      }, (e) => {
        gpsEtat.textContent = e.code === 1 ? 'Position refusée. Vous pouvez l’autoriser dans les réglages du navigateur, ou décrire le lieu dans le champ ci-dessus.' : 'Position introuvable pour le moment. Réessayez à l’extérieur, ou décrivez le lieu.';
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    });
    $('#gps-retirer').addEventListener('click', () => { delete d.alerte.gps; R.ecrire(d); $('#gps-valeur').hidden = true; $('#gps-ajouter').textContent = '📍 Ajouter ma position'; gpsEtat.textContent = 'Position retirée de la fiche.'; });
    $('#effacer').addEventListener('click', () => { if (confirm('Effacer toute la fiche ?')) { R.effacer(cle); location.hash = essai ? '#/relais/guide' : '#/'; } });
  };

  // Guide « Bien remplir la fiche relais » (Se former). Conseils d'usage rédigés pour l'appli, à valider par un formateur ;
  // les renvois aux fiches indiquent d'où vient chaque rubrique.
  function vueGuide() {
    titre('Bien remplir la fiche relais', true);
    const lien = (id, t) => `<a href="#/fiche/${id}">${t}</a>`;
    const ex = R.nouvelle(new Date(2026, 0, 12, 18, 40).getTime());
    Object.assign(ex, {
      essai: true,
      alerte: { heure: '18:42', numero: '18', nature: 'chute de vélo', victimes: '1', lieu: 'piste cyclable, sortie du parc, côté pont' },
      victime: { nom: '', prenom: '', age: '', morpho: 'adulte', sexe: 'homme' },
      constat: { repond: 'oui', saigne: 'oui', etouffe: 'non' },
      zones: ['jambe-d'], gestes: { compression: '18:41', garrot: '18:47' },
      observations: 'saignement de la jambe droite non arrêté par la compression',
    });
    vue.innerHTML = `<article class="fiche guide-relais">
      <p class="avant">La fiche relais sert à transmettre aux secours ce que vous avez vu et fait. Elle ne passe jamais avant les gestes : <b>protéger, alerter, secourir</b>, puis remplir la fiche pendant l’attente.</p>
      <h2>Avant de commencer</h2>
      <ul>
        <li>Ne quittez pas la victime des yeux pour écrire : la surveillance passe avant la fiche.</li>
        <li>Si vous utilisez le pas à pas, les étapes et les appels sont notés seuls, avec l’heure. Vous complétez le reste.</li>
        <li>S’il n’y a pas eu de pas à pas, ouvrez la fiche depuis l’accueil et remplissez-la à la main.</li>
      </ul>
      <h2>Rubrique par rubrique</h2>
      <dl class="guide">
        <dt>Alerte</dt><dd>Heure de l’appel, numéro appelé, nature du problème, nombre de victimes, lieu le plus précis possible. Ce sont les informations minimales à donner aux secours (fiche ${lien('alerte', 'Alerte')}).</dd>
        <dt>Victime</dt><dd>Si elle répond, demandez-lui son nom, son prénom et son âge, et dites-lui pourquoi. Sinon, demandez à l’entourage. À défaut d’âge, indiquez si elle ressemble à un nourrisson, un enfant ou un adulte (fiche ${lien('informations-generales', 'Informations générales')}). Laissez vide ce que vous ne savez pas.</dd>
        <dt>Ce que j’ai constaté</dt><dd>Notez ce que vous avez vu, pas une supposition : « ne répond pas », « saigne abondamment », et non « crise cardiaque ».</dd>
        <dt>Zones atteintes</dt><dd>Droite et gauche sont celles de la victime, comme si vous étiez à sa place.</dd>
        <dt>Gestes faits</dt><dd>Cochez chaque geste dès qu’il est fait : l’heure se remplit seule et reste modifiable. Pour un garrot, l’heure de pose doit pouvoir être communiquée à ceux qui prennent le relais (fiche ${lien('garrot', 'Garrot')}).</dd>
        <dt>En cas de malaise</dt><dd>Âge, durée du malaise, malaise déjà connu, traitements : ce sont les renseignements à recueillir auprès de la victime ou de son entourage et à transmettre fidèlement (fiche ${lien('malaises', 'Malaises')}).</dd>
        <dt>Observations</dt><dd>Quelques mots sur un fait utile qui n’entre dans aucune case.</dd>
      </dl>
      <h2>À l’arrivée des secours</h2>
      <ul>
        <li>Montrez l’écran ou le QR code. Scanné avec l’appareil photo, le QR code ouvre la fiche mise en forme sur leur téléphone (avec du réseau) ; sinon, choisissez « Texte sans réseau ».</li>
        <li>Répondez à leurs questions : la fiche aide, elle ne remplace pas ce que vous leur dites.</li>
        <li>Après la prise en charge, effacez la fiche. Sinon, elle s’efface seule au bout de 24 heures.</li>
      </ul>
      <h2>Erreurs fréquentes</h2>
      <ul>
        <li>Remplir la fiche avant d’avoir alerté ou fait les gestes.</li>
        <li>Écrire une supposition au lieu de ce que l’on voit.</li>
        <li>Oublier l’heure de pose du garrot.</li>
        <li>Inverser la droite et la gauche de la victime.</li>
        <li>Partager la fiche (photo, message) avec d’autres personnes que les secours.</li>
      </ul>
      <h2>Exemple (situation inventée)</h2>
      <pre class="texte-relais">${esc(R.texte(ex))}</pre>
      <p class="relais-actions"><a class="btn lien" href="#/relais/essai">S’entraîner sur une fiche d’essai</a></p>
      <p class="source">Conseils rédigés pour l’appli à partir des fiches des ${SOURCE}. Contenu à valider par un formateur. Aegis ne remplace pas une formation.</p>
    </article>`;
    scrollTo(0, 0);
  }

  function vueQr(cle) {
    titre(cle === ESSAI ? 'Fiche d’entraînement' : 'Pour les secours', true);
    const d = R.lire(cle);
    if (!d) { vue.innerHTML = '<p>Aucune fiche relais en cours.</p><p><a class="btn lien" href="#/relais">Remplir une fiche</a></p>'; return; }
    // Deux formes de QR code : un lien qui ouvre la fiche mise en forme (réseau nécessaire chez les secours),
    // ou le texte brut (lisible sans réseau, à copier). Le lien est proposé d'abord.
    const mode = memo.lire('relais-qr', 'lien');
    const base = new URL('recu.html', location.href.split('#')[0]).href;
    const qrDe = (contenu) => { qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; const q = qrcode(0, 'M'); q.addData(contenu, 'Byte'); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); };
    const afficher = (svg, coupe) => {
      vue.innerHTML = `<article class="fiche relais-qr">
        <div class="choix-qr" role="group" aria-label="Forme du QR code">
          <button class="${mode === 'lien' ? 'actif' : ''}" data-mode="lien" aria-pressed="${mode === 'lien'}">Ouvre la fiche</button>
          <button class="${mode === 'texte' ? 'actif' : ''}" data-mode="texte" aria-pressed="${mode === 'texte'}">Texte sans réseau</button>
        </div>
        ${svg ? `<div class="qr" role="img" aria-label="QR code de la fiche relais">${svg}</div>` : '<p><b>Fiche trop longue pour un QR code :</b> montrez le texte ci-dessous.</p>'}
        ${coupe && svg ? '<p class="meta">Le déroulé a été raccourci dans le QR code ; il est complet ci-dessous.</p>' : ''}
        <p class="avant">${mode === 'lien'
          ? 'Les secours scannent le code avec l’appareil photo de leur téléphone : la fiche s’ouvre, mise en forme, avec les boutons Copier, PDF et Partager. Leur téléphone doit avoir du réseau ; la fiche n’est enregistrée sur aucun serveur.'
          : 'Les secours scannent le code avec l’appareil photo de leur téléphone : le texte de la fiche s’affiche, même sans réseau, et peut être copié.'}</p>
        <pre class="texte-relais">${esc(R.texte(d))}</pre>
        <p class="relais-actions"><a class="btn clair lien" href="${cle === ESSAI ? '#/relais/essai' : '#/relais'}">Modifier la fiche</a></p>
      </article>`;
      vue.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { memo.ecrire('relais-qr', b.dataset.mode); vueQr(cle); }));
    };
    (async () => {
      let svg = '', coupe = false;
      for (const max of [40, 15, 5, 0]) {
        const texte = R.texte(d, { journalMax: max });
        try { svg = qrDe(mode === 'lien' ? base + '#' + await R.encoder(texte) : texte); break; } catch { coupe = true; }
      }
      afficher(svg, coupe);
    })();
    scrollTo(0, 0);
  }
})();
