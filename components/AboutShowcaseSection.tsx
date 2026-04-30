"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CURRENT_ABOUT_CONTENT } from "@/lib/about-content";

export default function AboutShowcaseSection() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [content, setContent] = useState(CURRENT_ABOUT_CONTENT);

  useEffect(() => {
    let active = true;

    const fetchContent = async () => {
      try {
        const res = await fetch("/api/admin/content/corporate/about", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!active || !data) return;

        setContent({
          ...CURRENT_ABOUT_CONTENT,
          title: data.title || CURRENT_ABOUT_CONTENT.title,
          description: data.description || CURRENT_ABOUT_CONTENT.description,
          image: data.image || CURRENT_ABOUT_CONTENT.image,
          subtitle: data.subtitle || CURRENT_ABOUT_CONTENT.subtitle,
        });
      } catch (error) {
        console.error("About content load error:", error);
      }
    };

    void fetchContent();

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        void fetchContent();
      }
    }, 15000);

    const handleFocus = () => {
      if (!document.hidden) {
        void fetchContent();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full h-screen snap-center snap-always flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          variants={{
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="order-1 flex flex-col justify-center lg:pr-8"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
            {content.subtitle}
          </p>

          <h2
            className="text-6xl md:text-8xl font-thin text-white tracking-tight mb-6"
            style={{ fontFamily: "var(--font-smooch), sans-serif" }}
          >
            {content.title}
          </h2>

          <p
            className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-smooch), sans-serif" }}
          >
            {content.description}
          </p>

          <div>
            <Button
              className="bg-white text-black hover:bg-zinc-200 hover:text-black rounded-full px-8 py-6 text-lg font-medium transition-all duration-300"
              onClick={() => router.push("/hakkimizda")}
            >
              <span style={{ fontFamily: "var(--font-smooch), sans-serif" }}>
                Hakkımızda
              </span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          variants={{
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="order-2 lg:order-none"
        >
          <div className="relative w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden">
            <img
              src={content.image}
              alt="deqoin atölye ve kütüphane iç mekanı"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
