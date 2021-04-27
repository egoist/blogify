-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastActiveBlogId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("lastActiveBlogId") REFERENCES "blogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
