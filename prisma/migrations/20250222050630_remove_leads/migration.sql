/*
  Warnings:

  - You are about to drop the column `leadId` on the `DocumentSO` table. All the data in the column will be lost.
  - You are about to drop the `Leads` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerType` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('LEADS', 'CUSTOMER');

-- DropForeignKey
ALTER TABLE "DocumentSO" DROP CONSTRAINT "DocumentSO_leadId_fkey";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_companyId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "customField" JSONB,
ADD COLUMN     "customerType" "CustomerType" NOT NULL,
ADD COLUMN     "fromCompany" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "source" "SourceLead" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "DocumentSO" DROP COLUMN "leadId";

-- DropTable
DROP TABLE "Leads";
