import { mkdirSync, writeFileSync } from 'node:fs';

const C = {
  bg: '#010409',
  bg2: '#07111d',
  panel: '#0d1117',
  panel2: '#161b22',
  border: '#30363d',
  border2: '#1f2d3d',
  text: '#e6edf3',
  soft: '#c9d1d9',
  muted: '#8b949e',
  blue: '#58a6ff',
  blue2: '#1f6feb',
  green: '#3fb950',
  green2: '#238636',
  purple: '#bc8cff',
  orange: '#d29922',
  red: '#f85149',
};

const fonts = `
  .sans{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
  .mono{font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace}
  .text{fill:${C.text}} .soft{fill:${C.soft}} .muted{fill:${C.muted}}
  .blue{fill:${C.blue}} .green{fill:${C.green}} .purple{fill:${C.purple}} .orange{fill:${C.orange}} .red{fill:${C.red}}
  .panel{fill:${C.panel};stroke:${C.border};stroke-width:1.6}
  .panel2{fill:${C.panel2};stroke:${C.border};stroke-width:1.4}
`;

const defs = (extra = '') => `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.bg}"/><stop offset="0.55" stop-color="${C.bg2}"/><stop offset="1" stop-color="${C.panel}"/>
  </linearGradient>
  <radialGradient id="glowBlue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(900 120) rotate(70) scale(360 520)">
    <stop stop-color="${C.blue2}" stop-opacity="0.46"/><stop offset="0.55" stop-color="${C.purple}" stop-opacity="0.16"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowGreen" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180 360) rotate(40) scale(260 360)">
    <stop stop-color="${C.green}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0"/>
  </radialGradient>
  <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
    <path d="M36 0H0V36" stroke="${C.border}" stroke-opacity="0.38" stroke-width="1"/>
  </pattern>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="145%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000" flood-opacity="0.44"/>
  </filter>
  <style>${fonts}</style>
${extra}
</defs>`;

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function svg({ width, height, title, desc, body, extraDefs = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(desc)}</desc>
${defs(extraDefs)}
<rect width="${width}" height="${height}" rx="12" fill="url(#bg)"/>
<rect width="${width}" height="${height}" rx="12" fill="url(#grid)" opacity="0.42"/>
<rect width="${width}" height="${height}" rx="12" fill="url(#glowBlue)"/>
<rect width="${width}" height="${height}" rx="12" fill="url(#glowGreen)"/>
${body}
</svg>`;
}

function t(x, y, text, { size = 18, cls = 'soft', weight = 500, family = 'sans', anchor = 'start', opacity = 1 } = {}) {
  return `<text x="${x}" y="${y}" class="${family} ${cls}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" opacity="${opacity}">${esc(text)}</text>`;
}

function tf(x, y, text, { size = 18, fill = C.text, weight = 500, family = 'sans', anchor = 'start', opacity = 1 } = {}) {
  return `<text x="${x}" y="${y}" font-family="${family === 'mono' ? 'SFMono-Regular,Consolas,Liberation Mono,monospace' : '-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif'}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}" opacity="${opacity}">${esc(text)}</text>`;
}

const TECH = {
  Python: { short: 'Py', color: '#3776AB' },
  TypeScript: { short: 'TS', color: '#3178C6' },
  JavaScript: { short: 'JS', color: '#F7DF1E', text: C.bg },
  Rust: { short: 'Rs', color: '#DEA584', text: C.bg },
  Go: { short: 'Go', color: '#00ADD8', text: C.bg },
  FastAPI: { short: 'FA', color: '#009688' },
  NestJS: { short: 'N', color: '#E0234E' },
  Express: { short: 'Ex', color: C.text, text: C.bg },
  PostgreSQL: { short: 'PG', color: '#336791' },
  SQLite: { short: 'SQL', color: '#58A6FF' },
  Redis: { short: 'Rd', color: '#DC382D' },
  Workers: { short: 'W', color: C.purple },
  WebSocket: { short: 'WS', color: C.blue },
  MQTT: { short: 'MQ', color: C.green },
  Docker: { short: 'DK', color: '#2496ED' },
  'CI/CD': { short: 'CI', color: C.orange },
  Monitoring: { short: 'Mo', color: C.green },
  Node: { short: 'Nd', color: '#3C873A' },
  Metrics: { short: 'Mx', color: C.blue },
  'Socket.IO': { short: 'IO', color: C.text, text: C.bg },
  Electron: { short: 'El', color: '#47848F' },
  Nuxt: { short: 'Nx', color: '#00DC82', text: C.bg },
  NanoID: { short: 'ID', color: C.purple },
  QR: { short: 'QR', color: C.blue },
  'sql.js': { short: 'SQL', color: C.orange, text: C.bg },
  AI: { short: 'AI', color: C.purple },
  Django: { short: 'Dj', color: '#0C4B33' },
  OpenRouter: { short: 'OR', color: C.blue },
  Groq: { short: 'Gq', color: C.orange, text: C.bg },
  GitHub: { short: 'GH', color: C.text, text: C.bg },
  API: { short: 'API', color: C.blue },
  Auth: { short: 'Au', color: C.green },
  Data: { short: 'DB', color: C.orange },
  Mobile: { short: 'Mb', color: C.blue },
  RAG: { short: 'AI', color: C.purple },
  WhatsApp: { short: 'WA', color: C.green },
  OCR: { short: 'OCR', color: C.orange, text: C.bg },
  Ops: { short: 'Ops', color: C.blue },
  Idea: { short: '01', color: C.blue },
  Design: { short: '02', color: C.purple },
  Build: { short: '03', color: C.green },
};

function techMeta(name, color = C.blue) {
  return TECH[name] ?? { short: String(name).replace(/[^A-Za-z0-9]/g, '').slice(0, 3) || '•', color };
}

function logoMark(x, y, name, { size = 32, color, opacity = 1 } = {}) {
  const meta = techMeta(name, color);
  const markColor = color ?? meta.color;
  const label = meta.short;
  const fontSize = label.length > 2 ? Math.round(size * 0.26) : Math.round(size * 0.34);
  return `<g opacity="${opacity}">
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${Math.round(size * 0.28)}" fill="${markColor}22" stroke="${markColor}" stroke-width="1.4"/>
    <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${Math.round(size * 0.28)}" fill="${markColor}" opacity="0.95"/>
    ${tf(x + size / 2, y + size * 0.58, label, { size: fontSize, fill: meta.text ?? C.text, family: 'mono', weight: 900, anchor: 'middle' })}
  </g>`;
}

function techLogoChip(x, y, name, color = C.blue, w = 122) {
  const meta = techMeta(name, color);
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${w}" height="32" rx="16" fill="${color}18" stroke="${color}" stroke-opacity="0.82"/>
    ${logoMark(8, 6, name, { size: 20, color: meta.color })}
    ${tf(36, 21, name, { size: 12, fill: C.text, family: 'mono', weight: 850 })}
  </g>`;
}

