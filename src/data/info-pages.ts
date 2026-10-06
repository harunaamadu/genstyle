import { FREE_SHIPPING_THRESHOLD_USD } from "@/i18n/config";
import { SHIPPING_FLAT_USD } from "@/lib/cart";
import { contactInfo } from "./site-config";

export type InfoPageData = {
  title: string;
  description: string;
  updated?: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
};

export const infoPages = {
  "shipping-returns": {
    title: "Shipping & returns",
    description: "Delivery times, shipping costs and how returns work.",
    updated: "2026-10-06",
    sections: [
      {
        heading: "Delivery",
        body: [
          "Orders usually arrive within 2 to 5 working days. We'll message you when your order ships.",
          "Please make sure your delivery address and phone number are correct, so the courier can reach you.",
        ],
      },
      {
        heading: "Shipping costs",
        body: [
          `Orders over $${FREE_SHIPPING_THRESHOLD_USD} ship free. Below that, shipping is a flat $${SHIPPING_FLAT_USD}. Amounts are shown in your chosen currency at checkout.`,
        ],
      },
      {
        heading: "Returns",
        body: ["You can return items within 30 days of delivery, free of charge, as long as they are:"],
        list: ["Unworn and unwashed", "In their original condition", "Still carrying their tags"],
      },
      {
        heading: "How to return an item",
        body: [
          "Send us a message with your order number and the items you'd like to return. We'll reply with the next steps. Refunds go back to your original payment method once we've received and checked the items.",
        ],
      },
      {
        heading: "Need help?",
        body: [`Email ${contactInfo.email} or use the contact page and we'll sort it out.`],
      },
    ],
  },

  privacy: {
    title: "Privacy policy",
    description: "What we collect, why we collect it and the choices you have.",
    updated: "2026-10-06",
    sections: [
      {
        heading: "What we collect",
        body: ["We collect only what we need to run the shop:"],
        list: [
          "Account details: your name, email address and an encrypted password, or your Google profile name and email if you sign in with Google",
          "Order details: items, delivery address, phone number and the last digits of a Mobile Money number",
          "Messages you send through our contact form",
        ],
      },
      {
        heading: "What we don't store",
        body: ["We never store full card numbers. Card payments, when enabled, are handled by our payment provider."],
      },
      {
        heading: "How we use it",
        body: [
          "To process and deliver your orders, answer your questions, and keep your account secure. If you opt in, we also send news and offers, and you can unsubscribe at any time.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Only the services that help us operate: hosting and database providers, our payment provider, and delivery partners who need your address. We don't sell your personal data.",
        ],
      },
      {
        heading: "Cookies and local storage",
        body: [
          "We store your bag, wishlist, compare list, language, currency and theme in your browser so they're still there when you return. Signing in uses a secure session cookie.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          `You can ask to see, correct or delete your data at any time. Email ${contactInfo.email} and we'll help.`,
        ],
      },
    ],
  },

  terms: {
    title: "Terms of service",
    description: "The terms that apply when you use our site and place an order.",
    updated: "2026-10-06",
    sections: [
      {
        heading: "Using the site",
        body: ["By using this site you agree to these terms. If you don't agree, please don't use the site."],
      },
      {
        heading: "Orders and pricing",
        body: [
          "An order is an offer to buy. We confirm it by email. We may cancel an order if an item is unavailable or a price was shown in error, and we'll refund anything you've paid.",
          "Prices are shown in your chosen currency for convenience. The amount charged is confirmed at checkout.",
        ],
      },
      {
        heading: "Delivery and returns",
        body: ["Delivery and return conditions are described on our shipping and returns page, which forms part of these terms."],
      },
      {
        heading: "Your account",
        body: ["Keep your password safe. You're responsible for activity on your account."],
      },
      {
        heading: "Liability",
        body: ["Nothing in these terms limits any rights you have under consumer law."],
      },
      {
        heading: "Changes",
        body: ["We may update these terms from time to time. The date at the top shows when they last changed."],
      },
    ],
  },

  careers: {
    title: "Careers",
    description: "Work with the FitSync team.",
    sections: [
      {
        heading: "No open roles right now",
        body: [
          "We're a small team and we're not hiring at the moment, but we're always glad to hear from people who love making clothes that last.",
        ],
      },
      {
        heading: "Stay in touch",
        body: [`Send a short note and your portfolio or CV to ${contactInfo.email}, and we'll keep it on file.`],
      },
    ],
  },
} satisfies Record<string, InfoPageData>;

export type InfoSlug = keyof typeof infoPages;