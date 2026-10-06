# MeetSense — Landing page

Microsoft Teams için yapay zekâ toplantı asistanı MeetSense'in satış / demo mikro sitesi.
Derleme adımı yoktur: düz HTML, CSS ve JavaScript. Herhangi bir statik sunucuda (Vercel, Netlify, Azure Static Web Apps, IIS, nginx) olduğu gibi yayınlanabilir.

## Yerelde açmak

Videoların ve 3D sahnenin çalışması için dosyayı doğrudan çift tıklamak yerine küçük bir sunucuyla açın:

```bash
cd MeetSense-Landingpage
python -m http.server 8080
# ya da: npx serve .
```

Sonra tarayıcıda `http://localhost:8080` adresini açın.

## Klasör yapısı

```
index.html                 Sayfa iskeleti (Türkçe metinler varsayılan olarak içinde)
assets/css/styles.css      Tüm stiller (renk ve font değişkenleri :root içinde)
assets/js/i18n.js          TR / EN metinleri
assets/js/config.js        Video ve iletişim ayarları
assets/js/main.js          Etkileşimler: dil, canlı kayıt alanı, sekmeler, şablonlar, asistan, form, videolar
assets/js/orb.js           Three.js sahneleri: hero ses küresi ve 3D logo
assets/vendor/three.min.js Three.js r159
assets/img/                Logo ve video kapak görselleri
assets/video/              MP4 videolar
```

## Dil

- Varsayılan dil Türkçe. Sağ üstteki TR / EN düğmesiyle değişir; seçim tarayıcıda hatırlanır.
- Bağlantıyla dil seçmek için: `?lang=en`
- Yeni dil eklemek için `assets/js/i18n.js` içine aynı yapıda yeni bir nesne (ör. `de`) ekleyin ve `index.html` içindeki dil düğmelerine bir düğme ekleyin.

## Videolar

Videolar sayfanın içinde oynatılır. `assets/js/config.js` içinde her video için:

- `youtubeId` doluysa video **YouTube oynatıcısıyla** (youtube-nocookie.com) sayfanın içinde açılır.
- `youtubeId` boşsa `assets/video/` içindeki **MP4** dosyası oynatılır.

YouTube kimliği, video linkindeki `v=` değeridir: `https://www.youtube.com/watch?v=XXXXXXXXXXX` → `"XXXXXXXXXXX"`.

| Kimlik | Video | Sayfadaki yeri |
|---|---|---|
| a1 | A1 · MeetSense nedir (1:15) | Hero düğmesi + Videolar bölümü |
| a2 | A2 · Teaser 9:16 (0:13) | Videolar bölümü, telefon çerçevesi |
| b1 | B1 · Üç adımda nasıl çalışır (0:58) | Nasıl çalışır |
| d1 | D1 · Müşteri Yönetimi şablonu (0:53) | Şablonlar → Müşteri Yönetimi |
| d2 | D2 · Mülakat şablonu (0:53) | Şablonlar → Mülakat |
| e1 | E1 · Microsoft altyapısı (0:52) | Kurumsal |

## Demo formu

Form, bilgileri `config.js` içindeki `demoEmail` adresine (varsayılan `hello@bgts.ai`) gönderilmeye hazır bir e-posta olarak açar. Bir form servisi ya da CRM bağlanacaksa `main.js` içindeki `demo-form` `submit` olayını değiştirmek yeterlidir.

## Notlar

- Sayfadaki toplantılar, kişiler ve rakamlar örnek veridir; sayfanın altında da bu belirtilir.
- `prefers-reduced-motion` açık olan kullanıcılarda tüm animasyonlar durur, 3D sahneler sabit bir açıyla gösterilir.
- Fontlar (Schibsted Grotesk, Martian Mono) Google Fonts'tan yüklenir.
