import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ShapeGrid from "@/components/FloatingLines";
import FoodManagerClient from "./FoodManagerClient";

async function getAllFoods(page = 1) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const fetchUrl = `${baseUrl.replace(/\/$/, "")}/api/foods?page=${page}&limit=20&fullImage=true`;

    const res = await fetch(fetchUrl, { cache: "no-store" });
    if (!res.ok) return { foods: [], totalPages: 0, totalCount: 0 };
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching all foods:", error);
    return { foods: [], totalPages: 0, totalCount: 0 };
  }
}

export default async function AllFoodsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page) || 1;
  const session = await getServerSession(authOptions);
  // if (!session) redirect("/login"); // Comment this to allow guest access

  const { foods, totalPages, totalCount } = await getAllFoods(page);

  return (
    <main className="min-h-screen relative bg-[var(--bg-color)] transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <ShapeGrid
          speed={0.1}
          squareSize={60}
          direction="diagonal"
          borderColor="rgba(34, 197, 94, 0.1)"
          hoverFillColor="rgba(34, 197, 94, 0.05)"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="font-syne text-5xl md:text-7xl font-black text-[var(--text-main)] mb-4 tracking-tighter">
              Full <span className="text-green-500">Menu</span>
            </h1>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-base sm:text-lg">
              Explore the full list of meals and discover the right food for your day.
            </p>
          </div>

          <div className="glass-card p-6 rounded-[3rem]">
            <FoodManagerClient initialFoods={foods} totalPages={totalPages} currentPage={page} totalCount={totalCount} />
          </div>
        </div>
      </div>
    </main>
  );
}
