"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/app/ThemeProvider';

export default function ShareCardCanvas({ food, user, onClose }) {
  const canvasRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger a fresh random generation
  const { theme } = useTheme();

  useEffect(() => {
    if (!food || !user) return;
    const drawCard = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const w = 800;
      const h = 1000;
      canvas.width = w;
      canvas.height = h;

      // Main Food Image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';

      // Paper Texture Overlay
      const paperImg = new Image();
      paperImg.crossOrigin = "anonymous";
      paperImg.src = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80';

      try {
        // Wait for main food image and paper texture to load
        await Promise.all([
          new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; }),
          new Promise((resolve, reject) => { paperImg.onload = resolve; paperImg.onerror = reject; })
        ]);

        // 1. Monochrome Background Generation
        const baseBgColor = theme === 'dark' ? '#1a1a1a' : '#f0f0f0';
        const accentColor1 = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        const accentColor2 = theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
        const overlayColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)';

        ctx.fillStyle = baseBgColor;
        ctx.fillRect(0, 0, w, h);

        // Randomized abstract shapes
        // Draw some subtle rectangles
        for (let i = 0; i < 5; i++) {
          ctx.globalAlpha = 0.03 + Math.random() * 0.05; // Even lower opacity for subtlety
          ctx.fillStyle = i % 2 === 0 ? accentColor1 : accentColor2;
          const rectX = Math.random() * w;
          const rectY = Math.random() * h;
          const rectW = 100 + Math.random() * 300;
          const rectH = 50 + Math.random() * 200;
          ctx.fillRect(rectX, rectY, rectW, rectH);
        }

        // Draw some subtle lines
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = 0.02 + Math.random() * 0.04; // Very low opacity
          ctx.strokeStyle = i % 2 === 0 ? accentColor1 : accentColor2;
          ctx.lineWidth = 1 + Math.random() * 3; // Thin lines
          ctx.beginPath();
          ctx.moveTo(Math.random() * w, Math.random() * h);
          ctx.lineTo(Math.random() * w, Math.random() * h);
          ctx.stroke();
        }

        // Restore globalAlpha to 1.0 before drawing other elements
        ctx.globalAlpha = 1.0;

        // Subtle linear gradients
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)');
        gradient.addColorStop(0.5, theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');
        gradient.addColorStop(1, theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Final overlay for overall tone
        ctx.fillStyle = overlayColor;
        ctx.fillRect(0, 0, w, h);

        // 2. Main Food Image Card
        const size = 500; // Slightly smaller to ensure wrapped text fits well
        const x = (w - size) / 2;
        const y = 220; // Pushed down to make room for header

        ctx.save(); // Save context state before applying shadow and clip
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 10;
        
        // Clip rounded corners for food image
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 50);
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
        // Restore context state after applying shadow and clip

        // 3. Typography
        ctx.textAlign = 'center';
        const textColorMain = theme === 'dark' ? '#ffffff' : '#0f172a';
        const textColorMuted = theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)';
        const accentTextColor = theme === 'dark' ? '#fb923c' : '#f97316';

        // Header - Shared By (At the top)
        ctx.fillStyle = accentTextColor;
        ctx.font = '600 24px sans-serif';
        ctx.fillText("PICKED SPECIALLY BY", w / 2, 80);
        
        ctx.fillStyle = textColorMain;
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText(user.name, w / 2, 135);
        ctx.fillStyle = textColorMuted;
        ctx.font = '400 20px sans-serif';
        ctx.fillText(user.email, w / 2, 175);

        // Food Name
        ctx.font = 'bold 40px sans-serif'; // Keep font style
        ctx.fillStyle = textColorMain; // Use theme-aware text color

        const nameMaxWidth = 700;
        const nameLineHeight = 70;
        const words = food.name.split(' ');
        let line = '';
        let lines = [];

        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          if (metrics.width > nameMaxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());

        // Draw text (up to 2 lines for best layout)
        lines.slice(0, 2).forEach((l, i) => {
          ctx.fillText(l, w / 2, y + size + 90 + (i * nameLineHeight));
        });

        // Branding
        ctx.fillStyle = textColorMain;
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('🍽️ MealMind', w / 2, h - 60);

        // 4. Paper Texture Finish (Overlay everything)
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.12; // Keep it subtle for a high-end feel
        ctx.drawImage(paperImg, 0, 0, w, h);
        ctx.restore();

        setImgUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("Canvas export failed:", err);
      }
    };

    setImgUrl(null); // Show loading state when regenerating
    drawCard();
  }, [food, user, refreshKey]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--glass-bg)] backdrop-blur-sm p-4 sm:p-4 md:p-10 overflow-y-auto"> {/* Keep overflow-y-auto for responsiveness */}
      <div className="border border-white/50 backdrop-blur-2xl  sm:p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col items-center gap-2 sm:gap-2 max-w-md sm:max-w-lg w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <h2 className="text-white/80 text-900 text-lg sm:text-xl font-bold flex-shrink-0">Generated Share Card</h2>
        
        <div className=" aspect-[4/5] bg-white/5 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
          {imgUrl ? (
            <img src={imgUrl} alt="Final card" className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-slate-400 text-xs sm:text-sm font-medium">Creating image...</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full p-2 bg-[var(--card-bg)] rounded-xl border border-[var(--glass-border)]">
          <button onClick={onClose} className="flex-1 py-2 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-2xl font-bold transition-all">Close</button>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)} 
            className="flex-1 py-2 text-xs sm:text-sm bg-white/80 hover:bg-white text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-2xl font-bold transition-all border border-slate-200 dark:border-white/20"
          >
            Shuffle
          </button>
          <button 
            onClick={() => { const a = document.createElement('a'); a.href = imgUrl; a.download = `MealMind-${food.name}.png`; a.click(); }}
            disabled={!imgUrl}
            className="flex-1 py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 dark:shadow-orange-500/30"
          >Download</button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
