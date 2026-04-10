"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { teamFilters, teamMembers } from "../../data/team";

export default function OurTeam() {
  const [activeTeamFilter, setActiveTeamFilter] = useState<(typeof teamFilters)[number]["key"]>("all");
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const wheelLockRef = useRef(false);

  const filteredTeam = useMemo(() => {
    if (activeTeamFilter === "all") return teamMembers;
    return teamMembers.filter((item) => item.category === activeTeamFilter);
  }, [activeTeamFilter]);

  useEffect(() => {
    if (filteredTeam.length === 0) return;
    setActiveMemberIndex(0);
  }, [activeTeamFilter, filteredTeam.length]);

  useEffect(() => {
    if (filteredTeam.length === 0) return;

    const interval = window.setInterval(() => {
      setSlideDirection(1);
      setActiveMemberIndex((current) => (current + 1) % filteredTeam.length);
      setProgressKey((current) => current + 1);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [filteredTeam.length]);

  const navigateMember = (direction: number) => {
    if (filteredTeam.length === 0) return;
    setSlideDirection(direction);
    setActiveMemberIndex((current) => (current + direction + filteredTeam.length) % filteredTeam.length);
    setProgressKey((current) => current + 1);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = touchStartX.current;
    const startY = touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (startX == null || startY == null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateMember(deltaX < 0 ? 1 : -1);
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (wheelLockRef.current || filteredTeam.length === 0) return;
    if (Math.abs(event.deltaY) < 20 && Math.abs(event.deltaX) < 20) return;
    const direction = Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ? Math.sign(event.deltaY)
      : Math.sign(event.deltaX);
    if (direction === 0) return;
    wheelLockRef.current = true;
    navigateMember(direction > 0 ? 1 : -1);
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 850);
  };

  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "12rem" }}>
      <div className="section-inner" style={{ paddingBottom: "6rem" }}>
        
        <div style={{ marginBottom: "5rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>DEPARTMAN EKİPLERİ</h1>
          <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "0.8rem", letterSpacing: "0.4em", fontWeight: 300, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: "1rem" }}>
            DEQOIN Studio Ekipleri
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
          <div className="filter-bar" style={{ justifyContent: "center" }}>
            {teamFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`filter-button ${activeTeamFilter === filter.key ? "active" : ""}`}
                onClick={() => setActiveTeamFilter(filter.key)}
              >
                <span className="filter-border" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <span className="filter-text" style={{ color: 'white' }}>{filter.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="team-mobile-slider" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onWheel={handleWheel}>
          <div className="team-mobile-slider-top">
            <div className="team-mobile-counter">
              <span>{String(activeMemberIndex + 1).padStart(2, "0")}</span>
              <small>/{String(filteredTeam.length).padStart(2, "0")}</small>
            </div>
            <div className="team-mobile-progress" aria-hidden="true">
              <motion.span
                key={progressKey}
                className="team-mobile-progress-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 4.8, ease: "linear" }}
              />
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={filteredTeam[activeMemberIndex]?.id}
              className="team-mobile-slide"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                const threshold = 60;
                if (info.offset.x < -threshold) navigateMember(1);
                if (info.offset.x > threshold) navigateMember(-1);
              }}
              initial={{
                opacity: 0,
                x: slideDirection >= 0 ? 100 : -100,
                scale: 1.05,
                filter: "blur(10px) saturate(0.9)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                filter: "blur(0px) saturate(1)",
              }}
              exit={{
                opacity: 0,
                x: slideDirection >= 0 ? -100 : 100,
                scale: 0.98,
                filter: "blur(8px) saturate(0.9)",
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/departman-ekipleri" className="team-card-gallery team-mobile-card" key={filteredTeam[activeMemberIndex]?.id}>
                <div className="team-card-img">
                  <img src={filteredTeam[activeMemberIndex]?.image} alt={filteredTeam[activeMemberIndex]?.name} />
                  <div className="team-overlay" />
                  <div className="team-card-badge">{filteredTeam[activeMemberIndex]?.role}</div>
                </div>
                <div className="team-card-info">
                  <div className="team-card-copy">
                    <h3>{filteredTeam[activeMemberIndex]?.name}</h3>
                    <p>{filteredTeam[activeMemberIndex]?.role}</p>
                  </div>
                  <div className="team-card-footer">
                    <span className="team-card-index">{String(activeMemberIndex + 1).padStart(2, "0")}</span>
                    <span className="material-symbols-outlined">arrow_outward</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="team-grid team-grid-gallery">
          {filteredTeam.map((member, idx) => (
            <Link href="/departman-ekipleri" className="team-member team-card-gallery" key={member.id}>
              <div className="team-card-img">
                <img src={member.image} alt={member.name} />
                <div className="team-overlay" />
                <div className="team-card-badge">{member.role}</div>
              </div>
              <div className="team-card-info">
                <div className="team-card-copy">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <div className="team-card-footer">
                  <span className="team-card-index">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="material-symbols-outlined">arrow_outward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
