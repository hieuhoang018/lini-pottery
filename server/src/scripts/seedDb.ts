import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"
import { buildProductSearchText } from "../utils/search"
import { createSlug } from "../utils/createSlug"

const ADMIN_EMAIL = "admin@lini.dev"
const ADMIN_PASSWORD = "Admin123!"
const CUSTOMER_EMAIL = "customer@lini.dev"
const CUSTOMER_PASSWORD = "Customer123!"

type SeedCategory = {
  name: string
  description: string
}

type SeedProduct = {
  name: string
  categorySlug: string
  description: string
  price: number
  stockQuantity: number
  material: string
  color: string
  dimensionsText: string
  weightText: string
  careInstructions: string
}

const categories: SeedCategory[] = [
  {
    name: "Mugs & Cups",
    description:
      "Everyday mugs and cups for coffee, tea, and everything in between.",
  },
  {
    name: "Bowls",
    description: "Serving bowls, rice bowls, and everyday tableware.",
  },
  {
    name: "Vases",
    description:
      "Vases for fresh or dried flowers, from minimal to sculptural.",
  },
  {
    name: "Plates & Platters",
    description: "Dinner plates, side plates, and serving platters.",
  },
]

const products: SeedProduct[] = [
  // Mugs & Cups
  {
    name: "Classic Stoneware Mug",
    categorySlug: "mugs-cups",
    description: "A sturdy, everyday stoneware mug with a soft matte glaze.",
    price: 18,
    stockQuantity: 40,
    material: "Stoneware",
    color: "Cream",
    dimensionsText: "9cm x 8cm",
    weightText: "320g",
    careInstructions: "Dishwasher and microwave safe.",
  },
  {
    name: "Speckled Clay Coffee Cup",
    categorySlug: "mugs-cups",
    description: "Speckled stoneware cup with a warm, hand-thrown feel.",
    price: 22,
    stockQuantity: 25,
    material: "Speckled clay",
    color: "Brown speckle",
    dimensionsText: "8cm x 7cm",
    weightText: "280g",
    careInstructions: "Hand wash recommended.",
  },
  {
    name: "Minimalist White Mug",
    categorySlug: "mugs-cups",
    description: "Clean-lined porcelain mug for a minimalist kitchen.",
    price: 16.5,
    stockQuantity: 60,
    material: "Porcelain",
    color: "White",
    dimensionsText: "9cm x 8cm",
    weightText: "260g",
    careInstructions: "Dishwasher and microwave safe.",
  },
  {
    name: "Handpainted Floral Teacup",
    categorySlug: "mugs-cups",
    description: "Delicate teacup with a hand-painted floral motif.",
    price: 28,
    stockQuantity: 15,
    material: "Ceramic",
    color: "Blue floral",
    dimensionsText: "7cm x 6cm",
    weightText: "180g",
    careInstructions: "Hand wash only.",
  },
  {
    name: "Rustic Espresso Cup",
    categorySlug: "mugs-cups",
    description: "Small-batch espresso cup with a rustic unglazed rim.",
    price: 14,
    stockQuantity: 0,
    material: "Terracotta",
    color: "Terracotta",
    dimensionsText: "6cm x 5cm",
    weightText: "140g",
    careInstructions: "Hand wash only.",
  },

  // Bowls
  {
    name: "Wide Serving Bowl",
    categorySlug: "bowls",
    description: "Generously sized bowl for salads and sharing plates.",
    price: 34,
    stockQuantity: 20,
    material: "Stoneware",
    color: "Sand",
    dimensionsText: "28cm x 8cm",
    weightText: "900g",
    careInstructions: "Dishwasher safe.",
  },
  {
    name: "Small Rice Bowl",
    categorySlug: "bowls",
    description: "Compact bowl sized for rice, noodles, or sides.",
    price: 12,
    stockQuantity: 50,
    material: "Porcelain",
    color: "White",
    dimensionsText: "12cm x 6cm",
    weightText: "220g",
    careInstructions: "Dishwasher and microwave safe.",
  },
  {
    name: "Textured Soup Bowl",
    categorySlug: "bowls",
    description: "Deep bowl with a subtly textured exterior.",
    price: 19.5,
    stockQuantity: 30,
    material: "Stoneware",
    color: "Charcoal",
    dimensionsText: "16cm x 7cm",
    weightText: "420g",
    careInstructions: "Dishwasher safe.",
  },
  {
    name: "Glazed Fruit Bowl",
    categorySlug: "bowls",
    description: "Statement fruit bowl with a glossy reactive glaze.",
    price: 42,
    stockQuantity: 10,
    material: "Stoneware",
    color: "Teal reactive",
    dimensionsText: "30cm x 10cm",
    weightText: "1.1kg",
    careInstructions: "Hand wash recommended.",
  },
  {
    name: "Nesting Bowl Set",
    categorySlug: "bowls",
    description: "Set of three nesting bowls for prep and serving.",
    price: 58,
    stockQuantity: 8,
    material: "Stoneware",
    color: "Cream",
    dimensionsText: "Assorted 14-22cm",
    weightText: "1.6kg (set)",
    careInstructions: "Dishwasher safe.",
  },

  // Vases
  {
    name: "Tall Cylinder Vase",
    categorySlug: "vases",
    description: "Tall, slim vase for statement floral arrangements.",
    price: 45,
    stockQuantity: 12,
    material: "Stoneware",
    color: "Matte black",
    dimensionsText: "35cm x 12cm",
    weightText: "1.3kg",
    careInstructions: "Wipe clean with a damp cloth.",
  },
  {
    name: "Bud Vase Trio",
    categorySlug: "vases",
    description: "Set of three small bud vases, best displayed together.",
    price: 30,
    stockQuantity: 18,
    material: "Ceramic",
    color: "Assorted neutrals",
    dimensionsText: "Assorted 10-16cm",
    weightText: "650g (set)",
    careInstructions: "Wipe clean with a damp cloth.",
  },
  {
    name: "Speckled Ceramic Vase",
    categorySlug: "vases",
    description: "Rounded vase with a fine speckled glaze.",
    price: 52,
    stockQuantity: 0,
    material: "Speckled ceramic",
    color: "Oatmeal speckle",
    dimensionsText: "22cm x 18cm",
    weightText: "1.0kg",
    careInstructions: "Wipe clean with a damp cloth.",
  },
  {
    name: "Organic Curve Vase",
    categorySlug: "vases",
    description: "Sculptural vase with an organic, hand-shaped curve.",
    price: 65,
    stockQuantity: 6,
    material: "Stoneware",
    color: "Warm white",
    dimensionsText: "26cm x 16cm",
    weightText: "1.4kg",
    careInstructions: "Wipe clean with a damp cloth.",
  },
  {
    name: "Mini Bud Vase",
    categorySlug: "vases",
    description: "Single-stem bud vase for a minimal touch.",
    price: 15,
    stockQuantity: 40,
    material: "Porcelain",
    color: "White",
    dimensionsText: "12cm x 6cm",
    weightText: "180g",
    careInstructions: "Wipe clean with a damp cloth.",
  },

  // Plates & Platters
  {
    name: "Dinner Plate Set of 4",
    categorySlug: "plates-platters",
    description: "Set of four everyday dinner plates.",
    price: 60,
    stockQuantity: 15,
    material: "Stoneware",
    color: "Cream",
    dimensionsText: "27cm diameter",
    weightText: "2.4kg (set)",
    careInstructions: "Dishwasher and microwave safe.",
  },
  {
    name: "Rustic Side Plate",
    categorySlug: "plates-platters",
    description: "Small side plate with a rustic unglazed edge.",
    price: 17,
    stockQuantity: 35,
    material: "Stoneware",
    color: "Terracotta",
    dimensionsText: "18cm diameter",
    weightText: "320g",
    careInstructions: "Dishwasher safe.",
  },
  {
    name: "Serving Platter",
    categorySlug: "plates-platters",
    description: "Long platter for entertaining and sharing plates.",
    price: 48,
    stockQuantity: 10,
    material: "Stoneware",
    color: "Charcoal",
    dimensionsText: "40cm x 20cm",
    weightText: "1.5kg",
    careInstructions: "Hand wash recommended.",
  },
  {
    name: "Textured Salad Plate",
    categorySlug: "plates-platters",
    description: "Salad plate with a subtly ridged texture.",
    price: 22,
    stockQuantity: 25,
    material: "Ceramic",
    color: "Sage green",
    dimensionsText: "21cm diameter",
    weightText: "380g",
    careInstructions: "Dishwasher safe.",
  },
  {
    name: "Handglazed Charger Plate",
    categorySlug: "plates-platters",
    description: "Decorative charger plate with a hand-applied glaze.",
    price: 38,
    stockQuantity: 14,
    material: "Stoneware",
    color: "Deep blue",
    dimensionsText: "32cm diameter",
    weightText: "900g",
    careInstructions: "Wipe clean with a damp cloth.",
  },
]

