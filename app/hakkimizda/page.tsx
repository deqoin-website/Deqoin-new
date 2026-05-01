import AboutShowcaseSection from "@/components/AboutShowcaseSection";
import Footer from "@/components/Footer";
import { CURRENT_ABOUT_CONTENT } from "@/lib/about-content";

export default function AboutUs() {
  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(204,168,131,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,#080808_0%,#040404_100%)]" />
        <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-28 md:px-12 lg:grid-cols-2 lg:gap-16 lg:py-36">
          <div className="space-y-8">
            <p
              className="text-[0.62rem] uppercase tracking-[0.55em] text-white/45"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              {CURRENT_ABOUT_CONTENT.subtitle}
            </p>

            <h1
              className="max-w-4xl text-[clamp(4rem,9vw,9rem)] font-thin uppercase leading-[0.9] tracking-[0.12em] text-white"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              {CURRENT_ABOUT_CONTENT.title}
            </h1>

            <p className="max-w-2xl text-sm leading-7 tracking-[0.18em] text-white/72 md:text-base">
              {CURRENT_ABOUT_CONTENT.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {CURRENT_ABOUT_CONTENT.stats.map((stat) => (
                <div key={stat.label} className="border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
                  <p
                    className="text-[0.58rem] uppercase tracking-[0.45em] text-white/45"
                    style={{ fontFamily: "Smooch Sans, sans-serif" }}
                  >
                    {stat.label}
                  </p>
                  <p className="mt-3 text-sm uppercase tracking-[0.28em] text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(204,168,131,0.12),transparent_62%)] blur-2xl" />
            <div className="relative overflow-hidden border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={CURRENT_ABOUT_CONTENT.image}
                  alt={CURRENT_ABOUT_CONTENT.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <AboutShowcaseSection />
      <Footer />
    </>
  );
}
