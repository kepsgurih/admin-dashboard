/*
  Warnings:

  - You are about to drop the column `quotation` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "quotation",
ADD COLUMN     "salesOrder" TEXT;

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "quotation" TEXT;
