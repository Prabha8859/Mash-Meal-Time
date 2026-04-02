"use client";
import React from 'react';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ShapeGrid  from "@/components/FloatingLines";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="w-12 h-12 border-2 border-orange-400/10 border-b-orange-400/60 rounded-full animate-spin absolute inset-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl">🔒</div>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">Access Denied</p>
        <Link href="/login" className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl font-black text-sm hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300">
          Login to Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black overflow-hidden font-[DM_Sans]">

      {/* Video Background */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
     
           <div className="absolute inset-0 z-[2]">
             <ShapeGrid 
               speed={0.2}
               squareSize={40}
               direction="diagonal"
               borderColor="rgba(0, 242, 255, 0.15)"
               hoverFillColor="rgba(0, 242, 255, 0.3)"
               shape="square"
               hoverTrailAmount={2}
             />
           </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');

        .profile-scroll::-webkit-scrollbar { width: 2px; }
        .profile-scroll::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 4px; }

        .glow-card {
          box-shadow: 
            0 0 0 1px rgba(255,255,255,0.08),
            0 32px 64px -16px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pref-card {
          transition: all 0.2s ease;
        }
        .pref-card:hover {
          border-color: rgba(249,115,22,0.3);
          background: rgba(249,115,22,0.05);
          transform: translateX(4px);
        }

        .action-btn {
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .action-btn:hover {
          transform: translateY(-2px) scale(1.01);
        }
        .action-btn:active { transform: scale(0.97); }

        .avatar-glow {
          box-shadow: 
            0 0 0 2px rgba(249,115,22,0.2),
            0 0 30px rgba(249,115,22,0.15),
            0 0 60px rgba(249,115,22,0.05);
        }

        .module-highlight {
          position: relative;
          overflow: hidden;
        }
        .module-highlight::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .tag-pill {
          transition: all 0.15s ease;
        }
        .tag-pill:hover {
          background: rgba(249,115,22,0.25);
          transform: scale(1.05);
        }

        .stat-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s ease;
        }
        .stat-box:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(249,115,22,0.2);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }

        .close-btn {
          transition: all 0.2s ease;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.15);
          transform: rotate(90deg);
        }
      `}</style>

      {/* Top bar */}
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg text-lg">🍽️</div>
          <span className="text-white font-black hidden md:block tracking-tight">
            Meal<span className="text-green-400">Mind</span>
          </span>
        </Link>
        <Link href="/" className="close-btn w-9 h-9 rounded-2xl bg-white/5 border border-white/10 text-white/50 flex items-center justify-center hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </Link>
      </header>

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-24">

        {/* ── LEFT: User Identity Card ── */}
        <div className="fade-up w-full max-w-sm">
          <div className="glow-card bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 module-highlight">

            {/* Status badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-green-300 font-black uppercase tracking-widest">Active Session</span>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden avatar-glow bg-neutral-800 border-2 border-orange-500/20">
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-gradient-to-br from-orange-500/20 to-orange-800/20 text-orange-300">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              {/* Orange ring accent */}
              <div className="absolute -inset-1 rounded-[2.2rem] border border-orange-500/20 pointer-events-none"></div>
            </div>

            {/* Name & Email */}
            <div className="text-center">
              <h1 className="text-white font-black text-3xl tracking-tight leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {session.user.name || "Chef"}
              </h1>
              <p className="text-white/35 text-sm font-medium">{session.user.email}</p>
            </div>

            {/* Quick stats */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="stat-box">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Preferences</span>
                <span className="text-white font-black text-xl">{session.user.questionnaire?.length || 0}</span>
              </div>
              <div className="stat-box">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Diet</span>
                <span className="text-orange-300 font-black text-sm capitalize truncate">
                  {session.user.questionnaire?.find(q => q.questionId === 'dietType')?.answer?.[0] || '—'}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              <Link href="/preferences" className="action-btn flex items-center justify-between w-full px-5 py-4 bg-white/[0.04] border border-white/10 rounded-2xl group hover:border-orange-500/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚙️</span>
                  <span className="text-sm text-white font-bold">Update Preferences</span>
                </div>
                <svg className="text-white/20 group-hover:text-orange-400 transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="action-btn flex items-center justify-center gap-3 w-full py-4 bg-red-500/8 border border-red-500/15 text-red-400 rounded-2xl font-black text-sm hover:bg-red-500/15 hover:border-red-500/30"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preferences Panel ── */}
        <div className="fade-up-1 w-full max-w-lg flex flex-col gap-5">

          {/* Section header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
            <p className="text-[11px] font-black text-orange-400 tracking-[0.3em] uppercase">Saved Preferences</p>
            {session.user.questionnaire?.length > 0 && (
              <span className="ml-auto text-[10px] text-white/20 font-bold">{session.user.questionnaire.length} saved</span>
            )}
          </div>

          {/* Preferences cards */}
          <div className="glow-card bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 module-highlight max-h-[420px] overflow-y-auto profile-scroll">
            {session.user.questionnaire?.length > 0 ? (
              session.user.questionnaire.map((pref, i) => (
                <div
                  key={i}
                  className="pref-card bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <p className="text-[9px] text-orange-400/70 font-black uppercase tracking-[0.25em] mb-2">
                    {pref.questionId.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(pref.answer) ? pref.answer.map((ans, idx) => (
                      <span key={idx} className="tag-pill px-3 py-1 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded-lg text-[11px] font-bold capitalize">
                        {ans}
                      </span>
                    )) : (
                      <span className="text-white/70 text-sm font-bold capitalize">{pref.answer}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <span className="text-4xl opacity-30">🍽️</span>
                <p className="text-white/20 text-sm font-medium">No preferences saved yet.</p>
                <Link href="/preferences" className="text-orange-400 text-xs font-bold hover:text-orange-300 transition-colors">
                  Set up preferences →
                </Link>
              </div>
            )}
          </div>

          {/* Health Goals Highlight */}
          {session.user.questionnaire?.find(q => q.questionId === 'healthGoals' || q.questionId === 'weightGoal') && (
            <div className="fade-up-2 glow-card bg-gradient-to-br from-orange-500/[0.08] to-orange-800/[0.04] backdrop-blur-3xl border border-orange-500/15 rounded-[2rem] p-6 module-highlight">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🎯</span>
                <p className="text-[10px] font-black text-orange-400 tracking-[0.25em] uppercase">Health Goals</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(session.user.questionnaire
                  ?.find(q => q.questionId === 'healthGoals' || q.questionId === 'weightGoal')
                  ?.answer || []).map((goal, i) => (
                  <span key={i} className="px-4 py-2 bg-orange-500/15 border border-orange-400/25 text-orange-200 rounded-xl text-sm font-bold capitalize">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-white/15 text-xs font-medium px-2 fade-up-3">
            Your preferences power personalized meal recommendations
          </p>
        </div>
      </div>
    </div>
  );
}