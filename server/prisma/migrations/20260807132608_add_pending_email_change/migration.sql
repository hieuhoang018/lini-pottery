-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pending_email" TEXT,
ADD COLUMN     "pending_email_expires_at" TIMESTAMP(3),
ADD COLUMN     "pending_email_token" TEXT;
