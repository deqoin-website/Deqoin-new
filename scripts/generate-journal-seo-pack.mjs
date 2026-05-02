import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

const root = process.cwd();
const outJson = join(root, "data/journal-seo-pack.json");
const outHtml = join(root, "data/journal-seo-pack.html");
const coversDir = join(root, "public/images/journal-covers");

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createCoverSvg({ label, accent, accent2, dark, light, lines }) {
  const lineMarkup = lines
    .map(
      (line, index) =>
        `<path d="${line}" stroke="rgba(255,255,255,${0.12 + index * 0.05})" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent2}"/>
    </linearGradient>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="24" />
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="280" cy="210" r="170" fill="${accent}" fill-opacity="0.16" filter="url(#blur)"/>
  <circle cx="1340" cy="150" r="220" fill="${accent2}" fill-opacity="0.12" filter="url(#blur)"/>
  <circle cx="1240" cy="760" r="260" fill="${light}" fill-opacity="0.08" filter="url(#blur)"/>
  <rect x="90" y="90" width="1420" height="720" rx="44" stroke="rgba(255,255,255,0.09)" stroke-width="2"/>
  <rect x="120" y="120" width="220" height="16" rx="8" fill="${accent}"/>
  <rect x="120" y="155" width="140" height="8" rx="4" fill="rgba(255,255,255,0.22)"/>
  <g transform="translate(120 242)">
    <text x="0" y="0" fill="white" font-size="86" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="-1">${escapeHtml(label.toLocaleUpperCase("tr-TR"))}</text>
    <text x="0" y="88" fill="rgba(255,255,255,0.72)" font-size="28" font-family="Arial, Helvetica, sans-serif" letter-spacing="1.8">DEQOIN JOURNAL</text>
  </g>
  <g transform="translate(980 250)">
    <rect x="0" y="0" width="420" height="240" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
    <circle cx="108" cy="110" r="88" fill="url(#accent)" fill-opacity="0.92"/>
    <rect x="232" y="48" width="126" height="18" rx="9" fill="rgba(255,255,255,0.82)"/>
    <rect x="232" y="82" width="150" height="12" rx="6" fill="rgba(255,255,255,0.25)"/>
    <rect x="232" y="110" width="112" height="12" rx="6" fill="rgba(255,255,255,0.18)"/>
    <rect x="232" y="150" width="154" height="12" rx="6" fill="rgba(255,255,255,0.28)"/>
    <rect x="232" y="174" width="96" height="12" rx="6" fill="rgba(255,255,255,0.18)"/>
  </g>
  <g transform="translate(120 560)">
    ${lineMarkup}
  </g>
  <text x="120" y="804" fill="rgba(255,255,255,0.58)" font-size="22" font-family="Arial, Helvetica, sans-serif" letter-spacing="2.6">DEQOIN / EDITORIAL COVER</text>
</svg>`;
}

const articles = [
  {
    slug: "ic-mimarlikta-dogru-planlama-neden-onemlidir",
    title: "iç mimarlıkta doğru planlama neden önemlidir?",
    deck: "İç mimarlıkta ilk karar planlamadır. Alanın ölçüsü, ışığı, mobilya yerleşimi ve kullanım alışkanlıkları birlikte düşünülürse mekan daha rahat ve daha düzenli olur.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "KURUMSAL"],
    contentTypes: ["PERSPEKTİFLER", "İÇGÖRÜLER"],
    intro:
      "Bir mekanın iyi görünmesi tek başına yeterli değildir. Asıl farkı yaratan şey, o alanın nasıl planlandığıdır. Doğru planlanan bir ev ya da ofis daha sakin, daha kullanışlı ve daha kolay yaşanır hale gelir.",
    coverLabel: "planlama",
    coverTheme: {
      accent: "#a78965",
      accent2: "#f0d4a8",
      dark: "#181311",
      light: "#efe1cf",
      lines: ["M 0 120 C 180 0 300 0 480 120", "M 60 190 C 220 80 340 80 520 190", "M 120 260 C 260 180 380 180 620 260"],
    },
    sections: [
      { type: "heading", level: 2, text: "planlama neden ilk adımdır?" },
      {
        type: "paragraph",
        body:
          "İç mimarlık, sadece renk ve mobilya seçmek değildir. Alanın nerede daraldığı, hangi noktada ışık kaybettiği ve hareket akışının nasıl çalıştığı önce görülmelidir. Bu analiz yapılınca mekan tasarımı daha doğru kararlarla ilerler.",
      },
      {
        type: "list",
        items: [
          "Geçiş alanları rahatlar",
          "Gereksiz kalabalık azalır",
          "Işık daha iyi kullanılır",
          "Günlük yaşam kolaylaşır",
        ],
      },
      { type: "heading", level: 2, text: "deqoin bu süreci nasıl ele alır?" },
      {
        type: "paragraph",
        body:
          "deqoin olarak önce mekanın kullanımını, sonra ölçüsünü ve ışık durumunu değerlendiriyoruz. Ardından iç mimarlık kararlarını bu ihtiyaca göre kuruyoruz. Böylece ortaya yalnızca şık görünen değil, gerçekten işe yarayan bir düzen çıkıyor.",
      },
    ],
  },
  {
    slug: "ev-yenilerken-nelere-dikkat-etmelisiniz",
    title: "ev yenilerken nelere dikkat etmelisiniz?",
    deck: "Ev yenileme sürecinde estetik kadar işlev de önemlidir. Planlı bir yaklaşım, bütçeyi korur ve sonuçtan daha uzun süre memnun kalmanızı sağlar.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT"],
    contentTypes: ["İÇGÖRÜLER", "PERSPEKTİFLER"],
    intro:
      "Ev dekorasyonu ve yenileme süreci heyecanlıdır ama plansız ilerlerse yorucu hale gelir. Ne kadar değişeceğini, hangi alanların öncelikli olduğunu ve hangi malzemelerin kullanılacağını baştan netleştirmek gerekir.",
    coverLabel: "yenileme",
    coverTheme: {
      accent: "#c7a97a",
      accent2: "#8a6d4a",
      dark: "#1a1714",
      light: "#f3e8d7",
      lines: ["M 0 140 L 180 40 L 360 140", "M 80 220 L 280 100 L 520 220", "M 150 300 L 380 180 L 640 300"],
    },
    sections: [
      { type: "heading", level: 2, text: "önce plan, sonra alışveriş" },
      {
        type: "paragraph",
        body:
          "En sık yapılan hata, önce ürün seçip sonra mekanın ihtiyaçlarını düşünmektir. Oysa doğru sıra tam tersidir. Önce alanın hangi sorunu çözülecek, sonra mobilya, renk ve malzeme belirlenmelidir.",
      },
      {
        type: "list",
        items: [
          "Işık ihtiyacını değerlendirin",
          "Mobilyayı ölçüye göre seçin",
          "Depolamayı göz ardı etmeyin",
          "Uzun ömürlü yüzeyleri tercih edin",
        ],
      },
      { type: "heading", level: 2, text: "deqoin yaklaşımı" },
      {
        type: "paragraph",
        body:
          "deqoin, ev yenileme projelerinde sadece güzel görünen değil, günlük hayata uyum sağlayan çözümler kurar. Böylece yeni görünüm kadar kullanım rahatlığı da kazanılır.",
      },
    ],
  },
  {
    slug: "kucuk-alanlar-nasil-daha-ferah-gosterilir",
    title: "küçük alanlar nasıl daha ferah gösterilir?",
    deck: "Dar alanlarda ferahlık; ışık, renk, mobilya ölçüsü ve sade planlamanın birleşimiyle oluşur. Doğru kurgu küçük mekanları daha rahat hissettirir.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER"],
    intro:
      "Küçük bir alanın sıkışık görünmesi zorunlu değildir. Doğru mekan tasarımıyla dar bir oda da rahat, düzenli ve nefes alan bir hale gelebilir.",
    coverLabel: "ferahlık",
    coverTheme: {
      accent: "#b9d3e8",
      accent2: "#f6efe4",
      dark: "#10181f",
      light: "#d8e7f2",
      lines: ["M 0 210 C 130 120 260 120 390 210", "M 130 260 C 260 170 400 170 560 260", "M 250 310 C 360 240 510 240 680 310"],
    },
    sections: [
      { type: "heading", level: 2, text: "ışık ve renk nasıl çalışır?" },
      {
        type: "paragraph",
        body:
          "Açık renkler alanı daha büyük gösterir ama tek başına yeterli değildir. Doğal ışığın önünü kapatmamak, aynayı doğru noktada kullanmak ve katmanlı aydınlatma oluşturmak da gerekir. Böylece oda daha açık algılanır.",
      },
      { type: "heading", level: 3, text: "mobilya seçimi" },
      {
        type: "paragraph",
        body:
          "Küçük alanlarda hantal mobilyalar yerine ölçüye uygun, sade ve işlevli parçalar seçmek gerekir. Fazla parça kullanmak yerine birkaç güçlü öğe ile düzen kurmak daha iyi sonuç verir.",
      },
      {
        type: "list",
        items: [
          "Gereksiz eşyayı azaltın",
          "Açık tonları dengeli kullanın",
          "Depolamayı gizli çözümlerle planlayın",
          "Geçiş alanını açık bırakın",
        ],
      },
    ],
  },
  {
    slug: "ofis-tasariminda-konfor-ve-verimlilik",
    title: "ofis tasarımında konfor ve verimlilik nasıl birlikte sağlanır?",
    deck: "İyi bir ofis tasarımı, çalışanların rahat ettiği ve iş akışının bozulmadığı bir düzen kurar. Konfor ile verimlilik aynı planda düşünüldüğünde sonuç güçlenir.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER", "TEKNİK VERİ"],
    intro:
      "Ofis tasarımı sadece şık bir masa ve birkaç sandalye seçmek değildir. Doğru yerleşim, doğru ışık ve doğru dolaşım kurgusu iş performansını doğrudan etkiler.",
    coverLabel: "ofis",
    coverTheme: {
      accent: "#8ca0b7",
      accent2: "#d9dee5",
      dark: "#10141b",
      light: "#c8d1dc",
      lines: ["M 0 120 L 160 40 L 320 120", "M 80 220 L 260 100 L 460 220", "M 180 300 L 420 180 L 640 300"],
    },
    sections: [
      { type: "heading", level: 2, text: "çalışma akışı önce gelir" },
      {
        type: "paragraph",
        body:
          "Bir ofiste masaların birbirini kesmeyen bir düzende kurulması gerekir. Toplantı alanı, bireysel çalışma noktaları ve ortak kullanım bölümleri birbiriyle uyumlu olmalıdır. Bu yapı hem konforu hem de düzeni artırır.",
      },
      { type: "heading", level: 2, text: "konfor sadece koltuk değildir" },
      {
        type: "paragraph",
        body:
          "Aydınlatma, ses dengesi, renk seçimi ve havalandırma da ofis konforunun parçasıdır. Çalışanların uzun süre vakit geçirdiği bir alanda bunlar doğru kurulmadığında verim düşer.",
      },
      {
        type: "list",
        items: [
          "Dolaşım alanlarını açık tutun",
          "Masaları ışığa göre yerleştirin",
          "Ortak alanları net ayırın",
          "Dayanıklı malzeme kullanın",
        ],
      },
    ],
  },
  {
    slug: "butik-otellerde-ilk-izlenim-neden-onemlidir",
    title: "butik otellerde ilk izlenim neden önemlidir?",
    deck: "Butik otellerde ilk izlenim, misafirin deneyimini doğrudan etkiler. Giriş alanı, oda düzeni ve malzeme seçimi birlikte düşünülmelidir.",
    publishedAt: "02 MAYIS 2026",
    readTime: "06 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["TİCARİ"],
    contentTypes: ["PERSPEKTİFLER", "İÇGÖRÜLER"],
    intro:
      "Misafir otele girdiği anda mekan hakkında fikir edinir. Bu nedenle butik otel tasarımında amaç yalnızca şık bir görünüm değil, rahat bir deneyim kurmaktır.",
    coverLabel: "otel",
    coverTheme: {
      accent: "#c49a72",
      accent2: "#eed6b7",
      dark: "#19130f",
      light: "#f1d7bf",
      lines: ["M 0 160 C 130 60 250 60 380 160", "M 90 230 C 220 130 340 130 500 230", "M 190 300 C 320 220 450 220 640 300"],
    },
    sections: [
      { type: "heading", level: 2, text: "giriş alanı mesaj verir" },
      {
        type: "paragraph",
        body:
          "Temiz, düzenli ve dengeli bir giriş alanı güven hissi oluşturur. Işık, yönlendirme ve mobilya seçimi ilk dakikadaki algıyı belirler. Bu yüzden otel girişinde detaylar önemlidir.",
      },
      { type: "heading", level: 3, text: "odada ne beklenir?" },
      {
        type: "paragraph",
        body:
          "Butik otel odalarında rahatlık, iyi ışık ve yeterli depolama öne çıkar. Oda kalabalık görünmemeli, ama eksik de hissettirmemelidir. Sade ama karakterli bir düzen en doğru çözümdür.",
      },
      {
        type: "list",
        items: [
          "Misafir akışını düşünün",
          "Yumuşak ışık geçişleri kurun",
          "Dayanıklı yüzeyler seçin",
          "Mekanın bölgeyle ilişkisini koruyun",
        ],
      },
    ],
  },
  {
    slug: "tadilatta-malzeme-secimi-neden-kritiktir",
    title: "tadilatta malzeme seçimi neden kritik bir adımdır?",
    deck: "Tadilatın sonucunu belirleyen en önemli şeylerden biri malzemedir. Doğru malzeme, hem dayanıklılığı hem de günlük kullanım kolaylığını artırır.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "TEKNİK VERİ",
    departments: ["MATERYAL"],
    projectTypes: ["KONUT", "TİCARİ"],
    contentTypes: ["TEKNİK VERİ", "İÇGÖRÜLER"],
    intro:
      "İyi görünen bir yüzey, uzun ömürlü değilse doğru seçim değildir. Tadilatta malzeme; dayanıklılık, bakım ve kullanım şekliyle birlikte düşünülmelidir.",
    coverLabel: "malzeme",
    coverTheme: {
      accent: "#b99b7d",
      accent2: "#6f5e4d",
      dark: "#171311",
      light: "#efe0d0",
      lines: ["M 0 120 L 130 60 L 260 120", "M 70 220 L 240 120 L 410 220", "M 170 320 L 360 200 L 560 320"],
    },
    sections: [
      { type: "heading", level: 2, text: "görünüm tek başına yetmez" },
      {
        type: "paragraph",
        body:
          "Bir malzeme ilk bakışta iyi görünebilir ama çizilmeye, neme veya yoğun kullanıma dayanmayabilir. Bu nedenle seçim yaparken alanın gerçek ihtiyacı önce gelmelidir.",
      },
      {
        type: "list",
        items: [
          "Kolay temizlenebilir olmalı",
          "Kullanım alanına uygun olmalı",
          "Bakım ihtiyacı net olmalı",
          "Uzun ömürlü sonuç vermeli",
        ],
      },
      { type: "heading", level: 2, text: "deqoin neye bakar?" },
      {
        type: "paragraph",
        body:
          "deqoin, malzeme seçimini sadece görsel karar olarak görmez. Alanın işlevini, kullanıcı yoğunluğunu ve bakım alışkanlığını birlikte değerlendirir. Bu yaklaşım, daha sağlıklı ve daha kalıcı sonuç verir.",
      },
    ],
  },
  {
    slug: "aydinlatma-bir-mekanin-havasini-nasil-degistirir",
    title: "aydınlatma bir mekanın havasını nasıl değiştirir?",
    deck: "Işık, mekanın algısını doğrudan değiştirir. Doğru aydınlatma ile aynı alan daha sıcak, daha açık ya da daha dengeli hissedilebilir.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER"],
    intro:
      "Aydınlatma, sadece görünürlük sağlamaz. Mekanın karakterini, rengini ve kullanım konforunu da belirler. Bu yüzden iç mimarlıkta ışık, en temel kararlardan biridir.",
    coverLabel: "aydınlatma",
    coverTheme: {
      accent: "#e4b56f",
      accent2: "#fff1d1",
      dark: "#14130f",
      light: "#f6dfab",
      lines: ["M 0 80 L 140 180 L 280 80", "M 80 180 L 260 280 L 440 180", "M 170 280 L 380 380 L 580 280"],
    },
    sections: [
      { type: "heading", level: 2, text: "doğal ışık" },
      {
        type: "paragraph",
        body:
          "Doğal ışık mekanı daha canlı ve daha ferah gösterir. Pencere önü düzeni, perde seçimi ve yüzey rengi bu ışığın nasıl dağıldığını etkiler. İyi bir kurgu, alanı anında değiştirir.",
      },
      { type: "heading", level: 2, text: "yapay ışıkta denge" },
      {
        type: "paragraph",
        body:
          "Tek bir güçlü ışık yerine farklı noktalarda dengeli ışık kullanmak daha iyi sonuç verir. Böylece köşeler karanlık kalmaz, alan bölgelere ayrılır ve mekan daha rahat kullanılır.",
      },
      {
        type: "list",
        items: [
          "Katmanlı aydınlatma kurun",
          "Sıcak ve soğuk ışığı dengede tutun",
          "Yansıtan yüzeyleri bilinçli kullanın",
          "Işığı işlevle birlikte düşünün",
        ],
      },
    ],
  },
  {
    slug: "ev-dekorasyonunda-en-sik-yapilan-hatalar",
    title: "ev dekorasyonunda en sık yapılan hatalar",
    deck: "Ev dekorasyonunda en sık görülen sorun, alanı olduğundan fazla doldurmaktır. Daha sade kararlar çoğu zaman daha iyi sonuç verir.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT"],
    contentTypes: ["İÇGÖRÜLER", "PERSPEKTİFLER"],
    intro:
      "Dekorasyon yaparken amaç çok eşya kullanmak değil, doğru parçaları doğru yerde kullanmaktır. Hataları erken fark etmek, evi daha dengeli hale getirir.",
    coverLabel: "hatalar",
    coverTheme: {
      accent: "#d08b78",
      accent2: "#f4d0c4",
      dark: "#1a1210",
      light: "#f7e2dd",
      lines: ["M 0 160 L 140 60 L 280 160", "M 90 250 L 240 150 L 390 250", "M 210 340 L 380 240 L 540 340"],
    },
    sections: [
      { type: "heading", level: 2, text: "en sık görülen sorunlar" },
      {
        type: "paragraph",
        body:
          "Ölçüye uygun olmayan mobilyalar, fazla aksesuar, plansız renk geçişleri ve yetersiz depolama en sık yapılan hatalardır. Bunlar mekanı kalabalık ve yorucu gösterir.",
      },
      {
        type: "list",
        items: [
          "Alan ölçüsünü dikkate alın",
          "Renkleri sınırlı kullanın",
          "Aksesuarı kontrollü seçin",
          "İşlevi dekorasyon kadar önemseyin",
        ],
      },
      { type: "heading", level: 2, text: "deqoin yaklaşımı" },
      {
        type: "paragraph",
        body:
          "deqoin, dekorasyonu sade ama güçlü bir çizgide kurar. Böylece ev, sadece güzel görünmez; daha rahat yaşanır bir hale gelir.",
      },
    ],
  },
  {
    slug: "nevsehirde-modern-yasam-alanlari-nasil-tasarlanir",
    title: "nevşehir'de modern yaşam alanları nasıl tasarlanır?",
    deck: "Nevşehir'de modern yaşam alanı tasarlarken yerel yapı, ışık koşulları ve kullanım alışkanlıkları birlikte düşünülmelidir.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "TİCARİ", "KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER", "PERSPEKTİFLER"],
    intro:
      "Nevşehir’de iç mimarlık yaparken sadece modern görünüm yeterli değildir. Mekanın bulunduğu yapı, çevresi ve kullanıcının ihtiyaçları da tasarımın parçasıdır.",
    coverLabel: "nevşehir",
    coverTheme: {
      accent: "#b99b74",
      accent2: "#d8c3a1",
      dark: "#181511",
      light: "#f0e2d1",
      lines: ["M 0 220 C 160 120 260 120 420 220", "M 90 300 C 250 200 360 200 560 300", "M 160 380 C 320 280 480 280 700 380"],
    },
    sections: [
      { type: "heading", level: 2, text: "yerel yapıyı anlamak gerekir" },
      {
        type: "paragraph",
        body:
          "Nevşehir'deki her mekan aynı karakterde değildir. Bazıları geleneksel doku taşır, bazıları ise modern kullanım beklentilerine göre şekillenir. Tasarım kararı bu farkı dikkate almalıdır.",
      },
      {
        type: "list",
        items: [
          "Işık alma durumunu analiz edin",
          "Mekanın formunu dikkate alın",
          "Dayanıklı malzeme seçin",
          "Temizliği kolaylaştırın",
        ],
      },
      { type: "heading", level: 2, text: "deqoin nasıl çalışır?" },
      {
        type: "paragraph",
        body:
          "deqoin, Nevşehir iç mimar yaklaşımında hazır kalıplar kullanmaz. Mekanın ölçüsünü, ışığını ve kullanımını yerinde değerlendirir. Böylece ortaya daha gerçekçi ve uzun ömürlü çözümler çıkar.",
      },
    ],
  },
  {
    slug: "deqoin-yaklasimiyla-mekanlar-nasil-yenilenir",
    title: "deqoin yaklaşımıyla mekanlar nasıl yenilenir?",
    deck: "deqoin yaklaşımında yenileme, önce ihtiyacı anlamakla başlar. Sonra tasarım ve uygulama aynı çizgide ilerler.",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["UYGULAMA", "MİMARİ"],
    projectTypes: ["KONUT", "TİCARİ", "KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER", "TEKNİK VERİ"],
    intro:
      "Bir mekanı yenilemek, sadece eskiyi değiştirmek değildir. O alanı neden kullandığınızı anlamak, sonra buna uygun bir düzen kurmak gerekir.",
    coverLabel: "deqoin",
    coverTheme: {
      accent: "#a68966",
      accent2: "#f0d8b6",
      dark: "#171311",
      light: "#efd9bf",
      lines: ["M 0 130 L 180 30 L 360 130", "M 90 220 L 290 120 L 490 220", "M 180 310 L 420 210 L 620 310"],
    },
    sections: [
      { type: "heading", level: 2, text: "süreç nasıl başlar?" },
      {
        type: "paragraph",
        body:
          "İlk aşama ihtiyaç analizidir. Mekanın güçlü ve zayıf yönleri, kullanım yoğunluğu ve teknik sınırları belirlenir. Bu adım netleşmeden yapılan her seçim eksik kalır.",
      },
      { type: "heading", level: 2, text: "tasarım ve uygulama birlikte düşünülür" },
      {
        type: "paragraph",
        body:
          "deqoin yaklaşımında tasarım sahadan ayrı ilerlemez. Kağıt üzerinde iyi görünen bir fikir, uygulamada çalışmıyorsa gerçek çözüm değildir. Bu yüzden süreç baştan sona kontrol edilir.",
      },
      {
        type: "list",
        items: [
          "İhtiyaç analizi yapılır",
          "Malzeme ve renk dengelenir",
          "Uygulama detayları netleştirilir",
          "Sonuç günlük hayata uyarlanır",
        ],
      },
    ],
  },
];

