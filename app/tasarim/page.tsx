"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";

const principles = [
  {
    number: "01",
    title: "İnsan Odaklı Mekan",
    subtitle: "Human-Centered Space",
    desc: "Her iç mekan, yaşanacak olan kişinin duygusal haritasına göre kalibre edilir. Ergonomi ve estetik tek bir dilde buluşur.",
  },
  {
    number: "02",
    title: "Doku & Malzeme Dili",
    subtitle: "Texture & Material Language",
    desc: "Mermer, pirinç, kadife, ham beton; her malzeme kendi karakterini öne sürer ve mekanın kimliğini birlikte oluştururlar.",
  },
  {
    number: "03",
    title: "Işık Koreografisi",
    subtitle: "Light Choreography",
    desc: "Doğal ve yapay ışık katmanlanır. Her ışık noktası, odadaki duyguyu ve hiyerarşiyi titizlikle yönetir.",
  },
  {
    number: "04",
    title: "Zamansız Estetik",
    subtitle: "Timeless Aesthetic",
    desc: "Trendlerin gelip geçtiği bir dünyada biz kalıcı olana odaklanırız. On yıl sonra da nefes kesen bir iç mekan yaratmak ana hedefimizdir.",
  },
];

const processSteps = [
  {
    step: "01",
    phase: "Yaşam Analizi",
    duration: "1–2 Hafta",
    desc: "Yaşam alışkanlıklarınız, renk tercihleri, ilham kaynaklarınız ve fobiler dahil tüm detaylar derinlemesine analiz edilir.",
  },
  {
    step: "02",
    phase: "Moodboard & Konsept",
    duration: "2–4 Hafta",
    desc: "Onlarca referans görselden özenle seçilen bir moodboard ile mekanın duygu tonu ve renk paleti belirlenir.",
  },
  {
    step: "03",
    phase: "3D Görselleştirme",
    duration: "4–8 Hafta",
    desc: "Foto-gerçekçi render teknolojisiyle mekanınızı, inşaat başlamadan önce yaşayabilir ve tadını çıkarabilirsiniz.",
  },
  {
    step: "04",
    phase: "Uygulama & Teslim",
    duration: "Proje Süresince",
    desc: "Mobilya seçiminden boya rengine, aydınlatma montajından aksesuar yerleşimine kadar her detay stüdyo gözetiminde hayata geçer.",
  },
];

const specialties = [
  { label: "Lüks Konut İçi", count: "94" },
  { label: "Butik Otel Odası", count: "42" },
  { label: "Kurumsal Ofis", count: "36" },
  { label: "Restoran & Cafe", count: "28" },
  { label: "Spa & Wellness", count: "16" },
  { label: "Özel Yacht İçi", count: "8" },
];

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
    label: "Oturma Odası Konsepti",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ33Fr_mp_94UQUZyYOcRBRBK4SsC3hdWkie-fw6V2__i_B1h6AdSqBrcIxAAgXdz-v3B0bxiTC-ksADc_Szblsz7rQvFfbm-HT7bZ1XL4bsM_asUURcwntMziJsDYv2IG_IZ29E-x6Q-o8X94qQUEmwhhDhnCvzR73u_lPOfR2qgqCLbkcFE__mn9WB-1VfwW7H_DqV9DkwKYK7M0io-43LvxYatvgMsrwap-p4wEffe-ljtcBwrQlBdN4PP7Q0JGnYBjixX0YQ0",
    label: "Yatak Odası Detayı",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ch6quj8NI1itL20E5PhIg-48fajZE_vr98u3teQ-X7iSPzBfAvJnkTJ3RuJVxc2gjJk51KmYZk9sWDTwAjNMVHOwiJPfJh3i0VYt8Cfzsf6cPXv8SRUsh66wCIyRnDgQLMJg2_1yHEHCnFIbIJoBzDcFEntZjDdLiFO8q1WvslXUxTqhQNEyc8D_USmsB4iizRnCFmQqpbt_btAIebK4vy_8mB0LYZXdZk9Mtj6xqQ8e91yqi86iYoLhuoh8fXoG0Gcgep-wrSw",
    label: "Açık Plan Mutfak",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb8oJUAbKO838Rur4GmMdhoZA52T9apeuU9wT1MD8aED3l4BUvMiWzCyCUvgmQ_hUnxgOfF8IiulBiI2jOUD_rMvhMhY5q4XF5oN3Orkq525thVCe6a7Qn84IkmcCKdp7RVHGwlMXKCQZWlSwoQRYqNQ54bsoQ6pAqtTv5QeYJjApl9fwBFVCYyWIR0fqefLofCqY7cPmi_F1xk7yjOVIZsTO7FKo0OjDyPcryEMVFbFFRsn19bmHoDjlgz-s838-TizdClIfaG6s",
    label: "Özel Kütüphane",
  },
];

