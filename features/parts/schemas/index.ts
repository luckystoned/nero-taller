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

const requiredTextSchema = z
  .string()
  .trim()
  .min(1, "Este campo es obligatorio.");

const nullableTextSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().nullable().optional(),
);

const nullableUppercaseSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().transform(normalizeUppercase).nullable().optional(),
);

const moneySchema = z
  .number()
  .finite("El importe no es válido.")
  .nonnegative("El importe debe ser mayor o igual a 0.");

const nullableMoneySchema = z.preprocess(
  emptyStringToNull,
  moneySchema.nullable().optional(),
);

const nullableStockSchema = z.preprocess(
  emptyStringToNull,
  z
    .number()
    .int("El stock debe ser un número entero.")
    .nonnegative("El stock debe ser mayor o igual a 0.")
    .nullable()
    .optional(),
);

const nullableSupplierIdSchema = z.preprocess(
  emptyStringToNull,
  z.string().uuid("El proveedor no es válido.").nullable().optional(),
);

export const partIdSchema = z.string().uuid("El repuesto no es válido.");

export const createPartSchema = z
  .object({
    name: requiredTextSchema,
    sku: nullableUppercaseSchema,
    description: nullableTextSchema,
    brand: nullableTextSchema,
    unitCost: moneySchema,
    salePrice: nullableMoneySchema,
    stock: nullableStockSchema,
    supplierId: nullableSupplierIdSchema,
  })
  .strict();

export const updatePartSchema = createPartSchema
  .partial()
  .extend({
    id: partIdSchema,
  })
  .strict();

export const deletePartSchema = z
  .object({
    id: partIdSchema,
  })
  .strict();

export const partListQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    supplierId: nullableSupplierIdSchema,
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type CreatePartInput = z.infer<typeof createPartSchema>;
export type UpdatePartInput = z.infer<typeof updatePartSchema>;
export type DeletePartInput = z.infer<typeof deletePartSchema>;
export type PartListQueryInput = z.infer<typeof partListQuerySchema>;
