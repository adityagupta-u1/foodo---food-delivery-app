-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "order_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "method" INTEGER,
    "cartId" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT NOT NULL,
    "razorpay_signature" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
