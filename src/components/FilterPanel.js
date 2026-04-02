"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

const FILTER_CONFIG = [
  { id: "dietType", label: "Diet Type", emoji: "🥗", options: ["Veg", "Non-Veg", "Vegan"], selectionType: "single" },
  { id: "healthGoals", label: "Health Goals", emoji: "🎯", options: ["Weight Loss", "Weight Gain", "Balanced", "Muscle Gain"], selectionType: "multi" },
  { id: "allergies", label: "Allergies", emoji: "⚠️", options: ["No allergies", "Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Onion", "Garlic"], selectionType: "single" },
  { id: "mealTiming", label: "Meal Timing", emoji: "🕐", options: ["Breakfast", "Lunch", "Dinner", "Snacks"], selectionType: "single" },
];

export default function FilterPanel({ currentParams, onApply, onClose }) {
  const [filters, setFilters] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    const params = new URLSearchParams(currentParams);
    const initialFilters = {};
    const userPreferences = session?.user?.questionnaire || {};

    FILTER_CONFIG.forEach(category => {
      const paramKey = category.id === 'allergies' ? 'restrictedIngredients' : category.id;
      const paramValue = params.get(paramKey);
      const prefKey = category.id === 'healthGoals' ? 'weightGoal' : category.id;
      const prefValue = userPreferences[prefKey];

      if (paramValue) {
        initialFilters[category.id] = paramValue.split(',');
      } else if (prefValue && Array.isArray(prefValue) && prefValue.length > 0) {
        initialFilters[category.id] = prefValue;
      }
    });
    setFilters(initialFilters);
  }, [currentParams, session]);

  const handleToggle = (categoryId, optionValue) => {
    const normalizedValue = optionValue.toLowerCase().replace(/\s+/g, "-");
    setFilters(prev => {
      const currentValues = prev[categoryId] || [];
      const categoryConfig = FILTER_CONFIG.find(config => config.id === categoryId);
      let newValues;

      if (categoryConfig.selectionType === "single") {
        newValues = currentValues.includes(normalizedValue) ? [] : [normalizedValue];
      } else {
        if (currentValues.includes(normalizedValue)) {
          newValues = currentValues.filter(v => v !== normalizedValue);
        } else {
          newValues = [...currentValues, normalizedValue];
        }
      }
      return { ...prev, [categoryId]: newValues };
    });
  };

  const handleApply = () => {
    const params = new URLSearchParams(currentParams);
    FILTER_CONFIG.forEach(category => {
      const values = filters[category.id];
      const paramKey = category.id === 'allergies' ? 'restrictedIngredients' : category.id;
      if (values && values.length > 0) {
        params.set(paramKey, values.join(','));
        if (paramKey !== category.id) params.delete(category.id);
      } else {
        params.delete(paramKey);
        if (paramKey !== category.id) params.delete(category.id);
      }
    });

    const expirySeconds = 3600;
    document.cookie = `temp_filters=${params.toString()}; path=/; max-age=${expirySeconds}`;
    onApply(params.toString(), Date.now() + expirySeconds * 1000);
  };

  const activeCount = Object.values(filters).flat().filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .fp-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000;
          display: flex; justify-content: flex-end;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .fp-panel {
          width: 100%;
          max-width: 380px;
          height: calc(100vh - 140px); /* Proper spacing for top/bottom */
          margin-top: 100px; /* Offset to sit below header */
          margin-right: 20px;
          margin-bottom: 40px;
          background: rgba(15, 15, 15, 0.2);
          backdrop-filter: blur(40px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 32px;
          display: flex; flex-direction: column;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .fp-chip {
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }
        .fp-chip:hover { transform: translateY(-2px); }
        .fp-chip:active { transform: scale(0.95); }

        .fp-apply {
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .fp-apply:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.45) !important; }
        .fp-apply:active { transform: scale(0.97); }

        .fp-close {
          transition: all 0.2s ease;
        }
        .fp-close:hover { transform: rotate(90deg); background: #f3f4f6; }
      `}</style>

      <div className="fp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="fp-panel">

          {/* Header */}
          <div style={{
            padding: '16px 20px', /* Slightly reduced padding */
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'transparent',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(10px, 2.5vw, 11px)', fontWeight: 700, color: '#f97316', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                Meal Preferences
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 5vw, 22px)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Your Filters
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {activeCount > 0 && (
                <span style={{
                  background: '#f97316', color: '#fff',
                  fontSize: 12, fontWeight: 700, padding: '3px 10px',
                  borderRadius: 20,
                }}>
                  {activeCount} active
                </span>
              )}
              <button
                onClick={onClose}
                className="fp-close flex-shrink-0" /* Added flex-shrink-0 */
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable filter content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            {FILTER_CONFIG.map((category) => (
              <div key={category.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{category.emoji}</span>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 3vw, 14px)', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '0.02em' }}>
                    {category.label}
                  </h4>
                  {filters[category.id]?.length > 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#f97316',
                      background: '#fff7ed', padding: '2px 8px', borderRadius: 10,
                    }}>
                      {filters[category.id].length}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {category.options.map(option => {
                    const val = option.toLowerCase().replace(/\s+/g, "-");
                    const isActive = filters[category.id]?.includes(val);
                    return (
                      <button
                        key={option}
                        onClick={() => handleToggle(category.id, option)}
                        className="fp-chip"
                        style={{
                          padding: '6px 12px', /* Slightly reduced padding */
                          borderRadius: 50, 
                          fontSize: 13, fontWeight: 600,
                          background: isActive ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.05)',
                          color: isActive ? '#fb923c' : 'rgba(255,255,255,0.6)',
                          border: `1.5px solid ${isActive ? '#f97316' : 'rgba(255,255,255,0.1)'}`,
                          boxShadow: isActive ? '0 4px 12px rgba(249,115,22,0.2)' : 'none',
                        }}
                      >
                        {isActive && <span style={{ marginRight: 5, fontSize: 11 }}>✓</span>}
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 20px', /* Slightly reduced padding */
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'transparent',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <button
              onClick={handleApply}
              className="fp-apply"
              style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg, #f97316, #fb923c)', 
                color: '#fff', border: 'none', borderRadius: 16,
                fontSize: 16, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
                letterSpacing: '0.02em',
              }}
            >
              Apply Changes
            </button>
            <button
              onClick={() => {
                setFilters({});
              }}
              style={{
                width: '100%',
                background: 'transparent', border: 'none',
                color: '#9ca3af', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}