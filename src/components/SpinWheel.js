"use client";
import React, { forwardRef } from 'react';

const SpinWheel = forwardRef(({ 
  showResult, 
  suggestedFood, 
  selectedMode, 
  spinning, 
  onSpin, 
  loading, 
  disabled 
}, ref) => {

  const modeColor = selectedMode === 'online'
    ? { from: '#3b82f6', to: '#6366f1' }
    : selectedMode === 'self-cooking'
    ? { from: '#10b981', to: '#059669' }
    : { from: '#f97316', to: '#fb923c' };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 330, height: 330, flexShrink: 0 }}
    >

      {/* ====================== OUTER ROUND FRAME ====================== */}
      <div 
        className="relative rounded-full"
        style={{
          width: 300,
          height: 300,
          background: 'linear-gradient(145deg, #fbcdcd 0%, #b0c0d5 100%)',
          padding: '10px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255,255,255,1)',
        }}
      >
        {/* 1. SPINNING LAYER (Only this rotates) */}
        <div
          ref={ref}
          className="absolute inset-[5px] rounded-full overflow-hidden"
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

          {/* No Mode Selected */}
          {!selectedMode && !showResult && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              textAlign: 'center',
              padding: '0 30px',
              userSelect: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.35)' }} />
                <div style={{ 
                  width: 11, 
                  height: 11, 
                  borderRadius: '50%', 
                  background: '#f97316', 
                  boxShadow: '0 0 20px #f97316' 
                }} />
                <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.35)' }} />
              </div>

              <p style={{
                // fontFamily: "'Syne', sans-serif",
                fontSize: 29,
                fontWeight: 900,
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #bf5e5e 30%, #fed7aa 70%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}>
                Create your<br />Bowl!
              </p>

              <p style={{
                fontSize: 12.5,
                color: 'color: #000',
                color: '#000',
                margin: 0,
              }}>
                Select a mode and spin
              </p>
            </div>
          )}

          {/* Mode Selected - Ready to Spin */}
          {selectedMode && !showResult && !spinning && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              userSelect: 'none',
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.4em',
                color: selectedMode === 'online' ? '#ff1212' : '#ff1212 ',
                textTransform: 'uppercase',
              }}>
                {selectedMode === 'online' ? 'ORDER ONLINE' : 'SELF COOKING'}
              </p>

              <button
                onClick={onSpin}
                disabled={loading || disabled}
                style={{
                  background: `linear-gradient(135deg, ${modeColor.from}, ${modeColor.to})`,
                  color: '#fff',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 900,
                  fontSize: 10.5,
                  letterSpacing: '0.15em',
                  padding: '14px',
                  borderRadius: '12px', // Rectangular with slight round
                  border: 'none',
                  cursor: loading || disabled ? 'not-allowed' : 'pointer',
                  // boxShadow: `0 12px 40px ${modeColor.from}aa`,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  if (!loading && !disabled) e.currentTarget.style.transform = 'scale(1.12)';
                }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {loading ? '•••' : "SPIN NOW"}
              </button>

              <p style={{ fontSize: 11, color: 'rgb(247 10 10 / 81%)', margin: 0 }}>
                tap to spin the wheel
              </p>
            </div>
          )}

          {/* Spinning State */}
          {spinning && (
            <div style={{ position: 'relative', width: 110, height: 110 }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '5px solid rgba(255,255,255,0.2)',
                borderTopColor: '#f97316',
                borderRightColor: '#fbbf24',
                borderRadius: '50%',
                animation: 'spin-ring 0.8s linear infinite',
              }} />
              <div style={{
                position: 'absolute',
                inset: 26,
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
          )}

          {/* Result State */}
          {showResult && suggestedFood && (
            <div
              className="relative flex flex-col items-center justify-center bg-white shadow-[0_15px_40px_rgba(0,0,0,0.2)]  overflow-hidden"
              style={{ 
                width: 280, 
                height: 280,
                borderRadius: '50%',
                animation: 'pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' 
              }}
            >
              <img
                src={suggestedFood.image}
                alt={suggestedFood.name}
                style={{ 
                  position: 'absolute',
                  inset: 0,
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                }}
              />
              {/* Text Overlay for premium feel */}
              {/* <div className="absolute bottom-0 left-0 right-0 pt-8 pb-10 px-4 text-center"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
                }}
              >
                <p className="text-white font-bold text-sm m-0 leading-tight tracking-wide uppercase">
                  {suggestedFood.name}
                </p>
              </div> */}
            </div>
          )}
        </div>
      </div>

      {/* ====================== POINTER (Sharp & Premium) ====================== */}
      <div 
        className="absolute z-50"
        style={{ 
          top: -22, 
          left: '50%', 
          transform: 'translateX(-50%)' 
        }}
      >
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '32px solid #f97316',
          filter: 'drop-shadow(0 8px 18px rgba(249,115,22,0.95))',
        }} />
        {/* Pointer shine */}
        <div style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 12,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
        }} />
      </div>
    </div>
  );
});

SpinWheel.displayName = 'SpinWheel';
export default SpinWheel;