import { prisma } from "../../../apps/web/lib/prisma";

import {
  publicVehicleHistoryIdSchema,
  publicVehicleHistoryListQuerySchema,
  publicVehicleHistoryTokenSchema,
  type PublicVehicleHistoryListQueryInput,
} from "../schemas";

const internalPublicHistoryInclude = {
  vehicle: {
    select: {
      plate: true,
      brand: true,
      model: true,
      year: true,
    },
  },
} as const;

const publicSafeHistoryInclude = {
  vehicle: {
    select: {
      plate: true,
      brand: true,
      model: true,
      year: true,
      workOrders: {
        select: {
          status: true,
          intakeReason: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  },
} as const;

export async function getPublicVehicleHistoryById(id: string) {
  const publicVehicleHistoryId = publicVehicleHistoryIdSchema.parse(id);

  return prisma.publicVehicleHistory.findUnique({
    where: { id: publicVehicleHistoryId },
    include: internalPublicHistoryInclude,
  });
}

export async function getPublicVehicleHistoryByVehicleId(vehicleId: string) {
  const query = publicVehicleHistoryListQuerySchema.parse({ vehicleId });

  return prisma.publicVehicleHistory.findUnique({
    where: { vehicleId: query?.vehicleId },
    include: internalPublicHistoryInclude,
  });
}

export async function listPublicVehicleHistories(
  input?: PublicVehicleHistoryListQueryInput,
) {
  const query = publicVehicleHistoryListQuerySchema.parse(input);

  return prisma.publicVehicleHistory.findMany({
    where: {
      vehicleId: query?.vehicleId,
      isEnabled: query?.isEnabled,
    },
    include: internalPublicHistoryInclude,
    orderBy: [{ createdAt: "desc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function getSafePublicVehicleHistoryByToken(publicToken: string) {
  const parsedToken = publicVehicleHistoryTokenSchema.parse(publicToken);

  const publicHistory = await prisma.publicVehicleHistory.findUnique({
    where: {
      publicToken: parsedToken,
    },
    include: publicSafeHistoryInclude,
  });

  if (!publicHistory) {
    return null;
  }

  const { vehicle } = publicHistory;
  const { workOrders, ...vehicleSummary } = vehicle;

  return {
    publicToken: publicHistory.publicToken,
    isEnabled: publicHistory.isEnabled,
    createdAt: publicHistory.createdAt,
    updatedAt: publicHistory.updatedAt,
    vehicle: vehicleSummary,
    workOrders,
  };
}
