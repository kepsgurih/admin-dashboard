-- CreateEnum
CREATE TYPE "SourceLead" AS ENUM ('WEBSITE', 'GOOGLE', 'SOSMED', 'EVENT', 'REFERRAL', 'OTHER');

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "customField" JSONB,
ADD COLUMN     "fromCompany" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "source" "SourceLead" NOT NULL DEFAULT 'OTHER';
