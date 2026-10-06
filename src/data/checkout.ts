export const paymentOptions = [
  { value: "card", label: "Credit / debit card", description: "Visa, Mastercard" },
  { value: "momo", label: "Mobile Money", description: "MTN, Telecel, AT Money" },
  { value: "cod", label: "Pay on delivery", description: "Cash or MoMo to the courier" },
] as const;

export const momoNetworks = [
  { value: "mtn", label: "MTN MoMo" },
  { value: "telecel", label: "Telecel Cash" },
  { value: "airteltigo", label: "AT Money" },
] as const;