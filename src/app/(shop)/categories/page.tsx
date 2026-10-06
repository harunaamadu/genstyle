import type { Metadata } from "next";
import { CategoryGrid } from "@/components/sections/home/category-grid";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return <CategoryGrid showAllLink={false} />;
}