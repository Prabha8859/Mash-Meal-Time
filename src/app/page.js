import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAutoMealTiming, getAutoWeatherCondition } from "@/lib/utils";
import FoodSpin from "@/components/FoodSpin";
import LogoutButton from "@/components/LogoutButton";
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
    <div className="min-h-screen relative bg-black selection:bg-orange-500 selection:text-white overflow-hidden group">

      <div className="fixed inset-0 z-0">
        {/* Cinematic Background Video */}
        <video
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          preload="auto"
          src="/assets/img/video-bg-03.mp4"
          className="w-full h-full object-cover scale-105 transition-all duration-700 ease-in-out"
          style={{ filter: "brightness(0.4) saturate(0.9)" }}
        >
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 group-hover:opacity-40 transition-opacity duration-1000" />
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
      <div className="relative z-10 w-full mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
        <header className="flex items-start justify-between py-1 sm:py-2">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center gap-2 z-20 pt-1 sm:pt-2">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 border border-white/20 flex-shrink-0">
              <span className="text-xl sm:text-2xl">🍽️</span>
            </div>
            <span className="font-black text-sm sm:text-xl tracking-tighter text-white hidden md:block">
              Meal<span className="text-green-400">Mind</span>
            </span>
          </div>

          {/* Center: FoodSpin */}
          <div className="flex-[4] flex justify-center z-10 min-w-0 food-spin-wrap transition-transform duration-500 hover:scale-[1.02] py-2 sm:py-2">
            <FoodSpin
              initialFoods={foods}
              isFiltered={isFiltered}
              mealTiming={mealTimingForComponent}
              baseParams={queryString}
            />
          </div>

          {/* Right: User Menu */}
          <div className="flex-1 flex justify-end z-20 pt-1 sm:pt-2">
            <LogoutButton />
          </div>
        </header>

        {/* <main className="flex flex-col items-center justify-center pb-12">
           Main interaction happens within FoodSpin centered above
        </main> */}
      </div>
    </div>
  );
}