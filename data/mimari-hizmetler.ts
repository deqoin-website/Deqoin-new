export interface MimariService {
  slug: string;
  title: string;
  description: string;
  image: string;
  sideLabel: string;
  process: { title: string; desc: string }[];
  focusAreas: { title: string; icon: string; desc: string }[];
}

export const mimariServices: MimariService[] = [
  {
    slug: "mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/slider/mimari_slide.png",
    description: "Bir projenin gerçek değeri, henüz temeli atılmadan önce kağıt üzerindeki o ilk çizgilerle belirlenir. Mimarlık alanında sadece fiziksel bir dış kabuk değil; içinde barınacak hayatın tüm karakterini yansıtan gerçek bir yaşam alanı kurguluyoruz.\n\nVilla, özel konut, ticari alan veya ofis projelerinizde 'inşa etmek' ile 'yaşam alanı kurgulamak' arasındaki farkın mimari zeka olduğunu çok iyi biliyoruz. Projenizin yerleşim planından dış cephe kimliğine kadar tüm detayları; sizin henüz dile getirmediğiniz, belki de farkında dahi olmadığınız ihtiyaçlarınızı öngören bir profesyonellikle şekillendiriyoruz. Aslında neye ihtiyacınız olduğunu biliyor ve size tam olarak bu eksiksiz deneyimi sunuyoruz.\n\nProjenizin ana omurgasını oluşturmak ve size özel vizyonumuzu keşfetmek için randevu talep edebilirsiniz.",
    process: [
      { title: "Konsept ve Keşif", desc: "İhtiyaçlarınızı ve arazinin ruhunu analiz ederek projenin ana fikrini ve karakterini oluşturuyoruz." },
      { title: "Form ve Kütle Etüdü", desc: "Yapının çevreyle olan diyaloğunu, ışık ve gölge oyunlarını rasyonel bir estetik düzlemde kurguluyoruz." },
      { title: "Teknik Projelendirme", desc: "Tasarımı, tüm detaylarıyla inşa edilebilir ve sürdürülebilir bir mühendislik hassasiyetiyle planlıyoruz." },
      { title: "Uygulama Denetimi", desc: "Kağıt üzerindeki vizyonun, sahada kusursuz bir şekilde hayat bulmasını profesyonel ekibimizle sağlıyoruz." },
    ],
    focusAreas: [
      { title: "İkonik Mimari", icon: "architecture", desc: "Her projede zamansız ve imza niteliğinde formlar tasarlıyoruz." },
      { title: "Modern Fonksiyonellik", icon: "dashboard", desc: "Estetik duruşun, kullanım ergonomisiyle mükemmel uyumunu sağlıyoruz." },
      { title: "Sürdürülebilirlik", icon: "eco", desc: "Doğaya saygılı, enerji verimli ve akıllı yapı çözümleri üretiyoruz." },
    ],
  },
  {
    slug: "ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/about_interior.png",
    description: "İç Mimarlık disiplinini, bir binanın sadece dört duvarı veya dış kabuğu olarak değil; o kabuğun içindeki yaşamın gerçek karakteri ve ruhu olarak tanımlıyoruz. Villa, özel konut veya ticari alan projelerinizde, mekanın kurgusunu henüz uygulama başlamadan en ince detayına kadar dijital dünyada kusursuz görsel render çalışmalarımızla somutlaştırıyoruz.\n\nTasarım sürecimizde, sizin henüz kelimelere dökmediğiniz, belki de mekanın içine girdiğinizde eksikliğini hissedeceğiniz o ince detayları profesyonel bir öngörüyle planlıyoruz. Tasarımın sadece görsellikten ibaret olmadığını, bir yaşam kültürü olduğunu biliyor ve size bu eksiksiz deneyimi sunuyoruz.\n\nProjelerinizin iç mekan kimliğini belirlemek ve vizyoner render çalışmalarımızı incelemek için randevu talep edebilirsiniz.",
    process: [
      { title: "İç Mekan Kurgusu & Konsept", desc: "Mekanın ruhuna ve kullanım senaryolarına uygun, özgün bir konsept dili oluşturuyoruz." },
      { title: "Görselleştirme & Render", desc: "Henüz uygulama başlamadan, hayalinizdeki mekanı foto-gerçekçi renderlar ile dijital ortamda inşa ediyoruz." },
      { title: "Malzeme & Detay Çözümleri", desc: "Sektörün en prestijli markalarıyla, doku ve renk uyumunu milimetrik çözümlerle birleştiriyoruz." },
      { title: "Uygulama Koordinasyonu", desc: "Tasarımın kağıt üzerindeki mükemmelliğini, uygulama sürecinde sahada birebir koruyoruz." },
    ],
    focusAreas: [
      { title: "Kişiselleştirilmiş Lüks", icon: "diamond", desc: "Sizin karakterinizi yansıtan, alışılmışın dışında ve size özel detaylar." },
      { title: "Aydınlatma & Atmosfer", icon: "lightbulb", desc: "Doğal ve yapay ışığın mekan içindeki dengesini, duyulara hitap edecek şekilde kurguluyoruz." },
      { title: "Görsel Mükemmellik", icon: "photo_camera", desc: "Dünyanın en iyi render teknolojileriyle projenizi uygulama öncesi deneyimletiyoruz." },
    ],
  },
  {
    slug: "restorasyon",
    title: "Restorasyon Mimarlığı",
    sideLabel: "Heritage Revival",
    image: "/images/projects/gallery_1.png",
    description: "Restorasyon Mimarlığı disiplinimizi, sıradan bir eski bina onarımı veya basit bir güçlendirme çalışmasının çok ötesinde konumlandırıyoruz. Bizim için her tarihi yapı; kaya ve taş otellerinin yeniden tasarlanmasından, köhne cephelerin modern birer mimari kimliğe dönüştürülmesine kadar uzanan bir dönüşüm yolculuğudur. Peri bacası formlarından ilham alan o kesintisiz, oval hatları ve heykelsi formları yapıya entegre ederek, geçmişin dokusunu bugünün lüks anlayışıyla yeniden kurguluyoruz.\n\nTarihi bir yapının aslında neye ihtiyacı olduğunu ve sizin o yapıda hissetmek istediğiniz ama henüz dile dökemediğiniz eksiklikleri çok iyi biliyoruz. Biz sadece bir yapıyı korumuyoruz; o yapıyı özgünlüğünden koparmadan, yaşayan ve nefes alan kusursuz bir yaşam alanına dönüştürüyoruz. Sizin profesyonel vizyonumuza olan ihtiyacınızın farkındayız ve bu dönüşümü en üst düzeyde gerçekleştiriyoruz.\n\nÖzel projelerinizin geleceğini şekillendirmek için randevu talep edebilirsiniz.",
    process: [
      { title: "Tarihi Doku Analizi & Etüd", desc: "Yapının özgün kimliğini ve potansiyelini en ince ayrıntısına kadar analiz ederek yeni vizyonumuzu temellendiriyoruz." },
      { title: "Cephe Dönüşüm Tasarımı", desc: "Karaktersizleşmiş cepheleri, modern ve lüks bir mimari kimlikle tamamen yeniden kurguluyoruz." },
      { title: "Oval & Heykelsi Formlar", desc: "Peri bacası formlarından ilham alan kesintisiz hatları ve kaya işçiliğini projeye entegre ediyoruz." },
      { title: "Yüksek Standartlı Uygulama", desc: "Tasarlanan formların sahada milimetrik hassasiyetle hayata geçmesini sağlıyoruz." },
    ],
    focusAreas: [
      { title: "Kaya & Taş Otel Tasarımı", icon: "diamond", desc: "Mağara ve taş yapıları dünyanın en prestijli otel konseptlerine dönüştürüyoruz." },
      { title: "Antik Formların Modernizasyonu", icon: "history_edu", desc: "Geleneksel mimari öğeleri, modern tasarım diliyle yeniden yorumluyoruz." },
      { title: "Cephe Kimliği Dönüşümü", icon: "architecture", desc: "Eski yapıların dış kabuğunu, zamansız bir estetik anlayışıyla baştan aşağı yeniliyoruz." },
    ],
  },
  {
    slug: "peyzaj-mimarligi",
    title: "Peyzaj Mimarlığı",
    sideLabel: "Natural Integration",
    image: "/images/projects/gallery_2.png",
    description: "Peyzaj Mimarlığı disiplinimizi, sıradan bir bahçe düzenlemesi veya ağaç dikim faaliyetinin çok ötesinde konumlandırıyoruz. Villa, ticari ve otel projelerinizdeki dış mekanları, yapının kendi mimari kimliğiyle bütünleşen, yaşayan ve nefes alan eksiksiz birer yaşam alanı olarak kurguluyoruz. Dış mekanı, yapının sadece çevresi değil, onun ayrılmaz bir parçası olarak görüyoruz.\n\nHenüz farkında dahi olmadığınız dış mekan ihtiyaçlarınızı profesyonel bir öngörüyle analiz ediyor ve yapıyla kusursuz uyum sağlayan o eksik parçayı projenize ekliyoruz. Sert peyzaj elemanlarından bitkisel kurguya kadar her detayı, fonksiyonellik ve estetik dengesini en üst seviyede tutarak planlıyoruz. Ne istediğinizi biliyor ve size taahhüt ettiğimiz bu yüksek standartlı dış mekan deneyimini somutlaştırıyoruz.\n\nDış mekan projelerinizi başlatmak ve vizyonumuzu yerinde keşfetmek için randevu talep edebilirsiniz.",
    process: [
      { title: "Topografik Analiz & Kurgu", desc: "Arazinin verilerini ve yapının formunu analiz ederek, dış mekanın ana omurgasını planlıyoruz." },
      { title: "Sert Peyzaj Tasarımı", desc: "Yürüyüş yolları, havuzlar ve sosyal donatıları, mimari dille uyumlu heykelsi bir yaklaşımla çözümlüyoruz." },
      { title: "Ekolojik Bitkilendirme", desc: "Bulunduğunuz coğrafyanın mikroklimasına uygun, zamanla güzelleşen sürdürülebilir bitki kurguları hazırlıyoruz." },
      { title: "Uygulama Yönetimi", desc: "Dış mekanın her katmanını, projedeki kusursuzluğu sahada da koruyacak şekilde koordine ediyoruz." },
    ],
    focusAreas: [
      { title: "Mimari Bütünlük", icon: "architecture", desc: "Yapının dış kabuğu ile bahçenin kesintisiz bir akış içinde olmasını sağlıyoruz." },
      { title: "Sosyal Yaşam Alanları", icon: "deck", desc: "Dış mekanı sadece izlenecek bir manzara değil, aktif bir yaşam alanı olarak kurguluyoruz." },
      { title: "Sürdürülebilir Ekosistem", icon: "eco", desc: "Minimum bakım, maksimum estetik sağlayan akıllı peyzaj çözümleri sunuyoruz." },
    ],
  },
  {
    slug: "insaat-muhendisligi",
    title: "İnşaat Mühendisliği",
    sideLabel: "Structural Integrity",
    image: "/images/projects/gallery_3.png",
    description: "İnşaat Mühendisliği disiplinimizi, sadece teknik bir hesaplama sürecinden öte, estetik mimariyi ayakta tutan mühendislik zekası olarak görüyoruz. Lüks konut, villa ve ticari yapı projelerinizde; kolon, kiriş ve taşıyıcı statik sistemleri, tasarımın ruhunu bozmadan en güvenli ve efektif formda kurguluyoruz. Mühendisliği, mimari vizyonun görünmez ama en güçlü omurgası olarak tanımlıyoruz.\n\nHenüz farkında dahi olmadığınız teknik ve yapısal ihtiyaçları projenin en başında öngörüyor, sarsılmaz bir güvenliği zamansız bir estetikle birleştirerek eksiksiz bir yaşam alanı kurguluyoruz. Statik çözümlerimizde geleneksel sınırları, modern mühendislik disiplinleri ve ileri düzey analiz yöntemleriyle genişletiyoruz. Projenizin teorideki kusursuzluğunu, pratikteki sağlamlıkla mühürlüyoruz.\n\nYapısal projelendirme adımlarını başlatmak ve statik vizyonumuzu keşfetmek için randevu talep edebilirsiniz.",
    process: [
      { title: "Statik Analiz & Modelleme", desc: "Yapının yüklerini ve davranışını, en ileri düzey simülasyon yazılımlarıyla dijital ortamda kurguluyoruz." },
      { title: "Sistem Seçimi", desc: "Mimari forma en uygun taşıyıcı sistemi; güvenlik, ekonomi ve estetik dengesiyle belirliyoruz." },
      { title: "Detaylandırma & Projelendirme", desc: "Kolon ve kiriş birleşimlerinden temel detaylarına kadar tüm statik omurgayı titizlikle projelendiriyoruz." },
      { title: "Saha Uygunluk Denetimi", desc: "Uygulama aşamasında, statik projenin sahada milimetrik hassasiyetle hayata geçmesini koordine ediyoruz." },
    ],
    focusAreas: [
      { title: "Sarsılmaz Güvenlik", icon: "security", desc: "Uluslararası standartların üzerinde, yüksek dayanımlı statik çözümler kurguluyoruz." },
      { title: "Mimari Uyum", icon: "fit_screen", desc: "Taşıyıcı sistemleri, mimari estetiğe engel olmayacak, aksine onu destekleyecek şekilde çözüyoruz." },
      { title: "İleri Teknoloji", icon: "memory", desc: "Kompleks formları ve geniş açıklıkları, inovatif mühendislik metodolojileriyle mümkün kılıyoruz." },
    ],
  },
  {
    slug: "elektrik-elektronik-muhendisligi",
    title: "Elektrik, Elektronik ve Mekanik",
    sideLabel: "Smart Integration",
    image: "/images/projects/gallery_4.png",
    description: "Elektrik, Elektronik ve Mekanik Mühendisliği disiplinimizi, basit bir teknik altyapı sürecinin ötesinde; lüks konut, villa ve ticari yapılarınızı akıllı, güvenli ve yaşayan bir sisteme dönüştüren teknolojik ve mekanik bir omurga olarak kurguluyoruz. Mühendisliği, mekanın ruhunu teknolojiyle birleştiren ve projeyi geleceğe taşıyan en kritik entegrasyon katmanı olarak görüyoruz.\n\nBelki de henüz farkında olmadığınız teknik ve teknolojik ihtiyaçları en başından öngörüyor, estetik bütünlüğü bozmadan yaşam alanlarına kusursuz bir mühendislik entegre ediyoruz. Akıllı ev otomasyonlarından enerji verimliliğine, iklimlendirme sistemlerinden güvenlik ağlarına kadar her detayı, sadece bugünün değil, yarının teknolojisini de kapsayacak şekilde planlıyoruz. Yaşam kalitenizi artıran bu görünmez ama hayati sistemleri, en yüksek mühendislik standartlarıyla somutlaştırıyoruz.\n\nProjelerinizin teknolojik ve mekanik adımlarını başlatmak ve mühendislik vizyonumuzu keşfetmek için randevu talep edebilirsiniz.",
    process: [
      { title: "Teknolojik Altyapı Kurgusu", desc: "Projenin dijital ve mekanik ihtiyaçlarını, en son teknoloji trendlerini baz alarak projelendiriyoruz." },
      { title: "Sistem Entegrasyonu", desc: "Elektrik, iklimlendirme ve güvenlik sistemlerini, tek bir merkezden yönetilen akıllı bir ağ altında birleştiriyoruz." },
      { title: "Enerji & Verimlilik Planlama", desc: "Sürdürülebilir bir gelecek için enerji tüketimini optimize eden ileri düzey mühendislik çözümleri sunuyoruz." },
      { title: "Saha Koordinasyonu", desc: "Teknik projelerin sahada milimetrik doğrulukla ve güvenlik standartlarına tam uyumla hayata geçmesini sağlıyoruz." },
    ],
    focusAreas: [
      { title: "Akıllı Otomasyon", icon: "smart_toy", desc: "Yaşam alanlarınızı kullanıcı alışkanlıklarına göre şekillenen interaktif sistemlerle donatıyoruz." },
      { title: "Yüksek Konfor", icon: "air", desc: "İdeal iklimlendirme ve aydınlatma senaryolarıyla mekan konforunu en üst seviyeye taşıyoruz." },
      { title: "Teknik Güvenlik", icon: "gpp_good", desc: "En kritik altyapı sistemlerini, tavizsiz bir güvenlik ve yedekleme planıyla kurguluyoruz." },
    ],
  },
  {
    slug: "plan-proje",
    title: "Plan ve Proje",
    sideLabel: "Strategic Planning",
    image: "/images/projects/gallery_1.png",
    description: "Plan ve Proje disiplinimizi, sadece kağıt üzerindeki bir teknik çizim faaliyeti değil; lüks konut, villa ve ticari projelerinizin tüm kaderini belirleyen kritik bir keşif, taslak ve planlandırma süreci olarak kurguluyoruz. Her tasarımın, doğru yapılmış bir saha keşfi ve ihtiyaç analiziyle başladığını biliyor, projenin en sağlam temellerini bu aşamada atıyoruz.\n\nBelki de henüz farkında dahi olmadığınız mekansal ihtiyaçları ilk keşif anında öngörüyor, doğru bir planlama kurgusuyla eksiksiz bir yaşam alanı projelendiriyoruz. Fonksiyonelliği, yapısal zorunlulukları ve vizyoner tasarım hedeflerini tek bir potada eriterek; uygulanabilirliği yüksek, teknik kusursuzluğu tescilli yol haritaları hazırlıyoruz. Sürecin her adımını, projenin nihai başarısını garanti altına alacak bir titizlikle kurguluyoruz.\n\nProjelerinizin keşif ve projelendirme adımlarını başlatmak ve planlama vizyonumuzu keşfetmek için randevu talep edebilirsiniz.",
    process: [
      { title: "Saha Keşfi & Veri Toplama", desc: "Arazinin ve mevcut yapının fiziksel verilerini, en küçük detayı atlamadan yerinde analiz ediyoruz." },
      { title: "İhtiyaç Programı Analizi", desc: "Müşteri beklentilerini ve projeden beklenen fonksiyonları, vizyoner bir bakış açısıyla kurguluyoruz." },
      { title: "Taslak Yerleşim (Layout)", desc: "Mekansal akışı ve kütle dağılımını, en verimli ve estetik formda kağıda döküyoruz." },
      { title: "Uygulama Projeleri", desc: "Taslak aşamasını, inşaatın her adımına rehberlik edecek teknik mükemmellikteki projelere dönüştürüyoruz." },
    ],
    focusAreas: [
      { title: "Analitik Planlama", icon: "troubleshoot", desc: "Her projeyi, kendi özgün verileri ve ihtiyaçları doğrultusunda nokta atışı planlıyoruz." },
      { title: "Fonksiyonel Akış", icon: "account_tree", desc: "Mekanlar arasındaki bağları, yaşam kalitesini artıracak bir sirkülasyon şemasıyla kurguluyoruz." },
      { title: "Yasal Mevzuat Uyumu", icon: "gavel", desc: "Tüm planlama süreçlerini, yerel yönetmeliklere ve uluslararası standartlara tam uyumlu projelendiriyoruz." },
    ],
  },
];
