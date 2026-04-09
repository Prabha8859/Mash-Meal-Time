"use client";

import React from "react";

export const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;800&display=swap');

    :root {
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --card-inner-bg: rgba(255, 255, 255, 0.9);
      --text-main: #0f172a;
      --text-muted: #64748b;
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(0, 0, 0, 0.33);
        --card-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.08), inset 0 0 20px rgba(255,255,255,0.5);

      --glow-opacity: 0.1;

       --card-border: rgba(160, 160, 160, 1);
     
      --card-border: rgba(0, 0, 0, 0.08);
    }

    .dark {
      --bg-color: #020617;
      --card-bg: rgba(7, 24, 46, 0.8);
      --card-inner-bg: rgba(3, 6, 10, 0.7);
      --text-main: #ffffff;
      --text-muted: rgba(255, 255, 255, 0.5);
      --glass-bg: rgba(255, 255, 255, 0.11);
      --glass-border: rgba(255, 255, 255, 0.24);
      --card-shadow: 0 0 40px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(0,0,0,0.2);
      --glow-opacity: 0.4;
      --card-border: rgba(255, 255, 255, 0.15);
    }

    /* --- Common Animations --- */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin-loader { to { transform: rotate(360deg); } }
    @keyframes spin-ring { to { transform: rotate(360deg); } }
    @keyframes pop-in {
      from { opacity: 0; transform: scale(0.75) rotate(-15deg); }
      to { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes nameReveal {
      from { opacity: 0; transform: translateY(5px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* --- Reusable Design Tokens --- */
    .glass-card {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1.5px solid var(--glass-border);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .drawer-overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(6px);
      display: flex; justify-content: flex-end;
    }

    .drawer-panel {
      width: 100%; max-width: 300px; /* Adjusted max-width */
      height: 100%; margin: 0; /* Full height and no margin on small screens */
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 24px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      padding: 30px 24px; display: flex; flex-direction: column; gap: 24px;
      animation: slideInRight 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
    }
    @media (min-width: 640px) { /* sm breakpoint */
      .drawer-panel {
        height: calc(100% - 40px); margin: 20px; /* Revert to original on larger screens */
      }
    }

    /* UI Elements */
    .mode-pill {
      font-weight: 800; font-size: 12px; letter-spacing: 0.05em;
      padding: 9px 20px; border-radius: 999px; cursor: pointer;
      border: 1.5px solid rgba(255, 255, 255, 0.13);
      background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.45);
      transition: all 0.22s ease; white-space: nowrap;
    }
    .mode-pill:hover { background: rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.85); }
    .mode-pill.active-online {
      background: rgba(37, 99, 235, 0.3); border-color: rgba(96, 165, 250, 0.7);
      color: #fff; box-shadow: 0 0 18px rgba(59, 130, 246, 0.4);
    }
    .mode-pill.active-cook {
      background: rgba(21, 128, 61, 0.3); border-color: rgba(74, 222, 128, 0.7);
      color: #fff; box-shadow: 0 0 18px rgba(22, 163, 74, 0.4);
    }

    .action-pill {
      font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 12px;
      padding: 9px 20px; border-radius: 999px; cursor: pointer;
      border: 1.5px solid rgba(255, 255, 255, 0.11);
      background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.5);
      transition: all 0.22s ease; white-space: nowrap;
    }
    .action-pill-reject:hover {
      background: rgba(239, 68, 68, 0.22); border-color: rgba(248, 113, 113, 0.6);
      color: #fff; box-shadow: 0 0 16px rgba(239, 68, 68, 0.3);
    }
    .action-pill-confirm:hover {
      background: rgba(22, 163, 74, 0.25); border-color: rgba(74, 222, 128, 0.6);
      color: #fff; box-shadow: 0 0 16px rgba(22, 163, 74, 0.3);
    }

    .ingr-chip { 
      transition: all 0.18s ease; cursor: pointer; 
      display: flex; align-items: center; user-select: none;
    }
    .ingr-chip:hover { transform: translateY(-1px); }

    .font-syne { font-family: 'Syne', sans-serif; }
    .font-dm { font-family: 'DM Sans', sans-serif; }
    .font-playfair { font-family: 'Playfair Display', serif; }
  `}</style>
);