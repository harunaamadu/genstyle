import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserOrders } from "@/lib/orders";
import { OrdersView } from "@/components/orders/orders-view";

export const metadata: Metadata = { title: "My orders", robots: { index: false } };

export default async function OrdersPage() {
  const session = await auth();
  // proxy.ts already guards this route; this is a second line of defence
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const orders = await getUserOrders(session.user.id);
  return <OrdersView orders={orders} />;
}