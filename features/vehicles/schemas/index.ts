import { z } from "zod";

function emptyStringToNull(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

function normalizeUppercase(value: string) {
  return value.trim().toUpperCase();
}

const requiredUppercaseSchema = z
  .string()
  .trim()
  .min(1, "Este campo es obligatorio.")
  .transform(normalizeUppercase);

const requiredTextSchema = z
  .string()
  .trim()
  .min(1, "Este campo es obligatorio.");

const nullableUppercaseSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().transform(normalizeUppercase).nullable().optional(),
);

const nullableNumberSchema = z.preprocess(
  emptyStringToNull,
  z.number().int().nonnegative().nullable().optional(),
);

const nullableOwnerIdSchema = z.preprocess(
  emptyStringToNull,
  z.string().uuid("El propietario no es válido.").nullable().optional(),
);

function hasExactlyOneOwner(input: {
  customerId?: string | null;
  companyId?: string | null;
}) {
  return Boolean(input.customerId) !== Boolean(input.companyId);
}

export const vehicleIdSchema = z.string().uuid("El vehículo no es válido.");

const vehicleInputSchema = z
  .object({
    plate: requiredUppercaseSchema,
    brand: requiredTextSchema,
    model: requiredTextSchema,
    year: nullableNumberSchema,
    vin: nullableUppercaseSchema,
    mileage: nullableNumberSchema,
    customerId: nullableOwnerIdSchema,
    companyId: nullableOwnerIdSchema,
  })
  .strict();

export const createVehicleSchema = vehicleInputSchema.superRefine(
  (input, context) => {
    if (!hasExactlyOneOwner(input)) {
      context.addIssue({
        code: "custom",
        message: "El vehículo debe pertenecer a un cliente o a una empresa.",
        path: ["customerId"],
      });

      context.addIssue({
        code: "custom",
        message: "El vehículo debe pertenecer a un cliente o a una empresa.",
        path: ["companyId"],
      });
    }
  },
);

export const updateVehicleSchema = vehicleInputSchema
  .partial()
  .extend({
    id: vehicleIdSchema,
  })
  .strict();

export const deleteVehicleSchema = z
  .object({
    id: vehicleIdSchema,
  })
  .strict();

export const vehicleListQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    customerId: nullableOwnerIdSchema,
    companyId: nullableOwnerIdSchema,
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type DeleteVehicleInput = z.infer<typeof deleteVehicleSchema>;
export type VehicleListQueryInput = z.infer<typeof vehicleListQuerySchema>;
