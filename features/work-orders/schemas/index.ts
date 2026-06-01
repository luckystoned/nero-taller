import { z } from "zod";

const workOrderStatuses = [
  "DRAFT",
  "RECEIVED",
  "DIAGNOSIS_IN_PROGRESS",
  "QUOTE_PENDING",
  "WAITING_CLIENT_APPROVAL",
  "WAITING_COMPANY_APPROVAL",
  "APPROVED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "COMPLETED",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "CANCELLED",
] as const;

function emptyStringToNull(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

const requiredTextSchema = z
  .string()
  .trim()
  .min(1, "Este campo es obligatorio.");

const nullableTextSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().nullable().optional(),
);

const nullableNumberSchema = z.preprocess(
  emptyStringToNull,
  z.number().int().nonnegative().nullable().optional(),
);

export const workOrderStatusSchema = z.enum(workOrderStatuses);

export const workOrderIdSchema = z.string().uuid("La orden de trabajo no es válida.");

export const createWorkOrderSchema = z
  .object({
    vehicleId: z.string().uuid("El vehículo no es válido."),
    status: z.literal("RECEIVED").default("RECEIVED"),
    intakeReason: requiredTextSchema,
    symptoms: nullableTextSchema,
    mileage: nullableNumberSchema,
  })
  .strict();

export const updateWorkOrderSchema = z
  .object({
    id: workOrderIdSchema,
    vehicleId: z.string().uuid("El vehículo no es válido.").optional(),
    intakeReason: requiredTextSchema.optional(),
    symptoms: nullableTextSchema,
    mileage: nullableNumberSchema,
  })
  .strict();

export const deleteWorkOrderSchema = z
  .object({
    id: workOrderIdSchema,
  })
  .strict();

export const workOrderListQuerySchema = z
  .object({
    vehicleId: z.string().uuid("El vehículo no es válido.").optional(),
    status: workOrderStatusSchema.optional(),
    search: z.string().trim().optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type WorkOrderStatusInput = z.infer<typeof workOrderStatusSchema>;
export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderInput = z.infer<typeof updateWorkOrderSchema>;
export type DeleteWorkOrderInput = z.infer<typeof deleteWorkOrderSchema>;
export type WorkOrderListQueryInput = z.infer<typeof workOrderListQuerySchema>;
