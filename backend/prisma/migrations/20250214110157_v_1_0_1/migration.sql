/*
  Warnings:

  - Added the required column `guicheId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "guicheId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_guicheId_fkey" FOREIGN KEY ("guicheId") REFERENCES "Guiche"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
