export const preferenceQuestions = [
  {
    type: "radio",
    title: "Q1 Are you vegetarian or non-vegetarian?",
    name: "dietType",
    options: ["veg", "non-veg"],
  },
  // {
  //   type: "radio",
  //   title: "Q2 Do you prefer spicy or mild?",
  //   name: "spiceLevel",
  //   options: ["mild", "medium", "spicy", "extra-spicy"],
  // },
  {
    type: "checkbox",
    title: "Q3 Any allergies? (max 5)",
    name: "allergies",
    options: ["No allergies", "Onion", "Garlic", "Dairy", "Peanuts", "Sugar", "Oil", "Nuts", "eggs"],
  },
  // {
  //   type: "radio",
  //   title: "Q4 Do you want healthy suggestions?",
  //   name: "healthSuggestions",
  //   options: ["Yes", "No"],
  // },
  {
    type: "radio",
    title: "Q4 What is your weight goal?",
    name: "weightGoal",
    options: [
      "weight-loss",
      "weight-gain",
      "maintain",
      "muscle-gain",
      "diabetic-friendly",
      "low-cholesterol",
      "low-sugar",
      "low-oil",
    ],
  },
];