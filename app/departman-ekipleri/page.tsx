"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex flex-col gap-8"
          >
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-thin uppercase tracking-[0.3em] text-white"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              EKİBİMİZ
            </h1>

            <div className="flex flex-wrap gap-3">
              {teamFilters.map((filter) => {
                const isActive = filter.key === activeFilter;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm uppercase tracking-[0.28em] transition-colors",
                      isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300",
                    )}
                    style={{ fontFamily: "Smooch Sans, sans-serif" }}
                  >
                    <span className={cn("pb-1", isActive && "border-b border-white")}>
                      {filter.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleMembers.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
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
      </section>
    </main>
  );
}
