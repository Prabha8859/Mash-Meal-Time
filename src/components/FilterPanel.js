"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

const FILTER_CONFIG = [
  { id: "dietType", label: "Diet Type", emoji: "🥗", options: ["Veg", "Non-Veg", "Vegan"] },
  { id: "healthGoals", label: "Health Goals", emoji: "🎯", options: ["Weight Loss", "Weight Gain", "Balanced", "Muscle Gain"] },
  { id: "allergies", label: "Allergies", emoji: "⚠️", options: ["No allergies", "Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Onion", "Garlic"] },
  { id: "mealTiming", label: "Meal Timing", emoji: "🕐", options: ["Breakfast", "Lunch", "Dinner", "Snacks"] },
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
      let newValues;
      if (currentValues.includes(normalizedValue)) {
        newValues = currentValues.filter(v => v !== normalizedValue);
      } else {
        if (categoryId === 'allergies') {
          if (normalizedValue === 'no-allergies') {
            newValues = ['no-allergies'];
          } else {
            newValues = [...currentValues.filter(v => v !== 'no-allergies'), normalizedValue];
          }
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
          position: fixed; inset: 0; z-index: 9999;
          display: flex; justify-content: flex-end;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .fp-panel {
          position: relative;
          width: 100%; max-width: 340px;
          background: #fafaf9;
          height: 100%;
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          box-shadow: -20px 0 60px rgba(0,0,0,0.15);
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
            padding: '20px 22px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                Customize
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
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
                className="fp-close"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#f9fafb', border: '1.5px solid #e5e7eb',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable filter content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            {FILTER_CONFIG.map((category) => (
              <div key={category.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{category.emoji}</span>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '0.02em' }}>
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
                          padding: '7px 14px',
                          borderRadius: 50,
                          fontSize: 13, fontWeight: 600,
                          background: isActive ? '#1a1a1a' : '#fff',
                          color: isActive ? '#fff' : '#374151',
                          border: `1.5px solid ${isActive ? '#1a1a1a' : '#e5e7eb'}`,
                          boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
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
            padding: '18px 22px',
            borderTop: '1px solid #e5e7eb',
            background: '#fff',
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
                width: '100%', padding: '10px',
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