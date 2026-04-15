import Link from "next/link";

// NOTE: Replace these URLs with your imported images
// import pizzaImg from '@/assets/pizza.png';
const FLOATING_ICONS = [
  // Left Side
  // { src: "/assets/img/img-01.png", size: 85, style: { top: '190px', left: '90px' }, delay: '0s' },
  // { src: "/assets/img/img-02.png", size: 85, style: { bottom: '-100px', left: '5px' }, delay: '1.5s' },
  
  // // Right Side
  // { src: "/assets/img/img-04.png", size: 75, style: { top: '190px', right: '90px' }, delay: '0.8s' },
  // { src: "/assets/img/img-03.png", size: 75, style: { bottom: '-80px', right: '5px' }, delay: '2.2s' },
  // { src: "/assets/img/m-1.png", size: 75, style:{bottom:'-40px', left:'335px'}, delay: '1.5s'}
];

export default function Hero({ timeLeft, onClearFilters, onOpenFilters }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .hero-root {  position: relative; }

        .hero-filter-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hero-filter-btn:hover { transform: scale(1.12) rotate(16deg); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }

        .hero-cta-btn {
          position: relative; overflow: hidden;
          transition: all 0.25s ease;
        }
        .hero-cta-btn::before {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0.4s ease;
        }
        .hero-cta-btn:hover::before { left: 100%; }
        .hero-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(22,163,74,0.4) !important; }
        .hero-cta-btn:active { transform: scale(0.97); }

        @keyframes floatImage {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>

      <div className="hero-root w-full flex flex-col relative mb-2" style={{ minHeight: '90px' }}>
        
        {/* ── Floating Images (Absolute Positioning) ── */}
        {FLOATING_ICONS.map((icon, i) => (
          <img
            key={i}
            src={icon.src}
            alt="food-icon"
            className="absolute select-none pointer-events-none"
            style={{
              width: icon.size,
              height: icon.size,
              animation: `floatImage 4s ease-in-out ${icon.delay} infinite`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              zIndex: 10,
              ...icon.style
            }}
          />
        ))}

        {/* ── HEADER CONTENT ── */}
        <div className="w-full flex items-start justify-between z-20">

          {/* Left: Text Content (Pushed slightly to avoid overlap with left icons if needed) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 10 }}>
            {/* Badge */}
            {/* <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', borderRadius: 50,
              background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
              border: '1.5px solid #fde68a',
              alignSelf: 'flex-start',
            }}>
              <span style={{ fontSize: 13 }}>🍽️</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Food Engine
              </span>
            </div> */}

            {/* Heading & Subtitle moved here */}
            <div className="mt-2">
              <h2 style={{
                // fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(24px, 5vw, 34px)',
                fontWeight: 800, color: '#ffffff', // Changed to white for better visibility on dark bg
                margin: 0, lineHeight: 1.1,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                Let fate decide
              </h2>
              <p style={{ fontSize: 14, color: '#e5e7eb', fontWeight: 500, margin: '4px 0 0 0', maxWidth: '240px' }}>
                Spin the wheel — no more indecision!
              </p>
            </div>
          </div>

          {/* Right: Actions (Timer + Filter) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, zIndex: 30, cursor:'pointer' }}>
            <button
              onClick={onOpenFilters}
              className="hero-filter-btn"
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#ffffff', color: '#1a1a1a',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <svg onClick={onOpenFilters} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>

            {timeLeft != null && timeLeft > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 50,
                background: 'rgba(255, 247, 237, 0.95)', border: '1px solid #fed7aa',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ea580c' }}>⏳ {timeLeft}s</span>
                <button onClick={onClearFilters} style={{ color: '#f97316', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
