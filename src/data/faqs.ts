import { FREE_SHIPPING_THRESHOLD_USD } from "@/i18n/config";
import { SHIPPING_FLAT_USD } from "@/lib/cart";

export type FaqGroup = {
  title: string;
  items: { question: string; answer: string }[];
};

export const faqGroups: FaqGroup[] = [
  {
    title: "Orders and delivery",
    items: [
      {
        question: "How long does delivery take?",
        answer: "Delivery usually takes 2 to 5 working days. You'll get a message as soon as your order ships.",
      },
      {
        question: "How much is shipping?",
        answer: `Orders over $${FREE_SHIPPING_THRESHOLD_USD} ship free. Below that, shipping is a flat $${SHIPPING_FLAT_USD}. Amounts are shown in your chosen currency at checkout.`,
      },
      {
        question: "Can I track my order?",
        answer: "Yes. Signed-in customers can see every order and its status on the Orders page.",
      },
    ],
  },
  {
    title: "Returns and exchanges",
    items: [
      {
        question: "What is your returns policy?",
        answer: "Returns are free within 30 days for unworn items with the tags still attached.",
      },
      {
        question: "How do I start a return?",
        answer: "Send us a message with your order number from the contact page and we'll walk you through it.",
      },
      {
        question: "Can I exchange for a different size?",
        answer: "Yes, subject to stock. Tell us the size you'd like when you contact us.",
      },
    ],
  },
  {
    title: "Sizing and fit",
    items: [
      {
        question: "How do I find my size?",
        answer: "Use the size guide: measure yourself, then compare with the chart or try the size finder.",
      },
      {
        question: "What if I'm between two sizes?",
        answer: "Size up for a relaxed fit, or down for a closer one. Product pages note when a style runs small or large.",
      },
    ],
  },
  {
    title: "Payments and promo codes",
    items: [
      {
        question: "Which payment methods do you accept?",
        answer: "Credit and debit cards, Mobile Money (MTN, Telecel, AT Money), and pay on delivery.",
      },
      {
        question: "How do promo codes work?",
        answer: "Enter your code in the bag before checkout. First-order codes apply once per customer.",
      },
    ],
  },
];