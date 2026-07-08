import { z } from "zod";

export const appointmentStatuses = [
  "REQUESTED",
  "CONFIRMED",
  "CHECKED_IN",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export const appointmentPriorities = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export const appointmentSources = ["MANUAL", "ASSISTANT", "WHATSAPP"] as const;

export const appointmentReminderStatuses = [
  "NOT_SCHEDULED",
  "SCHEDULED",
  "SENT",
  "FAILED",
  "CANCELLED",
] as const;

function emptyStringToNull(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

function emptyStringToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
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

const optionalTextSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().optional(),
);

const nullableIdSchema = z.preprocess(
  emptyStringToNull,
  z.string().uuid("El identificador no es válido.").nullable().optional(),
);

const nullableDateSchema = z.preprocess(
  emptyStringToNull,
  z.coerce.date("La fecha no es válida.").nullable().optional(),
);

const requiredDateSchema = z.coerce.date("La fecha no es válida.");

const nullablePositiveNumberSchema = z.preprocess(
  emptyStringToNull,
  z.number().int().positive("Debe ser mayor a cero.").nullable().optional(),
);

export const appointmentStatusSchema = z.enum(appointmentStatuses);
export const appointmentPrioritySchema = z.enum(appointmentPriorities);
export const appointmentSourceSchema = z.enum(appointmentSources);
export const appointmentReminderStatusSchema = z.enum(
  appointmentReminderStatuses,
);

export const appointmentIdSchema = z.string().uuid("El turno no es válido.");

const appointmentBaseSchema = z.object({
  customerId: nullableIdSchema,
  companyId: nullableIdSchema,
  vehicleId: z.string().uuid("El vehículo no es válido."),
  workOrderId: nullableIdSchema,
  title: requiredTextSchema,
  description: nullableTextSchema,
  serviceType: nullableTextSchema,
  status: appointmentStatusSchema.default("REQUESTED"),
  priority: appointmentPrioritySchema.default("NORMAL"),
  scheduledStartAt: requiredDateSchema,
  scheduledEndAt: requiredDateSchema,
  estimatedDropoffAt: nullableDateSchema,
  estimatedPickupAt: nullableDateSchema,
  estimatedDurationMinutes: nullablePositiveNumberSchema,
  internalNotes: nullableTextSchema,
  cancellationReason: nullableTextSchema,
  createdBy: nullableIdSchema,
  source: appointmentSourceSchema.default("MANUAL"),
  assistantContext: z.unknown().optional(),
  reminderStatus: appointmentReminderStatusSchema.default("NOT_SCHEDULED"),
  lastReminderAt: nullableDateSchema,
  nextReminderAt: nullableDateSchema,
});

function validateAppointmentDates(
  input: {
    scheduledStartAt?: Date;
    scheduledEndAt?: Date;
    estimatedDropoffAt?: Date | null;
    estimatedPickupAt?: Date | null;
    status?: (typeof appointmentStatuses)[number];
    cancellationReason?: string | null;
  },
  context: z.RefinementCtx,
) {
  if (
    input.scheduledStartAt &&
    input.scheduledEndAt &&
    input.scheduledEndAt <= input.scheduledStartAt
  ) {
    context.addIssue({
      code: "custom",
      message: "El final del turno debe ser posterior al inicio.",
      path: ["scheduledEndAt"],
    });
  }

  if (
    input.estimatedDropoffAt &&
    input.estimatedPickupAt &&
    input.estimatedPickupAt <= input.estimatedDropoffAt
  ) {
    context.addIssue({
      code: "custom",
      message: "El retiro estimado debe ser posterior al ingreso estimado.",
      path: ["estimatedPickupAt"],
    });
  }

  if (
    input.status === "CANCELLED" &&
    !input.cancellationReason?.trim()
  ) {
    context.addIssue({
      code: "custom",
      message: "Indicá el motivo de cancelación.",
      path: ["cancellationReason"],
    });
  }
}

export const createAppointmentSchema = appointmentBaseSchema
  .strict()
  .superRefine(validateAppointmentDates);

export const updateAppointmentSchema = appointmentBaseSchema
  .partial()
  .extend({
    id: appointmentIdSchema,
  })
  .strict()
  .superRefine(validateAppointmentDates);

export const cancelAppointmentSchema = z
  .object({
    id: appointmentIdSchema,
    cancellationReason: requiredTextSchema,
  })
  .strict();

export const deleteAppointmentSchema = z
  .object({
    id: appointmentIdSchema,
  })
  .strict();

export const rescheduleAppointmentSchema = z
  .object({
    id: appointmentIdSchema,
    scheduledStartAt: requiredDateSchema,
    scheduledEndAt: requiredDateSchema,
    estimatedDropoffAt: nullableDateSchema,
    estimatedPickupAt: nullableDateSchema,
  })
  .strict()
  .superRefine(validateAppointmentDates);

export const createWorkOrderFromAppointmentSchema = z
  .object({
    id: appointmentIdSchema,
    intakeReason: requiredTextSchema.optional(),
    symptoms: nullableTextSchema,
    mileage: nullablePositiveNumberSchema,
  })
  .strict();

export const linkWorkOrderToAppointmentSchema = z
  .object({
    id: appointmentIdSchema,
    workOrderId: z.string().uuid("La orden de trabajo no es válida."),
  })
  .strict();

export const appointmentCalendarViewSchema = z
  .enum(["day", "week", "month"])
  .default("week");

export const appointmentCalendarQuerySchema = z
  .object({
    rangeStart: requiredDateSchema,
    rangeEnd: requiredDateSchema,
    status: appointmentStatusSchema.optional(),
    serviceType: optionalTextSchema,
    customerId: nullableIdSchema,
    companyId: nullableIdSchema,
    vehicleId: nullableIdSchema,
    workOrderId: nullableIdSchema,
    take: z.number().int().positive().max(500).optional(),
    skip: z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.rangeEnd <= input.rangeStart) {
      context.addIssue({
        code: "custom",
        message: "El rango debe tener una fecha final posterior al inicio.",
        path: ["rangeEnd"],
      });
    }
  });

