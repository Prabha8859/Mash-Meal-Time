"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/app/ThemeProvider';

export default function ShareCardCanvas({ food, user, onClose }) {
  const canvasRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme } = useTheme();

  const drawCard = useCallback(async () => {
    if (!food || !user) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const W = 900, H = 1130;
    canvas.width = W;
    canvas.height = H;

    // Design styles based on theme
    const designStyles = theme === 'dark' ? [
      { bg: '#020617', accent: '#3b82f6', gold: '#fbbf24', text: '#ffffff', muted: 'rgba(255,255,255,0.6)', cardInner: 'rgba(255,255,255,0.05)', texture: 'grid' },
      { bg: '#0f172a', accent: '#10b981', gold: '#34d399', text: '#ffffff', muted: 'rgba(255,255,255,0.6)', cardInner: 'rgba(255,255,255,0.05)', texture: 'lines' },
      { bg: '#1e1b4b', accent: '#818cf8', gold: '#e879f9', text: '#ffffff', muted: 'rgba(255,255,255,0.6)', cardInner: 'rgba(255,255,255,0.05)', texture: 'dots' },
      { bg: '#18181b', accent: '#f43f5e', gold: '#fb923c', text: '#ffffff', muted: 'rgba(255,255,255,0.6)', cardInner: 'rgba(255,255,255,0.05)', texture: 'none' },
    ] : [
      { bg: '#ffffff', accent: '#2563eb', gold: '#d97706', text: '#0f172a', muted: 'rgba(15,23,42,0.7)', cardInner: 'rgba(0,0,0,0.03)', texture: 'grid' },
      { bg: '#f8fafc', accent: '#059669', gold: '#0d9488', text: '#0f172a', muted: 'rgba(15,23,42,0.7)', cardInner: 'rgba(0,0,0,0.03)', texture: 'lines' },
      { bg: '#fff7ed', accent: '#ea580c', gold: '#c2410c', text: '#431407', muted: 'rgba(67,20,7,0.7)', cardInner: 'rgba(0,0,0,0.03)', texture: 'dots' },
      { bg: '#faf5ff', accent: '#7c3aed', gold: '#9333ea', text: '#1e1b4b', muted: 'rgba(30,27,75,0.7)', cardInner: 'rgba(0,0,0,0.03)', texture: 'none' },
    ];

    const style = designStyles[refreshKey % designStyles.length];

    const loadImg = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

    try {
      const foodImg = await loadImg(food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800');

      // Background
      ctx.fillStyle = style.bg;
      ctx.fillRect(0, 0, W, H);

      // Glow blobs
      const blob = (x, y, rx, ry, color, alpha) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      if (refreshKey % 2 === 0) {
        blob(W / 2, -80, 400, 300, style.accent, 0.3);
        blob(W * 0.8, H * 0.9, 300, 280, style.gold, 0.2);
      } else {
        blob(100, 100, 280, 280, style.accent, 0.25);
        blob(W - 100, 150, 250, 250, style.gold, 0.25);
      }

      // Texture
      ctx.save();
      ctx.globalAlpha = theme === 'dark' ? 0.05 : 0.07;
      ctx.strokeStyle = style.text;

      if (style.texture === 'lines') {
        for (let i = -H; i < W + H; i += 55) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + H, H);
          ctx.stroke();
        }
      } else if (style.texture === 'grid') {
        for (let i = 0; i < W; i += 45) ctx.fillRect(i, 0, 1, H);
        for (let j = 0; j < H; j += 45) ctx.fillRect(0, j, W, 1);
      } else if (style.texture === 'dots') {
        ctx.fillStyle = style.text;
        for (let i = 30; i < W; i += 55) {
          for (let j = 30; j < H; j += 55) {
            ctx.beginPath();
            ctx.arc(i, j, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // Badge
      const badgeW = 240, badgeH = 32, bx = (W - badgeW) / 2, by = 48;
      ctx.save();
      ctx.shadowColor = style.accent;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 12);
      ctx.fillStyle = style.accent + 'cc';
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#fff';
      ctx.font = '700 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ EXCLUSIVE DISCOVERY ✦', W / 2, by + 21);

      // User Info
      ctx.textAlign = 'center';
      ctx.fillStyle = style.text;
      ctx.font = '900 35px "Syne", sans-serif';
      ctx.fillText(user.name.toUpperCase(), W / 2, 138);

      ctx.fillStyle = style.muted;
      ctx.font = '500 25px "Inter", sans-serif';
      ctx.fillText(user.email.toLowerCase(), W / 2, 168);

      // Divider
      ctx.strokeStyle = style.muted + '44';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(220, 185);
      ctx.lineTo(580, 185);
      ctx.stroke();

      // Food Image Container
      const imgX = 55, imgY = 215, imgW = 800, imgH = 800, r = 36;

      // Glow + borders
      ctx.save();
      ctx.shadowColor = style.accent;
      ctx.shadowBlur = 35;
      ctx.strokeStyle = style.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12, r + 6);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = style.gold + 'aa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(imgX - 2, imgY - 2, imgW + 4, imgH + 4, r + 2);
      ctx.stroke();

      // Clip and draw image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, r);
      ctx.clip();
      ctx.drawImage(foodImg, imgX, imgY, imgW, imgH);

      // Gradient overlay
      const grad = ctx.createLinearGradient(0, imgY + imgH - 180, 0, imgY + imgH);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, style.bg + 'f0');
      ctx.fillStyle = grad;
      ctx.fillRect(imgX, imgY + imgH - 180, imgW, 180);
      ctx.restore();

      // Category & Calories
      const catText = (food.category || 'DINNER').toUpperCase();
      ctx.fillStyle = style.accent + 'ee';
      ctx.beginPath();
      ctx.roundRect(imgX + 20, imgY + 20, 110, 32, 16);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '700 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(catText, imgX + 38, imgY + 48);

      const calText = `${food.nutrition?.calories || 320} KCAL`;
      const calW = ctx.measureText(calText).width + 32;
      ctx.fillStyle = style.gold + 'ee';
      ctx.beginPath();
      ctx.roundRect(imgX + imgW - calW - 20, imgY + 20, calW, 32, 16);
      ctx.fill();

      ctx.fillStyle = style.bg;
      ctx.font = '700 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(calText, imgX + imgW - calW / 2 - 20, imgY + 42);

      // Food Name
      ctx.textAlign = 'center';
      ctx.fillStyle = style.text;
      ctx.font = 'italic 900 46px "Playfair Display", serif';
      const words = food.name.split(' ');
      let lines = [], line = '';
      words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > 580 && line) {
          lines.push(line.trim());
          line = word + ' ';
        } else line = testLine;
      });
      lines.push(line.trim());

      const startY = imgY + imgH - (lines.length * 52) - 30;
      lines.forEach((l, i) => {
        ctx.fillText(l, W / 2, startY + i * 56);
      });

      // Description
      ctx.fillStyle = style.gold;
      ctx.font = '500 20px "Inter"';
      ctx.fillText(
        (food.description || 'Rich · Creamy · Delicious').slice(0, 45),
        W / 2,
        imgY + imgH - 22
      );

      // Footer
      ctx.strokeStyle = style.muted + '55';
      ctx.beginPath();
      ctx.moveTo(120, H - 78);
      ctx.lineTo(W - 120, H - 78);
      ctx.stroke();

      ctx.fillStyle = style.accent;
      ctx.font = '900 28px "Syne", sans-serif';
      ctx.fillText('🍽  MealMind', W / 2, H - 42);

      const dataUrl = canvas.toDataURL('image/png', 0.92);
      setImgUrl(dataUrl);

    } catch (err) {
      console.error('Canvas draw failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [food, user, refreshKey, theme]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `mealmind-${food.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

  const handleShare = (platform) => {
    if (!imgUrl) return;
    
    // For native sharing on mobile
    if (navigator.share && platform === 'native') {
      fetch(imgUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `mealmind-${food.name}.png`, { type: 'image/png' });
          navigator.share({
            files: [file],
            title: `I discovered ${food.name} on MealMind!`,
          });
        });
      return;
    }

    // Fallback: Open in new tab (works well for IG, FB, WA)
    window.open(imgUrl, '_blank');
  };

  return (
    <>
      <div className="cs-root" style={{
        width: '92%',
        maxWidth: '420px',
        margin: '0 auto',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(40px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 28,
        padding: '24px',
        boxShadow: 'var(--card-shadow)',
      }}>
        <h2 className="text-2xl font-black text-center mb-4 text-[var(--text-main)]">Your Share Card</h2>

        <div className="aspect-[4/5] w-full bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden border border-[var(--glass-border)] flex items-center justify-center relative">
          {imgUrl ? (
            <img src={imgUrl} alt="Share card" className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[var(--text-muted)]">Crafting masterpiece...</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold rounded-2xl border border-[var(--glass-border)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={() => setRefreshKey(p => p + 1)}
            disabled={isGenerating}
            className="flex-1 py-2.5 text-sm font-bold rounded-2xl border border-[var(--glass-border)] text-orange-500 hover:bg-orange-500/5 dark:hover:bg-orange-500/10 transition-all"
          >
            Shuffle 
          </button>

          <button
            onClick={handleDownload}
            disabled={!imgUrl || isGenerating}
            className="flex-1 py-2.5 text-sm font-bold rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}