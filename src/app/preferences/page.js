"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ─── Particle dot ─────────────────────────────────────────────────────────────
function Particle({ style }) {
  return <span style={{ position:"fixed", borderRadius:"50%", pointerEvents:"none", ...style }} />;
}

// ─── Option card ──────────────────────────────────────────────────────────────
function OptionCard({ type, name, value, label, selected, onChange }) {
  const active = type === "checkbox" ? selected.includes(value) : selected === value;

  return (
    <label style={{
      position:"relative",
      display:"flex", alignItems:"center", minHeight: "clamp(30px, 4vw, 35px)",
      gap:3, padding:"  8px",
      borderRadius:"1rem", cursor:"pointer", userSelect:"none",
      transition:"transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.2s, background 0.2s",
      transform: active ? "translateY(-3px)" : "translateY(0)",
      background: active
        ? "linear-gradient(145deg, rgba(74,222,128,0.20) 0%, rgba(22,163,74,0.11) 100%)"
        : "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
      border: active ? "1px solid rgba(74,222,128,0.60)" : "1px solid rgba(255,255,255,0.10)",
      boxShadow: active
        ? "0 0 0 3px rgba(74,222,128,0.10), 0 8px 24px rgba(74,222,128,0.20)"
        : "0 2px 10px rgba(0,0,0,0.30)",
      backdropFilter:"blur(14px) saturate(150%)",
      WebkitBackdropFilter:"blur(14px) saturate(150%)",
      overflow:"hidden",
    }}>
      {active && (
        <span style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)",
          backgroundSize:"200% 100%",
          animation:"shimmer 2.2s linear infinite",
        }} />
      )}
      {active && (
        <span style={{
          position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
          width:"60%", height:1, borderRadius:9999,
          background:"linear-gradient(90deg, transparent, rgba(74,222,128,0.8), transparent)",
        }} />
      )}

      <input type={type} name={name} value={value} checked={active}
        onChange={onChange} style={{ display:"none" }} />

      {/* Custom Checkbox UI */}
      <div style={{
        width: 14, height: 14, borderRadius: 6,
        border: active ? "2px solid #4ade80" : "2px solid rgba(255,255,255,0.2)",
        background: active ? "#4ade80" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.25s ease",
        flexShrink: 0, scale: active ? "1" : "0.9"
      }}>
        {active && (
          <span style={{ 
            color: "#000", fontSize: 11, fontWeight: 900,
            animation: "dotPop 0.2s ease-out"
          }}>✓</span>
        )}
      </div>

      <span style={{
         fontSize:"clamp(10.5px, 2.5vw, 14px)", fontWeight:700,
        textAlign:"left", lineHeight:1.3, letterSpacing:"0.02em",
        textTransform:"capitalize",
        color: active ? "#fff" : "rgba(255,255,255,1)",
        transition:"color 0.2s",
      }}>
        {label.replace(/-/g," ")}
      </span>
    </label>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
