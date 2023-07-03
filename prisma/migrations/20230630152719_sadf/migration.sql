/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_userID_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likedItems" TEXT[];

-- DropTable
DROP TABLE "Item";
