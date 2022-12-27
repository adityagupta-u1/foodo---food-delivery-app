-- CreateTable
CREATE TABLE "Options" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "price" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "descripton" TEXT,
    "image" TEXT,
    "prices" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