async function main() {
  console.log("Seeding categories...")

  const categoryBySlug = new Map<string, { id: string; name: string }>()

  for (const category of categories) {
    const slug = createSlug(category.name)

    const created = await prisma.category.upsert({
      where: { slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug,
        description: category.description,
      },
    })

    categoryBySlug.set(slug, created)
  }

  console.log(`Seeded ${categoryBySlug.size} categories.`)

  console.log("Seeding products...")

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug)

    if (!category) {
      throw new Error(`Unknown category slug: ${product.categorySlug}`)
    }

    const slug = createSlug(product.name)

    const searchText = buildProductSearchText({
      name: product.name,
      slug,
      description: product.description,
      material: product.material,
      color: product.color,
      dimensionsText: product.dimensionsText,
      weightText: product.weightText,
      careInstructions: product.careInstructions,
      categoryName: category.name,
    })

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        isActive: true,
        categoryId: category.id,
        material: product.material,
        color: product.color,
        dimensionsText: product.dimensionsText,
        weightText: product.weightText,
        careInstructions: product.careInstructions,
        searchText,
      },
      create: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        isActive: true,
        categoryId: category.id,
        material: product.material,
        color: product.color,
        dimensionsText: product.dimensionsText,
        weightText: product.weightText,
        careInstructions: product.careInstructions,
        searchText,
      },
    })
  }

  console.log(`Seeded ${products.length} products.`)

  console.log("Seeding users...")

  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const customerPasswordHash = await bcrypt.hash(CUSTOMER_PASSWORD, 10)

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  })

  await prisma.user.upsert({
    where: { email: CUSTOMER_EMAIL },
    update: {},
    create: {
      name: "Test Customer",
      email: CUSTOMER_EMAIL,
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "0123456789",
    },
  })

  console.log("Seeded users:")
  console.log(`  Admin:    ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  console.log(`  Customer: ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
