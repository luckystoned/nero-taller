import {
  AppointmentStatus,
  WorkOrderStatus,
} from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import type {
  ChangeWorkOrderStatusInput,
  CreateWorkOrderInput,
  DeleteWorkOrderInput,
  UpdateWorkOrderInput,
} from "../schemas";

async function assertVehicleExists(vehicleId: string) {
  const vehicleExists = await prisma.vehicle.count({
    where: { id: vehicleId },
  });

  if (!vehicleExists) {
    throw new Error("El vehículo indicado no existe.");
  }
}

function getAppointmentStatusForWorkOrderStatus(status: WorkOrderStatus) {
  switch (status) {
    case WorkOrderStatus.IN_PROGRESS:
      return AppointmentStatus.IN_PROGRESS;
    case WorkOrderStatus.WAITING_PARTS:
      return AppointmentStatus.WAITING_PARTS;
    case WorkOrderStatus.READY_FOR_PICKUP:
      return AppointmentStatus.READY_FOR_PICKUP;
    case WorkOrderStatus.COMPLETED:
    case WorkOrderStatus.DELIVERED:
      return AppointmentStatus.COMPLETED;
    case WorkOrderStatus.CANCELLED:
      return AppointmentStatus.CANCELLED;
    default:
      return null;
  }
}

export async function createWorkOrder(input: CreateWorkOrderInput) {
  await assertVehicleExists(input.vehicleId);

  return prisma.workOrder.create({
    data: {
      vehicleId: input.vehicleId,
      status: WorkOrderStatus.RECEIVED,
      intakeReason: input.intakeReason,
      symptoms: input.symptoms,
      mileage: input.mileage,
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: WorkOrderStatus.RECEIVED,
        },
      },
    },
  });
}

export async function updateWorkOrder(input: UpdateWorkOrderInput) {
  const { id, ...data } = input;

  const currentWorkOrder = await prisma.workOrder.findUnique({
    where: { id },
  });

  if (!currentWorkOrder) {
    throw new Error("La orden de trabajo indicada no existe.");
  }

  if (data.vehicleId) {
    await assertVehicleExists(data.vehicleId);
  }

  return prisma.workOrder.update({
    where: { id },
    data,
  });
}

export async function deleteWorkOrder(input: DeleteWorkOrderInput) {
  return prisma.workOrder.delete({
    where: { id: input.id },
  });
}

export async function changeWorkOrderStatus(input: ChangeWorkOrderStatusInput) {
  return prisma.$transaction(async (transaction) => {
    const currentWorkOrder = await transaction.workOrder.findUnique({
      where: { id: input.id },
    });

    if (!currentWorkOrder) {
      throw new Error("La orden de trabajo indicada no existe.");
    }

    if (currentWorkOrder.status === input.status) {
      throw new Error("La orden de trabajo ya tiene ese estado.");
    }

    const updatedWorkOrder = await transaction.workOrder.update({
      where: { id: input.id },
      data: {
        status: input.status,
      },
    });

    await transaction.workOrderStatusHistory.create({
      data: {
        workOrderId: input.id,
        fromStatus: currentWorkOrder.status,
        toStatus: input.status,
      },
    });

    const appointmentStatus = getAppointmentStatusForWorkOrderStatus(
      input.status,
    );

    if (appointmentStatus) {
      await transaction.appointment.updateMany({
        where: {
          workOrderId: input.id,
          status: {
            notIn: [
              AppointmentStatus.CANCELLED,
              AppointmentStatus.COMPLETED,
              AppointmentStatus.NO_SHOW,
            ],
          },
        },
        data: {
          status: appointmentStatus,
          cancellationReason:
            appointmentStatus === AppointmentStatus.CANCELLED
              ? "Orden de trabajo cancelada."
              : undefined,
        },
      });
    }

    return updatedWorkOrder;
  });
}
