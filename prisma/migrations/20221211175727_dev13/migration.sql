-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "Options" ADD COLUMN     "itemsId" TEXT;

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_itemsId_fkey" FOREIGN KEY ("itemsId") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
