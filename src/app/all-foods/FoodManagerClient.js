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
        <p className="text-center text-[var(--text-muted)]">No food items found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food._id} className="glass-card p-5 rounded-3xl border border-white/10 bg-white/5 shadow-xl relative group">
                {/* Action Icons */}
                <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => router.push(`/add-food?edit=${food._id}`)}
                    className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-lg"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(food._id)}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg"
                    title="Delete Permanently"
                  >
                    🗑️
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-3xl mb-4 h-56 bg-slate-900">
                  <img 
                    src={food.image || "https://placehold.co/600x400?text=No+Image"} 
                    alt={food.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-black text-white">{food.name}</h2>
                  {food.price && <span className="text-green-400 font-bold">₹{food.price}</span>}
                </div>

                <p className="text-xs uppercase tracking-widest text-green-500 font-black mb-2">
                  {food.category || "General"}
                </p>
                
                <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2 leading-relaxed">
                  {food.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {food.cuisine?.slice(0, 3).map(c => (
                    <span key={c} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] text-white/70 uppercase font-bold">{c}</span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {food.foodType?.map((type) => (
                    <span key={type} className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${
                      type === 'online' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    }`}>
                      {type === 'online' ? 'Online Order' : ' Self Cooking'}
                    </span>
                  ))}
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