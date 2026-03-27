export function getAutoMealTiming(hour = new Date().getHours()) {

  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 19) return "snacks";
  if (hour >= 19 && hour < 23) return "dinner";
  return "late-night";
}

export function getAutoWeatherCondition(month = new Date().getMonth()) {
  // month is 0-11 (Jan-Dec)
  if (month === 11 || month === 0 || month === 1) { // Dec, Jan, Feb
    return "winter";
  }
  if (month >= 2 && month <= 5) { // Mar, Apr, May, Jun
    return "summer";
  }
  if (month >= 6 && month <= 8) { // Jul, Aug, Sep
    return "rainy";
  }
  // Oct, Nov
  return "all-season";
}



export const MEAL_SPECIFIC_INGREDIENTS = {
  breakfast: [
    { id: "poha",       label: "Poha" },
    { id: "bread",      label: "Bread" },
    { id: "eggs",       label: "Eggs" },
    { id: "dosa",       label: "Dosa" },
    { id: "idli",       label: "Idli" },
  ],
  lunch: [
    { id: "dal",        label: "Dal" },
    { id: "chawal",     label: "Chawal (Rice)" },
    { id: "roti",       label: "Roti" },
    { id: "paneer",     label: "Paneer" },
    { id: "chicken",    label: "Chicken" },
  ],
  snacks: [
    { id: "samosa",     label: "Samosa" },
    { id: "maggi",      label: "Maggi" },
    { id: "pakora",     label: "Pakora" },
    { id: "bhel",       label: "Bhel Puri" },
    { id: "fries",      label: "Fries" },
  ],
  dinner: [
    { id: "chicken",    label: "Chicken" },
    { id: "paneer",     label: "Paneer" },
    { id: "dal",        label: "Dal Makhani" },
    { id: "roti",       label: "Roti" },
    { id: "biryani",    label: "Biryani" },
  ],
  'late-night': [
    { id: "maggi",      label: "Maggi" },
    { id: "popcorn",    label: "Popcorn" },
  ],
};