import { Lang } from './config'
import { EXPERIENCE, CAROUSEL_PROJECTS, EDUCATION, LANGUAGES, CERTS } from '../data'

// ── Localized content overrides (English is derived from data.ts) ────────
// Arrays are POSITIONAL — they must match the source arrays in data.ts.

export interface NodeT {
  l: string // node label
  t?: string // node body text (omit for tag/photo-only nodes where only the label shows)
}
export interface ProjT {
  category: string
  desc: string
  board: NodeT[]
}
export interface ExpT {
  role: string
  bullets: string[]
}
export interface EduT {
  degree: string
  detail: string
}
export interface ContentT {
  experience: ExpT[]
  projects: ProjT[]
  education: EduT[]
  languages: { name: string; level: string }[]
  certs: string[]
}

function buildEnglish(): ContentT {
  return {
    experience: EXPERIENCE.map((e) => ({ role: e.role, bullets: e.bullets })),
    projects: CAROUSEL_PROJECTS.map((p) => ({
      category: p.category,
      desc: p.desc,
      board: p.board.map((n) => ({ l: n.label, t: n.text })),
    })),
    education: EDUCATION.map((e) => ({ degree: e.degree, detail: e.detail })),
    languages: LANGUAGES.map((l) => ({ name: l.name, level: l.level })),
    certs: CERTS.map((c) => c.name),
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  繁體中文 (Traditional Chinese)
// ─────────────────────────────────────────────────────────────────────────
const zh: ContentT = {
  experience: [
    {
      role: '資深分析師',
      bullets: [
        '任職第一年即獲快速晉升為資深分析師。',
        '為 100 多個企業伺服器 API 打造自動化測試框架，整體程式碼品質提升 40%。',
        '主導 15 個以上數位產品專案的端到端交付，運用數據導向的 UX 策略將使用者參與度提升 20%。',
        '管理跨職能的設計、工程與 QA 團隊，為國際企業客戶維持 100% 的品牌與合規一致性。',
        '與客戶利害關係人合作，將高階主管的數位轉型目標轉化為可執行的技術路線圖。',
      ],
    },
    {
      role: '碩士論文 — The Digital Border',
      bullets: [
        '建立首個跨體制資料集，將 16 國、72 起國家審查事件與玩家情緒對應——以 Python NLP 流程擷取 22,596 則 Reddit 留言。',
        '開發「審查壓力分數（0–3）」，一套可跨司法管轄區比較監管強度的新標準化工具。',
        '推翻普世化的史翠珊效應（rs = −.001），並提出「正當性—回應模型」：社群回應的是理由，而非嚴厲程度。',
        '2026 年 6 月 22 日通過口試——指導教授 San-Yih Hwang 博士與 Kavin Asavanant 博士。',
      ],
    },
    {
      role: 'AI 策略顧問 — BXB 電子',
      bullets: [
        '為一家 65 人的台灣專業影音製造商診斷出「這不是技術落差，而是啟用落差」——所需 4 項工具中已擁有 3 項卻未善用。',
        '設計「AI 影片專案小組」：以單一計畫同時將 Digiwin HRM 升級為人才情報平台、正式化 Gemini 使用，並以 HeyGen 製作在地化行銷影片。',
        '商業效益：保守估計首年可節省 NTD 3,056,000 以上，而新增成本僅 NTD 24,000——約 20 倍投報，並內建符合個資法的 AI 治理。',
      ],
    },
    {
      role: '生成式 AI 市場情報',
      bullets: [
        '以主題模型對 3 年以上的 Reddit 討論進行大規模情緒分析，描繪新興的 AI 採用趨勢。',
        '透過可執行的情報，將生成式 AI 領域的策略定位競爭力提升 10%。',
      ],
    },
    {
      role: '國際品牌再造 — Sunny Roll',
      bullets: [
        '為高雄一家深受喜愛的春捲攤進行全面品牌再造：命名為「Sunny Roll 聖益卷」，設計標誌與完整的中英雙語視覺系統——菜單、海報、旗幟與包裝。',
        '以 Google 商家檔案與 QR 評論活動建立其數位形象。',
        '帶領 4 人跨文化團隊，將國際品牌參與度提升 30%。',
      ],
    },
  ],
  projects: [
    {
      category: '碩士論文',
      desc: '一項跨體制的國家審查、玩家情緒與企業因應分析——72 起事件、16 國、22,596 個聲音、一套模型。2026 年 6 月通過口試。',
      board: [
        { l: '研究問題', t: '當國家審查一款電玩時，社群究竟如何回應？首個將審查事件與消費者情緒對應的跨體制資料集。' },
        { l: '資料集', t: '72 起審查事件 · 16 國 · 62 款遊戲 · 22,596 則 Reddit 留言。' },
        { l: '測量工具', t: '審查壓力分數（0–3）——一套可跨司法管轄區比較監管強度的新標準化順序量表。' },
        { l: '謎題', t: '嚴厲程度「並不」左右情緒（p = .996）。史翠珊效應在電玩領域首度未通過實證檢驗。' },
        { l: '反轉', t: '敘事型遊戲被全面禁售的比例高於暴力動作型（63.6% 對 45.1%）。暴力可被修改，政治不能。χ²(6) = 17.87，V = .352。' },
        { l: '最強結果', t: '民主國家審查暴力（46.8% 對 4.0%）；威權國家審查政治與宗教。χ²(3) = 15.14，V = .459。' },
        { l: '核心模型', t: '「社群回應的是理由，而非嚴厲程度。」——正當性—回應模型，延伸自 Suchman（1995）。' },
        { l: '方法', t: '以 Python 爬蟲擷取 Reddit JSON API · 約 650 詞的情緒詞庫 · SPSS v28 · Cohen’s κ = .78。' },
        { l: '案例檔案' },
      ],
    },
    {
      category: '教育科技 · 網頁應用',
      desc: '為中文使用者打造的英語分級讀本網頁應用——5 本書、25 篇原創故事（A1 到 B1+），逐詞中文釋義，完整支援簡繁切換。',
      board: [
        { l: '鏡像之作', t: '為英語使用者打造 Mandarin Reader 之後，Deepan 反轉公式：同樣的分級故事學習法，重新打造給學英語的中文使用者。' },
        { l: '故事庫', t: '5 本完整書籍、25 篇原創章節——從走失的貓（A1）到守塔人的最後一班（B1+）。' },
        { l: '如何教學', t: '初級故事每個英文單字上方都有中文釋義，全文附完整句子翻譯與文法筆記——理解永不中斷。' },
        { l: '技術棧' },
        { l: '狀態', t: '已部署並公開——完全免費、無需註冊。可從此檔案開始閱讀。' },
      ],
    },
    {
      category: '教育科技 · 網頁應用',
      desc: '一款學習中文的分級讀本網頁應用——30 篇從 A1 到 B1+、詞彙循序漸進的原創故事，源自在台灣的第一手語言學習經驗。',
      board: [
        { l: '起心動念', t: '在台灣學中文時，Deepan 找不到能隨程度成長的閱讀素材——於是自己打造。' },
        { l: '故事庫', t: '30 篇原創分級故事，依 A1 到 B1+ 排序。' },
        { l: '如何教學', t: '逐篇調校的循序詞彙與難度曲線——理解力得以累積而非中斷。' },
        { l: '技術棧' },
        { l: '狀態', t: '已部署並公開——可從此檔案開始閱讀。' },
      ],
    },
    {
      category: '客戶專案 · 雙語',
      desc: '為高雄餐飲與旅遊業者打造的中英雙語正式網站——咖啡館、民宿與特色食品品牌。面向客戶的接案作品。',
      board: [
        { l: '商業情境', t: '高雄的餐飲與旅遊中小企業——一家咖啡館、一家民宿、一個特色食品品牌——需要遊客真正用得上的雙語網站。' },
        { l: '語言', t: '全雙語——每個頁面皆有英文與繁體中文。' },
        { l: '成果組合', t: '三個正式示範網站：現代版面、菜單系統、預訂入口與在地 SEO 基礎。' },
        { l: '技術棧' },
        { l: '狀態', t: '已部署並公開——可從此檔案開啟線上網站。' },
      ],
    },
    {
      category: 'MBA 顧問 · AI 策略',
      desc: '為一家 35 年歷史的台灣專業影音製造商打造 AI 賦能的內部人才市場：單一專案小組計畫、約 20 倍投報，並符合個資法治理。',
      board: [
        { l: '客戶', t: 'BXB 電子——一家 35 年歷史的台灣專業影音製造商，65 名員工，展會足跡從巴塞隆納 ISE 到台北 Computex。' },
        { l: '診斷', t: '「BXB 沒有技術落差，而是啟用落差。」——所需 4 項工具中有 3 項早已擁有，只是未被使用。' },
        { l: '策略', t: '「AI 影片專案小組」：以單一跨職能計畫將 Digiwin HRM 升級為人才情報平台、正式化 Gemini 使用，並以 HeyGen 製作在地化行銷影片。' },
        { l: 'BXB 站上國際舞台' },
        { l: '商業效益', t: '投報——保守估計首年節省 NTD 3,056,000 以上，對比新增成本 NTD 24,000。' },
        { l: '觸及', t: '經銷商內容可用語言從 8 種擴增至 130 種以上。' },
        { l: '治理', t: 'AI 可接受使用政策、符合個資法、嚴格的資料界線。AI 負責執行，人類主導策略。' },
        { l: '公司全員大會' },
        { l: '團隊', t: 'TIVI 顧問團——5 人跨文化團隊，中山大學 GHRM 與 IBMBA。' },
      ],
    },
    {
      category: '市場情報',
      desc: '以主題模型對 3 年以上的 Reddit 討論進行大規模情緒分析——將 AI 採用趨勢轉化為生成式 AI 領域的策略定位。',
      board: [
        { l: '任務', t: '從真實社群討論中描繪新興的 AI 採用趨勢，並轉化為生成式 AI 領域的策略定位。' },
        { l: '語料', t: '以主題模型擷取並結構化的 3 年以上 Reddit 討論。' },
        { l: '方法', t: '針對社群討論的大規模情緒分析流程——主題擷取、趨勢描繪與可執行的綜整。' },
        { l: '成果', t: '透過可執行情報，競爭力提升 10% · 中山大學 MBI 分析師專案。' },
      ],
    },
    {
      category: 'MBA 顧問 · 品牌再造',
      desc: '為高雄一家深受喜愛的春捲攤進行全面品牌再造：命名、標誌、完整雙語視覺系統與全新數位形象。國際品牌參與度提升 30%。',
      board: [
        { l: '客戶', t: '中山大學附近一家深受喜愛的春捲攤，由越南移民創立——2019 年高雄全市春捲大賽冠軍。沒有英文菜單、沒有品牌。連「Sunny Roll」這個名字都還不存在。' },
        { l: '問題', t: '國際學生——中山大學社群的一大群體——僅因缺乏英文可近性，就錯過了這個在地寶藏。' },
        { l: '品牌再造', t: '命名為 Sunny Roll 聖益卷，設計現代標誌與完整雙語視覺系統——菜單、海報、旗幟與包裝。' },
        { l: '品牌手冊' },
        { l: '數位形象', t: '建立 Google 商家檔案與 QR 評論活動——攤位如今可在地圖上被找到，評論也持續湧入。' },
        { l: '雙語菜單' },
        { l: '評論活動' },
        { l: '成效', t: '國際品牌參與度提升 30%——帶領 4 人跨文化團隊。' },
      ],
    },
    {
      category: '資料視覺化',
      desc: '以 React + Vite 打造、具圖表、資料表與主題切換的管理後台——數據導向分析工作流程的前端呈現。',
      board: [
        { l: '範疇', t: '一個操作資料的管理主控台：儀表板、可下鑽的表格與可設定的檢視，建構於快速的 Vite。' },
        { l: '功能' },
        { l: '技術棧' },
        { l: '扮演的角色', t: '分析師思維的前端面貌——與 Power BI 作品相同的「數據到決策」思考，以程式碼呈現。' },
      ],
    },
    {
      category: '全端 · 電商',
      desc: '建構於 Payload CMS 的正式級商店——身分驗證、購物車、結帳、付費牆與企業級管理後台，以 TypeScript 實作。',
      board: [
        { l: '範疇', t: '一套完整的電商平台：店面、企業級管理後台與正式後端——不是玩具般的購物車範例。' },
        { l: '功能' },
        { l: '技術棧' },
        { l: '意義所在', t: '販售實體商品、數位資產或付費內容——與企業實際部署相同的架構。' },
      ],
    },
    {
      category: '生成式 AI · 3D',
      desc: '一項生成式 AI 時尚實驗——探索 AI 服裝客製化的 3D 襯衫設定器，在生成式 AI 工具剛問世時即完成。',
      board: [
        { l: '實驗', t: '一款具 AI 生成材質與圖樣的 3D 襯衫設定器——在瀏覽器中即時客製服裝，於首波生成式 AI 浪潮中打造。' },
        { l: '上線', t: '可運作的 MERN 概念作品，前端採 react-three-fiber 3D，後端接 AI 影像。' },
        { l: '技術棧' },
        { l: '心得', t: '快速打造原型、照樣上線：價值在於學會在不斷變動的 AI API 之上開發。' },
      ],
    },
  ],
  education: [
    { degree: '國際企業管理碩士（MBA）', detail: '成績 3.98 / 4.3 · 台灣教育部獎學金得主' },
    { degree: '資訊工程學士（B.Tech.）', detail: '成績 8.34 / 10 · 全印度排名第 17（NIRF 2025）' },
    { degree: '交換學生計畫', detail: '國際交換的一年——亞太之路的起點。' },
  ],
  languages: [
    { name: '印地語', level: '母語' },
    { name: '英語', level: '專業 · TOEFL iBT 98' },
    { name: '中文', level: '會話' },
  ],
  certs: ['Scrum 基礎專業證書（SFPC）· Scrum Alliance', 'Python 資料分析與視覺化 · 專業證照'],
}

// ─────────────────────────────────────────────────────────────────────────
//  日本語 (Japanese)
// ─────────────────────────────────────────────────────────────────────────
const ja: ContentT = {
  experience: [
    {
      role: 'シニアアナリスト',
      bullets: [
        '入社1年目でシニアアナリストへスピード昇進。',
        '100以上のエンタープライズ向けサーバーAPIに自動テストフレームワークを構築し、全体のコード品質を40%改善。',
        '15件以上のデジタルプロダクト案件をエンドツーエンドで主導し、データ駆動のUX戦略でユーザーエンゲージメントを20%向上。',
        'デザイン・エンジニアリング・QAの横断チームを統括し、国際企業クライアント向けにブランドとコンプライアンスの一貫性を100%維持。',
        '経営層のデジタル変革目標を、クライアントの関係者とともに実行可能な技術ロードマップへと翻訳。',
      ],
    },
    {
      role: '修士論文 — The Digital Border',
      bullets: [
        '16か国・72件の国家検閲イベントとゲーマーの感情を対応づけた初の多体制データセットを構築——Python NLPパイプラインで22,596件のRedditコメントを収集。',
        '管轄区域を横断して規制の強度を比較できる新しい標準指標「検閲圧力スコア（0–3）」を開発。',
        '普遍的なストライサンド効果を否定（rs = −.001）し、「正当性—反応モデル」を提唱：コミュニティは厳しさではなく正当性に反応する。',
        '2026年6月22日に口頭試問を通過——指導教員 San-Yih Hwang 博士、Kavin Asavanant 博士。',
      ],
    },
    {
      role: 'AI戦略コンサルティング — BXBエレクトロニクス',
      bullets: [
        '従業員65名の台湾プロAVメーカーに対し「技術のギャップではなく、活用のギャップ」と診断——必要な4つのツールのうち3つは既に保有済みで未活用。',
        '「AI動画タスクフォース」を設計：単一の施策でDigiwin HRMを人材インテリジェンス基盤へ昇華し、Geminiの利用を正式化し、HeyGenでローカライズ動画を制作。',
        'ビジネスケース：初年度で保守的に見てもNTD 3,056,000以上の削減に対し、新規コストはわずかNTD 24,000——約20倍のROI。個人情報保護法に準拠したAIガバナンスも内蔵。',
      ],
    },
    {
      role: '生成AI市場インテリジェンス',
      bullets: [
        '3年以上分のReddit言説をトピックモデリングで大規模に感情分析し、台頭するAI導入トレンドを可視化。',
        '実用的なインテリジェンスにより、生成AI領域での戦略的ポジショニングの競争力を10%強化。',
      ],
    },
    {
      role: '国際リブランディング — Sunny Roll',
      bullets: [
        '高雄で愛される春巻き店をエンドツーエンドでリブランディング：「Sunny Roll 聖益卷」と命名し、ロゴと完全な日英二言語ビジュアルシステム（メニュー・ポスター・バナー・パッケージ）を設計。',
        'GoogleビジネスプロフィールとQRレビュー施策でデジタルプレゼンスを確立。',
        '4名の多文化チームを率い、国際的なブランドエンゲージメントを30%向上。',
      ],
    },
  ],
  projects: [
    {
      category: '修士論文',
      desc: '国家による検閲・ゲーマーの感情・企業の適応を横断分析——72件、16か国、22,596の声、一つのモデル。2026年6月に口頭試問通過。',
      board: [
        { l: '問い', t: '国家がゲームを検閲したとき、コミュニティは実際どう反応するのか？検閲イベントと消費者感情を対応づけた初の多体制データセット。' },
        { l: 'データセット', t: '検閲イベント72件 · 16か国 · 62タイトル · Redditコメント22,596件。' },
        { l: '指標', t: '検閲圧力スコア（0–3）——管轄区域を横断して規制強度を比較できる新しい標準順序尺度。' },
        { l: '謎', t: '厳しさは感情を「動かさない」（p = .996）。ゲーム領域でストライサンド効果が初めて実証検定に不合格。' },
        { l: '逆転', t: '物語性の強いゲームの方が暴力的なアクションより全面禁止が多い（63.6%対45.1%）。暴力は編集できるが、政治は編集できない。χ²(6) = 17.87、V = .352。' },
        { l: '最も強い結果', t: '民主国家は暴力を検閲（46.8%対4.0%）、権威主義国家は政治と宗教を検閲。χ²(3) = 15.14、V = .459。' },
        { l: 'モデル', t: '「コミュニティは厳しさではなく、正当性に反応する。」——正当性—反応モデル、Suchman（1995）を拡張。' },
        { l: '手法', t: 'Redditの JSON API を巡回するPythonクローラ · 約650語の感情辞書 · SPSS v28 · Cohen’s κ = .78。' },
        { l: 'ケースファイル' },
      ],
    },
    {
      category: 'EdTech · Webアプリ',
      desc: '中国語話者向けに作られた英語多読リーダーWebアプリ——5冊・25章の自作ストーリー（A1〜B1+）、単語ごとの中国語注釈、簡体字・繁体字の完全対応。',
      board: [
        { l: '鏡像の一作', t: '英語話者向けのMandarin Readerを作った後、公式を反転：同じ段階的ストーリー学習法を、英語を学ぶ中国語話者向けに再構築。' },
        { l: 'ライブラリ', t: '完結した5冊・25の自作チャプター——迷子の猫（A1）から灯台守の最後の当直（B1+）まで。' },
        { l: '教え方', t: '初級ストーリーでは各英単語の上に中国語注釈、全文に完全な文章訳と文法ノート——理解が途切れない。' },
        { l: '技術スタック' },
        { l: 'ステータス', t: '公開・デプロイ済み——無料・登録不要。このボードから読み始められます。' },
      ],
    },
    {
      category: 'EdTech · Webアプリ',
      desc: '中国語を学ぶための多読リーダーWebアプリ——A1からB1+まで語彙が段階的に増える30の自作ストーリー。台湾での実体験から生まれた。',
      board: [
        { l: 'きっかけ', t: '台湾で中国語を学ぶ中、学習者の成長に合わせて伸びる読み物が見つからず——自分で作った。' },
        { l: 'ライブラリ', t: 'A1からB1+まで並べた30の自作段階的ストーリー。' },
        { l: '教え方', t: 'ストーリーごとに調整した段階的な語彙と難易度カーブ——理解が途切れず積み上がる。' },
        { l: '技術スタック' },
        { l: 'ステータス', t: '公開・デプロイ済み——このボードから読み始められます。' },
      ],
    },
    {
      category: 'クライアント案件 · 二言語',
      desc: '高雄の飲食・観光事業者向けの日英（中英）二言語の本番Webサイト——カフェ、B&B、専門食品ブランド。クライアント向けの受託案件。',
      board: [
        { l: 'ビジネス背景', t: '高雄の飲食・観光の中小企業——カフェ、B&B、専門食品ブランド——が、旅行者が実際に使える二言語Webを必要としていた。' },
        { l: '言語', t: '完全二言語——全ページを英語と繁体字中国語で。' },
        { l: '成果物', t: '3つの本番デモサイト：モダンなレイアウト、メニュー機能、予約導線、ローカルSEOの基礎。' },
        { l: '技術スタック' },
        { l: 'ステータス', t: '公開・デプロイ済み——このボードからライブサイトを開けます。' },
      ],
    },
    {
      category: 'MBAコンサル · AI戦略',
      desc: '35年の歴史を持つ台湾プロAVメーカー向けのAI活用型内部人材市場：単一のタスクフォース施策、約20倍のROI、個人情報保護法準拠のガバナンス。',
      board: [
        { l: 'クライアント', t: 'BXBエレクトロニクス——創業35年の台湾プロAVメーカー、従業員65名。バルセロナのISEから台北のComputexまで世界で出展。' },
        { l: '診断', t: '「BXBに技術のギャップはない。あるのは活用のギャップだ。」——必要な4ツールのうち3つは既に保有、ただ使われていなかった。' },
        { l: '施策', t: '「AI動画タスクフォース」：単一の横断施策でDigiwin HRMを人材インテリジェンス基盤へ昇華し、Geminiの利用を正式化し、HeyGenでローカライズ動画を制作。' },
        { l: '世界の舞台に立つBXB' },
        { l: 'ビジネスケース', t: 'ROI——初年度で保守的にNTD 3,056,000以上の削減、対する新規コストはNTD 24,000。' },
        { l: 'リーチ', t: '販売代理店向けコンテンツの対応言語が8から130以上に拡大。' },
        { l: 'ガバナンス', t: 'AI利用規程、個人情報保護法準拠、厳格なデータ境界。AIが実行を担い、人間が戦略を統べる。' },
        { l: '全社ミーティング' },
        { l: 'チーム', t: 'TIVIコンサルティング——5名の多文化チーム、中山大学 GHRM・IBMBA。' },
      ],
    },
    {
      category: '市場インテリジェンス',
      desc: '3年以上分のReddit言説をトピックモデリングで大規模に感情分析——AI導入トレンドを生成AI領域の戦略的ポジショニングへ。',
      board: [
        { l: '課題', t: '実際のコミュニティ言説から台頭するAI導入トレンドを可視化し、生成AI領域の戦略的ポジショニングへ落とし込む。' },
        { l: 'コーパス', t: 'トピックモデリングで抽出・構造化した3年以上分のReddit言説。' },
        { l: '手法', t: 'コミュニティの議論を対象とした大規模感情分析パイプライン——トピック抽出、トレンド可視化、実用的な統合。' },
        { l: '成果', t: '実用的インテリジェンスにより競争力を10%向上 · 中山大学 MBI分析師プロジェクト。' },
      ],
    },
    {
      category: 'MBAコンサル · リブランディング',
      desc: '高雄で愛される春巻き店をエンドツーエンドでリブランディング：命名、ロゴ、完全な二言語ビジュアルシステム、新たなデジタルプレゼンス。国際的ブランドエンゲージメント30%向上。',
      board: [
        { l: 'クライアント', t: '中山大学近くで愛される春巻き店。ベトナム移民が創業し、2019年の高雄市春巻きコンテスト優勝。英語メニューもブランドもなく、「Sunny Roll」という名前すら存在しなかった。' },
        { l: '課題', t: '国際学生——中山大学コミュニティの大きな一部——が、英語で使えないというだけで、この地元の宝を逃していた。' },
        { l: 'リブランディング', t: 'Sunny Roll 聖益卷と命名し、モダンなロゴと完全な二言語ビジュアルシステム（メニュー・ポスター・バナー・パッケージ）を設計。' },
        { l: 'ブランドブック' },
        { l: 'デジタルプレゼンス', t: 'GoogleビジネスプロフィールとQRレビュー施策を構築——店舗は地図で見つかり、レビューも集まり始めた。' },
        { l: '二言語メニュー' },
        { l: 'レビュー施策' },
        { l: '成果', t: '国際的ブランドエンゲージメントを30%向上——4名の多文化チームを率いて。' },
      ],
    },
    {
      category: 'データ可視化',
      desc: 'グラフ・データテーブル・テーマ切替を備えたReact + Vite製の管理ダッシュボード——データ駆動アナリストのワークフローのフロントエンド。',
      board: [
        { l: '範囲', t: 'データを操作する管理コンソール：ダッシュボード、ドリルダウン表、設定可能なビューを、高速なViteで構築。' },
        { l: '機能' },
        { l: '技術スタック' },
        { l: '担う役割', t: 'アナリスト思考のフロントエンドとしての顔——Power BIの仕事と同じ「データから意思決定へ」の思考を、コードで。' },
      ],
    },
    {
      category: 'フルスタック · コマース',
      desc: 'Payload CMS上の本番品質ストアフロント——認証、カート、決済、ペイウォール、エンタープライズ管理画面をTypeScriptで実装。',
      board: [
        { l: '範囲', t: '完全なコマースプラットフォーム：ストアフロント、エンタープライズ級の管理画面、本番バックエンド——おもちゃのカートのデモではない。' },
        { l: '機能' },
        { l: '技術スタック' },
        { l: '意義', t: '物理商品・デジタル資産・ゲート付きコンテンツを販売——企業が実際に導入するのと同じアーキテクチャ。' },
      ],
    },
    {
      category: '生成AI · 3D',
      desc: '生成AIのファッション実験——AIによる衣装カスタマイズを探る3Dシャツコンフィギュレーター。生成AIツールが登場したばかりの時期に制作。',
      board: [
        { l: '実験', t: 'AI生成のテクスチャとロゴを備えた3Dシャツコンフィギュレーター——ブラウザ上でリアルタイムに衣装をカスタマイズ。最初の生成AIの波の中で制作。' },
        { l: 'リリース', t: '動作するMERNのコンセプト。フロントはreact-three-fiberの3D、バックはAI画像。' },
        { l: '技術スタック' },
        { l: '学び', t: '素早く試作し、ともかく出す：価値は、動く標的であるAI APIの上で開発する術を学んだこと。' },
      ],
    },
  ],
  education: [
    { degree: '経営学修士（MBA）· 国際ビジネス管理', detail: 'GPA 3.98 / 4.3 · 台湾教育部奨学金受給者' },
    { degree: '工学士（B.Tech.）· コンピュータサイエンス', detail: 'GPA 8.34 / 10 · 全インド17位（NIRF 2025）' },
    { degree: '交換留学プログラム', detail: '国際交換の1年——アジア太平洋への道の始まり。' },
  ],
  languages: [
    { name: 'ヒンディー語', level: '母語' },
    { name: '英語', level: 'ビジネス · TOEFL iBT 98' },
    { name: '中国語', level: '日常会話' },
  ],
  certs: ['Scrum 基礎プロフェッショナル認定（SFPC）· Scrum Alliance', 'Python データ分析と可視化 · プロフェッショナル認定'],
}

// ─────────────────────────────────────────────────────────────────────────
//  한국어 (Korean)
// ─────────────────────────────────────────────────────────────────────────
const ko: ContentT = {
  experience: [
    {
      role: '시니어 애널리스트',
      bullets: [
        '입사 첫해에 시니어 애널리스트로 조기 승진.',
        '100개 이상의 엔터프라이즈 서버 API에 자동화 테스트 프레임워크를 구축하여 전체 코드 품질을 40% 개선.',
        '15개 이상의 디지털 제품 프로젝트를 엔드투엔드로 주도하고, 데이터 기반 UX 전략으로 사용자 참여를 20% 향상.',
        '디자인·엔지니어링·QA 교차 팀을 관리하며 국제 기업 고객을 위해 브랜드 및 컴플라이언스 일관성을 100% 유지.',
        '경영진의 디지털 혁신 목표를 고객 이해관계자와 함께 실행 가능한 기술 로드맵으로 전환.',
      ],
    },
    {
      role: '석사 논문 — The Digital Border',
      bullets: [
        '16개국 72건의 국가 검열 사건과 게이머 감정을 연결한 최초의 다체제 데이터셋 구축——Python NLP 파이프라인으로 22,596개의 Reddit 댓글 수집.',
        '관할권 간 규제 강도를 비교할 수 있는 새로운 표준 지표 「검열 압력 점수(0–3)」 개발.',
        '보편적 스트라이샌드 효과를 반증(rs = −.001)하고 「정당성—반응 모델」 제시: 커뮤니티는 강도가 아니라 정당성에 반응한다.',
        '2026년 6월 22일 심사 통과——지도교수 San-Yih Hwang 박사, Kavin Asavanant 박사.',
      ],
    },
    {
      role: 'AI 전략 컨설팅 — BXB 일렉트로닉스',
      bullets: [
        '직원 65명의 대만 프로 AV 제조사에 「기술 격차가 아니라 활용 격차」라고 진단——필요한 4개 도구 중 3개는 이미 보유했으나 미사용.',
        '「AI 영상 태스크포스」 설계: 하나의 이니셔티브로 Digiwin HRM을 인재 인텔리전스 플랫폼으로 격상하고, Gemini 사용을 공식화하며, HeyGen으로 현지화 마케팅 영상 제작.',
        '비즈니스 케이스: 첫해 보수적으로 NTD 3,056,000 이상 절감 대비 신규 비용은 단 NTD 24,000——약 20배 ROI, 개인정보보호법을 준수하는 AI 거버넌스 내장.',
      ],
    },
    {
      role: '생성형 AI 시장 인텔리전스',
      bullets: [
        '3년 이상의 Reddit 담론을 토픽 모델링으로 대규모 감정 분석하여 부상하는 AI 도입 트렌드를 매핑.',
        '실행 가능한 인텔리전스로 생성형 AI 부문의 전략적 포지셔닝 경쟁력을 10% 강화.',
      ],
    },
    {
      role: '국제 리브랜딩 — Sunny Roll',
      bullets: [
        '가오슝의 사랑받는 춘권 가게를 엔드투엔드로 리브랜딩: 「Sunny Roll 聖益卷」으로 명명하고 로고와 완전한 이중 언어 비주얼 시스템(메뉴·포스터·배너·패키지)을 디자인.',
        'Google 비즈니스 프로필과 QR 리뷰 캠페인으로 디지털 존재감 구축.',
        '4명의 다문화 팀을 이끌어 국제 브랜드 참여를 30% 향상.',
      ],
    },
  ],
  projects: [
    {
      category: '석사 논문',
      desc: '국가 주도 검열, 게이머 감정, 기업 적응에 대한 다체제 분석——72건, 16개국, 22,596개의 목소리, 하나의 모델. 2026년 6월 심사 통과.',
      board: [
        { l: '질문', t: '국가가 게임을 검열할 때 커뮤니티는 실제로 어떻게 반응하는가? 검열 사건과 소비자 감정을 연결한 최초의 다체제 데이터셋.' },
        { l: '데이터셋', t: '검열 사건 72건 · 16개국 · 62개 타이틀 · Reddit 댓글 22,596개.' },
        { l: '측정 도구', t: '검열 압력 점수(0–3)——관할권 간 규제 강도를 비교할 수 있는 새로운 표준 서열 척도.' },
        { l: '수수께끼', t: '강도는 감정을 「움직이지 않는다」(p = .996). 게임 영역에서 스트라이샌드 효과가 처음으로 실증 검정에 실패.' },
        { l: '반전', t: '서사 중심 게임이 폭력적 액션보다 더 자주 전면 금지된다(63.6% 대 45.1%). 폭력은 편집할 수 있지만 정치는 편집할 수 없다. χ²(6) = 17.87, V = .352.' },
        { l: '가장 강한 결과', t: '민주주의 국가는 폭력을 검열(46.8% 대 4.0%), 권위주의 국가는 정치와 종교를 검열. χ²(3) = 15.14, V = .459.' },
        { l: '모델', t: '「커뮤니티는 강도가 아니라 정당성에 반응한다.」——정당성—반응 모델, Suchman(1995) 확장.' },
        { l: '방법', t: 'Reddit JSON API를 크롤링하는 Python 크롤러 · 약 650개 단어의 감정 사전 · SPSS v28 · Cohen’s κ = .78.' },
        { l: '케이스 파일' },
      ],
    },
    {
      category: '에듀테크 · 웹앱',
      desc: '중국어 화자를 위해 만든 영어 단계별 리더 웹앱——5권 25편의 창작 이야기(A1~B1+), 단어별 중국어 주석, 간체·번체 완전 지원.',
      board: [
        { l: '미러 프로젝트', t: '영어 화자를 위한 Mandarin Reader를 만든 뒤 공식을 뒤집었다: 같은 단계별 이야기 학습법을, 영어를 배우는 중국어 화자를 위해 재구축.' },
        { l: '라이브러리', t: '완결된 5권, 25편의 창작 챕터——길 잃은 고양이(A1)부터 등대지기의 마지막 당직(B1+)까지.' },
        { l: '교수 방식', t: '초급 이야기에서는 모든 영어 단어 위에 중국어 주석, 전체 문장 번역과 문법 노트——이해가 끊기지 않는다.' },
        { l: '기술 스택' },
        { l: '상태', t: '배포·공개 완료——무료, 가입 불필요. 이 보드에서 바로 읽기 시작할 수 있습니다.' },
      ],
    },
    {
      category: '에듀테크 · 웹앱',
      desc: '중국어 학습을 위한 단계별 리더 웹앱——A1에서 B1+까지 어휘가 점진적으로 늘어나는 30편의 창작 이야기. 대만에서의 직접 학습 경험에서 탄생.',
      board: [
        { l: '계기', t: '대만에서 중국어를 배우던 Deepan은 학습자의 수준에 맞춰 성장하는 읽을거리를 찾지 못해——직접 만들었다.' },
        { l: '라이브러리', t: 'A1에서 B1+까지 배열한 30편의 창작 단계별 이야기.' },
        { l: '교수 방식', t: '이야기마다 조정한 점진적 어휘와 난이도 곡선——이해가 끊기지 않고 쌓인다.' },
        { l: '기술 스택' },
        { l: '상태', t: '배포·공개 완료——이 보드에서 바로 읽기 시작할 수 있습니다.' },
      ],
    },
    {
      category: '고객 프로젝트 · 이중 언어',
      desc: '가오슝의 F&B 및 관광 사업자를 위한 이중 언어(영/중) 실서비스 웹사이트——카페, B&B, 특산 식품 브랜드. 고객 대상 프리랜스 작업.',
      board: [
        { l: '비즈니스 배경', t: '가오슝의 F&B·관광 중소기업——카페, B&B, 특산 식품 브랜드——은 여행객이 실제로 쓸 수 있는 이중 언어 웹이 필요했다.' },
        { l: '언어', t: '완전한 이중 언어——모든 페이지를 영어와 번체 중국어로.' },
        { l: '결과물', t: '3개의 실서비스 데모 사이트: 모던한 레이아웃, 메뉴 시스템, 예약 접점, 로컬 SEO 기초.' },
        { l: '기술 스택' },
        { l: '상태', t: '배포·공개 완료——이 보드에서 라이브 사이트를 열 수 있습니다.' },
      ],
    },
    {
      category: 'MBA 컨설팅 · AI 전략',
      desc: '35년 역사의 대만 프로 AV 제조사를 위한 AI 기반 내부 인재 시장: 단일 태스크포스 이니셔티브, 약 20배 ROI, 개인정보보호법 준수 거버넌스.',
      board: [
        { l: '고객', t: 'BXB 일렉트로닉스——35년 역사의 대만 프로 AV 제조사, 직원 65명. 바르셀로나 ISE부터 타이베이 Computex까지 전 세계 전시.' },
        { l: '진단', t: '「BXB에는 기술 격차가 없다. 활용 격차가 있을 뿐이다.」——필요한 4개 도구 중 3개는 이미 보유했으나 쓰이지 않았다.' },
        { l: '전략', t: '「AI 영상 태스크포스」: 하나의 교차 기능 이니셔티브로 Digiwin HRM을 인재 인텔리전스 플랫폼으로 격상하고, Gemini 사용을 공식화하며, HeyGen으로 현지화 마케팅 영상을 제작.' },
        { l: '세계 무대의 BXB' },
        { l: '비즈니스 케이스', t: 'ROI——첫해 보수적으로 NTD 3,056,000 이상 절감, 신규 비용 NTD 24,000 대비.' },
        { l: '도달 범위', t: '대리점 콘텐츠 지원 언어가 8개에서 130개 이상으로 확대.' },
        { l: '거버넌스', t: 'AI 사용 정책, 개인정보보호법 준수, 엄격한 데이터 경계. AI가 실행하고, 사람이 전략을 총괄.' },
        { l: '전사 회의' },
        { l: '팀', t: 'TIVI 컨설팅——5명의 다문화 팀, 중산대 GHRM 및 IBMBA.' },
      ],
    },
    {
      category: '시장 인텔리전스',
      desc: '3년 이상의 Reddit 담론을 토픽 모델링으로 대규모 감정 분석——AI 도입 트렌드를 생성형 AI 부문의 전략적 포지셔닝으로.',
      board: [
        { l: '과제', t: '실제 커뮤니티 담론에서 부상하는 AI 도입 트렌드를 매핑하고 생성형 AI 부문의 전략적 포지셔닝으로 전환.' },
        { l: '말뭉치', t: '토픽 모델링으로 추출·구조화한 3년 이상의 Reddit 담론.' },
        { l: '방법', t: '커뮤니티 논의를 대상으로 한 대규모 감정 분석 파이프라인——토픽 추출, 트렌드 매핑, 실행 가능한 종합.' },
        { l: '성과', t: '실행 가능한 인텔리전스로 경쟁력 10% 향상 · 중산대 MBI 애널리스트 프로젝트.' },
      ],
    },
    {
      category: 'MBA 컨설팅 · 리브랜딩',
      desc: '가오슝의 사랑받는 춘권 가게를 엔드투엔드로 리브랜딩: 명명, 로고, 완전한 이중 언어 비주얼 시스템, 새로운 디지털 존재감. 국제 브랜드 참여 30% 향상.',
      board: [
        { l: '고객', t: '중산대 인근의 사랑받는 춘권 가게. 베트남 이민자가 창업했고 2019년 가오슝시 춘권 대회 우승. 영어 메뉴도 브랜드도 없었고, 「Sunny Roll」이라는 이름조차 존재하지 않았다.' },
        { l: '문제', t: '국제 학생——중산대 커뮤니티의 큰 부분——이 영어 접근성이 없다는 이유만으로 이 지역의 보물을 놓치고 있었다.' },
        { l: '리브랜딩', t: 'Sunny Roll 聖益卷으로 명명하고 모던한 로고와 완전한 이중 언어 비주얼 시스템(메뉴·포스터·배너·패키지)을 디자인.' },
        { l: '브랜드 북' },
        { l: '디지털 존재감', t: 'Google 비즈니스 프로필과 QR 리뷰 캠페인 구축——이제 가게는 지도에서 검색되고 리뷰도 쌓이고 있다.' },
        { l: '이중 언어 메뉴' },
        { l: '리뷰 캠페인' },
        { l: '성과', t: '국제 브랜드 참여 30% 향상——4명의 다문화 팀을 이끌어.' },
      ],
    },
    {
      category: '데이터 시각화',
      desc: '차트·데이터 테이블·테마를 갖춘 React + Vite 관리자 대시보드——데이터 기반 애널리스트 워크플로의 프런트엔드.',
      board: [
        { l: '범위', t: '데이터를 다루는 관리자 콘솔: 대시보드, 드릴다운 테이블, 구성 가능한 뷰를 빠른 Vite로 구축.' },
        { l: '기능' },
        { l: '기술 스택' },
        { l: '역할', t: '애널리스트 사고의 프런트엔드 얼굴——Power BI 작업과 같은 「데이터에서 의사결정으로」의 사고를 코드로.' },
      ],
    },
    {
      category: '풀스택 · 커머스',
      desc: 'Payload CMS 기반의 프로덕션급 스토어프런트——인증, 장바구니, 결제, 페이월, 엔터프라이즈 관리자 패널을 TypeScript로 구현.',
      board: [
        { l: '범위', t: '완전한 커머스 플랫폼: 스토어프런트, 엔터프라이즈급 관리자 패널, 프로덕션 백엔드——장난감 같은 장바구니 데모가 아니다.' },
        { l: '기능' },
        { l: '기술 스택' },
        { l: '의미', t: '실물 상품, 디지털 자산, 유료 콘텐츠를 판매——기업이 실제로 배포하는 것과 같은 아키텍처.' },
      ],
    },
    {
      category: '생성형 AI · 3D',
      desc: '생성형 AI 패션 실험——AI 기반 의상 커스터마이징을 탐구하는 3D 셔츠 구성기. 생성형 AI 도구가 막 등장하던 시기에 제작.',
      board: [
        { l: '실험', t: 'AI가 생성한 텍스처와 로고를 갖춘 3D 셔츠 구성기——브라우저에서 실시간으로 의상을 커스터마이즈. 첫 생성형 AI 물결 속에서 제작.' },
        { l: '출시', t: '동작하는 MERN 콘셉트. 프런트는 react-three-fiber 3D, 백엔드는 AI 이미지.' },
        { l: '기술 스택' },
        { l: '배운 점', t: '빠르게 프로토타입하고 일단 출시: 가치는 계속 바뀌는 AI API 위에서 개발하는 법을 배운 것.' },
      ],
    },
  ],
  education: [
    { degree: '경영학 석사(MBA) · 국제경영', detail: '학점 3.98 / 4.3 · 대만 교육부 장학생' },
    { degree: '공학 학사(B.Tech.) · 컴퓨터공학', detail: '학점 8.34 / 10 · 인도 전국 17위(NIRF 2025)' },
    { degree: '교환학생 프로그램', detail: '국제 교환의 한 해——아시아·태평양 여정의 시작.' },
  ],
  languages: [
    { name: '힌디어', level: '모국어' },
    { name: '영어', level: '비즈니스 · TOEFL iBT 98' },
    { name: '중국어', level: '회화' },
  ],
  certs: ['Scrum 기초 전문가 자격증(SFPC) · Scrum Alliance', 'Python 데이터 분석 및 시각화 · 전문 자격증'],
}

// ─────────────────────────────────────────────────────────────────────────
//  Tiếng Việt (Vietnamese)
// ─────────────────────────────────────────────────────────────────────────
const vi: ContentT = {
  experience: [
    {
      role: 'Chuyên viên Phân tích Cấp cao',
      bullets: [
        'Được thăng chức sớm lên Chuyên viên Phân tích Cấp cao ngay trong năm đầu tiên.',
        'Xây dựng khung kiểm thử tự động cho hơn 100 API máy chủ doanh nghiệp, cải thiện chất lượng mã tổng thể 40%.',
        'Dẫn dắt triển khai trọn gói hơn 15 dự án sản phẩm số, áp dụng chiến lược UX dựa trên dữ liệu để tăng mức độ tương tác của người dùng 20%.',
        'Quản lý các nhóm liên chức năng gồm thiết kế, kỹ thuật và QA, duy trì 100% tính nhất quán về thương hiệu và tuân thủ cho khách hàng doanh nghiệp quốc tế.',
        'Chuyển hóa mục tiêu chuyển đổi số của ban lãnh đạo thành lộ trình kỹ thuật khả thi cùng các bên liên quan.',
      ],
    },
    {
      role: 'Luận văn Thạc sĩ — The Digital Border',
      bullets: [
        'Xây dựng bộ dữ liệu đa thể chế đầu tiên ghép 72 sự kiện kiểm duyệt của nhà nước tại 16 quốc gia với cảm xúc của game thủ——thu thập 22.596 bình luận Reddit bằng quy trình Python NLP.',
        'Phát triển Điểm Áp lực Kiểm duyệt (0–3), một công cụ chuẩn hóa mới để so sánh cường độ quản lý giữa các khu vực pháp lý.',
        'Bác bỏ hiệu ứng Streisand mang tính phổ quát (rs = −.001) và đề xuất Mô hình Chính danh—Phản ứng: cộng đồng phản ứng với lý do biện minh, không phải mức độ nghiêm khắc.',
        'Bảo vệ ngày 22/6/2026——hướng dẫn bởi TS. San-Yih Hwang và TS. Kavin Asavanant.',
      ],
    },
    {
      role: 'Tư vấn Chiến lược AI — BXB Electronics',
      bullets: [
        'Chẩn đoán "không phải khoảng cách công nghệ, mà là khoảng cách kích hoạt" tại một nhà sản xuất AV chuyên nghiệp 65 nhân sự ở Đài Loan——3 trong 4 công cụ cần thiết đã có sẵn nhưng chưa dùng.',
        'Thiết kế Đội đặc nhiệm Video AI: một sáng kiến duy nhất nâng cấp Digiwin HRM thành nền tảng thông minh nhân tài, chính thức hóa việc dùng Gemini, và sản xuất video marketing bản địa hóa bằng HeyGen.',
        'Bài toán kinh doanh: tiết kiệm thận trọng hơn NTD 3.056.000 trong năm đầu so với chi phí mới chỉ NTD 24.000——ROI khoảng 20 lần, kèm quản trị AI tuân thủ luật bảo vệ dữ liệu cá nhân.',
      ],
    },
    {
      role: 'Thông tin Thị trường AI Tạo sinh',
      bullets: [
        'Phân tích cảm xúc quy mô lớn hơn 3 năm thảo luận trên Reddit bằng mô hình chủ đề để lập bản đồ xu hướng ứng dụng AI mới nổi.',
        'Củng cố định vị chiến lược trong lĩnh vực AI tạo sinh, tăng lợi thế cạnh tranh 10% nhờ thông tin khả dụng.',
      ],
    },
    {
      role: 'Tái định vị Thương hiệu Quốc tế — Sunny Roll',
      bullets: [
        'Tái định vị trọn gói một quán gỏi cuốn được yêu thích ở Cao Hùng: đặt tên "Sunny Roll 聖益卷", thiết kế logo và hệ thống nhận diện song ngữ hoàn chỉnh (Anh/Trung)——thực đơn, poster, băng-rôn, bao bì.',
        'Thiết lập hiện diện số bằng Hồ sơ Doanh nghiệp Google và chiến dịch đánh giá qua mã QR.',
        'Tăng mức độ tương tác thương hiệu quốc tế 30% khi dẫn dắt nhóm 4 thành viên đa văn hóa.',
      ],
    },
  ],
  projects: [
    {
      category: 'LUẬN VĂN THẠC SĨ',
      desc: 'Phân tích đa thể chế về kiểm duyệt của nhà nước, cảm xúc game thủ và sự thích ứng của doanh nghiệp——72 sự kiện, 16 quốc gia, 22.596 tiếng nói, một mô hình. Bảo vệ tháng 6/2026.',
      board: [
        { l: 'CÂU HỎI', t: 'Khi nhà nước kiểm duyệt một trò chơi, cộng đồng thực sự phản ứng ra sao? Bộ dữ liệu đa thể chế đầu tiên ghép sự kiện kiểm duyệt với cảm xúc người tiêu dùng.' },
        { l: 'BỘ DỮ LIỆU', t: '72 sự kiện kiểm duyệt · 16 quốc gia · 62 tựa game · 22.596 bình luận Reddit.' },
        { l: 'CÔNG CỤ ĐO', t: 'Điểm Áp lực Kiểm duyệt (0–3)——thang đo thứ bậc chuẩn hóa mới giúp so sánh cường độ quản lý giữa các khu vực pháp lý.' },
        { l: 'BÍ ẨN', t: 'Mức độ nghiêm khắc KHÔNG làm dịch chuyển cảm xúc (p = .996). Hiệu ứng Streisand lần đầu không vượt qua kiểm định thực nghiệm trong lĩnh vực game.' },
        { l: 'BƯỚC NGOẶT', t: 'Game tường thuật bị cấm hoàn toàn NHIỀU hơn game hành động bạo lực (63,6% so với 45,1%). Bạo lực có thể chỉnh sửa, chính trị thì không. χ²(6) = 17,87, V = .352.' },
        { l: 'KẾT QUẢ MẠNH NHẤT', t: 'Nước dân chủ kiểm duyệt bạo lực (46,8% so với 4,0%); nước độc tài kiểm duyệt chính trị và tôn giáo. χ²(3) = 15,14, V = .459.' },
        { l: 'MÔ HÌNH', t: '"Cộng đồng phản ứng với lý do biện minh, không phải mức độ nghiêm khắc."——Mô hình Chính danh—Phản ứng, mở rộng từ Suchman (1995).' },
        { l: 'PHƯƠNG PHÁP', t: 'Trình thu thập Python trên JSON API của Reddit · từ điển cảm xúc ~650 từ · SPSS v28 · Cohen’s κ = .78.' },
        { l: 'HỒ SƠ VỤ VIỆC' },
      ],
    },
    {
      category: 'EDTECH · ỨNG DỤNG WEB',
      desc: 'Ứng dụng web đọc phân cấp để học tiếng Anh, dành cho người nói tiếng Trung——25 câu chuyện gốc trong 5 cuốn sách (A1 đến B1+), chú thích tiếng Trung theo từng từ, hỗ trợ đầy đủ giản thể/phồn thể.',
      board: [
        { l: 'DỰ ÁN PHẢN CHIẾU', t: 'Sau khi làm Mandarin Reader cho người nói tiếng Anh, Deepan đảo ngược công thức: cùng phương pháp truyện phân cấp, xây lại cho người nói tiếng Trung học tiếng Anh.' },
        { l: 'THƯ VIỆN', t: '5 cuốn sách hoàn chỉnh, 25 chương gốc——từ chú mèo đi lạc (A1) đến ca trực cuối của người gác hải đăng (B1+).' },
        { l: 'CÁCH DẠY', t: 'Chú thích tiếng Trung trên từng từ tiếng Anh ở truyện sơ cấp, bản dịch trọn câu và ghi chú ngữ pháp——khả năng hiểu không bao giờ đứt gãy.' },
        { l: 'CÔNG NGHỆ' },
        { l: 'TRẠNG THÁI', t: 'Đã triển khai và công khai——miễn phí, không cần đăng ký. Bắt đầu đọc ngay từ bảng này.' },
      ],
    },
    {
      category: 'EDTECH · ỨNG DỤNG WEB',
      desc: 'Ứng dụng web đọc phân cấp để học tiếng Trung——30 câu chuyện gốc từ A1 đến B1+ với từ vựng tăng dần, xây từ trải nghiệm học ngôn ngữ thực tế ở Đài Loan.',
      board: [
        { l: 'ĐỘNG LỰC', t: 'Khi học tiếng Trung ở Đài Loan, Deepan không tìm được tài liệu đọc lớn dần theo người học——nên tự làm.' },
        { l: 'THƯ VIỆN', t: '30 câu chuyện phân cấp gốc, sắp xếp từ A1 đến B1+.' },
        { l: 'CÁCH DẠY', t: 'Từ vựng tăng dần và đường cong độ khó tinh chỉnh theo từng truyện——khả năng hiểu tích lũy thay vì đứt gãy.' },
        { l: 'CÔNG NGHỆ' },
        { l: 'TRẠNG THÁI', t: 'Đã triển khai và công khai——có thể bắt đầu đọc ngay từ bảng này.' },
      ],
    },
    {
      category: 'DỰ ÁN KHÁCH HÀNG · SONG NGỮ',
      desc: 'Các website vận hành thực song ngữ (Anh/Trung) cho doanh nghiệp F&B và du lịch ở Cao Hùng——một quán cà phê, một B&B và một thương hiệu thực phẩm đặc sản. Công việc freelance cho khách.',
      board: [
        { l: 'BỐI CẢNH', t: 'Các SME F&B và du lịch ở Cao Hùng——một quán cà phê, một B&B, một thương hiệu thực phẩm đặc sản——cần hiện diện web song ngữ mà du khách thực sự dùng được.' },
        { l: 'NGÔN NGỮ', t: 'Song ngữ hoàn toàn——mọi trang đều có tiếng Anh và tiếng Trung phồn thể.' },
        { l: 'SẢN PHẨM', t: 'Ba website demo vận hành: bố cục hiện đại, hệ thống thực đơn, điểm chạm đặt chỗ và nền tảng SEO địa phương.' },
        { l: 'CÔNG NGHỆ' },
        { l: 'TRẠNG THÁI', t: 'Đã triển khai và công khai——mở website trực tuyến ngay từ bảng này.' },
      ],
    },
    {
      category: 'TƯ VẤN MBA · CHIẾN LƯỢC AI',
      desc: 'Thị trường nhân tài nội bộ hỗ trợ bởi AI cho nhà sản xuất AV chuyên nghiệp Đài Loan 35 năm tuổi: một sáng kiến đội đặc nhiệm, ROI ~20 lần, và quản trị tuân thủ luật bảo vệ dữ liệu cá nhân.',
      board: [
        { l: 'KHÁCH HÀNG', t: 'BXB Electronics——nhà sản xuất AV chuyên nghiệp Đài Loan 35 năm tuổi, 65 nhân sự, triển lãm khắp thế giới từ ISE Barcelona đến Computex.' },
        { l: 'CHẨN ĐOÁN', t: '"BXB không thiếu công nghệ. Họ thiếu sự kích hoạt."——3 trong 4 công cụ cần thiết đã có sẵn, chỉ là không được dùng.' },
        { l: 'GIẢI PHÁP', t: 'Đội đặc nhiệm Video AI: một sáng kiến liên chức năng duy nhất nâng cấp Digiwin HRM thành nền tảng thông minh nhân tài, chính thức hóa việc dùng Gemini, và sản xuất video marketing bản địa hóa bằng HeyGen.' },
        { l: 'BXB TRÊN SÂN KHẤU QUỐC TẾ' },
        { l: 'BÀI TOÁN KINH DOANH', t: 'ROI——tiết kiệm thận trọng hơn NTD 3.056.000 năm đầu so với chi phí mới NTD 24.000.' },
        { l: 'ĐỘ PHỦ', t: 'Số ngôn ngữ cho nội dung nhà phân phối mở rộng từ 8 lên hơn 130.' },
        { l: 'QUẢN TRỊ', t: 'Chính sách sử dụng AI hợp lệ, tuân thủ luật bảo vệ dữ liệu cá nhân, ranh giới dữ liệu nghiêm ngặt. AI lo thực thi; con người điều hành chiến lược.' },
        { l: 'HỌP TOÀN CÔNG TY' },
        { l: 'ĐỘI NGŨ', t: 'TIVI Consulting——nhóm 5 thành viên đa văn hóa, NSYSU GHRM & IBMBA.' },
      ],
    },
    {
      category: 'THÔNG TIN THỊ TRƯỜNG',
      desc: 'Phân tích cảm xúc quy mô lớn hơn 3 năm thảo luận Reddit bằng mô hình chủ đề——biến xu hướng ứng dụng AI thành định vị chiến lược cho lĩnh vực AI tạo sinh.',
      board: [
        { l: 'ĐỀ BÀI', t: 'Lập bản đồ xu hướng ứng dụng AI mới nổi từ thảo luận cộng đồng thực và chuyển thành định vị chiến lược cho lĩnh vực AI tạo sinh.' },
        { l: 'KHO NGỮ LIỆU', t: 'Hơn 3 năm thảo luận Reddit được khai thác và cấu trúc hóa qua mô hình chủ đề.' },
        { l: 'PHƯƠNG PHÁP', t: 'Quy trình phân tích cảm xúc quy mô lớn trên các thảo luận cộng đồng——trích xuất chủ đề, lập bản đồ xu hướng và tổng hợp khả dụng.' },
        { l: 'KẾT QUẢ', t: 'Tăng lợi thế cạnh tranh 10% nhờ thông tin khả dụng · Dự án MBI Analyst, NSYSU.' },
      ],
    },
    {
      category: 'TƯ VẤN MBA · TÁI ĐỊNH VỊ',
      desc: 'Tái định vị trọn gói một quán gỏi cuốn được yêu thích ở Cao Hùng: đặt tên, logo, hệ thống nhận diện song ngữ hoàn chỉnh và hiện diện số mới. Tăng tương tác thương hiệu quốc tế 30%.',
      board: [
        { l: 'KHÁCH HÀNG', t: 'Một quán gỏi cuốn được yêu thích gần NSYSU, do một người nhập cư Việt Nam sáng lập——vô địch cuộc thi gỏi cuốn toàn thành phố Cao Hùng năm 2019. Không thực đơn tiếng Anh, không thương hiệu. Cái tên "Sunny Roll" thậm chí còn chưa tồn tại.' },
        { l: 'VẤN ĐỀ', t: 'Sinh viên quốc tế——một phần lớn cộng đồng NSYSU——bỏ lỡ báu vật địa phương này chỉ vì thiếu khả năng tiếp cận tiếng Anh.' },
        { l: 'TÁI ĐỊNH VỊ', t: 'Đặt tên Sunny Roll 聖益卷, thiết kế logo hiện đại và hệ thống nhận diện song ngữ hoàn chỉnh——thực đơn, poster, băng-rôn và bao bì.' },
        { l: 'CẨM NANG THƯƠNG HIỆU' },
        { l: 'HIỆN DIỆN SỐ', t: 'Thiết lập Hồ sơ Doanh nghiệp Google và chiến dịch đánh giá qua QR——quán nay đã hiện trên bản đồ và đánh giá liên tục đổ về.' },
        { l: 'THỰC ĐƠN SONG NGỮ' },
        { l: 'CHIẾN DỊCH ĐÁNH GIÁ' },
        { l: 'TÁC ĐỘNG', t: 'Tăng tương tác thương hiệu quốc tế 30%——dẫn dắt nhóm 4 thành viên đa văn hóa.' },
      ],
    },
    {
      category: 'TRỰC QUAN HÓA DỮ LIỆU',
      desc: 'Bảng điều khiển quản trị React + Vite với biểu đồ, bảng dữ liệu và giao diện chủ đề——bộ mặt front-end của quy trình phân tích dựa trên dữ liệu.',
      board: [
        { l: 'PHẠM VI', t: 'Một bảng điều khiển quản trị để thao tác trên dữ liệu: dashboard, bảng chi tiết và các khung nhìn tùy chỉnh, dựng trên Vite nhanh gọn.' },
        { l: 'TÍNH NĂNG' },
        { l: 'CÔNG NGHỆ' },
        { l: 'VAI TRÒ', t: 'Bộ mặt front-end của tư duy phân tích——cùng lối tư duy "dữ liệu đến quyết định" như công việc Power BI, bằng mã.' },
      ],
    },
    {
      category: 'FULL-STACK · THƯƠNG MẠI',
      desc: 'Cửa hàng cấp sản xuất trên Payload CMS——xác thực, giỏ hàng, thanh toán, tường phí và bảng quản trị doanh nghiệp, viết bằng TypeScript.',
      board: [
        { l: 'PHẠM VI', t: 'Một nền tảng thương mại hoàn chỉnh: mặt tiền cửa hàng, bảng quản trị cấp doanh nghiệp và backend sản xuất——không phải bản demo giỏ hàng đồ chơi.' },
        { l: 'TÍNH NĂNG' },
        { l: 'CÔNG NGHỆ' },
        { l: 'Ý NGHĨA', t: 'Bán sản phẩm vật lý, tài sản số hoặc nội dung có phí——cùng kiến trúc mà doanh nghiệp thực sự triển khai.' },
      ],
    },
    {
      category: 'AI TẠO SINH · 3D',
      desc: 'Một thử nghiệm thời trang AI tạo sinh——bộ tùy chỉnh áo 3D khám phá việc cá nhân hóa trang phục bằng AI, làm khi công cụ AI tạo sinh vừa mới xuất hiện.',
      board: [
        { l: 'THỬ NGHIỆM', t: 'Bộ tùy chỉnh áo 3D với họa tiết và logo do AI tạo——tùy chỉnh trang phục theo thời gian thực trên trình duyệt, làm trong làn sóng AI tạo sinh đầu tiên.' },
        { l: 'RA MẮT', t: 'Bản concept MERN hoạt động, front-end 3D react-three-fiber và backend ảnh AI.' },
        { l: 'CÔNG NGHỆ' },
        { l: 'BÀI HỌC', t: 'Làm nguyên mẫu nhanh, cứ ra mắt: giá trị nằm ở việc học cách phát triển trên các API AI luôn thay đổi.' },
      ],
    },
  ],
  education: [
    { degree: 'Thạc sĩ Quản trị Kinh doanh (MBA) · Kinh doanh Quốc tế', detail: 'Điểm 3,98 / 4,3 · Học bổng Bộ Giáo dục Đài Loan' },
    { degree: 'Cử nhân Kỹ thuật (B.Tech.) · Khoa học Máy tính', detail: 'Điểm 8,34 / 10 · Hạng 17 toàn Ấn Độ (NIRF 2025)' },
    { degree: 'Chương trình Trao đổi Sinh viên', detail: 'Một năm trao đổi quốc tế——khởi đầu cho hành trình châu Á - Thái Bình Dương.' },
  ],
  languages: [
    { name: 'Tiếng Hindi', level: 'Bản ngữ' },
    { name: 'Tiếng Anh', level: 'Chuyên nghiệp · TOEFL iBT 98' },
    { name: 'Tiếng Trung', level: 'Giao tiếp' },
  ],
  certs: [
    'Chứng chỉ Chuyên môn Nền tảng Scrum (SFPC) · Scrum Alliance',
    'Phân tích & Trực quan hóa Dữ liệu bằng Python · Chứng chỉ chuyên môn',
  ],
}

// ─────────────────────────────────────────────────────────────────────────
//  Bahasa Indonesia (Indonesian)
// ─────────────────────────────────────────────────────────────────────────
const id: ContentT = {
  experience: [
    {
      role: 'Analis Senior',
      bullets: [
        'Meraih promosi dipercepat menjadi Analis Senior pada tahun pertama.',
        'Membangun kerangka pengujian otomatis untuk 100+ API server enterprise, meningkatkan kualitas kode secara keseluruhan sebesar 40%.',
        'Memimpin pengiriman menyeluruh 15+ proyek produk digital, menerapkan strategi UX berbasis data untuk menaikkan keterlibatan pengguna 20%.',
        'Mengelola tim lintas fungsi desain, teknik, dan QA, menjaga 100% konsistensi merek dan kepatuhan bagi klien enterprise internasional.',
        'Menerjemahkan tujuan transformasi digital jajaran eksekutif menjadi peta jalan teknis yang dapat dijalankan bersama pemangku kepentingan klien.',
      ],
    },
    {
      role: 'Tesis Magister — The Digital Border',
      bullets: [
        'Membangun dataset multi-rezim pertama yang memasangkan 72 peristiwa sensor negara di 16 negara dengan sentimen gamer——22.596 komentar Reddit ditambang dengan pipeline Python NLP.',
        'Mengembangkan Skor Tekanan Sensor (0–3), instrumen standar baru untuk membandingkan intensitas regulasi antaryurisdiksi.',
        'Membantah Efek Streisand universal (rs = −.001) dan mengusulkan Model Legitimasi-Respons: komunitas merespons alasannya, bukan tingkat keparahannya.',
        'Dipertahankan 22 Juni 2026——pembimbing Dr. San-Yih Hwang & Dr. Kavin Asavanant.',
      ],
    },
    {
      role: 'Konsultasi Strategi AI — BXB Electronics',
      bullets: [
        'Mendiagnosis "bukan kesenjangan teknologi, melainkan kesenjangan aktivasi" pada produsen pro-AV Taiwan berkaryawan 65 orang——3 dari 4 alat yang dibutuhkan sudah dimiliki namun belum dipakai.',
        'Merancang Satuan Tugas Video AI: satu inisiatif yang meningkatkan Digiwin HRM menjadi platform intelijen talenta, memformalkan penggunaan Gemini, dan memproduksi video pemasaran terlokalisasi dengan HeyGen.',
        'Kasus bisnis: penghematan konservatif NTD 3.056.000+ pada tahun pertama dibanding biaya baru hanya NTD 24.000——ROI ~20×, dengan tata kelola AI yang patuh UU Perlindungan Data Pribadi.',
      ],
    },
    {
      role: 'Intelijen Pasar AI Generatif',
      bullets: [
        'Melakukan analisis sentimen skala besar atas 3+ tahun wacana Reddit lewat pemodelan topik untuk memetakan tren adopsi AI yang sedang berkembang.',
        'Memperkuat posisi strategis di sektor AI generatif, menaikkan keunggulan kompetitif 10% lewat intelijen yang dapat ditindaklanjuti.',
      ],
    },
    {
      role: 'Rebranding Internasional — Sunny Roll',
      bullets: [
        'Melakukan rebranding menyeluruh sebuah kedai lumpia yang dicintai di Kaohsiung: menamainya "Sunny Roll 聖益卷", merancang logo dan sistem visual dwibahasa lengkap (Ing/Mandarin)——menu, poster, spanduk, kemasan.',
        'Membangun kehadiran digital dengan Profil Bisnis Google dan kampanye ulasan lewat QR.',
        'Menaikkan keterlibatan merek internasional 30% sambil memimpin tim lintas budaya beranggotakan 4 orang.',
      ],
    },
  ],
  projects: [
    {
      category: 'TESIS MAGISTER',
      desc: 'Analisis multi-rezim atas sensor negara, sentimen gamer, dan adaptasi korporat——72 peristiwa, 16 negara, 22.596 suara, satu model. Dipertahankan Juni 2026.',
      board: [
        { l: 'PERTANYAAN', t: 'Ketika negara menyensor sebuah gim, bagaimana komunitas sebenarnya merespons? Dataset multi-rezim pertama yang memasangkan peristiwa sensor dengan sentimen konsumen.' },
        { l: 'DATASET', t: '72 peristiwa sensor · 16 negara · 62 judul · 22.596 komentar Reddit.' },
        { l: 'INSTRUMEN', t: 'Skor Tekanan Sensor (0–3)——ukuran ordinal standar baru yang membuat intensitas regulasi dapat dibandingkan antaryurisdiksi.' },
        { l: 'TEKA-TEKI', t: 'Tingkat keparahan TIDAK menggerakkan sentimen (p = .996). Efek Streisand gagal dalam uji empiris pertamanya di ranah gim.' },
        { l: 'KEJUTAN', t: 'Gim naratif lebih sering dilarang total daripada gim aksi penuh kekerasan (63,6% vs 45,1%). Kekerasan bisa disunting, politik tidak. χ²(6) = 17,87, V = .352.' },
        { l: 'HASIL TERKUAT', t: 'Negara demokrasi menyensor kekerasan (46,8% vs 4,0%); negara otoriter menyensor politik dan agama. χ²(3) = 15,14, V = .459.' },
        { l: 'MODEL', t: '"Komunitas merespons alasannya, bukan tingkat keparahannya."——Model Legitimasi-Respons, mengembangkan Suchman (1995).' },
        { l: 'METODE', t: 'Crawler Python atas JSON API Reddit · leksikon sentimen ~650 kata · SPSS v28 · Cohen’s κ = .78.' },
        { l: 'BERKAS KASUS' },
      ],
    },
    {
      category: 'EDTECH · APLIKASI WEB',
      desc: 'Aplikasi web bacaan berjenjang untuk belajar bahasa Inggris, dibuat untuk penutur bahasa Mandarin——25 cerita orisinal dalam 5 buku (A1 hingga B1+), glosarium Mandarin per kata, dukungan penuh aksara Sederhana/Tradisional.',
      board: [
        { l: 'PROYEK CERMIN', t: 'Setelah membuat Mandarin Reader untuk penutur Inggris, Deepan membalik rumusnya: metode cerita berjenjang yang sama, dibangun ulang untuk penutur Mandarin yang belajar bahasa Inggris.' },
        { l: 'PUSTAKA', t: '5 buku lengkap, 25 bab orisinal——dari kucing yang tersesat (A1) hingga jaga malam terakhir penjaga mercusuar (B1+).' },
        { l: 'CARA MENGAJAR', t: 'Glosarium Mandarin di atas setiap kata Inggris pada cerita pemula, terjemahan kalimat penuh, dan catatan tata bahasa——pemahaman tak pernah putus.' },
        { l: 'TEKNOLOGI' },
        { l: 'STATUS', t: 'Sudah dirilis dan publik——gratis, tanpa daftar. Mulai membaca langsung dari papan ini.' },
      ],
    },
    {
      category: 'EDTECH · APLIKASI WEB',
      desc: 'Aplikasi web bacaan berjenjang untuk belajar bahasa Mandarin——30 cerita orisinal dari A1 hingga B1+ dengan kosakata bertahap, lahir dari pengalaman belajar bahasa langsung di Taiwan.',
      board: [
        { l: 'PEMICU', t: 'Saat belajar Mandarin di Taiwan, Deepan tak menemukan bacaan yang tumbuh bersama pembelajar——jadi ia membuatnya sendiri.' },
        { l: 'PUSTAKA', t: '30 cerita berjenjang orisinal, diurutkan dari A1 hingga B1+.' },
        { l: 'CARA MENGAJAR', t: 'Kosakata bertahap dan kurva kesulitan yang disetel per cerita——pemahaman terbangun, bukan patah.' },
        { l: 'TEKNOLOGI' },
        { l: 'STATUS', t: 'Sudah dirilis dan publik——mulai membaca langsung dari papan ini.' },
      ],
    },
    {
      category: 'KERJA KLIEN · DWIBAHASA',
      desc: 'Situs web produksi dwibahasa (Ing/Mandarin) untuk bisnis F&B dan pariwisata di Kaohsiung——sebuah kafe, sebuah B&B, dan merek makanan khas. Pekerjaan lepas menghadap klien.',
      board: [
        { l: 'KONTEKS BISNIS', t: 'UKM F&B dan pariwisata Kaohsiung——kafe, B&B, merek makanan khas——butuh kehadiran web dwibahasa yang benar-benar bisa dipakai wisatawan.' },
        { l: 'BAHASA', t: 'Sepenuhnya dwibahasa——setiap halaman dalam bahasa Inggris dan Mandarin tradisional.' },
        { l: 'HASIL', t: 'Tiga situs demo produksi: tata letak modern, sistem menu, titik sentuh pemesanan, dan dasar SEO lokal.' },
        { l: 'TEKNOLOGI' },
        { l: 'STATUS', t: 'Sudah dirilis dan publik——buka situs langsung dari papan ini.' },
      ],
    },
    {
      category: 'KONSULTASI MBA · STRATEGI AI',
      desc: 'Pasar talenta internal berbasis AI untuk produsen pro-AV Taiwan berusia 35 tahun: satu inisiatif satuan tugas, ROI ~20×, dan tata kelola patuh UU Perlindungan Data Pribadi.',
      board: [
        { l: 'KLIEN', t: 'BXB Electronics——produsen pro-AV Taiwan berusia 35 tahun, 65 karyawan, berpameran di seluruh dunia dari ISE Barcelona hingga Computex.' },
        { l: 'DIAGNOSIS', t: '"BXB tidak punya kesenjangan teknologi. Yang ada kesenjangan aktivasi."——3 dari 4 alat yang dibutuhkan sudah dimiliki, hanya tak dipakai.' },
        { l: 'STRATEGI', t: 'Satuan Tugas Video AI: satu inisiatif lintas fungsi yang meningkatkan Digiwin HRM menjadi platform intelijen talenta, memformalkan penggunaan Gemini, dan memproduksi video pemasaran terlokalisasi dengan HeyGen.' },
        { l: 'BXB DI PANGGUNG DUNIA' },
        { l: 'KASUS BISNIS', t: 'ROI——penghematan konservatif NTD 3.056.000+ tahun pertama vs biaya baru NTD 24.000.' },
        { l: 'JANGKAUAN', t: 'Bahasa untuk konten distributor bertambah dari 8 menjadi 130+.' },
        { l: 'TATA KELOLA', t: 'Kebijakan Penggunaan AI yang Sah, kepatuhan UU PDP, batas data ketat. AI menangani eksekusi; manusia mengatur strategi.' },
        { l: 'RAPAT SELURUH PERUSAHAAN' },
        { l: 'TIM', t: 'TIVI Consulting——tim lintas budaya beranggotakan 5 orang, NSYSU GHRM & IBMBA.' },
      ],
    },
    {
      category: 'INTELIJEN PASAR',
      desc: 'Analisis sentimen skala besar atas 3+ tahun wacana Reddit lewat pemodelan topik——mengubah tren adopsi AI menjadi posisi strategis untuk sektor AI generatif.',
      board: [
        { l: 'MANDAT', t: 'Memetakan tren adopsi AI yang sedang berkembang dari wacana komunitas nyata dan mengubahnya menjadi posisi strategis untuk sektor AI generatif.' },
        { l: 'KORPUS', t: '3+ tahun wacana Reddit ditambang dan distrukturkan lewat pemodelan topik.' },
        { l: 'METODE', t: 'Pipeline analisis sentimen skala besar atas diskusi komunitas——ekstraksi topik, pemetaan tren, dan sintesis yang dapat ditindaklanjuti.' },
        { l: 'HASIL', t: 'Keunggulan kompetitif naik 10% lewat intelijen yang dapat ditindaklanjuti · Proyek MBI Analyst, NSYSU.' },
      ],
    },
    {
      category: 'KONSULTASI MBA · REBRANDING',
      desc: 'Rebranding menyeluruh sebuah kedai lumpia yang dicintai di Kaohsiung: penamaan, logo, sistem visual dwibahasa lengkap, dan kehadiran digital baru. Keterlibatan merek internasional naik 30%.',
      board: [
        { l: 'KLIEN', t: 'Kedai lumpia yang dicintai dekat NSYSU, didirikan oleh seorang imigran Vietnam——juara lomba lumpia sekota Kaohsiung 2019. Tanpa menu Inggris, tanpa merek. Nama "Sunny Roll" bahkan belum ada.' },
        { l: 'MASALAH', t: 'Mahasiswa internasional——bagian besar komunitas NSYSU——melewatkan harta lokal ini semata karena tak ada akses berbahasa Inggris.' },
        { l: 'REBRANDING', t: 'Menamainya Sunny Roll 聖益卷, merancang logo modern dan sistem visual dwibahasa lengkap——menu, poster, spanduk, dan kemasan.' },
        { l: 'BUKU MEREK' },
        { l: 'KEHADIRAN DIGITAL', t: 'Menyiapkan Profil Bisnis Google dan kampanye ulasan QR——kedai kini bisa ditemukan di Peta dengan ulasan yang terus mengalir.' },
        { l: 'MENU DWIBAHASA' },
        { l: 'KAMPANYE ULASAN' },
        { l: 'DAMPAK', t: 'Keterlibatan merek internasional naik 30%——memimpin tim lintas budaya beranggotakan 4 orang.' },
      ],
    },
    {
      category: 'VISUALISASI DATA',
      desc: 'Dasbor admin React + Vite dengan grafik, tabel data, dan tema——wajah front-end dari alur kerja analis berbasis data.',
      board: [
        { l: 'LINGKUP', t: 'Konsol admin untuk mengolah data: dasbor, tabel drill-down, dan tampilan yang dapat dikonfigurasi, dibangun di atas Vite yang gesit.' },
        { l: 'FITUR' },
        { l: 'TEKNOLOGI' },
        { l: 'PERAN', t: 'Wajah front-end dari pola pikir analis——pemikiran "data ke keputusan" yang sama seperti pekerjaan Power BI, dalam kode.' },
      ],
    },
    {
      category: 'FULL-STACK · KOMERSIAL',
      desc: 'Etalase kelas produksi di atas Payload CMS——autentikasi, keranjang, checkout, paywall, dan panel admin enterprise, diimplementasikan dengan TypeScript.',
      board: [
        { l: 'LINGKUP', t: 'Platform komersial lengkap: etalase, panel admin kelas enterprise, dan backend produksi——bukan demo keranjang mainan.' },
        { l: 'FITUR' },
        { l: 'TEKNOLOGI' },
        { l: 'MENGAPA PENTING', t: 'Menjual produk fisik, aset digital, atau konten berbayar——arsitektur sama yang benar-benar dipakai perusahaan.' },
      ],
    },
    {
      category: 'AI GENERATIF · 3D',
      desc: 'Eksperimen fesyen AI generatif——konfigurator kemeja 3D yang menjelajahi kustomisasi busana bertenaga AI, dibuat saat perkakas AI generatif baru muncul.',
      board: [
        { l: 'EKSPERIMEN', t: 'Konfigurator kemeja 3D dengan tekstur dan logo hasil AI——sesuaikan busana secara real-time di peramban, dibuat pada gelombang AI generatif pertama.' },
        { l: 'RILIS', t: 'Konsep MERN yang berfungsi dengan front-end 3D react-three-fiber dan backend gambar AI.' },
        { l: 'TEKNOLOGI' },
        { l: 'PELAJARAN', t: 'Prototipe cepat, tetap rilis: nilainya ada pada belajar membangun di atas API AI yang terus berubah.' },
      ],
    },
  ],
  education: [
    { degree: 'Magister Manajemen (MBA) · Bisnis Internasional', detail: 'IPK 3,98 / 4,3 · Penerima Beasiswa Kemendikbud Taiwan' },
    { degree: 'Sarjana Teknik (B.Tech.) · Ilmu Komputer', detail: 'IPK 8,34 / 10 · Peringkat 17 se-India (NIRF 2025)' },
    { degree: 'Program Pertukaran Pelajar', detail: 'Satu tahun pertukaran internasional——awal dari perjalanan Asia-Pasifik.' },
  ],
  languages: [
    { name: 'Bahasa Hindi', level: 'Bahasa Ibu' },
    { name: 'Bahasa Inggris', level: 'Profesional · TOEFL iBT 98' },
    { name: 'Bahasa Mandarin', level: 'Percakapan' },
  ],
  certs: [
    'Sertifikat Profesional Dasar Scrum (SFPC) · Scrum Alliance',
    'Analisis & Visualisasi Data Python · Sertifikasi Profesional',
  ],
}

const OVERRIDES: Record<Exclude<Lang, 'en'>, ContentT> = { zh, ja, ko, vi, id }

export function getContent(lang: Lang): ContentT {
  if (lang === 'en') return buildEnglish()
  return OVERRIDES[lang]
}
