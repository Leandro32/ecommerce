-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "paragraph" TEXT NOT NULL,
    "heroImageUrl" TEXT NOT NULL,
    "buttonLayout" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Button" (
    "id" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "isExternal" BOOLEAN NOT NULL,
    "variant" TEXT NOT NULL,
    "heroId" TEXT NOT NULL,

    CONSTRAINT "Button_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Button" ADD CONSTRAINT "Button_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
