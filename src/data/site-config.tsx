export const siteConfig = () => {
  return {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Genstyle 2.0.0",
    description:
      process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
      "Modern fashion for men, women and kids.",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    apiUrl:
      process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:8000/api/v1",
    secret: process.env.NEXT_PUBLIC_APP_SECRET || "",

    announcement: "Free delivery on orders over $500 · Easy 30-day returns",
    currency: "USD",
    locale: "en-US",

    emptyCartImage: "https://res.cloudinary.com/dqylma6u3/image/upload/v1785705537/empty-cart_to3zlb.png",
    productImageFallback: "https://res.cloudinary.com/dqylma6u3/image/upload/v1785705572/placeholder_wxymmh.png",
  };
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Placeholders: replace with your real details
export const contactInfo = {
  email: "hello@fitsync.example",
  phone: "+233 24 000 0000",
  hours: "Mon–Sat, 9:00–18:00 GMT",
  address: "Accra, Ghana",
};