import { z } from "zod";

export const publicVehicleHistoryIdSchema = z
  .string()
  .uuid("El historial público no es válido.");

export const publicVehicleHistoryTokenSchema = z
  .string()
  .trim()
  .min(32, "El token público no es válido.")
  .max(128, "El token público no es válido.");

export const createPublicVehicleHistorySchema = z
  .object({
    vehicleId: z.string().uuid("El vehículo no es válido."),
  })
  .strict();

export const updatePublicVehicleHistoryStatusSchema = z
  .object({
    id: publicVehicleHistoryIdSchema,
    isEnabled: z.boolean(),
  })
  .strict();

export const publicVehicleHistoryListQuerySchema = z
  .object({
    vehicleId: z.string().uuid("El vehículo no es válido.").optional(),
    isEnabled: z.boolean().optional(),
    take: z.number().int().positive().max(100).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export type CreatePublicVehicleHistoryInput = z.infer<
  typeof createPublicVehicleHistorySchema
>;
export type UpdatePublicVehicleHistoryStatusInput = z.infer<
  typeof updatePublicVehicleHistoryStatusSchema
>;
export type PublicVehicleHistoryListQueryInput = z.infer<
  typeof publicVehicleHistoryListQuerySchema
>;
