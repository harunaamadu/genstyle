export type PaymentMethod = "card" | "momo" | "cod";

export type OrderLine = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number; // USD, as priced by the server
  quantity: number;
};

export type Order = {
  orderNumber: string;
  status?: OrderStatus;
  createdAt: string; // ISO
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string; // ISO code
  };
  paymentMethod: PaymentMethod;
  paymentDetail?: string; // e.g. "MTN MoMo •••123"
  promoCode: string | null;
  lines: OrderLine[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
};

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export type PlaceOrderResult =
  | { ok: true; order: Order }
  | { ok: false; message: string; issues?: string[] };