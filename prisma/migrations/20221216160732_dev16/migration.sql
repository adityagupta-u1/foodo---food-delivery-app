/*
  Warnings:

  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "orderId" TEXT;

-- DropTable
DROP TABLE "payment";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
