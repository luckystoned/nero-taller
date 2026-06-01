import { z } from "zod";

export const quoteStatuses = [
  "DRAFT",
  "SENT",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
] as const;

export const quoteItemTypes = ["LABOR", "PART", "OTHER"] as const;

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

const moneySchema = z
  .number()
  .finite("El importe no es válido.")
  .nonnegative("El importe debe ser mayor o igual a 0.");

const quantitySchema = z
  .number()
  .finite("La cantidad no es válida.")
  .positive("La cantidad debe ser mayor a 0.");

export const quoteStatusSchema = z.enum(quoteStatuses);
export const quoteItemTypeSchema = z.enum(quoteItemTypes);

export const quoteIdSchema = z.string().uuid("El presupuesto no es válido.");

const quoteItemInputSchema = z
  .object({
    description: requiredTextSchema,
    quantity: quantitySchema,
    unitPrice: moneySchema,
    type: quoteItemTypeSchema,
  })
  .strict();

export const createQuoteSchema = z
  .object({
    workOrderId: z.string().uuid("La orden de trabajo no es válida."),
    notes: nullableTextSchema,
    items: z
      .array(quoteItemInputSchema)
      .min(1, "El presupuesto debe tener al menos un ítem."),
  })
  .strict();

export const updateQuoteSchema = z
  .object({
    id: quoteIdSchema,
    status: quoteStatusSchema.optional(),
    notes: nullableTextSchema,
    items: z
      .array(quoteItemInputSchema)
      .min(1, "El presupuesto debe tener al menos un ítem.")
      .optional(),
  })
  .strict();

export const deleteQuoteSchema = z
  .object({
    id: quoteIdSchema,
  })
  .strict();

export const quoteListQuerySchema = z
  .object({
    workOrderId: z.string().uuid("La orden de trabajo no es válida.").optional(),
    status: quoteStatusSchema.optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type QuoteStatusInput = z.infer<typeof quoteStatusSchema>;
export type QuoteItemTypeInput = z.infer<typeof quoteItemTypeSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type DeleteQuoteInput = z.infer<typeof deleteQuoteSchema>;
export type QuoteListQueryInput = z.infer<typeof quoteListQuerySchema>;
