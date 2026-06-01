import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreateVehicleInput,
  DeleteVehicleInput,
  UpdateVehicleInput,
} from "../schemas";

type VehicleOwnerInput = {
  customerId?: string | null;
  companyId?: string | null;
};

function hasExactlyOneOwner(input: VehicleOwnerInput) {
  return Boolean(input.customerId) !== Boolean(input.companyId);
}

async function assertOwnerExists(input: VehicleOwnerInput) {
  if (!hasExactlyOneOwner(input)) {
    throw new Error("El vehículo debe pertenecer a un cliente o a una empresa.");
  }

  if (input.customerId) {
    const customerExists = await prisma.customer.count({
      where: { id: input.customerId },
    });

    if (!customerExists) {
      throw new Error("El cliente indicado no existe.");
    }
  }

  if (input.companyId) {
    const companyExists = await prisma.company.count({
      where: { id: input.companyId },
    });

    if (!companyExists) {
      throw new Error("La empresa indicada no existe.");
    }
  }
}

export async function createVehicle(input: CreateVehicleInput) {
  await assertOwnerExists(input);

  return prisma.vehicle.create({
    data: input,
  });
}

export async function updateVehicle(input: UpdateVehicleInput) {
  const { id, ...data } = input;
  const currentVehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!currentVehicle) {
    throw new Error("El vehículo indicado no existe.");
  }

  const owner = {
    customerId:
      Object.hasOwn(data, "customerId") ? data.customerId : currentVehicle.customerId,
    companyId:
      Object.hasOwn(data, "companyId") ? data.companyId : currentVehicle.companyId,
  };

  await assertOwnerExists(owner);

  return prisma.vehicle.update({
    where: { id },
    data,
  });
}

export async function deleteVehicle(input: DeleteVehicleInput) {
  return prisma.vehicle.delete({
    where: { id: input.id },
  });
}