function techStackRow(x, y, name, { emphasis = false } = {}) {
  return `${logoMark(x, y - 24, name, { size: 30 })}${t(x + 42, y, name, { size: emphasis ? 26 : 24, cls: emphasis ? 'text' : 'soft', weight: emphasis ? 900 : 850 })}`;
}

function wrap(text, max = 68) {
  const words = text.split(' ');
  const rows = [];
  let row = '';
  for (const word of words) {
    const next = row ? `${row} ${word}` : word;
    if (next.length > max && row) {
      rows.push(row);
      row = word;
    } else {
      row = next;
    }
  }
  if (row) rows.push(row);
  return rows;
}

function paragraph(x, y, text, max, opts = {}) {
  return wrap(text, max).map((line, i) => t(x, y + i * (opts.leading ?? 30), line, opts)).join('\n');
}

function chip(x, y, text, color = C.blue, w) {
  const width = w ?? Math.max(68, text.length * 9 + 28);
  return `<rect x="${x}" y="${y}" width="${width}" height="30" rx="15" fill="${color}22" stroke="${color}" stroke-opacity="0.76"/>
${t(x + 14, y + 20, text, { size: 14, cls: 'text', weight: 800, family: 'mono' })}`;
}

function panel(x, y, w, h, rx = 14, cls = 'panel') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
}

