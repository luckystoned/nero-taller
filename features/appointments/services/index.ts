import {
  AppointmentPriority,
  AppointmentReminderStatus,
  AppointmentSource,
  AppointmentStatus,
  Prisma,
  WorkOrderStatus,
} from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CancelAppointmentInput,
  CreateAppointmentInput,
  CreateWorkOrderFromAppointmentInput,
  DeleteAppointmentInput,
  LinkWorkOrderToAppointmentInput,
  RescheduleAppointmentInput,
  UpdateAppointmentInput,
} from "../schemas";

const inactiveAppointmentStatuses: AppointmentStatus[] = [
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.NO_SHOW,
];

type AppointmentScheduleWindow = {
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  excludeAppointmentId?: string;
};

function calculateDurationMinutes(startAt: Date, endAt: Date) {
  return Math.max(1, Math.round((endAt.getTime() - startAt.getTime()) / 60000));
}

function toInputJsonValue(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  return value as Prisma.InputJsonValue;
}

async function getVehicleWithOwner(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      customer: true,
      company: true,
    },
  });

  if (!vehicle) {
    throw new Error("El vehículo indicado no existe.");
  }

  if (!vehicle.customerId && !vehicle.companyId) {
    throw new Error("El vehículo indicado no tiene propietario cargado.");
  }

  return vehicle;
}

async function assertOwnerMatchesVehicle(input: {
  vehicleId: string;
  customerId?: string | null;
  companyId?: string | null;
}) {
  const vehicle = await getVehicleWithOwner(input.vehicleId);

  if (input.customerId && input.customerId !== vehicle.customerId) {
    throw new Error("El cliente indicado no coincide con el propietario del vehículo.");
  }

  if (input.companyId && input.companyId !== vehicle.companyId) {
    throw new Error("La empresa indicada no coincide con el propietario del vehículo.");
  }

  return {
    customerId: vehicle.customerId,
    companyId: vehicle.companyId,
  };
}

async function assertWorkOrderMatchesVehicle(input: {
  workOrderId?: string | null;
  vehicleId: string;
}) {
  if (!input.workOrderId) {
    return;
  }

  const workOrder = await prisma.workOrder.findUnique({
    where: { id: input.workOrderId },
  });

  if (!workOrder) {
    throw new Error("La orden de trabajo indicada no existe.");
  }

  if (workOrder.vehicleId !== input.vehicleId) {
    throw new Error("La orden de trabajo no pertenece al vehículo del turno.");
  }
}

async function assertAppointmentExists(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) {
    throw new Error("El turno indicado no existe.");
  }

  return appointment;
}

async function findOverlappingAppointments(window: AppointmentScheduleWindow) {
  return prisma.appointment.findMany({
    where: {
      id: window.excludeAppointmentId
        ? { not: window.excludeAppointmentId }
        : undefined,
      status: { notIn: inactiveAppointmentStatuses },
      scheduledStartAt: { lt: window.scheduledEndAt },
      scheduledEndAt: { gt: window.scheduledStartAt },
    },
    select: { id: true },
  });
}

export async function getAppointmentConflicts(window: AppointmentScheduleWindow) {
  const overlappingAppointments = await findOverlappingAppointments(window);

  return {
    overlappingAppointmentIds: overlappingAppointments.map(
      (appointment) => appointment.id,
    ),
    hasOverlap: overlappingAppointments.length > 0,
  };
}

function buildAppointmentData(
  input: CreateAppointmentInput,
  owner: { customerId: string | null; companyId: string | null },
) {
  return {
    customerId: owner.customerId,
    companyId: owner.companyId,
    vehicleId: input.vehicleId,
    workOrderId: input.workOrderId,
    title: input.title,
    description: input.description,
    serviceType: input.serviceType,
    status: input.status ?? AppointmentStatus.REQUESTED,
    priority: input.priority ?? AppointmentPriority.NORMAL,
    scheduledStartAt: input.scheduledStartAt,
    scheduledEndAt: input.scheduledEndAt,
    estimatedDropoffAt: input.estimatedDropoffAt,
    estimatedPickupAt: input.estimatedPickupAt,
    estimatedDurationMinutes:
      input.estimatedDurationMinutes ??
      calculateDurationMinutes(input.scheduledStartAt, input.scheduledEndAt),
    internalNotes: input.internalNotes,
    cancellationReason: input.cancellationReason,
    createdBy: input.createdBy,
    source: input.source ?? AppointmentSource.MANUAL,
    assistantContext: toInputJsonValue(input.assistantContext),
    reminderStatus:
      input.reminderStatus ?? AppointmentReminderStatus.NOT_SCHEDULED,
    lastReminderAt: input.lastReminderAt,
    nextReminderAt: input.nextReminderAt,
  };
}

export async function createAppointment(input: CreateAppointmentInput) {
  const owner = await assertOwnerMatchesVehicle(input);
  await assertWorkOrderMatchesVehicle(input);

  return prisma.appointment.create({
    data: buildAppointmentData(input, owner),
  });
}

