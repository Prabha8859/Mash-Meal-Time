"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FoodManagerClient({ initialFoods, totalPages, currentPage, totalCount }) {
  const [foods, setFoods] = useState(initialFoods);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Update local state when pagination brings new data from the server
  useEffect(() => {
    setFoods(initialFoods);
    setIsNavigating(false);
  }, [initialFoods]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this food permanently?")) return;
    try {
      const res = await fetch(`/api/foods?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFoods(foods.filter(f => f._id !== id));
        alert("Deleted successfully");
      }
    } catch (err) {
      alert("Error deleting food");
    }
  };

  const handlePageChange = (newPage) => {
    setIsNavigating(true);
    router.push(`/all-foods?page=${newPage}`);
  };

  return (
    <div className={`space-y-8 transition-opacity duration-300 ${isNavigating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-4 px-2">
        <p className="text-sm font-bold text-green-500 uppercase tracking-widest">Total Items: {totalCount || 0}</p>
        {isNavigating && <span className="text-xs text-white animate-pulse">Loading Next Page...</span>}
      </div>

      {foods.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-20">No food items found.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {foods.map((food) => (
              <div key={food._id} className="glass-card p-4 sm:p-5 rounded-[2rem] border border-white/10 bg-white/5 flex flex-col sm:flex-row gap-6 items-center group transition-all hover:bg-white/[0.08]">
                
                {/* Food Image */}
                <div className="relative overflow-hidden rounded-2xl w-full sm:w-40 h-40 flex-shrink-0 bg-slate-900">
                  <img 
                    src={food.image || "https://placehold.co/600x400?text=No+Image"} 
                    alt={food.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Main Data Section */}
                <div className="flex-grow w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">{food.name}</h2>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-black mt-1">
                        {food.category || "General"}
                      </p>
                    </div>
                    {food.price && (
                      <span className="text-xl font-black text-green-400 bg-green-400/10 px-4 py-1 rounded-full border border-green-400/20">
                        ₹{food.price}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2 leading-relaxed max-w-2xl">
                    {food.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Diet Type Display */}
                    <div className="flex gap-2">
                      {food.dietType?.map((diet) => (
                        <span key={diet} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          diet.toLowerCase().includes('veg') && !diet.toLowerCase().includes('non') 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          🌱 {diet}
                        </span>
                      ))}
                    </div>

                    <div className="h-4 w-px bg-white/10 hidden sm:block" />

                    {/* Cuisine Tags */}
                    <div className="flex flex-wrap gap-2">
                      {food.cuisine?.slice(0, 3).map(c => (
                        <span key={c} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[9px] text-white/50 uppercase font-bold">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons & FoodType */}
                <div className="flex flex-col justify-between items-end gap-4 w-full sm:w-auto sm:min-w-[150px] border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => router.push(`/add-food?edit=${food._id}`)}
                      className="flex-1 sm:flex-none py-2 px-4 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl border border-blue-500/20 transition-all font-bold text-xs"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => handleDelete(food._id)}
                      className="flex-1 sm:flex-none py-2 px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all font-bold text-xs"
                    >
                      DELETE
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    {food.foodType?.map((type) => (
                      <span key={type} className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${
                      type === 'online' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    }`}>
                      {type === 'online' ? 'Online Order' : ' Self Cooking'}
                    </span>
                  ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-12 pb-8">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-all font-bold"
            >
              ← Previous
            </button>
            <span className="text-white font-bold">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-6 py-2 rounded-xl bg-green-500 text-black font-black hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
            >
              Next Page →
            </button>
          </div>
        </>
      )}
    </div>
  );
}