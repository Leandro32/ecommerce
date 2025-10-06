-- CreateEnum
CREATE TYPE "ButtonLayout" AS ENUM ('none', 'oneButton', 'twoButtons');

-- CreateEnum
CREATE TYPE "ButtonVariant" AS ENUM ('primary', 'secondary');

-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "paragraph" TEXT NOT NULL,
    "heroImageUrl" TEXT NOT NULL,
    "buttonLayout" "ButtonLayout" NOT NULL DEFAULT 'none',

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Button" (
    "id" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "isExternal" BOOLEAN NOT NULL,
    "variant" "ButtonVariant" NOT NULL,
    "heroId" TEXT NOT NULL,

    CONSTRAINT "Button_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Button" ADD CONSTRAINT "Button_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
