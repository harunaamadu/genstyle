import { Hero } from "@/components/sections/home/hero-section";
import { CategoryGrid } from "@/components/sections/home/category-grid";
import { NewArrivals } from "@/components/sections/home/new-arrivals";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivals />
    </>
  );
}