function terminal(x, y, w, h, lines) {
  const body = lines.map((line, i) => t(x + 26, y + 70 + i * 28, line, { size: 16, cls: line.startsWith('$') ? 'green' : 'soft', family: 'mono', weight: 700 })).join('\n');
  return `${panel(x, y, w, h, 16, 'panel2')}
<rect x="${x}" y="${y}" width="${w}" height="40" rx="16" fill="${C.bg}" stroke="${C.border}"/>
<circle cx="${x + 24}" cy="${y + 20}" r="6" fill="${C.red}"/><circle cx="${x + 46}" cy="${y + 20}" r="6" fill="${C.orange}"/><circle cx="${x + 68}" cy="${y + 20}" r="6" fill="${C.green}"/>
${body}`;
}

const publicApps = [
  { name: 'SellBulk', logo: 'SB', color: C.blue },
  { name: 'WhatAutoSys', logo: 'WA', color: C.green },
  { name: 'GhostPoll', logo: 'GP', color: C.purple },
  { name: 'ClipIntelli', logo: 'CI', color: C.orange },
  { name: 'SpaceBio AI', logo: 'BIO', color: C.green },
];

function appLogoBadge(x, y, app) {
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="196" height="38" rx="12" fill="${C.bg}" stroke="${app.color}" stroke-opacity="0.72"/>
    <rect x="10" y="7" width="24" height="24" rx="7" fill="${app.color}22" stroke="${app.color}"/>
    ${t(22, 24, app.logo, { size: app.logo.length > 2 ? 9 : 11, cls: 'text', family: 'mono', weight: 900, anchor: 'middle' })}
    ${t(46, 25, app.name, { size: 14, cls: 'soft', family: 'mono', weight: 850 })}
  </g>`;
}

function projectLogoMark(x, y, p) {
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="88" height="88" rx="22" fill="${p.color}18" stroke="${p.color}" stroke-width="2.5"/>
    <circle cx="44" cy="44" r="25" fill="${C.bg}" stroke="${p.color}" stroke-width="2"/>
    <path d="M24 64h40" stroke="${p.color}" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
    ${t(44, 50, p.logo, { size: p.logo.length > 2 ? 16 : 22, cls: 'text', family: 'mono', weight: 900, anchor: 'middle' })}
  </g>`;
}

function header() {
  const body = `
<rect x="24" y="24" width="1152" height="332" rx="28" class="panel" filter="url(#shadow)"/>
<rect x="24" y="24" width="1152" height="58" rx="28" fill="${C.bg}"/>
<path d="M24 82H1176" stroke="${C.border}"/>
<circle cx="60" cy="53" r="8" fill="${C.red}"/><circle cx="88" cy="53" r="8" fill="${C.orange}"/><circle cx="116" cy="53" r="8" fill="${C.green}"/>
${t(150, 60, 'thelabofferdi / backend-lab', { size: 18, cls: 'muted', family: 'mono', weight: 800 })}
${chip(958, 40, 'available', C.green, 116)}${chip(1086, 40, 'remote', C.blue, 74)}
${t(58, 142, 'THELABOFERDI', { size: 22, cls: 'blue', family: 'mono', weight: 900 })}
${t(58, 210, 'Ferdi Backend Lab', { size: 64, cls: 'text', weight: 900 })}
${t(58, 252, 'APIs solides, auth propre, données fiables.', { size: 25, cls: 'soft', weight: 700 })}
${t(58, 284, 'Workers, temps réel et livraison Docker.', { size: 25, cls: 'soft', weight: 700 })}
${t(58, 320, 'La partie invisible qui rend les produits rapides, sûrs et maintenables.', { size: 19, cls: 'muted' })}
<rect x="58" y="340" width="275" height="5" rx="3" fill="${C.blue}"/><rect x="352" y="340" width="142" height="5" rx="3" fill="${C.green}"/>
<g transform="translate(742 120)">
  <path d="M170 0l180 88l-180 96L-10 88z" fill="#0b1d2e" stroke="${C.blue}" stroke-width="2" opacity="0.9"/>
  <rect x="92" y="62" width="150" height="120" rx="16" fill="#10233b" stroke="${C.blue}" stroke-width="3"/>
  <path d="M92 62l75-42l75 42l-75 42z" fill="#173a70" stroke="${C.blue}" stroke-width="3"/>
  <rect x="126" y="96" width="82" height="42" rx="21" fill="${C.bg}" stroke="${C.blue}" stroke-width="2"/>
  ${t(148, 123, 'API', { size: 20, cls: 'text', family: 'mono', weight: 900 })}
  <rect x="128" y="154" width="78" height="10" rx="5" fill="${C.blue}"/>
  <g transform="translate(-24 76)">${panel(0,0,62,94,10,'panel2')}<path d="M18 24h26M18 46h26M18 68h18" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/></g>
  <g transform="translate(312 76)">${panel(0,0,62,94,10,'panel2')}<path d="M18 24h26M18 46h26M18 68h18" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/></g>
</g>`;
  return svg({ width: 1200, height: 380, title: 'TheLaboFerdi Backend Lab', desc: 'Header GitHub du profil backend TheLaboFerdi.', body });
}

