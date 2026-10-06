export type Promo = {
  code: string;
  percent: number;
  label: string;
  firstOrderOnly?: boolean;
};

export const promos: Promo[] = [
  { code: "FIRST25", percent: 25, label: "25% off your first order", firstOrderOnly: true },
  { code: "WELCOME10", percent: 10, label: "10% off" },
];

export function findPromo(code: string) {
  return promos.find((p) => p.code === code.trim().toUpperCase());
}