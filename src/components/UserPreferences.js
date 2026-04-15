"use client";
import React, { useState } from "react";
import { OPTIONS_MAP } from "@/lib/question";

const tagColors = [
  "bg-orange-50 text-orange-600 border-orange-200",
  "bg-blue-50 text-blue-600 border-blue-200",
  "bg-green-50 text-green-600 border-green-200",
  "bg-purple-50 text-purple-600 border-purple-200",
];

export default function UserPreferences({ questionnaire, userId, updateSession }) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [editingPref, setEditingPref] = useState(null);
  const [tempAnswers, setTempAnswers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allergySearch, setAllergySearch] = useState("");
  const [localQuestionnaire, setLocalQuestionnaire] = useState(questionnaire);

  // Sync local state when external questionnaire prop changes
  React.useEffect(() => {
    setLocalQuestionnaire(questionnaire);
  }, [questionnaire]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingPref(null);
    setTempAnswers([]);
    setAllergySearch("");
  };

  const savePrefUpdate = async (questionId, newValues) => {
    if (!userId) return;

    const exists = localQuestionnaire.some(p => p.questionId === questionId);
    const updatedQuestionnaire = exists 
      ? localQuestionnaire.map(p => p.questionId === questionId ? { ...p, answer: newValues } : p)
      : [...localQuestionnaire, { questionId, answer: newValues }];

    // Optimistic UI update so the main list reflects changes immediately
    setLocalQuestionnaire(updatedQuestionnaire);

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          answers: updatedQuestionnaire,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await updateSession({ user: data.user });
      }
    } catch (error) {
      console.error("Failed to update preference:", error);
    }
  };

  const handleEditInit = (qId, answer) => {
    setEditingPref(qId);
    const currentAnswers = Array.isArray(answer) ? answer : [answer];
    const normalized = currentAnswers.map((val) => {
      if (qId === "dietType") {
        if (val === "veg") return "vegetarian";
        if (val === "non-veg") return "omnivore";
      }
      return val;
    });
    setTempAnswers(normalized);
    setIsDrawerOpen(true);
  };

  const getLabel = (qId, val) => {
    const opts = OPTIONS_MAP[qId];
    if (!opts) return val;
    const match = opts.find((o) => o.value === val) || 
                  opts.find((o) => (val === 'veg' && o.value === 'vegetarian') || (val === 'non-veg' && o.value === 'omnivore'));
    return match?.label || val;
  };

  return (
    <div className="flex flex-col gap-3 relative z-10">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <button
        onClick={() => setPreferencesOpen(!preferencesOpen)}
        className="flex items-center gap-2 px-1 w-full text-left cursor-pointer group"
      >
        <div className="w-1 h-4 bg-orange-500 rounded-full" />
        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Saved Preferences</span>
        <span className="text-[var(--text-muted)] text-[10px] font-bold ml-1">({localQuestionnaire.length})</span>
        <svg className={`w-3 h-3 text-[var(--text-muted)] ml-auto transition-transform duration-300 ${preferencesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {preferencesOpen && (
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 drawer-scroll scroll-smooth">
          {localQuestionnaire.length > 0 ? (
            localQuestionnaire.map((pref, i) => (
              <div key={i} className="bg-white/5 border border-[var(--glass-border)] rounded-2xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                    {pref.questionId.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <div className="flex gap-2">
                      <button
                        onClick={() => handleEditInit(pref.questionId, pref.answer)}
                        className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] font-black uppercase hover:bg-orange-500/20 transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                  </div>
                </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(pref.answer) ? pref.answer : [pref.answer]).map((ans, j) => (
                      <span key={j} className={`px-2 py-0.5 border rounded-lg text-[10px] font-extrabold capitalize ${tagColors[i % 4]}`}>
                        {getLabel(pref.questionId, ans)}
                      </span>
                    ))}
                  </div>
              </div>
            ))
          ) : (
            <p className="text-[var(--text-muted)] text-xs text-center py-4 italic">No preferences saved</p>
          )}
        </div>
      )}

      {/* ── Multi-Step Edit Drawer (Right side) ── */}
      {isDrawerOpen && editingPref && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer" 
            onClick={closeDrawer} 
          />
          <div 
            className="relative w-full max-w-[380px] h-fit max-h-[calc(100vh-140px)] my-auto mr-5 bg-[var(--card-bg)] shadow-2xl border border-white/10 p-8 flex flex-col gap-6 overflow-y-auto rounded-[2.5rem] drawer-scroll scroll-smooth"
            style={{ animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <div className="flex justify-between items-start flex-shrink-0">
              <div>
                <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight capitalize">
                  {editingPref.replace(/([A-Z])/g, " $1").trim()}
                </h3>
              </div>
              <button 
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >✕</button>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {/* Search bar specifically for browsing lists like Allergies and Cuisines */}
              {(editingPref === "allergies" || editingPref === "cuisine") && (
                <div className="relative">
                  <input 
                    type="text"
                    placeholder={`Search ${editingPref}...`}
                    value={allergySearch}
                    onChange={(e) => setAllergySearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-orange-500/50"
                  />
                </div>
              )}

              {/* Unified Grid: Now shows all options by default and filters when searching */}
              <div className="grid grid-cols-2 gap-3">
                {OPTIONS_MAP[editingPref]
                  ?.filter(opt => !allergySearch || opt.label.toLowerCase().includes(allergySearch.toLowerCase()))
                  .map((opt) => {
                    const isSelected = tempAnswers.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={async () => {
                          const next = editingPref === "dietType" 
                            ? [opt.value] 
                            : (isSelected ? tempAnswers.filter((v) => v !== opt.value) : [...tempAnswers, opt.value]);
                          
                          setTempAnswers(next);
                          await savePrefUpdate(editingPref, next);
                          
                          if (editingPref === "dietType") {
                            closeDrawer();
                          }
                        }}
                        className={`py-4 px-2 rounded-2xl border text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${isSelected ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:bg-white/10"}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Finish button for multi-select sections */}
            {editingPref !== "dietType" && (
              <button 
                onClick={closeDrawer}
                className="mt-2 py-4 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
              >
                Save & Finish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}