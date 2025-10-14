-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('WOMAN', 'MAN', 'UNISEX');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('SOLICITUD_NUEVO', 'ENVIADO_EN_PROCESO', 'ACEPTADO', 'CANCELADO', 'ENVIADO_CUMPLIDO', 'RECIBIDO_CONFORME', 'FACTURADO_PAGADO', 'CERRADO');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'SOLICITUD_NUEVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "sex" "Sex"[],
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discountPrice" DOUBLE PRECISION,
    "isDiscounted" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER NOT NULL,
    "bottleSize" INTEGER NOT NULL,
    "bottleType" TEXT NOT NULL,
    "packaging" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION,
    "shippingWeight" DOUBLE PRECISION,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "imageUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "FragranceNote" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "FragranceNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFragranceNote" (
    "productId" TEXT NOT NULL,
    "fragranceNoteId" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,

    CONSTRAINT "ProductFragranceNote_pkey" PRIMARY KEY ("productId","fragranceNoteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FragranceNote_name_key" ON "FragranceNote"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FragranceNote_slug_key" ON "FragranceNote"("slug");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFragranceNote" ADD CONSTRAINT "ProductFragranceNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFragranceNote" ADD CONSTRAINT "ProductFragranceNote_fragranceNoteId_fkey" FOREIGN KEY ("fragranceNoteId") REFERENCES "FragranceNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
