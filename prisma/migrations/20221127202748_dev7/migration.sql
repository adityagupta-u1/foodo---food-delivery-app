/*
  Warnings:

  - Added the required column `cartId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descripton` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cartId" TEXT NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "descripton" SET NOT NULL;

-- CreateTable
CREATE TABLE "SessionCart" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "total" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionCart_sid_key" ON "SessionCart"("sid");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
