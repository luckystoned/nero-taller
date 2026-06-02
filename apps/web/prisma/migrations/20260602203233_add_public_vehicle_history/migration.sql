-- CreateTable
CREATE TABLE "public_vehicle_histories" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "public_token" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_vehicle_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_vehicle_histories_vehicle_id_key" ON "public_vehicle_histories"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "public_vehicle_histories_public_token_key" ON "public_vehicle_histories"("public_token");

-- CreateIndex
CREATE INDEX "public_vehicle_histories_is_enabled_idx" ON "public_vehicle_histories"("is_enabled");

-- AddForeignKey
ALTER TABLE "public_vehicle_histories" ADD CONSTRAINT "public_vehicle_histories_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- EnableRLS
ALTER TABLE "public"."public_vehicle_histories" ENABLE ROW LEVEL SECURITY;