export async function updateAppointment(input: UpdateAppointmentInput) {
  const { id, ...data } = input;
  const currentAppointment = await assertAppointmentExists(id);
  const vehicleId = data.vehicleId ?? currentAppointment.vehicleId;

  const owner = await assertOwnerMatchesVehicle({
    vehicleId,
    customerId: data.customerId,
    companyId: data.companyId,
  });

  await assertWorkOrderMatchesVehicle({
    workOrderId:
      data.workOrderId === undefined
        ? currentAppointment.workOrderId
        : data.workOrderId,
    vehicleId,
  });

  const scheduledStartAt =
    data.scheduledStartAt ?? currentAppointment.scheduledStartAt;
  const scheduledEndAt = data.scheduledEndAt ?? currentAppointment.scheduledEndAt;

  return prisma.appointment.update({
    where: { id },
    data: {
      ...data,
      vehicleId,
      customerId: owner.customerId,
      companyId: owner.companyId,
      scheduledStartAt,
      scheduledEndAt,
      estimatedDurationMinutes:
        data.estimatedDurationMinutes ??
        calculateDurationMinutes(scheduledStartAt, scheduledEndAt),
      assistantContext: toInputJsonValue(data.assistantContext),
    },
  });
}

export async function cancelAppointment(input: CancelAppointmentInput) {
  await assertAppointmentExists(input.id);

  return prisma.appointment.update({
    where: { id: input.id },
    data: {
      status: AppointmentStatus.CANCELLED,
      cancellationReason: input.cancellationReason,
      reminderStatus: AppointmentReminderStatus.CANCELLED,
    },
  });
}

export async function deleteAppointment(input: DeleteAppointmentInput) {
  return prisma.appointment.delete({
    where: { id: input.id },
  });
}

export async function rescheduleAppointment(input: RescheduleAppointmentInput) {
  const appointment = await assertAppointmentExists(input.id);

  return prisma.appointment.update({
    where: { id: input.id },
    data: {
      scheduledStartAt: input.scheduledStartAt,
      scheduledEndAt: input.scheduledEndAt,
      estimatedDropoffAt: input.estimatedDropoffAt,
      estimatedPickupAt: input.estimatedPickupAt,
      estimatedDurationMinutes: calculateDurationMinutes(
        input.scheduledStartAt,
        input.scheduledEndAt,
      ),
      status:
        appointment.status === AppointmentStatus.CANCELLED
          ? AppointmentStatus.CONFIRMED
          : appointment.status,
      cancellationReason:
        appointment.status === AppointmentStatus.CANCELLED
          ? null
          : appointment.cancellationReason,
    },
  });
}

function getStatusForLinkedWorkOrder(currentStatus: AppointmentStatus) {
  if (inactiveAppointmentStatuses.includes(currentStatus)) {
    return currentStatus;
  }

  return AppointmentStatus.CHECKED_IN;
}

export async function createWorkOrderFromAppointment(
  input: CreateWorkOrderFromAppointmentInput,
) {
  return prisma.$transaction(async (transaction) => {
    const appointment = await transaction.appointment.findUnique({
      where: { id: input.id },
    });

    if (!appointment) {
      throw new Error("El turno indicado no existe.");
    }

    if (appointment.workOrderId) {
      throw new Error("El turno ya tiene una orden de trabajo asociada.");
    }

    if (inactiveAppointmentStatuses.includes(appointment.status)) {
      throw new Error(
        "No se puede crear una orden desde un turno cancelado, completado o no asistido.",
      );
    }

    const workOrder = await transaction.workOrder.create({
      data: {
        vehicleId: appointment.vehicleId,
        status: WorkOrderStatus.RECEIVED,
        intakeReason:
          input.intakeReason ??
          appointment.description ??
          appointment.title,
        symptoms: input.symptoms ?? appointment.description,
        mileage: input.mileage,
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: WorkOrderStatus.RECEIVED,
          },
        },
      },
    });

    const updatedAppointment = await transaction.appointment.update({
      where: { id: appointment.id },
      data: {
        workOrderId: workOrder.id,
        status: getStatusForLinkedWorkOrder(appointment.status),
      },
    });

    return { appointment: updatedAppointment, workOrder };
  });
}

export async function linkWorkOrderToAppointment(
  input: LinkWorkOrderToAppointmentInput,
) {
  return prisma.$transaction(async (transaction) => {
    const appointment = await transaction.appointment.findUnique({
      where: { id: input.id },
    });

    if (!appointment) {
      throw new Error("El turno indicado no existe.");
    }

    const workOrder = await transaction.workOrder.findUnique({
      where: { id: input.workOrderId },
    });

    if (!workOrder) {
      throw new Error("La orden de trabajo indicada no existe.");
    }

    if (workOrder.vehicleId !== appointment.vehicleId) {
      throw new Error("La orden de trabajo no pertenece al vehículo del turno.");
    }

    const updatedAppointment = await transaction.appointment.update({
      where: { id: appointment.id },
      data: {
        workOrderId: workOrder.id,
        status: getStatusForLinkedWorkOrder(appointment.status),
      },
    });

    return { appointment: updatedAppointment, workOrder };
  });
}
