import { AppointmentStatus } from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import {
  appointmentCalendarQuerySchema,
  appointmentIdSchema,
  type AppointmentCalendarQueryInput,
} from "../schemas";
import type { CapacitySummary } from "../types";

const appointmentInclude = {
  customer: true,
  company: true,
  vehicle: {
    include: {
      customer: true,
      company: true,
    },
  },
  workOrder: true,
} as const;

const inactiveAppointmentStatuses: AppointmentStatus[] = [
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.NO_SHOW,
];

export const defaultWorkshopScheduleSettings = {
  timezone: "America/Argentina/Buenos_Aires",
  workingHours: {
    monday: { start: "08:00", end: "18:00" },
    tuesday: { start: "08:00", end: "18:00" },
    wednesday: { start: "08:00", end: "18:00" },
    thursday: { start: "08:00", end: "18:00" },
    friday: { start: "08:00", end: "18:00" },
    saturday: { start: "08:00", end: "13:00" },
  },
  maxVehiclesPerDay: 12,
  maxAppointmentsPerDay: 18,
  defaultSlotDurationMinutes: 60,
};

function formatDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: defaultWorkshopScheduleSettings.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function getAppointmentById(id: string) {
  const appointmentId = appointmentIdSchema.parse(id);

  return prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: appointmentInclude,
  });
}

export async function listAppointments(input: AppointmentCalendarQueryInput) {
  const query = appointmentCalendarQuerySchema.parse(input);
  const serviceType = query.serviceType?.trim();

  return prisma.appointment.findMany({
    include: appointmentInclude,
    where: {
      scheduledStartAt: { lt: query.rangeEnd },
      scheduledEndAt: { gt: query.rangeStart },
      status: query.status,
      serviceType: serviceType
        ? { contains: serviceType, mode: "insensitive" }
        : undefined,
      customerId: query.customerId || undefined,
      companyId: query.companyId || undefined,
      vehicleId: query.vehicleId || undefined,
      workOrderId: query.workOrderId || undefined,
    },
    orderBy: [{ scheduledStartAt: "asc" }, { createdAt: "asc" }],
    skip: query.skip,
    take: query.take ?? 500,
  });
}

export async function countAppointments(input: AppointmentCalendarQueryInput) {
  const query = appointmentCalendarQuerySchema.parse(input);
  const serviceType = query.serviceType?.trim();

  return prisma.appointment.count({
    where: {
      scheduledStartAt: { lt: query.rangeEnd },
      scheduledEndAt: { gt: query.rangeStart },
      status: query.status,
      serviceType: serviceType
        ? { contains: serviceType, mode: "insensitive" }
        : undefined,
      customerId: query.customerId || undefined,
      companyId: query.companyId || undefined,
      vehicleId: query.vehicleId || undefined,
      workOrderId: query.workOrderId || undefined,
    },
  });
}

export async function getWorkshopScheduleSettings() {
  const settings = await prisma.workshopScheduleSettings.findFirst({
    orderBy: { createdAt: "asc" },
  });

  return settings ?? defaultWorkshopScheduleSettings;
}

export async function getCapacitySummary(
  input: AppointmentCalendarQueryInput,
): Promise<CapacitySummary[]> {
  const [appointments, settings] = await Promise.all([
    listAppointments(input),
    getWorkshopScheduleSettings(),
  ]);

  const activeAppointments = appointments.filter(
    (appointment) => !inactiveAppointmentStatuses.includes(appointment.status),
  );

  const summaries = new Map<
    string,
    { appointmentCount: number; vehicleIds: Set<string> }
  >();

  activeAppointments.forEach((appointment) => {
    const dateKey = formatDateKey(appointment.scheduledStartAt);
    const summary =
      summaries.get(dateKey) ?? { appointmentCount: 0, vehicleIds: new Set() };

    summary.appointmentCount += 1;
    summary.vehicleIds.add(appointment.vehicleId);
    summaries.set(dateKey, summary);
  });

  return Array.from(summaries.entries())
    .map(([dateKey, summary]) => ({
      dateKey,
      appointmentCount: summary.appointmentCount,
      vehicleCount: summary.vehicleIds.size,
      maxAppointmentsPerDay: settings.maxAppointmentsPerDay,
      maxVehiclesPerDay: settings.maxVehiclesPerDay,
      isOverAppointmentCapacity:
        summary.appointmentCount > settings.maxAppointmentsPerDay,
      isOverVehicleCapacity: summary.vehicleIds.size > settings.maxVehiclesPerDay,
    }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}
