"use client";

import React, { useState, useEffect } from 'react';

export default function FoodList({ initialFoods, isFiltered }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestedFood, setSuggestedFood] = useState(null);
  const [rejectedFoodIds, setRejectedFoodIds] = useState(new Set());
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    async function fetchFoods() {
      try {
        setLoading(true);
        const res = await fetch('/api/foods');
        console.log("API Response Status:", res);
        if (!res.ok) {
          throw new Error('Failed to fetch foods');
        }
        const data = await res.json();
        setFoods(data);
        console.log("Total Foods:", data.length);
        console.log("All Foods Data:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  

    if (initialFoods !== undefined) {
      // If parent provides data (even an empty array), use it.
      setFoods(initialFoods);
      setLoading(false);
    } else {
      // If parent does not provide data, fetch it.
      fetchFoods();
    }
  }, [initialFoods]); // Re-run this logic if initialFoods prop changes.

  useEffect(() => {
    console.log("Updated Foods State:", foods);
    console.log("Total Foods:", foods.length);
  }, [foods]);

  // Effect: Select a random food when the list updates
  useEffect(() => {
    if (foods.length > 0) {
      const randomIndex = Math.floor(Math.random() * foods.length);
      setSuggestedFood(foods[randomIndex]);
    } else {
      setSuggestedFood(null);
    }
  }, [foods]); // Only run when the core foods list changes

  const handleNextSuggestion = () => {
    if (isConfirmed || foods.length <= 1) return;

    // Add current suggestion to the rejected list
    const newRejectedIds = new Set(rejectedFoodIds);
    if (suggestedFood) {
      newRejectedIds.add(suggestedFood._id);
    }

    // Find available foods that haven't been rejected
    let availableFoods = foods.filter(food => !newRejectedIds.has(food._id));

    // If all foods have been rejected, reset the cycle
    if (availableFoods.length === 0) {
      const resetRejected = new Set();
      setRejectedFoodIds(resetRejected);
      // Pick any food except the current one
      availableFoods = foods.filter(f => f._id !== suggestedFood?._id);
      if (availableFoods.length === 0) availableFoods = foods; // Handle case with only 1 food
    }

    // Pick a new random food from the available ones
    const randomIndex = Math.floor(Math.random() * availableFoods.length);
    const newSuggestion = availableFoods[randomIndex];

    setSuggestedFood(newSuggestion);
    setRejectedFoodIds(newRejectedIds);
  };

  const handleConfirm = () => {
    if (suggestedFood) {
      setIsConfirmed(true);
      alert(`You have confirmed: ${suggestedFood.name}!`);
    }
  };

  if (loading) return <p className="text-center">Loading food items...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // VIEW 1: GRID VIEW (Jab koi filter nahi hai - All Foods)
  if (!isFiltered) {
    console.log("foods in grid view: ", foods);
    return (
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">All Food Menu</h2> {/* Responsive font size */}
        {foods.length === 0 ? (
          <p className="text-center">No food items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food._id} className="glass-card p-5 transition-all duration-300 flex flex-col group hover:translate-y-[-5px]">
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  {food.category && (
                    <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full capitalize"> {/* Responsive font size */}
                      {food.category}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-400 transition-colors">{food.name}</h3>
                  </div>
                  {food.description && <p className="text-white/50 text-xs line-clamp-2 mb-4 font-dm leading-relaxed">{food.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {food.cuisine?.map((c) => <span key={c} className="bg-white/5 border border-white/10 text-white/60 text-[9px] px-2 py-1 rounded-lg capitalize"> {c}</span>)}
                    {food.dietType?.map((d) => <span key={d} className="bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] px-2 py-1 rounded-lg capitalize"> {d}</span>)}
                    {food.healthGoals?.map((h) => <span key={h} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] px-2 py-1 rounded-lg capitalize"> {h}</span>)}
                    {food.mood?.map((m) => <span key={m} className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] px-2 py-1 rounded-lg capitalize"> {m}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // VIEW 2: SPLIT VIEW (Jab filter laga ho - Recommendation Mode)
  return (
    <div className="container mx-auto px-4 sm:px-0"> {/* Added responsive padding */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Recommended For You</h2> {/* Responsive font size */}
      
      {foods.length === 0 ? (
        <p className="text-center">No food available matching your preferences.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Food List */}
          <div className="w-full lg:w-1/2 h-[calc(100vh-200px)] lg:h-[800px] overflow-y-auto pr-2 space-y-3"> {/* Responsive height */}
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sticky top-0 bg-white py-2 z-10">Available Options ({foods.length})</h3> {/* Responsive font size */}
            {foods.map((food) => (
              <div 
                key={food._id} 
                onClick={() => !isConfirmed && setSuggestedFood(food)}
                className={`flex gap-4 border p-3 rounded-lg transition-all 
                  ${isConfirmed ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                  ${suggestedFood?._id === food._id 
                    ? (isConfirmed ? 'border-green-600 bg-green-100 border-2' : 'border-green-500 bg-green-50') 
                    : (rejectedFoodIds.has(food._id) ? 'border-red-300 bg-red-50' : 'border-gray-200')}
                  ${isConfirmed && suggestedFood?._id !== food._id ? 'opacity-50' : ''}
                `}
              >
                <img src={food.image} alt={food.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start text-base sm:text-lg"> {/* Responsive font size */}
                    <h4 className="font-bold">{food.name}</h4>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">{food.description}</p> {/* Responsive font size */}
                  <div className="flex flex-wrap gap-1 mt-2">
                     {food.dietType?.map(d => <span key={d} className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full capitalize">{d}</span>)}
                     {food.cuisine?.map(c => <span key={c} className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">{c}</span>)}
                     {food.mealTiming?.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full capitalize">{t}</span>)}
                     {food.foodType?.map(ft => <span key={ft} className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full capitalize">{ft}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Random Suggestion Card */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-8">
               <h3 className="text-xl font-semibold mb-4">Suggestion For You</h3>
               {suggestedFood && (
                 <div className="border rounded-xl p-6 shadow-xl bg-white">
                    <div className="relative">
                        <img src={suggestedFood.image} alt={suggestedFood.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                        {suggestedFood.category && (
                            <span className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-sm font-semibold px-3 py-1 rounded-full capitalize">
                                {suggestedFood.category}
                            </span>
                        )}
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-2">{suggestedFood.name}</h2>
                    <p className="text-gray-600 mb-4">{suggestedFood.description}</p>

                    <div className="space-y-4 mb-6 text-sm">
                        <div>
                            <span className="font-semibold block text-gray-700">Cuisine</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.cuisine?.map(c => <span key={c} className="bg-blue-50 text-blue-700 px-2 py-1 rounded capitalize">{c}</span>)}
                            </div>
                        </div>
                        
                        <div>
                            <span className="font-semibold block text-gray-700">Diet Type</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.dietType?.map(d => <span key={d} className="bg-green-50 text-green-700 px-2 py-1 rounded capitalize">{d}</span>)}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold block text-gray-700">Mood</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.mood?.map(m => <span key={m} className="bg-purple-50 text-purple-700 px-2 py-1 rounded capitalize">{m}</span>)}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold block text-gray-700">Health Goals</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.healthGoals?.map(h => <span key={h} className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded capitalize">{h}</span>)}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold block text-gray-700">Food Style</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.foodStyle?.map(fs => <span key={fs} className="bg-pink-50 text-pink-700 px-2 py-1 rounded capitalize">{fs}</span>)}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold block text-gray-700">Weather</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.weather?.map(w => <span key={w} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded capitalize">{w}</span>)}
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold block text-gray-700">Food Type</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {suggestedFood.foodType?.map(ft => <span key={ft} className="bg-teal-50 text-teal-700 px-2 py-1 rounded capitalize"> {ft}</span>)}
                            </div>
                        </div>

                        {suggestedFood.ingredients && suggestedFood.ingredients.length > 0 && (
                            <div>
                                <span className="font-semibold block text-gray-700">Ingredients</span>
                                <p className="mt-1 text-gray-600 capitalize">{suggestedFood.ingredients.join(', ')}</p>
                            </div>
                        )}

                        {suggestedFood.nutrition && (
                            <div>
                                <span className="font-semibold block text-gray-700">Nutrition (per serving)</span>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-gray-600">
                                    <span>Calories: {suggestedFood.nutrition.calories || 'N/A'}</span>
                                    <span>Protein: {suggestedFood.nutrition.protein || 'N/A'}g</span>
                                    <span>Carbs: {suggestedFood.nutrition.carbs || 'N/A'}g</span>
                                    <span>Fat: {suggestedFood.nutrition.fat || 'N/A'}g</span>
                                </div>
                            </div>
                        )}

                        {/* <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-semibold block text-gray-700">Meal Timing</span>
                                <div className="mt-1 text-gray-600 capitalize">{suggestedFood.mealTiming?.join(', ')}</div>
                            </div>
                        </div> */}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={handleConfirm}
                            disabled={isConfirmed}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isConfirmed ? 'Confirmed!' : 'Confirm Selection'}
                        </button>
                        <button 
                            onClick={handleNextSuggestion}
                            disabled={isConfirmed || foods.length <= 1}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors border border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            No, Change Food
                        </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}