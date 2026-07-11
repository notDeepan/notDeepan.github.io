import { Lang } from './config'

export interface Mega {
  pre: string
  accent: string
  post: string
}

export interface UIStrings {
  navWork: string
  navExperience: string
  navAbout: string
  navContact: string
  contactCta: string
  openToWork: string
  scroll: string
  drag: string
  sceneHero: string
  heroEyebrow: string
  heroRole: string
  heroMba: string
  seekingLabel: string
  seekingRoles: string[]
  statLabels: [string, string, string, string]
  workLabel: string
  workHint: string
  openCase: string
  liveSite: string
  source: string
  listen: string
  stopListen: string
  expLabel: string
  expMega: Mega
  aboutLabel: string
  aboutMega: Mega
  aboutStatement: string
  langTitle: string
  certTitle: string
  skillTitles: [string, string, string]
  contactLabel: string
  contactMega: Mega
  backToTop: string
  builtWith: string
  caseFile: string
  close: string
  boardHint: string
  openLiveSite: string
  viewSource: string
  onRequest: string
  badgeLive: string
  badgeResearch: string
  badgeConsulting: string
  badgeCode: string
  splashTitle: string
  splashSub: string
  splashEnter: string
  langSwitcher: string
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    navWork: 'WORK',
    navExperience: 'EXPERIENCE',
    navAbout: 'ABOUT',
    navContact: 'CONTACT',
    contactCta: 'CONTACT',
    openToWork: 'OPEN TO WORK — JUL 2026 · TAIWAN & APAC',
    scroll: 'SCROLL',
    drag: 'DRAG',
    sceneHero: 'HERO',
    heroEyebrow: 'PORTFOLIO © 2026 — KAOHSIUNG, TAIWAN',
    heroRole: 'SENIOR ANALYST — DIGITAL & DATA TRANSFORMATION',
    heroMba: 'MBA @ NSYSU · EX-HCL TECHNOLOGIES',
    seekingLabel: 'SEEKING',
    seekingRoles: ['Data Analyst', 'Business Analyst', 'Consultant', 'Strategy Analyst', 'Digital Transformation'],
    statLabels: [
      'IT CONSULTING AT HCL',
      'MBA GPA AT NSYSU',
      'PRODUCT ENGAGEMENTS LED',
      'CODE QUALITY IMPROVEMENT',
    ],
    workLabel: 'SELECTED WORK · 2026 → 2023',
    workHint: 'DRAG TO EXPLORE / CLICK A CARD TO OPEN ITS CASE FILE',
    openCase: 'OPEN CASE FILE',
    liveSite: 'LIVE SITE',
    source: 'SOURCE',
    listen: 'LISTEN',
    stopListen: 'STOP',
    expLabel: 'EXPERIENCE',
    expMega: { pre: "WHERE I'VE ", accent: 'DELIVERED', post: '' },
    aboutLabel: 'ABOUT',
    aboutMega: { pre: 'ANALYST BY TRAINING, ', accent: 'BUILDER', post: ' BY HABIT' },
    aboutStatement:
      'MBA candidate at National Sun Yat-sen University with 2 years 10 months of IT consulting at HCL Technologies and an accelerated promotion to Senior Analyst. I translate technical complexity into executive-level strategy across data analytics and digital transformation. Available July 2026 for roles across Taiwan and the Asia-Pacific region.',
    langTitle: 'LANGUAGES',
    certTitle: 'CERTIFICATIONS',
    skillTitles: ['TECHNICAL', 'STRATEGY & ANALYSIS', 'FRAMEWORKS & PROCESS'],
    contactLabel: 'CONTACT',
    contactMega: { pre: "LET'S BUILD SOMETHING ", accent: 'MEASURABLE', post: '' },
    backToTop: 'BACK TO TOP ↑',
    builtWith: 'BUILT WITH REACT & THREE.JS',
    caseFile: 'CASE FILE',
    close: 'CLOSE',
    boardHint: 'DRAG THE EVIDENCE · ESC TO CLOSE',
    openLiveSite: 'OPEN LIVE SITE',
    viewSource: 'VIEW SOURCE',
    onRequest: 'Available on request',
    badgeLive: 'LIVE',
    badgeResearch: 'RESEARCH',
    badgeConsulting: 'CONSULTING',
    badgeCode: 'CODE',
    splashTitle: 'Select your language',
    splashSub: 'You can change it anytime from the top bar.',
    splashEnter: 'ENTER',
    langSwitcher: 'LANGUAGE',
  },

  zh: {
    navWork: '作品',
    navExperience: '經歷',
    navAbout: '關於',
    navContact: '聯絡',
    contactCta: '聯絡',
    openToWork: '正在求職 — 2026 年 7 月 · 台灣及亞太地區',
    scroll: '向下捲動',
    drag: '拖曳',
    sceneHero: '首頁',
    heroEyebrow: '作品集 © 2026 — 台灣高雄',
    heroRole: '資深分析師 — 數位與數據轉型',
    heroMba: '中山大學 MBA · 前 HCL Technologies',
    seekingLabel: '尋找職位',
    seekingRoles: ['資料分析師', '商業分析師', '顧問', '策略分析師', '數位轉型'],
    statLabels: ['HCL 資訊顧問年資', '中山大學 MBA 成績', '主導產品專案', '程式碼品質提升'],
    workLabel: '精選作品 · 2026 → 2023',
    workHint: '拖曳瀏覽 / 點擊卡片開啟專案檔案',
    openCase: '開啟專案檔案',
    liveSite: '線上網站',
    source: '原始碼',
    listen: '語音介紹',
    stopListen: '停止',
    expLabel: '經歷',
    expMega: { pre: '我交付成果的', accent: '軌跡', post: '' },
    aboutLabel: '關於',
    aboutMega: { pre: '分析出身，', accent: '打造', post: '為習慣' },
    aboutStatement:
      '國立中山大學 MBA 候選人，於 HCL Technologies 累積 2 年 10 個月的資訊顧問經驗，並在任內快速晉升為資深分析師。我擅長將技術的複雜性轉化為主管層級的策略，橫跨數據分析與數位轉型。2026 年 7 月起可任職，尋求台灣及亞太地區的機會。',
    langTitle: '語言能力',
    certTitle: '專業證照',
    skillTitles: ['技術能力', '策略與分析', '框架與流程'],
    contactLabel: '聯絡',
    contactMega: { pre: '一起打造可衡量的', accent: '成果', post: '' },
    backToTop: '回到頂端 ↑',
    builtWith: '以 REACT 與 THREE.JS 打造',
    caseFile: '專案檔案',
    close: '關閉',
    boardHint: '拖曳線索卡片 · 按 ESC 關閉',
    openLiveSite: '開啟線上網站',
    viewSource: '查看原始碼',
    onRequest: '可依需求提供',
    badgeLive: '線上',
    badgeResearch: '研究',
    badgeConsulting: '顧問',
    badgeCode: '程式',
    splashTitle: '請選擇語言',
    splashSub: '之後可隨時從上方選單切換。',
    splashEnter: '進入',
    langSwitcher: '語言',
  },

  ja: {
    navWork: 'WORK',
    navExperience: '経歴',
    navAbout: '概要',
    navContact: '連絡先',
    contactCta: '連絡先',
    openToWork: '求職中 — 2026年7月 · 台湾・アジア太平洋',
    scroll: 'スクロール',
    drag: 'ドラッグ',
    sceneHero: 'トップ',
    heroEyebrow: 'ポートフォリオ © 2026 — 台湾・高雄',
    heroRole: 'シニアアナリスト — デジタル＆データ変革',
    heroMba: '国立中山大学 MBA · 元 HCL Technologies',
    seekingLabel: '希望職種',
    seekingRoles: ['データアナリスト', 'ビジネスアナリスト', 'コンサルタント', '戦略アナリスト', 'デジタル変革'],
    statLabels: ['HCLでのITコンサル歴', '中山大学 MBA GPA', '主導したプロダクト案件', 'コード品質の改善'],
    workLabel: '主な実績 · 2026 → 2023',
    workHint: 'ドラッグして探索 / カードをクリックで詳細を表示',
    openCase: 'ケースファイルを開く',
    liveSite: '公開サイト',
    source: 'ソース',
    listen: '音声で聞く',
    stopListen: '停止',
    expLabel: '経歴',
    expMega: { pre: '成果を出して', accent: 'きた場所', post: '' },
    aboutLabel: '概要',
    aboutMega: { pre: '分析から始まり、', accent: '創る', post: 'ことが習慣' },
    aboutStatement:
      '国立中山大学の MBA 候補生。HCL Technologies で 2 年 10 か月の IT コンサルティング経験を積み、在職中にシニアアナリストへスピード昇進しました。技術的な複雑さを経営層レベルの戦略へと翻訳し、データ分析とデジタル変革の領域で成果を出しています。2026 年 7 月より、台湾およびアジア太平洋地域での役割に就任可能です。',
    langTitle: '言語',
    certTitle: '資格',
    skillTitles: ['テクニカル', '戦略と分析', 'フレームワークと手法'],
    contactLabel: '連絡先',
    contactMega: { pre: '測れる成果を、', accent: '一緒に', post: '' },
    backToTop: 'トップへ戻る ↑',
    builtWith: 'REACT ＆ THREE.JS で構築',
    caseFile: 'ケースファイル',
    close: '閉じる',
    boardHint: '証拠をドラッグ · ESC で閉じる',
    openLiveSite: '公開サイトを開く',
    viewSource: 'ソースを見る',
    onRequest: 'ご要望に応じて提供',
    badgeLive: '公開中',
    badgeResearch: '研究',
    badgeConsulting: 'コンサル',
    badgeCode: 'コード',
    splashTitle: '言語を選択してください',
    splashSub: '上部バーからいつでも変更できます。',
    splashEnter: '入る',
    langSwitcher: '言語',
  },

  ko: {
    navWork: '작업',
    navExperience: '경력',
    navAbout: '소개',
    navContact: '연락처',
    contactCta: '연락처',
    openToWork: '구직 중 — 2026년 7월 · 대만 및 아시아·태평양',
    scroll: '스크롤',
    drag: '드래그',
    sceneHero: '홈',
    heroEyebrow: '포트폴리오 © 2026 — 대만 가오슝',
    heroRole: '시니어 애널리스트 — 디지털 & 데이터 혁신',
    heroMba: '국립중산대 MBA · 전 HCL Technologies',
    seekingLabel: '희망 직무',
    seekingRoles: ['데이터 분석가', '비즈니스 분석가', '컨설턴트', '전략 분석가', '디지털 혁신'],
    statLabels: ['HCL IT 컨설팅 경력', '중산대 MBA 학점', '주도한 제품 프로젝트', '코드 품질 개선'],
    workLabel: '주요 작업 · 2026 → 2023',
    workHint: '드래그하여 탐색 / 카드를 클릭해 케이스 파일 열기',
    openCase: '케이스 파일 열기',
    liveSite: '라이브 사이트',
    source: '소스',
    listen: '음성 소개',
    stopListen: '정지',
    expLabel: '경력',
    expMega: { pre: '성과를 만들어온', accent: '현장', post: '' },
    aboutLabel: '소개',
    aboutMega: { pre: '분석가로 훈련받고, ', accent: '만드는', post: ' 것이 습관' },
    aboutStatement:
      '국립중산대학교 MBA 후보생으로, HCL Technologies에서 2년 10개월간 IT 컨설팅 경력을 쌓았으며 재직 중 시니어 애널리스트로 조기 승진했습니다. 기술적 복잡성을 경영진 수준의 전략으로 전환하며, 데이터 분석과 디지털 혁신 전반에서 성과를 냅니다. 2026년 7월부터 대만 및 아시아·태평양 지역의 직무에 합류할 수 있습니다.',
    langTitle: '언어',
    certTitle: '자격증',
    skillTitles: ['기술', '전략 & 분석', '프레임워크 & 프로세스'],
    contactLabel: '연락처',
    contactMega: { pre: '측정 가능한 결과를 ', accent: '함께', post: '' },
    backToTop: '맨 위로 ↑',
    builtWith: 'REACT & THREE.JS로 제작',
    caseFile: '케이스 파일',
    close: '닫기',
    boardHint: '증거를 드래그 · ESC로 닫기',
    openLiveSite: '라이브 사이트 열기',
    viewSource: '소스 보기',
    onRequest: '요청 시 제공 가능',
    badgeLive: '라이브',
    badgeResearch: '연구',
    badgeConsulting: '컨설팅',
    badgeCode: '코드',
    splashTitle: '언어를 선택하세요',
    splashSub: '상단 바에서 언제든지 변경할 수 있습니다.',
    splashEnter: '입장',
    langSwitcher: '언어',
  },

  vi: {
    navWork: 'DỰ ÁN',
    navExperience: 'KINH NGHIỆM',
    navAbout: 'GIỚI THIỆU',
    navContact: 'LIÊN HỆ',
    contactCta: 'LIÊN HỆ',
    openToWork: 'SẴN SÀNG NHẬN VIỆC — THÁNG 7/2026 · ĐÀI LOAN & CHÂU Á - TBD',
    scroll: 'CUỘN XUỐNG',
    drag: 'KÉO',
    sceneHero: 'TRANG ĐẦU',
    heroEyebrow: 'HỒ SƠ © 2026 — CAO HÙNG, ĐÀI LOAN',
    heroRole: 'CHUYÊN VIÊN PHÂN TÍCH CẤP CAO — CHUYỂN ĐỔI SỐ & DỮ LIỆU',
    heroMba: 'MBA @ NSYSU · CỰU HCL TECHNOLOGIES',
    seekingLabel: 'TÌM KIẾM VỊ TRÍ',
    seekingRoles: ['Phân tích Dữ liệu', 'Phân tích Nghiệp vụ', 'Tư vấn', 'Phân tích Chiến lược', 'Chuyển đổi Số'],
    statLabels: [
      'TƯ VẤN CNTT TẠI HCL',
      'ĐIỂM MBA TẠI NSYSU',
      'DỰ ÁN SẢN PHẨM ĐÃ DẪN DẮT',
      'CẢI THIỆN CHẤT LƯỢNG MÃ',
    ],
    workLabel: 'DỰ ÁN TIÊU BIỂU · 2026 → 2023',
    workHint: 'KÉO ĐỂ KHÁM PHÁ / NHẤP VÀO THẺ ĐỂ MỞ HỒ SƠ',
    openCase: 'MỞ HỒ SƠ DỰ ÁN',
    liveSite: 'TRANG TRỰC TUYẾN',
    source: 'MÃ NGUỒN',
    listen: 'NGHE GIỚI THIỆU',
    stopListen: 'DỪNG',
    expLabel: 'KINH NGHIỆM',
    expMega: { pre: 'NƠI TÔI ĐÃ ', accent: 'TẠO KẾT QUẢ', post: '' },
    aboutLabel: 'GIỚI THIỆU',
    aboutMega: { pre: 'PHÂN TÍCH LÀ NỀN TẢNG, ', accent: 'KIẾN TẠO', post: ' LÀ THÓI QUEN' },
    aboutStatement:
      'Ứng viên MBA tại Đại học Quốc lập Trung Sơn với 2 năm 10 tháng tư vấn CNTT tại HCL Technologies và được thăng chức sớm lên Chuyên viên Phân tích Cấp cao. Tôi chuyển hóa sự phức tạp về kỹ thuật thành chiến lược cấp điều hành trên các lĩnh vực phân tích dữ liệu và chuyển đổi số. Sẵn sàng nhận việc từ tháng 7/2026 cho các vị trí tại Đài Loan và khu vực châu Á - Thái Bình Dương.',
    langTitle: 'NGÔN NGỮ',
    certTitle: 'CHỨNG CHỈ',
    skillTitles: ['KỸ THUẬT', 'CHIẾN LƯỢC & PHÂN TÍCH', 'KHUÔN KHỔ & QUY TRÌNH'],
    contactLabel: 'LIÊN HỆ',
    contactMega: { pre: 'CÙNG TẠO NÊN ĐIỀU ', accent: 'ĐO ĐẾM ĐƯỢC', post: '' },
    backToTop: 'LÊN ĐẦU TRANG ↑',
    builtWith: 'XÂY DỰNG BẰNG REACT & THREE.JS',
    caseFile: 'HỒ SƠ DỰ ÁN',
    close: 'ĐÓNG',
    boardHint: 'KÉO CÁC MẢNH GHÉP · NHẤN ESC ĐỂ ĐÓNG',
    openLiveSite: 'MỞ TRANG TRỰC TUYẾN',
    viewSource: 'XEM MÃ NGUỒN',
    onRequest: 'Cung cấp theo yêu cầu',
    badgeLive: 'TRỰC TUYẾN',
    badgeResearch: 'NGHIÊN CỨU',
    badgeConsulting: 'TƯ VẤN',
    badgeCode: 'MÃ NGUỒN',
    splashTitle: 'Chọn ngôn ngữ của bạn',
    splashSub: 'Bạn có thể thay đổi bất cứ lúc nào ở thanh trên cùng.',
    splashEnter: 'VÀO',
    langSwitcher: 'NGÔN NGỮ',
  },

  id: {
    navWork: 'KARYA',
    navExperience: 'PENGALAMAN',
    navAbout: 'TENTANG',
    navContact: 'KONTAK',
    contactCta: 'KONTAK',
    openToWork: 'SIAP BEKERJA — JULI 2026 · TAIWAN & ASIA-PASIFIK',
    scroll: 'GULIR',
    drag: 'GESER',
    sceneHero: 'BERANDA',
    heroEyebrow: 'PORTOFOLIO © 2026 — KAOHSIUNG, TAIWAN',
    heroRole: 'ANALIS SENIOR — TRANSFORMASI DIGITAL & DATA',
    heroMba: 'MBA @ NSYSU · MANTAN HCL TECHNOLOGIES',
    seekingLabel: 'MENCARI POSISI',
    seekingRoles: ['Analis Data', 'Analis Bisnis', 'Konsultan', 'Analis Strategi', 'Transformasi Digital'],
    statLabels: [
      'KONSULTAN TI DI HCL',
      'IPK MBA DI NSYSU',
      'PROYEK PRODUK YANG DIPIMPIN',
      'PENINGKATAN KUALITAS KODE',
    ],
    workLabel: 'KARYA TERPILIH · 2026 → 2023',
    workHint: 'GESER UNTUK MENJELAJAH / KLIK KARTU UNTUK MEMBUKA BERKAS',
    openCase: 'BUKA BERKAS KASUS',
    liveSite: 'SITUS LANGSUNG',
    source: 'KODE SUMBER',
    listen: 'DENGARKAN',
    stopListen: 'HENTIKAN',
    expLabel: 'PENGALAMAN',
    expMega: { pre: 'TEMPAT SAYA ', accent: 'BERKARYA', post: '' },
    aboutLabel: 'TENTANG',
    aboutMega: { pre: 'TERLATIH SEBAGAI ANALIS, ', accent: 'MEMBANGUN', post: ' JADI KEBIASAAN' },
    aboutStatement:
      'Kandidat MBA di National Sun Yat-sen University dengan 2 tahun 10 bulan pengalaman konsultan TI di HCL Technologies serta promosi dipercepat menjadi Analis Senior. Saya menerjemahkan kompleksitas teknis menjadi strategi tingkat eksekutif di bidang analitik data dan transformasi digital. Siap bekerja mulai Juli 2026 untuk posisi di Taiwan dan kawasan Asia-Pasifik.',
    langTitle: 'BAHASA',
    certTitle: 'SERTIFIKASI',
    skillTitles: ['TEKNIS', 'STRATEGI & ANALISIS', 'KERANGKA & PROSES'],
    contactLabel: 'KONTAK',
    contactMega: { pre: 'MARI BANGUN SESUATU YANG ', accent: 'TERUKUR', post: '' },
    backToTop: 'KEMBALI KE ATAS ↑',
    builtWith: 'DIBANGUN DENGAN REACT & THREE.JS',
    caseFile: 'BERKAS KASUS',
    close: 'TUTUP',
    boardHint: 'GESER BUKTINYA · TEKAN ESC UNTUK MENUTUP',
    openLiveSite: 'BUKA SITUS LANGSUNG',
    viewSource: 'LIHAT KODE SUMBER',
    onRequest: 'Tersedia berdasarkan permintaan',
    badgeLive: 'LANGSUNG',
    badgeResearch: 'RISET',
    badgeConsulting: 'KONSULTASI',
    badgeCode: 'KODE',
    splashTitle: 'Pilih bahasa Anda',
    splashSub: 'Anda dapat mengubahnya kapan saja dari bilah atas.',
    splashEnter: 'MASUK',
    langSwitcher: 'BAHASA',
  },
}