function whoami() {
  const rows = [
    ['role', 'Développeur backend orienté produit', 156],
    ['mission', 'Créer des APIs, gérer les données, sécuriser les accès et automatiser.', 216],
    ['terrain', 'Backends web, mobile, desktop local, realtime et workers.', 292],
    ['langages', 'Python, TypeScript, JavaScript, Rust, Go', 360],
    ['approche', 'Simple à comprendre, robuste à livrer, propre à maintenir.', 444],
  ];
  const languageMarks = ['Python', 'TypeScript', 'JavaScript', 'Rust', 'Go']
    .map((name, i) => logoMark(220 + i * 58, 378, name, { size: 34 }))
    .join('\n');
  const body = `
<rect x="24" y="24" width="1152" height="472" rx="26" class="panel" filter="url(#shadow)"/>
<rect x="48" y="48" width="1104" height="58" rx="14" fill="${C.bg}" stroke="${C.border}"/>
<circle cx="78" cy="77" r="7" fill="${C.red}"/><circle cx="102" cy="77" r="7" fill="${C.orange}"/><circle cx="126" cy="77" r="7" fill="${C.green}"/>
${t(166, 84, '/profil/whoami.yaml', { size: 18, cls: 'muted', family: 'mono', weight: 800 })}
${t(980, 84, 'LANG: FR', { size: 17, cls: 'green', family: 'mono', weight: 900 })}
${rows.map(([k,v,y], i) => `${t(74, y, `${k}:`, { size: 21, cls: 'blue', family: 'mono', weight: 900 })}${paragraph(220, y, v, 46, { size: i === 0 ? 30 : 22, cls: i === 0 ? 'text' : 'soft', weight: i === 0 ? 900 : 700, leading: 28 })}`).join('\n')}
${languageMarks}
<g transform="translate(856 166)">
  ${panel(0, 0, 238, 238, 20, 'panel2')}
  <rect x="28" y="34" width="142" height="40" rx="8" fill="${C.blue}22" stroke="${C.blue}"/>
  ${t(52, 60, 'ROUTES', { size: 16, cls: 'blue', family: 'mono', weight: 900 })}
  <rect x="28" y="98" width="178" height="40" rx="8" fill="${C.panel}" stroke="${C.border}"/>
  ${t(52, 124, 'SERVICES', { size: 16, cls: 'soft', family: 'mono', weight: 900 })}
  <rect x="28" y="162" width="116" height="40" rx="8" fill="${C.green}22" stroke="${C.green}"/>
  ${t(52, 188, 'DATA', { size: 16, cls: 'green', family: 'mono', weight: 900 })}
  <path d="M170 54h34v128h-60" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>
</g>
${chip(840, 458, 'private client code respected', C.purple, 286)}`;
  return svg({ width: 1200, height: 520, title: 'Whoami backend profile', desc: 'Carte identité backend pour Ferdi.', body });
}

