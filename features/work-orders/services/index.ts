import { WorkOrderStatus } from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import type {
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
