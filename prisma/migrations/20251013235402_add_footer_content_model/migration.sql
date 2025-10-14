-- CreateTable
CREATE TABLE "FooterContent" (
    "id" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "links" JSONB NOT NULL,

    CONSTRAINT "FooterContent_pkey" PRIMARY KEY ("id")
);