function stackCarousel() {
  const items = [
    { title: 'Créer API', tech: ['FastAPI', 'NestJS', 'Express'], color: C.blue },
    { title: 'Stocker', tech: ['PostgreSQL', 'SQLite', 'Redis'], color: C.green },
    { title: 'Faire tourner', tech: ['Workers', 'WebSocket', 'MQTT'], color: C.purple },
    { title: 'Livrer', tech: ['Docker', 'CI/CD', 'Monitoring'], color: C.orange },
  ];
  const cards = items.map((it, i) => {
    const x = 54 + i * 280;
    return `<g transform="translate(${x} 154)">
      ${panel(0,0,246,270,18,'panel2')}
      <rect x="0" y="0" width="246" height="50" rx="18" fill="${it.color}22" stroke="${it.color}"/>
      ${t(22, 32, it.title.toUpperCase(), { size: 16, cls: 'text', family: 'mono', weight: 900 })}
      ${it.tech.map((name, j) => techStackRow(24, 100 + j * 48, name, { emphasis: j === 0 })).join('\n')}
      <rect x="24" y="224" width="150" height="8" rx="4" fill="${it.color}"/>
    </g>`;
  }).join('\n');
  const logos = publicApps.map((app, i) => appLogoBadge(58 + i * 216, 106, app)).join('\n');
  const body = `
<rect x="24" y="24" width="1152" height="512" rx="26" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'Stack Backend', { size: 42, cls: 'text', weight: 900 })}
${chip(930, 62, 'apps publiques', C.green, 182)}
${logos}
${cards}
<rect x="58" y="462" width="1084" height="42" rx="10" fill="${C.bg}" stroke="${C.border}"/>
${t(84, 489, 'idée -> API -> auth -> données -> workers -> mobile/web -> livraison', { size: 17, cls: 'blue', family: 'mono', weight: 800 })}`;
  return svg({ width: 1200, height: 560, title: 'Stack backend TheLaboFerdi', desc: 'Stack backend avec apps publiques, langages et outils.', body });
}

function projectCard(p) {
  const techs = p.tech.map((name, i) => techLogoChip(520 + i * 136, 300, name, p.color, 124)).join('\n');
  const body = `
<rect x="2" y="2" width="1176" height="426" rx="30" class="panel" stroke="${p.color}" stroke-width="3" filter="url(#shadow)"/>
<rect x="38" y="78" width="430" height="270" rx="22" class="panel2"/>
<rect x="38" y="78" width="430" height="42" rx="22" fill="${C.bg}"/>
<circle cx="66" cy="99" r="6" fill="${C.red}"/><circle cx="90" cy="99" r="6" fill="${C.orange}"/><circle cx="114" cy="99" r="6" fill="${C.green}"/>
${t(64, 154, p.terminalTitle, { size: 24, cls: 'text', family: 'mono', weight: 900 })}
${t(64, 192, p.terminalLine, { size: 18, cls: 'muted' })}
<rect x="64" y="218" width="338" height="48" rx="12" fill="${C.bg}" stroke="${C.border}"/>
${t(84, 249, p.command, { size: 16, cls: 'green', family: 'mono', weight: 800 })}
${paragraph(64, 304, p.flow, 37, { size: 16, cls: 'soft', family: 'mono', weight: 750, leading: 26 })}
${t(520, 42, p.kicker, { size: 17, cls: 'blue', family: 'mono', weight: 900 })}
${t(520, 82, p.name, { size: 42, cls: 'text', weight: 900 })}
${projectLogoMark(1036, 44, p)}
${paragraph(520, 160, p.desc, 58, { size: 21, cls: 'soft', weight: 650, leading: 31 })}
${t(520, 280, 'STACK TECHNIQUE', { size: 15, cls: 'muted', family: 'mono', weight: 900 })}
${techs}
<line x1="520" y1="378" x2="1124" y2="378" stroke="${C.border}" stroke-width="2"/>
${t(520, 406, p.links, { size: 20, cls: 'green', weight: 800 })}
${t(1124, 406, 'TheLaboFerdi', { size: 20, cls: 'muted', family: 'mono', weight: 900, anchor: 'end' })}`;
  return svg({ width: 1180, height: 430, title: p.name, desc: p.desc, body });
}

