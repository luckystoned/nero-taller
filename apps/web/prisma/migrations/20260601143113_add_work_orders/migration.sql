-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('DRAFT', 'RECEIVED', 'DIAGNOSIS_IN_PROGRESS', 'QUOTE_PENDING', 'WAITING_CLIENT_APPROVAL', 'WAITING_COMPANY_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "work_orders" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "status" "WorkOrderStatus" NOT NULL,
    "intake_reason" TEXT NOT NULL,
    "symptoms" TEXT,
    "mileage" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_status_history" (
    "id" UUID NOT NULL,
    "work_order_id" UUID NOT NULL,
    "from_status" "WorkOrderStatus",
    "to_status" "WorkOrderStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "work_orders_vehicle_id_idx" ON "work_orders"("vehicle_id");

-- CreateIndex
CREATE INDEX "work_orders_status_idx" ON "work_orders"("status");

-- CreateIndex
CREATE INDEX "work_order_status_history_work_order_id_idx" ON "work_order_status_history"("work_order_id");

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_status_history" ADD CONSTRAINT "work_order_status_history_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
