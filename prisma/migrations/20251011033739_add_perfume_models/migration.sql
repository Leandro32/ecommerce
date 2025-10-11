/*
  Warnings:

  - Added the required column `bottleSize` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bottleType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packaging` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `slug` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('WOMAN', 'MAN', 'UNISEX');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "bottleSize" INTEGER NOT NULL,
ADD COLUMN     "bottleType" TEXT NOT NULL,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "isDiscounted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "packaging" TEXT NOT NULL,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "sex" "Sex" NOT NULL,
ADD COLUMN     "shippingWeight" DOUBLE PRECISION,
ALTER COLUMN "slug" SET NOT NULL;

-- CreateTable
CREATE TABLE "FragranceNotes" (
    "id" TEXT NOT NULL,
    "topNotes" TEXT NOT NULL,
    "middleNotes" TEXT NOT NULL,
    "baseNotes" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "FragranceNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FragranceNotes_productId_key" ON "FragranceNotes"("productId");

-- AddForeignKey
ALTER TABLE "FragranceNotes" ADD CONSTRAINT "FragranceNotes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