function confidential() {
  const cases = [
    ['Mobilité terrain', 'API + cartes + fichiers', C.blue, 'Mobile', ['API', 'Data', 'Mobile']],
    ['Assistant IA métier', 'RAG + cache + API', C.purple, 'RAG', ['RAG', 'API', 'Data']],
    ['Automatisation vente', 'WhatsApp + desktop', C.green, 'WhatsApp', ['WhatsApp', 'Workers', 'Data']],
    ['OCR & fichiers', 'mobile + backend', C.orange, 'OCR', ['OCR', 'API', 'Docker']],
    ['IoT énergie', 'MQTT + workers', C.green, 'MQTT', ['MQTT', 'Workers', 'Monitoring']],
    ['Outils internes', 'routes + services', C.blue, 'Ops', ['Auth', 'API', 'Docker']],
  ];
  const topMarks = ['API', 'Auth', 'Data', 'Workers', 'Docker']
    .map((name, i) => logoMark(800 + i * 50, 58, name, { size: 36 }))
    .join('\n');
  const cards = cases.map((c, i) => {
    const x = 54 + (i % 3) * 364;
    const y = 146 + Math.floor(i / 3) * 152;
    const miniMarks = c[4].map((name, j) => logoMark(20 + j * 40, 88, name, { size: 24, color: c[2] })).join('\n');
    return `<g transform="translate(${x} ${y})">
      ${panel(0,0,326,118,16,'panel2')}
      <rect x="0" y="0" width="326" height="38" rx="16" fill="${c[2]}22" stroke="${c[2]}"/>
      ${t(20, 25, c[0].toUpperCase(), { size: 15, cls: 'text', family: 'mono', weight: 900 })}
      ${logoMark(272, 56, c[3], { size: 34, color: c[2] })}
      ${t(20, 78, c[1], { size: 21, cls: 'soft', weight: 850 })}
      ${miniMarks}
    </g>`;
  }).join('\n');
  const body = `
<rect x="24" y="24" width="1152" height="492" rx="26" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'Projets Clients Confidentiels', { size: 40, cls: 'text', weight: 900 })}
${topMarks}
${cards}
<rect x="58" y="452" width="1084" height="38" rx="10" fill="${C.bg}" stroke="${C.border}"/>
${t(84, 477, 'api -> auth -> data -> workers -> docker -> monitoring', { size: 16, cls: 'green', family: 'mono', weight: 800 })}`;
  return svg({ width: 1200, height: 540, title: 'Projets clients confidentiels', desc: 'Cartes anonymisées de projets backend clients.', body });
}

function statsCards() {
  const stats = [
    ['Repos publics', '30+', 'GitHub', C.blue],
    ['Backends privés', 'client', 'API', C.purple],
    ['Stack principale', 'TS/Py', 'TypeScript', C.green],
    ['Livraison', 'Docker', 'Docker', C.orange],
  ];
  const body = `
<rect x="24" y="24" width="1152" height="312" rx="26" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'GitHub Stats', { size: 40, cls: 'text', weight: 900 })}
${t(58, 116, 'Lecture orientée backend: activité, langages, maintenance et livraison.', { size: 18, cls: 'muted' })}
${stats.map((s, i) => `<g transform="translate(${58 + i * 274} 164)">${panel(0,0,238,112,18,'panel2')}${logoMark(178,22,s[2],{size:38,color:s[3]})}${t(22,38,s[0],{size:16,cls:'muted',family:'mono',weight:800})}${t(22,82,s[1],{size:34,cls:'text',weight:900})}<rect x="22" y="92" width="120" height="7" rx="4" fill="${s[3]}"/></g>`).join('\n')}`;
  return svg({ width: 1200, height: 360, title: 'GitHub stats cards', desc: 'Cartes de statistiques GitHub stylisées.', body });
}

