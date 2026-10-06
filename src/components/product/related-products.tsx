import { getRelatedProducts } from "@/lib/cms/products";
import type { Product } from "@/lib/validations/product";
import { Reveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";

export async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="border-t bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="You may also like"
            title="Complete the look"
            href="/shop"
            linkLabel="Shop all"
          />
        </Reveal>

        <Reveal
          stagger={0.08}
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
        >
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}