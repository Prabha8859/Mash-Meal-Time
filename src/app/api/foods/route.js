import connectDB from "@/lib/db";
import Food from "@/models/Food";

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
  spiceLevel: SPICE_LEVEL_OPTIONS
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
    const FoodModel = (await import("@/models/Food")).default;

    const body = await req.json();

    console.log("Incoming body:", body); 

    const arrayFields = ['mealTiming', 'dietType', 'healthGoals', 'cuisine', 'mood', 'weather', 'foodStyle', 'searchKeywords', 'ingredients', 'restrictedIngredients', 'foodType', 'spiceLevel'];
    
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

  const newFood = await FoodModel.create(body);

    return Response.json(newFood, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error); // VERY IMPORTANT
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
     const FoodModel = (await import("@/models/Food")).default;

    const { searchParams } = new URL(req.url);
    const query = {};

    for (const [key, value] of searchParams.entries()) {
      // 1. Handle Enum Fields
      if (FIELD_VALIDATION[key]) {
        const inputValues = value.split(',').map(v => v.trim().toLowerCase().replace(/\s+/g, '-'));
        
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
        // It checks if the `restrictedIngredients` field in the DB contains the user's allergies.
        const ingredientsToLookFor = value.split(',')
          .map(v => v.trim().toLowerCase())
          .filter(v => v && v !== 'no-allergies' && v !== 'no allergies');

        if (ingredientsToLookFor.length > 0) {
          //  URL is `allergies=garlic,onion`, it finds foods where `restrictedIngredients` contains BOTH.
          query.restrictedIngredients = { $all: ingredientsToLookFor.map(ing => new RegExp(ing, 'i')) };
        }
      } else if (key === 'ingredients') {
        // 2. ingredients' parameter for self-cooking
        const ingredientsList = value.split(',')
          .map(v => v.trim().toLowerCase())
          .filter(v => v); 

        if (ingredientsList.length > 0) {
          if (!query.ingredients) {
            query.ingredients = {};
          }
          query.ingredients.$all = ingredientsList.map(ing => new RegExp(ing, 'i'));
        }
      } else if (key === 'search' || key === 'searchKeywords') {
        const searchTerm = value.trim().toLowerCase();
        // NO FILTER
        if (searchTerm.startsWith("no ")) {
          const ingredient = searchTerm.replace("no ", "").trim();
          if (!query.ingredients) {
            query.ingredients = {};
          }
          if (!query.ingredients.$nin) query.ingredients.$nin = [];
          query.ingredients.$nin.push(new RegExp(ingredient, 'i'));
        } else {
          query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { searchKeywords: { $regex: searchTerm, $options: 'i' } },
            { ingredients: { $regex: searchTerm, $options: 'i' } }
          ];
        }
      }
    }

    console.log("Database Query:", JSON.stringify(query, null, 2));

     const foods = await FoodModel.find(query).lean();

    return Response.json(foods);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