function insights() {
  const langs = [
    ['TypeScript', 42, C.blue, 'TypeScript'], ['Python', 25, C.green, 'Python'], ['JavaScript', 14, C.orange, 'JavaScript'], ['Rust/Go', 11, C.purple, 'Rust'], ['Other', 8, C.muted, 'GitHub'],
  ];
  const bars = langs.map((l, i) => {
    const y = 126 + i * 46;
    return `${logoMark(72, y - 28, l[3], { size: 30, color: l[2] })}${t(116, y, l[0], { size: 18, cls: 'soft', weight: 800 })}<rect x="286" y="${y - 15}" width="650" height="12" rx="6" fill="${C.border}"/><rect x="286" y="${y - 15}" width="${l[1] * 6.5}" height="12" rx="6" fill="${l[2]}"/>${t(970, y, `${l[1]}%`, { size: 18, cls: 'muted', family: 'mono', weight: 800 })}`;
  }).join('\n');
  const body = `
<rect x="24" y="24" width="1152" height="368" rx="26" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'GitHub Insights', { size: 40, cls: 'text', weight: 900 })}
${bars}
${chip(72, 322, 'APIs', C.blue, 74)}${chip(162, 322, 'workers', C.purple, 108)}${chip(286, 322, 'auth', C.green, 78)}${chip(380, 322, 'data', C.orange, 78)}${chip(474, 322, 'delivery', C.blue, 118)}`;
  return svg({ width: 1200, height: 420, title: 'GitHub insights', desc: 'Insights de langages et axes backend.', body });
}

function activity() {
  const points = 'M78 276 C136 218 160 236 208 178 S288 154 326 198 S390 254 438 180 S526 118 590 166 S682 226 732 148 S824 94 902 132 S1000 210 1102 88';
  const tools = ['GitHub', 'TypeScript', 'Python', 'Docker', 'API']
    .map((name, i) => logoMark(862 + i * 48, 64, name, { size: 34 }))
    .join('\n');
  const body = `
<rect x="24" y="24" width="1152" height="332" rx="26" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'Activité GitHub', { size: 40, cls: 'text', weight: 900 })}
${t(58, 116, 'Un rythme de build: commits, itérations, corrections, livraisons.', { size: 18, cls: 'muted' })}
${tools}
<rect x="58" y="148" width="1084" height="156" rx="18" fill="${C.bg}" stroke="${C.border}"/>
<path d="${points} V304 H78 Z" fill="${C.blue2}" opacity="0.18"/>
<path d="${points}" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round"/>
${t(78, 332, 'commit stream · backend work · private repos included', { size: 15, cls: 'green', family: 'mono', weight: 800 })}`;
  return svg({ width: 1200, height: 380, title: 'GitHub activity', desc: 'Courbe stylisée de l’activité GitHub.', body });
}

function journey() {
  const steps = [
    ['01', 'Comprendre', 'besoin métier, contraintes, données', 'Idea'],
    ['02', 'Concevoir', 'routes, DB, auth, erreurs', 'Design'],
    ['03', 'Construire', 'API, workers, realtime, mobile', 'Build'],
    ['04', 'Livrer', 'Docker, docs, logs, maintenance', 'Docker'],
  ];
  const body = `
<rect x="24" y="24" width="1152" height="322" rx="26" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'Parcours & Disponibilité', { size: 40, cls: 'text', weight: 900 })}
${t(58, 116, 'Disponible pour transformer une idée en backend fiable et maintenable.', { size: 18, cls: 'muted' })}
${steps.map((s, i) => `<g transform="translate(${58 + i * 274} 166)">${panel(0,0,236,120,18,'panel2')}${logoMark(176,22,s[3],{size:36})}${t(24,38,s[0],{size:18,cls:'blue',family:'mono',weight:900})}${t(24,72,s[1],{size:28,cls:'text',weight:900})}${paragraph(24,100,s[2],25,{size:14,cls:'muted',leading:20})}</g>`).join('\n')}`;
  return svg({ width: 1200, height: 370, title: 'Parcours et disponibilité', desc: 'Workflow de collaboration backend.', body });
}

function footer() {
  const body = `
<rect x="24" y="24" width="1152" height="140" rx="24" class="panel" filter="url(#shadow)"/>
${t(58, 82, 'Des backends fiables pour de vrais produits.', { size: 32, cls: 'text', weight: 900 })}
${t(58, 120, 'construire() · livrer() · maintenir() · mesurer()', { size: 18, cls: 'muted', family: 'mono', weight: 800 })}
<rect x="842" y="58" width="270" height="54" rx="10" fill="${C.blue}18" stroke="${C.blue}"/>
${t(884, 92, 'github.com/thelabofferdi', { size: 17, cls: 'blue', family: 'mono', weight: 900 })}`;
  return svg({ width: 1200, height: 190, title: 'Backend lab footer', desc: 'Footer du profil backend TheLaboFerdi.', body });
}

