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

export const companyIdSchema = z.string().uuid("La empresa no es válida.");

export const createCompanySchema = z
  .object({
    name: requiredNameSchema,
    email: nullableEmailSchema,
    phone: nullableTextSchema,
    taxId: nullableTextSchema,
    requiresApproval: z.boolean().default(false),
    notes: nullableTextSchema,
  })
  .strict();

export const updateCompanySchema = createCompanySchema
  .partial()
  .extend({
    id: companyIdSchema,
  })
  .strict();

export const deleteCompanySchema = z
  .object({
    id: companyIdSchema,
  })
  .strict();

export const companyListQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type DeleteCompanyInput = z.infer<typeof deleteCompanySchema>;
export type CompanyListQueryInput = z.infer<typeof companyListQuerySchema>;
