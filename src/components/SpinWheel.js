"use client";
import React, { forwardRef, useState, useEffect } from 'react';

const SpinWheel = forwardRef(({ 
  showResult, 
  suggestedFood, 
  selectedMode, 
  spinning, 
  onSpin, 
  loading, 
  disabled 
}, ref) => {
  const [quickTip, setQuickTip] = useState("");

  const tips = [
    "💡 Pro Tip: Drinking water before meals helps improve digestion.",
    "💡 Pro Tip: Using smaller plates can help with portion control.",
    "💡 Pro Tip: Eating slowly gives your brain time to realize you're full.",
    "💡 Pro Tip: Adding protein to your breakfast reduces cravings all day.",
    "💡 Pro Tip: Spices like ginger and cinnamon can naturally boost metabolism.",
    "💡 Pro Tip: Fiber-rich foods keep your gut healthy and you feeling full.",
    "💡 Pro Tip: Planning meals ahead prevents impulsive, unhealthy choices."
  ];


  useEffect(() => {
    // Set a random tip on mount
    setQuickTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  // Default image to show when not spinning and no result is yet available
  const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";
  const displayImage = showResult && suggestedFood ? suggestedFood.image : DEFAULT_FOOD_IMAGE;

  const modeColor = selectedMode === 'online'
    ? { from: '#3b82f6', to: '#6366f1' }
    : selectedMode === 'self-cooking'
    ? { from: '#10b981', to: '#059669' }
    : { from: '#f97316', to: '#fb923c' };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Local Styles for Button Pulse */}
      <style>{`
        @keyframes whiteGlowPulse {
          0% { box-shadow: 0 0 15px ${modeColor.from}66; transform: scale(1); }
          50% { box-shadow: 0 0 25px 5px rgba(255, 255, 255, 0.4), 0 0 35px ${modeColor.from}; transform: scale(1.05); }
          100% { box-shadow: 0 0 15px ${modeColor.from}66; transform: scale(1); }
        }
        .spin-button-ready {
          animation: whiteGlowPulse 2s infinite ease-in-out;
        }
      `}</style>

      <div 
      className="relative flex items-center justify-center w-full max-w-[280px] sm:max-w-[360px] md:max-w-[395px] aspect-square flex-shrink-0 mx-auto transition-all duration-300"
    >
      {/* Dynamic Background Aura Glow */}
      {selectedMode && !showResult && (
        <div 
          className="absolute inset-0 rounded-full blur-[80px] opacity-30 transition-all duration-1000 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${modeColor.from}, transparent 70%)`
          }}
        />
      )}

      {/* ====================== OUTER ROUND FRAME ====================== */}
      <div 
        className="relative rounded-full w-full h-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(200,200,200,0.2) 100%)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255,255,255,0.8)',
        }}
      >
        {/* 1. SPINNING LAYER (Only this rotates) */}
        <div
          ref={ref}
          className="absolute inset-[5px] rounded-full overflow-hidden w-[calc(100%-10px)] h-[calc(100%-10px)]" // Adjusted to fill parent
          style={{
            background: 'conic-gradient(from 0deg, #f8fafc, #f1f5f9, #e2e8f0, #f8fafc)',
            zIndex: 1,
          }}
        >
          {/* Abstract pattern to show rotation */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-conic-gradient(#4988d3 0% 30deg, transparent 30deg 60deg)`
          }} />
        </div>

        {/* 2. STATIC CONTENT LAYER (Fixed position, not round) */}
        <div className="relative w-full h-full z-10 flex items-center justify-center">
          {spinning ? (
            /* --- Spinning State --- */
            <div className="relative w-[35%] aspect-square">
              <div style={{
                position: 'absolute',
                inset: '-10%',
                border: '5px solid rgba(255,255,255,0.2)',
                borderTopColor: '#f97316',
                borderRightColor: '#fbbf24',
                borderRadius: '50%',
                animation: 'spin-ring 0.8s linear infinite',
              }} />
              <div style={{
                position: 'absolute',
                inset: '15%',
                border: '3.5px solid rgba(251,191,36,0.3)',
                borderBottomColor: '#fcd34d',
                borderRadius: '50%',
                animation: 'spin-ring 1.15s linear infinite reverse',
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 20,
                height: 20,
                background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                borderRadius: '50%',
                boxShadow: '0 0 30px #f97316',
              }} />
            </div>
          ) : (
            /* --- Default Image / Result State --- */
            <div
              className="relative flex flex-col items-center justify-center bg-neutral-100 shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden w-full h-full rounded-full border-4 border-white"
              style={{ 
                animation: showResult ? 'pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none'
              }}
            >
              <img
                src={displayImage}
                alt="Food"
                style={{ 
                  position: 'absolute',
                  inset: 0,
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: !showResult ? 'brightness(0.65) saturate(1.1)' : 'none',
                  transition: 'filter 0.5s ease'
                }}
              />

              {/* Overlay Content when NOT showing a result */}
              {!showResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                  {!selectedMode ? (
                    /* No Mode State */
                    <div className="flex flex-col items-center gap-4">
                      <p style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 'clamp(18px, 5vw, 24px)',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        background: 'linear-gradient(to bottom, #fff, #fb923c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        Create your<br />Bowl!
                      </p>
                      <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Select Mode</p>
                      </div>
                    </div>
                  ) : (
                    /* Ready to Spin State */
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase">
                        {selectedMode === 'online' ? 'Delivery Mode' : 'Chef Mode'}
                      </p>
                      <button
                        onClick={onSpin}
                        disabled={loading || disabled}
                        className={`active:scale-95 transition-transform ${!loading && !disabled ? 'spin-button-ready' : ''}`}
                        style={{
                          background: `linear-gradient(135deg, ${modeColor.from}, ${modeColor.to})`,
                          color: '#fff',
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 900,
                          fontSize: '12px',
                          letterSpacing: '0.15em',
                          padding: '12px 24px',
                          borderRadius: '14px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          cursor: loading || disabled ? 'not-allowed' : 'pointer',
                          boxShadow: `0 10px 25px ${modeColor.from}66`,
                        }}
                      >
                        {loading ? '•••' : "SPIN NOW"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ====================== POINTER (Sharp & Premium) ====================== */}
      <div 
        className="absolute z-50"
        style={{
          top: -20, // Adjusted for smaller overall size
          left: '50%', 
          transform: 'translateX(-50%)'
        }}
      >
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '20px solid #f97316', // Adjusted size
          filter: 'drop-shadow(0 8px 18px rgba(249,115,22,0.95))',
        }} />
        {/* Pointer shine */}
        <div style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)', // Adjusted for smaller overall size
          width: 7,
          height: 10,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
        }} />
      </div>
      </div>
    </div>

  );
});

SpinWheel.displayName = 'SpinWheel';
export default SpinWheel;