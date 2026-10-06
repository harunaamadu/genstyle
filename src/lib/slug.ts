export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "new-in" -> "New In" */
export function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}