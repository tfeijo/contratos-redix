-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "status" "UploadStatus" NOT NULL,
    "errorMessage" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" UUID NOT NULL,
    "cnpj" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "additional_data" TEXT NOT NULL,
    "arquivoId" UUID,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contratos_cnpj_key" ON "contratos"("cnpj");

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_arquivoId_fkey" FOREIGN KEY ("arquivoId") REFERENCES "uploaded_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
