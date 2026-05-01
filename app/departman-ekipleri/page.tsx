"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { teamFilters, teamMembers } from "@/data/team";

type TeamFilterKey = (typeof teamFilters)[number]["key"];

export default function OurTeam() {
  const [activeFilter, setActiveFilter] = useState<TeamFilterKey>("all");

  const visibleMembers = useMemo(() => {
    if (activeFilter === "all") return teamMembers;
    return teamMembers.filter((member) => member.category === activeFilter);
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative w-full min-h-screen overflow-hidden bg-zinc-950 pt-28 pb-20">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex flex-col gap-8"
          >
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-thin uppercase tracking-[0.3em] text-white"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              EKİBİMİZ
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-[1600px] mx-auto w-full px-6 md:px-16 pb-24">
            <aside className="hidden lg:flex flex-col gap-2 sticky top-32 h-fit lg:col-span-1">
              {teamFilters.map((filter) => {
                const isActive = filter.key === activeFilter;
                return (
                  <Button
                    key={filter.key}
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      "w-full justify-start rounded-none px-0 py-1 text-2xl font-light uppercase tracking-widest transition-colors",
                      isActive
                        ? "bg-zinc-900/50 text-white hover:bg-zinc-900/50 hover:text-white"
                        : "text-zinc-500 hover:bg-transparent hover:text-white",
                    )}
                    style={{ fontFamily: "Smooch Sans, sans-serif" }}
                  >
                    {filter.title}
                  </Button>
                );
              })}
            </aside>

            <div className="lg:col-span-4">
              <div className="lg:hidden mb-8 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-2 pb-2">
                  {teamFilters.map((filter) => {
                    const isActive = filter.key === activeFilter;
                    return (
                      <Button
                        key={filter.key}
                        type="button"
                        variant="ghost"
                        onClick={() => setActiveFilter(filter.key)}
                        className={cn(
                          "shrink-0 rounded-full px-4 py-2 text-sm uppercase tracking-[0.25em] transition-colors",
                          isActive
                            ? "bg-zinc-900/50 text-white hover:bg-zinc-900/50 hover:text-white"
                            : "text-zinc-500 hover:bg-transparent hover:text-white",
                        )}
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {filter.title}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
                {visibleMembers.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                  >
                    <div className="relative w-full aspect-[3/4] min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden group cursor-pointer">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute inset-0 flex items-end p-6 md:p-8">
                        <div className="flex w-full flex-col gap-2">
                          <p
                            className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-zinc-400"
                            style={{ fontFamily: "Smooch Sans, sans-serif" }}
                          >
                            {teamFilters.find((filter) => filter.key === member.category)?.title ?? "HEPSİ"}
                          </p>
                          <h3
                            className="text-5xl md:text-6xl font-thin uppercase tracking-widest leading-none text-white"
                            style={{ fontFamily: "Smooch Sans, sans-serif" }}
                          >
                            {member.name}
                          </h3>
                          <p
                            className="mt-2 text-xs md:text-sm font-light uppercase tracking-[0.2em] text-zinc-300"
                            style={{ fontFamily: "Smooch Sans, sans-serif" }}
                          >
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
