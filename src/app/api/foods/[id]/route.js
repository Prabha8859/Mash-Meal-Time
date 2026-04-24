import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FoodModel from "@/models/Food";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const food = await FoodModel.findById(id);
    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    console.error("Error fetching food:", error);
    return NextResponse.json({ error: "Failed to fetch food" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedFood = await FoodModel.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error("Error updating food:", error);
    return NextResponse.json({ error: "Failed to update food" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedFood = await FoodModel.findByIdAndDelete(id);
    if (!deletedFood) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    return NextResponse.json({ error: "Failed to delete food" }, { status: 500 });
  }
}