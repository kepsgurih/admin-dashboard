/*
  Warnings:

  - You are about to drop the column `CompanyId` on the `DocumentSO` table. All the data in the column will be lost.
  - You are about to drop the column `CustomerId` on the `DocumentSO` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DocumentSO" DROP CONSTRAINT "DocumentSO_CompanyId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentSO" DROP CONSTRAINT "DocumentSO_CustomerId_fkey";

-- AlterTable
ALTER TABLE "DocumentSO" DROP COLUMN "CompanyId",
DROP COLUMN "CustomerId",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "customerId" TEXT;

-- AddForeignKey
ALTER TABLE "DocumentSO" ADD CONSTRAINT "DocumentSO_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSO" ADD CONSTRAINT "DocumentSO_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
