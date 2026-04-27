"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AboutUs() {
  const shouldReduceMotion = useReducedMotion();
  const imageSrc = "/images/workflow/hakkimizda-home.png";

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 py-24 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid flex-1 items-center gap-y-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-24">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            variants={fadeUp}
            className="order-1 max-w-3xl font-smooch text-[clamp(4.5rem,10vw,10rem)] font-thin leading-[0.88] tracking-[-0.06em] text-white lg:col-start-1 lg:row-start-1 lg:pr-8"
          >
            Geleneklerin ötesinde.
          </motion.h1>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            variants={fadeUp}
            className="order-2 lg:col-start-2 lg:row-start-1"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 sm:aspect-[16/10] lg:aspect-[4/5]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
                style={{ backgroundImage: `url(${imageSrc})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/35 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            variants={fadeUp}
            className="order-3 max-w-2xl font-smooch text-[clamp(1.35rem,2vw,1.8rem)] font-light leading-[1.55] tracking-[-0.02em] text-zinc-300 lg:col-start-1 lg:row-start-2 lg:pr-8"
          >
            Mimarlığın yaşayan bir varlık olduğu ilkesiyle kurulan deqoin, yapı mühendisliğinin soğuk
            hassasiyetini, kişiye özel iç mekanların sıcak ruhuyla birleştiriyor. Biz sadece ev inşa
            etmiyoruz; atmosferler kurguluyoruz. Her proje benzersiz bir monolittir; kimliğin ve
            zamansızlığın tekil, uyumlu bir ifadesidir.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            variants={fadeUp}
            className="order-4 pt-2 lg:col-start-1 lg:row-start-3 lg:pr-8"
          >
            <Button
              asChild
              variant="ghost"
              className="h-auto rounded-none bg-transparent px-0 py-0 font-smooch text-[1.15rem] font-light tracking-[0.12em] text-white hover:bg-transparent hover:text-zinc-300"
            >
              <Link href="/faaliyet-alanlarimiz">Design &amp; Collection -&gt;</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
