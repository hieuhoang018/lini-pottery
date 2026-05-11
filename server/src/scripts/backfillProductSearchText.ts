import { prisma } from "../lib/prisma"
import { buildProductSearchText } from "../utils/search"

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  })

  for (const product of products) {
    const searchText = buildProductSearchText({
      name: product.name,
      slug: product.slug,
      description: product.description,
      material: product.material,
      color: product.color,
      dimensionsText: product.dimensionsText,
      weightText: product.weightText,
      careInstructions: product.careInstructions,
      categoryName: product.category.name,
    })

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        searchText,
      },
    })
  }

  console.log(`Updated searchText for ${products.length} products.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
