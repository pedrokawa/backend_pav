/*
  Warnings:

  - You are about to alter the column `litros` on the `Abastecimento` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `preco` on the `Abastecimento` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `total` on the `Abastecimento` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Abastecimento" ALTER COLUMN "litros" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "preco" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);
