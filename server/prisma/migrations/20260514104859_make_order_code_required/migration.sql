/*
  Warnings:

  - Made the column `order_code` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "order_code" SET NOT NULL;
