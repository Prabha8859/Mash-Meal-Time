import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAutoMealTiming, getAutoWeatherCondition } from "@/lib/utils";
import FoodSpin from "@/components/FoodSpin";
import Header from "@/components/Header";
import { cookies } from "next/headers";

async function getFoods(queryString = "") {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const url = new URL("/api/foods", baseUrl);
    if (queryString) url.search = queryString;

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) { console.error("API ERROR:", res.status); return []; }
    return await res.json();
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return [];
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/register");

  const user = session.user;
  if (!user?.questionnaire || user?.questionnaire?.length === 0) redirect("/preferences");

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
        const values   = pref.answer;
        if (!values || values.length === 0 || values[0] === "") return;
        if (
          (apiField === "restrictedIngredients" &&
            ["no allergies","no-allergies","no"].includes(values[0].toLowerCase())) ||
          (apiField === "healthGoals" &&
            pref.questionId === "healthSuggestions" &&
            values[0].toLowerCase() === "no")
        ) return;

        let formattedValues = values.map((v) => v.toLowerCase().replace(/\s+/g, "-"));
        if (apiField === "dietType") {
          formattedValues = formattedValues.map((v) =>
            v === "vegetarian" ? "veg" : v === "non-vegetarian" ? "non-veg" : v
          );
        }
        if (apiField === "foodType") return;
        params.append(apiField, formattedValues.join(","));
      });
    }
    if (!params.has("mealTiming")) params.set("mealTiming", getAutoMealTiming());
    if (!params.has("weather"))    params.set("weather",    getAutoWeatherCondition());
    queryString = params.toString();
  }

  const isFiltered = queryString.length > 0;
  const foods      = await getFoods(queryString);
  const finalParams = new URLSearchParams(queryString);
  const mealTimingForComponent = finalParams.get("mealTiming")?.split(",")[0] || "Lunch";

  return (
    <div className="min-h-screen relative bg-black selection:bg-orange-500 selection:text-white overflow-hidden">

      <div className="fixed inset-0 z-0">
        {/* Base food photo */}
        <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt=""
          className="w-full h-full object-cover scale-105"
          style={{ filter: "saturate(1.15) brightness(0.55)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-orange-950/10 to-black/10" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(251,146,60,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
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