// export type Lang = 'en' | 'id' | 'ja' | 'zh'

// /** `short` is what the navbar button shows; `native` and `hint` are written in that language itself. */
// export const LANGS: { code: Lang; label: string; short: string; native: string; hint: string; locale: string }[] = [
//   { code: 'en', label: 'English', short: 'EN', native: 'English', hint: 'Read this site in English', locale: 'en-US' },
//   { code: 'id', label: 'Indonesia', short: 'ID', native: 'Bahasa Indonesia', hint: 'Baca situs ini dalam Bahasa Indonesia', locale: 'id-ID' },
//   { code: 'ja', label: '日本語', short: '日本語', native: '日本語', hint: 'このサイトは日本語で表示できます', locale: 'ja-JP' },
//   { code: 'zh', label: '中文', short: '中文', native: '中文（简体）', hint: '本站可以切换为中文显示', locale: 'zh-CN' },
// ]

// type Dict = Record<string, string>

// const en: Dict = {
//   'nav.work': 'Work',
//   'nav.about': 'About',
//   'nav.faq': 'FAQ',
//   'nav.contact': 'Contact',
//   'nav.call': 'Book a call',
//   'nav.menu': 'Menu',
//   'nav.admin': 'Admin',

//   'seo.home.title': 'Faradilah Ade | Actuarial Data Scientist | Data, Finance & Risk Portfolio',
//   'seo.home.desc': 'Portfolio of Faradilah Ade, an actuarial data scientist in Jakarta: data pipelines, forecasting, IFRS 17 finance analytics and risk modelling for the World Bank, insurers and public institutions. Available for remote roles and consulting.',
//   'seo.contact.title': 'Contact Faradilah Ade | Data, Finance & Risk Consulting',
//   'seo.contact.desc': 'Get in touch with Faradilah Ade for data science, financial analytics and actuarial risk work. Reply within one working day.',

//   'hero.eyebrow': 'Actuarial Data Scientist · Jakarta, Indonesia',
//   'hero.title': 'Turning data into decisions for finance and risk.',
//   'hero.body': 'I build data pipelines, financial models and risk frameworks that institutions actually use, from national infrastructure programmes with the World Bank to insurance portfolios of fifteen thousand policies.',
//   'hero.cta': 'Email me',
//   'hero.cta2': 'WhatsApp',
//   'hero.cta3': 'See the work',
//   'hero.available': 'Open to remote roles & consulting',

//   'stat.dams': 'dam sites monitored by a national early-warning system I helped build',
//   'stat.accuracy': 'forecast accuracy, deployed to production',
//   'stat.policies': 'insurance policies analysed for reserving',
//   'stat.members': 'members in the actuarial community I founded',

//   'about.title': 'About',
//   'about.lead': 'Three disciplines, one practice.',
//   'about.proof': 'World Bank collaboration · Asian Development Bank · Zurich Topas Life · Indonesia Re · Ministry of Public Works · Published in an Institute of Actuaries of Japan affiliated journal · Founder of Anak Aktuaria, Indonesia\'s largest actuarial community',
//   'about.web': 'On the web',
//   'pillar.data.title': 'Data',
//   'pillar.data.body': 'Production pipelines with Python, SQL, Airflow and dbt on Google Cloud. Forecasting models at 92% accuracy, deployed into a national early-warning system covering 240 dam sites.',
//   'pillar.finance.title': 'Finance',
//   'pillar.finance.body': 'IFRS 17 impact analysis, board and regulator reporting, and automation that cut reconciliation time across 13 banks by 70% at Zurich Topas Life.',
//   'pillar.risk.title': 'Risk',
//   'pillar.risk.body': 'Reserving, stress testing and pricing grounded in actuarial method, including published research on Tweedie GLM and a risk framework co-developed with the World Bank.',

//   'work.title': 'Work',
//   'work.home': 'Home',
//   'work.results': 'Results',
//   'work.sortBy': 'Sort by',
//   'sort.featured': 'Featured',
//   'sort.newest': 'Newest',
//   'sort.oldest': 'Oldest',
//   'sort.az': 'A-Z',
//   'view.grid': 'Grid view',
//   'view.list': 'List view',
//   'work.viewMore': 'View more',
//   'work.empty': 'No projects published yet. Check back soon.',
//   'work.noresults': 'Nothing matches these filters yet.',
//   'work.search': 'Search projects, tools, keywords…',
//   'work.clear': 'Clear',
//   'work.read': 'Open case study',
//   'work.loading': 'Loading work…',
//   'work.behance': 'Behance',
//   'work.behance_sub': 'Visual explorations and data storytelling published on Behance.',
//   'work.viewOnBehance': 'View on Behance',
//   'work.all': 'All work',

//   'filter.title': 'Filters',
//   'filter.year': 'Year',
//   'filter.field': 'Field',
//   'filter.tools': 'Tools',
//   'filter.client': 'Client',
//   'filter.keywords': 'Keywords',
//   'filter.deliverables': 'Deliverables',
//   'filter.reset': 'Reset filters',
//   'filter.showAll': 'Show all',
//   'filter.showLess': 'Show less',
//   'filter.active': 'active',
//   'deliverable.casestudy': 'Written case study',
//   'deliverable.gallery': 'Image gallery',
//   'deliverable.files': 'Downloadable files',
//   'deliverable.behance': 'Published on Behance',

//   'cat.data': 'Data',
//   'cat.finance': 'Finance',
//   'cat.risk': 'Risk',

//   'card.tools': 'Tools',
//   'card.client': 'Client',
//   'card.role': 'Role',
//   'card.open': 'Open',
//   'card.ask': 'Ask',
//   'card.new': 'New',
//   'card.featured': 'Featured',

//   'promo.kicker': 'Available',
//   'promo.title': 'Let\'s talk',
//   'promo.body': 'Open to remote roles and consulting engagements. I reply within one working day.',
//   'promo.button': 'Email me',

//   'faq.title': 'FAQ',
//   'faq.q1': 'Are you available for remote or international work?',
//   'faq.a1': 'Yes. I work remotely from Jakarta (GMT+7) with comfortable overlap for Asia-Pacific and European mornings, and I travel for on-site kick-offs when it helps.',
//   'faq.q2': 'What kind of engagements do you take on?',
//   'faq.a2': 'Data pipelines and forecasting, financial analysis and IFRS 17 reporting, actuarial reserving, pricing and risk frameworks, from a two-week audit to a multi-month build.',
//   'faq.q3': 'Which tools do you work with?',
//   'faq.a3': 'Python, SQL, Airflow, dbt and BigQuery on Google Cloud for data; R and Excel for actuarial work; Power BI and Looker Studio for reporting. Every project lists its exact stack.',
//   'faq.q4': 'How does a project usually start?',
//   'faq.a4': 'A 30-minute call to understand the problem, a short written proposal with scope, timeline and price, then kick-off, usually within a week.',
//   'faq.q5': 'Do you sign NDAs and work with confidential data?',
//   'faq.a5': 'Yes. Several projects here are described at a high level for that reason; details can be shared under NDA.',
//   'faq.q6': 'Which languages do you work in?',
//   'faq.a6': 'English and Indonesian for day-to-day work and documentation. This site is also available in Japanese and Chinese.',
//   'faq.q7': 'Can I see code, models or reports?',
//   'faq.a7': 'Where clients allow it, sample files are attached to the project. Ask through the contact button and I will send what can be shared.',
//   'faq.q8': 'How quickly do you reply?',
//   'faq.a8': 'Within one working day, usually faster. WhatsApp is best for anything urgent.',

//   'call.title': 'Book a call and get all the details',
//   'call.name': 'Name',
//   'call.contact': 'Email or WhatsApp',
//   'call.button': 'Request a call',
//   'call.note': 'Opens your email app with the request prefilled. Or write directly to',
//   'call.subject': 'Call request',
//   'call.body': 'Hi Faradilah, I would like to book a short call.',

//   'footer.work': 'Work',
//   'footer.about': 'About',
//   'footer.contacts': 'Contacts',
//   'footer.consultation': 'Consultation',
//   'footer.scrollUp': 'Scroll up',
//   'footer.replies': 'Replies within one working day',
//   'footer.tagline': 'Data, finance and risk. Built to be used.',
//   'footer.rights': 'All rights reserved.',

//   'modal.close': 'Close',
//   'modal.contact': 'Contact',
//   'modal.tools': 'Tools',
//   'modal.files': 'Files',
//   'modal.share': 'Share',
//   'modal.open': 'Open',
//   'modal.next': 'Next',
//   'modal.prev': 'Previous',
//   'modal.copied': 'Link copied',
//   'modal.role': 'Role',
//   'modal.client': 'Client',
//   'modal.year': 'Year',
//   'modal.category': 'Field',
//   'modal.published': 'Published',
//   'modal.toolsTitle': 'Tools used',
//   'modal.keywords': 'Keywords',
//   'modal.attachments': 'Files & documents',
//   'modal.gallery': 'Gallery',
//   'modal.ask': 'Ask about this project',
//   'modal.viewExternal': 'View full project',
//   'modal.notfound': 'This project could not be found.',
//   'modal.backToWork': 'Back to work',
//   'modal.subject': 'About your project: ',

//   'contact.title': 'Let\'s work together',
//   'contact.sub': 'Open to remote roles and consulting engagements in data, finance and risk. I reply within one working day.',
//   'contact.email': 'Email',
//   'contact.phone': 'Phone / WhatsApp',
//   'contact.location': 'Location',
//   'contact.location.value': 'Jakarta, Indonesia (GMT+7)',
//   'contact.community': 'Community',
//   'contact.form.title': 'Write to me',
//   'contact.form.name': 'Your name',
//   'contact.form.company': 'Company or organisation',
//   'contact.form.topic': 'What is this about?',
//   'contact.form.topic.role': 'A role or position',
//   'contact.form.topic.consulting': 'Consulting or a project',
//   'contact.form.topic.speaking': 'Speaking or teaching',
//   'contact.form.topic.other': 'Something else',
//   'contact.form.message': 'Message',
//   'contact.form.send': 'Open in my email app',
//   'contact.form.hint': 'This opens your email app with everything prefilled, addressed to',
//   'contact.direct': 'Or write directly to',
//   'contact.channels': 'Media & channels',

//   'notfound.title': 'Page not found',
//   'notfound.body': 'The page you were looking for has moved or never existed.',
//   'notfound.back': 'Back to the portfolio',

//   'admin.notConfigured': 'Supabase is not configured for this build. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (GitHub → Settings → Secrets) and redeploy.',
//   'modal.autoTranslated': 'Auto-translated',
//   'modal.translation': 'Translation',
//   'modal.showOriginal': 'Show original',
//   'modal.showTranslated': 'Show translation',
//   'modal.translating': 'Translating…',
//   'modal.toolsHint': 'Tools used in this project',
//   'nav.articles': 'Articles',
//   'hero.request': 'Request a call',
//   'hero.status': 'Available for remote work',
//   'hero.card.dashboard': 'Forecast dashboard',
//   'hero.card.dashboardSub': 'Early-warning model · in production',
//   'hero.card.accuracy': 'accuracy',
//   'hero.card.sites': 'dam sites',
//   'hero.card.formulas': 'Actuarial toolkit',
//   'hero.card.formulasSub': 'used every week',
//   'hero.card.skills': 'Skills',
//   'hero.skill.1': 'Data pipelines · Python, SQL, Airflow',
//   'hero.skill.2': 'Forecasting & machine learning',
//   'hero.skill.3': 'IFRS 17 & finance analytics',
//   'hero.skill.4': 'Reserving, pricing & stress testing',
//   'hero.skill.5': 'Dashboards · Power BI, Looker Studio',
//   'hero.call.label': 'call or message',
//   'hero.formula.lr': 'Loss ratio',
//   'hero.formula.cl': 'Chain-ladder factor',
//   'hero.formula.ax': 'Net single premium',
//   'hero.formula.z': 'Credibility',
//   'hero.formula.var': 'Value at risk',
//   'work.tab.work': 'Work',
//   'work.tab.articles': 'Articles',
//   'work.sub': 'Selected data, finance and risk work. Open any piece for the full case study and the tools behind it.',
//   'work.chip.all': 'All',
//   'articles.title': 'Articles',
//   'articles.sub': 'Notes on data, actuarial method and finance, written to be useful.',
//   'articles.empty': 'No articles published yet. Check back soon.',
//   'articles.noresults': 'No articles match this search.',
//   'articles.read': 'Read',
//   'articles.minRead': 'min read',
//   'articles.search': 'Search articles…',
//   'articles.notfound': 'This article could not be found.',
//   'articles.back': 'Back to articles',
//   'articles.tags': 'Topics',
//   'articles.loading': 'Loading articles…',
//   'articles.external': 'Read on the original site',

//   'articles.kicker': 'Notes & writing',
//   'nav.language': 'Language',
// }

// const id: Dict = {
//   'nav.work': 'Karya',
//   'nav.about': 'Tentang',
//   'nav.faq': 'FAQ',
//   'nav.contact': 'Kontak',
//   'nav.call': 'Jadwalkan panggilan',
//   'nav.menu': 'Menu',
//   'nav.admin': 'Admin',

