-- CreateTable
CREATE TABLE "Medicao" (
    "id" SERIAL NOT NULL,
    "dataMedicao" TEXT NOT NULL,
    "apontador" TEXT NOT NULL,
    "rodovia" TEXT NOT NULL,
    "sentido" TEXT NOT NULL,
    "kmIni" DOUBLE PRECISION NOT NULL,
    "kmFim" DOUBLE PRECISION NOT NULL,
    "extensao" DOUBLE PRECISION NOT NULL,
    "largura" DOUBLE PRECISION NOT NULL,
    "faixa" TEXT NOT NULL,
    "areaTotal" DOUBLE PRECISION NOT NULL,
    "observacoes" TEXT,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicao_pkey" PRIMARY KEY ("id")
);
