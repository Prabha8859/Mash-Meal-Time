import mongoose from "mongoose";
import {
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  FOOD_STYLE_OPTIONS,
  INGREDIENT_RESTRICTION_OPTIONS,
  // COOK_TIME_OPTIONS,
  // BUDGET_OPTIONS,
  FOOD_TYPE_OPTIONS,
  SPICE_LEVEL_OPTIONS,



} from "@/lib/constants";

const FoodSchema = new mongoose.Schema(
{
  // BASIC INFO
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  description: String,

  // SEARCH KEYWORDS
  searchKeywords: [String],

  // CATEGORY
  category: {
    type: String
  },

  // MEAL TIMING
  mealTiming: {
    type: [String],
    enum: MEAL_TIMING_OPTIONS
  },

  // DIET TYPE
  dietType: {
    type: [String],
    enum: DIET_TYPE_OPTIONS
  },

  // HEALTH GOALS
  healthGoals: {
    type: [String],
    enum: HEALTH_GOALS_OPTIONS
  },
  //spice level
  spiceLevel: {
    type: [String],
    enum: SPICE_LEVEL_OPTIONS
  },


  // CUISINE
  cuisine: {
    type: [String],
    enum: CUISINE_OPTIONS
  },

  // INGREDIENTS
  ingredients: [String],

  // INGREDIENT RESTRICTIONS
  restrictedIngredients: {
    type: [String],
    enum: INGREDIENT_RESTRICTION_OPTIONS
  },

  // FOOD STYLE
  foodStyle: {
    type: [String],
    enum: FOOD_STYLE_OPTIONS
  },

  // MOOD
  mood: {
    type: [String],
    enum: MOOD_OPTIONS
  },

  // WEATHER
  weather: {
    type: [String],
    enum: WEATHER_OPTIONS
  },

  // NUTRITION
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  // Food Type
  foodType: {
    type: [String],
    enum: FOOD_TYPE_OPTIONS
  },
  
  //cooking time in minutes
  // cookingTime:{
  //   type: String,
  //   enum: COOK_TIME_OPTIONS
  // },
  // // budget in dollars
  // budget: {
  //   type: String,
  //   enum: BUDGET_OPTIONS
  // }

},
{ timestamps: true }
);

export default mongoose.models.Food ||
mongoose.model("Food", FoodSchema);