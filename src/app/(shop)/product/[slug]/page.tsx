import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDepartment, type Department } from "@/data/categories";
import { getProductBySlug, getProducts } from "@/lib/cms/products";
import { getLocalized, isSoldOut } from "@/lib/product";
import { slugify } from "@/lib/slug";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { ProductDetails } from "@/components/product/product-details";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { siteConfig } from "@/data/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  const loc = getLocalized(product, "en");
  return {
    title: loc.name,
    description: loc.description ?? loc.tagline,
    openGraph: {
      title: loc.name,
      description: loc.tagline,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const loc = getLocalized(product, "en");
  const departmentSlug: Department =
    product.gender === "unisex" ? "accessories" : product.gender;
  const department = getDepartment(departmentSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: loc.name,
    description: loc.description ?? loc.tagline,
    image: product.images,
    sku: product.variants[0].sku,
    brand: { "@type": "Brand", name: product.brand ?? `${siteConfig().name}` as string },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 1,
    },
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: "USD",
      availability: isSoldOut(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(department ? [{ label: department.title, href: department.href }] : []),
            {
              label: product.category,
              href: `${department?.href ?? "/shop"}/${slugify(product.category)}`,
            },
            { label: loc.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            images={product.images}
            name={loc.name}
            discountPercent={product.discountPercent}
            newArrival={product.newArrival}
          />

          <div className="space-y-8">
            <ProductInfo product={product} />
            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      <RelatedProducts product={product} />
    </>
  );
}