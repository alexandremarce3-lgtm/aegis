/* Aide-mémoire premiers secours — logique de l'appli. Le contenu vient de fiches.js. */
const FICHES = window.FICHES, SITUATIONS = window.SITUATIONS;
const SOURCE = 'Références techniques nationales « Premiers Secours Citoyen » (PSC), DGSCGC, ministère de l’Intérieur, édition juillet 2026';
const TYPES = { PR: 'Procédure', FT: 'Fiche technique', AC: 'Apport de connaissances' };
const $ = (s) => document.querySelector(s);
const vue = $('#vue');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = (s) => s.toLowerCase().replace(/œ/g, 'oe').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const fiche = (id) => FICHES.find((f) => f.id === id);
const APS = window.APS, DESSINS = window.DESSINS;
const memo = { lire: (k, d) => { try { return JSON.parse(localStorage.getItem('aegis.' + k)) ?? d; } catch { return d; } }, ecrire: (k, v) => { try { localStorage.setItem('aegis.' + k, JSON.stringify(v)); } catch {} } };
let profil = memo.lire('profil', null); // 'jeune' (moins de 12 ans) ou 'grand'

// Gestes liés : les fiches qui suivent une procédure jusqu'à la procédure suivante.
const LIES = {};
{ let pr = null; for (const f of FICHES) { if (f.type === 'PR') { pr = f.id; LIES[pr] = []; } else if (pr && f.code !== null || (pr && f.type === 'AC' && f.id.startsWith('defibrillateur'))) LIES[pr].push(f.id); } }

/* ---------- Rendu d'une fiche (texte officiel, tel quel) ---------- */
function rendre(blocs) {
  let h = '', niveau = 0, dl = false;
  const fermer = (n) => { while (niveau > n) { h += '</li></ul>'; niveau--; } };
  const note = (b) => (b.n || []).map((n) => `<span class="note">ⓘ ${esc(n)}</span>`).join('');
  for (const b of blocs) {
    if (b.k !== 'def' && dl) { h += '</dl>'; dl = false; }
    if (b.k === 'li') {
      if (b.l > niveau) { while (niveau < b.l) { h += '<ul><li>'; niveau++; } h = h.replace(/<li>$/, ''); h += '<li>'; }
      else { fermer(b.l); h += '</li><li>'; }
      h += esc(b.t) + note(b);
    } else {
      fermer(0);
      if (b.k === 'h2') h += `<h2>${esc(b.t)}</h2>${note(b)}`;
      else if (b.k === 'h3') h += `<h3 id="${norm(b.t).replace(/ /g, '-')}">${esc(b.t)}</h3>${note(b)}`;
      else if (b.k === 'def') { if (!dl) { h += '<dl>'; dl = true; } h += `<dt>${esc(b.t)}</dt><dd>${esc(b.d)}</dd>`; }
      else h += `<p>${esc(b.t)}${note(b)}</p>`;
    }
  }
  fermer(0); if (dl) h += '</dl>';
  return h;
}

// Où commence la partie « que faire » d'une procédure.
function debutAction(f) {
  if (f.type !== 'PR') return 0;
  let i = f.blocks.findIndex((b) => b.k === 'h2' && /^Conduite/.test(b.t));
  if (i >= 0) return i;
  const p = f.blocks.findIndex((b) => b.k === 'h2' && /^Principe/.test(b.t));
  i = f.blocks.findIndex((b, k) => k > p && b.k === 'h3');
  return i >= 0 ? i : 0;
}

function vueFiche(id, ancre, opt = {}) {
  const f = fiche(id);
  if (!f) return vueAccueil();
  titre(f.title, true);
  const d = debutAction(f);
  const lies = (LIES[id] || []).map((x) => `<a href="#/fiche/${x}">${esc(fiche(x).title)}</a>`).join('');
  vue.innerHTML = `<article class="fiche">
    ${opt.avant || ''}
    ${f.type === 'PR' && !opt.avant ? '<p class="avant">Mettez-vous en sécurité, puis alertez ou faites alerter les secours : <b>15</b>, <b>18</b> ou <b>112</b>.</p>' : ''}
    ${opt.replie ? '<details class="comprendre"><summary>La conduite à tenir complète (texte pour les plus grands, à lire avec un adulte)</summary>' : ''}
    <div class="agir">${rendre(f.blocks.slice(d))}</div>
    ${opt.replie ? '</details>' : ''}
    ${lies ? `<h2>Les gestes</h2><div class="gestes">${lies}</div>` : ''}
    ${d > 0 ? `<details class="comprendre"><summary>Comprendre : définition, signes, causes, risques</summary>${rendre(f.blocks.slice(0, d))}</details>` : ''}
    <p class="source"><b>${TYPES[f.type]}${f.code ? ' ' + f.code : ''} · mise à jour ${f.maj}</b><br>Texte reproduit sans modification. Source : ${SOURCE}.</p>
  </article>`;
  if (opt.apres) opt.apres();
  if (ancre) { const el = document.getElementById(norm(decodeURIComponent(ancre)).replace(/ /g, '-')); if (el) el.scrollIntoView(); }
  else scrollTo(0, 0);
}