const projects = [
  {
    file: 'sellbulk.svg', name: 'SellBulk', kicker: 'PUBLIC · AUTOMATISATION COMMERCIALE',
    logo: 'SB',
    terminalTitle: 'sellbulk/api', terminalLine: 'moteurs, stats, messages', command: '$ docker compose up',
    flow: 'messages -> API -> workers -> métriques -> livraison',
    desc: 'Backend pour automatisation WhatsApp avec moteur robuste, suivi et livraison conteneurisée.',
    tech: ['Rust', 'Node', 'Docker', 'Metrics'], links: 'Code GitHub', color: C.blue,
  },
  {
    file: 'whatautosys.svg', name: 'WhatAutoSys v3', kicker: 'DESKTOP · REALTIME · LOCAL DATA',
    logo: 'WA',
    terminalTitle: 'whatautosys/local', terminalLine: 'WhatsApp, fichiers, IA', command: '$ npm run dev',
    flow: 'desktop -> Express -> Socket.IO -> SQLite -> IA locale',
    desc: 'Application locale qui connecte WhatsApp, fichiers et IA avec une API temps réel simple.',
    tech: ['Express', 'Socket.IO', 'SQLite', 'Electron'], links: 'v3 + v1', color: C.green,
  },
  {
    file: 'ghostpoll.svg', name: 'GhostPoll', kicker: 'PRIVACY · POLLS · LINKS',
    logo: 'GP',
    terminalTitle: 'ghostpoll/session', terminalLine: 'créer, voter, effacer', command: '$ pnpm dev',
    flow: 'poll -> NanoID -> QR -> vote -> expiration',
    desc: 'Sondages anonymes et éphémères avec liens courts, QR et cycle de vie minimaliste.',
    tech: ['Nuxt', 'TypeScript', 'NanoID', 'QR'], links: 'Live logic + Code', color: C.purple,
  },
  {
    file: 'clipintelli.svg', name: 'ClipIntelli', kicker: 'LOCAL · CLIPBOARD · AI',
    logo: 'CI',
    terminalTitle: 'clipintelli/db', terminalLine: 'capturer, classer, aider', command: '$ electron .',
    flow: 'clipboard -> sql.js -> index -> AI helper -> desktop',
    desc: 'Gestionnaire de presse-papiers intelligent avec données locales et assistance IA.',
    tech: ['Electron', 'JavaScript', 'sql.js', 'AI'], links: 'Code GitHub', color: C.orange,
  },
  {
    file: 'biology-space.svg', name: 'SpaceBio AI', kicker: 'RECHERCHE · NASA · AI',
    logo: 'BIO',
    terminalTitle: 'spacebio/index', terminalLine: 'articles, recherche, chat', command: '$ python manage.py runserver',
    flow: 'articles -> Django -> SQLite -> LLM -> exploration',
    desc: 'Plateforme de recherche pour explorer des articles de biologie spatiale avec assistance IA.',
    tech: ['Django', 'SQLite', 'OpenRouter', 'Groq'], links: 'Code GitHub', color: C.green,
  },
];

mkdirSync('assets/projects', { recursive: true });
mkdirSync('assets', { recursive: true });

writeFileSync('assets/header.svg', header());
writeFileSync('assets/whoami-card.svg', whoami());
writeFileSync('assets/stack-carousel.svg', stackCarousel());
writeFileSync('assets/stack.svg', stackCarousel());
writeFileSync('assets/confidential-work.svg', confidential());
writeFileSync('assets/github-stats-cards.svg', statsCards());
writeFileSync('assets/github-insights.svg', insights());
writeFileSync('assets/github-activity.svg', activity());
writeFileSync('assets/journey-cards.svg', journey());
writeFileSync('assets/footer.svg', footer());

for (const project of projects) {
  writeFileSync(`assets/projects/${project.file}`, projectCard(project));
}

console.log(`Generated ${10 + projects.length} profile assets.`);