function Section({ step, title, subtitle, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{
          width:14, height:14, borderRadius:8, flexShrink:0,
          background:"linear-gradient(135deg,#16a34a,#4ade80)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, fontWeight:900, color:"#000",
         
          boxShadow:"0 3px 10px rgba(74,222,128,0.35)",
        }}>{step}</span>
        <div>
          <p style={{ fontWeight:800, fontSize:"clamp(10px, 2vw, 15px)", color:"#fff", lineHeight:1.1, letterSpacing:"0.01em" }}>
            {title}
          </p>
          {subtitle && (
            <p style={{ fontSize:"clamp(8px, 2vw, 10px)", color:"rgba(255,255,255,0.30)", marginTop:2, letterSpacing:"0.03em" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Preferences() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // State for form inputs
  const [diet,      setDiet]      = useState("");
  const [allergies, setAllergies] = useState([]);
  const [goals,     setGoals]     = useState([]);
  const [cuisine,   setCuisine]   = useState([]);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState({ show: false, message: "", type: "success" });

  const toggle = (setter) => (e) => {
    const v = e.target.value;
    setter(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  };

  // Auto-hide toast logic
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSave = async () => {
    if (!diet || !session?.user?.id) return; // Ensure diet is selected and user ID exists

    setSaving(true);

    const preferencesData = [
      { questionId: "dietType", answer: [diet] },
      { questionId: "allergies", answer: allergies },
      { questionId: "healthGoals", answer: goals },
      { questionId: "cuisine", answer: cuisine },
      // Add other preference types here if needed
    ].filter(pref => pref.answer.length > 0); // Only send preferences that have answers

    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          answers: preferencesData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ show: true, message: "Preferences saved successfully! ✅", type: "success" });
        // Update the session to reflect the new questionnaire and profileComplete status
        await update({ user: { ...session.user, questionnaire: preferencesData, profileComplete: true } });
        setTimeout(() => router.push("/"), 1500); // Redirect after short delay so they see success
      } else {
        setToast({ show: true, message: data.message || "Failed to save preferences.", type: "error" });
      }
    } catch (error) {
      setToast({ show: true, message: "A connection error occurred. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const particles = [
    { width:6,  height:6,  top:"10%", left:"6%",  background:"rgba(251,146,60,0.55)",  animation:"floatA 7s ease-in-out infinite",       filter:"blur(1px)"   },
    { width:10, height:10, top:"75%", left:"5%",  background:"rgba(74,222,128,0.40)",  animation:"floatB 9s ease-in-out infinite 1s",    filter:"blur(1.5px)" },
    { width:5,  height:5,  top:"22%", left:"92%", background:"rgba(251,191,36,0.55)",  animation:"floatA 6s ease-in-out infinite 0.5s",  filter:"blur(1px)"   },
    { width:8,  height:8,  top:"82%", left:"90%", background:"rgba(248,113,113,0.40)", animation:"floatB 8s ease-in-out infinite 2s",    filter:"blur(1px)"   },
    { width:4,  height:4,  top:"50%", left:"2%",  background:"rgba(167,243,208,0.6)",  animation:"floatC 11s ease-in-out infinite 3s",   filter:"blur(0.5px)" },
    { width:7,  height:7,  top:"18%", left:"52%", background:"rgba(253,186,116,0.30)", animation:"floatC 13s ease-in-out infinite 1.5s", filter:"blur(2px)"   },
    { width:3,  height:3,  top:"62%", left:"72%", background:"rgba(110,231,183,0.70)", animation:"floatA 5s ease-in-out infinite 4s",    filter:"blur(0.5px)" },
  ];

  const dietOptions = [
    { value:"omnivore",    label:"Omnivore" },
    { value:"vegetarian",  label:"Vegetarian" },
    { value:"vegan",       label:"Vegan" },
    { value:"keto",        label:"Keto" },
    { value:"paleo",       label:"Paleo" },
    { value:"gluten-free", label:"Gluten Free" },
  ];
  const allergyOptions = [
    { value:"nuts",      label:"Nuts" },
    { value:"dairy",     label:"Dairy" },
    { value:"eggs",      label:"Eggs" },
    { value:"soy",       label:"Soy" },
    { value:"shellfish", label:"Shellfish" },
    { value:"gluten",    label:"Gluten" },
  ];
  const goalOptions = [
    { value:"weight-loss",  label:"Weight Loss" },
    { value:"muscle-gain",  label:"Muscle Gain" },
    { value:"energy",       label:"More Energy" },
    { value:"heart-health", label:"Heart Health" },
    { value:"gut-health",   label:"Gut Health" },
    { value:"balanced",     label:"Stay Balanced" },
  ];
  const cuisineOptions = [
    { value:"indian",   label:"Indian" },
    { value:"italian",  label:"Italian" },
    { value:"mexican",  label:"Mexican" },
    { value:"japanese", label:"Japanese" },
    { value:"american", label:"American" },
    { value:"thai",     label:"Thai" },
  ];

  const canSave = diet !== "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Syne:wght@700;800;900&family=Noto+Color+Emoji&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes floatA {
          0%,100%{ transform:translateY(0) translateX(0); }
          33%    { transform:translateY(-18px) translateX(8px); }
          66%    { transform:translateY(10px) translateX(-6px); }
        }
        @keyframes floatB {
          0%,100%{ transform:translateY(0) scale(1); }
          50%    { transform:translateY(-22px) scale(1.15); }
        }
        @keyframes floatC {
          0%,100%{ transform:translateY(0) translateX(0) rotate(0deg); }
          25%    { transform:translateY(-12px) translateX(10px) rotate(90deg); }
          75%    { transform:translateY(15px) translateX(-8px) rotate(-60deg); }
        }
        @keyframes cardIn {
          from{ opacity:0; transform:translateY(30px) scale(0.97); }
          to  { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%  { background-position:-200% 0; }
          100%{ background-position:200% 0; }
        }
        @keyframes dotPop {
          0%  { transform:scale(0); opacity:0; }
          100%{ transform:scale(1); opacity:1; }
        }
        @keyframes spinBtn { to{ transform:rotate(360deg); } }
        @keyframes shimmerBtn {
          0%  { background-position:-200% 0; }
          100%{ background-position:200% 0; }
        }

        .pref-card-in { animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both; }

        .save-btn {
          width:100%; padding:15px; border-radius:16px; border:none; cursor:pointer;
          font-family:'Syne',sans-serif; font-weight:800; font-size:14px;
          letter-spacing:0.08em; color:#000;
          background:linear-gradient(90deg,#22c55e 0%,#4ade80 40%,#bbf7d0 55%,#4ade80 70%,#16a34a 100%);
          background-size:200% 100%;
          box-shadow:0 8px 28px rgba(34,197,94,0.35),0 2px 8px rgba(0,0,0,0.4);
          transition:transform 0.2s, box-shadow 0.2s;
          animation: shimmerBtn 2.8s linear infinite;
        }
        .save-btn:hover:not(:disabled){ transform:translateY(-2px); box-shadow:0 12px 36px rgba(34,197,94,0.45); }
        .save-btn:active{ transform:scale(0.97); }
        .save-btn:disabled{
          opacity:0.35; cursor:not-allowed; animation:none;
          background:#14532d; color:rgba(255,255,255,0.60);
        }
      `}</style>

      {/* ── Root container ── */}
      <div style={{
        position:"relative", minHeight:"100vh", width:"100%",
        display:"flex", alignItems:"center", justifyContent:"center",
        // padding:"28px 16px",
        background:"#000",
        
        isolation:"isolate",
        overflowX:"hidden",
      }}>

        {/* ── Toast Notification ── */}
        {toast.show && (
          <div style={{
            position: "fixed", bottom: "40px", left: "50%", transform: "translateX(-50%)",
            zIndex: 1000, pointerEvents: "none", animation: "cardIn 0.4s ease-out"
          }}>
            <div style={{
              padding: "12px 24px", borderRadius: "1.2rem", backdropFilter: "blur(20px)",
              background: toast.type === "success" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
              border: `1px solid ${toast.type === "success" ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)", color: "#fff", fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap"
            }}>
              <span>{toast.type === "success" ? "✨" : "⚠️"}</span>
              {toast.message}
            </div>
          </div>
        )}

        {/* <div style={{
          position:"fixed", inset:0, zIndex:0,
          backgroundImage:"url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize:"cover",
          backgroundPosition:"center center",
          opacity:0.9,
          transform:"scale(1.05)",
        }} /> */}

        {/* Layer 1 – Cinematic Background Video */}
        {/* <video
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          preload="auto"
          src="/assets/img/video-bg-04.mp4"
          style={{
            position: "fixed", inset: 0, zIndex: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: 0.8, transform: "scale(1.05)",
            filter: "brightness(0.8) saturate(1.2)"
          }}
        /> */}

        {/* Layer 2 – blur and soft color overlay */}
        <div style={{
          position:"fixed", inset:0, zIndex:1,
          background:"rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(0px)",
        }} />

        {/* Layer 3 – colour blooms */}
        <div style={{
          position:"fixed", inset:0, zIndex:2, pointerEvents:"none",
          background:`
            radial-gradient(ellipse 55% 48% at 0% 100%, rgba(234,88,12,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 50% 42% at 100% 0%,  rgba(22,163,74,0.16) 0%, transparent 60%)
          `,
        }} />

        {/* Layer 4 – particles */}
        {particles.map((p, i) => <Particle key={i} style={{ zIndex:3, ...p }} />)}

        {/* ── Glass card ── */}
        <div
          className="pref-card-in"
          style={{
            position:"relative", zIndex:10, margin: "0 auto", 
            width:"100%", maxWidth:"min(95vw, 700px)",
            borderRadius:"3rem", padding:"clamp(20px, 5vw, 40px)",
            background:"rgba(255, 255, 255, 0.08)",
            backdropFilter:"blur(5px) saturate(360%)",
            WebkitBackdropFilter:"blur(28px) saturate(160%)",
            border:"1px solid rgba(255,255,255,0.15)",
            boxShadow:"0 50px 100px -20px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)",
          }}
        >
          {/* card top glow strip */}
          <div style={{
            position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
            width:"55%", height:1, borderRadius:9999,
            background:"linear-gradient(90deg,transparent,rgba(74,222,128,0.70),transparent)",
          }} />

          {/* ── Header ── */}
          <div style={{ marginBottom:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5, justifyContent:"between" }}>
              <div style={{
                width:30, height:30, borderRadius:14, fontSize:20,
                background:"linear-gradient(135deg,#16a34a,#4ade80)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 16px rgba(74,222,128,0.35)",

              }}>🍽️</div>
              <span style={{
                fontWeight:900, fontSize:14,
                color:"rgba(255,255,255,0.45)", letterSpacing:"0.16em", textTransform:"uppercase", fontSize:"clamp(8px, 1.5vw, 10px)"
              }}>MealMind</span>
           

            <h1 style={{
              fontWeight:900, fontSize:"clamp(20px, 4vw, 25px)",
              color:"#fff", lineHeight:1.1, letterSpacing:"-0.02em",
            }}>
              Your Kitchen,
              <span style={{
                backgroundImage:"linear-gradient(90deg,#4ade80,#bbf7d0)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text", 
              }}>Your Rules.</span>
            </h1>
             </div>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.30)", letterSpacing:"0.03em", display:"flex", justifyContent:"center" }}>
              Personalise your experience — takes 30 seconds
            </p>
          </div>

          {/* ── Sections ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

            <Section step="1" title="Diet Type" subtitle="Pick one that fits your lifestyle">
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                {dietOptions.map(o => (
                  <OptionCard key={o.value} type="radio" name="diet"
                    value={o.value} label={o.label}
                    selected={diet} onChange={e => setDiet(e.target.value)} />
                ))}
              </div>
            </Section>

            <Section step="2" title="Allergies & Restrictions" subtitle="Select all that apply">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                {allergyOptions.map(o => (
                  <OptionCard key={o.value} type="checkbox" name="allergies"
                    value={o.value} label={o.label}
                    selected={allergies} onChange={toggle(setAllergies)} />
                ))}
              </div>
            </Section>

            <Section step="3" title="Health Goals" subtitle="What are you working towards?">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                {goalOptions.map(o => (
                  <OptionCard key={o.value} type="checkbox" name="goals"
                    value={o.value} label={o.label}
                    selected={goals} onChange={toggle(setGoals)} />
                ))}
              </div>
            </Section>

            <Section step="4" title="Favourite Cuisines" subtitle="We'll prioritise these for you">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                {cuisineOptions.map(o => (
                  <OptionCard key={o.value} type="checkbox" name="cuisine"
                    value={o.value} label={o.label}
                    selected={cuisine} onChange={toggle(setCuisine)} />
                ))}
              </div>
            </Section>

            {/* Save */}
            <div>
              {!canSave && (
                <p className="text-center text-sm sm:text-base" style={{
                  color:"rgba(74,222,128)",
                  marginBottom:8, letterSpacing:"0.04em",
                }}>↑ Pick a diet type to continue</p>
              )}
              <button className="save-btn py-3 sm:py-4 text-sm sm:text-base" disabled={!canSave || saving} onClick={handleSave}>
                {saving
                  ? <span style={{
                      display:"inline-block", width:15, height:15,
                      border:"2.5px solid rgba(0,0,0,0.35)", borderTopColor:"#000",
                      borderRadius:"50%", animation:"spinBtn 0.7s linear infinite",
                    }} />
                  : "Save My Preferences →"
                }
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}