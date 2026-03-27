"use client";

import React, { useState } from "react";
import Input from "./commen/Input";
import Button from "./commen/Button";
import { MEAL_SPECIFIC_INGREDIENTS } from "@/lib/utils";
import {
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  FOOD_STYLE_OPTIONS,
  // OCCASION_OPTIONS,
} from "@/lib/constants";

const SPICE_LEVEL_OPTIONS = ["mild", "medium", "spicy", "extra-spicy"];

export default function AddFoodForm({ onAdded }) {
  const [form, setForm] = useState({
    name: "",
    image: null,          
    imageUrl: "",        
    useUrl: false,         
    description: "",
    category: "",
    mealTiming: [],
    dietType: "",
    healthGoals: [],
    cuisine: [],
    mood: [],
    weather: [],
    foodStyle: [],
    foodType: "online",
    ingredients: [],
    spiceLevel: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    // occasion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Flatten ingredients for the dropdown
  const allIngredientsList = React.useMemo(() => {
    const map = new Map();
    Object.values(MEAL_SPECIFIC_INGREDIENTS).forEach((list) => {
      list.forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item.label);
        }
      });
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const toggleSelection = (name, value) => {
    setForm((f) => {
      const current = f[name] || [];
      if (current.includes(value)) {
        return { ...f, [name]: current.filter((item) => item !== value) };
      }
      return { ...f, [name]: [...current, value] };
    });
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const renderMultiSelect = (label, name, options) => {
    const isOpen = activeDropdown === name;
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <button
          type="button"
          onClick={() => setActiveDropdown(isOpen ? null : name)}
          className="block w-full border rounded px-2 py-2 text-left bg-white min-h-[38px] flex justify-between items-center"
        >
          {form[name].length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {form[name].map((item) => (
                <span key={item} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">Select {label}...</span>
          )}
          <span className="text-xs ml-2">▼</span>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
            <div className="absolute z-20 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto p-2">
              {options.map((opt) => (
                <label key={opt} className="flex items-center space-x-2 p-1 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[name].includes(opt)}
                    onChange={() => toggleSelection(name, opt)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      name: form.name,
      description: form.description,
    };

    if (form.category) body.category = form.category;

    const toArray = (str) => str ? str.split(",").map((s) => s.trim().toLowerCase()) : [];
    
    // Multi-select fields are already arrays
    if (form.mealTiming.length) body.mealTiming = form.mealTiming;
    if (form.dietType) body.dietType = [form.dietType];
    if (form.healthGoals.length) body.healthGoals = form.healthGoals;
    if (form.cuisine.length) body.cuisine = form.cuisine;
    if (form.mood.length) body.mood = form.mood;
    if (form.weather.length) body.weather = form.weather;
    if (form.foodStyle.length) body.foodStyle = form.foodStyle;
    
    // New fields
    if (form.foodType) body.foodType = [form.foodType];
    if (form.ingredients.length) body.ingredients = form.ingredients;
    if (form.spiceLevel) body.spiceLevel = [form.spiceLevel];

    body.nutrition = {
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    };

    // if (form.occasion) body.occasion = toArray(form.occasion);

    // image handling: file -> base64, or if using URL use that directly
    if (form.useUrl && form.imageUrl) {
      body.image = form.imageUrl;
    } else if (form.image instanceof File) {
      body.image = await fileToBase64(form.image);
    }

    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add food");
      }

      const newFood = await res.json();
      setForm({
        name: "",
        image: "",
        imageUrl: "",
        useUrl: false,
        description: "",
        category: "",
        mealTiming: [],
        dietType: "",
        healthGoals: [],
        cuisine: [],
        mood: [],
        weather: [],
        foodStyle: [],
        foodType: "online",
        ingredients: [],
        spiceLevel: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        // occasion: "",
      });
      setPreviewUrl(null);

      if (onAdded) onAdded(newFood);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("Form state:", form);

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <h2 className="text-xl font-semibold">Add New Food</h2>

      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium" htmlFor="useUrl">
          Image source
        </label>
        <div className="flex items-center space-x-4 mt-1">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="useUrl"
              value={true}
              checked={form.useUrl}
              onChange={() => setForm((f) => ({ ...f, useUrl: true }))}
            />
            <span className="text-sm">URL</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="useUrl"
              value={false}
              checked={!form.useUrl}
              onChange={() => {
                setForm((f) => ({ ...f, useUrl: false, imageUrl: "" }));
                setPreviewUrl(null);
              }}
            />
            <span className="text-sm">Upload</span>
          </label>
        </div>
      </div>
      {form.useUrl ? (
        <>
          <Input
            label="Image URL"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium" htmlFor="imageFile">
            Upload Image
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setForm((f) => ({ ...f, image: e.target.files[0] }));
                setPreviewUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-1"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      {/* Food Type */}
      <div>
        <label className="block text-sm font-medium" htmlFor="foodType">
          Food Type
        </label>
        <select
          id="foodType"
          name="foodType"
          value={form.foodType}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        >
          <option value="online">Order Online</option>
          <option value="self-cooking">Self Cooking</option>
        </select>
      </div>

      {/* Ingredients Multi-select */}
      <div className="relative">
        <label className="block text-sm font-medium mb-1">Ingredients</label>
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === 'ingredients' ? null : 'ingredients')}
          className="block w-full border rounded px-2 py-2 text-left bg-white min-h-[38px] flex justify-between items-center"
        >
          {form.ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {form.ingredients.map((id) => {
                const item = allIngredientsList.find((i) => i.id === id);
                return (
                  <span key={id} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                    {item ? item.label : id}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-gray-400">Select ingredients...</span>
          )}
          <span className="text-xs ml-2">▼</span>
        </button>

        {activeDropdown === 'ingredients' && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
            <div className="absolute z-20 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto p-2">
              {allIngredientsList.map((item) => (
                <label key={item.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.ingredients.includes(item.id)}
                    onChange={() => toggleSelection('ingredients', item.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="dietType">
            Diet Type
          </label>
          <select
            id="dietType"
            name="dietType"
            value={form.dietType}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {DIET_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          {renderMultiSelect("Health Goals", "healthGoals", HEALTH_GOALS_OPTIONS)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {renderMultiSelect("Cuisine", "cuisine", CUISINE_OPTIONS)}
        </div>
        <div>
          {renderMultiSelect("Mood", "mood", MOOD_OPTIONS)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {renderMultiSelect("Meal Timing", "mealTiming", MEAL_TIMING_OPTIONS)}
        </div>
        <div>
          {renderMultiSelect("Weather", "weather", WEATHER_OPTIONS)}
        </div>
        <div>
          {renderMultiSelect("Food Style", "foodStyle", FOOD_STYLE_OPTIONS)}
        </div>
        {/* <div>
          <label className="block text-sm font-medium" htmlFor="occasion">
            Occasion
          </label>
          <select
            id="occasion"
            name="occasion"
            value={form.occasion}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {OCCASION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Spice Level */}
      <div>
        <label className="block text-sm font-medium" htmlFor="spiceLevel">
          Spice Level
        </label>
        <select
          id="spiceLevel"
          name="spiceLevel"
          value={form.spiceLevel}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        >
          <option value="">-- choose --</option>
          {SPICE_LEVEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Nutrition Fields */}
      <div className="border p-3 rounded bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Nutrition (Per Serving)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            label="Calories"
            name="calories"
            type="number"
            value={form.calories}
            onChange={handleChange}
            placeholder="e.g. 650"
          />
          <Input
            label="Protein (g)"
            name="protein"
            type="number"
            value={form.protein}
            onChange={handleChange}
            placeholder="e.g. 22"
          />
          <Input
            label="Carbs (g)"
            name="carbs"
            type="number"
            value={form.carbs}
            onChange={handleChange}
            placeholder="e.g. 60"
          />
          <Input
            label="Fat (g)"
            name="fat"
            type="number"
            value={form.fat}
            onChange={handleChange}
            placeholder="e.g. 35"
          />
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Food"}
      </Button>
    </form>
  );
}
