import { CompareBar } from "@/components/compare/compare-bar";
import { Footer } from "@/components/layout/footer/footer";
import { Header, CartSheet } from "@/components/layout/header";

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CartSheet />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
    </div>
  );
}