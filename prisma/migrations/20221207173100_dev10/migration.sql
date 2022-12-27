/*
  Warnings:

  - The `price` column on the `Options` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cartId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `Product` table. All the data in the column will be lost.
  - The `prices` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[sessionId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Made the column `totalPrice` on table `Cart` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_cartId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "qty" SET DEFAULT 0,
ALTER COLUMN "totalPrice" SET NOT NULL,
ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Options" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cartId",
DROP COLUMN "qty",
DROP COLUMN "prices",
ADD COLUMN     "prices" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "cartId" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionId_key" ON "Cart"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
