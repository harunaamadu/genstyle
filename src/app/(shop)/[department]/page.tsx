import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/listing/product-listing";
import { getDepartment } from "@/data/categories";
import type { RawSearchParams } from "@/lib/validations/listing";

type Props = {
  params: Promise<{ department: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dept = getDepartment((await params).department);
  return dept ? { title: dept.title, description: dept.description } : {};
}

export default async function DepartmentPage({ params, searchParams }: Props) {
  const dept = getDepartment((await params).department);
  if (!dept) notFound();

  return (
    <ProductListing
      title={dept.title}
      eyebrow="Collection"
      description={dept.description}
      department={dept.slug}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: dept.title }]}
      searchParams={await searchParams}
    />
  );
}