export const workshopScheduleSettingsSchema = z
  .object({
    id: appointmentIdSchema.optional(),
    timezone: z
      .string()
      .trim()
      .min(1, "La zona horaria es obligatoria.")
      .default("America/Argentina/Buenos_Aires"),
    workingHours: z.record(z.string(), z.unknown()),
    maxVehiclesPerDay: z.number().int().positive("Debe ser mayor a cero."),
    maxAppointmentsPerDay: z.number().int().positive("Debe ser mayor a cero."),
    defaultSlotDurationMinutes: z
      .number()
      .int()
      .positive("Debe ser mayor a cero."),
  })
  .strict();

export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
export type AppointmentPriorityInput = z.infer<typeof appointmentPrioritySchema>;
export type AppointmentSourceInput = z.infer<typeof appointmentSourceSchema>;
export type AppointmentReminderStatusInput = z.infer<
  typeof appointmentReminderStatusSchema
>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type DeleteAppointmentInput = z.infer<typeof deleteAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<
  typeof rescheduleAppointmentSchema
>;
export type CreateWorkOrderFromAppointmentInput = z.infer<
  typeof createWorkOrderFromAppointmentSchema
>;
export type LinkWorkOrderToAppointmentInput = z.infer<
  typeof linkWorkOrderToAppointmentSchema
>;
export type AppointmentCalendarQueryInput = z.infer<
  typeof appointmentCalendarQuerySchema
>;
export type AppointmentCalendarViewInput = z.infer<
  typeof appointmentCalendarViewSchema
>;
export type WorkshopScheduleSettingsInput = z.infer<
  typeof workshopScheduleSettingsSchema
>;
