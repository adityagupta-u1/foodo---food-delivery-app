-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "qty" INTEGER,
ADD COLUMN     "totalPrice" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "qty" INTEGER,
ALTER COLUMN "cartId" DROP NOT NULL;
