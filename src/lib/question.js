export const DIET_OPTIONS = [
  { value: "omnivore", label: "Omnivore" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "gluten-free", label: "Gluten Free" },
];

export const ALLERGY_OPTIONS = [
  { value: "nuts", label: "Nuts" }, { value: "dairy", label: "Dairy" }, { value: "eggs", label: "Eggs" },
  { value: "soy", label: "Soy" }, { value: "shellfish", label: "Shellfish" }, { value: "gluten", label: "Gluten" },
];

export const GOAL_OPTIONS = [
  { value: "weight-loss", label: "Weight Loss" }, { value: "muscle-gain", label: "Muscle Gain" }, { value: "energy", label: "More Energy" },
  { value: "heart-health", label: "Heart Health" }, { value: "gut-health", label: "Gut Health" }, { value: "balanced", label: "Stay Balanced" },
];

export const CUISINE_OPTIONS = [
  { value: "indian", label: "Indian" }, { value: "italian", label: "Italian" }, { value: "mexican", label: "Mexican" },
  { value: "japanese", label: "Japanese" }, { value: "american", label: "American" }, { value: "thai", label: "Thai" },
];

export const OPTIONS_MAP = {
  dietType: DIET_OPTIONS,
  allergies: ALLERGY_OPTIONS,
  healthGoals: GOAL_OPTIONS,
  cuisine: CUISINE_OPTIONS,
};