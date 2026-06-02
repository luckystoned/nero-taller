-- CreateTable
CREATE TABLE "parts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "description" TEXT,
    "brand" TEXT,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "sale_price" DECIMAL(12,2),
    "stock" INTEGER,
    "supplier_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parts_name_idx" ON "parts"("name");

-- CreateIndex
CREATE INDEX "parts_supplier_id_idx" ON "parts"("supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "parts_sku_key" ON "parts"("sku");

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- EnableRLS
ALTER TABLE "public"."parts" ENABLE ROW LEVEL SECURITY;
