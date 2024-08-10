/*
  Warnings:

  - You are about to drop the column `document_url` on the `chatbots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chatbots" DROP COLUMN "document_url",
ADD COLUMN     "document_id" INTEGER;

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_name_key" ON "documents"("name");

-- AddForeignKey
ALTER TABLE "chatbots" ADD CONSTRAINT "chatbots_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