/* ---------- Recherche (texte ou voix) ---------- */
function chercher(q) {
  const n = ' ' + norm(q) + ' ';
  if (n.trim().length < 2) return [];
  const res = [];
  for (const s of SITUATIONS) {
    let score = 0;
    for (const m of s.mots) if (n.includes(' ' + m)) score += m.length;
    if (norm(s.label).includes(n.trim())) score += 10;
    if (score) res.push({ score, href: lienSituation(s), label: s.label, sous: fiche(s.fiche).title, icon: s.icon });
  }
  for (const f of FICHES) if (norm(f.title).includes(n.trim()) && !res.some((r) => r.href === '#/fiche/' + f.id)) res.push({ score: 5, href: '#/fiche/' + f.id, label: f.title, sous: TYPES[f.type], icon: '📄' });
  return res.sort((a, b) => b.score - a.score);
}
const lienSituation = (s) => `#/s/${s.id}`;

function vueSituation(id) {
  const s = SITUATIONS.find((x) => x.id === id);
  if (!s) return vueAccueil();
  if (profil !== 'jeune') return vueFiche(s.fiche, s.ancre);
  const gestes = APS.gestes[s.id] || [];
  const avant = `<section class="jeune">
    ${DESSINS[s.id] || ''}
    ${gestes.length ? `<h2>Le geste</h2>${gestes.map((g) => `<p class="geste">${esc(g)}</p>`).join('')}` : ''}
    <h2>Alerter</h2><ul>${APS.alerter.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
    ${'speechSynthesis' in window ? '<button class="btn" id="lire">🔊 Écouter</button>' : ''}
    <p class="source">Formulations du guide ${APS.source}.${gestes.length ? '' : ' Ce guide ne prévoit pas de geste pour cette situation : la conduite à tenir complète est affichée ci-dessous.'}</p>
  </section>`;
  vueFiche(s.fiche, gestes.length ? null : s.ancre, { avant, replie: gestes.length > 0, apres: () => {
    $('#titre').textContent = s.label;
    const b = $('#lire');
    if (b) b.addEventListener('click', () => { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance([...gestes, ...APS.alerter].join('. ')); u.lang = 'fr-FR'; u.rate = 0.9; speechSynthesis.speak(u); });
  } });
}

