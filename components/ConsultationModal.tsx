"use client";

import { useState } from "react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { id: 1, title: "Kişisel Bilgiler", subtitle: "Kendinizi tanıtın" },
  { id: 2, title: "Detaylar", subtitle: "Size nasıl ulaşabiliriz?" },
  { id: 3, title: "Hizmet Seçimi", subtitle: "Hangi alanda uzmanlığımıza ihtiyacınız var?" },
];

const departments = [
  {
    id: "mimarlik",
    label: "Mimarlık Departmanı",
    subCategories: [
      "Mimarlık",
      "İç Mimarlık",
      "Restorasyon Mimarlığı",
      "Peyzaj Mimarlığı",
      "İnşaat Mühendisliği",
      "Elektrik ve Elektronik Mühendisliği",
      "Plan ve Proje",
    ],
  },
  {
    id: "malzeme",
    label: "Malzeme Departmanı",
    subCategories: [
      "İç Mekan Tasarımı",
      "Mobilya & Doku Seçimi",
      "Aydınlatma Tasarımı",
      "Konsept Geliştirme",
    ],
  },
  {
    id: "uygulama",
    label: "Uygulama Departmanı",
    subCategories: [
      "Anahtar Teslim İnşaat",
      "Saha Yönetimi & Denetim",
      "Renovasyon & Restorasyon",
      "Peyzaj Uygulama",
    ],
  },
];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    city: "Nevşehir",
    department: "",
    subCategory: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "department") {
        newData.subCategory = "";
      }
      return newData;
    });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      nextStep();
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsSuccess(true);
          // 4 saniye sonra veya kapatınca resetlenebilir
        } else {
          alert("Talebiniz alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`consultation-overlay-master ${isOpen ? "open" : ""}`}>
      <div className="consultation-overlay-wrapper" style={{ maxWidth: '700px' }}>
        <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Kapat">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="consultation-content">
          {isSuccess ? (
            <div className="success-view-container" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div className="success-icon-wrap" style={{ marginBottom: '2rem' }}>
                <div className="check-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#fff' }}>check</span>
                </div>
              </div>
              <h2 className="consultation-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                Talebiniz Alındı
              </h2>
              <p className="consultation-subtitle" style={{ maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: '1.8' }}>
                Sayın {formData.firstName} {formData.lastName}, randevu talebiniz başarıyla ekibimize iletildi. 
                Profesyonel ekibimiz en kısa sürede sizinle iletişime geçecektir.
              </p>
              <button 
                className="premium-all-btn submit-btn-invert" 
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    setIsSuccess(false);
                    setCurrentStep(1);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      company: "",
                      city: "Nevşehir",
                      department: "",
                      subCategory: "",
                      note: "",
                    });
                  }, 500);
                }}
                style={{ margin: '0 auto', minWidth: '200px' }}
              >
                <span className="premium-btn-text">TEKRAR DÖN</span>
              </button>
            </div>
          ) : (
            <>
              {/* STEP INDICATOR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    width: '40px',
                    height: '2px',
                    background: step <= currentStep ? '#fff' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.4s ease'
                  }}
                />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.5 }}>
              0{currentStep} / 03
            </span>
          </div>

          <h2 className="consultation-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {steps[currentStep - 1].title}
          </h2>
          <p className="consultation-subtitle" style={{ marginBottom: '3rem' }}>
            {steps[currentStep - 1].subtitle}
          </p>

          <form className="consultation-form" onSubmit={handleSubmit}>
            {/* STEP 1: PERSONAL */}
            {currentStep === 1 && (
              <div className="form-group-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-row">
                  <div className="form-group half">
                    <input
                      type="text"
                      name="firstName"
                      className="consultation-input"
                      placeholder="Adınız"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <input
                      type="text"
                      name="lastName"
                      className="consultation-input"
                      placeholder="Soyadınız"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="consultation-input"
                    placeholder="E-Posta Adresi"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {currentStep === 2 && (
              <div className="form-group-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    className="consultation-input"
                    placeholder="Telefon Numarası"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <input
                      type="text"
                      name="company"
                      className="consultation-input"
                      placeholder="Şirket Adı (İsteğe Bağlı)"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group half">
                    <input
                      type="text"
                      name="city"
                      className="consultation-input"
                      placeholder="Şehir"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SERVICE */}
            {currentStep === 3 && (
              <div className="form-group-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <select
                    name="department"
                    className="consultation-input select-style"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled hidden>Departman Seçiniz</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.label}</option>
                    ))}
                  </select>
                </div>
                
                {formData.department && (
                  <div className="form-group">
                    <select
                      name="subCategory"
                      className="consultation-input select-style"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled hidden>Alt Dal Seçiniz</option>
                      {departments.find(d => d.id === formData.department)?.subCategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                    HAYALİNİZDEKİ PROJEYİ BİZE ANLATIN
                  </p>
                  <textarea
                    name="note"
                    className="consultation-input consultation-textarea"
                    placeholder="Fikirleriniz, beklentileriniz ve vizyonunuzdan bahsedin..."
                    value={formData.note}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  className="premium-all-btn"
                  onClick={prevStep}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', flex: 1, color: '#fff' }}
                >
                  <span className="material-symbols-outlined premium-btn-icon" style={{ marginLeft: 0, marginRight: '1rem', transform: 'rotate(180deg)', color: '#fff' }}>east</span>
                  <span className="premium-btn-text" style={{ color: '#fff' }}>GERİ</span>
                </button>
              )}
              <button
                type="submit"
                className="premium-all-btn submit-btn-invert"
                style={{ flex: 2 }}
              >
                <span className="premium-btn-text">
                  {isSubmitting ? "GÖNDERİLİYOR..." : (currentStep === 3 ? "TALEBİ GÖNDER" : "DEVAM ET")}
                </span>
                <span className="material-symbols-outlined premium-btn-icon">east</span>
              </button>
            </div>
          </form>
          </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .form-group-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .success-view-container {
          animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .check-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .check-circle::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shine 2s infinite;
        }
        @keyframes shine {
          to { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
