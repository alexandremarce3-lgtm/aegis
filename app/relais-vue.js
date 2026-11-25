/* Écrans de la fiche relais (#/relais et #/relais/qr). Logique et libellés : relais.js. */
(() => {
  const R = window.RELAIS;
  const CLE = 'relais';
  const maintenant = () => Date.now();

  // Lecture avec effacement automatique après 24 heures.
  R.lire = () => { const d = memo.lire(CLE, null); if (d && R.perimee(d, maintenant())) { R.effacer(); return null; } return d; };
  R.ecrire = (d) => memo.ecrire(CLE, d);
  R.effacer = () => { try { localStorage.removeItem('aegis.' + CLE); } catch {} };
  R.ouvrir = () => R.lire() || (() => { const d = R.nouvelle(maintenant()); R.ecrire(d); return d; })();
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
    if (sous === 'qr') return vueQr();
    titre('Fiche relais', true);
    const d = R.ouvrir(), a = d.alerte, v = d.victime, m = d.malaise;
    vue.innerHTML = `<article class="fiche relais">
      <p class="avant">D’abord protéger, alerter et faire les gestes. Remplissez cette fiche pendant l’attente des secours, puis montrez-la leur.</p>
      <p class="relais-actions"><a class="btn lien" href="#/relais/qr">Montrer aux secours (QR code)</a> <button class="btn clair" id="effacer">Effacer la fiche</button></p>
      <p class="meta">Rien n’est envoyé : la fiche reste sur ce téléphone et s’efface automatiquement le ${R.finDeVie(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}.</p>

      <h2>Alerte</h2>
      ${champ('a-heure', 'Heure de l’appel', a.heure, 'type="time"')}
      ${radios('a-numero', 'Numéro appelé', R.NUMEROS, a.numero)}
      ${champ('a-nature', 'Nature du problème (maladie, accident...)', a.nature)}
      ${champ('a-victimes', 'Nombre de victimes', a.victimes, 'type="number" min="1" inputmode="numeric"')}
      ${champ('a-lieu', 'Lieu le plus précis possible', a.lieu)}

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
      d.alerte = { heure: val('a-heure'), numero: coche('a-numero'), nature: val('a-nature'), victimes: val('a-victimes'), lieu: val('a-lieu') };
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
    $('#effacer').addEventListener('click', () => { if (confirm('Effacer toute la fiche relais ?')) { R.effacer(); location.hash = '#/'; } });
  };

  function vueQr() {
    titre('Pour les secours', true);
    const d = R.lire();
    if (!d) { vue.innerHTML = '<p>Aucune fiche relais en cours.</p><p><a class="btn lien" href="#/relais">Remplir une fiche</a></p>'; return; }
    let texte = '', svg = '', coupe = false;
    for (const max of [40, 15, 5, 0]) {
      texte = R.texte(d, { journalMax: max });
      try { qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; const q = qrcode(0, 'M'); q.addData(texte, 'Byte'); q.make(); svg = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); break; } catch { coupe = true; }
    }
    vue.innerHTML = `<article class="fiche relais-qr">
      <p class="avant">Montrez cet écran aux secours. Ils peuvent scanner le code avec l’appareil photo de leur téléphone : le texte s’affiche, sans application ni réseau.</p>
      ${svg ? `<div class="qr" role="img" aria-label="QR code de la fiche relais">${svg}</div>` : '<p><b>Fiche trop longue pour un QR code :</b> montrez le texte ci-dessous.</p>'}
      ${coupe && svg ? '<p class="meta">Le déroulé a été raccourci dans le QR code ; il est complet ci-dessous.</p>' : ''}
      <pre class="texte-relais">${esc(R.texte(d))}</pre>
      <p class="relais-actions"><a class="btn clair lien" href="#/relais">Modifier la fiche</a></p>
    </article>`;
    scrollTo(0, 0);
  }
})();