//   'seo.home.title': 'Faradilah Ade | Actuarial Data Scientist | Portofolio Data, Keuangan & Risiko',
//   'seo.home.desc': 'Portofolio Faradilah Ade, actuarial data scientist di Jakarta: pipeline data, peramalan, analitik keuangan IFRS 17, dan pemodelan risiko untuk World Bank, perusahaan asuransi, dan lembaga publik. Terbuka untuk peran remote dan konsultasi.',
//   'seo.contact.title': 'Kontak Faradilah Ade | Konsultasi Data, Keuangan & Risiko',
//   'seo.contact.desc': 'Hubungi Faradilah Ade untuk pekerjaan data science, analitik keuangan, dan risiko aktuaria. Dibalas dalam satu hari kerja.',

//   'hero.eyebrow': 'Actuarial Data Scientist · Jakarta, Indonesia',
//   'hero.title': 'Mengubah data menjadi keputusan untuk keuangan dan risiko.',
//   'hero.body': 'Saya membangun pipeline data, model keuangan, dan kerangka risiko yang benar-benar dipakai institusi, dari program infrastruktur nasional bersama World Bank hingga portofolio asuransi lima belas ribu polis.',
//   'hero.cta': 'Kirim email',
//   'hero.cta2': 'WhatsApp',
//   'hero.cta3': 'Lihat karya',
//   'hero.available': 'Terbuka untuk peran remote & konsultasi',

//   'stat.dams': 'bendungan dipantau oleh sistem peringatan dini nasional yang saya bantu bangun',
//   'stat.accuracy': 'akurasi peramalan, terpasang di produksi',
//   'stat.policies': 'polis asuransi dianalisis untuk reserving',
//   'stat.members': 'anggota komunitas aktuaria yang saya dirikan',

//   'about.title': 'Tentang',
//   'about.lead': 'Tiga disiplin, satu praktik.',
//   'about.proof': 'Kolaborasi World Bank · Asian Development Bank · Zurich Topas Life · Indonesia Re · Kementerian Pekerjaan Umum · Terpublikasi di jurnal afiliasi Institute of Actuaries of Japan · Pendiri Anak Aktuaria, komunitas aktuaria terbesar di Indonesia',
//   'about.web': 'Di internet',
//   'pillar.data.title': 'Data',
//   'pillar.data.body': 'Pipeline produksi dengan Python, SQL, Airflow, dan dbt di Google Cloud. Model peramalan berakurasi 92%, terpasang di sistem peringatan dini nasional yang mencakup 240 bendungan.',
//   'pillar.finance.title': 'Keuangan',
//   'pillar.finance.body': 'Analisis dampak IFRS 17, pelaporan direksi dan regulator, serta otomasi yang memangkas waktu rekonsiliasi 13 bank sebesar 70% di Zurich Topas Life.',
//   'pillar.risk.title': 'Risiko',
//   'pillar.risk.body': 'Reserving, stress testing, dan pricing berbasis metode aktuaria, termasuk riset terpublikasi tentang Tweedie GLM dan kerangka risiko yang dikembangkan bersama World Bank.',

//   'work.title': 'Karya',
//   'work.home': 'Beranda',
//   'work.results': 'Hasil',
//   'work.sortBy': 'Urutkan',
//   'sort.featured': 'Unggulan',
//   'sort.newest': 'Terbaru',
//   'sort.oldest': 'Terlama',
//   'sort.az': 'A-Z',
//   'view.grid': 'Tampilan grid',
//   'view.list': 'Tampilan daftar',
//   'work.viewMore': 'Lihat lebih banyak',
//   'work.empty': 'Belum ada proyek yang dipublikasikan. Silakan kembali lagi.',
//   'work.noresults': 'Belum ada yang cocok dengan filter ini.',
//   'work.search': 'Cari proyek, tools, kata kunci…',
//   'work.clear': 'Hapus',
//   'work.read': 'Buka studi kasus',
//   'work.loading': 'Memuat karya…',
//   'work.behance': 'Behance',
//   'work.behance_sub': 'Eksplorasi visual dan data storytelling yang dipublikasikan di Behance.',
//   'work.viewOnBehance': 'Lihat di Behance',
//   'work.all': 'Semua karya',

//   'filter.title': 'Filter',
//   'filter.year': 'Tahun',
//   'filter.field': 'Bidang',
//   'filter.tools': 'Tools',
//   'filter.client': 'Klien',
//   'filter.keywords': 'Kata kunci',
//   'filter.deliverables': 'Hasil kerja',
//   'filter.reset': 'Reset filter',
//   'filter.showAll': 'Tampilkan semua',
//   'filter.showLess': 'Tampilkan lebih sedikit',
//   'filter.active': 'aktif',
//   'deliverable.casestudy': 'Studi kasus tertulis',
//   'deliverable.gallery': 'Galeri gambar',
//   'deliverable.files': 'Berkas unduhan',
//   'deliverable.behance': 'Dipublikasikan di Behance',

//   'cat.data': 'Data',
//   'cat.finance': 'Keuangan',
//   'cat.risk': 'Risiko',

//   'card.tools': 'Tools',
//   'card.client': 'Klien',
//   'card.role': 'Peran',
//   'card.open': 'Buka',
//   'card.ask': 'Tanya',
//   'card.new': 'Baru',
//   'card.featured': 'Unggulan',

//   'promo.kicker': 'Tersedia',
//   'promo.title': 'Mari bicara',
//   'promo.body': 'Terbuka untuk peran remote dan proyek konsultasi. Saya membalas dalam satu hari kerja.',
//   'promo.button': 'Kirim email',

//   'faq.title': 'FAQ',
//   'faq.q1': 'Apakah Anda tersedia untuk kerja remote atau internasional?',
//   'faq.a1': 'Ya. Saya bekerja remote dari Jakarta (GMT+7) dengan jam tumpang tindih yang nyaman untuk Asia-Pasifik dan pagi hari Eropa, dan bersedia datang untuk kick-off di lokasi bila diperlukan.',
//   'faq.q2': 'Jenis pekerjaan apa yang Anda ambil?',
//   'faq.a2': 'Pipeline data dan peramalan, analisis keuangan dan pelaporan IFRS 17, reserving aktuaria, pricing, dan kerangka risiko, dari audit dua minggu hingga pembangunan beberapa bulan.',
//   'faq.q3': 'Tools apa yang Anda gunakan?',
//   'faq.a3': 'Python, SQL, Airflow, dbt, dan BigQuery di Google Cloud untuk data; R dan Excel untuk pekerjaan aktuaria; Power BI dan Looker Studio untuk pelaporan. Setiap proyek mencantumkan stack persisnya.',
//   'faq.q4': 'Bagaimana sebuah proyek biasanya dimulai?',
//   'faq.a4': 'Panggilan 30 menit untuk memahami persoalan, proposal tertulis singkat berisi lingkup, jadwal, dan biaya, lalu kick-off, biasanya dalam satu minggu.',
//   'faq.q5': 'Apakah Anda menandatangani NDA dan bekerja dengan data rahasia?',
//   'faq.a5': 'Ya. Beberapa proyek di sini dijelaskan secara umum karena alasan itu; detailnya dapat dibagikan di bawah NDA.',
//   'faq.q6': 'Dalam bahasa apa Anda bekerja?',
//   'faq.a6': 'Bahasa Inggris dan Indonesia untuk pekerjaan harian dan dokumentasi. Situs ini juga tersedia dalam bahasa Jepang dan Mandarin.',
//   'faq.q7': 'Bisakah saya melihat kode, model, atau laporan?',
//   'faq.a7': 'Bila klien mengizinkan, contoh berkas dilampirkan pada proyek. Tanyakan lewat tombol kontak dan saya kirimkan yang boleh dibagikan.',
//   'faq.q8': 'Seberapa cepat Anda membalas?',
//   'faq.a8': 'Dalam satu hari kerja, biasanya lebih cepat. WhatsApp paling cocok untuk hal mendesak.',

//   'call.title': 'Jadwalkan panggilan dan dapatkan semua detailnya',
//   'call.name': 'Nama',
//   'call.contact': 'Email atau WhatsApp',
//   'call.button': 'Ajukan panggilan',
//   'call.note': 'Membuka aplikasi email Anda dengan permintaan yang sudah terisi. Atau tulis langsung ke',
//   'call.subject': 'Permintaan panggilan',
//   'call.body': 'Halo Faradilah, saya ingin menjadwalkan panggilan singkat.',

//   'footer.work': 'Karya',
//   'footer.about': 'Tentang',
//   'footer.contacts': 'Kontak',
//   'footer.consultation': 'Konsultasi',
//   'footer.scrollUp': 'Ke atas',
//   'footer.replies': 'Dibalas dalam satu hari kerja',
//   'footer.tagline': 'Data, keuangan, dan risiko. Dibangun untuk dipakai.',
//   'footer.rights': 'Hak cipta dilindungi.',

//   'modal.close': 'Tutup',
//   'modal.contact': 'Kontak',
//   'modal.tools': 'Tools',
//   'modal.files': 'Berkas',
//   'modal.share': 'Bagikan',
//   'modal.open': 'Buka',
//   'modal.next': 'Berikutnya',
//   'modal.prev': 'Sebelumnya',
//   'modal.copied': 'Tautan disalin',
//   'modal.role': 'Peran',
//   'modal.client': 'Klien',
//   'modal.year': 'Tahun',
//   'modal.category': 'Bidang',
//   'modal.published': 'Dipublikasikan',
//   'modal.toolsTitle': 'Tools yang digunakan',
//   'modal.keywords': 'Kata kunci',
//   'modal.attachments': 'Berkas & dokumen',
//   'modal.gallery': 'Galeri',
//   'modal.ask': 'Tanya tentang proyek ini',
//   'modal.viewExternal': 'Lihat proyek lengkap',
//   'modal.notfound': 'Proyek ini tidak ditemukan.',
//   'modal.backToWork': 'Kembali ke karya',
//   'modal.subject': 'Tentang proyek Anda: ',

//   'contact.title': 'Mari bekerja sama',
//   'contact.sub': 'Terbuka untuk peran remote dan konsultasi di bidang data, keuangan, dan risiko. Saya membalas dalam satu hari kerja.',
//   'contact.email': 'Email',
//   'contact.phone': 'Telepon / WhatsApp',
//   'contact.location': 'Lokasi',
//   'contact.location.value': 'Jakarta, Indonesia (GMT+7)',
//   'contact.community': 'Komunitas',
//   'contact.form.title': 'Tulis pesan',
//   'contact.form.name': 'Nama Anda',
//   'contact.form.company': 'Perusahaan atau organisasi',
//   'contact.form.topic': 'Tentang apa?',
//   'contact.form.topic.role': 'Peran atau posisi',
//   'contact.form.topic.consulting': 'Konsultasi atau proyek',
//   'contact.form.topic.speaking': 'Menjadi pembicara atau mengajar',
//   'contact.form.topic.other': 'Hal lainnya',
//   'contact.form.message': 'Pesan',
//   'contact.form.send': 'Buka di aplikasi email',
//   'contact.form.hint': 'Ini membuka aplikasi email Anda dengan pesan yang sudah terisi, ditujukan ke',
//   'contact.direct': 'Atau tulis langsung ke',
//   'contact.channels': 'Media & kanal',

//   'notfound.title': 'Halaman tidak ditemukan',
//   'notfound.body': 'Halaman yang Anda cari sudah dipindahkan atau tidak pernah ada.',
//   'notfound.back': 'Kembali ke portofolio',

//   'admin.notConfigured': 'Supabase belum dikonfigurasi untuk build ini. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (GitHub → Settings → Secrets) lalu deploy ulang.',
//   'modal.autoTranslated': 'Terjemahan otomatis',
//   'modal.translation': 'Terjemahan',
//   'modal.showOriginal': 'Lihat teks asli',
//   'modal.showTranslated': 'Lihat terjemahan',
//   'modal.translating': 'Menerjemahkan…',
//   'modal.toolsHint': 'Tools yang dipakai di proyek ini',
//   'nav.articles': 'Artikel',
//   'hero.request': 'Minta jadwal panggilan',
//   'hero.status': 'Tersedia untuk kerja remote',
//   'hero.card.dashboard': 'Dasbor peramalan',
//   'hero.card.dashboardSub': 'Model peringatan dini · produksi',
//   'hero.card.accuracy': 'akurasi',
//   'hero.card.sites': 'bendungan',
//   'hero.card.formulas': 'Perangkat aktuaria',
//   'hero.card.formulasSub': 'dipakai tiap minggu',
//   'hero.card.skills': 'Keahlian',
//   'hero.skill.1': 'Pipeline data · Python, SQL, Airflow',
//   'hero.skill.2': 'Peramalan & machine learning',
//   'hero.skill.3': 'IFRS 17 & analitik keuangan',
//   'hero.skill.4': 'Reserving, pricing & stress testing',
//   'hero.skill.5': 'Dasbor · Power BI, Looker Studio',
//   'hero.call.label': 'telepon atau pesan',
//   'hero.formula.lr': 'Rasio klaim',
//   'hero.formula.cl': 'Faktor chain-ladder',
//   'hero.formula.ax': 'Premi tunggal bersih',
//   'hero.formula.z': 'Kredibilitas',
//   'hero.formula.var': 'Value at risk',
//   'work.tab.work': 'Karya',
//   'work.tab.articles': 'Artikel',
//   'work.sub': 'Karya pilihan di bidang data, keuangan, dan risiko. Buka salah satu untuk membaca studi kasus lengkap dan tools di baliknya.',
//   'work.chip.all': 'Semua',
//   'articles.title': 'Artikel',
//   'articles.sub': 'Catatan tentang data, metode aktuaria, dan keuangan, ditulis agar berguna.',
//   'articles.empty': 'Belum ada artikel yang diterbitkan. Kembali lagi nanti.',
//   'articles.noresults': 'Tidak ada artikel yang cocok dengan pencarian ini.',
//   'articles.read': 'Baca',
//   'articles.minRead': 'menit baca',
//   'articles.search': 'Cari artikel…',
//   'articles.notfound': 'Artikel ini tidak ditemukan.',
//   'articles.back': 'Kembali ke artikel',
//   'articles.tags': 'Topik',
//   'articles.loading': 'Memuat artikel…',
//   'articles.external': 'Baca di situs asli',

