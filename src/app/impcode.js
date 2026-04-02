import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAutoMealTiming, getAutoWeatherCondition } from "@/lib/utils";
import FoodSpin from "@/components/FoodSpin";
import LogoutButton from "@/components/LogoutButton";
import FloatingLines from "@/components/FloatingLines";
import { cookies } from "next/headers";

async function getFoods(queryString = "") {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const url = new URL("/api/foods", baseUrl);
    if (queryString) url.search = queryString;

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return [];
    }

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
  if (!user?.questionnaire || user?.questionnaire?.length === 0)
    redirect("/preferences");

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
            ["no allergies", "no-allergies", "no"].includes(
              values[0].toLowerCase()
            )) ||
          (apiField === "healthGoals" &&
            pref.questionId === "healthSuggestions" &&
            values[0].toLowerCase() === "no")
        )
          return;

        let formattedValues = values.map((v) =>
          v.toLowerCase().replace(/\s+/g, "-")
        );

        if (apiField === "dietType") {
          formattedValues = formattedValues.map((v) =>
            v === "vegetarian"
              ? "veg"
              : v === "non-vegetarian"
              ? "non-veg"
              : v
          );
        }

        if (apiField === "foodType") return;

        params.append(apiField, formattedValues.join(","));
      });
    }

    if (!params.has("mealTiming"))
      params.set("mealTiming", getAutoMealTiming());

    if (!params.has("weather"))
      params.set("weather", getAutoWeatherCondition());

    queryString = params.toString();
  }

  const foods = await getFoods(queryString);

  const finalParams = new URLSearchParams(queryString);
  const mealTimingForComponent =
    finalParams.get("mealTiming")?.split(",")[0] || "Lunch";

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black/20">

      {/* ── LAYER 1: Background Video ── */}
      {/* <video
        autoPlay
        muted
        loop
        playsInline
        src="/assets/img/video-bg-03.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "brightness(0.4) saturate(0.9)" }}
      /> */}

      {/* ── LAYER 2: Dark overlay so lines stay visible ── */}
      <div className="absolute inset-0 bg-black/ z-[1]" />

      <div className="absolute inset-0 z-[2]">
        <FloatingLines
          enabledWaves={["middle", "bottom", "top",]}
          lineCount={[5, 4]}
          lineDistance={[5, 4]}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          parallaxStrength={0.15}
          animationSpeed={0.6}
          linesGradient={["#E945F5", "#2F4BC0", "#E945F6", "#ffffff"]}
          mixBlendMode="screen"
        />
      </div>

      {/* ── LAYER 4: Header ── */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-4 pt-2 z-20">

        {/* Left Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-xl">🍽️</span>
          </div>
          <span className="text-white font-bold hidden md:block">
            Meal<span className="text-green-400">Mind</span>
          </span>
        </div>

        {/* Right Logout */}
        <LogoutButton />
      </header>

      {/* ── LAYER 5: FoodSpin (center, above lines) ── */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <FoodSpin
          initialFoods={foods}
          isFiltered={queryString.length > 0}
          mealTiming={mealTimingForComponent}
          baseParams={queryString}
        />
      </div>

    </div>
  );
}