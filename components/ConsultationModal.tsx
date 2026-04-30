"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { motion, useDragControls } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConsultationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  note: string;
};

const createInitialFormData = (): ConsultationFormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  department: "",
  note: "",
});

const departmentOptions = ["Mimari", "Malzeme", "Uygulama"];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayTime = useRef<number>(0);
  const [formData, setFormData] = useState<ConsultationFormData>(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetFormState = useCallback(() => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setFormData(createInitialFormData());
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
      document.body.style.overflow = "hidden";
      return;
    }

    setIsVisible(false);
    document.body.style.overflow = "";

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const timeout = window.setTimeout(() => {
      setShouldRender(false);
      resetFormState();
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [isOpen, resetFormState]);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/writing.mp3");
    audioRef.current.volume = 0.25;
    audioRef.current.load();
  }, []);

  const playWritingSound = () => {
    if (!audioRef.current) return;

    const now = Date.now();
    if (now - lastPlayTime.current < 120) return;

    const sound = audioRef.current.cloneNode() as HTMLAudioElement;
    sound.volume = 0.25;
    sound.play().catch(() => {});
    lastPlayTime.current = now;
  };

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, shouldRender]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    playWritingSound();

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    const shouldClose = info.offset.y > 120 || info.velocity.y > 900;

    if (shouldClose) {
      onClose();
      return;
    }

    if (sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0) scale(1)";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        return;
      }

      alert("Talebiniz alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`consultation-overlay-master ${isVisible ? "open" : ""}`}
      onClick={onClose}
      aria-hidden={!isVisible}
    >
      <motion.div
        ref={sheetRef}
        className="consultation-overlay-wrapper flex flex-col"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Randevu talep formu"
        initial={{ opacity: 0, y: 56, scale: 0.985 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 40,
          scale: isVisible ? 1 : 0.985,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 240 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        <button
          type="button"
          className="consultation-sheet-grabber"
          aria-label="Formu aşağı kaydırarak kapat"
          onPointerDown={(event) => dragControls.start(event)}
        />
        <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Kapat">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="consultation-content flex min-h-[420px] flex-1 flex-col">
          {isSubmitted ? (
            <motion.div
              className="flex flex-1 flex-col items-center justify-center text-center py-16 h-full animate-in fade-in duration-700"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700">
                <Check className="h-6 w-6 stroke-[1.35] text-zinc-300" />
              </div>
              <h3 className="mb-4 text-3xl font-thin uppercase tracking-[0.2em] text-white md:text-4xl">
                TALEBİNİZ ALINDI
              </h3>
              <p className="max-w-md text-sm font-light uppercase tracking-widest leading-relaxed text-zinc-500">
                Vizyonunuzu bizimle paylaştığınız için teşekkür ederiz. Proje detaylarınızı inceleyip en kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="max-w-2xl">
                <p className="text-[0.68rem] font-light uppercase tracking-[0.55em] text-zinc-500">
                  RANDEVU TALEBİ
                </p>
                <h2 className="mt-4 text-3xl font-thin uppercase tracking-[0.18em] text-white md:text-4xl">
                  Talebinizi iletin
                </h2>
              </div>

              <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 mt-8">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Adınız"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] placeholder:text-zinc-600"
                  />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] placeholder:text-zinc-600"
                  />

                  <Input
                    type="email"
                    name="email"
                    placeholder="E-Posta Adresi"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] placeholder:text-zinc-600"
                  />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Telefon Numarası"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] placeholder:text-zinc-600"
                  />

                  <Input
                    type="text"
                    name="location"
                    placeholder="Şirket Adı / Şehir"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] placeholder:text-zinc-600"
                  />
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] text-white placeholder:text-zinc-600"
                  >
                    <option value="" disabled>
                      Departman Seçiniz
                    </option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </Select>

                  <Textarea
                    name="note"
                    placeholder="Fikirleriniz, beklentileriniz ve vizyonunuzdan bahsedin..."
                    value={formData.note}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2 min-h-[120px] border-0 border-b border-zinc-800 bg-transparent px-0 text-[0.82rem] tracking-[0.22em] placeholder:text-zinc-600"
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 border-b border-zinc-700 pb-3 text-[0.68rem] font-light uppercase tracking-[0.45em] text-white transition-colors hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "GÖNDERİLİYOR..." : "TALEBİ GÖNDER"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .animate-in.fade-in {
          animation: consultationFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes consultationFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
