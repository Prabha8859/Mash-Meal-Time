"use client";
import React, { useState, useEffect, useRef } from "react";
import { MEAL_SPECIFIC_INGREDIENTS } from "@/lib/utils";
import FilterPanel from "./FilterPanel";
import ConfirmedSelection from "./ConfirmedSelect";
import SpinWheel from "./SpinWheel";
import GlassCard from "./commen/GlassCard";
import SpinHero from "./commen/SpinHero";
import ModeRow from "./commen/ModeRow";
import ActionRow from "./commen/ActionRow";
import "./FoodSpin.css"; // Import a dedicated CSS file for FoodSpin styles
import IngredientDrawer from "./commen/IngredientDrawer";

export default function FoodSpin({
  initialFoods,
  isFiltered,
  mealTiming,
  baseParams,
}) {
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
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const wheelRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Dynamically derive the meal timing from the current filters
  const activeParams = new URLSearchParams(currentQueryString);
  const activeMealTiming =
    activeParams.get("mealTiming")?.toLowerCase() || mealTiming?.toLowerCase();
  const COMMON_INGREDIENTS = MEAL_SPECIFIC_INGREDIENTS[activeMealTiming] || [];
  const remainingCount = Math.max(0, foods.length - rejectedIds.size);

  /* ── helpers ── */
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

  const getNewSuggestion = (
    currentFoods = foods,
    currentRejected = rejectedIds,
  ) => {
    let available = currentFoods.filter((f) => !currentRejected.has(f._id));
    if (available.length === 0 && currentFoods.length > 0) {
      setRejectedIds(new Set());
      available = [...currentFoods];
    }
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  };

  /* ── effects ── */
  useEffect(() => {
    if (initialFoods) {
      setFoods(initialFoods);
      setError(
        isFiltered && initialFoods.length === 0
          ? "No food items found. Try changing your filters!"
          : null,
      );
    }
  }, [initialFoods, isFiltered]);

  useEffect(() => {
    if (foods?.length > 0) {
      if (!suggestedFood) setSuggestedFood(getNewSuggestion(foods));
      setShowResult(false);
    }
  }, [foods]);

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

  // Reset checked ingredients if the meal timing changes via filters
  useEffect(() => {
    setCheckedIngredients({});
  }, [activeMealTiming]);

  /* ── API ── */
  const fetchFoodsForMode = async (mode, ingredients = []) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams(currentQueryString);
    if (params.get("restrictedIngredients") === "no-allergies")
      params.delete("restrictedIngredients");
    params.set("foodType", mode);
    if (ingredients.length > 0)
      params.set("ingredients", ingredients.join(","));

    try {
      const res = await fetch(`/api/foods?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
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
      if (err.name !== "AbortError") setError(err.message);
      setFoods([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ── handlers ── */
  const handleModeSelect = async (mode) => {
    if (selectedMode === mode) {
      if (mode === "self-cooking") setIngredientsVisible(true);
      resetSpinState();
      return;
    }
    setShowResult(false);
    setError(null);
    setCheckedIngredients({});
    setRejectedIds(new Set());
    setSelectedMode(mode);
    if (mode === "self-cooking") setIngredientsVisible(true);
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
    }
    setFoods([]);
    setSuggestedFood(null);
  };

  const toggleIngredient = (id) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
    setFoods([]);
    resetSpinState();
  };

  const handleIngredientsApply = async () => {
    setIngredientsVisible(false);
    const selectedIngredients = Object.keys(checkedIngredients).filter(
      (k) => checkedIngredients[k],
    );
    await fetchFoodsForMode(selectedMode, selectedIngredients);
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

  const getGradientColors = () => {
    if (selectedMode === "online") {
      return { start: "rgb(239, 68, 68)", end: "rgb(249, 115, 22)" }; // Red to Orange
    } else if (selectedMode === "self-cooking") {
      return { start: "rgb(34, 197, 94)", end: "rgb(22, 163, 74)" }; // Green to Darker Green
    }
    return { start: "rgb(0, 183, 255)", end: "rgb(255, 48, 255)" }; // Default Blue to Pink
  };

  const isReadyToSpin =
    selectedMode &&
    !spinning &&
    !loading &&
    !(
      selectedMode === "self-cooking" &&
      Object.values(checkedIngredients).filter(Boolean).length === 0 &&
      foods.length === 0
    );

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

  const startSpin = async (providedRejected = null) => {
    if (spinning || loading) return;
    const activeRejected =
      providedRejected && typeof providedRejected.has === "function"
        ? providedRejected
        : rejectedIds;

    let currentFoods = foods;
    if (foods.length === 0) {
      const selectedIngredients = Object.keys(checkedIngredients).filter(
        (k) => checkedIngredients[k],
      );
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
      wheelRef.current.style.transition =
        "transform 4.5s cubic-bezier(0.25,0.1,0.25,1)";
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

  /* ── confirmed phase ── */
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

  /* ── main spin UI ── */
  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
      `}</style>

      <div
        className={`food-engine-card w-full px-5 py-6 transition-all duration-700 ${isReadyToSpin ? "pulse-ready" : ""}`}
        style={{
          maxWidth: "min(95vw, 480px)",
          "--gradient-start": getGradientColors().start,
          "--gradient-end": getGradientColors().end,
        }}
      >
        <div
          className={`relative z-10 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {/* ── Hero ── */}
          <SpinHero
            timeLeft={timeLeft}
            onClearFilters={clearFilters}
            onOpenFilters={() => setFiltersVisible(true)}
          />

          {/* glass divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />

          {/* ── Mode selector ── */}
          <ModeRow
            selectedMode={selectedMode}
            showResult={showResult}
            suggestedFood={suggestedFood}
            spinning={spinning}
            onModeSelect={handleModeSelect}
          />

          {/* ── Spin Wheel ── */}
          <SpinWheel
            ref={wheelRef}
            showResult={showResult}
            suggestedFood={suggestedFood}
            selectedMode={selectedMode}
            spinning={spinning}
            onSpin={startSpin}
            loading={loading}
            disabled={
              selectedMode === "self-cooking" &&
              Object.values(checkedIngredients).filter(Boolean).length === 0 &&
              foods.length === 0
            }
          />

          {/* ── Action Row / Status ── */}
          <ActionRow
            showResult={showResult}
            suggestedFood={suggestedFood}
            spinning={spinning}
            onReject={handleReject}
            onConfirm={() => setPhase("confirmed")}
            foods={foods}
            error={error}
            loading={loading}
            selectedMode={selectedMode}
            checkedIngredients={checkedIngredients}
            remainingCount={remainingCount}
          />
        </div>
      </div>

      {/* ── Filter Panel ── */}
      {filtersVisible && (
        <FilterPanel
          currentParams={currentQueryString}
          onApply={handleFilterApply}
          onClose={() => setFiltersVisible(false)}
        />
      )}

      {/* ── Ingredient Drawer ── */}
      <IngredientDrawer
        visible={ingredientsVisible}
        onClose={() => setIngredientsVisible(false)}
        ingredients={COMMON_INGREDIENTS}
        activeMealTiming={activeMealTiming}
        checkedIngredients={checkedIngredients}
        onToggle={toggleIngredient}
        onApply={handleIngredientsApply}
      />
    </>
  );
}
