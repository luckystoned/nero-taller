import type {
  Appointment as PrismaAppointment,
  AppointmentPriority as PrismaAppointmentPriority,
  AppointmentReminderStatus as PrismaAppointmentReminderStatus,
  AppointmentSource as PrismaAppointmentSource,
  AppointmentStatus as PrismaAppointmentStatus,
  WorkshopScheduleSettings as PrismaWorkshopScheduleSettings,
} from "../../../apps/web/generated/prisma/client";

import type {
  AppointmentCalendarQueryInput,
  AppointmentCalendarViewInput,
  AppointmentPriorityInput,
  AppointmentReminderStatusInput,
  AppointmentSourceInput,
  AppointmentStatusInput,
  CancelAppointmentInput,
  CreateAppointmentInput,
  CreateWorkOrderFromAppointmentInput,
  DeleteAppointmentInput,
  LinkWorkOrderToAppointmentInput,
  RescheduleAppointmentInput,
  UpdateAppointmentInput,
  WorkshopScheduleSettingsInput,
} from "../schemas";

export type Appointment = PrismaAppointment;
export type AppointmentStatus = PrismaAppointmentStatus;
export type AppointmentPriority = PrismaAppointmentPriority;
export type AppointmentSource = PrismaAppointmentSource;
export type AppointmentReminderStatus = PrismaAppointmentReminderStatus;
export type AppointmentId = Appointment["id"];
export type WorkshopScheduleSettings = PrismaWorkshopScheduleSettings;

export type CapacitySummary = {
  dateKey: string;
  appointmentCount: number;
  vehicleCount: number;
  maxAppointmentsPerDay: number;
  maxVehiclesPerDay: number;
  isOverAppointmentCapacity: boolean;
  isOverVehicleCapacity: boolean;
};

export type AppointmentConflictSummary = {
  overlappingAppointmentIds: string[];
  hasOverlap: boolean;
};

export type {
  AppointmentCalendarQueryInput,
  AppointmentCalendarViewInput,
  AppointmentPriorityInput,
  AppointmentReminderStatusInput,
  AppointmentSourceInput,
  AppointmentStatusInput,
  CancelAppointmentInput,
  CreateAppointmentInput,
  CreateWorkOrderFromAppointmentInput,
  DeleteAppointmentInput,
  LinkWorkOrderToAppointmentInput,
  RescheduleAppointmentInput,
  UpdateAppointmentInput,
  WorkshopScheduleSettingsInput,
};
