/*
  Warnings:

  - You are about to drop the column `prices` on the `Product` table. All the data in the column will be lost.
  - The `size` column on the `Size` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "size" AS ENUM ('REGULAR', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "prices";

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "size",
ADD COLUMN     "size" "size" NOT NULL DEFAULT 'REGULAR';
