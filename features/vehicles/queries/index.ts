import { prisma } from "../../../apps/web/lib/prisma";

import {
  vehicleIdSchema,
  vehicleListQuerySchema,
  type VehicleListQueryInput,
} from "../schemas";

const vehicleOwnerInclude = {
  customer: true,
  company: true,
} as const;

export async function getVehicleById(id: string) {
  const vehicleId = vehicleIdSchema.parse(id);

  return prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: vehicleOwnerInclude,
  });
}

export async function listVehicles(input?: VehicleListQueryInput) {
  const query = vehicleListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.vehicle.findMany({
    include: vehicleOwnerInclude,
    where: {
      customerId: query?.customerId || undefined,
      companyId: query?.companyId || undefined,
      OR: search
        ? [
            { plate: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { model: { contains: search, mode: "insensitive" } },
            { vin: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: [{ plate: "asc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countVehicles(input?: VehicleListQueryInput) {
  const query = vehicleListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.vehicle.count({
    where: {
      customerId: query?.customerId || undefined,
      companyId: query?.companyId || undefined,
      OR: search
        ? [
            { plate: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { model: { contains: search, mode: "insensitive" } },
            { vin: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
  });
}
