import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FoodModel from "@/models/Food";

export const dynamic = "force-dynamic"; // 🔥 MUST

import {
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  FOOD_STYLE_OPTIONS,
  INGREDIENT_RESTRICTION_OPTIONS,
  FOOD_TYPE_OPTIONS,
  SPICE_LEVEL_OPTIONS,
} from "@/lib/constants";

// Map field names to their valid options for validation/sanitization
const FIELD_VALIDATION = {
  foodStyle: FOOD_STYLE_OPTIONS,
  // spiceLevel: ["spicy", "mild", "normal"],
  mealTiming: MEAL_TIMING_OPTIONS,
  dietType: DIET_TYPE_OPTIONS,
  healthGoals: HEALTH_GOALS_OPTIONS,
  cuisine: CUISINE_OPTIONS,
  mood: MOOD_OPTIONS,
  weather: WEATHER_OPTIONS,
  foodType: FOOD_TYPE_OPTIONS,
  spiceLevel: SPICE_LEVEL_OPTIONS,
  category: ["vegetarian", "non-vegetarian", "veg", "non-veg", "fast-food"]
};

const SYNONYM_MAP = {
  dietType: {
    'veg': ['veg', 'vegetarian'],
    'vegetarian': ['veg', 'vegetarian'],
    'pure-vegetarian': ['veg', 'vegetarian'],
    'non-veg': ['non-veg', 'non-vegetarian'],
    'non-vegetarian': ['non-veg', 'non-vegetarian'],
  },
  mood: {
    'happy': ['excited'],
  }
};

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const arrayFields = ['mealTiming', 'dietType', 'healthGoals', 'cuisine', 'mood', 'weather', 'foodStyle', 'searchKeywords', 'ingredients', 'restrictedIngredients', 'foodType', 'spiceLevel', 'items'];
    
    arrayFields.forEach(field => {
      if (body[field]) {
        let values = [];
        if (Array.isArray(body[field])) {
          values = body[field].map(s => String(s).trim().toLowerCase());
        } else {
          values = String(body[field]).split(',').map(s => s.trim().toLowerCase());
        }
        
        if (field === 'dietType') {
          values = values.map(s => {
            if (['vegetarian', 'pure vegetarian', 'pure-vegetarian'].includes(s)) return 'veg';
            if (['non-vegetarian', 'non vegetarian'].includes(s)) return 'non-veg';
            return s;
          });
        }
        
        body[field] = values;
      }
    });

    // This operation is slow because the 'body' contains a 15MB image string.
    // Consider using an external storage like Cloudinary or AWS S3.
    const newFood = await FoodModel.create(body);

    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error); // VERY IMPORTANT
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const startTime = Date.now();
  try {
    await connectDB();

    // Ensure indexes exist for better performance
    try {
      await FoodModel.collection.createIndex({ dietType: 1 });
      await FoodModel.collection.createIndex({ healthGoals: 1 });
      await FoodModel.collection.createIndex({ cuisine: 1 });
      await FoodModel.collection.createIndex({ mealTiming: 1 });
      await FoodModel.collection.createIndex({ weather: 1 });
      await FoodModel.collection.createIndex({ ingredients: 1 });
      await FoodModel.collection.createIndex({ foodType: 1 });
      console.log("Index creation attempted");
    } catch (indexError) {
      console.log("Index creation skipped or failed:", indexError.message);
    }

    const { searchParams } = req.nextUrl;
    const query = {};

    // Pagination Params
    const page = parseInt(searchParams.get("page")) || 1;
    
    const limit = Math.min(parseInt(searchParams.get("limit")) || 20, 50);
    const skip = (page - 1) * limit;

    const processValues = (values) =>
      values
        .flatMap(value => String(value).split(','))
        .map(v => v.trim().toLowerCase())
        .filter(Boolean);

    for (const key of new Set(searchParams.keys())) {
      const values = searchParams.getAll(key);
      // 1. Handle Enum Fields
      if (FIELD_VALIDATION[key]) {
        const inputValues = processValues(values).map(v => v.replace(/\s+/g, '-'));
        const searchValues = new Set();

        inputValues.forEach(val => {
          if (SYNONYM_MAP[key] && SYNONYM_MAP[key][val]) {
            SYNONYM_MAP[key][val].forEach(s => searchValues.add(s));
          } else {
            searchValues.add(val);
          }
        });

        if (searchValues.size > 0) {
          query[key] = { $in: Array.from(searchValues) };
        }
      } else if (key === 'restrictedIngredients' || key === 'allergies') {
        const excludedItemsList = processValues(values).filter(
          (v) => !['no-allergies', 'no allergies', 'no'].includes(v),
        );

        if (excludedItemsList.length > 0) {
          if (!query.ingredients) query.ingredients = {};
          if (!query.ingredients.$nin) query.ingredients.$nin = [];
          
          excludedItemsList.forEach(i => {
            const regex = new RegExp(`^${i}$`, 'i');
            if (!query.ingredients.$nin.some(r => r.source === regex.source)) {
              query.ingredients.$nin.push(regex);
            }
          });
        }
      } else if (key === 'ingredients') {
        const ingredientsList = processValues(values);
        if (ingredientsList.length > 0) {
          if (!query.ingredients) query.ingredients = {};
          query.ingredients.$all = ingredientsList.map(i => new RegExp(`^${i}$`, 'i'));
        }
      } else if (key === 'search' || key === 'searchKeywords') {
        const searchTerms = processValues(values);
        const noIngredientsList = searchTerms
          .filter((searchTerm) => searchTerm.startsWith('no '))
          .map((searchTerm) => searchTerm.replace(/^no\s+/, '').trim());

        if (noIngredientsList.length > 0) {
          if (!query.ingredients) query.ingredients = {};
          if (!query.ingredients.$nin) query.ingredients.$nin = [];
          noIngredientsList.forEach(i => {
            const regex = new RegExp(`^${i}$`, 'i');
            if (!query.ingredients.$nin.some(r => r.source === regex.source)) {
              query.ingredients.$nin.push(regex);
            }
          });
        }

        const normalTerms = searchTerms.filter((searchTerm) => !searchTerm.startsWith('no '));
        if (normalTerms.length > 0) {
          query.$or = normalTerms.flatMap((searchTerm) => [
            { name: { $regex: searchTerm, $options: 'i' } },
            { searchKeywords: { $regex: searchTerm, $options: 'i' } },
          ]);
        }
      }
    }

     const projection = {
      name: 1,
      image: 1, // Always include image
      description: 1,
      category: 1,
      dietType: 1,
      cuisine: 1,
      healthGoals: 1,
      foodType: 1,
      mealTiming: 1,
    };

    // Add extra fields if requested
    if (searchParams.get('details') === 'true' || searchParams.get('fullImage') === 'true') {
      projection.ingredients = 1;
      projection.mood = 1;
      projection.weather = 1;
      projection.foodStyle = 1;
      projection.price = 1;
      projection.cookTime = 1;
    };

    // For non-paginated requests, fetch all and filter in JS for better performance
    let foods;
    let totalCount = 0;

    if (searchParams.get('page')) {
      totalCount = await FoodModel.countDocuments(query);
      console.log("[API /api/foods] Total documents matching query:", totalCount);

      foods = await FoodModel.find(query, projection)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    } else {
      // Simple approach: return filtered foods for fast response
      foods = await FoodModel.find(query, projection).limit(50).lean().exec();
      console.log("[API /api/foods] Returning all foods, found", foods.length, "foods");
    }

    console.log("[API /api/foods] Query completed, found", foods.length, "foods");
    console.log(`[API /api/foods] Total time: ${Date.now() - startTime}ms`);

    if (searchParams.get('page')) {
      const totalPages = Math.ceil(totalCount / limit);
      return NextResponse.json({ foods, totalPages, totalCount, page }, { status: 200 });
    } else {
      return NextResponse.json(foods, { status: 200 });
    }
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
