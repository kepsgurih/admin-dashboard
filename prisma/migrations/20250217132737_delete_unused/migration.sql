/*
  Warnings:

  - You are about to drop the column `currency` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `isExpired` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `isExpired` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "currency",
DROP COLUMN "isExpired",
DROP COLUMN "number",
DROP COLUMN "year",
ADD COLUMN     "quotation" TEXT,
ALTER COLUMN "expiredDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "items" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "currency",
DROP COLUMN "isExpired",
DROP COLUMN "number",
DROP COLUMN "year",
ALTER COLUMN "expiredDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "items" DROP NOT NULL;
