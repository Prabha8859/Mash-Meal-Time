"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MultiReuse from "@/components/Multireuse"; 
import { preferenceQuestions } from "@/data/questions"; 

export default function Preferences() {
  const [answers, setAnswers] = useState({
    dietType: "",
    spiceLevel: "",
    allergies: [],
    // healthSuggestions: "",
    weightGoal: "",
  });
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentSelection = answers[name] || [];
      
      if (checked) {
        if (name === "allergies" && currentSelection.length >= 5) {
          alert("Maximum 5 selections allowed ❌");
          return;
        }
        setAnswers((prev) => ({
          ...prev,
          [name]: [...currentSelection, value],
        }));
      } else {
        setAnswers((prev) => ({
          ...prev,
          [name]: currentSelection.filter((item) => item !== value),
        }));
      }
    } else {
      setAnswers((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!session || !session.user) {
      alert("User not logged in ❌. Please login first.");
      router.push("/register");
      return;
    }

    const user = session.user;
    const userId = user.id;

    const { dietType, allergies, weightGoal } =
      answers;

    if (!dietType  || !allergies || !weightGoal) {
      alert("Please answer all questions.");
      return;
    }

    const answersPayload = [
      { questionId: "dietType", answer: [dietType] },
      // { questionId: "spiceLevel", answer: [spiceLevel] },
      { questionId: "allergies", answer: allergies },
      { questionId: "weightGoal", answer: [weightGoal] },
    ].filter((a) => a.answer.length > 0 && a.answer[0] !== "");

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          answers: answersPayload
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save preferences.");

      
      await update({
        ...session,
        user: {
          ...session.user,
          profileComplete: true,
          questionnaire: answersPayload,
        },
      });

      alert("Preferences Saved Successfully ✅");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert(`Something went wrong: ${error.message} ❌`);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-green-400 bg-white w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Tell Us Your Preferences
        </h2>

        <div className="flex flex-col gap-6">
          {preferenceQuestions.map((q) => (
            <MultiReuse
              key={q.name}
              type={q.type}
              title={q.title}
              name={q.name}
              options={q.options}
              selected={answers[q.name]}
              onChange={handleChange}
            />
          ))}

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white font-bold cursor-pointer px-6 py-3 rounded-md mt-4 w-full"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
