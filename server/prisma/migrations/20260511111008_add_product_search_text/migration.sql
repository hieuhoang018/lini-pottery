-- AlterTable
ALTER TABLE "products" ADD COLUMN     "search_text" TEXT;

-- CreateIndex
CREATE INDEX "products_search_text_idx" ON "products"("search_text");
