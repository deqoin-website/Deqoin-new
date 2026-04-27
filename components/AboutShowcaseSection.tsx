"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AboutShowcaseSection() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

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
          <h2
            className="text-6xl md:text-8xl font-thin text-white tracking-tight mb-6"
            style={{ fontFamily: "var(--font-smooch), sans-serif" }}
          >
            Sizin hikayeniz, sizin mekanınız.
          </h2>

          <p
            className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-smooch), sans-serif" }}
          >
            Biz deqoin'i kurarken tek bir inancımız vardı: Bir ev, sadece dört duvar ve eşyalardan
            ibaret olamaz. Bu yüzden mimarinin teknik gücünü, sizin kişisel zevklerinizle ve yaşam
            tarzınızla harmanlıyoruz. Hayatınıza dokunan, içinde kendinizi huzurlu hissedeceğiniz ve
            yıllara meydan okuyan sıcak yaşam alanları tasarlıyoruz. Kısacası, sizin hikayenizi
            mekanlara yansıtıyoruz.
          </p>

          <div>
            <Button
              className="bg-white text-black hover:bg-zinc-200 hover:text-black rounded-full px-8 py-6 text-lg font-medium transition-all duration-300"
              onClick={() => router.push("/faaliyet-alanlarimiz")}
            >
              <span style={{ fontFamily: "var(--font-smooch), sans-serif" }}>
                Design &amp; Collection -&gt;
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
              src="/images/about_interior.png"
              alt="deqoin atölye ve kütüphane iç mekanı"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