function renderSectionsHtml(sections) {
  return sections
    .map((section) => {
      switch (section.type) {
        case "heading":
          return `<h${section.level}>${escapeHtml(section.text)}</h${section.level}>`;
        case "paragraph":
          return `<p>${escapeHtml(section.body)}</p>`;
        case "list":
          return `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
        default:
          return "";
      }
    })
    .join("\n");
}

function buildHtmlDocument(items) {
  const articleHtml = items
    .map(
      (article) => `
      <article class="article">
        <img src="${escapeHtml(article.coverImage)}" alt="${escapeHtml(article.title)}" class="cover" />
        <div class="meta">${escapeHtml(article.publishedAt)} · ${escapeHtml(article.readTime)} · ${escapeHtml(article.articleType)}</div>
        <h1>${escapeHtml(article.title)}</h1>
        <p class="deck">${escapeHtml(article.deck)}</p>
        <p class="intro">${escapeHtml(article.intro)}</p>
        ${renderSectionsHtml(article.sections)}
      </article>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>deqoin journal seo pack</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; padding: 40px 24px 120px; background: #080808; color: #fff; font-family: Arial, Helvetica, sans-serif; }
    main { max-width: 980px; margin: 0 auto; }
    article { padding: 28px 0 52px; border-bottom: 1px solid rgba(255,255,255,.08); }
    .cover { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 24px; border: 1px solid rgba(255,255,255,.1); margin-bottom: 18px; }
    .meta { text-transform: uppercase; letter-spacing: .18em; font-size: 12px; color: rgba(255,255,255,.5); margin-bottom: 12px; }
    h1 { font-size: clamp(32px, 4vw, 58px); line-height: .98; margin: 0 0 16px; }
    h2 { font-size: 28px; margin: 32px 0 12px; }
    h3 { font-size: 22px; margin: 24px 0 10px; }
    p, li { font-size: 18px; line-height: 1.75; color: rgba(255,255,255,.82); }
    .deck { font-size: 20px; color: rgba(255,255,255,.9); }
    ul { padding-left: 22px; }
    li { margin: 10px 0; }
  </style>
</head>
<body>
  <main>
    <header style="padding: 0 0 28px;">
      <p style="text-transform: uppercase; letter-spacing: .3em; font-size: 12px; color: rgba(255,255,255,.42);">deqoin / journal seo pack</p>
      <h1 style="margin: 14px 0 0;">journal system export</h1>
    </header>
    ${articleHtml}
  </main>
</body>
</html>`;
}

ensureDir(dirname(outJson));
ensureDir(dirname(outHtml));
ensureDir(coversDir);

const jsonPayload = {
  pageTitle: "journal",
  hero: {
    title: "journal",
    subtitle: "deqoin journal / editorial archive",
    description: "deqoin journal, iç mimarlık, mekan tasarımı ve uygulama notlarını sade bir blog diliyle bir araya getirir.",
    featuredArticleSlug: articles[0].slug,
  },
  articles: articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    deck: article.deck,
    coverImage: `/images/journal-covers/${article.slug}.svg`,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    articleType: article.articleType,
    departments: article.departments,
    projectTypes: article.projectTypes,
    contentTypes: article.contentTypes,
    relatedProjectSlugs: [],
    intro: article.intro,
    sections: article.sections,
    seo: {
      metaTitle: `${article.title} | deqoin`,
      metaDescription: article.deck,
      coverPrompt: `${article.coverLabel} temalı editorial cover, minimalist geometrik kompozisyon, deqoin journal için 16:9 kapak görseli.`,
    },
  })),
};

writeFileSync(outJson, `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf8");
writeFileSync(outHtml, buildHtmlDocument(jsonPayload.articles), "utf8");

for (const article of articles) {
  const svg = createCoverSvg({
    label: article.coverLabel,
    ...article.coverTheme,
  });
  writeFileSync(join(coversDir, `${article.slug}.svg`), svg, "utf8");
}

console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outHtml}`);
console.log(`Wrote ${articles.length} cover SVG files to ${coversDir}`);
