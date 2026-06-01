import { z } from "zod";

export const approvalStatuses = ["PENDING", "APPROVED", "REJECTED"] as const;

function emptyStringToNull(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

const nullableTextSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().nullable().optional(),
);

export const approvalStatusSchema = z.enum(approvalStatuses);

export const approvalIdSchema = z.string().uuid("La aprobación no es válida.");

export const createApprovalSchema = z
  .object({
    quoteId: z.string().uuid("El presupuesto no es válido."),
  })
  .strict();

export const respondApprovalSchema = z
  .object({
    id: approvalIdSchema,
    responseNotes: nullableTextSchema,
  })
  .strict();

export const approvalListQuerySchema = z
  .object({
    quoteId: z.string().uuid("El presupuesto no es válido.").optional(),
    status: approvalStatusSchema.optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type ApprovalStatusInput = z.infer<typeof approvalStatusSchema>;
export type CreateApprovalInput = z.infer<typeof createApprovalSchema>;
export type RespondApprovalInput = z.infer<typeof respondApprovalSchema>;
export type ApprovalListQueryInput = z.infer<typeof approvalListQuerySchema>;