//   'articles.kicker': 'Catatan & tulisan',
//   'nav.language': 'Bahasa',
// }

// const ja: Dict = {
//   'nav.work': '実績',
//   'nav.about': '紹介',
//   'nav.faq': 'FAQ',
//   'nav.contact': '連絡先',
//   'nav.call': '面談を予約',
//   'nav.menu': 'メニュー',
//   'nav.admin': '管理',

//   'seo.home.title': 'Faradilah Ade | アクチュアリー・データサイエンティスト | データ・金融・リスク ポートフォリオ',
//   'seo.home.desc': 'ジャカルタ在住のアクチュアリー・データサイエンティスト Faradilah Ade のポートフォリオ。世界銀行、保険会社、公的機関向けのデータ基盤、予測、IFRS 17 財務分析、リスクモデリング。リモート業務・コンサルティングのご相談を承ります。',
//   'seo.contact.title': 'Faradilah Ade へのお問い合わせ | データ・金融・リスク コンサルティング',
//   'seo.contact.desc': 'データサイエンス、財務分析、アクチュアリー・リスク業務のご相談は Faradilah Ade まで。1営業日以内に返信します。',

//   'hero.eyebrow': 'アクチュアリー・データサイエンティスト · ジャカルタ・インドネシア',
//   'hero.title': 'データを、金融とリスクの意思決定へ。',
//   'hero.body': '世界銀行との国家インフラ事業から一万五千件の保険ポートフォリオまで、実際に使われるデータ基盤・財務モデル・リスク枠組みを構築しています。',
//   'hero.cta': 'メールする',
//   'hero.cta2': 'WhatsApp',
//   'hero.cta3': '実績を見る',
//   'hero.available': 'リモート業務・コンサルティング受付中',

//   'stat.dams': '全国早期警報システムが監視するダム（構築に参画）',
//   'stat.accuracy': '本番稼働中の予測モデルの精度',
//   'stat.policies': '準備金評価のために分析した保険契約',
//   'stat.members': '創設したアクチュアリーコミュニティの会員',

//   'about.title': '紹介',
//   'about.lead': '三つの専門、一つの実践。',
//   'about.proof': '世界銀行との協働 · アジア開発銀行 · チューリッヒ・トパス生命 · インドネシア再保険 · 公共事業省 · 日本アクチュアリー会関連誌に論文掲載 · インドネシア最大のアクチュアリーコミュニティ Anak Aktuaria 創設者',
//   'about.web': 'ウェブ上で',
//   'pillar.data.title': 'データ',
//   'pillar.data.body': 'Python・SQL・Airflow・dbtによるGoogle Cloud上の本番パイプライン。精度92%の予測モデルを全国240ダムの早期警報システムに実装。',
//   'pillar.finance.title': '金融',
//   'pillar.finance.body': 'IFRS 17影響分析、取締役会・規制当局向け報告、そして13銀行の照合時間を70%削減した自動化（チューリッヒ・トパス生命）。',
//   'pillar.risk.title': 'リスク',
//   'pillar.risk.body': 'アクチュアリー手法に基づく準備金評価・ストレステスト・料率算定。Tweedie GLMに関する学術論文と、世界銀行と共同開発したリスク枠組みを含む。',

//   'work.title': '実績',
//   'work.home': 'ホーム',
//   'work.results': '件数',
//   'work.sortBy': '並び替え',
//   'sort.featured': '注目順',
//   'sort.newest': '新しい順',
//   'sort.oldest': '古い順',
//   'sort.az': 'A-Z',
//   'view.grid': 'グリッド表示',
//   'view.list': 'リスト表示',
//   'work.viewMore': 'もっと見る',
//   'work.empty': 'まだ公開されたプロジェクトはありません。',
//   'work.noresults': 'この条件に該当するプロジェクトはありません。',
//   'work.search': 'プロジェクト・ツール・キーワードを検索…',
//   'work.clear': 'クリア',
//   'work.read': '事例を開く',
//   'work.loading': '読み込み中…',
//   'work.behance': 'Behance',
//   'work.behance_sub': 'Behance に公開したビジュアル表現とデータストーリーテリング。',
//   'work.viewOnBehance': 'Behance で見る',
//   'work.all': 'すべての実績',

//   'filter.title': 'フィルター',
//   'filter.year': '年',
//   'filter.field': '分野',
//   'filter.tools': 'ツール',
//   'filter.client': 'クライアント',
//   'filter.keywords': 'キーワード',
//   'filter.deliverables': '成果物',
//   'filter.reset': 'フィルターをリセット',
//   'filter.showAll': 'すべて表示',
//   'filter.showLess': '少なく表示',
//   'filter.active': '件適用中',
//   'deliverable.casestudy': '事例の本文',
//   'deliverable.gallery': '画像ギャラリー',
//   'deliverable.files': 'ダウンロード資料',
//   'deliverable.behance': 'Behance で公開',

//   'cat.data': 'データ',
//   'cat.finance': '金融',
//   'cat.risk': 'リスク',

//   'card.tools': 'ツール',
//   'card.client': 'クライアント',
//   'card.role': '役割',
//   'card.open': '開く',
//   'card.ask': '相談',
//   'card.new': '新着',
//   'card.featured': '注目',

//   'promo.kicker': '受付中',
//   'promo.title': 'ご相談ください',
//   'promo.body': 'リモート業務・コンサルティング案件を承ります。1営業日以内に返信します。',
//   'promo.button': 'メールする',

//   'faq.title': 'FAQ',
//   'faq.q1': 'リモートや海外の案件に対応できますか？',
//   'faq.a1': 'はい。ジャカルタ（GMT+7）からリモートで働いており、アジア太平洋および欧州の午前と十分に時間が重なります。必要に応じて現地でのキックオフにも伺います。',
//   'faq.q2': 'どのような案件を引き受けていますか？',
//   'faq.a2': 'データ基盤と予測、財務分析と IFRS 17 報告、アクチュアリーの準備金評価・料率算定・リスク枠組み。2週間の監査から数か月の構築まで対応します。',
//   'faq.q3': '使用するツールは？',
//   'faq.a3': 'データは Python・SQL・Airflow・dbt・BigQuery（Google Cloud）、アクチュアリー業務は R と Excel、レポーティングは Power BI と Looker Studio。各プロジェクトに使用スタックを明記しています。',
//   'faq.q4': 'プロジェクトはどのように始まりますか？',
//   'faq.a4': '30分の面談で課題を把握し、範囲・期間・費用を記した簡潔な提案書をお送りしたうえでキックオフ。通常1週間以内です。',
//   'faq.q5': 'NDA の締結や機密データの扱いは可能ですか？',
//   'faq.a5': '可能です。そのため一部のプロジェクトは概要のみ掲載しています。詳細は NDA のもとで共有できます。',
//   'faq.q6': '対応言語は？',
//   'faq.a6': '日常業務と文書は英語とインドネシア語です。本サイトは日本語と中国語でも閲覧できます。',
//   'faq.q7': 'コード・モデル・レポートを見ることはできますか？',
//   'faq.a7': 'クライアントの許可がある場合、サンプル資料をプロジェクトに添付しています。お問い合わせいただければ共有可能なものをお送りします。',
//   'faq.q8': '返信はどのくらい早いですか？',
//   'faq.a8': '1営業日以内、多くの場合それより早く返信します。急ぎの場合は WhatsApp が最適です。',

//   'call.title': '面談を予約して詳細をご確認ください',
//   'call.name': 'お名前',
//   'call.contact': 'メールまたは WhatsApp',
//   'call.button': '面談を申し込む',
//   'call.note': '内容を入力済みの状態でメールアプリが開きます。または直接こちらへ',
//   'call.subject': '面談のご依頼',
//   'call.body': 'Faradilah さん、短い面談を予約したいと考えています。',

//   'footer.work': '実績',
//   'footer.about': '紹介',
//   'footer.contacts': '連絡先',
//   'footer.consultation': 'ご相談',
//   'footer.scrollUp': '上へ戻る',
//   'footer.replies': '1営業日以内に返信',
//   'footer.tagline': 'データ・金融・リスク。実際に使われるために。',
//   'footer.rights': 'All rights reserved.',

//   'modal.close': '閉じる',
//   'modal.contact': '連絡',
//   'modal.tools': 'ツール',
//   'modal.files': 'ファイル',
//   'modal.share': '共有',
//   'modal.open': '開く',
//   'modal.next': '次へ',
//   'modal.prev': '前へ',
//   'modal.copied': 'リンクをコピーしました',
//   'modal.role': '役割',
//   'modal.client': 'クライアント',
//   'modal.year': '年',
//   'modal.category': '分野',
//   'modal.published': '公開日',
//   'modal.toolsTitle': '使用ツール',
//   'modal.keywords': 'キーワード',
//   'modal.attachments': 'ファイルと資料',
//   'modal.gallery': 'ギャラリー',
//   'modal.ask': 'このプロジェクトについて問い合わせる',
//   'modal.viewExternal': 'プロジェクト全体を見る',
//   'modal.notfound': 'このプロジェクトは見つかりませんでした。',
//   'modal.backToWork': '実績一覧へ戻る',
//   'modal.subject': '貴プロジェクトについて: ',

//   'contact.title': '一緒に仕事をしましょう',
//   'contact.sub': 'データ・金融・リスク分野のリモート業務やコンサルティングを承ります。1営業日以内に返信します。',
//   'contact.email': 'メール',
//   'contact.phone': '電話 / WhatsApp',
//   'contact.location': '所在地',
//   'contact.location.value': 'ジャカルタ・インドネシア（GMT+7）',
//   'contact.community': 'コミュニティ',
//   'contact.form.title': 'メッセージを書く',
//   'contact.form.name': 'お名前',
//   'contact.form.company': '会社・組織名',
//   'contact.form.topic': 'ご用件',
//   'contact.form.topic.role': '採用・ポジション',
//   'contact.form.topic.consulting': 'コンサルティング・プロジェクト',
//   'contact.form.topic.speaking': '講演・講義',
//   'contact.form.topic.other': 'その他',
//   'contact.form.message': 'メッセージ',
//   'contact.form.send': 'メールアプリで開く',
//   'contact.form.hint': '内容を入力済みの状態でメールアプリが開きます。宛先:',
//   'contact.direct': 'または直接こちらへ',
//   'contact.channels': 'メディアとチャンネル',

//   'notfound.title': 'ページが見つかりません',
//   'notfound.body': 'お探しのページは移動したか、存在しません。',
//   'notfound.back': 'ポートフォリオへ戻る',

//   'admin.notConfigured': 'このビルドには Supabase の設定がありません。VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY（GitHub → Settings → Secrets）を設定して再デプロイしてください。',
//   'modal.autoTranslated': '自動翻訳',
//   'modal.translation': '翻訳',
//   'modal.showOriginal': '原文を表示',
//   'modal.showTranslated': '翻訳を表示',
//   'modal.translating': '翻訳中…',
//   'modal.toolsHint': 'このプロジェクトで使用したツール',
//   'nav.articles': '記事',
//   'hero.request': '面談をリクエスト',
//   'hero.status': 'リモート業務 受付中',
//   'hero.card.dashboard': '予測ダッシュボード',
//   'hero.card.dashboardSub': '早期警戒モデル · 本番運用中',
//   'hero.card.accuracy': '精度',
//   'hero.card.sites': 'ダム',
//   'hero.card.formulas': 'アクチュアリー計算式',
//   'hero.card.formulasSub': '毎週使うもの',
//   'hero.card.skills': 'スキル',
//   'hero.skill.1': 'データ基盤 · Python, SQL, Airflow',
//   'hero.skill.2': '予測・機械学習',
//   'hero.skill.3': 'IFRS 17・財務分析',
//   'hero.skill.4': '責任準備金・料率・ストレステスト',
//   'hero.skill.5': 'ダッシュボード · Power BI, Looker Studio',
//   'hero.call.label': '電話・メッセージ',
//   'hero.formula.lr': '損害率',
//   'hero.formula.cl': 'チェーンラダー係数',
//   'hero.formula.ax': '一時払純保険料',
//   'hero.formula.z': '信頼度',
//   'hero.formula.var': 'バリュー・アット・リスク',
//   'work.tab.work': '実績',
//   'work.tab.articles': '記事',
//   'work.sub': 'データ・金融・リスク分野の主な実績。各案件を開くとケーススタディ全文と使用ツールを確認できます。',
//   'work.chip.all': 'すべて',
//   'articles.title': '記事',
//   'articles.sub': 'データ、アクチュアリー手法、金融に関する実務ノート。',
//   'articles.empty': '公開中の記事はまだありません。',
//   'articles.noresults': '該当する記事はありません。',
//   'articles.read': '読む',
//   'articles.minRead': '分で読めます',
//   'articles.search': '記事を検索…',
//   'articles.notfound': '記事が見つかりません。',
//   'articles.back': '記事一覧へ戻る',
//   'articles.tags': 'トピック',
//   'articles.loading': '記事を読み込み中…',
//   'articles.external': '元のサイトで読む',

