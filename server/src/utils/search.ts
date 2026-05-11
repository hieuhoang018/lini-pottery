export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function buildProductSearchText(product: {
  name: string
  slug?: string | null
  description?: string | null
  material?: string | null
  color?: string | null
  dimensionsText?: string | null
  weightText?: string | null
  careInstructions?: string | null
  categoryName?: string | null
}) {
  return normalizeSearchText(
    [
      product.name,
      product.slug,
      product.description,
      product.material,
      product.color,
      product.dimensionsText,
      product.weightText,
      product.careInstructions,
      product.categoryName,
    ]
      .filter(Boolean)
      .join(" "),
  )
}
