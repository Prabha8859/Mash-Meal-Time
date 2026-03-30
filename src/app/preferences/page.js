"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MultiReuse from "@/components/Multireuse"; 
import { preferenceQuestions } from "@/data/questions"; 

export default function Preferences() {
  const [answers, setAnswers] = useState({
    dietType: "",
    spiceLevel: "",
    allergies: [],
    // healthSuggestions: "",
    weightGoal: "",
  });
  
  // Initialize answers dynamically based on questions to avoid key mismatches
  useEffect(() => {
    const initialAnswers = {};
    preferenceQuestions.forEach(q => {
      initialAnswers[q.name] = q.type === "checkbox" ? [] : "";
    });
    setAnswers(initialAnswers);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSkipMsg, setShowSkipMsg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const currentQuestion = preferenceQuestions[currentIndex];
  const hasAnsweredCurrent = currentQuestion?.type === "checkbox" 
    ? answers[currentQuestion?.name]?.length > 0 
    : answers[currentQuestion?.name] !== "";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentSelection = answers[name] || [];
      
      if (checked) {
        if (name === "allergies" && currentSelection.length >= 5) {
          alert("Maximum 5 selections allowed ❌");
          return;
        }
        setAnswers((prev) => ({
          ...prev,
          [name]: [...currentSelection, value],
        }));
      } else {
        setAnswers((prev) => ({
          ...prev,
          [name]: currentSelection.filter((item) => item !== value),
        }));
      }
    } else {
      setAnswers((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (currentIndex < preferenceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    setShowSkipMsg(true);
    setTimeout(() => setShowSkipMsg(false), 3000);
    if (currentIndex < preferenceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!session || !session.user) {
      router.push("/register");
      return;
    }

    setIsSaving(true);
    const userId = session.user.id;

    // Dynamically build payload from the current answers state
    const answersPayload = Object.entries(answers)
      .map(([key, value]) => ({
        questionId: key,
        answer: Array.isArray(value) ? value : [value]
      }))
      .filter((a) => a.answer.length > 0 && a.answer[0] !== "");

    if (answersPayload.length === 0) {
      alert("Please answer at least one question before finishing.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          answers: answersPayload
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save preferences.");

      
      await update({
        ...session,
        user: {
          ...session.user,
          profileComplete: true,
          questionnaire: answersPayload,
        },
      });

      alert("Preferences Saved Successfully ✅");
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black font-dm selection:bg-green-500/20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40 scale-105"
          alt="bg"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-orange-950/20" />
      </div>

      {/* Skip Notification Message */}
      {showSkipMsg && (
        <div className="absolute top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2">
            <span className="text-orange-400">ℹ️</span>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest">Question Skipped</p>
          </div>
        </div>
      )}

      <div className="glass-card relative z-10 w-full max-w-xl h-[85vh] sm:h-[75vh] mx-4 rounded-[3.5rem] flex flex-col overflow-hidden shadow-2xl border border-white/10 backdrop-blur-3xl">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5 flex-shrink-0">
          <div 
            className="h-full bg-green-500 transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
            style={{ width: `${((currentIndex + 1) / preferenceQuestions.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-8 py-4">
          <h1 className="font-syne text-3xl sm:text-4xl font-black text-white leading-tight tracking-tighter uppercase">
            Personalize Your <span className="text-green-400 italic">Palate</span>
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              Discovery Mode — Step {currentIndex + 1}
            </span>
          </div>
        </div>

        {/* Questions Body - Mapping questions based on current index */}
        <div className="flex-1 px-10 py-2 overflow-y-auto custom-scrollbar">
          <div className="h-full animate-in fade-in slide-in-from-right-4 duration-500">
            {preferenceQuestions.map((q, index) => (
              index === currentIndex && (
                <div key={q.name} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-black border border-white/10 text-green-400 shadow-inner">
                      {index + 1}
                    </div>
                    <h2 className="text-xl font-bold text-white/95 tracking-tight leading-snug">{q.title}</h2>
                  </div>
                  <div className="mt-4">
                    <MultiReuse
                      type={q.type}
                      title=""
                      name={q.name}
                      options={q.options}
                      selected={answers[q.name]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex gap-2">
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer active:scale-90"
              >
                ←
              </button>
            )}
          <button
            onClick={handleSkip}
            className="px-6 py-4 rounded-2xl text-white/30 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-orange-400 hover:bg-white/5 transition-all cursor-pointer"
          >
            Skip Question
          </button>
          </div>

          <button
            onClick={handleNext}
            disabled={isSaving || (!hasAnsweredCurrent && currentIndex === preferenceQuestions.length - 1 && Object.values(answers).every(v => v === "" || v.length === 0))}
            className={`font-syne font-black px-12 py-4.5 rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer uppercase tracking-wider text-xs flex items-center gap-2
              ${hasAnsweredCurrent ? "bg-white text-black hover:bg-green-400" : "bg-white/10 text-white/40 border border-white/10"}`}
          >
            {isSaving ? "Finalizing..." : (currentIndex === preferenceQuestions.length - 1 ? "Finish Setup ✓" : "Next Step →")}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
