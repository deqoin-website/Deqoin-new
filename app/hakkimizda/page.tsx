import AboutShowcaseSection from "@/components/AboutShowcaseSection";
import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <main className="hakkimizda-snap-shell w-full min-h-screen bg-zinc-950 flex flex-col relative overflow-x-hidden pt-0 pb-0">
      <section className="snap-section relative w-full min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(204,168,131,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,#080808_0%,#040404_100%)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-28 md:px-12 lg:py-36">
          <h1
            className="text-[clamp(4rem,10vw,10rem)] font-thin uppercase leading-[0.9] tracking-[0.14em] text-white text-center"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            HAKKIMIZDA
          </h1>
        </div>
      </section>
      <section className="snap-section hakkimizda-showcase-snap">
        <AboutShowcaseSection />
      </section>
      <div className="homepage-footer-snap hakkimizda-footer-snap">
        <Footer />
      </div>
    </main>
  );
}
