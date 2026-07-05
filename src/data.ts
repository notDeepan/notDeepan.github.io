// ── All portfolio content: resume data, projects, evidence boards ────────

export const PLAYER = {
  name: 'DEEPAN GOSWAMI',
  firstName: 'Deepan',
  title: 'Senior Analyst · MBA Candidate · Digital & Data Transformation',
  tagline:
    'Senior Analyst with 2 years 10 months at HCL Technologies and an MBA in progress at National Sun Yat-sen University — working across data analytics, digital transformation, and market strategy.',
  summary:
    'MBA candidate at National Sun Yat-sen University with 2 years 10 months of IT consulting at HCL Technologies and an accelerated promotion to Senior Analyst. I translate technical complexity into executive-level strategy across data analytics and digital transformation. Available July 2026 for roles across Taiwan and the Asia-Pacific region.',
  location: 'Kaohsiung, Taiwan',
  email: 'deepangoswami2@gmail.com',
  phone: '+886 911 987 716',
  linkedin: 'https://linkedin.com/in/deepan-goswami',
  github: 'https://github.com/notDeepan',
  availability: 'Available July 2026 · Taiwan & APAC',
}

export const HERO_STATS = [
  { value: '2y 10m', unit: '', label: 'IT Consulting at HCL' },
  { value: '3.98', unit: '/4.3', label: 'MBA GPA at NSYSU' },
  { value: '15', unit: '+', label: 'Product Engagements Led' },
  { value: '40', unit: '%', label: 'Code Quality Improvement' },
]

export const MARQUEE = [
  'Python & NLP',
  'SQL',
  'Power BI',
  'React / MERN',
  '.NET & C#',
  'Unity 3D',
  'Market Entry Strategy',
  'Financial Forecasting',
  'Sentiment Analysis',
  'Scrum & Agile',
  'Design Thinking',
  'UI/UX Design',
]

export const LANGUAGES = [
  { name: 'Hindi', level: 'Native', pct: 100 },
  { name: 'English', level: 'Professional · TOEFL iBT 98', pct: 92 },
  { name: 'Mandarin', level: 'Conversational', pct: 55 },
]

export interface Experience {
  badge: 'FULL-TIME' | 'RESEARCH' | 'CONSULTING'
  role: string
  org: string
  period: string
  bullets: string[]
}

export const EXPERIENCE: Experience[] = [
  {
    badge: 'FULL-TIME',
    role: 'Senior Analyst',
    org: 'HCL Technologies',
    period: 'Nov 2021 — Aug 2024 · 2 yrs 10 mos',
    bullets: [
      'Earned an accelerated promotion to Senior Analyst within the first year.',
      'Engineered an automated testing framework for 100+ enterprise server APIs, improving overall code quality by 40%.',
      'Led end-to-end delivery of 15+ digital product engagements, applying data-driven UX strategy to lift user engagement 20%.',
      'Managed cross-functional design, engineering and QA teams, sustaining 100% brand & compliance consistency for international enterprise clients.',
      'Translated C-suite digital transformation objectives into actionable technical roadmaps alongside client stakeholders.',
    ],
  },
  {
    badge: 'RESEARCH',
    role: 'Master’s Thesis — The Digital Border',
    org: 'National Sun Yat-sen University',
    period: 'Sep 2025 — Jun 2026',
    bullets: [
      'Built the first multi-regime dataset pairing 72 state censorship events across 16 countries with gamer sentiment — 22,596 Reddit comments mined with a Python NLP pipeline.',
      'Developed the Censorship Pressure Score (0–3), a new standardized instrument for comparing regulatory intensity across jurisdictions.',
      'Falsified the universalist Streisand Effect (rs = −.001) and proposed the Legitimacy-Response Model: communities respond to the justification, not the severity.',
      'Defended June 22, 2026 — advisors Dr. San-Yih Hwang & Dr. Kavin Asavanant.',
    ],
  },
  {
    badge: 'CONSULTING',
    role: 'AI Strategy Consulting — BXB Electronics',
    org: 'TIVI Consulting · NSYSU',
    period: '2026',
    bullets: [
      'Diagnosed an "activation gap, not a technology gap" at a 65-person Taiwanese pro-AV manufacturer — 3 of 4 needed tools were already owned but unused.',
      'Designed the AI Video Taskforce: one initiative that upgrades Digiwin HRM into a talent-intelligence platform, formalizes Gemini use, and produces localized marketing video with HeyGen.',
      'Business case: ~NTD 3,056,000+ conservative year-one saving against NTD 24,000 net-new cost — a ~20× ROI, with PDPA-compliant AI governance built in.',
    ],
  },
  {
    badge: 'CONSULTING',
    role: 'Generative AI Market Intelligence',
    org: 'MBI Analyst Project · NSYSU',
    period: 'Feb 2025 — Jun 2025',
    bullets: [
      'Ran large-scale sentiment analysis of 3+ years of Reddit discourse via topic modeling to map emerging AI-adoption trends.',
      'Strengthened strategic positioning in the GenAI sector, increasing competitive edge by 10% through actionable intelligence.',
    ],
  },
  {
    badge: 'CONSULTING',
    role: 'International Rebranding — Sunny Roll',
    org: 'MBA Consulting Project · NSYSU',
    period: 'Sep 2024 — Dec 2024',
    bullets: [
      'Rebranded a beloved Kaohsiung spring-roll stand end-to-end: named it "Sunny Roll 聖益卷", designed the logo and a full bilingual (EN/ZH) visual system — menus, posters, banners, packaging.',
      'Established its digital presence with a Google Business Profile and a QR review campaign.',
      'Increased international brand engagement by 30% leading a 4-member multicultural team.',
    ],
  },
]

