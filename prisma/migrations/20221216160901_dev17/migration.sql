/*
  Warnings:

  - You are about to drop the column `cartId` on the `Orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_cartId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "cartId";
