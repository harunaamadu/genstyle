import { getNewArrivals } from "@/lib/cms/products";
import { Reveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";

export async function NewArrivals() {
  const products = await getNewArrivals(8);

  return (
    <section className="border-t bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Just dropped"
            title="New arrivals"
            description="Fresh pieces for the season, restocked weekly."
            href="/shop?sort=newest"
          />
        </Reveal>

        <Reveal
          stagger={0.08}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}