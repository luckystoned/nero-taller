-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'WAITING_PARTS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AppointmentPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "AppointmentSource" AS ENUM ('MANUAL', 'ASSISTANT', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "AppointmentReminderStatus" AS ENUM ('NOT_SCHEDULED', 'SCHEDULED', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "customer_id" UUID,
    "company_id" UUID,
    "vehicle_id" UUID NOT NULL,
    "work_order_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "service_type" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'REQUESTED',
    "priority" "AppointmentPriority" NOT NULL DEFAULT 'NORMAL',
    "scheduled_start_at" TIMESTAMP(3) NOT NULL,
    "scheduled_end_at" TIMESTAMP(3) NOT NULL,
    "estimated_dropoff_at" TIMESTAMP(3),
    "estimated_pickup_at" TIMESTAMP(3),
    "estimated_duration_minutes" INTEGER,
    "internal_notes" TEXT,
    "cancellation_reason" TEXT,
    "created_by" UUID,
    "source" "AppointmentSource" NOT NULL DEFAULT 'MANUAL',
    "assistant_context" JSONB,
    "reminder_status" "AppointmentReminderStatus" NOT NULL DEFAULT 'NOT_SCHEDULED',
    "last_reminder_at" TIMESTAMP(3),
    "next_reminder_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "appointments_owner_check" CHECK (
        ("customer_id" IS NOT NULL AND "company_id" IS NULL)
        OR ("customer_id" IS NULL AND "company_id" IS NOT NULL)
    ),
    CONSTRAINT "appointments_schedule_range_check" CHECK ("scheduled_end_at" > "scheduled_start_at"),
    CONSTRAINT "appointments_estimated_duration_check" CHECK ("estimated_duration_minutes" IS NULL OR "estimated_duration_minutes" > 0),
    CONSTRAINT "appointments_cancelled_reason_check" CHECK ("status" <> 'CANCELLED' OR NULLIF(BTRIM("cancellation_reason"), '') IS NOT NULL)
);

-- CreateTable
CREATE TABLE "workshop_schedule_settings" (
    "id" UUID NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
    "working_hours" JSONB NOT NULL,
    "max_vehicles_per_day" INTEGER NOT NULL,
    "max_appointments_per_day" INTEGER NOT NULL,
    "default_slot_duration_minutes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshop_schedule_settings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "workshop_schedule_settings_capacity_check" CHECK (
        "max_vehicles_per_day" > 0
        AND "max_appointments_per_day" > 0
        AND "default_slot_duration_minutes" > 0
    )
);

-- CreateIndex
CREATE INDEX "appointments_scheduled_start_at_scheduled_end_at_idx" ON "appointments"("scheduled_start_at", "scheduled_end_at");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "appointments_vehicle_id_idx" ON "appointments"("vehicle_id");

-- CreateIndex
CREATE INDEX "appointments_customer_id_idx" ON "appointments"("customer_id");

-- CreateIndex
CREATE INDEX "appointments_company_id_idx" ON "appointments"("company_id");

-- CreateIndex
CREATE INDEX "appointments_work_order_id_idx" ON "appointments"("work_order_id");

-- CreateIndex
CREATE INDEX "appointments_service_type_idx" ON "appointments"("service_type");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable Row Level Security for public domain tables.
-- No public policies are created because domain data is accessed server-side via Prisma.
ALTER TABLE "public"."appointments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."workshop_schedule_settings" ENABLE ROW LEVEL SECURITY;