// ── Projects — thesis first, then newest → oldest ────────────────────────

export type NodeKind = 'fact' | 'stat' | 'quote' | 'photo' | 'tags'

export interface BoardNode {
  kind: NodeKind
  label: string
  title?: string
  text?: string
  img?: string
  tags?: string[]
  x: number // % of board width
  y: number // % of board height
}

export interface CarouselProject {
  name: string
  desc: string
  tags: string[]
  live?: string
  repo?: string
  badge: 'LIVE' | 'CODE' | 'RESEARCH' | 'CONSULTING'
  category: string
  year: string
  color: string
  image?: string // poster screenshot (public/posters/*)
  note?: string
  board: BoardNode[]
}

export const CAROUSEL_PROJECTS: CarouselProject[] = [
  {
    name: 'The Digital Border — Thesis',
    desc: 'A multi-regime analysis of state-mandated censorship, gamer sentiment and corporate adaptation — 72 events, 16 countries, 22,596 voices, one model. Defended June 2026.',
    tags: ['Python NLP', 'Mixed Methods', 'Games Industry'],
    badge: 'RESEARCH',
    category: 'MASTER’S THESIS',
    year: '2025–26',
    color: '#e879f9',
    image: '/posters/thesis.jpg',
    note: 'Full thesis available on request',
    board: [
      {
        kind: 'fact',
        label: 'THE QUESTION',
        text: 'When a state censors a video game, how does the community actually respond? The first multi-regime dataset pairing censorship events with consumer sentiment.',
        x: 16, y: 17,
      },
      {
        kind: 'stat',
        label: 'THE DATASET',
        title: '72',
        text: 'censorship events · 16 countries · 62 titles · 22,596 Reddit comments.',
        x: 47, y: 11,
      },
      {
        kind: 'fact',
        label: 'THE INSTRUMENT',
        text: 'The Censorship Pressure Score (0–3) — a new standardized ordinal measure making regulatory intensity comparable across jurisdictions.',
        x: 79, y: 17,
      },
      {
        kind: 'stat',
        label: 'THE PUZZLE',
        title: 'rs = −.001',
        text: 'Severity does NOT move sentiment (p = .996). The Streisand Effect fails its first empirical test in gaming.',
        x: 12, y: 55,
      },
      {
        kind: 'fact',
        label: 'THE TWIST',
        text: 'Narrative games get banned MORE than violent Action games (63.6% vs 45.1%). Violence can be edited out — politics cannot. χ²(6) = 17.87, V = .352.',
        x: 88, y: 50,
      },
      {
        kind: 'fact',
        label: 'STRONGEST RESULT',
        text: 'Democracies censor violence (46.8% vs 4.0%); authoritarian states censor politics and religion. χ²(3) = 15.14, V = .459.',
        x: 36, y: 85,
      },
      {
        kind: 'quote',
        label: 'THE MODEL',
        text: '“The community responds to the justification, not the severity.” — The Legitimacy-Response Model, extending Suchman (1995).',
        x: 63, y: 86,
      },
      {
        kind: 'fact',
        label: 'METHOD',
        text: 'Python crawler over Reddit’s JSON API · ~650-term sentiment lexicon · SPSS v28 · Cohen’s κ = .78.',
        x: 88, y: 82,
      },
      {
        kind: 'tags',
        label: 'CASE FILES',
        tags: ['Devotion · CN', 'TLOU II · SA', 'Wolfenstein II · DE', 'PUBG Mobile · IN'],
        x: 13, y: 85,
      },
    ],
  },
  {
    name: 'Mandarin Reader',
    desc: 'A graded-reader web application for learning Mandarin Chinese — 30 original stories from A1 to B1+ with progressive vocabulary, built from first-hand language-learning experience in Taiwan.',
    tags: ['JavaScript', 'EdTech', 'i18n'],
    live: 'https://notdeepan.github.io/mandarin-reader/',
    repo: 'https://github.com/notDeepan/mandarin-reader',
    badge: 'LIVE',
    category: 'EDTECH · WEB APP',
    year: '2026',
    color: '#5b7cff',
    image: '/posters/mandarin.jpg',
    board: [
      {
        kind: 'fact',
        label: 'THE ITCH',
        text: 'Learning Mandarin in Taiwan, Deepan couldn’t find reading material that grows with the learner — so he built it.',
        x: 20, y: 16,
      },
      {
        kind: 'stat',
        label: 'THE LIBRARY',
        title: '30',
        text: 'original graded stories, sequenced from A1 to B1+.',
        x: 74, y: 15,
      },
      {
        kind: 'fact',
        label: 'HOW IT TEACHES',
        text: 'Progressive vocabulary and a difficulty curve tuned story by story — comprehension builds instead of breaking.',
        x: 16, y: 70,
      },
      { kind: 'tags', label: 'STACK', tags: ['JavaScript', 'i18n', 'GitHub Pages'], x: 47, y: 85 },
      {
        kind: 'stat',
        label: 'STATUS',
        title: 'LIVE',
        text: 'Deployed and public — start reading from this board.',
        x: 78, y: 76,
      },
    ],
  },
  {
    name: 'Kaohsiung Business Websites',
    desc: 'Bilingual (EN/ZH) production websites for Kaohsiung F&B and tourism businesses — a café, a B&B and a specialty food brand. Client-facing freelance work.',
    tags: ['Web Design', 'Bilingual', 'Client Work'],
    live: 'https://notdeepan.github.io/kaohsiung-demos/',
    repo: 'https://github.com/notDeepan/kaohsiung-demos',
    badge: 'LIVE',
    category: 'CLIENT WORK · BILINGUAL',
    year: '2026',
    color: '#2dd4bf',
    image: '/posters/kaohsiung.jpg',
    board: [
      {
        kind: 'fact',
        label: 'THE BUSINESS CASE',
        text: 'Kaohsiung F&B and tourism SMBs — a café, a B&B, a specialty food brand — needed bilingual web presence tourists could actually use.',
        x: 20, y: 16,
      },
      {
        kind: 'stat',
        label: 'LANGUAGE',
        title: 'EN/中文',
        text: 'Fully bilingual — every page in English and Traditional Chinese.',
        x: 74, y: 15,
      },
      {
        kind: 'fact',
        label: 'THE KIT',
        text: 'Three production demo sites: modern layouts, menu systems, booking touchpoints, and local-SEO fundamentals.',
        x: 16, y: 70,
      },
      { kind: 'tags', label: 'STACK', tags: ['HTML/CSS/JS', 'Responsive', 'GitHub Pages'], x: 47, y: 85 },
      {
        kind: 'stat',
        label: 'STATUS',
        title: 'LIVE',
        text: 'Deployed and public — open the live site from this board.',
        x: 78, y: 76,
      },
    ],
  },
  {
    name: 'BXB Electronics — AI Strategy',
    desc: 'AI-enabled internal labor markets for a 35-year-old Taiwanese pro-AV manufacturer: one Taskforce initiative, ~20× ROI, and PDPA-compliant governance.',
    tags: ['AI Strategy', 'HR Tech', 'Consulting'],
    badge: 'CONSULTING',
    category: 'MBA CONSULTING · AI STRATEGY',
    year: '2026',
    color: '#f59e0b',
    image: '/posters/bxb.jpg',
    note: 'Full deck available on request',
    board: [
      {
        kind: 'fact',
        label: 'THE CLIENT',
        text: 'BXB Electronics — a 35-year-old Taiwanese pro-AV manufacturer, 65 employees, exhibiting worldwide from ISE Barcelona to Computex.',
        x: 16, y: 17,
      },
      {
        kind: 'quote',
        label: 'THE DIAGNOSIS',
        text: '“BXB does not have a technology gap. It has an activation gap.” — 3 of the 4 tools it needed were already owned, just unused.',
        x: 48, y: 11,
      },
      {
        kind: 'fact',
        label: 'THE PLAY',
        text: 'The AI Video Taskforce: one cross-functional initiative that upgrades Digiwin HRM into a talent-intelligence platform, formalizes Gemini use, and produces localized marketing video with HeyGen.',
        x: 80, y: 18,
      },
      { kind: 'photo', label: 'BXB ON THE WORLD STAGE', img: '/boards/bxb/booth.jpg', x: 13, y: 55 },
      {
        kind: 'stat',
        label: 'THE BUSINESS CASE',
        title: '~20×',
        text: 'ROI — NTD 3,056,000+ conservative year-one saving vs NTD 24,000 net-new cost.',
        x: 87, y: 50,
      },
      {
        kind: 'stat',
        label: 'REACH',
        title: '130+',
        text: 'languages unlocked for distributor content — up from 8.',
        x: 38, y: 85,
      },
      {
        kind: 'fact',
        label: 'GOVERNANCE',
        text: 'AI Acceptable Use Policy, PDPA compliance, strict data boundaries. AI handles execution; humans govern strategy.',
        x: 64, y: 86,
      },
      { kind: 'photo', label: 'COMPANY ALL-HANDS', img: '/boards/bxb/event.jpg', x: 88, y: 82 },
      {
        kind: 'fact',
        label: 'THE TEAM',
        text: 'TIVI Consulting — a 5-member multicultural team, NSYSU GHRM & IBMBA.',
        x: 13, y: 86,
      },
    ],
  },
  {
    name: 'GenAI Market Intelligence',
    desc: 'Large-scale sentiment analysis of 3+ years of Reddit discourse via topic modeling — mapping AI-adoption trends into strategic positioning for the GenAI sector.',
    tags: ['GenAI', 'Sentiment Analysis', 'Strategy'],
    badge: 'RESEARCH',
    category: 'MARKET INTELLIGENCE',
    year: '2025',
    color: '#a3e635',
    note: 'Case study available on request',
    board: [
      {
        kind: 'fact',
        label: 'THE BRIEF',
        text: 'Map emerging AI-adoption trends from real community discourse and turn them into strategic positioning for the GenAI sector.',
        x: 21, y: 17,
      },
      {
        kind: 'stat',
        label: 'THE CORPUS',
        title: '3+ YRS',
        text: 'of Reddit discourse mined and structured via topic modeling.',
        x: 73, y: 15,
      },
      {
        kind: 'fact',
        label: 'METHOD',
        text: 'Large-scale sentiment pipeline over community discussions — topic extraction, trend mapping, and actionable synthesis.',
        x: 17, y: 72,
      },
      {
        kind: 'stat',
        label: 'OUTCOME',
        title: '+10%',
        text: 'competitive edge through actionable intelligence · MBI Analyst Project, NSYSU.',
        x: 72, y: 77,
      },
    ],
  },
  {
    name: 'International Rebranding — Sunny Roll',
    desc: 'End-to-end rebrand of a beloved Kaohsiung spring-roll stand: naming, logo, full bilingual visual system, and a new digital presence. +30% international brand engagement.',
    tags: ['Brand Strategy', 'Bilingual Design', 'Team Leadership'],
    badge: 'CONSULTING',
    category: 'MBA CONSULTING · REBRAND',
    year: '2024',
    color: '#34d399',
    image: '/posters/sunnyroll.jpg',
    note: 'Full brand book available on request',
    board: [
      {
        kind: 'fact',
        label: 'THE CLIENT',
        text: 'A beloved spring-roll stand near NSYSU, founded by a Vietnamese immigrant — winner of Kaohsiung’s city-wide spring roll contest in 2019. No English menu, no branding. The name “Sunny Roll” didn’t even exist.',
        x: 16, y: 18,
      },
      {
        kind: 'fact',
        label: 'THE PROBLEM',
        text: 'International students — a huge slice of the NSYSU community — were missing out on a local treasure purely for lack of English accessibility.',
        x: 48, y: 11,
      },
      {
        kind: 'fact',
        label: 'THE REBRAND',
        text: 'Named it Sunny Roll 聖益卷, designed a modern logo and a complete bilingual visual system — menus, posters, banners, and packaging.',
        x: 80, y: 17,
      },
      { kind: 'photo', label: 'THE BRAND BOOK', img: '/boards/sunnyroll/1.jpg', x: 12, y: 58 },
      {
        kind: 'fact',
        label: 'DIGITAL PRESENCE',
        text: 'Set up the Google Business Profile and a QR review campaign — the stand is now discoverable on Maps with reviews flowing in.',
        x: 87, y: 50,
      },
      { kind: 'photo', label: 'BILINGUAL MENU', img: '/boards/sunnyroll/4.jpg', x: 37, y: 84 },
      { kind: 'photo', label: 'REVIEW CAMPAIGN', img: '/boards/sunnyroll/3.jpg', x: 63, y: 85 },
      {
        kind: 'stat',
        label: 'IMPACT',
        title: '+30%',
        text: 'international brand engagement — leading a 4-member multicultural team.',
        x: 87, y: 82,
      },
    ],
  },
  {
    name: 'Admin Analytics Dashboard',
    desc: 'React + Vite administrative dashboard with charts, data tables and theming — the front-end counterpart to a data-driven analyst workflow.',
    tags: ['React', 'Data Visualization'],
    repo: 'https://github.com/notDeepan/AdminDashboard',
    badge: 'CODE',
    category: 'DATA VISUALIZATION',
    year: '2024',
    color: '#38bdf8',
    image: '/posters/dashboard.jpg',
    board: [
      {
        kind: 'fact',
        label: 'SCOPE',
        text: 'An admin console for operating on data: dashboards, drill-down tables, and configurable views in a fast Vite build.',
        x: 22, y: 18,
      },
      { kind: 'tags', label: 'FEATURES', tags: ['Charts', 'Data Tables', 'Theming', 'Responsive Layout'], x: 74, y: 17 },
      { kind: 'tags', label: 'STACK', tags: ['React', 'Vite', 'JavaScript'], x: 17, y: 73 },
      {
        kind: 'fact',
        label: 'THE ROLE IT PLAYS',
        text: 'The front-end face of the analyst mindset — the same data-to-decision thinking as the Power BI work, in code.',
        x: 71, y: 78,
      },
    ],
  },
  {
    name: 'Full-Stack E-Commerce',
    desc: 'Production-grade storefront on Payload CMS — authentication, shopping cart, checkout, paywall and an enterprise admin panel, implemented in TypeScript.',
    tags: ['TypeScript', 'Payload CMS', 'Full-Stack'],
    repo: 'https://github.com/notDeepan/e-commerce',
    badge: 'CODE',
    category: 'FULL-STACK · COMMERCE',
    year: '2023',
    color: '#8b5cf6',
    board: [
      {
        kind: 'fact',
        label: 'SCOPE',
        text: 'A complete commerce platform: storefront, enterprise-grade admin panel, and a production backend — not a toy cart demo.',
        x: 22, y: 17,
      },
      {
        kind: 'tags',
        label: 'FEATURES',
        tags: ['Authentication', 'Cart', 'Checkout', 'Paywall', 'Access Control', 'Layout Builder', 'SEO'],
        x: 75, y: 20,
      },
      { kind: 'tags', label: 'STACK', tags: ['TypeScript', 'Payload CMS', 'React'], x: 17, y: 74 },
      {
        kind: 'fact',
        label: 'WHY IT MATTERS',
        text: 'Sells physical products, digital assets, or gated content — the same architecture enterprises actually deploy.',
        x: 71, y: 79,
      },
    ],
  },
  {
    name: 'AI Dress App',
    desc: 'A generative-AI fashion experiment — a 3D shirt configurator exploring AI-powered outfit customization, shipped while the GenAI tooling was brand-new.',
    tags: ['React', 'Three.js', 'Generative AI'],
    repo: 'https://github.com/notDeepan/project_ai_dressapp',
    badge: 'CODE',
    category: 'GENERATIVE AI · 3D',
    year: '2023',
    color: '#fb7185',
    image: '/posters/dressapp.jpg',
    board: [
      {
        kind: 'fact',
        label: 'THE EXPERIMENT',
        text: 'A 3D shirt configurator with AI-generated textures and logos — customize a garment in real time in the browser, built during the first GenAI wave.',
        x: 22, y: 18,
      },
      {
        kind: 'stat',
        label: 'SHIPPED',
        title: '2023',
        text: 'Working MERN concept with a react-three-fiber 3D front end and an AI image backend.',
        x: 74, y: 16,
      },
      { kind: 'tags', label: 'STACK', tags: ['React', 'react-three-fiber', 'Node/Express', 'GenAI APIs'], x: 16, y: 72 },
      {
        kind: 'fact',
        label: 'THE LESSON',
        text: 'Prototype fast, ship anyway: the value was learning to build on top of moving-target AI APIs.',
        x: 72, y: 78,
      },
    ],
  },
]

