export type Range = [min: number, max: number];

export type SizeGroup = {
  id: "women" | "men" | "kids";
  label: string;
  measures: { key: string; label: string }[];
  finder: { key: string; label: string };
  rows: { size: string; values: Record<string, Range> }[];
};

export const sizeGroups: SizeGroup[] = [
  {
    id: "women",
    label: "Women",
    measures: [
      { key: "bust", label: "Bust" },
      { key: "waist", label: "Waist" },
      { key: "hips", label: "Hips" },
    ],
    finder: { key: "bust", label: "Bust" },
    rows: [
      { size: "S", values: { bust: [82, 87], waist: [64, 69], hips: [90, 95] } },
      { size: "M", values: { bust: [88, 93], waist: [70, 75], hips: [96, 101] } },
      { size: "L", values: { bust: [94, 99], waist: [76, 81], hips: [102, 107] } },
      { size: "XL", values: { bust: [100, 107], waist: [82, 89], hips: [108, 115] } },
    ],
  },
  {
    id: "men",
    label: "Men",
    measures: [
      { key: "chest", label: "Chest" },
      { key: "waist", label: "Waist" },
      { key: "hips", label: "Hips" },
    ],
    finder: { key: "chest", label: "Chest" },
    rows: [
      { size: "S", values: { chest: [88, 93], waist: [76, 81], hips: [92, 97] } },
      { size: "M", values: { chest: [94, 99], waist: [82, 87], hips: [98, 103] } },
      { size: "L", values: { chest: [100, 107], waist: [88, 95], hips: [104, 111] } },
      { size: "XL", values: { chest: [108, 115], waist: [96, 103], hips: [112, 119] } },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    measures: [
      { key: "height", label: "Height" },
      { key: "chest", label: "Chest" },
      { key: "waist", label: "Waist" },
    ],
    finder: { key: "height", label: "Height" },
    rows: [
      { size: "4Y", values: { height: [98, 104], chest: [55, 57], waist: [51, 53] } },
      { size: "6Y", values: { height: [110, 116], chest: [59, 62], waist: [53, 55] } },
      { size: "8Y", values: { height: [122, 128], chest: [64, 67], waist: [56, 58] } },
      { size: "10Y", values: { height: [134, 140], chest: [69, 72], waist: [58, 60] } },
    ],
  },
];

export const measureSteps = [
  {
    title: "Bust or chest",
    text: "Wrap the tape around the fullest part of your chest, under your arms and across your shoulder blades. Keep it level.",
  },
  {
    title: "Waist",
    text: "Measure around your natural waist, the narrowest part of your torso, usually just above the belly button.",
  },
  {
    title: "Hips",
    text: "Measure around the fullest part of your hips and seat, keeping the tape parallel to the floor.",
  },
];