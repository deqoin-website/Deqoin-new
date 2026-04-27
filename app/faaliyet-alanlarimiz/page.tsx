import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const serviceCards = [
  {
    href: "/mimari",
    title: "Design Studio",
    subTitle: "Mimari Tasarım",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs",
  },
  {
    href: "/materyal-studyo",
    title: "Material Studio",
    subTitle: "Ürün ve Malzeme",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
  },
  {
    href: "/uygulama",
    title: "Execution Studio",
    subTitle: "Uygulama Hizmetleri",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
  },
];

export default function FaaliyetAlanlarimiz() {
  return (
    <main className="w-full min-h-screen bg-zinc-950 flex flex-col relative overflow-x-hidden pt-32 pb-32">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col items-center justify-center gap-2 mb-12 shrink-0 z-10">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-thin text-white uppercase tracking-[0.2em] text-center leading-none"
          style={{ fontFamily: "Smooch Sans, sans-serif" }}
        >
          DESIGN & COLLECTION
        </h1>
        <p className="text-xs md:text-sm tracking-[0.4em] text-zinc-400 uppercase text-center mt-4">
          STUDIO SELECTION
        </p>
      </div>

      <div className="w-full max-w-[1800px] mx-auto pl-6 md:pl-16 flex-1 flex items-center z-10">
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="ml-0">
            {serviceCards.map((item) => (
              <CarouselItem
                key={item.title}
                className="pl-0 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3"
              >
                <Link href={item.href} className="block">
                  <div className="relative w-full h-[68vh] md:h-[78vh] lg:h-[85vh] max-h-[920px] rounded-none overflow-hidden group cursor-pointer border-r border-zinc-900/50">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                      alt={item.title}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col gap-2 z-10">
                      <h3
                        className="text-4xl md:text-5xl lg:text-6xl font-thin text-white uppercase tracking-widest leading-none"
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm tracking-[0.3em] text-zinc-300 font-light uppercase mt-2">
                        {item.subTitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </main>
  );
}
