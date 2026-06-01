import { prisma } from "../../../apps/web/lib/prisma";

import {
  workOrderIdSchema,
  workOrderListQuerySchema,
  type WorkOrderListQueryInput,
} from "../schemas";

const workOrderInclude = {
  vehicle: {
    include: {
      customer: true,
      company: true,
    },
  },
  statusHistory: {
    orderBy: {
      createdAt: "asc",
    },
  },
} as const;

export async function getWorkOrderById(id: string) {
  const workOrderId = workOrderIdSchema.parse(id);

  return prisma.workOrder.findUnique({
    where: { id: workOrderId },
    include: workOrderInclude,
  });
}

export async function listWorkOrders(input?: WorkOrderListQueryInput) {
  const query = workOrderListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.workOrder.findMany({
    include: workOrderInclude,
    where: {
      vehicleId: query?.vehicleId,
      status: query?.status,
      OR: search
        ? [
            { intakeReason: { contains: search, mode: "insensitive" } },
            { symptoms: { contains: search, mode: "insensitive" } },
            { vehicle: { plate: { contains: search, mode: "insensitive" } } },
          ]
        : undefined,
    },
    orderBy: [{ createdAt: "desc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countWorkOrders(input?: WorkOrderListQueryInput) {
  const query = workOrderListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.workOrder.count({
    where: {
      vehicleId: query?.vehicleId,
      status: query?.status,
      OR: search
        ? [
            { intakeReason: { contains: search, mode: "insensitive" } },
            { symptoms: { contains: search, mode: "insensitive" } },
            { vehicle: { plate: { contains: search, mode: "insensitive" } } },
          ]
        : undefined,
    },
  });
}

export async function listWorkOrderStatusHistory(workOrderId: string) {
  const parsedWorkOrderId = workOrderIdSchema.parse(workOrderId);

  return prisma.workOrderStatusHistory.findMany({
    where: { workOrderId: parsedWorkOrderId },
    orderBy: [{ createdAt: "asc" }],
  });
}
