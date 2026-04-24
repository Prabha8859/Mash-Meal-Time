import AddFoodForm from "../../components/AddFoodForm";
import Link from "next/link";

export default function AddFoodPage({ searchParams }) {
  const editId = searchParams?.edit || null;

  return (
    <div className="p-10 max-w-lg mx-auto">
      <Link
        href="/"
        className="mb-6 inline-block px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all font-bold text-sm"
      >
        ← Back to list
      </Link>
      <AddFoodForm editId={editId} />
    </div>
  );
}