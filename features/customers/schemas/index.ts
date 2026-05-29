import { z } from "zod";

function emptyStringToNull(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

const requiredNameSchema = z
  .string()
  .trim()
  .min(1, "Este campo es obligatorio.");

const nullableTextSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().nullable().optional(),
);

const nullableEmailSchema = z.preprocess(
  emptyStringToNull,
  z
    .string()
    .trim()
    .email("Ingresá un email válido.")
    .nullable()
    .optional(),
);

export const customerIdSchema = z.string().uuid("El cliente no es válido.");

export const createCustomerSchema = z
  .object({
    firstName: requiredNameSchema,
    lastName: requiredNameSchema,
    email: nullableEmailSchema,
    phone: nullableTextSchema,
    documentId: nullableTextSchema,
    notes: nullableTextSchema,
  })
  .strict();

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .extend({
    id: customerIdSchema,
  })
  .strict();

export const deleteCustomerSchema = z
  .object({
    id: customerIdSchema,
  })
  .strict();

export const customerListQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type DeleteCustomerInput = z.infer<typeof deleteCustomerSchema>;
export type CustomerListQueryInput = z.infer<typeof customerListQuerySchema>;
