/* Petits dessins du mode « moins de 10 ans ». Volontairement simples et doux : ils aident à
   reconnaître la situation et le geste, sans rien montrer de choquant. */
(() => {
  const PEAU = '#ffd7b0', T = '#3b3b46';
  const tete = (x, y, o = {}) => {
    const yeux = o.yeux === 'fermes'
      ? `<path d="M${x - 9} ${y - 1}q3 3 6 0M${x + 3} ${y - 1}q3 3 6 0" fill="none" stroke="${T}" stroke-width="2" stroke-linecap="round"/>`
      : `<circle cx="${x - 6}" cy="${y - 1}" r="2.3" fill="${T}"/><circle cx="${x + 6}" cy="${y - 1}" r="2.3" fill="${T}"/>`;
    const bouche = {
      sourire: `<path d="M${x - 6} ${y + 7}q6 6 12 0" fill="none" stroke="${T}" stroke-width="2" stroke-linecap="round"/>`,
      o: `<circle cx="${x}" cy="${y + 9}" r="3.6" fill="#8a4b4b"/>`,
      triste: `<path d="M${x - 6} ${y + 11}q6 -6 12 0" fill="none" stroke="${T}" stroke-width="2" stroke-linecap="round"/>`,
      plat: `<path d="M${x - 5} ${y + 9}h10" stroke="${T}" stroke-width="2" stroke-linecap="round"/>`,
    }[o.bouche || 'sourire'];
    return `<circle cx="${x}" cy="${y}" r="17" fill="${PEAU}" stroke="${T}" stroke-width="2.5"/>
      <path d="M${x - 17} ${y - 3}a17 17 0 0 1 34 0q-17 -13 -34 0z" fill="${o.cheveux || '#6b4a2e'}" stroke="${T}" stroke-width="2"/>${yeux}${bouche}`;
  };
  const bras = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${T}" stroke-width="11" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${PEAU}" stroke-width="6.5" stroke-linecap="round"/>`;
  const debout = (x, c, o = {}) => `<path d="M${x - 7} 108v20M${x + 7} 108v20" stroke="${T}" stroke-width="8" stroke-linecap="round"/>
    <rect x="${x - 15}" y="66" width="30" height="46" rx="13" fill="${c}" stroke="${T}" stroke-width="2.5"/>${tete(x, 50, o)}`;
  const allonge = (c) => `<rect x="62" y="103" width="78" height="24" rx="12" fill="${c}" stroke="${T}" stroke-width="2.5"/>
    <path d="M140 115h34" stroke="${T}" stroke-width="9" stroke-linecap="round"/>${tete(46, 112, { yeux: 'fermes', bouche: 'plat', cheveux: '#444' })}`;
  const bulle = (x, y, txt) => `<rect x="${x}" y="${y}" width="${14 + txt.length * 9}" height="24" rx="12" fill="#fff" stroke="${T}" stroke-width="2"/><text x="${x + 7 + txt.length * 4.5}" y="${y + 17}" text-anchor="middle" font-size="15" font-weight="800" fill="#c8102e" font-family="system-ui,sans-serif">${txt}</text>`;
  // Un enfant qui téléphone aux secours.
  const appelant = (x, c = '#3aa76d') => `${debout(x, c, { cheveux: '#c0392b' })}${bras(x + 13, 80, x + 20, 58)}<rect x="${x + 15}" y="38" width="11" height="22" rx="3" fill="${T}"/>${bulle(x + 20, 8, '15')}`;
  const robinet = (x, h = 52, gouttes = true) => `<path d="M${x - 26} 14h30a8 8 0 0 1 8 8v10h-12v-6h-26z" fill="#b8c2cc" stroke="${T}" stroke-width="2.5"/>
    <rect x="${x + 2}" y="34" width="8" height="${h}" rx="4" fill="#5bb8f5"/>${gouttes ? `<circle cx="${x - 2}" cy="92" r="3" fill="#5bb8f5"/><circle cx="${x + 15}" cy="94" r="3" fill="#5bb8f5"/>` : ''}`;
  // Petits repères : « ne répond pas », souffle présent ou absent, son présent ou absent.
  const croix = (x, y, r = 9) => `<path d="M${x - r} ${y - r}l${2 * r} ${2 * r}M${x + r} ${y - r}l${-2 * r} ${2 * r}" stroke="#c8102e" stroke-width="4" stroke-linecap="round"/>`;
  const pasDeReponse = (x, y) => `<path d="M${x} ${y}h30a7 7 0 0 1 7 7v10a7 7 0 0 1 -7 7h-16l-8 8v-8h-6a7 7 0 0 1 -7 -7v-10a7 7 0 0 1 7 -7z" fill="#fff" stroke="${T}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${x + 6}" cy="${y + 12}" r="2.2" fill="${T}"/><circle cx="${x + 15}" cy="${y + 12}" r="2.2" fill="${T}"/><circle cx="${x + 24}" cy="${y + 12}" r="2.2" fill="${T}"/>${croix(x + 15, y + 12, 11)}`;
  const souffle = (x, y, present) => `<path d="M${x} ${y}q5 -6 10 0t10 0t10 0M${x} ${y + 11}q5 -6 10 0t10 0t10 0M${x} ${y + 22}q5 -6 10 0t10 0t10 0" fill="none" stroke="${present ? '#3b9fe6' : '#9aa3ad'}" stroke-width="3.5" stroke-linecap="round"/>${present ? '' : croix(x + 15, y + 11, 12)}`;
  const son = (x, y, present) => `<path d="M${x} ${y + 7}h7l9 -7v24l-9 -7h-7z" fill="${T}" stroke="${T}" stroke-width="2" stroke-linejoin="round"/>${present
    ? `<path d="M${x + 22} ${y + 5}q6 7 0 14M${x + 29} ${y}q11 12 0 24" fill="none" stroke="#3aa76d" stroke-width="3.5" stroke-linecap="round"/>`
    : croix(x + 31, y + 12, 7)}`;
  const sol = `<path d="M10 130h220" stroke="${T}" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>`;
  const cadre = (fond, dedans) => `<svg class="dessin" viewBox="0 0 240 140" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="140" rx="16" fill="${fond}"/>${sol}${dedans}</svg>`;

  window.DESSINS = {
    etouffement: cadre('#e8f3ff', `${debout(78, '#4a90d9', { bouche: 'o' })}${bras(64, 82, 73, 69)}${bras(92, 82, 83, 69)}
      <path d="M104 30l6 -8M110 40h9M104 50l6 7" stroke="#e67e22" stroke-width="3" stroke-linecap="round"/>${appelant(168)}`),
    saignement: cadre('#fff0ec', `${debout(62, '#4a90d9', { bouche: 'triste' })}${bras(76, 80, 142, 80)}
      <path d="M104 96q4 6 0 9q-4 -3 0 -9zM114 104q4 6 0 9q-4 -3 0 -9z" fill="#e74c3c"/>
      ${debout(186, '#3aa76d', { cheveux: '#c0392b' })}
      <path d="M95 68h30a4 4 0 0 1 4 4v17a4 4 0 0 1 -4 4h-30a4 4 0 0 1 -4 -4v-17a4 4 0 0 1 4 -4z" fill="#dbe7f3" stroke="${T}" stroke-width="2.5"/><path d="M99 74h22M99 80h22M99 86h22" stroke="#aebfd1" stroke-width="2" stroke-linecap="round"/>
      ${bras(172, 80, 122, 78)}<circle cx="116" cy="78" r="8" fill="${PEAU}" stroke="${T}" stroke-width="2.5"/>`),
    arret: cadre('#f1ecff', `${allonge('#4a90d9')}${pasDeReponse(8, 52)}${souffle(58, 66, false)}
      ${debout(204, '#3aa76d', { cheveux: '#c0392b', bouche: 'o' })}${bras(190, 82, 180, 92)}
      <rect x="150" y="78" width="34" height="30" rx="6" fill="#2ecc71" stroke="${T}" stroke-width="2.5"/>
      <path d="M167 101c-12 -8 -10 -17 -4 -17c3 0 4 3 4 3s1 -3 4 -3c6 0 8 9 -4 17z" fill="#fff"/><path d="M169 86l-5 8h5l-3 7" fill="none" stroke="#f1c40f" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`),
    inconscient: cadre('#eef7ee', `${allonge('#e39b3b')}${pasDeReponse(8, 52)}${souffle(58, 66, true)}${appelant(184)}`),
    malaise: cadre('#fff8e1', `${debout(78, '#9b6bd3', { bouche: 'triste', cheveux: '#444' })}${bras(92, 80, 90, 44)}
      <path d="M52 22q6 -8 12 0t12 0M92 14q5 -7 10 0t10 0" fill="none" stroke="#e67e22" stroke-width="3" stroke-linecap="round"/>${appelant(168)}`),
    plaie: cadre('#e8f6ff', `${robinet(104)}<rect x="40" y="84" width="130" height="24" rx="12" fill="${PEAU}" stroke="${T}" stroke-width="2.5"/>
      <path d="M100 92l8 8M108 92l-8 8" stroke="#e74c3c" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="182" y="100" width="40" height="22" rx="9" fill="#ffc2d4" stroke="${T}" stroke-width="2.5"/><circle cx="190" cy="92" r="5" fill="#fff" stroke="#9fd3f5" stroke-width="2"/><circle cx="204" cy="86" r="7" fill="#fff" stroke="#9fd3f5" stroke-width="2"/><circle cx="216" cy="94" r="4" fill="#fff" stroke="#9fd3f5" stroke-width="2"/>`),
    brulure: cadre('#e8f6ff', `${robinet(82, 40, false)}
      <g transform="rotate(16 115 96)"><rect x="40" y="84" width="150" height="24" rx="12" fill="${PEAU}" stroke="${T}" stroke-width="2.5"/>
        <ellipse cx="146" cy="96" rx="14" ry="7" fill="#ff9c8a"/>
        <path d="M82 90q30 -5 60 4t50 2" fill="none" stroke="#5bb8f5" stroke-width="7" stroke-linecap="round" opacity=".85"/></g>
      <circle cx="198" cy="124" r="3.2" fill="#5bb8f5"/><circle cx="208" cy="118" r="2.6" fill="#5bb8f5"/>
      <path d="M186 40q4 -8 0 -14q10 6 6 16q6 -2 5 -8q8 12 -3 20q-10 2 -8 -14z" fill="#ffb347" stroke="${T}" stroke-width="2" opacity=".9"/>${croix(196, 40, 13)}`),
    trauma: cadre('#fff3e6', `<rect x="52" y="92" width="30" height="34" rx="13" fill="#4a90d9" stroke="${T}" stroke-width="2.5"/>${tete(67, 76, { bouche: 'triste' })}
      <path d="M80 120h50" stroke="${T}" stroke-width="10" stroke-linecap="round"/><path d="M131 120v-9" stroke="${T}" stroke-width="9" stroke-linecap="round"/>
      <path d="M118 104q5 -6 10 0M140 100q4 4 0 10M112 96q8 -9 18 -3" fill="none" stroke="#e67e22" stroke-width="3" stroke-linecap="round"/>
      ${debout(190, '#3aa76d', { cheveux: '#c0392b' })}${bras(176, 82, 160, 98)}<circle cx="157" cy="101" r="8" fill="${PEAU}" stroke="${T}" stroke-width="2.5"/>`),
    nez: cadre('#ffeef2', `${debout(120, '#4a90d9', { bouche: 'plat' })}${bras(134, 84, 124, 60)}<circle cx="121" cy="56" r="5" fill="${PEAU}" stroke="${T}" stroke-width="2.5"/>
      <path d="M176 44a22 22 0 1 1 -1 0" fill="none" stroke="${T}" stroke-width="2.5"/><path d="M176 66v-22M176 66l12 8" stroke="${T}" stroke-width="3" stroke-linecap="round"/>`),
    alerter: cadre('#eaf7ef', `<rect x="84" y="14" width="72" height="116" rx="12" fill="${T}"/><rect x="91" y="26" width="58" height="84" rx="5" fill="#fff"/>
      <text x="120" y="52" text-anchor="middle" font-size="22" font-weight="800" fill="#c8102e" font-family="system-ui,sans-serif">15</text>
      <text x="120" y="78" text-anchor="middle" font-size="22" font-weight="800" fill="#c8102e" font-family="system-ui,sans-serif">18</text>
      <text x="120" y="104" text-anchor="middle" font-size="22" font-weight="800" fill="#c8102e" font-family="system-ui,sans-serif">112</text><circle cx="120" cy="120" r="4" fill="#fff"/>
      <path d="M168 40q10 10 0 22M178 32q16 18 0 38M72 40q-10 10 0 22M62 32q-16 18 0 38" fill="none" stroke="#3aa76d" stroke-width="3.5" stroke-linecap="round"/>`),
    proteger: cadre('#fff8e1', `<path d="M62 28l44 78h-88z" fill="#f1c40f" stroke="${T}" stroke-width="3" stroke-linejoin="round"/><path d="M62 54v26" stroke="${T}" stroke-width="6" stroke-linecap="round"/><circle cx="62" cy="93" r="4" fill="${T}"/>
      ${debout(150, '#3aa76d', { cheveux: '#c0392b', bouche: 'plat' })}${bras(164, 84, 186, 92)}<path d="M186 92h12" stroke="${T}" stroke-width="7" stroke-linecap="round"/><path d="M186 92h11" stroke="${PEAU}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M184 52h34M206 40l13 12l-13 12" fill="none" stroke="#3aa76d" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`),
    etouffement_son: cadre('#eaf7ef', `${son(14, 14, true)}${debout(104, '#4a90d9', { bouche: 'o' })}${bras(118, 84, 113, 66)}
      <path d="M134 50q8 9 0 18M146 42q14 17 0 34M158 34q20 25 0 50" fill="none" stroke="#e67e22" stroke-width="3.5" stroke-linecap="round"/>`),
    etouffement_muet: cadre('#ffecec', `${son(14, 14, false)}${debout(120, '#4a90d9', { bouche: 'o' })}${bras(106, 82, 115, 69)}${bras(134, 82, 125, 69)}
      <path d="M146 30l6 -8M152 40h9M146 50l6 7" stroke="#e67e22" stroke-width="3" stroke-linecap="round"/>`),
    aide: cadre('#f3ecff', `${debout(74, '#3aa76d', { cheveux: '#c0392b', bouche: 'o' })}${bras(88, 84, 114, 86)}
      <path d="M104 40l7 -9M112 48h11" stroke="#e67e22" stroke-width="3.5" stroke-linecap="round"/>
      <g transform="translate(172 130) scale(1.3) translate(-172 -130)">${debout(172, '#9b6bd3', { cheveux: '#444' })}</g>`),
    dire: cadre('#eaf7ef', `${appelant(62)}
      <path d="M128 34h86a10 10 0 0 1 10 10v48a10 10 0 0 1 -10 10h-62l-16 14v-14h-8a10 10 0 0 1 -10 -10v-48a10 10 0 0 1 10 -10z" fill="#fff" stroke="${T}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="144" cy="56" r="8" fill="${PEAU}" stroke="${T}" stroke-width="2"/><path d="M160 52h46M160 62h34" stroke="#9aa3ad" stroke-width="4" stroke-linecap="round"/>
      <path d="M136 78h70M136 90h52" stroke="#9aa3ad" stroke-width="4" stroke-linecap="round"/>`),
    lieu: cadre('#fff3e6', `${appelant(62)}
      <ellipse cx="176" cy="118" rx="26" ry="7" fill="#e3d6c3"/>
      <path d="M176 116c-20 -26 -30 -38 -30 -52a30 30 0 0 1 60 0c0 14 -10 26 -30 52z" fill="#c8102e" stroke="${T}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="176" cy="64" r="11" fill="#fff"/>`),
  };
})();
