import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/listing/product-listing";
import { getDepartment } from "@/data/categories";
import { getCategoryLabel } from "@/lib/cms/products";
import type { RawSearchParams } from "@/lib/validations/listing";

type Props = {
  params: Promise<{ department: string; category: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { department, category } = await params;
  const dept = getDepartment(department);
  if (!dept) return {};
  return { title: `${await getCategoryLabel(category)} · ${dept.title}` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { department, category } = await params;
  const dept = getDepartment(department);
  if (!dept) notFound();

  const label = await getCategoryLabel(category);

  return (
    <ProductListing
      title={label}
      eyebrow={dept.title}
      department={dept.slug}
      categorySlug={category}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: dept.title, href: dept.href },
        { label },
      ]}
      searchParams={await searchParams}
    />
  );
}