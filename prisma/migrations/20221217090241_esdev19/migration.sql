-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "sessionId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
