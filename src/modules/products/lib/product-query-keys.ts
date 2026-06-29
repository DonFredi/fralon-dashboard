export const productKeys = {
  // list
  all: () => ["products", "list"] as const,

  // single product + its sub-resources
  detail: (id: string) => ["products", "detail", id] as const,
  variants: (id: string) => ["products", "detail", id, "variants"] as const,
  images: (id: string) => ["products", "detail", id, "images"] as const,
};
