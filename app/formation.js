/* Module « Se former » : questions fabriquées automatiquement à partir des textes officiels.
   Les propositions de réponse sont des phrases des fiches (ou du guide APS), jamais réécrites. */
(() => {
  const melanger = (t) => { const a = [...t]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cle = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const XP_PAR_REPONSE = 10, XP_PAR_NIVEAU = 100;
  let banque = null;
  // Actions communes à presque toutes les situations : elles ne permettent pas de distinguer une fiche d'une autre.
  const COMMUN = /^(protéger|surveiller|faire alerter|alerter|en cas d[’']aggravation|rassurer|réchauffer|desserrer|demander de l[’']aide|se laver|se protéger)/i;

  // --- Banque de phrases officielles, propres à une seule fiche ---
  function construire() {
    const PR = FICHES.filter((f) => f.type === 'PR'), FT = FICHES.filter((f) => f.type === 'FT');
    const vues = {};
    const actions = {}, points = {};
    for (const f of PR) {
      // Chaque action garde son intertitre officiel (ex. « La victime saigne du nez ») pour rester dans son contexte.
      let contexte = '';
      actions[f.id] = [];
      for (const b of f.blocks.slice(debutAction(f))) {
        if (b.k === 'h2') contexte = '';
        else if (b.k === 'h3') contexte = b.t + ' → ';
        else if (b.k === 'li' && b.l === 1 && b.t.length >= 20 && !/:$/.test(b.t.trim()) && !COMMUN.test(b.t)) actions[f.id].push({ nu: b.t, t: contexte + b.t });
      }
      for (const t of new Set(actions[f.id].map((x) => cle(x.nu)))) vues[t] = (vues[t] || 0) + 1;
    }
    for (const f of PR) actions[f.id] = actions[f.id].filter((x) => vues[cle(x.nu)] === 1).map((x) => x.t);
    const vuesP = {};
    for (const f of FT) {
      const i = f.blocks.findIndex((b) => b.k === 'h2' && b.t === 'Points clés');
      let amorce = '';
      points[f.id] = [];
      if (i >= 0) for (const b of f.blocks.slice(i + 1)) {
        if (b.k === 'p') amorce = /:$/.test(b.t.trim()) ? b.t.trim() + ' ' : '';
        else if (b.k === 'li' && b.l === 1) points[f.id].push(amorce + b.t);
      }
      for (const t of new Set(points[f.id].map(cle))) vuesP[t] = (vuesP[t] || 0) + 1;
    }
    for (const f of FT) points[f.id] = points[f.id].filter((t) => vuesP[cle(t)] === 1);
    return { PR, FT, actions, points };
  }

  const autres = (obj, sauf, n) => melanger(Object.entries(obj).filter(([k]) => !sauf.includes(k)).flatMap(([, v]) => v)).slice(0, n);

  function questionsAdulte(theme) {
    const { PR, actions, points } = banque;
    const q = [];
    for (const p of PR.filter((x) => theme === 'tout' || x.id === theme)) {
      for (const a of actions[p.id]) {
        q.push({ fiche: p.id, texte: `Laquelle de ces actions fait partie de la conduite à tenir « ${p.title} » ?`, bon: a, choix: melanger([a, ...autres(actions, [p.id], 3)]) });
        q.push({ fiche: p.id, texte: `« ${a} » — à quelle situation correspond cette action ?`, bon: p.title, choix: melanger([p.title, ...melanger(PR.filter((x) => x.id !== p.id).map((x) => x.title)).slice(0, 3)]) });
      }
      for (const id of (LIES[p.id] || []).filter((x) => points[x] && points[x].length)) for (const pt of points[id]) {
        const ft = fiche(id);
        q.push({ fiche: id, texte: `Lequel de ces points clés concerne « ${ft.title} » ?`, bon: pt, choix: melanger([pt, ...autres(points, [id], 3)]) });
      }
    }
    return melanger(q).slice(0, 8);
  }

  const GROUPE_SAIGNEMENT = ['saignement', 'plaie', 'nez'];
  function questionsJeune(theme) {
    if (theme === 'numeros') return melanger(APS.numeros.map(([n, s]) => ({ texte: `À quoi correspond le ${n} ?`, bon: s, choix: melanger(APS.numeros.map((x) => x[1])) })));
    return melanger(Object.entries(APS.gestes).map(([id, g]) => {
      const s = SITUATIONS.find((x) => x.id === id);
      const exclus = GROUPE_SAIGNEMENT.includes(id) ? GROUPE_SAIGNEMENT : [id];
      return { situation: id, texte: `${s.label} : quel est le bon geste ?`, bon: g[0], choix: melanger([g[0], ...autres(APS.gestes, exclus, 3)]) };
    }));
  }

  const themes = () => profil === 'jeune'
    ? [{ id: 'gestes', label: 'Les gestes que je sais faire' }, { id: 'numeros', label: 'Les numéros d’urgence' }]
    : [...banque.PR.map((p) => ({ id: p.id, label: p.title })), { id: 'tout', label: 'Tout mélanger' }];
  const cleProgres = () => 'progres-' + (profil === 'jeune' ? 'jeune' : 'grand');
  const progres = () => memo.lire(cleProgres(), { xp: 0, meilleurs: {} });

  window.vueFormation = function () {
    banque ||= construire();
    titre('Se former', false);
    const p = progres(), niveau = Math.floor(p.xp / XP_PAR_NIVEAU) + 1, reste = p.xp % XP_PAR_NIVEAU;
    vue.innerHTML = `<div class="niveau"><b>Niveau ${niveau}</b> · ${p.xp} XP
        <div class="barre"><i style="width:${reste}%"></i></div><small>Encore ${XP_PAR_NIVEAU - reste} XP avant le niveau ${niveau + 1}. Chaque bonne réponse rapporte ${XP_PAR_REPONSE} XP.</small></div>
      <h2 class="section">Choisir un thème</h2>
      <ul class="liste">${themes().map((t) => { const m = p.meilleurs[t.id]; return `<li><a href="#/quiz/${t.id}"><span>${esc(t.label)}</span>${m ? `<small class="${m[0] / m[1] >= 0.8 ? 'ok' : ''}">${m[0] / m[1] >= 0.8 ? '✔ ' : ''}${m[0]}/${m[1]}</small>` : ''}</a></li>`; }).join('')}</ul>
      <p class="source">Les questions et les réponses sont tirées des textes officiels, sans réécriture. Ce module aide à réviser : il ne remplace pas une formation avec un formateur.</p>`;
    scrollTo(0, 0);
  };

  window.vueQuiz = function (theme) {
    banque ||= construire();
    const t = themes().find((x) => x.id === theme);
    if (!t) return vueFormation();
    const questions = profil === 'jeune' ? questionsJeune(theme) : questionsAdulte(theme);
    let i = 0, score = 0;
    titre(t.label, true);
    const poser = () => {
      const q = questions[i];
      vue.innerHTML = `<p class="meta">Question ${i + 1} sur ${questions.length}</p><p class="question">${esc(q.texte)}</p>
        ${q.choix.map((c, k) => `<button class="choix" data-k="${k}">${esc(c)}</button>`).join('')}<div id="suite"></div>`;
      scrollTo(0, 0);
      vue.querySelectorAll('.choix').forEach((b) => b.addEventListener('click', () => {
        const juste = q.choix[+b.dataset.k] === q.bon;
        if (juste) score++;
        vue.querySelectorAll('.choix').forEach((x) => { x.disabled = true; if (q.choix[+x.dataset.k] === q.bon) x.classList.add('bon'); });
        if (!juste) b.classList.add('faux');
        const lien = q.fiche ? `#/fiche/${q.fiche}` : q.situation ? `#/s/${q.situation}` : '';
        $('#suite').innerHTML = `<p class="retour">${juste ? `✔ Bonne réponse, +${XP_PAR_REPONSE} XP` : '✘ Ce n’est pas ça : la bonne réponse est en vert.'}${lien ? ` · <a href="${lien}">Revoir la fiche</a>` : ''}</p>
          <button class="btn" id="suivant">${i + 1 < questions.length ? 'Question suivante' : 'Voir mon résultat'}</button>`;
        $('#suivant').addEventListener('click', () => { i++; i < questions.length ? poser() : finir(); });
        $('#suivant').scrollIntoView({ block: 'nearest' });
      }));
    };
    const finir = () => {
      const p = progres(), avant = Math.floor(p.xp / XP_PAR_NIVEAU) + 1;
      p.xp += score * XP_PAR_REPONSE;
      const m = p.meilleurs[theme];
      if (!m || score / questions.length > m[0] / m[1]) p.meilleurs[theme] = [score, questions.length];
      memo.ecrire(cleProgres(), p);
      const apres = Math.floor(p.xp / XP_PAR_NIVEAU) + 1;
      vue.innerHTML = `<div class="niveau"><b>${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${questions.length}</b><br>+${score * XP_PAR_REPONSE} XP${apres > avant ? ` · Niveau ${apres} atteint` : ''}</div>
        <p><a class="btn" style="text-decoration:none;display:inline-block" href="#/former">Retour aux thèmes</a></p>`;
      scrollTo(0, 0);
    };
    questions.length ? poser() : vueFormation();
  };
})();