//   'articles.kicker': 'ノートと記事',
//   'nav.language': '言語',
// }

// const zh: Dict = {
//   'nav.work': '作品',
//   'nav.about': '关于',
//   'nav.faq': '常见问题',
//   'nav.contact': '联系',
//   'nav.call': '预约通话',
//   'nav.menu': '菜单',
//   'nav.admin': '管理',

//   'seo.home.title': 'Faradilah Ade | 精算数据科学家 | 数据、金融与风险作品集',
//   'seo.home.desc': '雅加达精算数据科学家 Faradilah Ade 的作品集：为世界银行、保险公司和公共机构构建数据管道、预测模型、IFRS 17 财务分析与风险建模。承接远程工作与咨询项目。',
//   'seo.contact.title': '联系 Faradilah Ade | 数据、金融与风险咨询',
//   'seo.contact.desc': '数据科学、财务分析与精算风险项目，欢迎联系 Faradilah Ade。一个工作日内回复。',

//   'hero.eyebrow': '精算数据科学家 · 印度尼西亚雅加达',
//   'hero.title': '让数据成为金融与风险的决策依据。',
//   'hero.body': '我构建真正被机构使用的数据管道、财务模型与风险框架，从与世界银行合作的国家基础设施项目，到一万五千份保单的保险组合。',
//   'hero.cta': '发送邮件',
//   'hero.cta2': 'WhatsApp',
//   'hero.cta3': '查看作品',
//   'hero.available': '承接远程工作与咨询',

//   'stat.dams': '座水坝由我参与构建的国家预警系统监测',
//   'stat.accuracy': '预测准确率，已部署至生产环境',
//   'stat.policies': '份保单用于准备金评估分析',
//   'stat.members': '名成员加入我创立的精算社区',

//   'about.title': '关于',
//   'about.lead': '三个专业，一种实践。',
//   'about.proof': '世界银行合作 · 亚洲开发银行 · 苏黎世 Topas 人寿 · 印尼再保险 · 公共工程部 · 论文发表于日本精算师协会相关期刊 · 印尼最大精算社区 Anak Aktuaria 创始人',
//   'about.web': '网络主页',
//   'pillar.data.title': '数据',
//   'pillar.data.body': '基于 Python、SQL、Airflow 和 dbt 的 Google Cloud 生产级数据管道。预测模型准确率达92%，已部署于覆盖240座水坝的国家预警系统。',
//   'pillar.finance.title': '金融',
//   'pillar.finance.body': 'IFRS 17 影响分析、董事会与监管报告，以及在苏黎世 Topas 人寿将13家银行对账时间缩短70%的自动化方案。',
//   'pillar.risk.title': '风险',
//   'pillar.risk.body': '基于精算方法的准备金评估、压力测试与定价，包括关于 Tweedie GLM 的已发表研究，以及与世界银行共同开发的风险框架。',

//   'work.title': '作品',
//   'work.home': '首页',
//   'work.results': '结果',
//   'work.sortBy': '排序',
//   'sort.featured': '精选优先',
//   'sort.newest': '最新',
//   'sort.oldest': '最早',
//   'sort.az': 'A-Z',
//   'view.grid': '网格视图',
//   'view.list': '列表视图',
//   'work.viewMore': '查看更多',
//   'work.empty': '暂无已发布的项目，敬请期待。',
//   'work.noresults': '暂无符合这些筛选条件的项目。',
//   'work.search': '搜索项目、工具、关键词…',
//   'work.clear': '清除',
//   'work.read': '打开案例',
//   'work.loading': '加载中…',
//   'work.behance': 'Behance',
//   'work.behance_sub': '发布于 Behance 的视觉探索与数据叙事。',
//   'work.viewOnBehance': '在 Behance 查看',
//   'work.all': '全部作品',

//   'filter.title': '筛选',
//   'filter.year': '年份',
//   'filter.field': '领域',
//   'filter.tools': '工具',
//   'filter.client': '客户',
//   'filter.keywords': '关键词',
//   'filter.deliverables': '交付物',
//   'filter.reset': '重置筛选',
//   'filter.showAll': '显示全部',
//   'filter.showLess': '收起',
//   'filter.active': '项生效',
//   'deliverable.casestudy': '文字案例',
//   'deliverable.gallery': '图集',
//   'deliverable.files': '可下载文件',
//   'deliverable.behance': '发布于 Behance',

//   'cat.data': '数据',
//   'cat.finance': '金融',
//   'cat.risk': '风险',

//   'card.tools': '工具',
//   'card.client': '客户',
//   'card.role': '角色',
//   'card.open': '打开',
//   'card.ask': '咨询',
//   'card.new': '新',
//   'card.featured': '精选',

//   'promo.kicker': '可接洽',
//   'promo.title': '聊一聊',
//   'promo.body': '承接远程工作与咨询项目。一个工作日内回复。',
//   'promo.button': '发送邮件',

//   'faq.title': '常见问题',
//   'faq.q1': '是否接受远程或国际项目？',
//   'faq.a1': '是。我在雅加达（GMT+7）远程工作，与亚太地区及欧洲上午时段有充分的重叠，必要时也可到现场参加启动会。',
//   'faq.q2': '承接哪些类型的项目？',
//   'faq.a2': '数据管道与预测、财务分析与 IFRS 17 报告、精算准备金评估、定价与风险框架，从两周的审计到数月的搭建。',
//   'faq.q3': '使用哪些工具？',
//   'faq.a3': '数据方面使用 Python、SQL、Airflow、dbt 和 Google Cloud 上的 BigQuery；精算工作使用 R 和 Excel；报告使用 Power BI 和 Looker Studio。每个项目都列出了具体技术栈。',
//   'faq.q4': '项目通常如何开始？',
//   'faq.a4': '30分钟通话了解问题，随后提供包含范围、时间和费用的简短书面提案，然后启动，通常在一周内。',
//   'faq.q5': '是否签署保密协议并处理机密数据？',
//   'faq.a5': '是。正因如此，这里的部分项目只作概述；细节可在保密协议下分享。',
//   'faq.q6': '工作语言是什么？',
//   'faq.a6': '日常工作与文档使用英语和印尼语。本网站也提供日文和中文版本。',
//   'faq.q7': '可以看到代码、模型或报告吗？',
//   'faq.a7': '在客户允许的情况下，项目中附有示例文件。通过联系按钮告诉我，我会发送可以分享的内容。',
//   'faq.q8': '回复速度如何？',
//   'faq.a8': '一个工作日内，通常更快。紧急事项请使用 WhatsApp。',

//   'call.title': '预约通话，了解全部细节',
//   'call.name': '姓名',
//   'call.contact': '邮箱或 WhatsApp',
//   'call.button': '申请通话',
//   'call.note': '将打开您的邮件应用并自动填写请求。或直接写信至',
//   'call.subject': '通话请求',
//   'call.body': '您好 Faradilah，我想预约一次简短的通话。',

//   'footer.work': '作品',
//   'footer.about': '关于',
//   'footer.contacts': '联系方式',
//   'footer.consultation': '咨询',
//   'footer.scrollUp': '回到顶部',
//   'footer.replies': '一个工作日内回复',
//   'footer.tagline': '数据、金融与风险。为真正被使用而建。',
//   'footer.rights': '版权所有。',

//   'modal.close': '关闭',
//   'modal.contact': '联系',
//   'modal.tools': '工具',
//   'modal.files': '文件',
//   'modal.share': '分享',
//   'modal.open': '打开',
//   'modal.next': '下一个',
//   'modal.prev': '上一个',
//   'modal.copied': '链接已复制',
//   'modal.role': '角色',
//   'modal.client': '客户',
//   'modal.year': '年份',
//   'modal.category': '领域',
//   'modal.published': '发布日期',
//   'modal.toolsTitle': '使用的工具',
//   'modal.keywords': '关键词',
//   'modal.attachments': '文件与资料',
//   'modal.gallery': '图集',
//   'modal.ask': '咨询此项目',
//   'modal.viewExternal': '查看完整项目',
//   'modal.notfound': '找不到该项目。',
//   'modal.backToWork': '返回作品列表',
//   'modal.subject': '关于您的项目：',

//   'contact.title': '期待与您合作',
//   'contact.sub': '承接数据、金融与风险领域的远程工作与咨询项目。一个工作日内回复。',
//   'contact.email': '邮箱',
//   'contact.phone': '电话 / WhatsApp',
//   'contact.location': '所在地',
//   'contact.location.value': '印度尼西亚雅加达（GMT+7）',
//   'contact.community': '社区',
//   'contact.form.title': '给我留言',
//   'contact.form.name': '您的姓名',
//   'contact.form.company': '公司或组织',
//   'contact.form.topic': '关于什么？',
//   'contact.form.topic.role': '职位机会',
//   'contact.form.topic.consulting': '咨询或项目',
//   'contact.form.topic.speaking': '演讲或授课',
//   'contact.form.topic.other': '其他',
//   'contact.form.message': '留言',
//   'contact.form.send': '在邮件应用中打开',
//   'contact.form.hint': '将打开您的邮件应用并自动填写内容，收件人为',
//   'contact.direct': '或直接写信至',
//   'contact.channels': '媒体与频道',

//   'notfound.title': '页面未找到',
//   'notfound.body': '您访问的页面已移动或不存在。',
//   'notfound.back': '返回作品集',

//   'admin.notConfigured': '此构建未配置 Supabase。请设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY（GitHub → Settings → Secrets）后重新部署。',
//   'modal.autoTranslated': '自动翻译',
//   'modal.translation': '翻译',
//   'modal.showOriginal': '查看原文',
//   'modal.showTranslated': '查看译文',
//   'modal.translating': '翻译中…',
//   'modal.toolsHint': '本项目使用的工具',
//   'nav.articles': '文章',
//   'hero.request': '预约通话',
//   'hero.status': '可远程合作',
//   'hero.card.dashboard': '预测仪表板',
//   'hero.card.dashboardSub': '预警模型 · 生产环境',
//   'hero.card.accuracy': '准确率',
//   'hero.card.sites': '座水坝',
//   'hero.card.formulas': '精算公式',
//   'hero.card.formulasSub': '每周都在用',
//   'hero.card.skills': '技能',
//   'hero.skill.1': '数据管道 · Python, SQL, Airflow',
//   'hero.skill.2': '预测与机器学习',
//   'hero.skill.3': 'IFRS 17 与财务分析',
//   'hero.skill.4': '准备金、定价与压力测试',
//   'hero.skill.5': '仪表板 · Power BI, Looker Studio',
//   'hero.call.label': '通话或留言',
//   'hero.formula.lr': '赔付率',
//   'hero.formula.cl': '链梯法因子',
//   'hero.formula.ax': '净趸缴保费',
//   'hero.formula.z': '信度',
//   'hero.formula.var': '风险价值',
//   'work.tab.work': '作品',
//   'work.tab.articles': '文章',
//   'work.sub': '数据、金融与风险领域的精选作品。打开任意项目查看完整案例与所用工具。',
//   'work.chip.all': '全部',
//   'articles.title': '文章',
//   'articles.sub': '关于数据、精算方法与金融的实用笔记。',
//   'articles.empty': '暂无已发布的文章。',
//   'articles.noresults': '没有匹配的文章。',
//   'articles.read': '阅读',
//   'articles.minRead': '分钟阅读',
//   'articles.search': '搜索文章…',
//   'articles.notfound': '未找到该文章。',
//   'articles.back': '返回文章列表',
//   'articles.tags': '主题',
//   'articles.loading': '正在加载文章…',
//   'articles.external': '在原网站阅读',

//   'articles.kicker': '笔记与文章',
//   'nav.language': '语言',
// }

// export const dictionaries: Record<Lang, Dict> = { en, id, ja, zh }
/**
 * Portfolio content optimized for international / Japan-focused remote hiring.
 * Primary positioning: Remote Data Scientist & AI Engineer.
 * Secondary pathways: Data Analyst, Finance Data Analyst, AI Engineer, Data Engineer.
 * Availability wording intentionally uses: Based in Japan & Indonesia.
 */

export type Lang = 'en' | 'id' | 'ja' | 'zh'



