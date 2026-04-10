"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { teamFilters, teamMembers } from "../../data/team";

export default function OurTeam() {
  const [activeTeamFilter, setActiveTeamFilter] = useState<(typeof teamFilters)[number]["key"]>("all");

  const filteredTeam = useMemo(() => {
    if (activeTeamFilter === "all") return teamMembers;
    return teamMembers.filter((item) => item.category === activeTeamFilter);
  }, [activeTeamFilter]);

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
