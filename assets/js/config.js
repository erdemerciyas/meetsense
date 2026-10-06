/*
 * MeetSense landing — site ayarları
 *
 * VİDEOLAR
 * Her video sayfa içinde oynatılır. `youtubeId` doldurulduğunda video YouTube oynatıcısıyla
 * (youtube-nocookie.com) sayfanın içinde açılır; boş bırakılırsa `file` içindeki MP4 dosyası oynatılır.
 * YouTube kimliği, video linkindeki v= değeridir:  https://www.youtube.com/watch?v=XXXXXXXXXXX  →  "XXXXXXXXXXX"
 */
window.MS_CONFIG = {
  demoEmail: "hello@bgts.ai",
  youtubePlaylist: "https://www.youtube.com/watch?v=Hbu09aDg39k&list=PLC8G2J2FBjWw",
  videos: {
    a1: { youtubeId: "", file: "assets/video/A1_Tanitim_MeetSense-nedir.mp4?v=2", poster: "assets/img/posters/a1.jpg?v=2", dur: "1:15" },
    a2: { youtubeId: "", file: "assets/video/A2_Tanitim_Teaser-9x16.mp4?v=2", poster: "assets/img/posters/a2.jpg?v=2", dur: "0:13", vertical: true },
    b1: { youtubeId: "", file: "assets/video/B1_Nasil-calisir_Uc-adim.mp4?v=2", poster: "assets/img/posters/b1.jpg?v=2", dur: "0:59" },
    d1: { youtubeId: "", file: "assets/video/D1_Sablon_Satis-Musteri-Yonetimi.mp4?v=2", poster: "assets/img/posters/d1.jpg?v=2", dur: "0:53" },
    d2: { youtubeId: "", file: "assets/video/D2_Sablon_Mulakat.mp4?v=2", poster: "assets/img/posters/d2.jpg?v=2", dur: "0:53" },
    e1: { youtubeId: "", file: "assets/video/E1_Kurumsal_Microsoft-altyapisi.mp4?v=2", poster: "assets/img/posters/e1.jpg?v=2", dur: "0:52" }
  }
};
