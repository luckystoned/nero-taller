import { randomBytes } from "crypto";

import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreatePublicVehicleHistoryInput,
  UpdatePublicVehicleHistoryStatusInput,
} from "../schemas";

function generatePublicToken() {
  return randomBytes(32).toString("base64url");
}

async function assertVehicleExists(vehicleId: string) {
  const vehicleExists = await prisma.vehicle.count({
    where: { id: vehicleId },
  });

  if (!vehicleExists) {
    throw new Error("El vehículo indicado no existe.");
  }
}

export async function createPublicVehicleHistory(
  input: CreatePublicVehicleHistoryInput,
) {
  await assertVehicleExists(input.vehicleId);

  return prisma.publicVehicleHistory.upsert({
    where: { vehicleId: input.vehicleId },
    update: {},
    create: {
      vehicleId: input.vehicleId,
      publicToken: generatePublicToken(),
      isEnabled: true,
    },
  });
}

export async function updatePublicVehicleHistoryStatus(
  input: UpdatePublicVehicleHistoryStatusInput,
) {
  return prisma.publicVehicleHistory.update({
    where: { id: input.id },
    data: {
      isEnabled: input.isEnabled,
    },
  });
}
