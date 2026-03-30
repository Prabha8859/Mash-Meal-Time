"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MEAL_SPECIFIC_INGREDIENTS } from '@/lib/utils';
import FilterPanel from './FilterPanel';
import ConfirmedSelection from './ConfirmedSelect';
import SpinWheel from './SpinWheel';
import Hero from './LeftHero';

export default function FoodSpin({ initialFoods, isFiltered, mealTiming, baseParams }) {
  const [foods, setFoods] = useState(initialFoods || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [phase, setPhase] = useState("select-mode");
  const [selectedMode, setSelectedMode] = useState(null);
  const [ingredientsVisible, setIngredientsVisible] = useState(false);

  const [suggestedFood, setSuggestedFood] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rejectedIds, setRejectedIds] = useState(new Set());

  const [currentQueryString, setCurrentQueryString] = useState(baseParams);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterExpiry, setFilterExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const wheelRef = useRef(null);
  const abortControllerRef = useRef(null);

  const resetSpinState = () => {
    setShowResult(false);
    setSuggestedFood(null);
    setFoods([]);
    setRejectedIds(new Set());
    setError(null);
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
    }
  };

  const COMMON_INGREDIENTS = MEAL_SPECIFIC_INGREDIENTS[mealTiming] || [];
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (id) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
    setFoods([]); // Clear foods so we fetch fresh ones with new ingredients
    resetSpinState();
  };

  const getNewSuggestion = (currentFoods = foods, currentRejected = rejectedIds) => {
    let available = currentFoods.filter((f) => !currentRejected.has(f._id));
    // If all foods have been rejected, reset the cycle
    if (available.length === 0 && currentFoods.length > 0) { setRejectedIds(new Set()); available = [...currentFoods]; }
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  };

  useEffect(() => {
    if (initialFoods) {
      setFoods(initialFoods);
      setError(isFiltered && initialFoods.length === 0 ? "No food items found. Try changing your filters!" : null);
    }
  }, [initialFoods, isFiltered]);

  useEffect(() => {
    if (foods?.length > 0) {
      if (!suggestedFood) {
        setSuggestedFood(getNewSuggestion(foods));
      }
      setShowResult(false);
    }
  }, [foods]);

  const remainingCount = Math.max(0, foods.length - rejectedIds.size);

  // ── FIX 1: Extracted fetchFoodsForMode as a standalone async function ──
  const fetchFoodsForMode = async (mode, ingredients = []) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams(currentQueryString);
    if (params.get('restrictedIngredients') === 'no-allergies') params.delete('restrictedIngredients');
    params.set('foodType', mode);
    if (ingredients.length > 0) params.set('ingredients', ingredients.join(','));

    try {
      const res = await fetch(`/api/foods?${params.toString()}`, { signal: abortControllerRef.current.signal });
      if (!res.ok) throw new Error(`Failed to fetch food: ${res.statusText}`);
      const data = await res.json();
      if (data.length === 0) {
        setError("No food found. Try changing filters.");
        setFoods([]);
        return [];
      }
      setFoods(data);
      return data;
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
      setFoods([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ── FIX 2: handleModeSelect is now properly async, sets selectedMode, and
  //           opens the ingredient drawer on first selection of self-cooking ──
  const handleModeSelect = async (mode) => {
    if (selectedMode === mode) {
      if (mode === "self-cooking") setIngredientsVisible(true);
      resetSpinState();
      return;
    }

    // FIX 3: Removed duplicate setCheckedIngredients call
    setShowResult(false);
    setError(null);
    setCheckedIngredients({});
    setRejectedIds(new Set());
    setSelectedMode(mode); // FIX 4: Actually set the selected mode

    // Open ingredient drawer immediately on first self-cooking selection
    if (mode === "self-cooking") {
      setIngredientsVisible(true);
    }

    // Reset wheel visual
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
    }
    setFoods([]);
    setSuggestedFood(null);
    setRejectedIds(new Set());
  };

  const handleFilterApply = (newParams, expiryTime) => {
    setCurrentQueryString(newParams);
    setFiltersVisible(false);
    setFoods([]);
    setRejectedIds(new Set());
    setSuggestedFood(null);
    setShowResult(false);
    setError(null);
    if (expiryTime) {
      setFilterExpiry(expiryTime);
      setTimeLeft(Math.ceil((expiryTime - Date.now()) / 1000));
    }
  };

  const clearFilters = () => {
    setFilterExpiry(null);
    setTimeLeft(null);
    setCurrentQueryString(baseParams);
    setRejectedIds(new Set());
    setIngredientsVisible(false);
    document.cookie = "temp_filters=; path=/; max-age=0";
    setFoods([]);
    setSuggestedFood(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (!filterExpiry) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((filterExpiry - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        setFilterExpiry(null);
        setTimeLeft(null);
        setCurrentQueryString(baseParams);
        document.cookie = "temp_filters=; path=/; max-age=0";
        setFoods([]);
        setSuggestedFood(null);
        setShowResult(false);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [filterExpiry, baseParams]);

  const startSpin = async (providedRejected = null) => {
    if (spinning || loading) return;

    // FIX: If providedRejected is a React event (from UI click), use current state instead
    const activeRejected = (providedRejected && typeof providedRejected.has === 'function') 
      ? providedRejected 
      : rejectedIds;

    let currentFoods = foods;
    // Only fetch if we don't have a food pool yet
    if (foods.length === 0) {
      const selectedIngredients = Object.keys(checkedIngredients).filter(k => checkedIngredients[k]);
      currentFoods = await fetchFoodsForMode(selectedMode, selectedIngredients);
    }
    
    if (!currentFoods || currentFoods.length === 0) return;
    const nextFood = getNewSuggestion(currentFoods, activeRejected);
    setSuggestedFood(nextFood);
    
    setSpinning(true);
    setShowResult(false);

    const extraSpins = 4 + Math.floor(Math.random() * 5);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = extraSpins * 360 + randomAngle;

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4.5s cubic-bezier(0.25,0.1,0.25,1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);
      setTimeout(() => {
        if (wheelRef.current) {
          wheelRef.current.style.transition = "none";
          wheelRef.current.style.transform = `rotate(${randomAngle}deg)`;
        }
      }, 100);
    }, 4600);
  };

  const handleReject = () => {
    if (!suggestedFood) return;
    const nextRejected = new Set(rejectedIds);
    nextRejected.add(suggestedFood._id);
    setRejectedIds(nextRejected);
    setShowResult(false);
    startSpin(nextRejected);
  };

  const handleReset = () => {
    setPhase("select-mode");
    setSelectedMode(null);
    setShowResult(false);
    setFoods([]);
    setSuggestedFood(null);
  };

  const handleConfirm = () => {
    if (!suggestedFood) return;
    alert(`Confirmed: ${suggestedFood.name} (${selectedMode || "—"})`);
  };

  if (phase === "select-mode" || phase === "spin") {
    return (
      <>
        <style jsx>{`
          .fs-root { box-sizing: border-box; }
          .center-label {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-width: 0;
            padding: 0 8px;
          }
        `}</style>

        <div
          className="fs-root glass-card w-full flex flex-col items-center rounded-3xl text-white"
          style={{
            maxWidth: 520,
            margin: '0 auto',
            padding: '20px 20px 18px',
            minHeight: 'auto',
            overflow: 'hidden',
          }}
        >
          <Hero
            timeLeft={timeLeft}
            onClearFilters={clearFilters}
            onOpenFilters={() => setFiltersVisible(true)}
          />

          {/* ROW 1: Order Online ← [center text] → Self Cooking */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 14,
          }}>
            <button
              onClick={() => handleModeSelect("online")}
              className={`mode-pill ${selectedMode === 'online' ? 'active-online' : ''}`}
            > {/* Added text-xs sm:text-base for responsiveness */}
              Online
            </button>

            <div className="center-label">
              {showResult && suggestedFood && !spinning ? (
                <div className="name-reveal">
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12, // Smaller on mobile
                    fontWeight: 900,
                    color: '#fff',
                    margin: 0,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                    wordBreak: 'break-word',
                  }}>
                    {suggestedFood.name}
                  </p>
                  <p style={{
                    fontSize: 7, // Smaller on mobile
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    margin: '3px 0 0',
                  }}>
                    Your Pick
                  </p>
                </div>
              ) : spinning ? (
                <span style={{
                  fontSize: 8, // Smaller on mobile
                  fontWeight: 800,
                  color: '#fbbf24',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: "'Syne', sans-serif",
                  animation: 'dotPulse 1s ease infinite',
                  display: 'block',
                }}>
                  spinning
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ height: 1, width: 18, background: 'rgba(255,255,255,0.12)' }} />
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: selectedMode
                      ? (selectedMode === 'online' ? '#60a5fa' : '#4ade80')
                      : 'rgba(255,255,255,0.2)',
                    boxShadow: selectedMode ? '0 0 6px currentColor' : 'none',
                  }} />
                  <div style={{ height: 1, width: 18, background: 'rgba(255,255,255,0.12)' }} />
                </div>
              )}
            </div>

            <button
              onClick={() => handleModeSelect("self-cooking")}
              className={`mode-pill ${selectedMode === 'self-cooking' ? 'active-cook' : ''}`}
            > {/* Added text-xs sm:text-base for responsiveness */}
              Self
            </button>
          </div>

          {/* WHEEL */}
          <SpinWheel
            ref={wheelRef}
            showResult={showResult}
            suggestedFood={suggestedFood}
            selectedMode={selectedMode}
            spinning={spinning}
            onSpin={startSpin}
            loading={loading}
            disabled={selectedMode === "self-cooking" && Object.values(checkedIngredients).filter(Boolean).length === 0}
          />

          {/* ROW 2: Change ← [center] → Yes, This! */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 14,
            minHeight: 44,
          }}>
            {showResult && suggestedFood && !spinning ? (
              <>
                <button onClick={handleReject} className="action-pill action-pill-reject">
                  ✕ Change {/* Added text-xs sm:text-base for responsiveness */}
                </button>

                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}>
                  <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                    boxShadow: '0 0 10px rgba(249,115,22,0.7)',
                    animation: 'dotPulse 2s ease infinite',
                    flexShrink: 0,
                  }} />
                  <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <button onClick={() => setPhase("confirmed")} className="action-pill action-pill-confirm">
                  ✓ Yes, This! {/* Added text-xs sm:text-base for responsiveness */}
                </button>
              </>
            ) : (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: foods.length > 0 ? 'rgba(34, 197, 94, 0.2)' : error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: foods.length > 0 ? '1px solid rgba(74, 222, 128, 0.4)' : error ? '1px solid rgba(248, 113, 113, 0.4)' : '1px solid rgba(255, 255, 255, 0.09)',
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: foods.length > 0 ? '#4ade80' : error ? '#f87171' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: foods.length > 0 ? '0 0 6px rgba(74,222,128,0.8)' : error ? '0 0 6px rgba(239, 68, 68, 0.8)' : 'none',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 9, // Smaller on mobile
                    color: foods.length > 0 ? '#86efac' : error ? '#fca5a5' : 'rgba(255, 255, 255, 0.38)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: 'nowrap'
                  }}>
                    {foods.length > 0
                      ? `${remainingCount} options ready`
                      : error
                        ? error
                        : spinning
                          ? 'Finding your food...'
                          : selectedMode
                            ? selectedMode === 'self-cooking' && Object.values(checkedIngredients).filter(Boolean).length === 0
                              ? 'Pick ingredients first'
                              : 'Ready to spin!'
                            : 'Select a mode to begin'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginTop: 10, padding: '7px 16px', borderRadius: 999,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(249,115,22,0.22)',
              color: '#fdba74', fontSize: 11, fontWeight: 600,
            }}>
              <div style={{
                width: 12, height: 12,
                border: '2px solid rgba(253,186,116,0.2)',
                borderTop: '2px solid #f97316',
                borderRadius: '50%',
                animation: 'spin-loader 0.8s linear infinite',
              }} />
              Finding options...
            </div>
          )}
        </div>

        {filtersVisible && (
          <FilterPanel
            currentParams={currentQueryString}
            onApply={handleFilterApply}
            onClose={() => setFiltersVisible(false)}
          />
        )}

        {/* Ingredient Drawer */}
        {ingredientsVisible && (
          <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && setIngredientsVisible(false)} style={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Ensure it slides from right */}
            <div className="drawer-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    What's in your kitchen?
                  </span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, margin: '4px 0 0' }}>Ingredients</h3>
                </div>
                <button
                  onClick={() => setIngredientsVisible(false)} className="flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
                >✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start' }}>
                {COMMON_INGREDIENTS.map((item) => (
                  <label key={item.id} className="ingr-chip" style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: checkedIngredients[item.id]
                      ? '1.5px solid rgba(74,222,128,0.7)'
                      : '1.5px solid rgba(255,255,255,0.12)',
                    background: checkedIngredients[item.id]
                      ? 'rgba(21,128,61,0.3)'
                      : 'rgba(255,255,255,0.06)',
                    color: checkedIngredients[item.id] ? '#fff' : 'rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    userSelect: 'none',
                    boxShadow: checkedIngredients[item.id] ? '0 0 15px rgba(34,197,94,0.2)' : 'none'
                  }}>
                    <input type="checkbox" style={{ display: 'none' }}
                      checked={!!checkedIngredients[item.id]}
                      onChange={() => toggleIngredient(item.id)} />
                    {checkedIngredients[item.id] && <span style={{ marginRight: 6 }}>✓</span>}
                    {item.label}
                  </label>
                ))}
              </div>

              <button
                onClick={() => setIngredientsVisible(false)}
                className="mode-pill active-cook"
                style={{
                  width: '100%', padding: '14px', fontSize: 13, // Smaller on mobile
                  marginTop: 'auto', height: 'auto', textAlign: 'center'
                }}
              >
                Apply Selection
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (phase === "confirmed") {
    return (
      <ConfirmedSelection
        suggestedFood={suggestedFood}
        selectedMode={selectedMode}
        onRestart={handleReset}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <div className="text-center py-20 text-2xl" style={{ color: '#6b7280' }}>
      Something went wrong — please refresh
    </div>
  );
}