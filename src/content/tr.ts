import type { SiteContent } from "./types";

export const tr: SiteContent = {
  locale: "tr",
  meta: {
    title: "MeetSense | Teams toplantılarında söylenen iş, sahibiyle kayda geçer",
    description:
      "MeetSense Teams toplantınıza katılır, konuşmayı yazıya döker ve her kararı, üstlenilen her işi ve her riski sahibi ve saniyesiyle kayda geçirir.",
  },
  ui: {
    skip: "İçeriğe geç",
    menuOpen: "Menüyü aç",
    menuClose: "Menüyü kapat",
    langSwitch: { label: "English", target: "en" },
    example: "Örnek veri",
    kinds: { decision: "Karar", action: "Aksiyon", risk: "Risk" },
    noOwner: "Sorumlu yok",
    owner: "Sorumlu",
    saidBy: "Söyleyen",
    due: "Tarih",
    from: "Kaynak",
    sources: "Dayandığı kayıtlar",
    assistant: "AI Asistan",
  },
  nav: {
    links: [
      { href: "#akis", label: "Bir toplantının ömrü" },
      { href: "#sablonlar", label: "Şablonlar" },
      { href: "#kurumsal", label: "Kurumsal" },
    ],
    demo: "Demo talep et",
  },
  people: [
    { initials: "SA", name: "Selin Aydın" },
    { initials: "MK", name: "Mert Koç" },
    { initials: "AD", name: "Ayşe Demir" },
    { initials: "OY", name: "Okan Yıldız" },
  ],
  meeting: {
    title: "İzmir ofisi taşınma planı",
    date: "6 Ekim 2026, 10:00–10:40",
    platform: "Microsoft Teams",
    days: ["Pzt 5", "Sal 6", "Çar 7", "Per 8", "Cum 9"],
  },

  hero: {
    title: "Söylenen iş, sahibini bulur.",
    lead: "MeetSense Teams toplantınıza katılır ve konuşulanı yazıya döker. Alınan her karar, üstlenilen her iş ve dile getirilen her risk; kimin, ne zamana kadar ve hangi saniyede söylediğiyle kayda geçer.",
    secondary: "Bir toplantıyı baştan sona izleyin",
    railLabel: "Bu haftanın rayı",
    tickets: [
      { no: "01", kind: "decision", text: "Taşınma 14 Aralık hafta sonuna alındı", from: "10:04", owner: "SA", day: 1 },
      { no: "02", kind: "action", text: "Üç nakliye teklifini topla", from: "10:07", owner: "MK", due: "9 Eki", day: 4 },
      { no: "03", kind: "risk", text: "Sunucu odası soğutması arşiv sunucularına yetmeyebilir", from: "10:11", owner: "AD", day: 1 },
    ],
  },

  life: {
    id: "akis",
    title: "Bir toplantının ömrü",
    lead: "Bir salı sabahı, 40 dakikalık bir taşınma toplantısı. Takvimdeki davetten bir ay sonra sorulan soruya kadar, her durakta MeetSense'in ne yaptığına bakın.",
    invite: {
      id: "davet",
      time: "Sal 09:55",
      title: "Davet listesinde bir isim daha",
      text: "Toplantıyı takviminizden açıp AI Botu eklersiniz. Gündem, bağlantı ve saat aynı kalır; bot davete tek bir katılımcı olarak eklenir.",
      points: [
        "Botu tek bir toplantıya ya da tekrarlanan bir serinin tamamına eklemek sizin seçiminiz.",
        "Toplantı sahibi botu lobiden içeri almazsa MeetSense hiçbir şey kaydetmez.",
      ],
      card: {
        label: "AI Botu ekle",
        options: ["Yalnızca bu toplantı", "Tekrarlanan serinin tamamı"],
        selected: 0,
        send: "Ekle",
        lobby: "Lobide bekliyor: MeetSense AI",
      },
    },
    record: {
      id: "kayit",
      time: "Sal 10:00",
      title: "Siz konuşursunuz, not tutulur",
      text: "Bot içeri alındığı andan itibaren kimin ne söylediğini, adıyla ve saniyesiyle yazar. Toplantının akışı için kimsenin kalem tutması gerekmez.",
      points: [
        "Kayıt toplantının ortasında durdurulabilir, sonra devam ettirilebilir ya da tamamen sonlandırılabilir.",
        "Konuşma Türkçe ya da İngilizce yapılabilir; dil elle seçilebilir ya da MeetSense'e bırakılabilir.",
      ],
      status: "Kayıt sürüyor",
      lines: [
        { who: "SA", time: "10:02", text: "Kira sözleşmesi aralık sonunda bitiyor ve uzatmak istemiyoruz." },
        { who: "OY", time: "10:03", text: "Yeni binada internet hattı 1 Aralık'tan önce çekilmiyor." },
        { who: "SA", time: "10:04", text: "O hâlde karar verelim: taşınmayı 14 Aralık hafta sonuna alıyoruz." },
        { who: "MK", time: "10:07", text: "Nakliye firmalarından üç teklifi cumaya kadar ben toplarım." },
      ],
    },
    moment: {
      id: "an",
      time: "Sal 10:04",
      title: "Karar, söylendiği saniyede kayda geçer",
      text: "Konuşma devam ederken kararlar, aksiyonlar ve riskler cümlelerden ayrılır. Her kayıt kendi cümlesine ve saniyesine bağlı kalır; aylar sonra bile \"bunu kim, ne zaman söyledi?\" sorusunun cevabı bir tıklık uzaklıktadır.",
      line: { who: "SA", time: "10:04", text: "O hâlde karar verelim: taşınmayı 14 Aralık hafta sonuna alıyoruz." },
      phrase: "taşınmayı 14 Aralık hafta sonuna alıyoruz",
      ticket: { no: "01", kind: "decision", text: "Taşınma 14 Aralık hafta sonuna alındı", from: "10:04", owner: "SA" },
    },
    close: {
      id: "kapanis",
      time: "Sal 10:40",
      title: "Son katılımcı çıkınca döküm basılır",
      text: "Toplantı biter bitmez, seçilen şablonun istediği bölümlerle tek bir döküm hazırlanır. O saatte başka bir toplantıda olan biri, dökümü okuyarak kaçırdığı her şeyi yakalar.",
      points: [
        "Döküm bir bağlantı olarak iletilebilir ya da PDF dosyası olarak saklanabilir.",
        "Kimin göreceğine toplantı bazında karar verilir: katılımcılar, yalnızca siz ya da seçtiğiniz kişiler.",
      ],
      doc: {
        title: "İzmir ofisi taşınma planı",
        meta: "6 Ekim 2026, 10:00–10:40 · Microsoft Teams · 4 katılımcı",
        template: "Standart şablon",
        summaryTitle: "Özet",
        summary: "Kira sözleşmesi uzatılmayacak; internet hattı 1 Aralık'tan önce hazır olmadığı için taşınma 14 Aralık hafta sonuna alındı. Nakliye teklifleri Mert'te, ağ keşfi Okan'da. Sunucu odası soğutması arşiv sunucuları için risk. Çalışan duyurusunu henüz kimse üstlenmedi.",
        sections: { decisions: "Kararlar", actions: "Aksiyonlar", risks: "Riskler" },
        decisions: [
          { no: "01", kind: "decision", text: "Taşınma 14 Aralık hafta sonuna alındı.", from: "10:04", owner: "SA" },
          { no: "04", kind: "decision", text: "Taşınma haftasında herkes uzaktan çalışacak.", from: "10:09", owner: "SA" },
        ],
        actions: [
          { no: "02", kind: "action", text: "Üç nakliye teklifini topla", from: "10:07", owner: "MK", due: "9 Eki" },
          { no: "05", kind: "action", text: "Yeni binanın ağ keşfini yaptır", from: "10:03", owner: "OY", due: "8 Eki" },
          { no: "06", kind: "action", text: "Çalışanlara taşınma duyurusunu hazırla", from: "10:15", due: "16 Eki" },
        ],
        risks: [
          { no: "03", kind: "risk", text: "Sunucu odası soğutması arşiv sunucularına yetmeyebilir.", from: "10:11", owner: "AD" },
        ],
        share: ["Bağlantıyı kopyala", "PDF olarak indir"],
      },
    },
    followup: {
      id: "takip",
      time: "Per 14:30",
      title: "Sahipsiz iş raya asılamaz",
      text: "Üstlenilen her iş, sahibinin adı ve teslim günüyle raya asılır. Toplantıda söylenip kimsenin üzerine almadığı iş ise rayın dışında, herkesin görebileceği yerde bekler.",
      rail: [
        { no: "05", kind: "action", text: "Yeni binanın ağ keşfini yaptır", from: "10:03", owner: "OY", due: "8 Eki", day: 3 },
        { no: "02", kind: "action", text: "Üç nakliye teklifini topla", from: "10:07", owner: "MK", due: "9 Eki", day: 4 },
      ],
      stalled: { no: "06", kind: "action", text: "Çalışanlara taşınma duyurusunu hazırla", from: "10:15", due: "16 Eki" },
      stamp: "Sorumlu yok",
      note: "Okan 10:15'te dile getirdi; üzerine alan olmadı.",
    },
    weekly: {
      id: "haftalik",
      time: "Paz 20:00",
      title: "Pazar akşamı, haftanın hesabı",
      text: "Hafta kapanırken bütün toplantıların dökümü tek bir fişte toplanır: kaç saat konuşulduğu, ne kadar karar ve iş çıktığı, kaç işin hâlâ sahipsiz olduğu. Yanında geçen haftanın rakamları durur; birden çok toplantıda dönüp duran konular ayrıca yazılır.",
      report: {
        title: "Haftanın hesabı",
        period: "5–11 Ekim 2026",
        prevLabel: "geçen hafta",
        groups: [
          {
            label: "Zaman",
            rows: [
              { label: "Toplantı", value: "11", prev: "9" },
              { label: "Toplam süre", value: "7 sa 20 dk", prev: "6 sa 45 dk" },
            ],
          },
          {
            label: "Çıktı",
            rows: [
              { label: "Karar", value: "17", prev: "13" },
              { label: "Aksiyon", value: "26", prev: "23" },
            ],
          },
          {
            label: "Dikkat",
            rows: [{ label: "Sahipsiz aksiyon", value: "3", prev: "2", flag: true }],
          },
        ],
        notesTitle: "Raporun dikkat çektikleri",
        notes: [
          { tag: "Takvim riski", text: "Taşınma tarihiyle kira bitişi arasında yalnızca iki haftalık pay kalıyor.", meetings: "Taşınma planı · Tesis görüşmesi", flag: true },
          { tag: "Açık konu", text: "Yeni binadaki otopark dağılımı konuşuldu ama henüz karara bağlanmadı.", meetings: "Taşınma planı · İK haftalık" },
          { tag: "Alışkanlık", text: "Haftanın 17 kararından 6'sı toplantıların son beş dakikasında alındı.", meetings: "11 toplantının dökümü" },
        ],
      },
    },
    later: {
      id: "sonra",
      time: "3 Kas",
      title: "Bir ay sonra sorulan soru da kaynağıyla cevaplanır",
      text: "AI Asistan'a ne sorarsanız sorun, cevabı toplantılarınızda konuşulanlardan, alınan kararlardan ve açılan işlerden kurar. Cevabın altında hangi kayda ve hangi saniyeye dayandığı yazar.",
      pick: "Asistana sorulmuş örnek sorular",
      scopes: "Soru tek bir toplantıyla, bir toplantı serisiyle ya da tüm kayıtlarla sınırlanabilir.",
      qa: [
        {
          q: "Taşınma neden 14 Aralık'a alınmıştı?",
          scope: "Bu seri",
          a: "Yeni binada internet hattı 1 Aralık'tan önce çekilmediği için. 6 Ekim'deki taşınma toplantısında Selin, kira sözleşmesinin uzatılmayacağını söyledi ve tarih 14 Aralık hafta sonu olarak belirlendi.",
          sources: [
            { ref: "#01 · 10:04", label: "Karar · İzmir ofisi taşınma planı" },
            { ref: "10:03", label: "Transkript · Okan Yıldız" },
          ],
        },
        {
          q: "Çalışan duyurusunu sonunda kim hazırladı?",
          scope: "Tümü",
          a: "Duyuru 6 Ekim'de sahipsiz kaldı. 13 Ekim'deki İK haftalık toplantısında Ayşe üstlendi ve 16 Ekim'de tamamlandı olarak işaretlendi.",
          sources: [
            { ref: "#06 · 10:15", label: "Aksiyon · İzmir ofisi taşınma planı" },
            { ref: "09:12", label: "Transkript · İK haftalık, 13 Ekim" },
          ],
        },
        {
          q: "Sunucu odası soğutması için ne karar verildi?",
          scope: "Tümü",
          a: "8 Ekim'deki tesis görüşmesinde ek bir soğutma ünitesi kiralanmasına karar verildi; arşiv sunucuları ünite kurulduktan sonra, taşınmadan bir hafta sonra taşınacak.",
          sources: [
            { ref: "#03 · 10:11", label: "Risk · İzmir ofisi taşınma planı" },
            { ref: "14:26", label: "Karar · Tesis görüşmesi, 8 Ekim" },
          ],
        },
      ],
    },
  },

  templates: {
    id: "sablonlar",
    title: "Toplantının türü, dökümün biçimini belirler",
    lead: "Satış görüşmesinden deal skoru, aday görüşmesinden değerlendirme kartı, sabah toplantısından engeller listesi çıkar. Toplantıya şablon seçilmediyse sizin belirlediğiniz varsayılan kullanılır.",
    honest: "Konuşma seçilen şablonla örtüşmüyorsa MeetSense boşlukları tahminle doldurmaz; uyuşmazlığı ve eksik kalan bilgiyi açıkça yazar.",
    custom: "Kendi toplantı türleriniz için bölümleri tek tek seçerek yeni şablon oluşturabilir, mevcut bir şablonu çoğaltıp değiştirebilir ya da ekibinizin varsayılanı yapabilirsiniz.",
    specimens: [
      {
        name: "Standart",
        purpose: "Her toplantı için",
        heading: "Özet, öne çıkanlar, kararlar, aksiyonlar",
        rows: [
          { label: "Karar", value: "2" },
          { label: "Aksiyon", value: "3" },
          { label: "Sahipsiz", value: "1" },
        ],
        flag: "Sahipsiz işler ayrı satırda",
        footer: "Bağlantı ya da PDF",
      },
      {
        name: "Müşteri Yönetimi",
        purpose: "Satış görüşmeleri",
        heading: "Deal skoru 72/100",
        rows: [
          { label: "Bütçe", value: "Net" },
          { label: "Yetki", value: "Net" },
          { label: "İhtiyaç", value: "Net" },
          { label: "Zaman", value: "Belirsiz" },
        ],
        flag: "Cevapsız itiraz: kurulum süresi",
        footer: "Bölümler CRM'e hazır metin",
      },
      {
        name: "Mülakat",
        purpose: "Aday görüşmeleri",
        heading: "AI önerisi: Beklet",
        rows: [
          { label: "Tür", value: "Teknik" },
          { label: "Kriter", value: "5 başlık" },
          { label: "Ücret", value: "Bütçe içinde" },
        ],
        flag: "Geçiştirilen soru işaretli",
        footer: "Karar panelde kalır · PDF",
      },
      {
        name: "Günlük Takip",
        purpose: "Ekip toplantıları",
        heading: "Dün, bugün, engel",
        rows: [
          { label: "Kişi", value: "6" },
          { label: "Engel", value: "2" },
        ],
        footer: "Kişi başına üç satır",
      },
    ],
  },

  enterprise: {
    id: "kurumsal",
    title: "Microsoft 365'inize yeni bir şey eklemeden",
    lead: "Ekibin açacağı yeni bir hesap, öğreneceği yeni bir ekran yok. MeetSense şirketinizin zaten kullandığı Microsoft düzeninin içinde çalışır.",
    items: [
      { label: "Giriş", value: "Herkes şirketteki Microsoft hesabıyla girer. İsteyen MeetSense'i doğrudan Teams'in içinden kullanır." },
      { label: "Takvim", value: "Bulut takvimleri Microsoft Graph ile, şirket içinde çalışan Exchange sunucuları EWS ile bağlanır." },
      { label: "Görünürlük", value: "Bir toplantının dökümünü kimin açabileceği toplantı toplantı ayarlanır." },
      { label: "Kanallar", value: "Aynı projenin ya da ekibin toplantıları bir kanalda birikir; kanaldaki herkes paylaşılanlara ulaşır." },
      { label: "Paylaşım", value: "Dökümler bağlantıyla iletilir ya da PDF olarak dışa aktarılır." },
      { label: "Dil", value: "Konuşma dili, arayüz dili ve dökümün dili birbirinden bağımsız seçilir." },
    ],
  },

  demo: {
    id: "demo",
    title: "Bir sonraki toplantınızı birlikte izleyelim",
    lead: "Kendi ekibinizin gerçek bir toplantısında MeetSense'in neyi, kimin adına kayda geçirdiğini birlikte görelim.",
    formTitle: "Demo talebi",
    fields: { name: "Ad soyad", email: "İş e-postası", company: "Şirket", message: "Not", optional: "isteğe bağlı" },
    placeholders: {
      name: "Adınız ve soyadınız",
      email: "ad.soyad@sirket.com",
      company: "Şirketinizin adı",
      message: "Ekip büyüklüğü, toplantı türleri ya da uygun zamanlar",
    },
    errors: {
      name: "Adınızı yazın.",
      email: "Geçerli bir iş e-postası yazın, örneğin ad.soyad@sirket.com.",
      company: "Şirketinizin adını yazın.",
    },
    submit: "Demo talebini gönder",
    sending: "E-posta hazırlanıyor",
    success: "Talebiniz e-posta uygulamanızda hazır. Gönder'e bastığınızda ekibimize ulaşır.",
    direct: "Doğrudan yazmak isterseniz",
    mailSubject: "MeetSense demo talebi",
    note: "Form, bilgilerinizi e-posta uygulamanızda hazır bir mesaja dönüştürür.",
  },

  footer: { contact: "İletişim", rights: "© 2026 BGTS" },
};
