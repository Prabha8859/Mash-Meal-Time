import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getAutoMealTiming, getAutoWeatherCondition } from "@/lib/utils";
import FoodSpin from "@/components/FoodSpin";
import Header from "@/components/Header";
import { cookies } from "next/headers";


async function getFoods(queryString = "") {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = queryString ? `${base}/api/foods?${queryString}` : `${base}/api/foods`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error(`API call failed with status: ${res.status}`);
    throw new Error("Failed to fetch foods");
  }
  return res.json();
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/register");

  const user = session.user;
  if (!user.questionnaire || user.questionnaire.length === 0) redirect("/preferences");

  const cookieStore = await cookies();
  const tempFilters = cookieStore.get("temp_filters");
  let queryString = "";

  if (tempFilters) {
    queryString = tempFilters.value;
  } else {
    const params = new URLSearchParams();
    const FIELD_MAP = {
      healthSuggestions: "healthGoals",
      allergies: "restrictedIngredients",
      weightGoal: "healthGoals",
    };

    if (user.questionnaire) {
      user.questionnaire.forEach((pref) => {
        const apiField = FIELD_MAP[pref.questionId] || pref.questionId;
        const values = pref.answer;
        if (!values || values.length === 0 || values[0] === "") return;
        if (
          (apiField === "restrictedIngredients" &&
            (values[0].toLowerCase() === "no allergies" ||
              values[0].toLowerCase() === "no-allergies" ||
              values[0].toLowerCase() === "no")) ||
          (apiField === "healthGoals" &&
            pref.questionId === "healthSuggestions" &&
            values[0].toLowerCase() === "no")
        ) {
          // skip
        } else {
          let formattedValues = values.map((v) => v.toLowerCase().replace(/\s+/g, "-"));
          if (apiField === "dietType") {
            formattedValues = formattedValues.map((v) =>
              v === "vegetarian" ? "veg" : v === "non-vegetarian" ? "non-veg" : v
            );
          }
          if (apiField === "foodType") return;
          params.append(apiField, formattedValues.join(","));
        }
      });
    }

    if (!params.has("mealTiming")) {
      params.set("mealTiming", getAutoMealTiming());
    }
    if (!params.has("weather")) {
      params.set("weather", getAutoWeatherCondition());
    }
    queryString = params.toString();
  }

  const isFiltered = queryString.length > 0;
  const foods = await getFoods(queryString);
  const finalParams = new URLSearchParams(queryString);
  const mealTimingForComponent = finalParams.get("mealTiming")?.split(",")[0] || "Lunch";

  return (
    <div className="min-h-screen relative bg-black selection:bg-orange-500 selection:text-white">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt="Food Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/15 to-white/15" />
        {/* <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div> */}
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <Header /> */}
        <main className="flex justify-center items-start min-h-[80vh] py-2">
          
          <FoodSpin
            initialFoods={foods}
            isFiltered={isFiltered}
            mealTiming={mealTimingForComponent}
            baseParams={queryString}
          />
        </main>

      </div>
    </div>
  );
}