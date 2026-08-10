import type { SiteContent } from "./types";

export const trContent: SiteContent = {
  meta: {
    title: "MeetSense | Yapay Zeka Toplantı Asistanı",
    description:
      "Kurumsal ekipler için otomatik katılım, canlı transkript, AI analiz ve iş takip araçları entegrasyonu sunan akıllı toplantı platformu.",
    ogTitle: "MeetSense — Toplantılarınızı yapay zekânın gücüyle dönüştürün",
    ogDescription:
      "Otomatik katılım, canlı transkript, Jira ve Trello entegrasyonu ile kurumsal hafıza oluşturun.",
  },
  nav: [
    { id: "intro", label: "Nedir" },
    { id: "transcript", label: "Transkript" },
    { id: "lifecycle", label: "Yaşam Döngüsü" },
    { id: "features", label: "Yetenekler" },
    { id: "use-cases", label: "Senaryolar" },
    { id: "value", label: "Değer" },
  ],
  hero: {
    eyebrow: "Yapay Zeka Toplantı Asistanı",
    title: "Toplantılarınızı yapay zekânın gücüyle dönüştürün",
    subtitle:
      "Otomatik katılım, canlı transkript, AI analiz ve iş takip araçları entegrasyonu ile toplantılarınızı net aksiyonlara dönüştürün.",
    badges: [
      "Otomatik katılım",
      "Canlı transkript",
      "Jira & Trello",
      "Kurumsal hafıza",
    ],
    ctaPrimary: "Demo planlayın",
    ctaSecondary: "Akışı keşfet",
    scrollHint: "Aşağı kaydır",
  },
  intro: {
    label: "MeetSense Nedir",
    title: "Konuşmaları netliğe kavuşturun — sözde kalmasın, işe dönüşsün",
    subtitle:
      "Takvimden analize kadar her adım otomatik yönetilir. MeetSense toplantılarınızı kaydeder, anlar ve aksiyona dönüştürür.",
    steps: [
      {
        id: "join",
        title: "Katılır",
        description:
          "Google Calendar ve Microsoft Outlook entegrasyonu ile planlanmış toplantılarınızı otomatik tespit eder. Belirlediğiniz kurallara göre sanal asistan görüşmeye dahil olur.",
        highlights: [
          "Takvim senkronizasyonu ile otomatik toplantı tespiti",
          "Kural bazlı veya manuel bot tetikleme",
          "Teams, Zoom ve Google Meet uyumluluğu",
        ],
      },
      {
        id: "record",
        title: "Kaydeder",
        description:
          "Toplantı boyunca yüksek kaliteli ses kaydı alır. Konuşulan hiçbir detay kaybolmaz; tüm içerik güvenli altyapıda saklanır.",
        highlights: [
          "Kurumsal düzeyde ses kalitesi",
          "Kesintisiz ve güvenli kayıt altyapısı",
          "Toplantı süresince tam kapsama",
        ],
      },
      {
        id: "transcribe",
        title: "Transkript Oluşturur",
        description:
          "Speaker Diarization teknolojisi ile kimin ne söylediğini ayırır, konuşmayı aranabilir metne dönüştürür ve doğruluk skoru sunar.",
        highlights: [
          "Konuşmacı bazlı ayrım (diarization)",
          "Segment bazlı ses dinleme desteği",
          "Doğruluk skoru ve düzenleme geçmişi",
        ],
      },
      {
        id: "analyze",
        title: "Analiz Eder",
        description:
          "Yapay zeka motoru transkriptten kararları, aksiyon maddelerini, sorumluları ve riskleri otomatik çıkarır; Jira ve Trello'ya aktarır.",
        highlights: [
          "Aksiyon, karar ve risk tespiti",
          "Toplantı türüne göre analiz şablonları",
          "Jira, Trello ve Azure DevOps entegrasyonu",
        ],
      },
    ],
  },
  transcript: {
    label: "Canlı Transkript",
    title: "Her sözün sahibi belli, her karar izlenebilir",
    subtitle:
      "Speaker diarization ile konuşmacı ayrımı, segment bazlı dinleme ve AI aksiyon çıkarımı tek ekranda.",
    lines: [
      {
        speaker: "Ayşe",
        speakerColor: "#5b5fc7",
        text: "Sprint hedeflerimizde API entegrasyonu gecikiyor. Jira'da durumu güncellememiz lazım.",
      },
      {
        speaker: "Mehmet",
        speakerColor: "#6bb700",
        text: "Geçen hafta karar almıştık: OAuth akışını önceleyeceğiz. Dokümantasyon eksik kaldı.",
      },
      {
        speaker: "Ayşe",
        speakerColor: "#5b5fc7",
        text: "Mehmet, OAuth dokümantasyonunu Cuma'ya kadar tamamlayabilir misin?",
        highlight: true,
        highlightLabel: "Aksiyon",
      },
      {
        speaker: "Mehmet",
        speakerColor: "#6bb700",
        text: "Evet, Cuma 17:00 öncesi teslim ederim. QA ekibine de haber veririm.",
        highlight: true,
        highlightLabel: "Sorumlu + Tarih",
      },
      {
        speaker: "Zeynep",
        speakerColor: "#00bcf2",
        text: "Risk: Entegrasyon testleri için staging ortamı hazır değil. Bu hafta çözülmeli.",
        highlight: true,
        highlightLabel: "Risk",
      },
    ],
    actionTitle: "AI tarafından çıkarılan aksiyonlar",
    actionItems: [
      "OAuth dokümantasyonu — Mehmet — Cuma 17:00",
      "Jira ticket güncelleme — Ayşe — Bugün",
      "Staging ortamı hazırlığı — DevOps — Bu hafta",
    ],
  },
  lifecycle: {
    label: "Toplantı Yaşam Döngüsü",
    title: "Başlangıçtan tamamlanmaya kadar uçtan uca hat",
    subtitle:
      "Takvimden iş takip araçlarına uzanan otomatik orkestrasyon.",
    phases: [
      "Planlandı",
      "Bot Katılıyor",
      "Kayıt Ediliyor",
      "İşleniyor",
      "Tamamlandı",
    ],
    groupLabels: {
      trigger: "Tetikleyici",
      core: "Çekirdek",
      output: "Çıktı",
      integration: "Entegrasyon",
    },
    flowHint: "Akışı keşfetmek için bir faz veya düğüme tıklayın",
    playLabel: "Akışı oynat",
    pauseLabel: "Duraklat",
    stepLabel: "Adım",
    nodes: [
      {
        id: "calendar",
        title: "Takvim",
        description: "Toplantı otomatik tespit edilir",
        group: "trigger",
      },
      {
        id: "manual",
        title: "Manuel Tetik",
        description: "Tek tıkla bot kontrolü",
        group: "trigger",
      },
      {
        id: "bot",
        title: "Bot Katılır",
        description: "Sanal asistan görüşmeye dahil olur",
        group: "core",
      },
      {
        id: "record",
        title: "Ses Kaydı",
        description: "Yüksek kaliteli kayıt başlar",
        group: "core",
      },
      {
        id: "meetsense",
        title: "MeetSense",
        description: "Merkezi işleme platformu",
        group: "core",
      },
      {
        id: "assistant",
        title: "Sesli Asistan",
        description: "Canlı soru-cevap desteği",
        group: "core",
      },
      {
        id: "transcript",
        title: "AI Transkript",
        description: "Metin + doğruluk skoru",
        group: "output",
      },
      {
        id: "diarization",
        title: "Konuşmacı Ayrımı",
        description: "Her sözün sahibi net",
        group: "output",
      },
      {
        id: "analysis",
        title: "Analiz Motoru",
        description: "Karar, aksiyon, risk çıkarımı",
        group: "output",
      },
      {
        id: "jira",
        title: "Jira",
        description: "Otomatik ticket oluşturma",
        group: "integration",
      },
      {
        id: "trello",
        title: "Trello",
        description: "Kart ve atama",
        group: "integration",
      },
      {
        id: "azure",
        title: "Azure DevOps",
        description: "İş maddesi ekleme",
        group: "integration",
      },
      {
        id: "dashboard",
        title: "Dashboard",
        description: "Rapor ve içgörüler",
        group: "integration",
      },
    ],
  },
  features: {
    label: "Yetenekler",
    title: "Sadece kayıt tutmanın ötesinde akıllı özellikler",
    subtitle:
      "Toplantı yönetiminden kurumsal hafızaya kadar tam kapsamlı yetenek seti.",
    selectHint: "Detayları keşfetmek için bir yetenek seçin",
    highlightsLabel: "Öne çıkanlar",
    prevLabel: "Önceki",
    nextLabel: "Sonraki",
    categoryLabels: {
      meeting: "Toplantı",
      transcription: "Transkript",
      assistant: "Asistan",
      analytics: "Analiz",
    },
    demoLabels: {
      bot: "Bot",
      question: "Soru",
      answer: "Cevap",
    },
    demos: {
      "smart-meeting": {
        events: [
          { time: "09:00", title: "Sprint Planlama" },
          { time: "11:30", title: "Ürün Değerlendirme", hasBot: true },
          { time: "14:00", title: "1:1 Görüşme" },
        ],
      },
      "auto-join": {
        buttonLabel: "Botu Başlat",
        statusLabel: "Görüşmeye katılıyor…",
      },
      diarization: {
        speakers: [
          { name: "Ayşe", text: "Sprint hedeflerini netleştirelim." },
          { name: "Mehmet", text: "Backend tarafı hazır durumda." },
          { name: "Zeynep", text: "UI revizyonu Cuma'ya yetişir." },
        ],
      },
      "segment-audio": {
        lines: [
          "Toplantı on dörtte başlayacak.",
          "Aksiyon maddelerini Jira'ya aktaralım.",
          "Sonraki sprint için kapasiteyi gözden geçirelim.",
        ],
      },
      accuracy: {
        auditLog: [
          { user: "Ayşe K.", action: "Düzenleme", time: "14:32" },
          { user: "Sistem", action: "Otomatik", time: "14:28" },
        ],
      },
      "voice-assistant": {
        question: "Geçen sprint'te deployment kararı neydi?",
        answer: "Cuma deploy kararı alındı, Mehmet sorumlu.",
      },
      chatbot: {
        messages: [
          { role: "user", text: "Son product review'da hangi riskler konuşuldu?" },
          { role: "bot", text: "3 risk tespit edildi: API gecikmesi, kapasite, entegrasyon." },
        ],
      },
      templates: {
        templates: ["Sprint", "Satış", "Mülakat", "1:1"],
        templateSections: ["Kararlar", "Aksiyonlar", "Riskler"],
      },
      insights: {
        weekDays: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      },
    },
    items: [
      {
        id: "smart-meeting",
        title: "Akıllı toplantı yönetimi",
        description:
          "Takviminizi okur, kurala göre katılır; hiçbir toplantıyı kaçırmayın.",
        longDescription:
          "Google Calendar ve Microsoft Outlook entegrasyonu ile planlanmış toplantılarınız otomatik tespit edilir. Kural motoru hangi görüşmelere bot katılacağını siz belirlersiniz.",
        highlights: [
          "Takvim senkronizasyonu ile otomatik tespit",
          "Kural bazlı katılım politikaları",
          "Teams, Zoom ve Google Meet desteği",
        ],
        category: "meeting",
      },
      {
        id: "auto-join",
        title: "Siz olmadan da katılım",
        description:
          "Tek tıkla bot kontrolü; katılım şekli ayarı ile siz olmadan da kayıt.",
        longDescription:
          "Manuel tetikleme veya otomatik kurallarla botu istediğiniz görüşmeye yönlendirin. Katılım şeklini özelleştirerek kayıt sürecini tamamen otonom hale getirin.",
        highlights: [
          "Tek tıkla manuel bot tetikleme",
          "Katılım şekli ve görünürlük ayarları",
          "Toplantı başlamadan önce hazır bekleme",
        ],
        category: "meeting",
      },
      {
        id: "diarization",
        title: "Konuşmacı bazlı ayrım",
        description:
          "Speaker Diarization ile kimin ne dediği net biçimde ayrıştırılır.",
        longDescription:
          "Yapay zeka her konuşmacıyı otomatik tanır ve transkriptte etiketler. Karışık toplantılarda bile her cümlenin sahibi bellidir.",
        highlights: [
          "Otomatik konuşmacı tanıma",
          "Çoklu katılımcı desteği",
          "Konuşmacı renk kodlaması",
        ],
        category: "transcription",
      },
      {
        id: "segment-audio",
        title: "Segment bazlı ses dinleme",
        description:
          "Transkripte tıklayın, ilgili ses kaydını anında dinleyin.",
        longDescription:
          "Her transkript satırı ilgili ses segmentine bağlıdır. Şüpheli bir ifadeyi doğrulamak için tek tıkla o anın kaydını dinleyin.",
        highlights: [
          "Satır bazlı ses oynatma",
          "Zaman damgası senkronizasyonu",
          "Hızlı doğrulama akışı",
        ],
        category: "transcription",
      },
      {
        id: "accuracy",
        title: "Doğruluk skoru & tam iz kaydı",
        description:
          "Güvenilirlik puanı; kim, ne zaman düzenledi — değişiklik geçmişi tutulur.",
        longDescription:
          "AI transkript güvenilirlik skoru sunar. Yapılan her düzenleme kayıt altına alınır; kurumsal denetim ve uyumluluk için tam izlenebilirlik sağlar.",
        highlights: [
          "Güvenilirlik puanı göstergesi",
          "Düzenleme geçmişi ve sorumlu takibi",
          "Denetim uyumlu kayıt tutma",
        ],
        category: "transcription",
      },
      {
        id: "voice-assistant",
        title: "Sesli asistan",
        description:
          "Toplantı devam ederken sesli soru sorun; geçmiş veri ve canlı transkript taranır.",
        longDescription:
          "Toplantı sırasında sesli komutlarla geçmiş kararlara, aksiyon maddelerine veya belirli konulara anında erişin. Asistan canlı transkript ve kurumsal hafızayı tarar.",
        highlights: [
          "Canlı toplantıda sesli sorgu",
          "Geçmiş veri ve transkript taraması",
          "Anlık doküman paylaşımı",
        ],
        category: "assistant",
      },
      {
        id: "chatbot",
        title: "MeetSense Chatbot",
        description:
          "Verilerinizle doğal dilde konuşun; tekil toplantı veya kanal bazında sorgu.",
        longDescription:
          "Toplantı sonrası veya öncesinde chatbot ile tüm transkript ve analizlere doğal dilde soru sorun. Tek bir görüşme veya tüm kanal geçmişi üzerinde arama yapın.",
        highlights: [
          "Doğal dilde sorgulama",
          "Toplantı veya kanal bazlı kapsam",
          "Kaynak gösterimli cevaplar",
        ],
        category: "assistant",
      },
      {
        id: "templates",
        title: "Analiz şablonları",
        description:
          "Sprint, satış, mülakat veya birebir için hazır şablonlar; özel kriterlerle kendi şablonunuzu oluşturun.",
        longDescription:
          "Toplantı türüne göre hazır analiz şablonları seçin veya kendi kriterlerinizi tanımlayın. Her çıktı aynı yapıda üretilir; karşılaştırma ve raporlama kolaylaşır.",
        highlights: [
          "Sprint, satış, mülakat şablonları",
          "Özel kriter tanımlama",
          "Tutarlı çıktı yapısı",
        ],
        category: "analytics",
      },
      {
        id: "insights",
        title: "Organizasyonel içgörüler",
        description:
          "Haftalık özetler, trend analizi ve risk tespiti — büyük resmi görün.",
        longDescription:
          "Ekip ve organizasyon düzeyinde haftalık özetler, karar trendleri ve risk sinyalleri otomatik çıkarılır. Yönetim panosu ile büyük resmi tek bakışta görün.",
        highlights: [
          "Haftalık otomatik özetler",
          "Karar ve risk trend analizi",
          "Yönetim panosu görünümü",
        ],
        category: "analytics",
      },
    ],
  },
  useCases: {
    label: "Kullanım Senaryoları",
    title: "Nerede değer üretir?",
    subtitle: "Problem, akış ve sonuç yapısıyla somut iş değeri.",
    caseLabels: {
      problem: "Problem",
      flow: "Akış",
      result: "Sonuç",
    },
    items: [
      {
        id: "action-tracking",
        title: "Aksiyon takibi & iş entegrasyonu",
        problem:
          "Toplantıda alınan kararlar sözde kalır; kim, ne zaman yapacak belirsizdir.",
        flow: "AI aksiyonu, sorumluyu, önceliği ve son tarihi transkriptten çıkarır, Jira/Trello ticket'ına dönüştürür.",
        result: "Her karar otomatik olarak atanmış bir iş maddesine dönüşür.",
      },
      {
        id: "live-info",
        title: "Toplantı anında bilgi",
        problem:
          '"Geçen sprint\'te bu konuda ne karar almıştık?" sorusu toplantıyı yavaşlatır.',
        flow: "Sesli asistana sorun; geçmiş veriler ve canlı transkript taranır, cevap doküman olarak paylaşılır.",
        result: "Anlık analiz ve geçmiş veri, toplantıyı bölmeden elinizin altında.",
      },
      {
        id: "memory",
        title: "Kurumsal hafıza",
        problem:
          "Toplantı bilgisi kişilerin notlarında dağınık; ayrılan çalışanla bilgi kaybolur.",
        flow: "Chatbot tamamlanan her toplantının transkriptini ve AI analizini kaynak olarak kullanır.",
        result: "Toplantılar aranabilir, kalıcı kurumsal hafızaya dönüşür.",
      },
      {
        id: "templates",
        title: "Şablonlarla standart analiz",
        problem:
          "Her toplantı farklı biçimde özetlenir; çıktılar karşılaştırılamaz.",
        flow: "Toplantı türüne uygun şablon seçilir; AI analizi her toplantıda aynı başlık yapısında üretir.",
        result: "Tüm toplantı çıktıları standart, karşılaştırılabilir ve eksiksiz hale gelir.",
      },
      {
        id: "visibility",
        title: "Yönetici görünürlüğü",
        problem:
          "Çok sayıda toplantının büyük resmi — kararlar, gecikmeler, trendler — görünmezdir.",
        flow: "Dashboard toplantı, karar ve aksiyon sayılarını tek bakışta sunar; risk analizi gecikmiş aksiyonları çıkarır.",
        result: "Ekip üretkenliği kuş bakışı izlenir; riskler erken yakalanır.",
      },
    ],
  },
  videoShowcase: {
    label: "Ürün Vitrini",
    title: "MeetSense'i çalışırken görün",
    subtitle:
      "Ürün ekran kayıtları ve tanıtım videoları burada yer alır.",
    stats: [
      { id: "meetings", value: 10000, suffix: "+", label: "İşlenen toplantı" },
      { id: "hours", value: 50000, suffix: "+", label: "Transkript saati" },
      { id: "actions", value: 25000, suffix: "+", label: "Çıkarılan aksiyon" },
      { id: "integrations", value: 15, suffix: "+", label: "Entegrasyon" },
    ],
  },
  value: {
    label: "İş Değeri",
    title: "MeetSense'in size kattığı değer",
    subtitle: "Operasyonel verimlilikten kurumsal hafızaya kadar ölçülebilir etki.",
    items: [
      {
        id: "time",
        title: "Zaman Tasarrufu",
        description: "Not alma ve rapor yazma süreleri ortadan kalkar.",
      },
      {
        id: "security",
        title: "Güvenli İçerik",
        description: "Hassas içerikler sadece yetkili kişilere ulaşır.",
      },
      {
        id: "tracking",
        title: "Aksiyon Takibi",
        description: "Her karar kaydedilir, sorumlu atanır ve takip edilir.",
      },
      {
        id: "analysis",
        title: "Derin Analiz",
        description: "Riskler ve açık konular otomatik tespit edilir.",
      },
      {
        id: "nlp",
        title: "Doğal Dil Sorgusu",
        description: "Okumak yerine soru sorun, anında cevap alın.",
      },
      {
        id: "trends",
        title: "Trend & Pattern",
        description: "Çoklu toplantı verilerinden trendleri yakalayın.",
      },
    ],
  },
  cta: {
    label: "İletişim",
    title: "Kendi iş akışınızı MeetSense'te görün",
    subtitle:
      "30 dakikalık bir demoda, toplantılarınızı canlı olarak MeetSense ile otomatize edelim.",
    primary: "Demo planlayın",
    secondary: "Satış ekibiyle iletişime geçin",
    emailLabel: "İş e-postası",
    emailPlaceholder: "ornek@sirket.com",
    companyLabel: "Şirket",
    companyPlaceholder: "Şirket adı",
    submit: "Talep gönder",
    successMessage: "Talebiniz alındı — en kısa sürede dönüş yapacağız.",
    footerNote: "Verileriniz güvenle işlenir. KVKK uyumlu altyapı.",
  },
  ui: {
    skipToContent: "İçeriğe geç",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    themeToLight: "Açık temaya geç",
    themeToDark: "Koyu temaya geç",
  },
  footer: {
    brand: "MeetSense",
    tagline: "BGTS AI ürün ailesi",
    rights: "Tüm hakları saklıdır.",
  },
};
