import type { Metadata } from "next";
import { CompareView } from "@/components/compare/compare-view";

export const metadata: Metadata = { title: "Compare products" };

export default function ComparePage() {
  return <CompareView />;
}