export default function TasarimPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>

      {/* HERO */}
      <section className="mimari-hero">
        <div className="mimari-hero-bg" ref={heroRef}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU"
            alt="DEQOIN Malzeme"
          />
        </div>
        <div className="mimari-hero-overlay" />
        <div className="mimari-hero-content">
          <span className="mimari-hero-tag">Hizmet — 02 / 03</span>
          <h1 className="mimari-hero-title">MALZEME DEPARTMANI</h1>
          <p className="mimari-hero-sub">
            Duygular Mimari Dili Konuştuğunda;<br />Mekan Bir Sanat Eserine Dönüşür.
          </p>
          <div className="mimari-hero-actions">
            <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">RANDEVU TALEP ET</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </div>
            </button>
            <Link href="/galeri" className="mimari-ghost-btn">
              <span>Galeriyi İncele</span>
              <span className="material-symbols-outlined">east</span>
            </Link>
          </div>
        </div>
        <div className="mimari-hero-scroll-hint">
          <span className="vertical-text">Aşağı Kaydır</span>
          <div className="scroll-line" />
        </div>
        <div className="mimari-hero-stats">
          <div className="mimari-stat">
            <span className="mimari-stat-num">+224</span>
            <span className="mimari-stat-label">Tamamlanan</span>
          </div>
          <div className="mimari-stat-divider" />
          <div className="mimari-stat">
            <span className="mimari-stat-num">8</span>
            <span className="mimari-stat-label">Tasarım Ödülü</span>
          </div>
          <div className="mimari-stat-divider" />
          <div className="mimari-stat">
            <span className="mimari-stat-num">10+</span>
            <span className="mimari-stat-label">Yıl Deneyim</span>
          </div>
        </div>
      </section>

      {/* MANİFESTO */}
      <section className="mimari-manifesto">
        <div className="mimari-manifesto-inner">
          <div className="mimari-manifesto-label">
            <span className="vertical-text">Manifesto</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">MALZEME FELSEFEMİZ</span>
            <blockquote className="mimari-quote">
              "İç mekan, insanın ruhunu<br />
              ayna gibi yansıtır; biz o aynayı tasarlarız."
            </blockquote>
            <p className="mimari-manifesto-text">
              DEQOIN'de iç mimari, yüzey süsleme değil derinden gelen bir psikolojik tasarım eylemidir.
              Bir odanın rengi, ışığı, dokusu ve oranları; o odada zaman geçiren kişinin zihin durumunu
              şekillendirir. Bu güçlü farkındalıkla her projeye yaklaşıyor; fonksiyonelliği asla estetikle
              kurban etmeden, mobilyayı mimariyle diyalog kuracak biçimde yerleştiriyoruz. Amaç yalnızca
              güzel değil; yaşandıkça daha değerli hale gelen mekanlar yaratmaktır.
            </p>
          </div>
        </div>
      </section>

      {/* PRENSİPLER */}
      <section className="mimari-principles">
        <div className="mimari-section-inner">
          <div className="mimari-section-header">
            <span className="section-small-label">YAKLAŞIMIMIZ</span>
            <h2 className="mimari-section-title">Dört Temel Prensip</h2>
          </div>
          <div className="mimari-principles-grid">
            {principles.map((p) => (
              <div key={p.number} className="mimari-principle-card">
                <span className="mimari-principle-num">{p.number}</span>
                <div className="mimari-principle-line" />
                <h3 className="mimari-principle-title">{p.title}</h3>
                <span className="mimari-principle-sub">{p.subtitle}</span>
                <p className="mimari-principle-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERİ */}
      <section className="mimari-gallery">
        <div className="mimari-gallery-grid">
          {galleryImages.map((img, i) => (
            <div key={i} className={`mimari-gallery-item ${i === 0 ? "featured" : ""}`}>
              <img src={img.src} alt={img.label} />
              <div className="mimari-gallery-overlay" />
              <span className="mimari-gallery-label">{img.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* UZMANLIK */}
      <section className="mimari-specialties">
        <div className="mimari-section-inner">
          <div className="mimari-specialties-header">
            <span className="section-small-label">UZMANLIK ALANLARIMIZ</span>
            <h2 className="mimari-section-title">Proje Kategorileri</h2>
          </div>
          <div className="mimari-specialties-list">
            {specialties.map((s, i) => (
              <div key={i} className="mimari-specialty-row">
                <span className="mimari-specialty-label">{s.label}</span>
                <div className="mimari-specialty-line" />
                <span className="mimari-specialty-count">{s.count} Proje</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="mimari-process">
        <div className="mimari-section-inner">
          <div className="mimari-section-header">
            <span className="section-small-label">İŞ SÜRECİMİZ</span>
            <h2 className="mimari-section-title">Projenizin Yolculuğu</h2>
          </div>
          <div className="mimari-process-steps">
            {processSteps.map((s, i) => (
              <div key={i} className="mimari-process-step">
                <div className="mimari-step-num-wrap">
                  <span className="mimari-step-num">{s.step}</span>
                  {i < processSteps.length - 1 && <div className="mimari-step-connector" />}
                </div>
                <div className="mimari-step-body">
                  <div className="mimari-step-header">
                    <h3 className="mimari-step-title">{s.phase}</h3>
                    <span className="mimari-step-duration">{s.duration}</span>
                  </div>
                  <p className="mimari-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb8oJUAbKO838Rur4GmMdhoZA52T9apeuU9wT1MD8aED3l4BUvMiWzCyCUvgmQ_hUnxgOfF8IiulBiI2jOUD_rMvhMhY5q4XF5oN3Orkq525thVCe6a7Qn84IkmcCKdp7RVHGwlMXKCQZWlSwoQRYqNQ54bsoQ6pAqtTv5QeYJjApl9fwBFVCYyWIR0fqefLofCqY7cPmi_F1xk7yjOVIZsTO7FKo0OjDyPcryEMVFbFFRsn19bmHoDjlgz-s838-TizdClIfaG6s"
            alt="CTA"
          />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKI ADIM</span>
          <h2 className="mimari-cta-title">Hayalinizi Tasarlayalım</h2>
          <p className="mimari-cta-sub">
            Yaşam alanınızı bir başyapıta dönüştürmek için ilk adımı atmaya hazır mısınız?
          </p>
          <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
            <span className="hero-cta-text">ÜCRETSİZ DANIŞMANLIK AL</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </div>
          </button>
        </div>
      </section>

      {/* DİĞER HİZMETLER */}
      <section className="mimari-other-services">
        <div className="mimari-section-inner">
          <span className="section-small-label">DİĞER HİZMETLERİMİZ</span>
          <div className="mimari-other-grid">
            <Link href="/mimari" className="mimari-other-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs" alt="Mimari" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Mimari</h3>
                <span className="vertical-text">Structural Integrity</span>
              </div>
            </Link>
            <Link href="/uygulama" className="mimari-other-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY" alt="Uygulama" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Uygulama Departmanı</h3>
                <span className="vertical-text">Precision Craft</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
