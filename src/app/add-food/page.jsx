"use client";

import AddFoodForm from "@/components/AddFoodForm";
import { useRouter } from "next/navigation";
import Button from "@/components/commen/Button";

export default function AddFoodPage() {
  const router = useRouter();

  const handleAdded = () => {
    // after adding, navigate back to home (could show toast in real app)
    router.push("/");
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <Button
        onClick={() => router.push("/")}
        className="mb-6 bg-transparent text-blue-600 hover:bg-transparent"
      >
        ← Back to list
      </Button>
      <AddFoodForm onAdded={handleAdded} />
    </div>
  );
}