/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUid]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "firebaseUid" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ALTER COLUMN "contrasena" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebaseUid_key" ON "Usuario"("firebaseUid");