function vueAccueil() {
  titre('Aegis — premiers secours', false);
  const Reco = window.SpeechRecognition || window.webkitSpeechRecognition;
  vue.innerHTML = `
    <p class="avant"><b>Urgence ?</b> Alertez d’abord les secours avec les boutons rouges en bas de l’écran.</p>
    <div class="recherche">
      <input id="q" type="search" placeholder="Que se passe-t-il ?" autocomplete="off" aria-label="Décrire la situation">
      ${Reco ? '<button id="micro" class="micro" aria-label="Décrire la situation à la voix">🎤</button>' : ''}
    </div>
    <p class="etat" id="etat" aria-live="polite"></p>
    <div id="resultats"></div>
    <div class="grille" id="grille">${SITUATIONS.map((s) => (profil === 'jeune' && DESSINS[s.id] ? `<a class="tuile illustree" href="${lienSituation(s)}">${DESSINS[s.id]}${esc(s.label)}</a>` : `<a class="tuile" href="${lienSituation(s)}"><i>${s.icon}</i>${esc(s.label)}</a>`)).join('')}</div>`;
  const q = $('#q'), out = $('#resultats'), etat = $('#etat');
  const maj = (auto) => {
    const r = chercher(q.value);
    $('#grille').hidden = !!q.value.trim();
    if (!q.value.trim()) { out.innerHTML = ''; return; }
    out.innerHTML = r.length
      ? `<ul class="liste">${r.map((x) => `<li><a href="${x.href}"><span>${x.icon} ${esc(x.label)}</span><small>${esc(x.sous)}</small></a></li>`).join('')}</ul>`
      : '<p>Aucune fiche trouvée. Essayez un autre mot, ou choisissez dans la liste.</p>';
    if (!r.length) $('#grille').hidden = false;
    // À la voix : ouvrir directement si un résultat domine nettement.
    if (auto && r.length && (r.length === 1 || r[0].score >= 1.5 * r[1].score)) location.hash = r[0].href;
  };
  q.addEventListener('input', () => maj(false));
  if (Reco) $('#micro').addEventListener('click', () => {
    const rec = new Reco(), b = $('#micro');
    rec.lang = 'fr-FR'; rec.interimResults = true; rec.maxAlternatives = 1;
    b.classList.add('ecoute'); etat.textContent = 'Je vous écoute… décrivez ce qui se passe.';
    rec.onresult = (e) => { const r = e.results[e.results.length - 1]; q.value = r[0].transcript; maj(r.isFinal); if (r.isFinal) etat.textContent = ''; };
    rec.onerror = (e) => { etat.textContent = e.error === 'not-allowed' ? 'Micro refusé : autorisez-le ou tapez votre recherche.' : 'Je n’ai pas compris. Réessayez ou tapez votre recherche.'; };
    rec.onend = () => b.classList.remove('ecoute');
    rec.start();
  });
}

/* ---------- Toutes les fiches ---------- */
function vueFiches() {
  titre('Toutes les fiches', false);
  const bloc = (t, l) => `<h2 class="section">${t}</h2><ul class="liste">${l.map((f) => `<li><a href="#/fiche/${f.id}"><span>${esc(f.title)}</span></a></li>`).join('')}</ul>`;
  const i = FICHES.findIndex((f) => f.code);
  vue.innerHTML = bloc('Secourir une personne — procédures', FICHES.filter((f) => f.type === 'PR'))
    + bloc('Les gestes — fiches techniques', FICHES.filter((f) => f.type === 'FT'))
    + bloc('Informations générales', FICHES.filter((f, k) => f.type === 'AC' && (k < i || true)))
    + `<p class="source">Source : ${SOURCE}.</p>`;
  scrollTo(0, 0);
}

/* ---------- Défibrillateurs à proximité (Géo'DAE) ---------- */
const API_DAE = 'https://tabular-api.data.gouv.fr/api/resources/edb6a9e1-2f16-4bbf-99e7-c3eb6b90794c/data/';
function charger(src, type) {
  return new Promise((ok, ko) => {
    const e = document.createElement(type === 'css' ? 'link' : 'script');
    if (type === 'css') { e.rel = 'stylesheet'; e.href = src; } else e.src = src;
    e.onload = ok; e.onerror = ko; document.head.append(e);
  });
}
const distance = (a, b, c, d) => { const R = 6371000, r = Math.PI / 180, x = (d - b) * r * Math.cos((a + c) * r / 2), y = (c - a) * r; return Math.round(Math.sqrt(x * x + y * y) * R); };