/** `short` is what the navbar button shows; `native` and `hint` are written in that language itself. */

export const LANGS: { code: Lang; label: string; short: string; native: string; hint: string; locale: string }[] = [

  { code: 'en', label: 'English', short: 'EN', native: 'English', hint: 'Read this site in English', locale: 'en-US' },

  { code: 'id', label: 'Indonesia', short: 'ID', native: 'Bahasa Indonesia', hint: 'Baca situs ini dalam Bahasa Indonesia', locale: 'id-ID' },

  { code: 'ja', label: '日本語', short: '日本語', native: '日本語', hint: 'このサイトは日本語で表示できます', locale: 'ja-JP' },

  { code: 'zh', label: '中文', short: '中文', native: '中文（简体）', hint: '本站可以切换为中文显示', locale: 'zh-CN' },

]



type Dict = Record<string, string>



const en: Dict = {

  'nav.work': 'Work',

  'nav.about': 'About',

  'nav.faq': 'FAQ',

  'nav.contact': 'Contact',

  'nav.call': 'Contact me',

  'nav.menu': 'Menu',

  'nav.admin': 'Admin',



  'seo.home.title': 'Faradilah Ade | Remote Data Scientist & AI Engineer | Data, ML & Analytics',

  'seo.home.desc': 'Portfolio of Faradilah Ade, a remote-ready Data Scientist and AI Engineer based in Japan and Indonesia. Experienced in machine learning, predictive modeling, data engineering, data analytics, financial analytics, automation, and AI-enabled applications using Python, SQL, PostgreSQL, FastAPI, Docker, and BI tools.',

  'seo.contact.title': 'Contact Faradilah Ade | Data Scientist & AI Engineer',

  'seo.contact.desc': 'Contact Faradilah Ade for remote opportunities in Data Science, Data Analytics, Finance Data Analytics, AI Engineering, and Data Engineering.',



  'hero.eyebrow': 'Remote Data Scientist & AI Engineer · Japan & Indonesia',

  'hero.title': 'Building intelligent systems from data.',

  'hero.body': 'I build data pipelines, predictive models, machine learning applications, and analytical systems—from raw data and model development to APIs, dashboards, and production-ready workflows.',

  'hero.cta': 'View projects',

  'hero.cta2': 'Download CV',

  'hero.cta3': 'Contact me',

  'hero.available': 'Based in Japan & Indonesia · Open to remote opportunities',



  'stat.dams': 'dam sites supported by a national monitoring and early-warning workflow',

  'stat.accuracy': 'forecasting model accuracy reported in production work',

  'stat.policies': 'insurance policies analysed for actuarial and financial analytics',

  'stat.members': 'members in the actuarial community I founded',



  'about.title': 'About',

  'about.lead': 'Data, AI and analytics — from raw data to deployable systems.',

  'about.proof': 'World Bank collaboration · Asian Development Bank · Zurich Topas Life · Indonesia Re · Ministry of Public Works · Published research · Founder of Anak Aktuaria',

  'about.web': 'On the web',

  'pillar.data.title': 'Data Science',

  'pillar.data.body': 'Predictive analytics, time-series forecasting, machine learning, feature engineering, model evaluation, and data-driven decision support using Python, SQL, Pandas, Scikit-learn, and LSTM.',

  'pillar.finance.title': 'Financial Data Analytics',

  'pillar.finance.body': 'Financial reporting, IFRS 17 analytics, insurance data, reconciliation automation, SAP and Excel workflows, and BI reporting—combining technical data skills with actuarial and finance domain knowledge.',

  'pillar.risk.title': 'AI & Data Engineering',

  'pillar.risk.body': 'ETL/ELT, PostgreSQL, APIs, FastAPI, Docker, Airflow, dbt, dashboards, and deployable ML workflows connecting data preparation, models, applications, and monitoring.',



  'work.title': 'Work',

  'work.home': 'Home',

  'work.results': 'Results',

  'work.sortBy': 'Sort by',

  'sort.featured': 'Featured',

  'sort.newest': 'Newest',

  'sort.oldest': 'Oldest',

  'sort.az': 'A-Z',

  'view.grid': 'Grid view',

  'view.list': 'List view',

  'work.viewMore': 'View more',

  'work.empty': 'No projects published yet. Check back soon.',

  'work.noresults': 'Nothing matches these filters yet.',

  'work.search': 'Search projects, tools, keywords…',

  'work.clear': 'Clear',

  'work.read': 'Open case study',

  'work.loading': 'Loading work…',

  'work.behance': 'Behance',

  'work.behance_sub': 'Visual explorations and data storytelling published on Behance.',

  'work.viewOnBehance': 'View on Behance',

  'work.all': 'All work',



  'filter.title': 'Filters',

  'filter.year': 'Year',

  'filter.field': 'Field',

  'filter.tools': 'Tools',

  'filter.client': 'Client',

  'filter.keywords': 'Keywords',

  'filter.deliverables': 'Deliverables',

  'filter.reset': 'Reset filters',

  'filter.showAll': 'Show all',

  'filter.showLess': 'Show less',

  'filter.active': 'active',

  'deliverable.casestudy': 'Written case study',

  'deliverable.gallery': 'Image gallery',

  'deliverable.files': 'Downloadable files',

  'deliverable.behance': 'Published on Behance',



  'cat.data': 'Data Science',

  'cat.finance': 'Finance Analytics',

  'cat.risk': 'AI / ML & Engineering',



  'card.tools': 'Tools',

  'card.client': 'Client',

  'card.role': 'Role',

  'card.open': 'Open',

  'card.ask': 'Ask',

  'card.new': 'New',

  'card.featured': 'Featured',



  'promo.kicker': 'Open to remote roles',

  'promo.title': 'Let’s work together',

  'promo.body': 'Open to remote roles in Data Science, Data Analytics, Finance Data Analytics, AI Engineering, and Data Engineering. Based in Japan & Indonesia.',

  'promo.button': 'Email me',



  'faq.title': 'FAQ',

  'faq.q1': 'Are you available for remote work in Japan and internationally?',

  'faq.a1': 'Yes. I am based in Japan and Indonesia and open to remote opportunities with Japan-based and international teams. I can collaborate asynchronously and adjust meeting times when needed.',

  'faq.q2': 'Which roles are you open to?',

  'faq.a2': 'Data Scientist, Data Analyst, Finance Data Analyst, AI Engineer, Machine Learning Engineer, and Data Engineer roles.',

  'faq.q3': 'What are your strongest technical skills?',

  'faq.a3': 'Python, SQL, PostgreSQL, machine learning, LSTM, time-series forecasting, ETL/ELT, FastAPI, Docker, Airflow, dbt, Power BI, Tableau, Streamlit, and data automation.',

  'faq.q4': 'Can you build an ML system end-to-end?',

  'faq.a4': 'Yes. My projects cover data preparation, model development, evaluation, API development, containerization, deployment, and dashboard or application integration.',

  'faq.q5': 'Can you work with confidential data?',

  'faq.a5': 'Yes. I understand data confidentiality and can work under NDA. Public portfolio projects only expose information that can be safely shared.',

  'faq.q6': 'What is your Japanese level?',

  'faq.a6': 'Basic Japanese (JLPT N5). I am continuing to improve my Japanese while using English as my primary professional working language.',

  'faq.q7': 'Do you have finance or insurance experience?',

  'faq.a7': 'Yes. I have experience in financial data analysis, IFRS 17, insurance analytics, reserving, pricing, financial reporting, reconciliation, and automation.',

  'faq.q8': 'How do you work remotely with international teams?',

  'faq.a8': 'I use clear documentation, Git and version control, structured progress updates, async communication, and defined technical deliverables to keep distributed work reliable.',



  'call.title': 'Let’s connect',

  'call.name': 'Name',

  'call.contact': 'Email or WhatsApp',

  'call.button': 'Contact me',

  'call.note': 'Opens your email app with the request prefilled. Or write directly to',

  'call.subject': 'Call request',

  'call.body': 'Hi Faradilah, I would like to discuss a remote role or data/AI opportunity.',



  'footer.work': 'Work',

  'footer.about': 'About',

  'footer.contacts': 'Contacts',

  'footer.consultation': 'Opportunities',

  'footer.scrollUp': 'Scroll up',

  'footer.replies': 'Replies within one working day',

  'footer.tagline': 'Data · AI · Analytics · Engineering. Built to be used.',

  'footer.rights': 'All rights reserved.',



  'modal.close': 'Close',

  'modal.contact': 'Contact',

  'modal.tools': 'Tools',

  'modal.files': 'Files',

  'modal.share': 'Share',

  'modal.open': 'Open',

  'modal.next': 'Next',

  'modal.prev': 'Previous',

  'modal.copied': 'Link copied',

  'modal.role': 'Role',

  'modal.client': 'Client',

  'modal.year': 'Year',

  'modal.category': 'Field',

  'modal.published': 'Published',

  'modal.toolsTitle': 'Tools used',

  'modal.keywords': 'Keywords',

  'modal.attachments': 'Files & documents',

  'modal.gallery': 'Gallery',

  'modal.ask': 'Ask about this project',

  'modal.viewExternal': 'View full project',

  'modal.notfound': 'This project could not be found.',

  'modal.backToWork': 'Back to work',

  'modal.subject': 'About your project: ',



  'contact.title': 'Let\\'s work together',

  'contact.sub': 'Open to remote opportunities in Data Science, Data Analytics, Finance Data Analytics, AI Engineering, and Data Engineering. Based in Japan & Indonesia.',

  'contact.email': 'Email',

  'contact.phone': 'Phone / WhatsApp',

  'contact.location': 'Location',

  'contact.location.value': 'Japan & Indonesia · Remote',

  'contact.community': 'Community',

  'contact.form.title': 'Write to me',

  'contact.form.name': 'Your name',

  'contact.form.company': 'Company or organisation',

  'contact.form.topic': 'What is this about?',

  'contact.form.topic.role': 'A remote role or position',

  'contact.form.topic.consulting': 'A data or AI project',

  'contact.form.topic.speaking': 'Speaking or collaboration',

  'contact.form.topic.other': 'Something else',

  'contact.form.message': 'Message',

  'contact.form.send': 'Open in my email app',

  'contact.form.hint': 'This opens your email app with everything prefilled, addressed to',

  'contact.direct': 'Or write directly to',

  'contact.channels': 'Media & channels',



  'notfound.title': 'Page not found',

  'notfound.body': 'The page you were looking for has moved or never existed.',

  'notfound.back': 'Back to the portfolio',



  'admin.notConfigured': 'Supabase is not configured for this build. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (GitHub → Settings → Secrets) and redeploy.',

  'modal.autoTranslated': 'Auto-translated',

  'modal.translation': 'Translation',

  'modal.showOriginal': 'Show original',

  'modal.showTranslated': 'Show translation',

  'modal.translating': 'Translating…',

  'modal.toolsHint': 'Tools used in this project',

  'nav.articles': 'Articles',

  'hero.request': 'Contact me',

  'hero.status': 'Based in Japan & Indonesia',

  'hero.card.dashboard': 'Predictive ML system',

  'hero.card.dashboardSub': 'Reservoir forecasting · production workflow',

  'hero.card.accuracy': 'accuracy',

  'hero.card.sites': 'dam sites',

  'hero.card.formulas': 'Technical stack',

  'hero.card.formulasSub': 'used across data and AI projects',

  'hero.card.skills': 'Skills',

  'hero.skill.1': 'Data engineering · Python, SQL, PostgreSQL',

  'hero.skill.2': 'Machine learning · LSTM, forecasting, Scikit-learn',

  'hero.skill.3': 'AI engineering · FastAPI, Docker, model deployment',

  'hero.skill.4': 'Analytics · Power BI, Tableau, Streamlit',

  'hero.skill.5': 'Finance data · SAP, Excel, IFRS 17',

  'hero.call.label': 'call or message',

  'hero.formula.lr': 'Python / SQL',

  'hero.formula.cl': 'ML / LSTM',

  'hero.formula.ax': 'FastAPI / Docker',

  'hero.formula.z': 'ETL / Data Pipelines',

  'hero.formula.var': 'BI / Analytics',

  'work.tab.work': 'Work',

  'work.tab.articles': 'Articles',

  'work.sub': 'Selected work across Data Science, AI/ML, Data Engineering, Data Analytics, and Financial Data Analytics. Open any project for the case study and technical stack.',

  'work.chip.all': 'All',

  'articles.title': 'Articles',

  'articles.sub': 'Practical notes on data science, AI, machine learning, data engineering, analytics, and finance data.',

  'articles.empty': 'No articles published yet. Check back soon.',

  'articles.noresults': 'No articles match this search.',

  'articles.read': 'Read',

  'articles.minRead': 'min read',

  'articles.search': 'Search articles…',

  'articles.notfound': 'This article could not be found.',

  'articles.back': 'Back to articles',

  'articles.tags': 'Topics',

  'articles.loading': 'Loading articles…',

  'articles.external': 'Read on the original site',



  'articles.kicker': 'Data & AI notes',

  'nav.language': 'Language',

}



