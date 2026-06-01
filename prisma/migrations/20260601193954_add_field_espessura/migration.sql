/*
  Warnings:

  - The `dataMedicao` column on the `Medicao` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Medicao" ADD COLUMN     "espessura" DOUBLE PRECISION,
DROP COLUMN "dataMedicao",
ADD COLUMN     "dataMedicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
