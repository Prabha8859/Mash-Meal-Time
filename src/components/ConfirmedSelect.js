"use client";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import ShareCardCanvas from './ShareCardCanvas';

export default function ConfirmedSelection({ suggestedFood, selectedMode, onRestart, onConfirm }) {
  const { data: session } = useSession();
  const [showShareCard, setShowShareCard] = useState(false);

  return (
    <>
      <style>{`
        .cs-root {
          font-family: 'DM Sans', sans-serif;
          animation: fadeUpRoot 0.5s ease forwards;
        }
        @keyframes fadeUpRoot {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cs-share-transition {
          animation: sharePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes sharePopIn {
          from { opacity: 0; transform: scale(0.92) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .cs-food-img {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }

        .cs-confetti {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .cs-btn {
          transition: all 0.2s ease;
          cursor: pointer; border: none;
          font-family: 'DM Sans', sans-serif;
        }
        .cs-btn:hover { transform: translateY(-3px); }
        .cs-btn:active { transform: scale(0.97); }
      `}</style>

      {!showShareCard ? (
      <div
        className="cs-root"
        style={{
          width: '90%', // Use a percentage for width on small screens
          maxWidth: 'min(90vw, 400px)',
          height: 'auto',
          // maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column', position: 'relative',
          alignItems: 'center', justifyContent: 'center',
          gap: 0, padding: '24px', textAlign: 'center',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(40px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 24, // Rounded borders
          boxShadow: 'var(--card-shadow)',
        }}
      >

        {/* Corner celebratory icon */}
        <div className="cs-confetti" style={{ 
          position: 'absolute', top: 20, right: 20, 
          fontSize: 24, opacity: 0.8 
        }}>🎉</div>

        {/* Heading */}
        <h2 style={{
          // fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 8vw, 42px)', fontWeight: 900, color: 'var(--text-main)',
          margin: '0 0 6px 0', lineHeight: 1.1,
        }}>
          Great Choice! {/* Adjusted font size for mobile */}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500, margin: '0 0 0px 0' }}>
          {selectedMode === "online" ? "We'll help you order this online 🛵" : "Time to get cooking! 🍳"}
        </p>

        {/* Inner Food Card */}
        <div
          className="cs-food-img"
          style={{
            background: 'var(--card-bg)', 
            borderRadius: 24,
            padding: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            maxWidth: 320, width: '100%', // Use a percentage for width on small screens
            border: '1px solid var(--glass-border)', 
          }}
        >
          <img
            src={suggestedFood?.image}
            alt={suggestedFood?.name}
            style={{
              width: '100%', height: '266px', // Adjusted height for smaller screens 
              objectFit: 'cover',
              borderRadius: 16,
              // marginBottom: 16,
            }}
          />
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20, fontWeight: 800,
            color: 'var(--text-main)', margin: '0 ', // Adjusted font size for mobile
          }}>
            {suggestedFood?.name}
          </h3>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 50,
            background: selectedMode === 'online' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            color: selectedMode === 'online' ? '#93c5fd' : '#86efac',
            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' // Adjusted font size for mobile
          }}>
            {selectedMode === 'online' ? '🛵 Order Online' : '🍳 Self Cooking'}
          </span>
        </div>

        {/* Share Section */}
        <div style={{ marginTop: 8, width: '100%', maxWidth: 280 }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', // Adjusted font size for mobile
            marginBottom: 0, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Share Your Discovery!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button
              className="cs-btn"
              aria-label="Share on Instagram"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--glass-bg)', // Adjusted size for mobile 
                border: '1px solid var(--glass-border)',
                fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </button>
            <button
              className="cs-btn"
              aria-label="Share on Facebook"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--glass-bg)', // Adjusted size for mobile 
                border: '1px solid var(--glass-border)',
                fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </button>
            <button
              className="cs-btn"
              aria-label="Share on WhatsApp"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--glass-bg)', // Adjusted size for mobile 
                border: '1px solid var(--glass-border)',
                fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 14, marginTop: 10, width: '100%', maxWidth: 280 }}>
          <button
            onClick={onRestart}
            className="cs-btn"
            style={{
              flex: 1, padding: '8px', // Adjusted padding for mobile
              background: 'var(--glass-bg)', // Transparent background 
              color: 'var(--text-main)', // Lighter text color
              fontSize: 15, fontWeight: 700,
              borderRadius: 16,
              border: '1px solid var(--glass-border)', // Lighter border
              boxShadow: 'var(--card-shadow)', // Adjusted shadow
            }}
          >
            ← Start Over
          </button>
          <button
            onClick={() => setShowShareCard(true)}
            className="cs-btn"
            style={{
             flex: 1, padding: '8px', // Adjusted padding for mobile 
              background: 'var(--glass-bg)', // Transparent background
              color: 'var(--text-main)', // Lighter text color
              fontSize: 15, fontWeight: 700,
              borderRadius: 16,
              border: '1px solid var(--glass-border)', // Lighter border
              boxShadow: 'var(--card-shadow)',
            }}
          >
          Generate Card
          </button>
        </div>
      </div>
      ) : (
        <div className="cs-share-transition">
          <ShareCardCanvas 
            user={{
              name: session?.user?.name || "Prabha singh",
              email: session?.user?.email || "prabha@mealmind.com"
            }}
             food={suggestedFood} 
            onClose={() => setShowShareCard(false)}
          />
        </div>
      )}
    </>
  );
}