const id: Dict = {

  'nav.work': 'Karya',

  'nav.about': 'Tentang',

  'nav.faq': 'FAQ',

  'nav.contact': 'Kontak',

  'nav.call': 'Hubungi saya',

  'nav.menu': 'Menu',

  'nav.admin': 'Admin',



  'seo.home.title': 'Faradilah Ade | Remote Data Scientist & AI Engineer | Data, ML & Analytics',

  'seo.home.desc': 'Portofolio Faradilah Ade, Data Scientist dan AI Engineer yang berbasis di Jepang dan Indonesia. Berpengalaman dalam machine learning, predictive modeling, data engineering, data analytics, financial analytics, automation, dan aplikasi berbasis AI menggunakan Python, SQL, PostgreSQL, FastAPI, Docker, dan BI tools.',

  'seo.contact.title': 'Kontak Faradilah Ade | Data Scientist & AI Engineer',

  'seo.contact.desc': 'Hubungi Faradilah Ade untuk peluang remote di bidang Data Science, Data Analytics, Finance Data Analytics, AI Engineering, dan Data Engineering.',



  'hero.eyebrow': 'Remote Data Scientist & AI Engineer · Jepang & Indonesia',

  'hero.title': 'Membangun sistem cerdas dari data.',

  'hero.body': 'Saya membangun pipeline data, model prediktif, aplikasi machine learning, dan sistem analitik—mulai dari raw data dan pengembangan model hingga API, dashboard, dan workflow siap produksi.',

  'hero.cta': 'Lihat proyek',

  'hero.cta2': 'Download CV',

  'hero.cta3': 'Hubungi saya',

  'hero.available': 'Berbasis di Jepang & Indonesia · Terbuka untuk peluang remote',



  'stat.dams': 'bendungan yang didukung workflow monitoring dan peringatan dini nasional',

  'stat.accuracy': 'akurasi model forecasting yang dilaporkan dalam pekerjaan produksi',

  'stat.policies': 'polis asuransi yang dianalisis untuk analytics aktuaria dan keuangan',

  'stat.members': 'anggota komunitas aktuaria yang saya dirikan',



  'about.title': 'Tentang',

  'about.lead': 'Data, AI, dan analytics — dari raw data hingga sistem yang siap digunakan.',

  'about.proof': 'Kolaborasi World Bank · Asian Development Bank · Zurich Topas Life · Indonesia Re · Kementerian Pekerjaan Umum · Riset terpublikasi · Pendiri Anak Aktuaria',

  'about.web': 'Di internet',

  'pillar.data.title': 'Data Science',

  'pillar.data.body': 'Predictive analytics, time-series forecasting, machine learning, feature engineering, evaluasi model, dan decision support berbasis data menggunakan Python, SQL, Pandas, Scikit-learn, dan LSTM.',

  'pillar.finance.title': 'Finance Data Analytics',

  'pillar.finance.body': 'Pelaporan keuangan, analitik IFRS 17, data asuransi, otomasi rekonsiliasi, workflow SAP dan Excel, serta BI reporting—menggabungkan kemampuan data dengan domain aktuaria dan keuangan.',

  'pillar.risk.title': 'AI & Data Engineering',

  'pillar.risk.body': 'ETL/ELT, PostgreSQL, API, FastAPI, Docker, Airflow, dbt, dashboard, dan workflow ML yang menghubungkan data preparation, model, aplikasi, dan monitoring.',



  'work.title': 'Karya',

  'work.home': 'Beranda',

  'work.results': 'Hasil',

  'work.sortBy': 'Urutkan',

  'sort.featured': 'Unggulan',

  'sort.newest': 'Terbaru',

  'sort.oldest': 'Terlama',

  'sort.az': 'A-Z',

  'view.grid': 'Tampilan grid',

  'view.list': 'Tampilan daftar',

  'work.viewMore': 'Lihat lebih banyak',

  'work.empty': 'Belum ada proyek yang dipublikasikan. Silakan kembali lagi.',

  'work.noresults': 'Belum ada yang cocok dengan filter ini.',

  'work.search': 'Cari proyek, tools, kata kunci…',

  'work.clear': 'Hapus',

  'work.read': 'Buka studi kasus',

  'work.loading': 'Memuat karya…',

  'work.behance': 'Behance',

  'work.behance_sub': 'Eksplorasi visual dan data storytelling yang dipublikasikan di Behance.',

  'work.viewOnBehance': 'Lihat di Behance',

  'work.all': 'Semua karya',



  'filter.title': 'Filter',

  'filter.year': 'Tahun',

  'filter.field': 'Bidang',

  'filter.tools': 'Tools',

  'filter.client': 'Klien',

  'filter.keywords': 'Kata kunci',

  'filter.deliverables': 'Hasil kerja',

  'filter.reset': 'Reset filter',

  'filter.showAll': 'Tampilkan semua',

  'filter.showLess': 'Tampilkan lebih sedikit',

  'filter.active': 'aktif',

  'deliverable.casestudy': 'Studi kasus tertulis',

  'deliverable.gallery': 'Galeri gambar',

  'deliverable.files': 'Berkas unduhan',

  'deliverable.behance': 'Dipublikasikan di Behance',



  'cat.data': 'Data Science',

  'cat.finance': 'Finance Analytics',

  'cat.risk': 'AI / ML & Engineering',



  'card.tools': 'Tools',

  'card.client': 'Klien',

  'card.role': 'Peran',

  'card.open': 'Buka',

  'card.ask': 'Tanya',

  'card.new': 'Baru',

  'card.featured': 'Unggulan',



  'promo.kicker': 'Terbuka untuk peran remote',

  'promo.title': 'Mari bekerja sama',

  'promo.body': 'Terbuka untuk peran remote di Data Science, Data Analytics, Finance Data Analytics, AI Engineering, dan Data Engineering. Berbasis di Jepang & Indonesia.',

  'promo.button': 'Kirim email',



  'faq.title': 'FAQ',

  'faq.q1': 'Apakah Anda tersedia untuk kerja remote di Jepang dan internasional?',

  'faq.a1': 'Ya. Saya berbasis di Jepang dan Indonesia dan terbuka untuk peluang remote dengan tim berbasis Jepang maupun internasional. Saya dapat bekerja secara asynchronous dan menyesuaikan waktu meeting bila diperlukan.',

  'faq.q2': 'Posisi apa yang Anda cari?',

  'faq.a2': 'Data Scientist, Data Analyst, Finance Data Analyst, AI Engineer, Machine Learning Engineer, dan Data Engineer.',

  'faq.q3': 'Apa technical skill utama Anda?',

  'faq.a3': 'Python, SQL, PostgreSQL, machine learning, LSTM, time-series forecasting, ETL/ELT, FastAPI, Docker, Airflow, dbt, Power BI, Tableau, Streamlit, dan data automation.',

  'faq.q4': 'Apakah Anda dapat membangun sistem ML secara end-to-end?',

  'faq.a4': 'Ya. Project saya mencakup data preparation, pengembangan model, evaluasi, API development, containerization, deployment, serta integrasi dashboard atau aplikasi.',

  'faq.q5': 'Apakah Anda dapat bekerja dengan data rahasia?',

  'faq.a5': 'Ya. Saya memahami prinsip kerahasiaan data dan dapat bekerja dengan NDA. Project portfolio publik hanya menampilkan informasi yang aman untuk dibagikan.',

  'faq.q6': 'Bagaimana kemampuan bahasa Jepang Anda?',

  'faq.a6': 'Bahasa Jepang dasar (JLPT N5). Saya terus meningkatkan kemampuan bahasa Jepang dengan bahasa Inggris sebagai bahasa kerja profesional utama.',

  'faq.q7': 'Apakah Anda memiliki pengalaman finance atau insurance?',

  'faq.a7': 'Ya. Saya memiliki pengalaman dalam financial data analysis, IFRS 17, insurance analytics, reserving, pricing, financial reporting, reconciliation, dan automation.',

  'faq.q8': 'Bagaimana Anda bekerja remote dengan tim internasional?',

  'faq.a8': 'Saya menggunakan dokumentasi yang jelas, Git dan version control, progress update terstruktur, komunikasi asynchronous, serta technical deliverables yang terdefinisi.',



  'call.title': 'Mari terhubung',

  'call.name': 'Nama',

  'call.contact': 'Email atau WhatsApp',

  'call.button': 'Hubungi saya',

  'call.note': 'Membuka aplikasi email Anda dengan permintaan yang sudah terisi. Atau tulis langsung ke',

  'call.subject': 'Permintaan panggilan',

  'call.body': 'Halo Faradilah, saya ingin membahas peluang kerja remote atau kesempatan di bidang data/AI.',



  'footer.work': 'Karya',

  'footer.about': 'Tentang',

  'footer.contacts': 'Kontak',

  'footer.consultation': 'Peluang',

  'footer.scrollUp': 'Ke atas',

  'footer.replies': 'Dibalas dalam satu hari kerja',

  'footer.tagline': 'Data · AI · Analytics · Engineering. Dibangun untuk digunakan.',

  'footer.rights': 'Hak cipta dilindungi.',



  'modal.close': 'Tutup',

  'modal.contact': 'Kontak',

  'modal.tools': 'Tools',

  'modal.files': 'Berkas',

  'modal.share': 'Bagikan',

  'modal.open': 'Buka',

  'modal.next': 'Berikutnya',

  'modal.prev': 'Sebelumnya',

  'modal.copied': 'Tautan disalin',

  'modal.role': 'Peran',

  'modal.client': 'Klien',

  'modal.year': 'Tahun',

  'modal.category': 'Bidang',

  'modal.published': 'Dipublikasikan',

  'modal.toolsTitle': 'Tools yang digunakan',

  'modal.keywords': 'Kata kunci',

  'modal.attachments': 'Berkas & dokumen',

  'modal.gallery': 'Galeri',

  'modal.ask': 'Tanya tentang proyek ini',

  'modal.viewExternal': 'Lihat proyek lengkap',

  'modal.notfound': 'Proyek ini tidak ditemukan.',

  'modal.backToWork': 'Kembali ke karya',

  'modal.subject': 'Tentang proyek Anda: ',



  'contact.title': 'Mari bekerja sama',

  'contact.sub': 'Terbuka untuk peluang remote di Data Science, Data Analytics, Finance Data Analytics, AI Engineering, dan Data Engineering. Berbasis di Jepang & Indonesia.',

  'contact.email': 'Email',

  'contact.phone': 'Telepon / WhatsApp',

  'contact.location': 'Lokasi',

  'contact.location.value': 'Jepang & Indonesia · Remote',

  'contact.community': 'Komunitas',

  'contact.form.title': 'Tulis pesan',

  'contact.form.name': 'Nama Anda',

  'contact.form.company': 'Perusahaan atau organisasi',

  'contact.form.topic': 'Tentang apa?',

  'contact.form.topic.role': 'Peluang kerja remote',

  'contact.form.topic.consulting': 'Project data atau AI',

  'contact.form.topic.speaking': 'Kolaborasi atau speaking',

  'contact.form.topic.other': 'Hal lainnya',

  'contact.form.message': 'Pesan',

  'contact.form.send': 'Buka di aplikasi email',

  'contact.form.hint': 'Ini membuka aplikasi email Anda dengan pesan yang sudah terisi, ditujukan ke',

  'contact.direct': 'Atau tulis langsung ke',

  'contact.channels': 'Media & kanal',



  'notfound.title': 'Halaman tidak ditemukan',

  'notfound.body': 'Halaman yang Anda cari sudah dipindahkan atau tidak pernah ada.',

  'notfound.back': 'Kembali ke portofolio',



  'admin.notConfigured': 'Supabase belum dikonfigurasi untuk build ini. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (GitHub → Settings → Secrets) lalu deploy ulang.',

  'modal.autoTranslated': 'Terjemahan otomatis',

  'modal.translation': 'Terjemahan',

  'modal.showOriginal': 'Lihat teks asli',

  'modal.showTranslated': 'Lihat terjemahan',

  'modal.translating': 'Menerjemahkan…',

  'modal.toolsHint': 'Tools yang dipakai di proyek ini',

  'nav.articles': 'Artikel',

  'hero.request': 'Hubungi saya',

  'hero.status': 'Berbasis di Jepang & Indonesia',

  'hero.card.dashboard': 'Sistem predictive ML',

  'hero.card.dashboardSub': 'Forecasting reservoir · workflow produksi',

  'hero.card.accuracy': 'akurasi',

  'hero.card.sites': 'bendungan',

  'hero.card.formulas': 'Technical stack',

  'hero.card.formulasSub': 'digunakan dalam proyek data dan AI',

  'hero.card.skills': 'Keahlian',

  'hero.skill.1': 'Data engineering · Python, SQL, PostgreSQL',

  'hero.skill.2': 'Machine learning · LSTM, forecasting, Scikit-learn',

  'hero.skill.3': 'AI engineering · FastAPI, Docker, model deployment',

  'hero.skill.4': 'Analytics · Power BI, Tableau, Streamlit',

  'hero.skill.5': 'Finance data · SAP, Excel, IFRS 17',

  'hero.call.label': 'telepon atau pesan',

  'hero.formula.lr': 'Python / SQL',

  'hero.formula.cl': 'ML / LSTM',

  'hero.formula.ax': 'FastAPI / Docker',

  'hero.formula.z': 'ETL / Data Pipelines',

  'hero.formula.var': 'BI / Analytics',

  'work.tab.work': 'Karya',

  'work.tab.articles': 'Artikel',

  'work.sub': 'Karya terpilih di bidang Data Science, AI/ML, Data Engineering, Data Analytics, dan Financial Data Analytics. Buka proyek untuk melihat studi kasus dan technical stack.',

  'work.chip.all': 'Semua',

  'articles.title': 'Artikel',

  'articles.sub': 'Catatan praktis tentang data science, AI, machine learning, data engineering, analytics, dan finance data.',

  'articles.empty': 'Belum ada artikel yang diterbitkan. Kembali lagi nanti.',

  'articles.noresults': 'Tidak ada artikel yang cocok dengan pencarian ini.',

  'articles.read': 'Baca',

  'articles.minRead': 'menit baca',

  'articles.search': 'Cari artikel…',

  'articles.notfound': 'Artikel ini tidak ditemukan.',

  'articles.back': 'Kembali ke artikel',

  'articles.tags': 'Topik',

  'articles.loading': 'Memuat artikel…',

  'articles.external': 'Baca di situs asli',



  'articles.kicker': 'Catatan Data & AI',

  'nav.language': 'Bahasa',

}