export const SKILL_GROUPS = [
  {
    title: 'Technical',
    skills: [
      { name: 'Python (NLP & Web Crawling)', pct: 92 },
      { name: 'SQL', pct: 88 },
      { name: 'MERN / React JS', pct: 86 },
      { name: 'Power BI', pct: 85 },
      { name: 'UI/UX Design', pct: 84 },
      { name: '.NET & C#', pct: 80 },
      { name: 'Unity 3D (AR/VR)', pct: 78 },
    ],
  },
  {
    title: 'Strategy & Analysis',
    skills: [
      { name: 'Quantitative Sentiment Analysis', pct: 90 },
      { name: 'Market Entry Strategy', pct: 88 },
      { name: 'Financial Forecasting', pct: 82 },
      { name: 'Sustainable Marketing', pct: 80 },
    ],
  },
  {
    title: 'Frameworks & Process',
    skills: [
      { name: 'Scrum & Agile Product Management', pct: 90 },
      { name: 'Design Thinking', pct: 86 },
      { name: 'Business Case Development', pct: 85 },
    ],
  },
]

export const EDUCATION = [
  {
    school: 'National Sun Yat-sen University',
    degree: 'M.B.A., International Business Administration',
    place: 'Kaohsiung, Taiwan',
    period: '2024 — 2026',
    detail: 'GPA 3.98 / 4.3 · Taiwan MOE Scholarship Awardee',
  },
  {
    school: 'Kalinga Institute of Industrial Technology',
    degree: 'B.Tech., Computer Science',
    place: 'India',
    period: '2017 — 2021',
    detail: 'GPA 8.34 / 10 · Ranked #17 in India (NIRF 2025)',
  },
  {
    school: 'Nanhua University',
    degree: 'Student Exchange Program',
    place: 'Taiwan',
    period: '2019 — 2020',
    detail: 'International exchange year — the start of the APAC focus.',
  },
]

export const CERTS = [
  { name: 'Scrum Foundations Professional Certificate (SFPC)', org: 'Scrum Alliance' },
  { name: 'Python Data Analysis & Visualization', org: 'Professional Certification' },
]