let position = null, daeMemo = null; // gardés en mémoire tant que l'appli est ouverte
try { position = JSON.parse(sessionStorage.getItem('aegis.position')); } catch {}
function localiser(ok, ko) {
  if (!navigator.geolocation) return ko && ko();
  navigator.geolocation.getCurrentPosition((p) => {
    position = { lat: p.coords.latitude, lon: p.coords.longitude };
    try { sessionStorage.setItem('aegis.position', JSON.stringify(position)); } catch {}
    ok && ok(position);
  }, () => ko && ko(), { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
}
// Si la localisation est déjà autorisée, on la prépare dès l'ouverture de l'appli.
navigator.permissions?.query({ name: 'geolocation' }).then((r) => { if (r.state === 'granted') localiser(); }).catch(() => {});

function vueDae() {
  titre('Défibrillateurs à proximité', false);
  vue.innerHTML = `<p class="avant">En cas d’arrêt cardiaque : alertez, massez, et envoyez <b>quelqu’un d’autre</b> chercher le défibrillateur. <a href="#/fiche/arret-cardiaque">Voir la fiche</a></p>
    <div id="carte"></div><p><button class="btn" id="loc">📍 Actualiser ma position</button></p>
    <p class="etat" id="etatDae" aria-live="polite"></p><ul class="liste" id="listeDae"></ul>
    <p class="source">Données : Géo’DAE, base nationale des défibrillateurs (ministère de la Santé), Licence Ouverte 2.0, via data.gouv.fr. Un appareil peut être absent, déplacé ou inaccessible : fiez-vous aussi aux indications des secours. Fond de carte © OpenStreetMap.</p>`;
  const etat = $('#etatDae');
  let carte, calque;
  const pret = Promise.all([charger('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'css'), charger('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'js')])
    .then(() => {
      carte = L.map('carte').setView([46.6, 2.4], 5);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(carte);
      calque = L.layerGroup().addTo(carte);
    }).catch(() => { $('#carte').hidden = true; });

  async function autour(lat, lon) {
    etat.textContent = 'Recherche des défibrillateurs autour de vous…';
    // Zone de recherche élargie par paliers (environ 350 m, 900 m, puis 2,5 km) jusqu'à trouver assez d'appareils.
    let lignes = [];
    try {
      for (const d of [0.003, 0.008, 0.022]) {
        const dl = d / Math.cos(lat * Math.PI / 180);
        const j = await (await fetch(`${API_DAE}?c_lat_coor1__greater=${lat - d}&c_lat_coor1__less=${lat + d}&c_long_coor1__greater=${lon - dl}&c_long_coor1__less=${lon + dl}&page_size=200`)).json();
        if (lignes.length && j.meta && j.meta.total > 200) break; // trop dense : on garde le palier précédent
        lignes = j.data || [];
        if (lignes.length >= 8) break;
      }
    } catch { etat.textContent = 'Impossible de charger les défibrillateurs (pas de connexion ?). Demandez aux secours ou autour de vous.'; return; }
    lignes = lignes.filter((r) => r.c_etat_fonct !== 'Hors service' && r.c_etat !== 'Supprimé définitivement')
      .map((r) => ({ ...r, m: distance(lat, lon, r.c_lat_coor1, r.c_long_coor1) })).sort((a, b) => a.m - b.m).slice(0, 20);
    daeMemo = { lat, lon, lignes };
    afficher(lat, lon, lignes);
  }
  async function afficher(lat, lon, lignes) {
    etat.textContent = lignes.length ? `Les ${lignes.length} défibrillateurs recensés les plus proches, du plus près au plus loin.` : 'Aucun défibrillateur recensé à moins d’environ 2 km.';
    const txt = (r) => [[r.c_adr_num, r.c_adr_voie].filter(Boolean).join(' '), r.c_com_nom].filter(Boolean).join(', ');
    const acces = (r) => [r.c_acc, r.c_acc_complt, r.c_dispo_horaires && r.c_dispo_horaires !== 'Mo-Su off' && (r.c_dispo_horaires === '24/7' ? 'Accessible 24 h/24' : 'Horaires : ' + r.c_dispo_horaires)].filter(Boolean).join(' · ');
    $('#listeDae').innerHTML = lignes.map((r) => `<li><a class="dae" href="https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${r.c_lat_coor1},${r.c_long_coor1}" target="_blank" rel="noopener"><b>${r.m} m — ${esc(r.c_nom || 'Défibrillateur')}</b><span>${esc(txt(r))}</span><span>${esc(acces(r))}</span></a></li>`).join('');
    await pret;
    if (carte) {
      calque.clearLayers();
      L.circleMarker([lat, lon], { radius: 8, color: '#0b5cad', fillOpacity: .9 }).addTo(calque).bindPopup('Vous êtes ici');
      for (const r of lignes) L.marker([r.c_lat_coor1, r.c_long_coor1]).addTo(calque).bindPopup(`<b>${esc(r.c_nom || 'Défibrillateur')}</b><br>${esc(txt(r))}<br>${esc(acces(r))}`);
      carte.setView([lat, lon], 16);
    }
  }
  const chercherIci = () => { etat.textContent = 'Localisation en cours…'; localiser((p) => autour(p.lat, p.lon), () => { etat.textContent = 'Localisation refusée ou impossible. Autorisez la localisation pour voir les défibrillateurs proches.'; }); };
  $('#loc').addEventListener('click', chercherIci);
  const siDeplace = (o) => localiser((p) => { if (distance(p.lat, p.lon, o.lat, o.lon) > 100) autour(p.lat, p.lon); });
  if (daeMemo) { afficher(daeMemo.lat, daeMemo.lon, daeMemo.lignes); siDeplace(daeMemo); }
  else if (position) { const o = position; autour(o.lat, o.lon); siDeplace(o); }
  else chercherIci();
  window.__daeAutour = autour; // pour les tests
}

/* ---------- À propos ---------- */
function vueApropos() {
  titre('À propos', false);
  vue.innerHTML = `<article class="fiche">
    <h3>Un aide-mémoire, pas une formation</h3>
    <p>Cette application rappelle les conduites à tenir enseignées en formation « Premiers Secours Citoyen » (PSC, anciennement PSC1). Elle ne remplace ni une formation avec un formateur, ni l’appel aux secours.</p>
    <h3>D’où vient le contenu</h3>
    <p>Les ${FICHES.length} fiches reproduisent, sans réécriture, le texte des ${SOURCE}. Chaque fiche affiche sa référence et sa date de mise à jour. Les notes « ⓘ » sont les notes de bas de page du document officiel.</p>
    <p>Seuls les noms des situations de l’écran d’accueil et les mots-clés de recherche ont été ajoutés pour retrouver rapidement la bonne fiche.</p>
    <p>En mode « moins de 12 ans », les gestes proposés reprennent les formulations du guide ${APS.source}.</p>
    <h3>Mon profil</h3>
    <p>Profil actuel : <b>${profil === 'jeune' ? 'moins de 12 ans' : '12 ans et plus'}</b>. <button class="btn" id="changer">Changer</button></p>
    <h3>Numéros d’urgence</h3>
    <p><a href="#/fiche/alerte">Voir la fiche « Alerte »</a> : 15, 18, 112 et 114.</p>
    <h3>Vie privée</h3>
    <p>Aucun compte, aucune donnée enregistrée. Votre position n’est utilisée que sur votre appareil pour afficher les défibrillateurs proches. La recherche vocale utilise la reconnaissance vocale de votre navigateur.</p>
  </article>`;
  $('#changer').addEventListener('click', () => { profil = null; memo.ecrire('profil', null); route(); });
  scrollTo(0, 0);
}

/* ---------- Choix du profil (premier lancement) ---------- */
function vueProfil() {
  titre('Aegis — premiers secours', false);
  vue.innerHTML = `<h2 class="section">Bienvenue</h2><p>Pour adapter l’affichage, indique ton âge :</p>
    <div class="grille"><a class="tuile" href="#" data-p="jeune"><i>🧒</i>J’ai moins de 12 ans</a><a class="tuile" href="#" data-p="grand"><i>🧑</i>J’ai 12 ans ou plus</a></div>
    <p class="source">Ce choix reste sur cet appareil et se modifie dans « À propos ».</p>`;
  vue.querySelectorAll('[data-p]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); profil = a.dataset.p; memo.ecrire('profil', profil); route(); }));
}

/* ---------- Navigation ---------- */
function titre(t, retour) { $('#titre').textContent = t; $('#back').hidden = !retour; document.title = t === 'Aegis — premiers secours' ? t : t + ' — Aegis'; }
$('#back').addEventListener('click', () => (history.length > 1 ? history.back() : (location.hash = '#/')));
function route() {
  const [, page, a, b] = location.hash.split('?')[0].split('/');
  document.body.classList.toggle('mode-jeune', profil === 'jeune');
  const onglet = { fiche: 'fiches', s: 'intervenir', quiz: 'former' }[page] || page || 'intervenir';
  document.querySelectorAll('.onglets a').forEach((x) => x.classList.toggle('actif', x.dataset.tab === onglet));
  if (!profil) return vueProfil();
  if (page === 'fiche') vueFiche(a, b);
  else if (page === 's') vueSituation(a);
  else if (page === 'former') vueFormation();
  else if (page === 'quiz') vueQuiz(a);
  else if (page === 'fiches') vueFiches();
  else if (page === 'dae') vueDae();
  else if (page === 'apropos') vueApropos();
  else vueAccueil();
}
addEventListener('hashchange', route);
route();
if ('serviceWorker' in navigator && location.protocol === 'https:' || location.hostname === 'localhost') navigator.serviceWorker?.register('sw.js');
