export const formatOrderCode = (value: number) => {
  return `DH-${String(value).padStart(6, "0")}`
}
