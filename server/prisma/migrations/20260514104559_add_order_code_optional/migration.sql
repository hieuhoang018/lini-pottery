/*
  Warnings:

  - A unique constraint covering the columns `[order_code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_code" TEXT;

-- CreateTable
CREATE TABLE "counters" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "counters_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_code_key" ON "orders"("order_code");

-- CreateIndex
CREATE INDEX "orders_order_code_idx" ON "orders"("order_code");