const ja: Dict = {

  'nav.work': '実績',

  'nav.about': '紹介',

  'nav.faq': 'FAQ',

  'nav.contact': '連絡先',

  'nav.call': 'お問い合わせ',

  'nav.menu': 'メニュー',

  'nav.admin': '管理',



  'seo.home.title': 'Faradilah Ade | リモート・データサイエンティスト & AIエンジニア | Data・ML・Analytics',

  'seo.home.desc': '日本とインドネシアを拠点とする Faradilah Ade のポートフォリオ。機械学習、予測モデル、データエンジニアリング、データ分析、金融データ分析、業務自動化、AI アプリケーションの実務経験を紹介します。',

  'seo.contact.title': 'Faradilah Ade へのお問い合わせ | Data Scientist & AI Engineer',

  'seo.contact.desc': 'データサイエンス、データ分析、金融データ分析、AIエンジニアリング、データエンジニアリングのリモート求人についてお問い合わせください。',



  'hero.eyebrow': 'Remote Data Scientist & AI Engineer · 日本・インドネシア',

  'hero.title': 'データから、インテリジェントなシステムを構築する。',

  'hero.body': '生データの処理からモデル開発、API、ダッシュボード、本番運用まで、データ基盤・予測モデル・機械学習アプリケーション・分析システムを構築しています。',

  'hero.cta': 'プロジェクトを見る',

  'hero.cta2': 'CVをダウンロード',

  'hero.cta3': 'お問い合わせ',

  'hero.available': '日本・インドネシアを拠点 · リモート求人受付中',



  'stat.dams': '国家レベルの監視・早期警戒ワークフローを支援したダム',

  'stat.accuracy': '本番業務で報告した予測モデルの精度',

  'stat.policies': 'アクチュアリー・金融分析のために分析した保険契約',

  'stat.members': '創設したアクチュアリーコミュニティの会員',



  'about.title': '紹介',

  'about.lead': 'Data・AI・Analytics — 生データから実運用可能なシステムまで。',

  'about.proof': '世界銀行との協働 · アジア開発銀行 · Zurich Topas Life · Indonesia Re · 公共事業省 · 研究発表 · Anak Aktuaria 創設者',

  'about.web': 'ウェブ上で',

  'pillar.data.title': 'Data Science',

  'pillar.data.body': 'Python、SQL、Pandas、Scikit-learn、LSTMを用いた予測分析、時系列予測、機械学習、特徴量エンジニアリング、モデル評価、データドリブンな意思決定支援。',

  'pillar.finance.title': 'Financial Data Analytics',

  'pillar.finance.body': '財務報告、IFRS 17分析、保険データ、照合自動化、SAP・Excelワークフロー、BIレポート。データ技術とアクチュアリー・金融のドメイン知識を組み合わせています。',

  'pillar.risk.title': 'AI & Data Engineering',

  'pillar.risk.body': 'ETL/ELT、PostgreSQL、API、FastAPI、Docker、Airflow、dbt、ダッシュボード、本番向けMLワークフローを通じて、データ・モデル・アプリケーション・監視をつなぎます。',



  'work.title': '実績',

  'work.home': 'ホーム',

  'work.results': '件数',

  'work.sortBy': '並び替え',

  'sort.featured': '注目順',

  'sort.newest': '新しい順',

  'sort.oldest': '古い順',

  'sort.az': 'A-Z',

  'view.grid': 'グリッド表示',

  'view.list': 'リスト表示',

  'work.viewMore': 'もっと見る',

  'work.empty': 'まだ公開されたプロジェクトはありません。',

  'work.noresults': 'この条件に該当するプロジェクトはありません。',

  'work.search': 'プロジェクト・ツール・キーワードを検索…',

  'work.clear': 'クリア',

  'work.read': '事例を開く',

  'work.loading': '読み込み中…',

  'work.behance': 'Behance',

  'work.behance_sub': 'Behance に公開したビジュアル表現とデータストーリーテリング。',

  'work.viewOnBehance': 'Behance で見る',

  'work.all': 'すべての実績',



  'filter.title': 'フィルター',

  'filter.year': '年',

  'filter.field': '分野',

  'filter.tools': 'ツール',

  'filter.client': 'クライアント',

  'filter.keywords': 'キーワード',

  'filter.deliverables': '成果物',

  'filter.reset': 'フィルターをリセット',

  'filter.showAll': 'すべて表示',

  'filter.showLess': '少なく表示',

  'filter.active': '件適用中',

  'deliverable.casestudy': '事例の本文',

  'deliverable.gallery': '画像ギャラリー',

  'deliverable.files': 'ダウンロード資料',

  'deliverable.behance': 'Behance で公開',



  'cat.data': 'Data Science',

  'cat.finance': 'Finance Analytics',

  'cat.risk': 'AI / ML & Engineering',



  'card.tools': 'ツール',

  'card.client': 'クライアント',

  'card.role': '役割',

  'card.open': '開く',

  'card.ask': '相談',

  'card.new': '新着',

  'card.featured': '注目',



  'promo.kicker': 'リモート求人受付中',

  'promo.title': '一緒に働きましょう',

  'promo.body': 'Data Science、Data Analytics、Finance Data Analytics、AI Engineering、Data Engineeringのリモート求人を受付中。日本・インドネシアを拠点としています。',

  'promo.button': 'メールする',



  'faq.title': 'FAQ',

  'faq.q1': '日本および海外のリモート勤務に対応できますか？',

  'faq.a1': 'はい。日本とインドネシアを拠点としており、日本企業および国際チームのリモート求人に対応できます。非同期コミュニケーションや必要に応じた会議時間の調整も可能です。',

  'faq.q2': 'どのようなポジションを希望していますか？',

  'faq.a2': 'Data Scientist、Data Analyst、Finance Data Analyst、AI Engineer、Machine Learning Engineer、Data Engineerなどのポジションを希望しています。',

  'faq.q3': '主な技術スキルは何ですか？',

  'faq.a3': 'Python、SQL、PostgreSQL、Machine Learning、LSTM、時系列予測、ETL/ELT、FastAPI、Docker、Airflow、dbt、Power BI、Tableau、Streamlit、データ自動化です。',

  'faq.q4': 'MLシステムをエンドツーエンドで構築できますか？',

  'faq.a4': 'はい。データ準備、モデル開発、評価、API開発、コンテナ化、デプロイ、ダッシュボードやアプリケーションとの統合まで対応できます。',

  'faq.q5': '機密データを扱えますか？',

  'faq.a5': 'はい。データの機密性を理解しており、NDAのもとで業務できます。公開ポートフォリオには共有可能な情報のみ掲載しています。',

  'faq.q6': '日本語レベルはどの程度ですか？',

  'faq.a6': '初級（JLPT N5）です。日本語を継続して学習しており、専門的な業務では英語を主な業務言語として使用しています。',

  'faq.q7': '金融・保険分野の経験はありますか？',

  'faq.a7': 'はい。金融データ分析、IFRS 17、保険分析、責任準備金、プライシング、財務報告、照合、自動化の経験があります。',

  'faq.q8': '海外チームとどのようにリモートで働きますか？',

  'faq.a8': '明確なドキュメント、Git・バージョン管理、構造化された進捗共有、非同期コミュニケーション、明確な技術成果物を重視しています。',



  'call.title': 'お問い合わせください',

  'call.name': 'お名前',

  'call.contact': 'メールまたは WhatsApp',

  'call.button': 'お問い合わせ',

  'call.note': '内容を入力済みの状態でメールアプリが開きます。または直接こちらへ',

  'call.subject': '面談のご依頼',

  'call.body': 'Faradilahさん、リモート求人またはData・AI分野の機会についてご相談したいです。',



  'footer.work': '実績',

  'footer.about': '紹介',

  'footer.contacts': '連絡先',

  'footer.consultation': '求人・機会',

  'footer.scrollUp': '上へ戻る',

  'footer.replies': '1営業日以内に返信',

  'footer.tagline': 'Data · AI · Analytics · Engineering。実際に使われるシステムへ。',

  'footer.rights': 'All rights reserved.',



  'modal.close': '閉じる',

  'modal.contact': '連絡',

  'modal.tools': 'ツール',

  'modal.files': 'ファイル',

  'modal.share': '共有',

  'modal.open': '開く',

  'modal.next': '次へ',

  'modal.prev': '前へ',

  'modal.copied': 'リンクをコピーしました',

  'modal.role': '役割',

  'modal.client': 'クライアント',

  'modal.year': '年',

  'modal.category': '分野',

  'modal.published': '公開日',

  'modal.toolsTitle': '使用ツール',

  'modal.keywords': 'キーワード',

  'modal.attachments': 'ファイルと資料',

  'modal.gallery': 'ギャラリー',

  'modal.ask': 'このプロジェクトについて問い合わせる',

  'modal.viewExternal': 'プロジェクト全体を見る',

  'modal.notfound': 'このプロジェクトは見つかりませんでした。',

  'modal.backToWork': '実績一覧へ戻る',

  'modal.subject': '貴プロジェクトについて: ',



  'contact.title': '一緒に仕事をしましょう',

  'contact.sub': 'Data Science、Data Analytics、Finance Data Analytics、AI Engineering、Data Engineeringのリモート求人に対応。日本・インドネシアを拠点としています。',

  'contact.email': 'メール',

  'contact.phone': '電話 / WhatsApp',

  'contact.location': '所在地',

  'contact.location.value': '日本・インドネシア · Remote',

  'contact.community': 'コミュニティ',

  'contact.form.title': 'メッセージを書く',

  'contact.form.name': 'お名前',

  'contact.form.company': '会社・組織名',

  'contact.form.topic': 'ご用件',

  'contact.form.topic.role': 'リモート求人・ポジション',

  'contact.form.topic.consulting': 'データ・AIプロジェクト',

  'contact.form.topic.speaking': 'コラボレーション・登壇',

  'contact.form.topic.other': 'その他',

  'contact.form.message': 'メッセージ',

  'contact.form.send': 'メールアプリで開く',

  'contact.form.hint': '内容を入力済みの状態でメールアプリが開きます。宛先:',

  'contact.direct': 'または直接こちらへ',

  'contact.channels': 'メディアとチャンネル',



  'notfound.title': 'ページが見つかりません',

  'notfound.body': 'お探しのページは移動したか、存在しません。',

  'notfound.back': 'ポートフォリオへ戻る',



  'admin.notConfigured': 'このビルドには Supabase の設定がありません。VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY（GitHub → Settings → Secrets）を設定して再デプロイしてください。',

  'modal.autoTranslated': '自動翻訳',

  'modal.translation': '翻訳',

  'modal.showOriginal': '原文を表示',

  'modal.showTranslated': '翻訳を表示',

  'modal.translating': '翻訳中…',

  'modal.toolsHint': 'このプロジェクトで使用したツール',

  'nav.articles': '記事',

  'hero.request': 'お問い合わせ',

  'hero.status': '日本・インドネシアを拠点',

  'hero.card.dashboard': 'Predictive ML System',

  'hero.card.dashboardSub': '貯水池予測 · 本番ワークフロー',

  'hero.card.accuracy': '精度',

  'hero.card.sites': 'ダム',

  'hero.card.formulas': 'Technical Stack',

  'hero.card.formulasSub': 'Data・AIプロジェクトで使用',

  'hero.card.skills': 'スキル',

  'hero.skill.1': 'Data Engineering · Python, SQL, PostgreSQL',

  'hero.skill.2': 'Machine Learning · LSTM, Forecasting, Scikit-learn',

  'hero.skill.3': 'AI Engineering · FastAPI, Docker, Model Deployment',

  'hero.skill.4': 'Analytics · Power BI, Tableau, Streamlit',

  'hero.skill.5': 'Finance Data · SAP, Excel, IFRS 17',

  'hero.call.label': '電話・メッセージ',

  'hero.formula.lr': 'Python / SQL',

  'hero.formula.cl': 'ML / LSTM',

  'hero.formula.ax': 'FastAPI / Docker',

  'hero.formula.z': 'ETL / Data Pipelines',

  'hero.formula.var': 'BI / Analytics',

  'work.tab.work': '実績',

  'work.tab.articles': '記事',

  'work.sub': 'Data Science、AI/ML、Data Engineering、Data Analytics、Financial Data Analyticsの主な実績。各プロジェクトでケーススタディと技術スタックをご覧いただけます。',

  'work.chip.all': 'すべて',

  'articles.title': '記事',

  'articles.sub': 'Data Science、AI、Machine Learning、Data Engineering、Analytics、Finance Dataに関する実務ノート。',

  'articles.empty': '公開中の記事はまだありません。',

  'articles.noresults': '該当する記事はありません。',

  'articles.read': '読む',

  'articles.minRead': '分で読めます',

  'articles.search': '記事を検索…',

  'articles.notfound': '記事が見つかりません。',

  'articles.back': '記事一覧へ戻る',

  'articles.tags': 'トピック',

  'articles.loading': '記事を読み込み中…',

  'articles.external': '元のサイトで読む',



  'articles.kicker': 'Data & AI ノート',

  'nav.language': '言語',

}



