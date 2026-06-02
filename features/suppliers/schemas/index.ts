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

export const supplierIdSchema = z.string().uuid("El proveedor no es válido.");

export const createSupplierSchema = z
  .object({
    name: requiredNameSchema,
    email: nullableEmailSchema,
    phone: nullableTextSchema,
    taxId: nullableTextSchema,
    address: nullableTextSchema,
    notes: nullableTextSchema,
  })
  .strict();

export const updateSupplierSchema = createSupplierSchema
  .partial()
  .extend({
    id: supplierIdSchema,
  })
  .strict();

export const deleteSupplierSchema = z
  .object({
    id: supplierIdSchema,
  })
  .strict();

export const supplierListQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type DeleteSupplierInput = z.infer<typeof deleteSupplierSchema>;
export type SupplierListQueryInput = z.infer<typeof supplierListQuerySchema>;
