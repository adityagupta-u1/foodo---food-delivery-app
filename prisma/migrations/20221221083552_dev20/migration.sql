-- CreateEnum
CREATE TYPE "Profile" AS ENUM ('HOME', 'WORK', 'HOTEL');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "profile" "Profile" NOT NULL DEFAULT 'HOME',
    "address" TEXT NOT NULL,
    "landmark" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