const zh: Dict = {

  'nav.work': '作品',

  'nav.about': '关于',

  'nav.faq': '常见问题',

  'nav.contact': '联系',

  'nav.call': '联系我',

  'nav.menu': '菜单',

  'nav.admin': '管理',



  'seo.home.title': 'Faradilah Ade | 远程数据科学家 & AI 工程师 | Data、ML 与 Analytics',

  'seo.home.desc': 'Faradilah Ade 的作品集：以日本和印度尼西亚为基地，专注于机器学习、预测建模、数据工程、数据分析、金融数据分析、自动化和 AI 应用，并使用 Python、SQL、PostgreSQL、FastAPI、Docker 和 BI 工具。',

  'seo.contact.title': '联系 Faradilah Ade | Data Scientist & AI Engineer',

  'seo.contact.desc': '欢迎联系 Faradilah Ade，洽谈数据科学、数据分析、金融数据分析、AI 工程和数据工程的远程机会。',



  'hero.eyebrow': 'Remote Data Scientist & AI Engineer · 日本与印度尼西亚',

  'hero.title': '从数据构建智能系统。',

  'hero.body': '我构建数据管道、预测模型、机器学习应用和分析系统，从原始数据处理、模型开发到 API、仪表板和可部署的生产工作流。',

  'hero.cta': '查看项目',

  'hero.cta2': '下载 CV',

  'hero.cta3': '联系我',

  'hero.available': '常驻日本与印度尼西亚 · 开放远程机会',



  'stat.dams': '由国家级监测与预警工作流支持的水坝',

  'stat.accuracy': '生产项目中报告的预测模型准确率',

  'stat.policies': '用于精算与金融分析的保险保单',

  'stat.members': '我创立的精算社区成员',



  'about.title': '关于',

  'about.lead': 'Data、AI 与 Analytics——从原始数据到可部署系统。',

  'about.proof': '世界银行合作 · 亚洲开发银行 · Zurich Topas Life · Indonesia Re · 公共工程部 · 已发表研究 · Anak Aktuaria 创始人',

  'about.web': '网络主页',

  'pillar.data.title': 'Data Science',

  'pillar.data.body': '使用 Python、SQL、Pandas、Scikit-learn 和 LSTM 进行预测分析、时间序列预测、机器学习、特征工程、模型评估和数据驱动决策支持。',

  'pillar.finance.title': 'Financial Data Analytics',

  'pillar.finance.body': '财务报告、IFRS 17 分析、保险数据、对账自动化、SAP 与 Excel 工作流及 BI 报告，将数据技术与精算和金融领域知识结合。',

  'pillar.risk.title': 'AI & Data Engineering',

  'pillar.risk.body': '通过 ETL/ELT、PostgreSQL、API、FastAPI、Docker、Airflow、dbt、仪表板和可部署 ML 工作流连接数据、模型、应用与监控。',



  'work.title': '作品',

  'work.home': '首页',

  'work.results': '结果',

  'work.sortBy': '排序',

  'sort.featured': '精选优先',

  'sort.newest': '最新',

  'sort.oldest': '最早',

  'sort.az': 'A-Z',

  'view.grid': '网格视图',

  'view.list': '列表视图',

  'work.viewMore': '查看更多',

  'work.empty': '暂无已发布的项目，敬请期待。',

  'work.noresults': '暂无符合这些筛选条件的项目。',

  'work.search': '搜索项目、工具、关键词…',

  'work.clear': '清除',

  'work.read': '打开案例',

  'work.loading': '加载中…',

  'work.behance': 'Behance',

  'work.behance_sub': '发布于 Behance 的视觉探索与数据叙事。',

  'work.viewOnBehance': '在 Behance 查看',

  'work.all': '全部作品',



  'filter.title': '筛选',

  'filter.year': '年份',

  'filter.field': '领域',

  'filter.tools': '工具',

  'filter.client': '客户',

  'filter.keywords': '关键词',

  'filter.deliverables': '交付物',

  'filter.reset': '重置筛选',

  'filter.showAll': '显示全部',

  'filter.showLess': '收起',

  'filter.active': '项生效',

  'deliverable.casestudy': '文字案例',

  'deliverable.gallery': '图集',

  'deliverable.files': '可下载文件',

  'deliverable.behance': '发布于 Behance',



  'cat.data': 'Data Science',

  'cat.finance': 'Finance Analytics',

  'cat.risk': 'AI / ML & Engineering',



  'card.tools': '工具',

  'card.client': '客户',

  'card.role': '角色',

  'card.open': '打开',

  'card.ask': '咨询',

  'card.new': '新',

  'card.featured': '精选',



  'promo.kicker': '开放远程职位',

  'promo.title': '期待合作',

  'promo.body': '开放 Data Science、Data Analytics、Finance Data Analytics、AI Engineering 和 Data Engineering 的远程机会。常驻日本与印度尼西亚。',

  'promo.button': '发送邮件',



  'faq.title': '常见问题',

  'faq.q1': '是否可以在日本及国际团队中远程工作？',

  'faq.a1': '可以。我常驻日本与印度尼西亚，开放日本企业及国际团队的远程机会，并可通过异步协作和灵活会议时间进行跨时区合作。',

  'faq.q2': '您希望从事哪些职位？',

  'faq.a2': 'Data Scientist、Data Analyst、Finance Data Analyst、AI Engineer、Machine Learning Engineer 和 Data Engineer。',

  'faq.q3': '您的主要技术能力是什么？',

  'faq.a3': 'Python、SQL、PostgreSQL、Machine Learning、LSTM、时间序列预测、ETL/ELT、FastAPI、Docker、Airflow、dbt、Power BI、Tableau、Streamlit 和数据自动化。',

  'faq.q4': '可以端到端构建机器学习系统吗？',

  'faq.a4': '可以。项目经验覆盖数据准备、模型开发、评估、API 开发、容器化、部署以及仪表板或应用集成。',

  'faq.q5': '可以处理机密数据吗？',

  'faq.a5': '可以。我重视数据保密，并可在 NDA 下工作。公开作品集只展示可以安全分享的信息。',

  'faq.q6': '您的日语水平如何？',

  'faq.a6': '基础水平（JLPT N5）。我正在持续学习日语，专业工作主要使用英语。',

  'faq.q7': '是否有金融或保险领域经验？',

  'faq.a7': '有。包括金融数据分析、IFRS 17、保险分析、准备金评估、定价、财务报告、对账和自动化。',

  'faq.q8': '如何与国际团队进行远程协作？',

  'faq.a8': '我重视清晰的文档、Git 和版本控制、结构化进度更新、异步沟通以及明确的技术交付物。',



  'call.title': '欢迎联系我',

  'call.name': '姓名',

  'call.contact': '邮箱或 WhatsApp',

  'call.button': '联系我',

  'call.note': '将打开您的邮件应用并自动填写请求。或直接写信至',

  'call.subject': '通话请求',

  'call.body': '您好 Faradilah，我想咨询远程职位或 Data/AI 相关机会。',



  'footer.work': '作品',

  'footer.about': '关于',

  'footer.contacts': '联系方式',

  'footer.consultation': '职位机会',

  'footer.scrollUp': '回到顶部',

  'footer.replies': '一个工作日内回复',

  'footer.tagline': 'Data · AI · Analytics · Engineering。为实际使用而构建。',

  'footer.rights': '版权所有。',



  'modal.close': '关闭',

  'modal.contact': '联系',

  'modal.tools': '工具',

  'modal.files': '文件',

  'modal.share': '分享',

  'modal.open': '打开',

  'modal.next': '下一个',

  'modal.prev': '上一个',

  'modal.copied': '链接已复制',

  'modal.role': '角色',

  'modal.client': '客户',

  'modal.year': '年份',

  'modal.category': '领域',

  'modal.published': '发布日期',

  'modal.toolsTitle': '使用的工具',

  'modal.keywords': '关键词',

  'modal.attachments': '文件与资料',

  'modal.gallery': '图集',

  'modal.ask': '咨询此项目',

  'modal.viewExternal': '查看完整项目',

  'modal.notfound': '找不到该项目。',

  'modal.backToWork': '返回作品列表',

  'modal.subject': '关于您的项目：',



  'contact.title': '期待与您合作',

  'contact.sub': '开放 Data Science、Data Analytics、Finance Data Analytics、AI Engineering 和 Data Engineering 的远程机会。常驻日本与印度尼西亚。',

  'contact.email': '邮箱',

  'contact.phone': '电话 / WhatsApp',

  'contact.location': '所在地',

  'contact.location.value': '日本与印度尼西亚 · Remote',

  'contact.community': '社区',

  'contact.form.title': '给我留言',

  'contact.form.name': '您的姓名',

  'contact.form.company': '公司或组织',

  'contact.form.topic': '关于什么？',

  'contact.form.topic.role': '远程职位机会',

  'contact.form.topic.consulting': '数据或 AI 项目',

  'contact.form.topic.speaking': '合作或分享',

  'contact.form.topic.other': '其他',

  'contact.form.message': '留言',

  'contact.form.send': '在邮件应用中打开',

  'contact.form.hint': '将打开您的邮件应用并自动填写内容，收件人为',

  'contact.direct': '或直接写信至',

  'contact.channels': '媒体与频道',



  'notfound.title': '页面未找到',

  'notfound.body': '您访问的页面已移动或不存在。',

  'notfound.back': '返回作品集',



  'admin.notConfigured': '此构建未配置 Supabase。请设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY（GitHub → Settings → Secrets）后重新部署。',

  'modal.autoTranslated': '自动翻译',

  'modal.translation': '翻译',

  'modal.showOriginal': '查看原文',

  'modal.showTranslated': '查看译文',

  'modal.translating': '翻译中…',

  'modal.toolsHint': '本项目使用的工具',

  'nav.articles': '文章',

  'hero.request': '联系我',

  'hero.status': '常驻日本与印度尼西亚',

  'hero.card.dashboard': 'Predictive ML System',

  'hero.card.dashboardSub': '水库预测 · 生产工作流',

  'hero.card.accuracy': '准确率',

  'hero.card.sites': '座水坝',

  'hero.card.formulas': 'Technical Stack',

  'hero.card.formulasSub': '用于 Data 与 AI 项目',

  'hero.card.skills': '技能',

  'hero.skill.1': 'Data Engineering · Python, SQL, PostgreSQL',

  'hero.skill.2': 'Machine Learning · LSTM, Forecasting, Scikit-learn',

  'hero.skill.3': 'AI Engineering · FastAPI, Docker, Model Deployment',

  'hero.skill.4': 'Analytics · Power BI, Tableau, Streamlit',

  'hero.skill.5': 'Finance Data · SAP, Excel, IFRS 17',

  'hero.call.label': '通话或留言',

  'hero.formula.lr': 'Python / SQL',

  'hero.formula.cl': 'ML / LSTM',

  'hero.formula.ax': 'FastAPI / Docker',

  'hero.formula.z': 'ETL / Data Pipelines',

  'hero.formula.var': 'BI / Analytics',

  'work.tab.work': '作品',

  'work.tab.articles': '文章',

  'work.sub': '精选项目覆盖 Data Science、AI/ML、Data Engineering、Data Analytics 和 Financial Data Analytics。打开项目即可查看案例与技术栈。',

  'work.chip.all': '全部',

  'articles.title': '文章',

  'articles.sub': '关于 Data Science、AI、Machine Learning、Data Engineering、Analytics 与金融数据的实务笔记。',

  'articles.empty': '暂无已发布的文章。',

  'articles.noresults': '没有匹配的文章。',

  'articles.read': '阅读',

  'articles.minRead': '分钟阅读',

  'articles.search': '搜索文章…',

  'articles.notfound': '未找到该文章。',

  'articles.back': '返回文章列表',

  'articles.tags': '主题',

  'articles.loading': '正在加载文章…',

  'articles.external': '在原网站阅读',



  'articles.kicker': 'Data & AI 笔记',

  'nav.language': '语言',

}



export const dictionaries: Record<Lang, Dict> = { en, id, ja, zh }
